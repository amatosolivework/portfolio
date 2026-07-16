import { Reveal } from "@/components/motion/reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { site } from "@/lib/site";

// Real data only — sourced from content/profile.md and ../Practicas UB/cv-en.md.
const skillGroups: { label: string; items: string[] }[] = [
  { label: "Languages", items: ["Swift", "Python", "JavaScript / TypeScript", "SQL"] },
  {
    label: "iOS / Mobile",
    items: ["SwiftUI", "UIKit", "Combine", "Xcode", "Clean Architecture", "App Store / TestFlight"],
  },
  { label: "Backend / Data", items: ["Supabase", "PostgreSQL", "Edge Functions", "REST APIs"] },
  { label: "Infrastructure / Web", items: ["Cloudflare Workers", "Next.js"] },
  {
    label: "Applied AI",
    items: ["Machine Learning", "Computer Vision", "MCP", "Claude Code", "LLM integration"],
  },
  { label: "Methods / Tools", items: ["Git", "CI/CD", "Agile", "Product design"] },
];

const languages: { name: string; level: string }[] = [
  { name: "Catalan", level: "Native" },
  { name: "Spanish", level: "Native" },
  { name: "English", level: "Professional" },
];

export function About() {
  return (
    <section id="about" className="scroll-mt-24 border-t border-hairline">
      <div className="mx-auto max-w-[1200px] px-6 py-24 md:py-32">
        <Reveal className="mb-6 flex items-center gap-3">
          <span className="font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-faint">
            02
          </span>
          <span className="font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-faint">
            About
          </span>
        </Reveal>

        <div className="grid gap-16 md:grid-cols-12 md:gap-12">
          {/* narrative + facts */}
          <div className="md:col-span-7">
            <Reveal>
              <h2
                id="about-title"
                className="max-w-2xl font-semibold tracking-tight text-ink"
                style={{ fontSize: "var(--text-2xl)" }}
              >
                A Computer Engineering student who ships real product end to end.
              </h2>
            </Reveal>

            <Reveal delay={0.05} className="mt-8 max-w-xl space-y-5 text-lg text-ink-muted">
              <p>
                I'm a Computer Engineering student at the University of Barcelona
                and co-founder &amp; CTO of WRDB, a native iOS AI-powered
                virtual-wardrobe app. I build the whole stack: a Swift/SwiftUI app
                live on the App Store, a serverless backend on Supabase and
                Cloudflare Workers, a Next.js web front, and applied AI through
                computer vision, MCP, and Claude Code.
              </p>
              <p>
                I'm looking for a curricular internship (mornings) where I can
                bring real shipping experience and keep growing as a software
                engineer.
              </p>
            </Reveal>

            <Reveal delay={0.1} className="mt-10">
              <Magnetic strength={10}>
                <a
                  href={site.cv}
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-medium text-brand-contrast transition-opacity hover:opacity-90"
                >
                  Download CV
                  <span aria-hidden className="font-mono text-xs opacity-70">
                    PDF
                  </span>
                </a>
              </Magnetic>
            </Reveal>

            {/* education + languages */}
            <div className="mt-14 grid gap-10 sm:grid-cols-2">
              <Reveal>
                <h3 className="font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-faint">
                  Education
                </h3>
                <p className="mt-4 text-ink">
                  BSc in Computer Engineering
                </p>
                <p className="text-ink-muted">University of Barcelona</p>
                <p className="mt-1 font-mono text-sm text-ink-faint">
                  2023 — 2027 (expected) · Software Engineering
                </p>
              </Reveal>

              <Reveal delay={0.05}>
                <h3 className="font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-faint">
                  Languages
                </h3>
                <ul className="mt-4 space-y-2">
                  {languages.map((l) => (
                    <li key={l.name} className="flex items-baseline justify-between gap-4">
                      <span className="text-ink">{l.name}</span>
                      <span className="font-mono text-sm text-ink-faint">{l.level}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>

          {/* skills */}
          <div className="md:col-span-5">
            <Reveal delay={0.08}>
              <h3 className="font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-faint">
                Stack
              </h3>
              <dl className="mt-6 space-y-7">
                {skillGroups.map((group) => (
                  <div key={group.label}>
                    <dt className="text-sm text-ink-muted">{group.label}</dt>
                    <dd className="mt-2 flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <span
                          key={item}
                          className="rounded-full border border-hairline bg-surface px-3 py-1 font-mono text-xs text-ink"
                        >
                          {item}
                        </span>
                      ))}
                    </dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
