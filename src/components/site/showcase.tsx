import { Reveal } from "@/components/motion/reveal";
import { ShowcaseFlagship } from "@/components/site/showcase-flagship";
import { minorProjects } from "@/lib/projects";

export function Showcase() {
  return (
    <>
      <ShowcaseFlagship />

      {/* Also building — editorial index, minimal by design until assets land */}
      <section className="border-t border-ink">
        <div className="mx-auto max-w-[1400px] px-6 py-20 md:px-10 md:py-28">
          <Reveal className="flex items-baseline justify-between font-mono text-eyebrow uppercase tracking-[0.14em] text-ink-faint">
            <span>Also building — 02</span>
            <span>Other work</span>
          </Reveal>

          <ul className="mt-10 border-t border-hairline">
            {minorProjects.map((p) => (
              <li key={p.name}>
                <Reveal className="flex items-baseline justify-between gap-6 border-b border-hairline py-7">
                  <div className="flex items-baseline gap-6">
                    <h3
                      className="font-semibold tracking-tight text-ink"
                      style={{ fontSize: "var(--text-2xl)" }}
                    >
                      {p.name}
                    </h3>
                    <span className="hidden text-ink-muted sm:inline">{p.kind}</span>
                  </div>
                  <span className="shrink-0 font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-faint">
                    {p.note}
                  </span>
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
