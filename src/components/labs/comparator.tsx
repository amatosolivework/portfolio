"use client";

import { useRef, useState } from "react";

/**
 * Before/after slider: optical on the left of the handle, thermal on the
 * right. No dependencies — two stacked images and a clip-path driven by
 * pointer position (or the invisible range input, for keyboard/screen-reader
 * access).
 */
export function Comparator({
  optical,
  thermal,
  alt,
}: {
  optical: string;
  thermal: string;
  alt: string;
}) {
  const [pct, setPct] = useState(50);
  const ref = useRef<HTMLDivElement>(null);

  const fromPointer = (clientX: number) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPct(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
  };

  return (
    <div
      ref={ref}
      className="relative select-none overflow-hidden rounded-xl border border-hairline"
      onPointerMove={(e) => e.buttons > 0 && fromPointer(e.clientX)}
      onPointerDown={(e) => fromPointer(e.clientX)}
      style={{ touchAction: "pan-y" }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={thermal} alt={`${alt} — thermal`} className="block w-full" draggable={false} />
      <div
        className="absolute inset-0"
        style={{ clipPath: `inset(0 ${100 - pct}% 0 0)` }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={optical} alt={`${alt} — optical`} className="block w-full" draggable={false} />
      </div>

      <div
        className="pointer-events-none absolute inset-y-0 w-px bg-paper/90"
        style={{ left: `${pct}%` }}
      >
        <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-hairline bg-paper px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink">
          ⇤⇥
        </div>
      </div>

      <span className="absolute left-3 top-3 rounded-md bg-paper/85 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-ink">
        optical
      </span>
      <span className="absolute right-3 top-3 rounded-md bg-ink/70 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-paper">
        thermal
      </span>

      <input
        type="range"
        min={0}
        max={100}
        value={pct}
        onChange={(e) => setPct(Number(e.target.value))}
        aria-label="Compare optical and thermal imagery"
        className="absolute inset-x-0 bottom-0 h-8 w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
