import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

const SITE_URL = "https://alexmatosolive.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts().map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}`,
    lastModified: new Date(`${p.date}T00:00:00Z`),
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }));

  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.8 },
    ...posts,
  ];
}
