"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import type { Feature as FeatureData } from "@/lib/projects";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * One showcase feature, given equal editorial weight to the flagship. The figure
 * plate sticks (CSS sticky, so it is always contained to its own section and can
 * never overlap the next feature) while GSAP ScrollTrigger scrubs it: it tilts,
 * drifts, and settles as its chapters scroll past, and the chapters reveal in
 * sequence. Dark and light spreads alternate and the plate flips side, so four in
 * a row never feel repetitive. Motion runs only on wide screens with motion
 * allowed; otherwise everything is a clean static stack.
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

  const sectionRef = useRef<HTMLElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          // Scrub the sticky plate as the section scrolls: tilt + drift + settle.
          gsap.fromTo(
            plateRef.current,
            { rotate: dark ? 4 : -4, yPercent: 8, scale: 0.97 },
            {
              rotate: dark ? -3 : 3,
              yPercent: -8,
              scale: 1,
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.5,
              },
            },
          );

          // Staggered chapter reveals.
          gsap.utils.toArray<HTMLElement>(".feat-chapter", section).forEach((el) => {
            gsap.from(el, {
              opacity: 0,
              y: 44,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: { trigger: el, start: "top 82%" },
            });
          });
        },
      );
    }, section);

    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, [dark]);

  return (
    <section
      ref={sectionRef}
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

        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-2 md:gap-16">
          {/* figure plate (sticky) */}
          <div className={cn(plateSide === "right" && "md:order-2")}>
            <figure className="mx-auto w-full max-w-[360px] md:sticky md:top-28">
              <div
                ref={plateRef}
                style={{
                  background: dark
                    ? "linear-gradient(160deg,#f6f6f4,#e7e7e3)"
                    : "linear-gradient(160deg,#1b1b1e,#0d0d0f)",
                }}
                className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-sm shadow-[0_40px_80px_-40px_rgba(0,0,0,0.5)] will-change-transform"
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
              </div>
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

            <div className="mt-16 space-y-16 md:mt-24 md:space-y-[26vh]">
              {feature.chapters.map((c) => (
                <div key={c.title} className="feat-chapter max-w-md">
                  <h3 className="text-2xl font-medium tracking-tight text-ink">{c.title}</h3>
                  <p className="mt-4 text-lg leading-relaxed text-ink-muted">{c.body}</p>
                </div>
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
