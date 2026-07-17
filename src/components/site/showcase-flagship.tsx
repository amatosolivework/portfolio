import { Reveal } from "@/components/motion/reveal";
import { wrdb } from "@/lib/projects";

/**
 * WRDB as the feature article — an inverted (dark) spread. A light "figure plate"
 * sticks while the article chapters scroll past it; the stack sits as margin notes.
 * The dark spread flips design tokens via the `dark` class; the plate uses its own
 * explicit light colors so it reads like a photo on a printed page. Sticky (not a
 * JS pin) so it stays cleanly inside the section and can't overlap what follows.
 */
export function ShowcaseFlagship() {
  return (
    <section id="work" className="dark scroll-mt-20 bg-paper text-ink">
      <div className="mx-auto max-w-[1400px] px-6 pb-24 pt-20 md:px-10 md:pb-32 md:pt-28">
        {/* feature masthead */}
        <div className="flex items-baseline justify-between border-t border-hairline pt-4 font-mono text-eyebrow uppercase tracking-[0.14em] text-ink-muted">
          <span>The Feature · 01</span>
          <span>{wrdb.role}</span>
        </div>

        <Reveal>
          <h2
            className="mt-10 max-w-[14ch] font-semibold leading-[0.92] tracking-[-0.03em] text-ink"
            style={{ fontSize: "var(--text-display)", fontWeight: 800 }}
          >
            An AI wardrobe, live on the App&nbsp;Store.
          </h2>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-10">
          {/* sticky figure plate */}
          <div className="md:col-span-6">
            <figure className="mx-auto w-full max-w-[360px] md:sticky md:top-28">
              <div
                className="relative flex aspect-[4/5] w-full items-center justify-center overflow-hidden rounded-sm"
                style={{ background: "linear-gradient(160deg,#f6f6f4,#e7e7e3)" }}
              >
                <span className="text-5xl font-semibold tracking-tight text-[#111013]">
                  WRDB
                </span>
                <span className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-eyebrow uppercase tracking-[0.14em] text-[#111013]/50">
                  Live on the App Store
                </span>
              </div>
              <figcaption className="mt-4 font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-faint">
                Fig. 1 · WRDB, native iOS
              </figcaption>
            </figure>
          </div>

          {/* article chapters */}
          <div className="md:col-span-6 md:pt-[6vh]">
            <Reveal>
              <p className="max-w-md text-lg leading-relaxed text-ink-muted">
                AI-powered virtual wardrobe, native on iOS. As Co-founder &amp; CTO
                I own it end to end: the app, the backend, the AI, and the web.
              </p>
            </Reveal>

            <div className="mt-16 space-y-16 md:mt-24 md:space-y-32">
              {wrdb.chapters.map((c) => (
                <Reveal key={c.index} className="max-w-md">
                  <h3 className="text-2xl font-medium tracking-tight text-ink">
                    {c.title}
                  </h3>
                  <p className="mt-4 text-lg leading-relaxed text-ink-muted">
                    {c.body}
                  </p>
                </Reveal>
              ))}
            </div>

            {/* margin notes: stack + links */}
            <Reveal className="mt-20 border-t border-hairline pt-8">
              <p className="font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-faint">
                Stack
              </p>
              <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-1 font-mono text-sm text-ink-muted">
                {wrdb.stack.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>

              <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3">
                {wrdb.links.map((link) =>
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
