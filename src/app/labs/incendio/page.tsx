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
      label: "hottest pixel vs its own June–July baseline",
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

      {/* comparator */}
      <section className="mt-20">
        <Reveal>
          <div className="mx-auto max-w-[880px]">
            <div className="mb-4 flex items-baseline justify-between font-mono text-eyebrow uppercase tracking-[0.14em]">
              <span className="text-ink">
                {comparatorDate} — fire day {meta.comparator.fire_day}
              </span>
              <span className="text-ink-faint">drag to compare</span>
            </div>
            <Comparator
              optical={`${BASE}/comparator_rgb.png`}
              thermal={`${BASE}/comparator_lst.png`}
              alt={`La Mierla fire, ${comparatorDate}`}
            />
            <p className="mt-3 text-sm leading-relaxed text-ink-faint">
              Same satellite, same instant. Left: surface reflectance (what a
              camera sees). Right: land surface temperature from the thermal
              infrared band — the burn area radiates at over 60&nbsp;°C while
              the surrounding terrain sits 20 degrees cooler.
            </p>
          </div>
        </Reveal>
      </section>

      {/* map */}
      <section className="mt-24">
        <Reveal>
          <div className="mb-4 flex items-baseline justify-between font-mono text-eyebrow uppercase tracking-[0.14em]">
            <span className="text-ink">Before · during · after</span>
            <span className="text-ink-faint">hover for °C</span>
          </div>
          <FireMap meta={meta} base={BASE} />
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-faint">
            Only thermally anomalous terrain is drawn — each pixel fades in as
            it moves beyond 2σ from its own June–July baseline. Before the
            fire, the map is quiet on purpose.
          </p>
        </Reveal>
      </section>

      {/* numbers */}
      <section className="mt-24">
        <Reveal>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-hairline bg-hairline md:grid-cols-3">
            {stats.map(({ n, label }) => (
              <div key={label} className="bg-surface p-8">
                <div
                  className="font-semibold tracking-[-0.02em] text-ink"
                  style={{ fontSize: "var(--text-3xl, 2.25rem)" }}
                >
                  {n}
                </div>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">
                  {label}
                </p>
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
          </div>
        </Reveal>
      </section>
    </div>
  );
}
