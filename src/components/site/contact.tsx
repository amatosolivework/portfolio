import { Reveal } from "@/components/motion/reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { site } from "@/lib/site";

const links = [
  { label: "LinkedIn", href: site.links.linkedin },
  { label: "GitHub", href: site.links.github },
];

export function Contact() {
  return (
    <section id="contact" className="scroll-mt-20 border-t border-ink">
      <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 md:py-32">
        <Reveal className="flex items-baseline justify-between font-mono text-eyebrow uppercase tracking-[0.14em] text-ink-faint">
          <span>Contact · 04</span>
          <span className="text-brand">Available for an internship</span>
        </Reveal>

        <Reveal>
          <h2
            className="mt-12 max-w-[16ch] font-semibold leading-[0.9] tracking-[-0.03em] text-ink"
            style={{ fontSize: "var(--text-display)", fontWeight: 800 }}
          >
            Let&apos;s build something.
          </h2>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-12">
          <Reveal className="md:col-span-7">
            <p className="max-w-lg text-xl leading-relaxed text-ink-muted">
              Open to a curricular internship: mornings, in Barcelona, through a UB
              agreement. If you&apos;re hiring or just want to talk shop, my inbox is
              open.
            </p>

            <div className="mt-12">
              <Magnetic strength={8} className="inline-flex">
                <a
                  href={`mailto:${site.email}`}
                  className="group inline-flex items-baseline gap-4 font-semibold tracking-tight text-ink"
                  style={{ fontSize: "var(--text-2xl)" }}
                >
                  <span className="underline decoration-hairline decoration-1 underline-offset-[8px] transition-colors group-hover:decoration-brand">
                    {site.email}
                  </span>
                  <span
                    aria-hidden
                    className="text-ink-faint transition-all duration-300 group-hover:translate-x-1 group-hover:text-brand"
                  >
                    ↗
                  </span>
                </a>
              </Magnetic>
            </div>
          </Reveal>

          <Reveal className="flex flex-col gap-3 font-mono text-eyebrow uppercase tracking-[0.12em] md:col-span-4 md:col-start-9 md:items-end md:pt-2">
            {links.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-muted transition-colors hover:text-brand"
              >
                {link.label} ↗
              </a>
            ))}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
