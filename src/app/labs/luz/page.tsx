import type { Metadata } from "next";
import { promises as fs } from "fs";
import path from "path";
import { Reveal } from "@/components/motion/reveal";
import { LuzConsole, type LuzDay } from "@/components/labs/luz-console";
import { LuzCompetition } from "@/components/labs/luz-competition";

export const metadata: Metadata = {
  title: "The washing-machine hour",
  description:
    "Two years of Spain's hourly electricity tariff (PVPC): the solar valley that flipped the cheap hours to midday, and a rule that fits on a post-it backtested against perfect information — failures included.",
};

async function getData() {
  const raw = await fs.readFile(
    path.join(process.cwd(), "public", "data", "luz", "luz.json"),
    "utf-8",
  );
  return JSON.parse(raw);
}

export default async function LuzPage() {
  const data = await getData();
  const testStart: string = data.meta.train[1];

  /** the console shows the backtest year — every tappable day has a verdict */
  const days: LuzDay[] = Object.keys(data.precios)
    .filter((d) => d > testStart)
    .sort()
    .map((date) => {
      const pick = data.elecciones[date];
      return {
        date,
        prices: data.precios[date],
        tipo: data.tipos[date],
        ...(pick
          ? { pick: { rule: pick.estrella, best: pick.optimo } }
          : {}),
      };
    });

  const rule = data.resumen["media-hora-tipo"];
  const random = data.resumen["cualquier-hora"];
  const janRegret = Math.max(
    ...(Object.values(data.estrella_regret_por_mes) as number[]),
  );
  const worstDay: string = data.estrella_top10_peores_dias[0].fecha;

  const stats = [
    {
      n: `${rule.euros_extra_anyo.toFixed(2)} €`,
      label: `what a year of daily two-hour washes costs above perfect information if you follow the fixed table and never look at a tariff again — ${rule.regret_pct.toFixed(1)}% of regret`,
      hot: true,
    },
    {
      n: `+${janRegret.toFixed(0)}%`,
      label:
        "the rule's regret in January alone. When the sun hides, cheap hours drift back to pre-dawn while the rule keeps aiming at midday — winter is where it fails, and we say so",
    },
    {
      n: `${random.euros_extra_anyo.toFixed(2)} €`,
      label:
        "the worst you can possibly do: plugging in at a random hour every day for a year. The absolute stakes are tiny — that honesty is the point of the exercise",
    },
  ];

  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-28 pt-32 md:px-10 md:pt-40">
      <div className="flex items-baseline justify-between border-t border-ink pt-4 font-mono text-eyebrow uppercase tracking-[0.14em] text-ink">
        <span>Labs · 04</span>
        <span className="text-ink-faint">Energy data</span>
      </div>

      <h1
        className="mt-12 max-w-[16ch] font-semibold leading-[0.95] tracking-[-0.03em] text-ink"
        style={{ fontSize: "var(--text-display)", fontWeight: 800 }}
      >
        Cheap electricity runs on a schedule.
      </h1>

      <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-muted">
        Spain&rsquo;s regulated tariff re-prices every hour, and solar has
        turned the old advice upside down: the cheap hours are no longer at
        night — they are at lunchtime. I took two years of official prices and
        asked one domestic question: if you ran the washing machine by a fixed
        rule that fits on a post-it, how much would you lose against checking
        the tariff every single day? Answer:{" "}
        {rule.euros_extra_anyo.toFixed(2)} € a year — except in winter, and
        the when-it-fails is published right here next to the wins.
      </p>

      {/* the console: a year of prices as a playable instrument */}
      <section className="mt-16">
        <Reveal>
          <div className="rounded-2xl bg-[#17130E] p-5 md:p-8">
            <div className="flex flex-wrap items-baseline justify-between gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[#F4EDE3]/50">
              <span>PVPC hourly · backtest year</span>
              <span>
                {days.length} days · Sep 2025 → Aug 2026 · dark = cheap
              </span>
            </div>

            <div className="mt-8">
              <LuzConsole days={days} defaultDate={worstDay} />
            </div>

            <div className="mt-10 h-px w-full bg-white/10" />

            {/* the competition */}
            <div className="mt-8">
              <div className="mb-6 flex flex-wrap items-baseline justify-between gap-2 font-mono text-[11px] uppercase tracking-[0.14em]">
                <span className="text-[#F4EDE3]">
                  Six ways to pick a window · one honest scoreboard
                </span>
                <span className="text-[#F4EDE3]/50">
                  extra cost vs. perfect information
                </span>
              </div>
              <LuzCompetition
                resumen={data.resumen}
                mensual={data.estrella_regret_por_mes}
              />
            </div>
          </div>
        </Reveal>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ink-faint">
          Every column above is a real day; it opens on the rule&rsquo;s worst
          one. Each contender picks tomorrow&rsquo;s two-hour window seeing
          only data up to yesterday — the backtest engine verifies that
          nothing leaks from the future, and a deliberately cheating rule
          exists in the test suite to prove the check bites.
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
            <span className="text-ink-faint">4 scripts · Python</span>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-4">
            {[
              {
                n: "01",
                name: "Download",
                body: "Two years of hourly PVPC from Red Eléctrica's open API, month by month, no token required. Idempotent: a second run touches nothing.",
                metric: "24 requests · 17,448 hours",
              },
              {
                n: "02",
                name: "Assemble",
                body: "One row per hour, validated against reality before anything else runs: no silent gaps, the 23- and 25-hour clock-change days accounted for by name, prices inside physical bounds.",
                metric: "invariants abort loudly",
              },
              {
                n: "03",
                name: "Backtest",
                body: "Five rules and two anchors pick tomorrow's window seeing only the past. The engine hands each rule a view object that physically cannot contain the future.",
                metric: "leak-proof by construction",
              },
              {
                n: "04",
                name: "Export",
                body: "Everything this page shows — 727 days of prices, every verdict, every failure — is one static JSON file. No backend, no live API, nothing to break.",
                metric: "159 KB · cutoff Aug 28, 2026",
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
              This is a personal learning project built on open data, frozen
              at a stated cutoff — the page does not query anything live.
              Tomorrow&rsquo;s PVPC is published every evening around 20:15,
              so no forecasting is being pretended here: the interesting
              question is how far a fixed rule gets{" "}
              <em>without looking at all</em>, and the answer is &ldquo;within{" "}
              {rule.euros_extra_anyo.toFixed(2)} €/year, except in
              winter&rdquo;.
            </p>
            <p>
              Honest fine print: PVPC is the regulated tariff — free-market
              contracts price differently. The rule knows the calendar but not
              the weather. National holidays only. The PVPC formula itself has
              been phasing in futures since 2024, which shifts the ground
              under any long backtest. And a small ridge regression{" "}
              <em>does</em>{" "}beat the post-it rule (6.4% vs 10.2% regret) —
              the tidy story would hide that; this one doesn&rsquo;t. Prices
              never went negative in these two years: grid fees put a floor
              under the wholesale market&rsquo;s wildest days.
            </p>
            <p className="pt-2 font-mono text-sm">
              <span className="text-ink-faint">
                Code repository and write-up coming with the publication pass
              </span>
              <span className="mx-3 text-ink-faint">·</span>
              <a
                href="/labs/incendio"
                className="text-brand underline-offset-4 hover:underline"
              >
                Labs · 01
              </a>
              <span className="mx-3 text-ink-faint">·</span>
              <a
                href="/labs/bicing"
                className="text-brand underline-offset-4 hover:underline"
              >
                Labs · 02
              </a>
            </p>
          </div>
        </Reveal>
      </section>
    </div>
  );
}
