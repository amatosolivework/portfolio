# Kickoff prompt — paste into a fresh Claude Code session in this directory

---

Build my personal portfolio at **alexmatosolive.com**. This directory is already set up — read `CLAUDE.md`, `content/profile.md`, `.claude/rules/design.md`, and `.planning/ROADMAP.md` + `STATE.md` first; they contain the locked decisions, my real profile data, and the build order. Do not re-litigate the stack or aesthetic — they're decided.

**What it is:** a distinctive, fast personal portfolio for Alex Matos Olive — Computer Engineering student (UB), iOS developer, Co-founder & CTO at WRDB. Audience: recruiters/companies for a curricular internship + general international reach.

**Stack (locked):** Next.js (App Router, TypeScript) + Tailwind CSS + shadcn/ui + Framer Motion + MDX, deployed on Vercel. English only.

**Aesthetic (locked):** Minimal tech / Apple-like — light background, high contrast, generous whitespace, Inter typography, wide grid, soft shadows, a single restrained monochrome accent, and *subtle* motion (scroll reveals, gentle hovers). It must NOT read as a template — product-quality polish that fits an iOS/Swift engineer.

**Sections:** Hero/intro · Showcase (WRD flagship, migraine, TravelGuide — real screenshots, stack, App Store/GitHub links) · About + downloadable CV · Blog (MDX, ship with one seed post) · Contact (email, LinkedIn, GitHub).

**Content:** Use only the real data in `content/profile.md` and `../Practicas UB/cv-en.md`. Copy `../Practicas UB/cv-en.pdf` into `public/cv.pdf` for download. Never invent App Store links, metrics, or app features — if a detail is unknown, keep that card minimal.

**How to work (my execution philosophy):**
1. Start with the **`superpowers:brainstorming`** skill to nail the hero concept, information architecture, and visual direction with me before writing code.
2. Then plan with **`gsd:plan-phase`** and execute with **`gsd:execute-phase`**, phase by phase per the ROADMAP. Update `.planning/STATE.md` as you go.
3. Invoke **`frontend-design`** before building UI so it doesn't look default.
4. Finish each phase with **`superpowers:verification-before-completion`** — run the build, check it renders, confirm before claiming done.
5. Commit with `{type}({phase-##}): {description}`.

Start with Phase 001 (scaffold + design system): initialize the Next.js app here, set up Tailwind + shadcn/ui + Framer Motion + fonts + design tokens, build the responsive layout shell, get `npm run dev` working, and show me the base before moving on. Ship progressively — a minimal live site early beats a perfect one late.

Ask me for anything you genuinely need (App Store URLs, screenshots, migraine/TravelGuide details) rather than inventing it.
