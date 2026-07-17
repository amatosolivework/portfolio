"use client";

import { motion } from "framer-motion";
import { useLenis } from "lenis/react";
import { maskUp, staggerContainer } from "@/lib/motion";
import { site } from "@/lib/site";

const contents = [
  { no: "01", label: "Selected Work", target: "#work" },
  { no: "02", label: "About", target: "#about" },
  { no: "03", label: "Writing", target: "/blog", route: true },
  { no: "04", label: "Contact", target: "#contact" },
];

export function Masthead() {
  const lenis = useLenis();

  function toSection(target: string) {
    const el = document.querySelector(target);
    if (el && lenis) lenis.scrollTo(el as HTMLElement, { offset: -80 });
    else el?.scrollIntoView({ behavior: "smooth" });
  }

  const nameLine = (text: string, className = "") => (
    <span className="block overflow-hidden">
      <motion.span variants={maskUp} className={`block ${className}`}>
        {text}
      </motion.span>
    </span>
  );

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-between px-6 pb-14 pt-28 md:px-10 md:pb-20 md:pt-32">
      {/* running head */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.7 }}
        className="flex items-start justify-between border-t border-ink pt-4 font-mono text-eyebrow uppercase tracking-[0.14em] text-ink"
      >
        <span>A working monograph</span>
        <span className="text-right text-ink-faint">
          Vol.&nbsp;1
          <br className="md:hidden" />
          <span className="hidden md:inline"> — </span>
          MMXXVI
        </span>
      </motion.div>

      {/* the cover title */}
      <div className="grid grid-cols-1 gap-x-10 gap-y-12 lg:grid-cols-12">
        <motion.h1
          variants={staggerContainer(0.12, 0.2)}
          initial="hidden"
          animate="visible"
          className="col-span-12 font-semibold leading-[0.86] tracking-[-0.03em] text-ink lg:col-span-8"
          style={{ fontSize: "var(--text-masthead)", fontWeight: 800 }}
        >
          {nameLine("Alex")}
          {nameLine("Matos")}
          {nameLine("Olive", "text-brand")}
        </motion.h1>

        {/* lede + contents index */}
        <div className="col-span-12 flex flex-col justify-end gap-10 lg:col-span-4">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-sm text-lg leading-relaxed text-ink-muted"
          >
            An iOS developer and Co-founder &amp; CTO at WRDB, building real product
            end to end — a native AI app live on the App&nbsp;Store, serverless
            backends, and web.
          </motion.p>

          <motion.nav
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            aria-label="Contents"
            className="border-t border-hairline"
          >
            <ul>
              {contents.map((c) =>
                c.route ? (
                  <li key={c.no}>
                    <a
                      href={c.target}
                      className="group flex items-baseline justify-between border-b border-hairline py-2.5 transition-colors hover:text-brand"
                    >
                      <span className="flex items-baseline gap-3">
                        <span className="font-mono text-eyebrow text-ink-faint">{c.no}</span>
                        <span className="text-base">{c.label}</span>
                      </span>
                      <span aria-hidden className="font-mono text-eyebrow text-ink-faint transition-transform group-hover:-translate-y-0.5">
                        ↗
                      </span>
                    </a>
                  </li>
                ) : (
                  <li key={c.no}>
                    <button
                      onClick={() => toSection(c.target)}
                      className="group flex w-full items-baseline justify-between border-b border-hairline py-2.5 text-left transition-colors hover:text-brand"
                    >
                      <span className="flex items-baseline gap-3">
                        <span className="font-mono text-eyebrow text-ink-faint">{c.no}</span>
                        <span className="text-base">{c.label}</span>
                      </span>
                      <span aria-hidden className="font-mono text-eyebrow text-ink-faint transition-transform group-hover:translate-x-0.5">
                        →
                      </span>
                    </button>
                  </li>
                ),
              )}
            </ul>
          </motion.nav>
        </div>
      </div>

      {/* footer line of the cover */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.05, duration: 0.7 }}
        className="flex items-end justify-between border-t border-ink pt-4 font-mono text-eyebrow uppercase tracking-[0.14em] text-ink"
      >
        <span>{site.location}</span>
        <a
          href={site.cv}
          target="_blank"
          rel="noopener noreferrer"
          className="transition-colors hover:text-brand"
        >
          Curriculum Vitae ↗
        </a>
      </motion.div>
    </section>
  );
}
