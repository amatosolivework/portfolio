"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import type { Feature as FeatureData } from "@/lib/projects";

/**
 * One showcase feature, given equal editorial weight to the flagship. Dark and
 * light spreads alternate, and the figure plate flips side, so four in a row never
 * feel repetitive. The plate is sticky AND scroll-scrubbed: it drifts and tilts
 * gently as its chapters flow past, driven by Framer Motion scroll progress
 * (reduced-motion safe). The dark spread flips design tokens via the `dark` class;
 * the plate uses explicit colors so it reads like a printed photo.
 */
export function Feature({
  feature,
  plateSide,
}: {
  feature: FeatureData;
  plateSide: "left" | "right";
}) {
  const dark = feature.tone === "dark";
  const plateInk = dark ? "#111013" : "#fafaf8";

  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], reduce ? ["0%", "0%"] : ["7%", "-7%"]);
  const rotate = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [1.6, -1.6]);

  return (
    <section
      ref={ref}
      id={feature.id}
      className={cn("scroll-mt-20 border-t border-ink", dark && "dark bg-paper text-ink")}
    >
      <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 md:py-28">
        <Reveal className="flex items-baseline justify-between border-t border-hairline pt-4 font-mono text-eyebrow uppercase tracking-[0.14em] text-ink-muted">
          <span>The Feature · {feature.index}</span>
          <span>{feature.status}</span>
        </Reveal>

        <Reveal>
          <h2
            className="mt-10 max-w-[16ch] font-semibold leading-[0.92] tracking-[-0.03em] text-ink"
            style={{ fontSize: "var(--text-display)", fontWeight: 800 }}
          >
            {feature.headline}
          </h2>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-2 md:items-start md:gap-16">
          {/* figure plate */}
          <div className={cn(plateSide === "right" && "md:order-2")}>
            <figure className="mx-auto w-full max-w-[360px] md:sticky md:top-28">
              <motion.div
                style={{
                  y,
                  rotate,
                  background: dark
                    ? "linear-gradient(160deg,#f6f6f4,#e7e7e3)"
                    : "linear-gradient(160deg,#1b1b1e,#0d0d0f)",
                }}
                className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-sm shadow-[0_40px_80px_-40px_rgba(0,0,0,0.45)] will-change-transform"
              >
                <span className="text-5xl font-semibold tracking-tight" style={{ color: plateInk }}>
                  {feature.name}
                </span>
                <span
                  className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-eyebrow uppercase tracking-[0.14em]"
                  style={{ color: `${plateInk}80` }}
                >
                  {feature.plateCaption}
                </span>
              </motion.div>
              <figcaption className="mt-4 font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-faint">
                Fig. {feature.index} · {feature.name}
              </figcaption>
            </figure>
          </div>

          {/* article */}
          <div className={cn(plateSide === "right" && "md:order-1")}>
            <Reveal>
              <p className="max-w-md text-lg leading-relaxed text-ink-muted">{feature.lede}</p>
            </Reveal>

            <div className="mt-14 space-y-14">
              {feature.chapters.map((c) => (
                <Reveal key={c.title} className="max-w-md">
                  <h3 className="text-2xl font-medium tracking-tight text-ink">{c.title}</h3>
                  <p className="mt-4 text-lg leading-relaxed text-ink-muted">{c.body}</p>
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-16 border-t border-hairline pt-8">
              <p className="font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-faint">
                Stack
              </p>
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-1 font-mono text-sm text-ink-muted">
                {feature.stack.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>

              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
                {feature.links.map((link) =>
                  link.href ? (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-1.5 text-sm text-ink transition-colors hover:text-brand"
                    >
                      {link.label}
                      <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                        ↗
                      </span>
                    </a>
                  ) : (
                    <span
                      key={link.label}
                      className="inline-flex items-center gap-1.5 text-sm text-ink-faint"
                    >
                      {link.label}
                      <span aria-hidden className="font-mono text-[0.65rem] uppercase tracking-wider">
                        soon
                      </span>
                    </span>
                  ),
                )}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
