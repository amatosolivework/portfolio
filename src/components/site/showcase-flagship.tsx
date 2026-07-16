"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useLenis } from "lenis/react";
import { wrdb } from "@/lib/projects";
import { DeviceFrame } from "@/components/site/device-frame";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function ShowcaseFlagship() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const deviceRef = useRef<HTMLDivElement>(null);
  const lenis = useLenis();

  // Keep ScrollTrigger in sync with Lenis' smoothed scroll position.
  useEffect(() => {
    if (!lenis) return;
    lenis.on("scroll", ScrollTrigger.update);
    return () => lenis.off("scroll", ScrollTrigger.update);
  }, [lenis]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();
      // The pinned "wow" runs only on wider screens with motion allowed.
      mm.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => {
          ScrollTrigger.create({
            trigger: section,
            start: "top 64px",
            end: "bottom bottom",
            pin: pinRef.current,
            pinSpacing: false,
          });

          gsap.to(deviceRef.current, {
            yPercent: -4,
            rotate: 1.2,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom bottom",
              scrub: 0.6,
            },
          });

          gsap.utils.toArray<HTMLElement>(".wrdb-chapter").forEach((el) => {
            gsap.from(el, {
              opacity: 0,
              y: 44,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: { trigger: el, start: "top 78%" },
            });
          });
        },
      );
    }, section);

    // Fonts/layout can shift start/end positions — recalc once settled.
    const raf = requestAnimationFrame(() => ScrollTrigger.refresh());

    return () => {
      cancelAnimationFrame(raf);
      ctx.revert();
    };
  }, []);

  return (
    <div ref={sectionRef} className="relative">
      <div className="grid gap-10 md:grid-cols-12 md:gap-12">
        {/* pinned device */}
        <div className="md:col-span-5">
          <div
            ref={pinRef}
            className="flex justify-center md:h-screen md:items-center"
          >
            <div ref={deviceRef} className="[perspective:1000px]">
              <DeviceFrame label={wrdb.name} caption="Live on the App Store" />
            </div>
          </div>
        </div>

        {/* scrolling chapters */}
        <div className="md:col-span-7">
          <div className="mb-10 md:pt-[18vh]">
            <p className="font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-faint">
              {wrdb.role} · {wrdb.period}
            </p>
            <h3
              className="mt-3 font-semibold tracking-tight text-ink"
              style={{ fontSize: "var(--text-3xl)" }}
            >
              {wrdb.name}
            </h3>
            <p className="mt-3 max-w-md text-lg text-ink-muted">{wrdb.tagline}</p>
          </div>

          <div className="space-y-16 md:space-y-[24vh]">
            {wrdb.chapters.map((c) => (
              <div key={c.index} className="wrdb-chapter max-w-md">
                <span className="font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-faint">
                  {c.index}
                </span>
                <h4 className="mt-3 text-xl font-medium text-ink">{c.title}</h4>
                <p className="mt-3 text-lg text-ink-muted">{c.body}</p>
              </div>
            ))}
          </div>

          {/* stack + links */}
          <div className="mt-16 md:mt-[20vh]">
            <div className="flex flex-wrap gap-2">
              {wrdb.stack.map((s) => (
                <span
                  key={s}
                  className="rounded-full border border-hairline bg-surface px-3 py-1 font-mono text-xs text-ink"
                >
                  {s}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              {wrdb.links.map((link) =>
                link.href ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1.5 text-sm text-ink transition-colors hover:text-ink-muted"
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
                    title="Link coming soon"
                  >
                    {link.label}
                    <span aria-hidden className="font-mono text-[0.65rem] uppercase tracking-wider">
                      soon
                    </span>
                  </span>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
