import { Reveal } from "@/components/motion/reveal";
import { site } from "@/lib/site";

// Real data only — sourced from content/profile.md and ../Practicas UB/cv-en.md.
const skillGroups: { label: string; items: string }[] = [
  { label: "Languages", items: "Swift · Python · JS/TS · SQL" },
  { label: "iOS / Mobile", items: "SwiftUI · UIKit · Combine · Xcode · Clean Architecture" },
  { label: "Backend / Data", items: "Supabase · PostgreSQL · Edge Functions · REST" },
  { label: "Infra / Web", items: "Cloudflare Workers · Next.js" },
  { label: "Applied AI", items: "Computer vision · MCP · Claude Code · LLMs" },
];

const languages = [
  { name: "Catalan", level: "Native" },
  { name: "Spanish", level: "Native" },
  { name: "English", level: "Professional" },
];

export function About() {
  return (
    <section id="about" className="scroll-mt-20 border-t border-ink">
      <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 md:py-28">
        {/* running head */}
        <Reveal className="flex items-baseline justify-between font-mono text-eyebrow uppercase tracking-[0.14em] text-ink-faint">
          <span>About — 03</span>
          <span>b. Barcelona</span>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-10">
          {/* bio column */}
          <div className="md:col-span-7">
            <Reveal>
              <p className="text-xl leading-relaxed text-ink first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:font-semibold first-letter:leading-[0.7] first-letter:text-brand first-letter:text-[5.5rem]">
                I&apos;m a Computer Engineering student at the University of
                Barcelona and co-founder &amp; CTO of WRDB, a native iOS
                AI-powered virtual-wardrobe app.
              </p>
            </Reveal>

            <Reveal>
              <p className="mt-6 text-xl leading-relaxed text-ink-muted">
                I build the whole stack: a Swift/SwiftUI app live on the App Store,
                a serverless backend on Supabase and Cloudflare Workers, a Next.js
                web front, and applied AI through computer vision, MCP, and Claude
                Code.
              </p>
            </Reveal>

            {/* pull-quote */}
            <Reveal>
              <blockquote className="my-14 border-t border-ink pt-8">
                <p
                  className="max-w-xl font-semibold leading-[1.05] tracking-[-0.02em] text-ink"
                  style={{ fontSize: "var(--text-2xl)" }}
                >
                  I build real product<span className="text-brand">,</span> end to
                  end — and I want to keep growing as an engineer.
                </p>
              </blockquote>
            </Reveal>

            <Reveal>
              <p className="max-w-xl text-lg leading-relaxed text-ink-muted">
                I&apos;m looking for a curricular internship (mornings) where I can
                bring real shipping experience to a team.
              </p>
            </Reveal>

            <Reveal className="mt-10">
              <a
                href={site.cv}
                className="group inline-flex items-baseline gap-2 text-base text-ink transition-colors hover:text-brand"
              >
                <span className="underline decoration-hairline underline-offset-4 transition-colors group-hover:decoration-brand">
                  Read the full CV
                </span>
                <span aria-hidden className="font-mono text-eyebrow">PDF ↗</span>
              </a>
            </Reveal>
          </div>

          {/* marginalia */}
          <aside className="md:col-span-4 md:col-start-9">
            <Reveal className="border-t border-hairline pt-5">
              <h3 className="font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-faint">
                Education
              </h3>
              <p className="mt-3 text-ink">BSc Computer Engineering</p>
              <p className="text-ink-muted">University of Barcelona</p>
              <p className="mt-1 font-mono text-sm text-ink-faint">
                2023–2027 (exp.) · Software Engineering
              </p>
            </Reveal>

            <Reveal className="mt-10 border-t border-hairline pt-5">
              <h3 className="font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-faint">
                Languages
              </h3>
              <ul className="mt-3 space-y-1">
                {languages.map((l) => (
                  <li key={l.name} className="flex items-baseline justify-between gap-4">
                    <span className="text-ink">{l.name}</span>
                    <span className="font-mono text-sm text-ink-faint">{l.level}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal className="mt-10 border-t border-hairline pt-5">
              <h3 className="font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-faint">
                Selected skills
              </h3>
              <dl className="mt-3 space-y-3">
                {skillGroups.map((g) => (
                  <div key={g.label}>
                    <dt className="text-sm text-ink">{g.label}</dt>
                    <dd className="font-mono text-sm text-ink-muted">{g.items}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </aside>
        </div>
      </div>
    </section>
  );
}
