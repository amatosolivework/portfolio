"use client";

import { useCallback, useRef } from "react";
import { DAY_TYPES } from "./bicing-map";

const AMBER = "#FF7A2F";
const PAPER = "#F4EDE3";
const MUTED = "#8A7A64";

const W = 560;
const H = 170;
const PAD = { top: 18, right: 74, bottom: 22, left: 8 };

/** The city's pulse: aggregate occupancy by hour, one line per day type.
 * Doubles as the map's time scrubber — click or drag to set the hour. */
export function BicingPulse({
  curves,
  hour,
  dayType,
  onSelect,
}: {
  /** occupancy % per hour, keyed by day type */
  curves: Record<string, number[]>;
  hour: number;
  dayType: string;
  onSelect: (hour: number) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);

  const all = Object.values(curves).flat();
  const min = Math.min(...all) - 0.8;
  const max = Math.max(...all) + 0.8;
  const x = (h: number) => PAD.left + (h / 23) * (W - PAD.left - PAD.right);
  const y = (v: number) =>
    PAD.top + (1 - (v - min) / (max - min)) * (H - PAD.top - PAD.bottom);
  const path = (vals: number[]) =>
    vals.map((v, h) => `${h ? "L" : "M"}${x(h).toFixed(1)},${y(v).toFixed(1)}`).join("");

  const pick = useCallback(
    (clientX: number) => {
      const svg = svgRef.current;
      if (!svg) return;
      const r = svg.getBoundingClientRect();
      const fx = ((clientX - r.left) / r.width) * W;
      const h = Math.round(((fx - PAD.left) / (W - PAD.left - PAD.right)) * 23);
      onSelect(Math.max(0, Math.min(23, h)));
    },
    [onSelect],
  );

  const active = curves[dayType];
  const labels: Record<string, string> = {
    laborable: "workday",
    finde: "weekend",
    agosto: "august",
  };

  return (
    <div className="mt-4">
      <div className="flex items-baseline justify-between font-mono text-[11px] uppercase tracking-[0.12em]">
        <span className="text-[#F4EDE3]/70">
          The pulse — parked bikes across the day
        </span>
        <span className="text-[#F4EDE3]/40">click to move the map</span>
      </div>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        className="mt-2 w-full cursor-crosshair select-none"
        role="slider"
        aria-label="hour of day (chart scrubber)"
        aria-valuemin={0}
        aria-valuemax={23}
        aria-valuenow={hour}
        onPointerDown={(e) => {
          try {
            e.currentTarget.setPointerCapture(e.pointerId);
          } catch {
            // pointer already gone (or synthetic) — the click still counts
          }
          pick(e.clientX);
        }}
        onPointerMove={(e) => e.buttons > 0 && pick(e.clientX)}
      >
        {/* commute windows, barely there */}
        {[[7, 10], [17, 20]].map(([a, b]) => (
          <rect key={a} x={x(a)} y={PAD.top} width={x(b) - x(a)}
            height={H - PAD.top - PAD.bottom} fill={PAPER} opacity={0.04} />
        ))}

        {/* the three day types — active one leads, direct labels, no legend box */}
        {(() => {
          // end labels pushed apart when curves converge at 23:00
          const ys = DAY_TYPES.map(({ key }) => ({ key, ly: y(curves[key][23]) + 3 }))
            .sort((a, b) => a.ly - b.ly);
          for (let i = 1; i < ys.length; i++)
            ys[i].ly = Math.max(ys[i].ly, ys[i - 1].ly + 12);
          const labelY = Object.fromEntries(ys.map(({ key, ly }) => [key, ly]));
          return DAY_TYPES.map(({ key }) => {
            const isActive = key === dayType;
            return (
              <g key={key}>
                <path
                  d={path(curves[key])}
                  fill="none"
                  stroke={isActive ? AMBER : MUTED}
                  strokeWidth={isActive ? 2.2 : 1.1}
                  strokeDasharray={isActive ? undefined : "3 3"}
                  opacity={isActive ? 1 : 0.7}
                />
                <text
                  x={x(23) + 6}
                  y={labelY[key]}
                  fill={isActive ? AMBER : MUTED}
                  fontSize={10}
                  fontFamily="monospace"
                  fontWeight={isActive ? 700 : 400}
                >
                  {labels[key]}
                </text>
              </g>
            );
          });
        })()}

        {/* cursor: the hour the map is showing */}
        <line x1={x(hour)} x2={x(hour)} y1={PAD.top} y2={H - PAD.bottom}
          stroke={PAPER} strokeWidth={1} opacity={0.45} />
        <circle cx={x(hour)} cy={y(active[hour])} r={4} fill={AMBER}
          stroke="#17130E" strokeWidth={1.5} />
        <text x={x(hour)} y={12} fill={PAPER} fontSize={10}
          fontFamily="monospace" textAnchor="middle" fontWeight={700}>
          {String(hour).padStart(2, "0")}:00 · {active[hour].toFixed(1)}%
        </text>

        {/* hour ticks */}
        {[0, 6, 12, 18].map((h) => (
          <text key={h} x={x(h)} y={H - 8} fill={MUTED} fontSize={9}
            fontFamily="monospace" textAnchor="middle">
            {String(h).padStart(2, "0")}
          </text>
        ))}
      </svg>
    </div>
  );
}
