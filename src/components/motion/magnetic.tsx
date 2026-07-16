"use client";

import { motion, useMotionValue, useSpring } from "framer-motion";
import { useRef } from "react";
import type { ComponentPropsWithoutRef } from "react";
import { springSnappy } from "@/lib/motion";

type MagneticProps = {
  /** How far the element is pulled toward the cursor, in px. */
  strength?: number;
  children: React.ReactNode;
} & ComponentPropsWithoutRef<typeof motion.span>;

/**
 * Wraps an interactive element so it subtly pulls toward the cursor on hover.
 * Pointer-driven only; keyboard focus and reduced-motion users get a static element.
 */
export function Magnetic({ strength = 14, children, ...props }: MagneticProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, springSnappy);
  const sy = useSpring(y, springSnappy);

  function onMove(e: React.PointerEvent<HTMLSpanElement>) {
    if (e.pointerType !== "mouse") return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set((relX / (rect.width / 2)) * strength);
    y.set((relY / (rect.height / 2)) * strength);
  }

  function reset() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.span
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ x: sx, y: sy, display: "inline-flex" }}
      {...props}
    >
      {children}
    </motion.span>
  );
}
