import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type PostFrontmatter = {
  title: string;
  description: string;
  date: string; // ISO (YYYY-MM-DD)
  tags?: string[];
  draft?: boolean;
};

export type PostMeta = PostFrontmatter & {
  slug: string;
  readingTime: number; // minutes
};

export type Post = PostMeta & { content: string };

function readingTime(text: string): number {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function listSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx$/, ""));
}

export function getPost(slug: string): Post | null {
  const file = path.join(BLOG_DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  const fm = data as PostFrontmatter;
  return {
    ...fm,
    slug,
    readingTime: readingTime(content),
    content,
  };
}

export function getAllPosts(): PostMeta[] {
  return listSlugs()
    .map((slug) => getPost(slug))
    .filter((p): p is Post => p !== null && !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map(({ content: _content, ...meta }) => meta);
}

export function formatDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}
