"use client";

import { motion } from "framer-motion";
import { maskUp, staggerContainer, spring } from "@/lib/motion";
import { Magnetic } from "@/components/motion/magnetic";
import { site } from "@/lib/site";
import { useLenis } from "lenis/react";

/**
 * Phase 001 typographic hero. Static background for now — the animated shader
 * field replaces the plain surface in Phase 002.
 */
export function HeroPlaceholder() {
  const lenis = useLenis();

  function scrollToWork() {
    const el = document.querySelector("#work");
    if (el && lenis) lenis.scrollTo(el as HTMLElement, { offset: -80 });
    else el?.scrollIntoView({ behavior: "smooth" });
  }

  const line = (text: string) => (
    <span className="block overflow-hidden">
      <motion.span variants={maskUp} className="block">
        {text}
      </motion.span>
    </span>
  );

  return (
    <section className="relative flex min-h-[92svh] items-center overflow-hidden">
      {/* placeholder for the Phase 002 shader field */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(120%_120%_at_50%_-10%,var(--surface),var(--paper))]"
      />

      <div className="mx-auto w-full max-w-[1200px] px-6 pt-24">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="mb-8 font-mono text-eyebrow uppercase tracking-[0.14em] text-ink-faint"
        >
          {site.role} · {site.location}
        </motion.p>

        <motion.h1
          variants={staggerContainer(0.09, 0.15)}
          initial="hidden"
          animate="visible"
          className="max-w-5xl font-semibold leading-[0.98] tracking-[-0.03em] text-ink"
          style={{ fontSize: "var(--text-display)" }}
        >
          {line("Alex Matos Olive")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.5 }}
          className="mt-8 max-w-2xl text-balance text-lg text-ink-muted md:text-xl"
        >
          I build real product end to end — a native iOS AI app live on the App
          Store, serverless backends, and web.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...spring, delay: 0.62 }}
          className="mt-12 flex flex-wrap items-center gap-4"
        >
          <Magnetic strength={12}>
            <button
              onClick={scrollToWork}
              className="inline-flex items-center rounded-full bg-ink px-6 py-3 text-sm font-medium text-brand-contrast transition-opacity hover:opacity-90"
            >
              View work
            </button>
          </Magnetic>
          <Magnetic strength={12}>
            <a
              href={site.cv}
              className="inline-flex items-center rounded-full border border-hairline px-6 py-3 text-sm font-medium text-ink transition-colors hover:border-ink"
            >
              Download CV
            </a>
          </Magnetic>
        </motion.div>
      </div>
    </section>
  );
}
