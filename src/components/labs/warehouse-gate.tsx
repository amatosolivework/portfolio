"use client";

import { useState } from "react";

export type GateRow = {
  rank: number;
  code: string;
  name: string;
  revenue: number;
  service: boolean;
};

/** what the impostors actually are, by stock code */
const IMPOSTOR_LABELS: Record<string, string> = {
  M: "manual adjustment",
  DOT: "postage",
  POST: "postage",
  "BANK CHARGES": "bank fee",
  AMAZONFEE: "marketplace fee",
  ADJUST: "adjustment",
  S: "samples",
  D: "discount",
};

const fmtGBP = (n: number) =>
  "£" + Math.round(n).toLocaleString("en-GB");

export function WarehouseGate({
  raw,
  clean,
}: {
  raw: GateRow[];
  clean: GateRow[];
}) {
  const [scope, setScope] = useState<"raw" | "clean">("raw");
  const rows = scope === "raw" ? raw : clean;
  const max = Math.max(...raw.map((r) => r.revenue), ...clean.map((r) => r.revenue));

  return (
    <div className="rounded-2xl border border-ink/15 bg-white/40 p-5 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-faint">
          Top products by revenue · same data, two answers
        </div>
        <div
          role="tablist"
          aria-label="Choose data treatment"
          className="flex overflow-hidden rounded-full border border-ink/25 font-mono text-[11px] uppercase tracking-[0.12em]"
        >
          {(["raw", "clean"] as const).map((s) => (
            <button
              key={s}
              role="tab"
              aria-selected={scope === s}
              onClick={() => setScope(s)}
              className={`px-4 py-1.5 transition-colors ${
                scope === s
                  ? "bg-ink text-paper"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              {s === "raw" ? "Raw dump" : "Warehouse"}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 space-y-2.5" aria-live="polite">
        {rows.map((r) => {
          const impostor = scope === "raw" && r.service;
          const tag = IMPOSTOR_LABELS[r.code];
          return (
            <div key={`${scope}-${r.code}`} className="grid grid-cols-[1.5rem_1fr] items-baseline gap-3">
              <div className="font-mono text-[11px] text-ink-faint">
                {String(r.rank).padStart(2, "0")}
              </div>
              <div>
                <div className="flex flex-wrap items-baseline justify-between gap-x-3">
                  <span
                    className={`text-sm tracking-tight ${
                      impostor
                        ? "font-mono text-brand"
                        : "font-medium text-ink"
                    }`}
                  >
                    {r.name}
                    {impostor && tag && (
                      <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.12em] text-brand/70">
                        ← {tag}, not a product
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-xs text-ink-muted">
                    {fmtGBP(r.revenue)}
                  </span>
                </div>
                <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-ink/8">
                  <div
                    className={`h-full rounded-full transition-[width] duration-500 motion-reduce:transition-none ${
                      impostor ? "bg-brand" : "bg-ink"
                    }`}
                    style={{ width: `${(r.revenue / max) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <p className="mt-6 font-mono text-[11px] leading-relaxed tracking-[0.02em] text-ink-faint">
        {scope === "raw"
          ? "Concatenate the spreadsheet and sum: a manual adjustment ledger is your best seller and the postman is #3."
          : "After the warehouse: duplicates removed, cancellations netted, 61 service codes evicted. These are the actual products."}
      </p>
    </div>
  );
}
