"use client";

import { motion } from "framer-motion";
import type { ComponentPropsWithoutRef, ElementType } from "react";
import { reveal, viewportOnce } from "@/lib/motion";

type RevealProps = {
  as?: ElementType;
  delay?: number;
  children: React.ReactNode;
} & ComponentPropsWithoutRef<typeof motion.div>;

/**
 * Scroll-triggered rise + fade using the shared reveal variant.
 * Reduced motion is handled globally (framer-motion reads prefers-reduced-motion
 * and our CSS zeroes transitions), so this degrades to an instant appearance.
 */
export function Reveal({ as, delay = 0, children, ...props }: RevealProps) {
  const Tag = motion.create(as ?? "div");
  return (
    <Tag
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={reveal}
      transition={{ delay }}
      {...props}
    >
      {children}
    </Tag>
  );
}
