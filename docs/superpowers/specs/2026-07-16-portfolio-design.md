# Design Spec — alexmatosolive.com

**Date:** 2026-07-16
**Owner:** Alex Matos Olive (solo)
**Status:** Approved — ready for phased planning (GSD)

Personal portfolio for Alex Matos Olive — Computer Engineering student (UB), iOS
developer, Co-founder & CTO at WRDB. Audience: recruiters/companies for a
curricular internship (Barcelona/UB) plus general international reach.

Stack and aesthetic are locked upstream (`CLAUDE.md`, `.claude/rules/design.md`,
`.planning/STATE.md`) and are NOT re-litigated here. This spec captures the
brainstormed decisions: hero concept, information architecture, the motion
system, and content handling.

---

## 1. Locked decisions (from brainstorming)

| Decision | Choice |
|---|---|
| Hero concept | **Typographic statement over a subtle animated shader field** |
| Motion ambition | **Signature system + one "wow" moment** (Lenis + Framer Motion everywhere, one pinned GSAP sequence, shader hero) |
| Flagship app name | **WRDB** (consistent with "CTO at WRDB") |
| migraine / TravelGuide | **Minimal cards now** — name + one line + GitHub link if confirmed; no invented features/screenshots |
| WRDB links | Product site **wrdb.site** (confirmed); GitHub repo URL to be confirmed; "Live on the App Store" label with **no href yet** |
| Accent color | **Build monochrome first, then present a single-accent variant to compare** (swappable via one token) |

---

## 2. Information architecture

- **`/`** — single continuous scroll: Hero → Showcase → About → Contact, with a
  sticky minimal top nav.
- **`/blog`** — post list (real route).
- **`/blog/[slug]`** — individual MDX post.
- **Nav:** `Work · About · Blog · Contact` + a subtle **CV** button.
  On `/` the section links smooth-scroll; Blog is a route. Nav collapses to a
  minimal menu on mobile.

## 3. Visual system

- **Palette:** near-white background (~`#FAFAF9`), near-black ink, generous
  whitespace, high contrast. **Monochrome first.** A single restrained accent is
  defined as one CSS/Tailwind token so the accent variant is a one-line swap for
  side-by-side comparison.
- **Typography:** Inter variable via `next/font` (SF-like system stack fallback).
  Tight display scale for the hero; hierarchy via size/weight/tracking. No
  decorative fonts.
- **Layout:** wide max-width (~1200px), generous vertical rhythm, soft shadows
  used only where they earn it. Fully responsive.
- **Tokens:** color, type scale, spacing, radii, easing/spring curves centralized
  in the Tailwind config + CSS variables. Dark mode wired as a token flip
  (nice-to-have, not blocking).
- **Accessibility:** semantic HTML, keyboard navigable, WCAG AA contrast, alt text
  on all images. Target Lighthouse 95+ (motion budget may land ~93–97).

## 4. Motion system (the signature)

The distinctive, hand-built feel — a consistent motion *language*, not a pile of
effects. Everything below is gated behind `prefers-reduced-motion` (reduced =
instant or opacity-only) and lazy-loaded so it never blocks first paint.

- **Lenis** — global smooth/inertial scroll (~2kb). The base "premium" feel.
- **Framer Motion** — 2–3 signature spring/easing tokens reused site-wide:
  masked text reveals, staggered element arrivals, magnetic CTAs, scroll-linked
  transforms (`useScroll` / `useTransform`).
- **Shader hero** — a slow, barely-there animated grain/gradient/noise field
  behind the hero type, via lightweight GLSL (OGL, ~10kb). Static image fallback
  for reduced-motion / no-WebGL / low-power.
- **One pinned GSAP ScrollTrigger sequence** in the WRDB showcase — the "how'd
  they build this" moment (pin + choreographed reveal). GSAP is free incl. plugins.
- **Native View Transitions** for blog ↔ page navigation where supported.

**Explicitly avoided (the "AI-built" tells):** 3D everywhere, particle
explosions, purple gradients, parallax on every section, glassmorphism, emoji.

## 5. Content (real data only — never invent)

Source of truth: `content/profile.md` and `../Practicas UB/cv-en.md`.

- **Hero:** name + the real one-liner ("Building real product end to end — a
  native iOS AI app live on the App Store, serverless backends, and web…"). CTAs:
  View work, Download CV. Sub-line: CTO @ WRDB · UB · Barcelona.
- **Showcase:**
  - **WRDB** (flagship) — B2C native iOS virtual-wardrobe app powered by AI.
    Stack chips (Swift, SwiftUI, Supabase, Cloudflare Workers, Next.js, computer
    vision). Links: `https://wrdb.site`, GitHub repo (**confirm URL**),
    "Live on the App Store" label (no href yet). Pinned GSAP sequence.
  - **migraine** / **TravelGuide** — minimal cards: name + one line + GitHub link
    only if confirmed. No invented features or screenshots.
- **About + CV:** bio, UB education (BSc Computer Engineering, Sep 2023 – Jun 2027
  expected, Software Engineering specialization), skills, languages (Catalan/
  Spanish native, English professional). Downloadable CV: copy
  `../Practicas UB/cv-en.pdf` → `public/cv.pdf`.
- **Blog:** MDX pipeline + **one seed post** drafted for Alex's review (candidate
  topics: an iOS/Swift architecture note, or a Claude-Code + MCP workflow note).
  Content approved by Alex before ship — no fabricated claims.
- **Contact:** email `amatos.work@gmail.com`, LinkedIn, GitHub. Mailto-first;
  simple form optional/later. Phone kept **off** the public site.

## 6. Tech & structure

Next.js (App Router, TS strict) + Tailwind + shadcn/ui primitives + Framer Motion
+ Lenis + GSAP + OGL, MDX for blog (`@next/mdx` or `next-mdx-remote`), deployed on
Vercel. Component-driven; one concern per file; heavy motion isolated in
client-only, lazily-loaded components so Server Components stay the default.

## 7. Build order (GSD phases, per ROADMAP)

1. **001 — Scaffold + design system + motion foundation.** Next.js/TS/Tailwind/
   shadcn/Framer Motion/Lenis, design tokens (incl. easing/spring), Inter, layout
   shell + sticky nav, `npm run dev` working. **Show the base before continuing.**
2. **002 — Hero (typographic + shader) & About + CV.**
3. **003 — Showcase** (WRDB pinned sequence + minimal migraine/TravelGuide cards).
4. **004 — Blog** (MDX pipeline, list + post page, one seed post, RSS/SEO basics).
5. **005 — Contact & footer.**
6. **006 — Polish & SEO** (metadata, OG images, favicon, a11y audit, Lighthouse,
   analytics).
7. **007 — Launch** — point alexmatosolive.com to prod, verify.

Ship progressively — a minimal live site early beats a perfect one late.

## 8. Open items (non-blocking; placeholders until resolved)

- Exact GitHub repo URL(s) for WRDB / migraine / TravelGuide (or "profile link
  only"). Until confirmed, cards use the GitHub profile or omit the repo link
  rather than guess.
- WRDB App Store URL — added when available; label present, href deferred.
- Final accent color after comparing monochrome vs single-accent variant.
- Seed blog post topic + factual content, approved by Alex.
