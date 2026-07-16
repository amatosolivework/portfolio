# Design Spec v2 — Editorial redesign ("Selected Work, Vol. 1")

**Date:** 2026-07-16
**Supersedes:** the *aesthetic* of `2026-07-16-portfolio-design.md` (Apple-minimal).
Tech stack, content, and blog pipeline are unchanged.
**Status:** Approved concept + forks; building.

## Why

Alex's feedback: the v1 site, though polished, still reads as AI-coded — because
the *structure* is the canonical portfolio template (sticky nav, centered hero +
two pills, `01/02/03` mono-eyebrow sections, chips, device mockup, big-email
contact, Inter + monochrome). Rearranging a template still reads as a template.
He wants to stand out and be creative. Chosen direction: **art-directed
editorial**, **editorial-grotesque** personality.

## Concept

A **designed monograph** — *Selected Work, Vol. 1* — not a marketing page. It has
a masthead, a contents index (which is the nav), feature articles, figures with
captions, marginalia, and a colophon. Structure carries editorial meaning; there
are no decorative `01/02/03` eyebrows.

## Type & surface (decisions)

- **Display + body:** Bricolage Grotesque (variable) — huge, tight headlines;
  text weights for body. The characterful anti-Inter.
- **Printed layer:** monospace (JetBrains Mono) for captions, data, margin notes,
  folios, the colophon.
- **Paper:** cool near-white `#FAFAF9` (NOT warm cream). Ink near-black.
- **Accent ink:** deep oxblood **`#6E2A35`** — used sparingly (links, folios,
  drop cap, one hot detail). One-token swap. AA-safe with white text.
- **Texture:** site-wide subtle **print grain** via a fixed SVG `feTurbulence`
  overlay (~3–5% opacity, pointer-events none). Replaces the OGL gradient shader.
- **Inverted spread:** at least one section flips to a dark "spread" for rhythm.

## Structure (rebuilt)

- **Masthead / cover:** name set enormous in Bricolage, breaking across lines,
  pushed off-axis. A small mono colophon block (role · Barcelona · available ·
  Vol. 1). The **contents index doubles as navigation** with page-style markers.
- **Navigation:** editorial running header (name + "Vol. 1 — Selected Work" +
  contents), sticky and minimal; not a pill nav. Keyboard accessible, mobile menu.
- **WRDB = feature article:** full-bleed, likely inverted (dark) spread; big
  display lede; the app shown as **figures with mono captions** ("Fig. 1 — …");
  stack as margin notes. The pinned GSAP sequence stays, reframed as an article.
- **About = bio column + marginalia:** measured column with a **drop cap**;
  education / languages / skills in the margin as a data sidebar (not chips).
- **Blog:** editorial index of writing; article pages with drop caps + pull-quotes.
- **Contact = colophon:** closing credits of the issue — "Built & edited by Alex
  Matos Olive · Barcelona · set in Bricolage Grotesque" — email/links as credits.

## Motion & signature

- **Signature:** the masthead **typesets itself on load** (words settle into the
  grid). Reuse Framer Motion; Lenis smooth scroll stays.
- Reveals become editorial: rules draw in, columns rise. Respect reduced-motion.
- The pinned WRDB feature is the scroll "wow." Drop the gradient shader.

## Reuse (not a rewrite)

Keep: Next.js/TS/Tailwind/shadcn, Lenis, GSAP, Framer Motion, MDX blog pipeline,
`lib/site.ts` / `lib/projects.ts` / `lib/blog.ts`, all real content, RSS/sitemap/
robots. Rework: fonts, tokens, grain, and the layout/structure components.

## Build order (redesign phases)

- **R1 — Foundation + masthead.** Fonts (Bricolage + mono), tokens (paper/ink/
  oxblood/grain), SVG grain overlay, editorial masthead/cover + contents nav +
  colophon footer shell. **Show Alex before continuing.**
- **R2 — WRDB feature spread** (inverted, figures/captions, pinned sequence).
- **R3 — About** (bio column + marginalia + drop cap).
- **R4 — Blog** editorial restyle (index + article: drop caps, pull-quotes).
- **R5 — Polish & SEO** (a11y/contrast re-audit for oxblood + inverted spread,
  OG, favicon, Lighthouse), then **Launch**.

## Open items (carried)

- WRDB assets (App Store URL, repo, screenshots); migraine/TravelGuide details.
- Seed blog post still a DRAFT for Alex's review.
