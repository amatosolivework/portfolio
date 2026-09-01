import type { Metadata } from "next";
import { promises as fs } from "fs";
import path from "path";
import Image from "next/image";
import { Reveal } from "@/components/motion/reveal";
import { VisionDemo } from "@/components/labs/vision-demo";

export const metadata: Metadata = {
  title: "The tag that never phones home",
  description:
    "A garment classifier that runs entirely in your browser: drop a photo, watch it label itself, and watch the network counter stay at zero. 85% top-1 on 59 real wardrobe photos — failures published.",
};

type Failure = { file: string; truth: string; predicted: string; score: number };

async function getData() {
  const read = async (f: string) =>
    JSON.parse(
      await fs.readFile(path.join(process.cwd(), "public", "data", "vision", f), "utf-8"),
    );
  const [metrics, vocab, manifest] = await Promise.all([
    read("metrics.json"),
    read("vocab.json"),
    read("manifest.json"),
  ]);
  return { metrics, vocab, manifest };
}

/** the English noun the model was actually asked about, from the frozen prompt */
function noun(vocab: { labels: { id: string; prompt: string }[] }, id: string): string {
  const l = vocab.labels.find((x) => x.id === id);
  return l ? l.prompt.replace(/^a photo of (a pair of |an? )?/, "") : id;
}

export default async function VisionPage() {
  const { metrics, vocab, manifest } = await getData();
  const off = metrics.runs[metrics.official];
  const top1 = Math.round(off.top1.rate * 100);
  const lo = Math.round(off.top1.wilson95.low * 100);
  const hi = Math.round(off.top1.wilson95.high * 100);
  const top3 = Math.round(off.top3.rate * 100);
  const n: number = metrics.n;
  const failures: Failure[] = off.failures;
  const hasThumb = new Set(
    (manifest.files as { file: string; hasThumb: boolean }[])
      .filter((f) => f.hasThumb)
      .map((f) => f.file),
  );

  const stats = [
    {
      n: `${top1}%`,
      label: `top-1 accuracy on ${n} raw wardrobe photos — real beds, real wrinkles, real light. The 95% interval is ${lo}–${hi}%, and every miss is published below`,
      hot: true,
    },
    {
      n: `${top3}%`,
      label:
        "top-3 accuracy: across the whole set, the right label never left the model's first three guesses. That's why the demo shows you three answers, not one",
    },
    {
      n: `${off.latencyMs.median} ms`,
      label: `median time to classify one photo in the browser, on plain CPU/WASM (p95: ${off.latencyMs.p95} ms). We measured WebGPU too: twice as slow for this int8 model — so the "fallback" won, and everyone gets the fast path`,
    },
  ];

  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-28 pt-32 md:px-10 md:pt-40">
      <div className="flex items-baseline justify-between border-t border-ink pt-4 font-mono text-eyebrow uppercase tracking-[0.14em] text-ink">
        <span>Labs · 03</span>
        <span className="text-ink-faint">On-device AI</span>
      </div>

      <h1
        className="mt-12 max-w-[16ch] font-semibold leading-[0.95] tracking-[-0.03em] text-ink"
        style={{ fontSize: "var(--text-display)", fontWeight: 800 }}
      >
        The tag that never phones home.
      </h1>

      <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-muted">
        Drop a photo of a garment and it labels itself — and the photo never
        leaves your machine, because the model runs inside your browser.
        Privacy not as a promise in a policy, but as architecture: there is no
        server to send anything to. The page proves it while you use it, with
        a live network counter that stays at zero. Measured honestly on {n}{" "}
        real wardrobe photos: {top1}% top-1, {top3}% top-3, misses included
        below.
      </p>

      {/* the demo: a care label you can use */}
      <section className="mt-16">
        <Reveal>
          <VisionDemo />
        </Reveal>
      </section>

      {/* the numbers, in the series' editorial voice */}
      <section className="mt-20 grid grid-cols-1 gap-10 md:grid-cols-3">
        {stats.map((s) => (
          <Reveal key={s.n}>
            <div className="border-t border-ink pt-5">
              <div
                className={`font-mono text-5xl font-bold tracking-tight ${
                  s.hot ? "text-brand" : "text-ink"
                }`}
              >
                {s.n}
              </div>
              <p className="mt-4 text-sm leading-relaxed text-ink-muted">{s.label}</p>
            </div>
          </Reveal>
        ))}
      </section>

      {/* where it fails — the honest table */}
      <section className="mt-24">
        <Reveal>
          <div className="flex flex-wrap items-baseline justify-between gap-2 border-t border-ink pt-4 font-mono text-eyebrow uppercase tracking-[0.14em] text-ink">
            <span>Where it fails</span>
            <span className="text-ink-faint">
              all {failures.length} misses of {n} · nothing hidden
            </span>
          </div>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-ink-muted">
            The misses tell one coherent story: long sleeves drift towards
            &ldquo;sweatshirt&rdquo;, knits blur into fleece, and trousers
            photographed folded read as shorts — the framing, not the garment.
            Every wrong answer below was still in the model&rsquo;s top 3.
          </p>
        </Reveal>
        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
          {failures.map((f) => (
            <Reveal key={f.file}>
              <div className="overflow-hidden rounded-md border border-ink/15 bg-[#f6f4ee]">
                {hasThumb.has(f.file) && (
                  <div className="relative aspect-[3/4] w-full bg-ink/5">
                    <Image
                      src={`/data/vision/thumbs/${f.file.replace(/\.[a-z]+$/i, ".jpg")}`}
                      alt={`photo labelled ${noun(vocab, f.truth)}, misread as ${noun(vocab, f.predicted)}`}
                      fill
                      sizes="(min-width: 1024px) 20vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-3 font-mono text-[11px] leading-relaxed">
                  <div className="text-ink">{noun(vocab, f.truth)}</div>
                  <div className="text-brand">
                    → &ldquo;{noun(vocab, f.predicted)}&rdquo;{" "}
                    {(f.score * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* what this is — and isn't */}
      <section className="mt-24 max-w-2xl">
        <Reveal>
          <div className="border-t border-ink pt-4 font-mono text-eyebrow uppercase tracking-[0.14em] text-ink">
            What this is — and isn&rsquo;t
          </div>
          <ul className="mt-6 space-y-4 text-base leading-relaxed text-ink-muted">
            <li>
              <strong className="font-semibold text-ink">Zero-shot, not trained on my wardrobe.</strong>{" "}
              fashionSigLIP compares your photo against 19 frozen text prompts
              (published in the repo). Change a prompt and the numbers change —
              which is why they&rsquo;re version-locked before measuring.
            </li>
            <li>
              <strong className="font-semibold text-ink">A small, declared test set.</strong> {n} photos,
              16 of 19 classes covered; coats, dresses and vests had no photos
              — those cells of the table are honestly empty. Ten photos came
              from other people&rsquo;s wardrobes and count in the metric, but
              only my own photos are shown on this page.
            </li>
            <li>
              <strong className="font-semibold text-ink">Quantized maths differ per backend.</strong> The
              same int8 model disagrees with itself on 5 of {n} photos between
              Node and the browser — so the published number is measured in the
              browser, the same runtime you just used.
            </li>
            <li>
              <strong className="font-semibold text-ink">The web sibling of WRDB.</strong> This is the
              browser counterpart of the on-device recognition I build into
              WRDB with Core ML — same conviction, different runtime: clothes
              are personal; their photos should stay yours.
            </li>
          </ul>
        </Reveal>
      </section>
    </div>
  );
}
