# ROADMAP — alexmatosolive.com

High-level build order (infra → data → logic → presentation → testing). Each becomes a GSD phase.

1. **001 — Scaffold & design system.** Next.js + TS + Tailwind + shadcn/ui + Framer Motion. Design tokens (colors, type scale, spacing), base layout, fonts (Inter), light theme, responsive shell. Deploy skeleton to Vercel.
2. **002 — Hero & About.** Landing hero with positioning + subtle motion. About section with bio, education, CV download.
3. **003 — Showcase.** App cards (WRD flagship, migraine, TravelGuide) with screenshots, stack chips, links. Optional detail pages.
4. **004 — Blog.** MDX pipeline, post list + post page, 1 seed article, RSS/SEO basics.
5. **005 — Contact & footer.** Links (email, LinkedIn, GitHub), optional contact form.
6. **006 — Polish & SEO.** Metadata, OG images, Lighthouse pass, a11y audit, favicon, analytics.
7. **007 — Launch.** Point alexmatosolive.com to prod, verify.

Ship progressively — a minimal live site early beats a perfect one late.
