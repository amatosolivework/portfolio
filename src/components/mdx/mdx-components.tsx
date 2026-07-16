import type { MDXComponents } from "mdx/types";
import Link from "next/link";

/**
 * MDX element styling, tuned to the design system (Apple-minimal, Inter body,
 * JetBrains Mono for code). Kept as plain server components — no prose dependency.
 */
export const mdxComponents: MDXComponents = {
  h2: (props) => (
    <h2
      className="mt-14 scroll-mt-24 text-2xl font-semibold tracking-tight text-ink"
      {...props}
    />
  ),
  h3: (props) => (
    <h3
      className="mt-10 scroll-mt-24 text-xl font-medium tracking-tight text-ink"
      {...props}
    />
  ),
  p: (props) => (
    <p className="mt-6 text-lg leading-8 text-ink-muted" {...props} />
  ),
  a: ({ href = "", ...props }) => (
    <Link
      href={href}
      className="text-ink underline decoration-hairline underline-offset-4 transition-colors hover:decoration-ink"
      {...props}
    />
  ),
  ul: (props) => (
    <ul className="mt-6 list-disc space-y-2 pl-6 text-lg text-ink-muted marker:text-ink-faint" {...props} />
  ),
  ol: (props) => (
    <ol className="mt-6 list-decimal space-y-2 pl-6 text-lg text-ink-muted marker:text-ink-faint" {...props} />
  ),
  li: (props) => <li className="leading-8 pl-1" {...props} />,
  blockquote: (props) => (
    <blockquote
      className="mt-6 border-l-2 border-ink pl-5 text-lg italic text-ink"
      {...props}
    />
  ),
  hr: () => <hr className="my-12 border-hairline" />,
  strong: (props) => <strong className="font-semibold text-ink" {...props} />,
  code: (props) => (
    <code
      className="rounded-md border border-hairline bg-secondary px-1.5 py-0.5 font-mono text-[0.85em] text-ink"
      {...props}
    />
  ),
  pre: (props) => (
    <pre
      className="mt-6 overflow-x-auto rounded-xl border border-hairline bg-secondary p-5 font-mono text-sm leading-6 text-ink [&_code]:border-0 [&_code]:bg-transparent [&_code]:p-0"
      {...props}
    />
  ),
};
