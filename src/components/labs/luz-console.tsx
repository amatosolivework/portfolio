"use client";

import { useMemo, useState } from "react";

export type LuzDay = {
  date: string;
  prices: (number | null)[];
  tipo: string;
  /** window start hours (2h windows); absent on the DST day excluded from the backtest */
  pick?: { rule: number; best: number };
};

const PAPER = "#F4EDE3";
const AMBER = "#FF7A2F";
const WINDOW_H = 2;

/* magma, 9 stops — same ramp as the repo figures */
const MAGMA = [
  [0, 0, 4], [20, 14, 54], [59, 15, 112], [100, 26, 128], [140, 41, 129],
  [183, 55, 121], [222, 73, 104], [247, 112, 92], [252, 253, 191],
];

function magma(t: number): string {
  const x = Math.min(1, Math.max(0, t)) * (MAGMA.length - 1);
  const i = Math.min(MAGMA.length - 2, Math.floor(x));
  const f = x - i;
  const c = MAGMA[i].map((v, k) => Math.round(v + f * (MAGMA[i + 1][k] - v)));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function fmtDate(iso: string): string {
  const d = new Date(`${iso}T12:00:00`);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

const TIPO_LABEL: Record<string, string> = {
  laborable: "weekday",
  sabado: "Saturday",
  "domingo-festivo": "Sunday / holiday",
};

/** avg €/MWh over a 2h window → c€/kWh with one decimal */
function windowCents(prices: (number | null)[], start: number): number {
  const vals = prices.slice(start, start + WINDOW_H).filter(
    (v): v is number => v !== null,
  );
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  return Math.round((avg / 10) * 10) / 10;
}

/* ------------------------------------------------------------------ */

export function LuzConsole({ days, defaultDate }: {
  days: LuzDay[];
  defaultDate: string;
}) {
  const defIdx = Math.max(0, days.findIndex((d) => d.date === defaultDate));
  const [sel, setSel] = useState(defIdx);

  const { lo, hi } = useMemo(() => {
    const all = days.flatMap((d) => d.prices).filter(
      (v): v is number => v !== null,
    ).sort((a, b) => a - b);
    return {
      lo: all[Math.floor(all.length * 0.02)],
      hi: all[Math.floor(all.length * 0.98)],
    };
  }, [days]);

  return (
    <div>
      <Heatmap days={days} sel={sel} onSel={setSel} lo={lo} hi={hi} />
      <div className="mt-8 h-px w-full bg-white/10" />
      <DayDetail day={days[sel]} />
    </div>
  );
}

/* ------------------------------------------------------------------ */

function Heatmap({ days, sel, onSel, lo, hi }: {
  days: LuzDay[];
  sel: number;
  onSel: (i: number) => void;
  lo: number;
  hi: number;
}) {
  const CW = 3;
  const CH = 13;
  const L = 34;
  const T = 6;
  const w = L + days.length * CW + 8;
  const h = T + 24 * CH + 22;

  const monthTicks = days
    .map((d, i) => ({ d, i }))
    .filter(({ d }) => d.date.endsWith("-01"));

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") onSel(Math.min(days.length - 1, sel + 1));
    else if (e.key === "ArrowLeft") onSel(Math.max(0, sel - 1));
    else if (e.key === "Home") onSel(0);
    else if (e.key === "End") onSel(days.length - 1);
    else return;
    e.preventDefault();
  };

  return (
    <div className="overflow-x-auto pb-1" role="group" aria-label="Hourly price heatmap, one column per day">
      <svg
        viewBox={`0 0 ${w} ${h}`}
        width={w}
        height={h}
        className="block max-w-none cursor-crosshair focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FF7A2F]"
        tabIndex={0}
        onKeyDown={onKey}
        aria-label={`Selected day ${fmtDate(days[sel].date)}. Use arrow keys to move.`}
        shapeRendering="crispEdges"
      >
        {[0, 6, 12, 18, 23].map((hr) => (
          <text key={hr} x={L - 6} y={T + (23 - hr) * CH + CH - 3}
            textAnchor="end" fontSize={9} fill={`${PAPER}66`}
            fontFamily="var(--font-mono, monospace)">
            {String(hr).padStart(2, "0")}h
          </text>
        ))}

        {days.map((d, i) =>
          d.prices.map((p, hr) =>
            p === null ? null : (
              <rect
                key={`${i}-${hr}`}
                x={L + i * CW}
                y={T + (23 - hr) * CH}
                width={CW}
                height={CH}
                fill={magma((p - lo) / (hi - lo))}
                opacity={sel === i ? 1 : 0.92}
              />
            ),
          ),
        )}

        {/* click targets: one per column, full height */}
        {days.map((_, i) => (
          <rect key={`hit-${i}`} x={L + i * CW} y={T} width={CW} height={24 * CH}
            fill="transparent" className="cursor-pointer"
            onClick={() => onSel(i)} />
        ))}

        {/* selection marker */}
        <rect
          x={L + sel * CW - 1} y={T - 2} width={CW + 2} height={24 * CH + 4}
          fill="none" stroke={AMBER} strokeWidth={1.5}
        />

        {monthTicks.map(({ d, i }) => (
          <text key={d.date} x={L + i * CW} y={h - 6} fontSize={9}
            fill={`${PAPER}66`} fontFamily="var(--font-mono, monospace)">
            {MONTHS[new Date(`${d.date}T12:00:00`).getMonth()]}{" "}
            {d.date.slice(2, 4)}
          </text>
        ))}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */

function DayDetail({ day }: { day: LuzDay }) {
  const W = 680;
  const H = 220;
  const L = 42;
  const R = 10;
  const T = 16;
  const B = 24;

  const vals = day.prices.filter((v): v is number => v !== null);
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const pad = (max - min) * 0.12 || 1;
  const y = (p: number) =>
    T + (H - T - B) * (1 - (p - (min - pad)) / (max + pad - (min - pad)));
  const x = (hr: number) => L + ((W - L - R) * hr) / 23;

  const path = day.prices
    .map((p, hr) => (p === null ? null : `${x(hr)},${y(p)}`))
    .filter(Boolean)
    .map((pt, i) => `${i === 0 ? "M" : "L"}${pt}`)
    .join(" ");

  const pick = day.pick;
  const nailed = pick && pick.rule === pick.best;
  const ruleCents = pick ? windowCents(day.prices, pick.rule) : null;
  const bestCents = pick ? windowCents(day.prices, pick.best) : null;
  const extraPct =
    pick && !nailed && ruleCents !== null && bestCents !== null
      ? Math.round(((ruleCents - bestCents) / bestCents) * 100)
      : 0;

  const band = (start: number, color: string, opacity: number) => (
    <rect x={x(start)} y={T} width={x(start + WINDOW_H) - x(start)}
      height={H - T - B} fill={color} opacity={opacity} />
  );

  return (
    <div className="mt-8 grid grid-cols-1 gap-x-10 gap-y-5 md:grid-cols-[minmax(0,1fr)_240px]">
      <div className="overflow-x-auto pb-1">
        <svg viewBox={`0 0 ${W} ${H}`} className="block w-full min-w-[540px]" role="img"
          aria-label={`Hourly prices on ${fmtDate(day.date)}`}>
          {pick && !nailed && band(pick.best, PAPER, 0.13)}
          {pick && band(pick.rule, AMBER, 0.22)}

          {[min, max].map((p) => (
            <text key={p} x={L - 7} y={y(p) + 3} textAnchor="end" fontSize={10}
              fill={`${PAPER}66`} fontFamily="var(--font-mono, monospace)">
              {Math.round(p)}
            </text>
          ))}
          <text x={L - 7} y={T + 2} textAnchor="end" fontSize={8}
            fill={`${PAPER}44`} fontFamily="var(--font-mono, monospace)">
            €/MWh
          </text>

          {[0, 6, 12, 18, 23].map((hr) => (
            <text key={hr} x={x(hr)} y={H - 7} textAnchor="middle" fontSize={10}
              fill={`${PAPER}66`} fontFamily="var(--font-mono, monospace)">
              {String(hr).padStart(2, "0")}h
            </text>
          ))}

          <path d={path} fill="none" stroke={PAPER} strokeWidth={2}
            strokeLinejoin="round" />

          {pick && !nailed && (
            <text x={x(pick.best + 1)} y={T + 12} textAnchor="middle"
              fontSize={10} fill={PAPER}>the cheap one</text>
          )}
          {pick && (
            <text x={x(pick.rule + 1)} y={T + (nailed ? 12 : 26)}
              textAnchor="middle" fontSize={10} fill={AMBER}>
              {nailed ? "the rule — nailed it" : "the rule"}
            </text>
          )}
        </svg>
      </div>

      <div className="font-mono text-[11px] uppercase leading-relaxed tracking-[0.12em]">
        <div className="text-[#F4EDE3]">{fmtDate(day.date)}</div>
        <div className="mt-1 text-[#F4EDE3]/50">{TIPO_LABEL[day.tipo]}</div>
        {pick ? (
          <div className="mt-4 space-y-1.5">
            <div className="text-[#FF7A2F]">
              rule: {String(pick.rule).padStart(2, "0")}–
              {String(pick.rule + WINDOW_H).padStart(2, "0")}h ·{" "}
              {ruleCents?.toFixed(1)} c€/kWh
            </div>
            <div className="text-[#F4EDE3]/70">
              best: {String(pick.best).padStart(2, "0")}–
              {String(pick.best + WINDOW_H).padStart(2, "0")}h ·{" "}
              {bestCents?.toFixed(1)} c€/kWh
            </div>
            <div className={nailed ? "text-[#F4EDE3]" : "text-[#FF7A2F]"}>
              {nailed ? "exact match" : `the rule paid +${extraPct}% that day`}
            </div>
          </div>
        ) : (
          <div className="mt-4 text-[#F4EDE3]/50">
            23-hour day (clocks change) — excluded from the backtest
          </div>
        )}
        <div className="mt-5 text-[#F4EDE3]/40">
          tap any column above · arrow keys work too
        </div>
      </div>
    </div>
  );
}
