# STATE

**Project:** Personal portfolio — alexmatosolive.com
**Owner:** Alex Matos Olive (solo)
**Status:** REDESIGN COMPLETE (R1–R5). Art-directed **editorial** monograph
("Selected Work, Vol. 1") — Bricolage Grotesque, oxblood `#6E2A35`, print grain.
Spec: `docs/superpowers/specs/2026-07-16-editorial-redesign.md`. Next: LAUNCH
(deploy to Vercel + point alexmatosolive.com at prod). Note: inverted spreads use
`className="dark bg-paper text-ink"`; figure plates use explicit light colors.
Feature spread uses CSS sticky (not GSAP pin) — GSAP no longer bundled.
**Branch:** `feat/portfolio-build`
**Needs Alex:** seed blog post is a DRAFT — review/personalize before public launch.

## Redesign phases (R)

- **R1** — Foundation + masthead (fonts, tokens, grain, cover/contents nav,
  colophon shell). Show Alex before continuing.
- **R2** — WRDB feature spread. **R3** — About (bio + marginalia + drop cap).
- **R4** — Blog editorial restyle. **R5** — Polish/SEO + Launch.

Tech/content/blog pipeline preserved; reworking fonts, tokens, grain, layout.

## Decisions locked

- Stack: Next.js (App Router, TS) + Tailwind + shadcn/ui + Framer Motion + MDX,
  deployed on Vercel. English only.
- Aesthetic: Minimal tech / Apple-like — light, high contrast, Inter, wide grid,
  monochrome accent, subtle animations.
- **Hero:** typographic statement over a subtle animated shader field.
- **Motion:** signature system + one "wow" — Lenis + Framer Motion spring language
  everywhere, one pinned GSAP sequence (WRDB showcase), shader hero. All gated
  behind `prefers-reduced-motion`.
- **Accent:** LOCKED — Apple action blue `#0071e3` (AA-safe, ~4.7:1 white text),
  restrained to primary CTAs, the logo dot, and text selection; everything else
  monochrome. One-token swap via `--brand` (set to `#0a0a0b` for full monochrome).
- Content: Showcase (WRDB flagship + minimal migraine/TravelGuide) · About + CV ·
  Blog (one seed post) · Contact.
- Approved design spec: `docs/superpowers/specs/2026-07-16-portfolio-design.md`.

## Current phase

**005 — Contact & footer. ✅ DONE.**
Plan: `.planning/phases/005-contact/005-01-PLAN.md`.
Delivered: `Contact` (id=contact) — direct links only (no form, per Alex): eyebrow,
"Let's build something.", real availability line (curricular internship, mornings,
Barcelona, UB), email mailto as focal point (magnetic), LinkedIn + GitHub. Footer
already shipped in 001. Removed now-unused `Section` primitive. Verified in prod:
links resolve (mailto/LinkedIn/GitHub), 0 console errors, desktop + mobile.

**004 — Blog (MDX). ✅ DONE.**
Plan: `.planning/phases/004-blog/004-01-PLAN.md`.
Delivered: MDX pipeline (next-mdx-remote/rsc + gray-matter), `lib/blog.ts`
(frontmatter, reading time, sorted, skip drafts), styled `mdx-components`, blog
list + SSG `[slug]` post page (generateStaticParams/Metadata), RSS at
`/blog/rss.xml`, `sitemap.ts`, `robots.ts`, RSS auto-discovery in root metadata.
Seed post `content/blog/clean-architecture-swiftui.mdx` — accurate, grounded in
WRDB, **DRAFT awaiting Alex's approval**. Verified in prod: all routes 200, RSS +
sitemap well-formed, 0 console errors, desktop + mobile.

**003 — Showcase. ✅ DONE.**
Plan: `.planning/phases/003-showcase/003-01-PLAN.md`.
Delivered: `Showcase` (id=work) with `ShowcaseFlagship` — GSAP ScrollTrigger pins a
stylized `DeviceFrame` while WRDB chapters scroll (What it is / How it's built /
Applied AI), subtle scrub rotation, wired to Lenis, `gsap.matchMedia` gates the pin
to md+ & no-reduced-motion (mobile/reduced = static stacked). Real facts from
projects.ts; wrdb.site link live, App Store + GitHub deferred ("soon"). Minimal
migraine/TravelGuide cards. Verified in prod build, 0 console errors, desktop pin +
mobile fallback. NOTE: Lenis-synced ScrollTrigger can't be verified via
window.scrollTo (bypasses Lenis) — verify visually with real scroll. DeviceFrame
has a screenshot slot for when WRDB assets arrive.

**002 — Hero (typographic + shader) & About + CV. ✅ DONE.**
Plan: `.planning/phases/002-hero-about/002-01-PLAN.md`.
Delivered: OGL shader field (`ShaderField`, lazy/ssr:false, DPR-capped, pauses on
hidden, static CSS gradient fallback, reduced-motion/no-WebGL safe); real `Hero`
with mask reveals + magnetic CTAs; `About` section (real bio/education/skills/
languages from cv-en.md, mono chip stack, CV download); `public/cv.pdf`. Verified
in production build (no StrictMode issues), zero console errors, desktop + mobile.
Note: shader `useEffect` must NOT `loseContext()` on cleanup (StrictMode remount
reuses the canvas); size the drawing buffer from a dedicated wrapper ref.

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
