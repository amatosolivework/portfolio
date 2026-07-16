import { Reveal } from "@/components/motion/reveal";
import { ShowcaseFlagship } from "@/components/site/showcase-flagship";
import { minorProjects } from "@/lib/projects";

export function Showcase() {
  return (
    <section id="work" className="scroll-mt-24 border-t border-hairline">
      <div className="mx-auto max-w-[1200px] px-6 py-24 md:py-32">
        <Reveal className="mb-16 flex items-center gap-3">
          <span className="font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-faint">
            01
          </span>
          <span className="font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-faint">
            Selected work
          </span>
        </Reveal>

        <ShowcaseFlagship />

        {/* other projects — minimal by design until assets are confirmed */}
        <div className="mt-24 border-t border-hairline pt-16 md:mt-32">
          <Reveal>
            <h3 className="font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-faint">
              Also building
            </h3>
          </Reveal>
          <div className="mt-8 grid gap-px overflow-hidden rounded-2xl border border-hairline bg-hairline sm:grid-cols-2">
            {minorProjects.map((p) => (
              <Reveal key={p.name} className="bg-surface p-8">
                <div className="flex items-baseline justify-between gap-4">
                  <h4 className="text-xl font-medium text-ink">{p.name}</h4>
                  <span className="font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-faint">
                    {p.note}
                  </span>
                </div>
                <p className="mt-2 text-ink-muted">{p.kind}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
