# STATE

**Project:** Personal portfolio — alexmatosolive.com
**Owner:** Alex Matos Olive (solo)
**Status:** Phase 001 complete (scaffold + design system + motion foundation).
Awaiting Alex's sign-off on the base before Phase 002.
**Branch:** `feat/portfolio-build`

## Decisions locked

- Stack: Next.js (App Router, TS) + Tailwind + shadcn/ui + Framer Motion + MDX,
  deployed on Vercel. English only.
- Aesthetic: Minimal tech / Apple-like — light, high contrast, Inter, wide grid,
  monochrome accent, subtle animations.
- **Hero:** typographic statement over a subtle animated shader field.
- **Motion:** signature system + one "wow" — Lenis + Framer Motion spring language
  everywhere, one pinned GSAP sequence (WRDB showcase), shader hero. All gated
  behind `prefers-reduced-motion`.
- **Accent:** monochrome first; single-accent variant to compare (one-token swap).
- Content: Showcase (WRDB flagship + minimal migraine/TravelGuide) · About + CV ·
  Blog (one seed post) · Contact.
- Approved design spec: `docs/superpowers/specs/2026-07-16-portfolio-design.md`.

## Current phase

**001 — Scaffold & design system + motion foundation. ✅ DONE.**
Plan: `.planning/phases/001-scaffold/001-01-PLAN.md`.
Delivered: Next.js 16 / React 19 / TS strict / Tailwind v4 / shadcn (Base) app;
design tokens (Apple off-white `#FBFBFD`, ink, hairline system, one swappable
`--brand`); Inter + JetBrains Mono (mono = eyebrow/index signature); motion
foundation (Lenis provider, `lib/motion.ts` springs, `Reveal`, `Magnetic`);
sticky blur-on-scroll nav + mobile sheet, footer, `Section` primitive,
typographic hero placeholder, `/blog` stub. `npm run build` clean, a11y
landmarks + visible focus + reduced-motion verified via Playwright.

## Open items (non-blocking)

- GitHub repo URL(s) for WRDB / migraine / TravelGuide (or profile-only).
- WRDB App Store URL (label present, href deferred).
- Final accent color after monochrome-vs-accent comparison.
- Seed blog post topic + factual content (Alex approves).

## Next step after 001

Phase 002 — Hero (typographic + shader) & About + CV.
