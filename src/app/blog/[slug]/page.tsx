import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPost, formatDate } from "@/lib/blog";
import { mdxComponents } from "@/components/mdx/mdx-components";

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post || post.draft) return {};
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      type: "article",
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      url: `/blog/${post.slug}`,
    },
    alternates: { canonical: `/blog/${post.slug}` },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post || post.draft) notFound();

  return (
    <article className="mx-auto max-w-[720px] px-6 pb-28 pt-36">
      <Link
        href="/blog"
        className="font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-faint transition-colors hover:text-ink"
      >
        ← Blog
      </Link>

      <header className="mt-8 border-b border-hairline pb-10">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-eyebrow uppercase tracking-[0.12em] text-ink-faint">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden>·</span>
          <span>{post.readingTime} min read</span>
        </div>
        <h1
          className="mt-5 font-semibold tracking-tight text-ink"
          style={{ fontSize: "var(--text-3xl)" }}
        >
          {post.title}
        </h1>
        <p className="mt-5 text-lg text-ink-muted">{post.description}</p>
        {post.tags && post.tags.length > 0 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-hairline bg-surface px-3 py-1 font-mono text-xs text-ink"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="mt-4">
        <MDXRemote source={post.content} components={mdxComponents} />
      </div>

      <footer className="mt-16 border-t border-hairline pt-8">
        <Link
          href="/blog"
          className="text-sm text-ink-muted transition-colors hover:text-ink"
        >
          ← Back to all posts
        </Link>
      </footer>
    </article>
  );
}
