"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Before/after slider: optical on the left of the handle, thermal on the
 * right. No dependencies — two stacked images and a clip-path driven by
 * pointer position (or the invisible range input, for keyboard/screen-reader
 * access). On first reveal it performs one slow teaching sweep so the
 * interaction explains itself; any pointer contact cancels it, and it never
 * runs under prefers-reduced-motion.
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
  const touched = useRef(false);

  const fromPointer = (clientX: number) => {
    touched.current = true;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    setPct(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
  };

  // one teaching sweep on first reveal: 50 → 80 → 50, eased, cancellable
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || touched.current) return;
        io.disconnect();
        const t0 = performance.now();
        const dur = 2200;
        const tick = (now: number) => {
          if (touched.current) return;
          const t = Math.min(1, (now - t0) / dur);
          // sine bump: 0→1→0 over the duration, softly eased
          setPct(50 + 30 * Math.sin(Math.PI * t));
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="relative select-none overflow-hidden rounded-xl"
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
        className="pointer-events-none absolute inset-y-0 w-px bg-white/80"
        style={{ left: `${pct}%` }}
      >
        <div className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/95 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-black">
          ⇤⇥
        </div>
      </div>

      <span className="absolute left-3 top-3 rounded-md bg-white/90 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-black">
        optical
      </span>
      <span className="absolute right-3 top-3 rounded-md bg-black/60 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-white">
        thermal
      </span>

      <input
        type="range"
        min={0}
        max={100}
        value={pct}
        onChange={(e) => {
          touched.current = true;
          setPct(Number(e.target.value));
        }}
        aria-label="Compare optical and thermal imagery"
        className="absolute inset-x-0 bottom-0 h-8 w-full cursor-ew-resize opacity-0"
      />
    </div>
  );
}
