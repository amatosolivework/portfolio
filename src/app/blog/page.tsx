import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/blog";
import { Reveal } from "@/components/motion/reveal";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Technical writing on iOS, Swift, backends, and AI-assisted workflows by Alex Matos Olive.",
};

export default function BlogIndex() {
  const posts = getAllPosts();

  return (
    <div className="mx-auto max-w-[1200px] px-6 pb-28 pt-36">
      <Reveal className="mb-4 flex items-center gap-3">
        <span className="font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-faint">
          Blog
        </span>
      </Reveal>
      <Reveal>
        <h1
          className="max-w-3xl font-semibold tracking-tight text-ink"
          style={{ fontSize: "var(--text-3xl)" }}
        >
          Notes on building real product.
        </h1>
      </Reveal>

      {posts.length === 0 ? (
        <p className="mt-12 text-lg text-ink-muted">First post coming soon.</p>
      ) : (
        <ul className="mt-16 border-t border-hairline">
          {posts.map((post) => (
            <li key={post.slug}>
              <Reveal>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block border-b border-hairline py-8 transition-colors md:py-10"
                >
                  <div className="flex flex-col gap-2 md:flex-row md:items-baseline md:justify-between md:gap-8">
                    <div className="max-w-2xl">
                      <h2 className="text-xl font-medium text-ink transition-colors group-hover:text-ink-muted md:text-2xl">
                        {post.title}
                      </h2>
                      <p className="mt-2 text-ink-muted">{post.description}</p>
                    </div>
                    <div className="shrink-0 font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-faint md:text-right">
                      <span>{formatDate(post.date)}</span>
                      <span className="mx-2" aria-hidden>
                        ·
                      </span>
                      <span>{post.readingTime} min</span>
                    </div>
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
