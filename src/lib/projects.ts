/**
 * Showcase features. Real, verifiable facts only, gathered from each project's
 * repository. Never invent links, metrics, App Store URLs, or capabilities.
 * Unknown links stay null and render as deferred ("soon").
 */

export type ProjectLink = { label: string; href: string | null };
export type Chapter = { title: string; body: string };

/** One real product screenshot in the figure sequence. */
export type Shot = {
  src: string;
  alt: string;
  /** Short screen name for the figure caption, e.g. "Home". */
  label: string;
};

export type Feature = {
  id: string;
  index: string;
  name: string;
  status: string;
  headline: string;
  lede: string;
  plateCaption: string;
  /** phone: tall portrait captures. web: wide landscape captures. Sets figure sizing. */
  shotKind?: "phone" | "web";
  /** Native pixel size shared by every shot in the sequence; figures render at this exact ratio, never cropped. */
  shotWidth?: number;
  shotHeight?: number;
  /** Figure sequence: the pinned figure turns through these as the chapters scroll. */
  shots?: Shot[];
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
    status: "TestFlight beta",
    headline: "An AI wardrobe, heading to the App Store.",
    lede: "AI-powered virtual wardrobe, native on iOS. As Co-founder and CTO I own it end to end: the app, the backend, the AI, and the web.",
    plateCaption: "TestFlight beta",
    shotKind: "phone",
    shotWidth: 1206,
    shotHeight: 2622,
    shots: [
      {
        src: "/showcase/wrdb/wrdb-01.png",
        alt: "WRDB home screen showing a daily AI outfit recommendation for travel, with save, try another, and share as OOTD actions",
        label: "Home",
      },
      {
        src: "/showcase/wrdb/wrdb-02.png",
        alt: "WRDB wardrobe screen with a 55-item closet grid organized by categories and favorites",
        label: "Wardrobe",
      },
      {
        src: "/showcase/wrdb/wrdb-03.png",
        alt: "WRDB social feed with an outfit shared as a post to friends",
        label: "Social",
      },
    ],
    chapters: [
      {
        title: "What it is",
        body: "A B2C native iOS app powered by AI, with personalized outfit recommendations and closet organization. In TestFlight beta with real users, heading to the App Store.",
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
      { label: "TestFlight", href: "https://testflight.apple.com/join/ZrMhcRRj" },
      { label: "App Store", href: null },
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
    shotKind: "web",
    shotWidth: 2912,
    shotHeight: 1608,
    shots: [
      {
        src: "/showcase/easyfichi/easyfichi-01.png",
        alt: "EasyFichi inspection board showing each employee's live shift status: on shift, finished, or pending, with clock-in times",
        label: "Inspección",
      },
      {
        src: "/showcase/easyfichi/easyfichi-02.png",
        alt: "EasyFichi collective closures screen listing paid leave and holiday periods, including a weather alert closure",
        label: "Ausencias",
      },
      {
        src: "/showcase/easyfichi/easyfichi-03.png",
        alt: "EasyFichi business settings with fiscal data, notification email, and regional timezone configuration",
        label: "Empresa",
      },
    ],
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
    status: "In beta",
    headline: "Walking audio tours, built by an AI pipeline.",
    lede: "Self-guided walking audio tours through a city, narrated point by point and fully offline. The app is Flutter; the real product is the pipeline that writes the tours.",
    plateCaption: "Barcelona · Athens",
    shotKind: "phone",
    shotWidth: 1206,
    shotHeight: 2622,
    shots: [
      {
        src: "/showcase/citourfy/citourfy-01.png",
        alt: "Citourfy explore screen with a map of Barcelona, a walking route traced through La Barceloneta, and a featured downloadable tour",
        label: "Explore",
      },
      {
        src: "/showcase/citourfy/citourfy-02.png",
        alt: "Citourfy tour detail for La Barceloneta: 22 stops over three hours, with the route listed stop by stop",
        label: "Tour detail",
      },
    ],
    chapters: [
      {
        title: "What it is",
        body: "You pick a neighborhood, start walking, and Citourfy narrates each point of interest as you reach it. You'll buy a tour once and it never expires; it downloads in full so it works with no signal.",
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
    shotKind: "phone",
    shotWidth: 1206,
    shotHeight: 2622,
    shots: [
      {
        src: "/showcase/mygrain/mygrain-01.png",
        alt: "MyGrain home screen asking how do you feel today, with suggested habits and shortcuts to reports, treatments, and habits",
        label: "Home",
      },
      {
        src: "/showcase/mygrain/mygrain-02.png",
        alt: "MyGrain quick log sheet for choosing the headache type and rating pain intensity from zero to ten",
        label: "Quick log",
      },
    ],
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
  {
    id: "buildloud",
    index: "05",
    name: "BuildLoud",
    status: "Shipped at Base Jump",
    headline: "You built the product. Let the machine market it.",
    lede: "An AI marketing machine for solo founders. Describe your brand once, and it plans, writes, and auto-publishes a full week of on-brand Instagram content. Built in a sprint at the Base Jump accelerator in Barcelona.",
    plateCaption: "Base Jump · Barcelona",
    shotKind: "web",
    shotWidth: 1440,
    shotHeight: 900,
    shots: [
      {
        src: "/showcase/buildloud/buildloud-01.png",
        alt: "BuildLoud landing hero reading you built the product, let the machine market it, next to a week of scheduled face-locked Instagram posts",
        label: "The pitch",
      },
      {
        src: "/showcase/buildloud/buildloud-02.png",
        alt: "BuildLoud architecture diagram: app context, GitHub commits, and trends feed Claude, which briefs Higgsfield and publishes to Instagram",
        label: "The loop",
      },
      {
        src: "/showcase/buildloud/buildloud-03.png",
        alt: "BuildLoud pricing: one credit equals one cent, with free, pro, and business tiers",
        label: "Pricing",
      },
    ],
    chapters: [
      {
        title: "What it is",
        body: "Founders can build but rarely have time to market. BuildLoud turns a 30-second brand description into a week of Instagram content: carousels, reels, and posts, published on autopilot so shipping code never stops for a content calendar.",
      },
      {
        title: "How it's built",
        body: "Next.js and TypeScript on Supabase. Claude plans the week and writes every post, Higgsfield and fal render the founder's face consistently across all of it, and the Instagram API publishes on schedule. Stripe handles billing, and a credit meter prices every generation.",
      },
      {
        title: "Built in a sprint",
        body: "Made with one teammate at Base Jump, a v3v-ventures-backed accelerator in Barcelona. The part I like most is the weekly loop: every Sunday it reads saves, reach, and comments, then reweights the next week around the hooks that actually landed. Face-locked generation keeps it from looking like generic AI.",
      },
    ],
    stack: ["Next.js", "TypeScript", "Supabase", "Claude (AI SDK)", "Higgsfield / fal", "Stripe"],
    links: [
      { label: "buildloud.site", href: "https://buildloud.site" },
      { label: "Base Jump '26", href: "https://thebasejump.com/hackerhouse" },
    ],
    tone: "dark",
  },
];
