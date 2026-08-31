import type { Metadata } from "next";
import { promises as fs } from "fs";
import path from "path";
import { Reveal } from "@/components/motion/reveal";
import { Comparator } from "@/components/labs/comparator";
import { FireMap } from "@/components/labs/fire-map";

export const metadata: Metadata = {
  title: "The fire you can't unsee",
  description:
    "The La Mierla wildfire (Guadalajara, 2026) through Landsat's thermal eye: land surface temperature, 17-sigma anomalies and burn severity, from open data.",
};

const BASE = "/data/incendio";

/** The real chronology, press-verified. Order is the information. */
const TIMELINE = [
  { date: "16 Jul", label: "detected 13:55" },
  { date: "21 Jul", label: "pass · day 5" },
  { date: "29 Jul", label: "pass · day 13" },
  { date: "30 Jul", label: "pass · day 15" },
  { date: "3 Aug", label: "controlled", hot: true },
  { date: "7 Aug", label: "scar pass" },
];

async function getMeta() {
  const raw = await fs.readFile(
    path.join(process.cwd(), "public", "data", "incendio", "meta.json"),
    "utf-8",
  );
  return JSON.parse(raw);
}

export default async function IncendioPage() {
  const meta = await getMeta();
  const s = meta.stats;
  const detected: number = s.detected.burned_ha_dnbr;
  const official: number = s.fire.official_burned_ha;
  const zMax = Math.max(
    ...Object.values(
      s.detected.by_scene as Record<string, { z_max: number }>,
    ).map((v) => v.z_max),
  );

  const comparatorDate = new Date(meta.comparator.date).toLocaleDateString(
    "en-GB",
    { day: "numeric", month: "short", year: "numeric" },
  );

  const stats = [
    {
      n: `${zMax.toFixed(0)}σ`,
      label: "hottest pixel against its own June–July baseline",
      hot: true,
    },
    {
      n: `${detected.toLocaleString("en-US")} ha`,
      label: `burned at moderate severity or above — official figure: ${official.toLocaleString("en-US")} ha`,
    },
    {
      n: "~60 °C",
      label: "scar temperature four days after the fire was declared controlled",
    },
  ];

  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-28 pt-32 md:px-10 md:pt-40">
      <div className="flex items-baseline justify-between border-t border-ink pt-4 font-mono text-eyebrow uppercase tracking-[0.14em] text-ink">
        <span>Labs · 01</span>
        <span className="text-ink-faint">Earth observation</span>
      </div>

      <h1
        className="mt-12 max-w-[16ch] font-semibold leading-[0.95] tracking-[-0.03em] text-ink"
        style={{ fontSize: "var(--text-display)", fontWeight: 800 }}
      >
        The fire you can&rsquo;t unsee.
      </h1>

      <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-muted">
        In July 2026 the La Mierla wildfire burned through ~35,000 hectares of
        the Sierra Norte de Guadalajara — the largest Spanish fire of the year.
        I rebuilt its story from open Landsat 8/9 data: in optical imagery the
        fire is a subtle dark stain you could mistake for terrain shadow. In
        thermal, it is unmissable.
      </p>

      {/* mission chronology — the dates every figure below hangs on */}
      <Reveal>
        <div className="mt-16 overflow-x-auto">
          <div className="flex min-w-[640px] items-start">
            {TIMELINE.map((ev, i) => (
              <div key={ev.date} className="flex flex-1 items-start last:flex-none">
                <div className="shrink-0">
                  <div className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.12em] text-ink">
                    {ev.hot && (
                      <i className="inline-block h-1.5 w-1.5 rounded-full bg-brand" />
                    )}
                    {ev.date}
                  </div>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-faint">
                    {ev.label}
                  </div>
                </div>
                {i < TIMELINE.length - 1 && (
                  <div className="mx-4 mt-2 h-px flex-1 bg-hairline" />
                )}
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* the console: every instrument lives inside one dark panel */}
      <section className="mt-16">
        <Reveal>
          <div className="rounded-2xl bg-[#17130E] p-5 md:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[#F4EDE3]/50">
              <span>Ground segment · La Mierla fire</span>
              <span>Landsat 8/9 · 100 m thermal · 30 m grid</span>
            </div>

            {/* comparator */}
            <div className="mx-auto mt-8 max-w-[760px]">
              <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2 font-mono text-[11px] uppercase tracking-[0.12em]">
                <span className="text-[#F4EDE3]">
                  {comparatorDate} — fire day {meta.comparator.fire_day}
                </span>
                <span className="text-[#F4EDE3]/50">drag to compare</span>
              </div>
              <Comparator
                optical={`${BASE}/comparator_rgb.png`}
                thermal={`${BASE}/comparator_lst.png`}
                alt={`La Mierla fire, ${comparatorDate}`}
              />
              <div className="mt-2.5 font-mono text-[10px] uppercase tracking-[0.1em] text-[#F4EDE3]/40">
                scene {meta.comparator.scene} · same instant, two bands
              </div>
            </div>

            <div className="mt-10 h-px w-full bg-white/10" />

            {/* map */}
            <div className="mt-8">
              <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2 font-mono text-[11px] uppercase tracking-[0.12em]">
                <span className="text-[#F4EDE3]">Before · during · after</span>
                <span className="text-[#F4EDE3]/50">hover for °C · ⌘+scroll to zoom</span>
              </div>
              <FireMap meta={meta} base={BASE} />
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-[#F4EDE3]/45">
                Only thermally anomalous terrain is drawn — each pixel fades in
                as it moves beyond 2σ from its own June–July baseline. Before
                the fire, the map is quiet on purpose.
              </p>
            </div>
          </div>
        </Reveal>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ink-faint">
          Same satellite, same instant. In the comparator, the left half is
          surface reflectance — what a camera sees; the right half is land
          surface temperature from the thermal infrared band, where the burn
          area radiates at over 60&nbsp;°C while the surrounding terrain sits
          20 degrees cooler.
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
                <p className="mt-4 max-w-[30ch] text-sm leading-relaxed text-ink-muted">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>
      </section>

      {/* the work: the pipeline behind the pictures */}
      <section className="mt-24">
        <Reveal>
          <div className="flex items-baseline justify-between border-t border-ink pt-4 font-mono text-eyebrow uppercase tracking-[0.14em] text-ink">
            <span>The work</span>
            <span className="text-ink-faint">4 scripts · Python</span>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-4">
            {[
              {
                n: "01",
                name: "Search",
                body: "STAC query against Microsoft Planetary Computer. Twelve Landsat scenes chosen by role: seven for the thermal baseline, one before the fire, three during, one after.",
                metric: "12 scenes · 4 roles",
              },
              {
                n: "02",
                name: "Fetch",
                body: "Only the study area is read from each remote cloud-optimized GeoTIFF, via HTTP range requests — no full-scene downloads.",
                metric: "41 MB instead of ~5 GB",
              },
              {
                n: "03",
                name: "Measure",
                body: "Sensor counts become °C on one common 30 m grid; clouds are masked with the QA band, and every scene is checked against physical bounds before it moves on.",
                metric: "invariants on every step",
              },
              {
                n: "04",
                name: "Detect",
                body: "Per-pixel z-scores against each pixel's own June–July statistics, plus dNBR burn severity with water masked out of the equation.",
                metric: "17σ · 20,530 ha",
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
          <p className="mt-10 max-w-2xl text-sm leading-relaxed text-ink-muted">
            Those checks failed twice along the way, and both failures were
            real bugs: a study area six times smaller than the fire, and
            reservoirs classified as high-severity burn.{" "}
            <a
              href="/blog/watching-a-wildfire-in-thermal"
              className="text-brand underline-offset-4 hover:underline"
            >
              The write-up tells that story
            </a>
            .
          </p>
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
              This is a personal learning project built on open data. Landsat’s
              thermal band is 100&nbsp;m resolution with a days-long revisit;
              commercial thermal constellations operate at another level
              entirely. The gap between my detected area and the official
              figure ({detected.toLocaleString("en-US")} vs{" "}
              {official.toLocaleString("en-US")} ha) is itself informative:
              official figures count the full perimeter, while dNBR ≥ 0.27
              excludes low-severity ground and unburned islands.
            </p>
            <p>
              Pipeline: STAC search on Microsoft Planetary Computer → windowed
              reads from cloud-optimized GeoTIFFs → land surface temperature →
              per-pixel z-scores against a June–July baseline → dNBR burn
              severity. Every step validates physical invariants and aborts
              loudly when one fails — in thermal remote sensing, a wrong number
              usually looks perfectly fine.
            </p>
            <p className="pt-2 font-mono text-sm">
              <a
                href="https://github.com/amatosolivework/landsat-thermal-fire"
                className="text-brand underline-offset-4 hover:underline"
              >
                Code on GitHub
              </a>
              <span className="mx-3 text-ink-faint">·</span>
              <a
                href="/blog/watching-a-wildfire-in-thermal"
                className="text-brand underline-offset-4 hover:underline"
              >
                Read the write-up
              </a>
              <span className="mx-3 text-ink-faint">·</span>
              <a
                href="/labs/bicing"
                className="text-brand underline-offset-4 hover:underline"
              >
                Labs · 02 — the tide you can ride
              </a>
            </p>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
