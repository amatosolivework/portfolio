"use client";

import { useEffect, useMemo, useState } from "react";
import { DAY_TYPES, type Station } from "./bicing-map";

type BacktestSide = {
  accuracy: number;
  trivial: number;
  oracle: number;
  avisos: { precision: number; cobertura: number };
};

export function BicingPredictor({
  stations,
  backtest,
  selectedId,
}: {
  stations: Station[];
  backtest: { julio: BacktestSide; agosto: BacktestSide };
  /** a station chosen elsewhere (clicking the map) lands here */
  selectedId?: number | null;
}) {
  const [query, setQuery] = useState("");
  const [stationId, setStationId] = useState<number | null>(null);
  const [hour, setHour] = useState(8);
  const [dayType, setDayType] = useState<string>("laborable");

  useEffect(() => {
    if (selectedId != null) {
      setStationId(selectedId);
      setQuery("");
    }
  }, [selectedId]);

  const sorted = useMemo(
    () => [...stations].sort((a, b) => a.nombre.localeCompare(b.nombre)),
    [stations],
  );
  const matches = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return [];
    return sorted
      .filter(
        (s) =>
          s.nombre.toLowerCase().includes(q) ||
          s.barrio.toLowerCase().includes(q),
      )
      .slice(0, 6);
  }, [query, sorted]);

  const station = stations.find((s) => s.id === stationId) ?? null;
  const p = station ? station.p[dayType][hour] : null;
  const dayLabel = DAY_TYPES.find((d) => d.key === dayType)!.label;
  const hh = `${String(hour).padStart(2, "0")}:00`;

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto_auto]">
        {/* station search */}
        <div className="relative">
          <label className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#F4EDE3]/50">
            station
          </label>
          <input
            value={station && !query ? station.nombre : query}
            onChange={(e) => {
              setQuery(e.target.value);
              setStationId(null);
            }}
            placeholder="type a street or neighbourhood…"
            className="mt-1.5 w-full rounded-lg border border-white/15 bg-transparent px-3 py-2 font-mono text-sm text-[#F4EDE3] placeholder:text-[#F4EDE3]/30 focus:border-white/40 focus:outline-none"
          />
          {matches.length > 0 && stationId === null && (
            <ul className="absolute z-10 mt-1 w-full overflow-hidden rounded-lg border border-white/15 bg-[#211B14]">
              {matches.map((s) => (
                <li key={s.id}>
                  <button
                    onClick={() => {
                      setStationId(s.id);
                      setQuery("");
                    }}
                    className="block w-full px-3 py-2 text-left font-mono text-xs text-[#F4EDE3]/80 hover:bg-white/10"
                  >
                    {s.nombre}
                    <span className="ml-2 text-[#F4EDE3]/40">{s.barrio}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* hour */}
        <div>
          <label className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#F4EDE3]/50">
            hour · {hh}
          </label>
          <input
            type="range"
            min={0}
            max={23}
            value={hour}
            onChange={(e) => setHour(Number(e.target.value))}
            aria-label="hour of day"
            className="mt-3.5 block w-full accent-[#FF7A2F] md:w-44"
          />
        </div>

        {/* day type */}
        <div>
          <div className="font-mono text-[11px] uppercase tracking-[0.12em] text-[#F4EDE3]/50">
            day
          </div>
          <div className="mt-1.5 flex gap-1.5">
            {DAY_TYPES.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setDayType(key)}
                className={`rounded-full border px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] transition-colors ${
                  dayType === key
                    ? "border-transparent bg-[#F4EDE3] text-[#17130E]"
                    : "border-white/15 text-[#F4EDE3]/60 hover:border-white/40"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* the answer */}
      <div className="mt-6 border-t border-white/10 pt-6">
        {!station ? (
          <p className="font-mono text-sm text-[#F4EDE3]/40">
            Pick a station to ask the year of data.
          </p>
        ) : p === null ? (
          <p className="max-w-xl text-sm leading-relaxed text-[#F4EDE3]/70">
            <span className="font-semibold text-[#F4EDE3]">Not enough data</span>{" "}
            for {station.nombre} at {hh} on a {dayLabel} — fewer than 30
            observed hours in the year. This widget says &ldquo;I don&rsquo;t
            know&rdquo; instead of guessing.
          </p>
        ) : (
          <div>
            <div
              className={`font-semibold leading-none tracking-[-0.03em] ${
                p >= 50 ? "text-[#F4EDE3]" : "text-[#FF7A2F]"
              }`}
              style={{ fontSize: "clamp(2.5rem, 2rem + 2vw, 3.75rem)" }}
            >
              {p}%
            </div>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-[#F4EDE3]/70">
              of {dayLabel}s this past year, {station.nombre} had at least one
              bike at {hh}.{" "}
              {p < 50 && (
                <span className="text-[#FF7A2F]">
                  Leave earlier or check the next station.
                </span>
              )}
            </p>
          </div>
        )}
      </div>

      {/* honesty box: what this predictor is and how well it tested */}
      <p className="mt-6 max-w-2xl border-t border-white/10 pt-4 font-mono text-[11px] leading-relaxed tracking-[0.02em] text-[#F4EDE3]/40">
        This is a historical frequency, not a model. Backtested on jul–aug
        2025 (trained on the 10 months before): when it warned &ldquo;no
        bike&rdquo;, it was right {Math.round(backtest.julio.avisos.precision * 100)}%
        of the time in July — ~6× the base rate — but it caught only{" "}
        {Math.round(backtest.julio.avisos.cobertura * 100)}% of bike-less
        moments. August broke it (precision{" "}
        {Math.round(backtest.agosto.avisos.precision * 100)}%): it had never
        seen an August. Full numbers in the write-up.
      </p>
    </div>
  );
}
