import type { Metadata } from "next";
import { promises as fs } from "fs";
import path from "path";
import { Reveal } from "@/components/motion/reveal";
import { BicingMap, type Station } from "@/components/labs/bicing-map";
import { BicingPredictor } from "@/components/labs/bicing-predictor";

export const metadata: Metadata = {
  title: "The tide you can ride",
  description:
    "A year of Barcelona's Bicing, snapshot by snapshot: the daily tide of bikes draining downhill every morning, the trucks that push them back, and an honest 'will there be a bike?' predictor.",
};

async function getData() {
  const dir = path.join(process.cwd(), "public", "data", "bicing");
  const [meta, stations] = await Promise.all([
    fs.readFile(path.join(dir, "meta.json"), "utf-8").then(JSON.parse),
    fs.readFile(path.join(dir, "estaciones.json"), "utf-8").then(JSON.parse),
  ]);
  return { meta, stations: stations as Station[] };
}

export default async function BicingPage() {
  const { meta, stations } = await getData();
  const bt = meta.backtest;
  const precJul = Math.round(bt.julio.avisos.precision * 100);

  const stats = [
    {
      n: meta.residuo_diario_medio.toLocaleString("en-US"),
      label:
        "bikes a day appear or vanish outside normal trips — the signature of the rebalancing trucks, loudest at 1 AM and again right before the morning rush",
      hot: true,
    },
    {
      n: `${meta.marea.barrio_max_gana_8h.puntos > 0 ? "+" : ""}${meta.marea.barrio_max_gana_8h.puntos} pts`,
      label: `${meta.marea.barrio_max_gana_8h.barrio} fills up at 8 AM while ${meta.marea.barrio_max_pierde_8h.barrio} drains by ${Math.abs(meta.marea.barrio_max_pierde_8h.puntos)} — the tide, measured neighbourhood by neighbourhood`,
    },
    {
      n: `${precJul}%`,
      label: `of the times the predictor warned "no bike here", it was right — six times the base rate. A "predictor" that always says yes is right 89% of the time and useful never`,
    },
  ];

  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-28 pt-32 md:px-10 md:pt-40">
      <div className="flex items-baseline justify-between border-t border-ink pt-4 font-mono text-eyebrow uppercase tracking-[0.14em] text-ink">
        <span>Labs · 02</span>
        <span className="text-ink-faint">Urban data</span>
      </div>

      <h1
        className="mt-12 max-w-[16ch] font-semibold leading-[0.95] tracking-[-0.03em] text-ink"
        style={{ fontSize: "var(--text-display)", fontWeight: 800 }}
      >
        The tide you can ride.
      </h1>

      <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-muted">
        Every workday morning, Barcelona&rsquo;s shared bikes pour out of the
        residential belt — Gr&agrave;cia, Sagrada Fam&iacute;lia, Sants — and
        pile up along the waterfront and the 22@ tech district. Every evening
        they climb back. I measured that tide from a year of open data:{" "}
        {meta.n_estaciones} stations photographed every five minutes,
        September&nbsp;2024 to August&nbsp;2025.
      </p>

      {/* the console: the breathing map and the question everyone asks */}
      <section className="mt-16">
        <Reveal>
          <div className="rounded-2xl bg-[#17130E] p-5 md:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[#F4EDE3]/50">
              <span>Station network · Barcelona</span>
              <span>{meta.n_estaciones} stations · 5-min snapshots · 1 year</span>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-6 md:grid-cols-[1fr_minmax(420px,540px)]">
              <div className="md:order-2">
                <BicingMap stations={stations} />
              </div>
              <div className="md:order-1 md:self-center">
                <p className="max-w-md text-sm leading-relaxed text-[#F4EDE3]/45">
                  Each dot is a station, sized by capacity. Colour is the
                  deviation from that station&rsquo;s own daily average — blue
                  where bikes have left, amber where they gather. Stations
                  near their normal fade out: only the tide is drawn.
                </p>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-[#F4EDE3]/45">
                  Drag the hour, or press play and watch a whole day breathe:
                  at eight the residential belt turns blue as the bikes pour
                  downhill; through the evening the amber drains back up.
                </p>
              </div>
            </div>

            <div className="mt-10 h-px w-full bg-white/10" />

            {/* the predictor */}
            <div className="mt-8">
              <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2 font-mono text-[11px] uppercase tracking-[0.12em]">
                <span className="text-[#F4EDE3]">
                  Will there be a bike?
                </span>
                <span className="text-[#F4EDE3]/50">
                  ask a year of data
                </span>
              </div>
              <BicingPredictor stations={stations} backtest={bt} />
            </div>
          </div>
        </Reveal>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ink-faint">
          The city&rsquo;s total parked fleet barely moves —{" "}
          {meta.flota_media_aparcada.toLocaleString("en-US")} bikes on average
          — but its geography swings twice a day. August is the exception: the
          city empties, the bikes rest, and the tide almost disappears.
        </p>
      </section>

      {/* the numbers */}
      <section className="mt-24">
        <Reveal>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {stats.map(({ n, label, hot }) => (
              <div key={label} className="border-t border-ink pt-5">
                <div
                  className={`font-semibold leading-none tracking-[-0.03em] ${
                    hot ? "text-brand" : "text-ink"
                  }`}
                  style={{ fontSize: "clamp(2.75rem, 2rem + 2.4vw, 4.25rem)" }}
                >
                  {n}
                </div>
                <p className="mt-4 max-w-[34ch] text-sm leading-relaxed text-ink-muted">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* the work */}
      <section className="mt-24">
        <Reveal>
          <div className="flex items-baseline justify-between border-t border-ink pt-4 font-mono text-eyebrow uppercase tracking-[0.14em] text-ink">
            <span>The work</span>
            <span className="text-ink-faint">5 scripts · Python</span>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-5">
            {[
              {
                n: "01",
                name: "Fetch",
                body: "Twelve monthly archives from Open Data BCN — the most recent run of twelve consecutive months the portal actually has (two later months were never published).",
                metric: "280 MB · 54M snapshots",
              },
              {
                n: "02",
                name: "Aggregate",
                body: "Snapshots become station-hours, month by month, never all in memory. Occupancy bounded by capacity; every coverage gap is measured and listed, never silently filled.",
                metric: "4.5M station-hours",
              },
              {
                n: "03",
                name: "Flow",
                body: "Net hourly deltas classify stations as morning sources or sinks. The bikes that appear from nowhere are the rebalancing trucks — measured as a finding, not discarded as noise.",
                metric: "287 sources · 190 sinks",
              },
              {
                n: "04",
                name: "Predict",
                body: "P(bike) per station, hour and day type — a frequency table, deliberately. Backtested on two held-out months, against the trivial yes-machine and the hourly oracle ceiling.",
                metric: "Brier 20% better than trivial",
              },
              {
                n: "05",
                name: "Publish",
                body: "Everything the page shows is two static JSON files exported by the pipeline — every number on this page was computed, none was typed.",
                metric: "0.36 MB · no backend",
              },
            ].map((step) => (
              <div key={step.n}>
                <div className="font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-faint">
                  {step.n}
                </div>
                <div className="mt-2 font-semibold tracking-tight text-ink">
                  {step.name}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {step.body}
                </p>
                <div className="mt-3 font-mono text-[11px] tracking-[0.1em] text-brand">
                  {step.metric}
                </div>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* honesty */}
      <section className="mt-24 max-w-2xl">
        <Reveal>
          <div className="border-t border-ink pt-4 font-mono text-eyebrow uppercase tracking-[0.14em] text-ink">
            What this is — and isn&rsquo;t
          </div>
          <div className="mt-6 space-y-4 text-ink-muted">
            <p>
              This is a personal study on open data, and the data ends in
              August&nbsp;2025 — the latest unbroken 12-month stretch the city
              has published ({meta.huecos.horas_sin_datos} of{" "}
              {meta.huecos.total_horas.toLocaleString("en-US")} hours missing
              inside it, all listed in the repo). The predictor is a historical
              average: it knows nothing about rain, strikes, festivals or a
              broken dock, and having never seen an August, it limps through
              one — that failure is measured and published, not hidden.
            </p>
            <p>
              The headline accuracy trap is the study&rsquo;s favourite
              lesson: a fake predictor that always answers &ldquo;there will
              be a bike&rdquo; scores 89&ndash;92%, because bikes are usually
              there. Real value lives elsewhere — in the warnings, the
              calibration, and the distance to the oracle ceiling. Wrong
              numbers look normal; that&rsquo;s why every script in this
              pipeline validates its invariants and aborts loudly.
            </p>
            <p className="pt-2 font-mono text-sm">
              <a
                href="https://github.com/amatosolivework/bicing-flows"
                className="text-brand underline-offset-4 hover:underline"
              >
                Code on GitHub
              </a>
              <span className="mx-3 text-ink-faint">·</span>
              <a
                href="/labs/incendio"
                className="text-brand underline-offset-4 hover:underline"
              >
                Labs · 01 — the fire you can&rsquo;t unsee
              </a>
            </p>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
