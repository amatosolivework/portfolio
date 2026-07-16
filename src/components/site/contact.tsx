import { Reveal } from "@/components/motion/reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { site } from "@/lib/site";

const links = [
  { label: "LinkedIn", href: site.links.linkedin },
  { label: "GitHub", href: site.links.github },
];

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-24 border-t border-hairline">
      <div className="mx-auto max-w-[1200px] px-6 py-24 md:py-36">
        <Reveal className="mb-6 flex items-center gap-3">
          <span className="font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-faint">
            03
          </span>
          <span className="font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-faint">
            Contact
          </span>
        </Reveal>

        <Reveal>
          <h2
            className="max-w-3xl font-semibold tracking-tight text-ink"
            style={{ fontSize: "var(--text-3xl)" }}
          >
            Let&apos;s build something.
          </h2>
        </Reveal>

        <Reveal delay={0.05}>
          <p className="mt-6 max-w-xl text-lg text-ink-muted">
            Open to a curricular internship — mornings, in Barcelona, through a UB
            agreement. If you&apos;re hiring or just want to talk shop, my inbox is
            open.
          </p>
        </Reveal>

        {/* email as the focal point */}
        <Reveal delay={0.1} className="mt-14">
          <Magnetic strength={8} className="inline-flex">
            <a
              href={`mailto:${site.email}`}
              className="group inline-flex items-center gap-4 font-semibold tracking-tight text-ink"
              style={{ fontSize: "var(--text-2xl)" }}
            >
              <span className="underline decoration-hairline decoration-1 underline-offset-[6px] transition-colors group-hover:decoration-ink">
                {site.email}
              </span>
              <span
                aria-hidden
                className="text-ink-faint transition-all duration-300 group-hover:translate-x-1 group-hover:text-ink"
              >
                ↗
              </span>
            </a>
          </Magnetic>
        </Reveal>

        {/* secondary links */}
        <Reveal delay={0.15} className="mt-12 flex flex-wrap items-center gap-x-8 gap-y-3">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-ink"
            >
              <span className="font-mono text-eyebrow uppercase tracking-[0.12em]">
                {link.label}
              </span>
              <span aria-hidden className="transition-transform group-hover:translate-x-0.5">
                ↗
              </span>
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
