"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";
import type { Feature as FeatureData } from "@/lib/projects";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * One showcase feature, given equal editorial weight to the flagship. The raw
 * screenshot IS the figure: rendered at its native aspect ratio, whole, never
 * cropped, with no plate or frame around it. It sticks (CSS sticky, so it is
 * always contained to its own section and can never overlap the next feature)
 * while GSAP ScrollTrigger scrubs it: it tilts, drifts, and settles as its
 * chapters scroll past. The figure is a SEQUENCE: as each chapter crosses the
 * viewport middle, the screenshot crossfades to that chapter's screen and the
 * caption updates, so the pinned figure turns like a page alongside the story.
 * Dark and light spreads alternate and the figure flips side, so five in a row
 * never feel repetitive. Motion runs only on wide screens with motion allowed;
 * otherwise everything is a clean static stack showing the first screen.
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
  const shots = feature.shots ?? [];

  const sectionRef = useRef<HTMLElement>(null);
  const plateRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef(0);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const shotCount = shots.length;
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

          // Turn the figure as the chapters pass: chapter n reveals screen n
          // when it crosses the middle of the viewport, and turns back on the
          // way up. With fewer screens than chapters, the last screen holds.
          if (shotCount > 1) {
            const turn = (i: number) => {
              const clamped = Math.max(0, Math.min(shotCount - 1, i));
              if (activeRef.current !== clamped) {
                activeRef.current = clamped;
                setActive(clamped);
              }
            };
            gsap.utils
              .toArray<HTMLElement>(".feat-chapter", section)
              .forEach((el, i) => {
                ScrollTrigger.create({
                  trigger: el,
                  start: "top 55%",
                  onEnter: () => turn(i),
                  onLeaveBack: () => turn(i - 1),
                });
              });
          }

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
  }, [dark, shots.length]);

  const shotStack = (kind: "phone" | "web") => (
    <>
      {shots.map((s, i) => (
        <Image
          key={s.src}
          src={s.src}
          alt={s.alt}
          fill
          sizes={
            kind === "phone"
              ? "(min-width: 768px) 300px, 70vw"
              : "(min-width: 768px) 560px, 92vw"
          }
          className={cn(
            "object-contain transition-opacity duration-700 ease-out",
            i === active ? "opacity-100" : "opacity-0",
          )}
        />
      ))}
    </>
  );

  return (
    <section
      ref={sectionRef}
      id={feature.id}
      className={cn("scroll-mt-20 border-t border-ink", dark && "dark bg-paper text-ink")}
    >
      <div className="mx-auto max-w-[1400px] px-6 pt-20 pb-12 md:px-10 md:pt-28 md:pb-16">
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
          {/* the figure (sticky; turns through the shot sequence). The raw
              screenshot IS the figure: native aspect ratio, whole, never
              cropped, no plate or frame around it. A deep shadow and a hairline
              edge keep light UIs from bleeding into the paper. */}
          <div className={cn(plateSide === "right" && "md:order-2")}>
            <figure
              className={cn(
                // Sticky for the whole section, centered in the viewport: the
                // full-height flex container keeps the figure vertically
                // centered on screen for its entire travel.
                "mx-auto w-full md:sticky md:top-0 md:flex md:h-svh md:flex-col md:justify-center md:py-8",
                feature.shotKind === "phone"
                  ? "max-w-[260px] md:max-w-[300px]"
                  : "max-w-[560px]",
              )}
            >
              {shots.length > 0 ? (
                <div
                  ref={plateRef}
                  style={{ aspectRatio: `${feature.shotWidth} / ${feature.shotHeight}` }}
                  className={cn(
                    "relative w-full overflow-hidden will-change-transform",
                    feature.shotKind === "phone" ? "rounded-[14px]" : "rounded-[6px]",
                    "shadow-[0_36px_72px_-28px_rgba(0,0,0,0.5)]",
                    dark ? "ring-1 ring-white/10" : "ring-1 ring-black/10",
                  )}
                >
                  {shotStack(feature.shotKind ?? "phone")}
                </div>
              ) : (
                <div
                  ref={plateRef}
                  style={{
                    background: dark
                      ? "linear-gradient(160deg,#f6f6f4,#e7e7e3)"
                      : "linear-gradient(160deg,#1b1b1e,#0d0d0f)",
                  }}
                  className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-sm shadow-[0_40px_80px_-40px_rgba(0,0,0,0.5)] will-change-transform"
                >
                  <span
                    className="text-5xl font-semibold tracking-tight"
                    style={{ color: plateInk }}
                  >
                    {feature.name}
                  </span>
                  <span
                    className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-eyebrow uppercase tracking-[0.14em]"
                    style={{ color: `${plateInk}80` }}
                  >
                    {feature.plateCaption}
                  </span>
                </div>
              )}
              <figcaption className="mt-4 font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-faint">
                Fig. {feature.index} · {feature.name}
                {shots.length > 0 ? ` · ${shots[active].label}` : null}
              </figcaption>
            </figure>
          </div>

          {/* article */}
          <div className={cn(plateSide === "right" && "md:order-1")}>
            <Reveal>
              <p className="max-w-md text-lg leading-relaxed text-ink-muted">{feature.lede}</p>
            </Reveal>

            <div className="feat-chapters mt-16 space-y-16 md:mt-24 md:space-y-[20vh]">
              {feature.chapters.map((c) => (
                <div key={c.title} className="feat-chapter max-w-md">
                  <h3
                    className="text-3xl font-semibold leading-[1.05] tracking-[-0.02em] text-ink md:text-4xl"
                    style={{ fontWeight: 700 }}
                  >
                    {c.title}
                  </h3>
                  <p className="mt-5 text-lg leading-relaxed text-ink-muted">{c.body}</p>
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
