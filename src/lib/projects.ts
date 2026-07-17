/**
 * Showcase features. Real, verifiable facts only, gathered from each project's
 * repository. Never invent links, metrics, App Store URLs, or capabilities.
 * Unknown links stay null and render as deferred ("soon").
 */

export type ProjectLink = { label: string; href: string | null };
export type Chapter = { title: string; body: string };

export type Feature = {
  id: string;
  index: string;
  name: string;
  status: string;
  headline: string;
  lede: string;
  plateCaption: string;
  chapters: Chapter[];
  stack: string[];
  links: ProjectLink[];
  tone: "dark" | "light";
};

export const features: Feature[] = [
  {
    id: "work", // nav anchor for "Selected Work"
    index: "01",
    name: "WRDB",
    status: "Live on the App Store",
    headline: "An AI wardrobe, live on the App Store.",
    lede: "AI-powered virtual wardrobe, native on iOS. As Co-founder and CTO I own it end to end: the app, the backend, the AI, and the web.",
    plateCaption: "Live on the App Store",
    chapters: [
      {
        title: "What it is",
        body: "A B2C native iOS app powered by AI, with personalized outfit recommendations and closet organization. Live in production on the App Store.",
      },
      {
        title: "How it's built",
        body: "Swift and SwiftUI following Clean Architecture (Domain → UseCases → Data → Presentation), on a serverless backend with Supabase and Cloudflare Workers.",
      },
      {
        title: "Applied AI",
        body: "Computer-vision models for clothing recognition and styling, a product site in Next.js, and an AI-assisted workflow built with Claude Code and MCP.",
      },
    ],
    stack: ["Swift", "SwiftUI", "Supabase", "Cloudflare Workers", "Next.js", "Computer Vision"],
    links: [
      { label: "wrdb.site", href: "https://wrdb.site" },
      { label: "App Store", href: null },
      { label: "GitHub", href: "https://github.com/wrdb-team" },
    ],
    tone: "dark",
  },
  {
    id: "easyfichi",
    index: "02",
    name: "EasyFichi",
    status: "In production",
    headline: "A labor law, turned into software people trust.",
    lede: "A workforce time-tracking and compliance platform for Spanish small businesses, built around the mandatory workday-registration law. In production, used daily by a real company.",
    plateCaption: "In production",
    chapters: [
      {
        title: "What it is",
        body: "Spain requires every company to log working hours, and most small businesses still do it on paper. EasyFichi lets a shop clock people in from a phone, a counter tablet, or the web, and stay on the right side of the law.",
      },
      {
        title: "How it's built",
        body: "One Flutter codebase becomes an admin app, an employee app, and a kiosk, across web, iOS, and Android, in four languages. Behind it sit Node.js Cloud Functions over Firestore, a modular compliance engine, and Claude parsing the documents that arrive by email.",
      },
      {
        title: "The hard part",
        body: "Anyone can build a clock-in screen. The real work was making the records defensible in a labor inspection: SHA-256 hash-chained audit trails, and a risk radar that flags what is not compliant before an inspector does.",
      },
    ],
    stack: ["Flutter", "Firebase", "Firestore", "Cloud Functions", "Claude AI", "Astro"],
    links: [
      { label: "easyfichi.es", href: "https://easyfichi.es" },
      { label: "Gestor portal", href: "https://partners.easyfichi.es" },
    ],
    tone: "light",
  },
  {
    id: "citourfy",
    index: "03",
    name: "Citourfy",
    status: "In production",
    headline: "Walking audio tours, built by an AI pipeline.",
    lede: "Self-guided walking audio tours through a city, narrated point by point and fully offline. The app is Flutter; the real product is the pipeline that writes the tours.",
    plateCaption: "Barcelona · Athens",
    chapters: [
      {
        title: "What it is",
        body: "You pick a neighborhood, start walking, and Citourfy narrates each point of interest as you reach it. You buy a tour once, it never expires, and it downloads in full so it works with no signal.",
      },
      {
        title: "The pipeline is the product",
        body: "The tours are not written by hand. A nine-step pipeline discovers points from OpenStreetMap, Wikipedia, and Google Places, has an AI generate the narration, computes real walking routes, and packs it into versioned bundles on Firebase.",
      },
      {
        title: "Cheap, fast, and honest",
        body: "The hard part was an AI pipeline that scales without hallucinating. Every model sits behind one interface with cost logging, bulk work runs through a batch API at a fraction of the price, and every fact is anchored to a real source before it ships.",
      },
    ],
    stack: ["Flutter", "Firebase", "Cloud Functions", "Claude API", "React + Vite", "Google Places / OSM"],
    links: [{ label: "App Store", href: null }],
    tone: "dark",
  },
  {
    id: "mygrain",
    index: "04",
    name: "MyGrain",
    status: "In development",
    headline: "Track migraines. Understand the patterns.",
    lede: "A migraine tracker for iOS and Android that turns detailed episode logs into charts, reports, and clinical alerts. A full Flutter rewrite of an earlier native iOS app, on the same backend.",
    plateCaption: "iOS · Android",
    chapters: [
      {
        title: "Understand, don't just log",
        body: "People record every episode in detail: type, pain, triggers, symptoms, and what actually helped. MyGrain turns that history into patterns you can act on, not just a diary.",
      },
      {
        title: "One backend, two apps, zero migration",
        body: "It is a Flutter rewrite of an existing iOS app, and current users could not lose anything. So it keeps the same Firebase backend and reads the old document shapes, with strict Clean Architecture and an offline queue so a save never fails silently.",
      },
      {
        title: "Where it gets interesting",
        body: "The parts I am proud of are hidden: ICHD-3 chronic classification, a medication-overuse alert over a rolling window, a weather correlation engine with no API key, and GDPR deletion that wipes every trace the moment an account is removed.",
      },
    ],
    stack: ["Flutter", "Dart", "Riverpod", "Firebase", "Firestore", "Hive"],
    links: [{ label: "App Store", href: null }],
    tone: "light",
  },
];
