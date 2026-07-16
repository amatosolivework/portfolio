import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Technical writing on iOS, Swift, backends, and AI workflows.",
};

export default function BlogIndex() {
  return (
    <div className="mx-auto max-w-[1200px] px-6 pb-24 pt-36">
      <p className="font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-faint">
        Blog
      </p>
      <h1
        className="mt-4 max-w-3xl font-semibold tracking-tight text-ink"
        style={{ fontSize: "var(--text-3xl)" }}
      >
        Writing
      </h1>
      <p className="mt-6 max-w-xl text-lg text-ink-muted">
        The MDX pipeline and first article land in Phase 004.
      </p>
    </div>
  );
}
