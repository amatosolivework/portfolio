import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Reveal } from "@/components/motion/reveal";

type SectionProps = {
  id: string;
  /** Two-digit index rendered in mono as a structural marker. */
  index?: string;
  eyebrow?: string;
  title?: ReactNode;
  className?: string;
  children?: ReactNode;
};

export function Section({
  id,
  index,
  eyebrow,
  title,
  className,
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn("scroll-mt-24 border-t border-hairline", className)}
      aria-labelledby={title ? `${id}-title` : undefined}
    >
      <div className="mx-auto max-w-[1200px] px-6 py-24 md:py-32">
        {(eyebrow || index) && (
          <Reveal className="mb-6 flex items-center gap-3">
            {index && (
              <span className="font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-faint">
                {index}
              </span>
            )}
            {eyebrow && (
              <span className="font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-faint">
                {eyebrow}
              </span>
            )}
          </Reveal>
        )}
        {title && (
          <Reveal>
            <h2
              id={`${id}-title`}
              className="max-w-3xl text-2xl font-semibold tracking-tight text-ink"
              style={{ fontSize: "var(--text-2xl)" }}
            >
              {title}
            </h2>
          </Reveal>
        )}
        {children}
      </div>
    </section>
  );
}
