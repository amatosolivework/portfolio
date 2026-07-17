/**
 * Showcase data. Real, verifiable facts only (content/profile.md, cv-en.md).
 * Unknown links stay null and render as deferred — never invent URLs, App Store
 * links, screenshots, or features.
 */

export type ProjectLink = { label: string; href: string | null };

export type Chapter = {
  index: string;
  title: string;
  body: string;
};

export const wrdb = {
  name: "WRDB",
  role: "Co-founder & CTO",
  period: "2025 — present",
  tagline: "AI-powered virtual wardrobe, native on iOS.",
  chapters: [
    {
      index: "01",
      title: "What it is",
      body: "A B2C native iOS app powered by AI — personalized outfit recommendations and closet organization. Live in production on the App Store.",
    },
    {
      index: "02",
      title: "How it's built",
      body: "Swift and SwiftUI following Clean Architecture (Domain → UseCases → Data → Presentation), on a serverless backend with Supabase (PostgreSQL, Auth, Edge Functions) and Cloudflare Workers.",
    },
    {
      index: "03",
      title: "Applied AI",
      body: "Computer-vision models for clothing recognition and styling, a product site in Next.js, and an AI-assisted workflow built with Claude Code and MCP.",
    },
  ] satisfies Chapter[],
  stack: [
    "Swift",
    "SwiftUI",
    "Supabase",
    "Cloudflare Workers",
    "Next.js",
    "Computer Vision",
  ],
  links: [
    { label: "wrdb.site", href: "https://wrdb.site" },
    { label: "App Store", href: null }, // live, public URL to be added
    { label: "GitHub", href: "https://github.com/wrdb-team" }, // org (repos private)
  ] satisfies ProjectLink[],
} as const;

export type MinorProject = {
  name: string;
  kind: string;
  note: string;
};

// Real, verifiable descriptions. Repos are private, so no repo links (they'd 404).
export const minorProjects: MinorProject[] = [
  { name: "EasyFichi", kind: "Workforce time-tracking · Flutter", note: "In production" },
  { name: "Citourfy", kind: "AI walking audio-tours · Flutter", note: "In development" },
  { name: "MyGrain", kind: "Migraine tracker · Flutter", note: "In development" },
];
