import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/blog";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Technical writing on iOS, Swift, backends, and AI-assisted workflows by Alex Matos Olive.",
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-[1400px] px-6 pb-28 pt-32 md:px-10 md:pt-40">
      <div className="flex items-baseline justify-between border-t border-ink pt-4 font-mono text-eyebrow uppercase tracking-[0.14em] text-ink">
        <span>Writing · Vol. 1</span>
        <span className="text-ink-faint">Index</span>
      </div>

      <h1
        className="mt-12 max-w-[12ch] font-semibold leading-[0.9] tracking-[-0.03em] text-ink"
        style={{ fontSize: "var(--text-display)", fontWeight: 800 }}
      >
        Notes on building.
      </h1>

      {posts.length === 0 ? (
        <p className="mt-16 text-lg text-ink-muted">First entry coming soon.</p>
      ) : (
        <ul className="mt-20 border-t border-hairline">
          {posts.map((post, i) => (
            <li key={post.slug}>
              <Reveal>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group grid grid-cols-1 items-baseline gap-4 border-b border-hairline py-8 md:grid-cols-12 md:gap-6 md:py-10"
                >
                  <span className="font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-faint md:col-span-1">
                    № {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="md:col-span-8">
                    <h2 className="font-semibold tracking-tight text-ink transition-colors group-hover:text-brand" style={{ fontSize: "var(--text-2xl)" }}>
                      {post.title}
                    </h2>
                    <p className="mt-2 max-w-xl text-ink-muted">{post.description}</p>
                  </div>
                  <div className="font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-faint md:col-span-3 md:text-right">
                    {formatDate(post.date)}
                    <br />
                    {post.readingTime} min
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
