# Design rules — alexmatosolive.com

Scoped conventions for all UI work in this repo.

## Non-negotiables

- **Must not look templated.** Every default (font, spacing, button) is a decision, not an accident. Invoke the `frontend-design` skill before building/reshaping UI.
- **Minimal tech / Apple-like:** light background, high contrast, generous whitespace, single restrained monochrome accent.
- **Typography:** Inter (or SF-like system stack). Clear hierarchy via size/weight/spacing — no decorative fonts.
- **Motion:** subtle only. Scroll reveals, gentle hover states, smooth transitions via Framer Motion. Never gimmicky. Respect `prefers-reduced-motion`.
- **Responsive & accessible:** semantic HTML, keyboard navigable, WCAG AA contrast, alt text on all images.
- **Performance:** aim for Lighthouse 95+. Next.js `<Image>`, font optimization, minimal client JS.

## Content integrity

- Use only real, verifiable facts from `content/profile.md` and `../Practicas UB/cv-en.md`.
- Never invent App Store links, metrics, or app features. If a detail is unknown, keep the card minimal instead of fabricating.
