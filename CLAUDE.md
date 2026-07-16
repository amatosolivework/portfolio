# CLAUDE.md — Portfolio (alexmatosolive.com)

Personal portfolio for **Alex Matos Olive** — Computer Engineering student (UB), iOS developer, Co-founder & CTO at WRDB. Solo project.

## Purpose

A distinctive, fast, personal portfolio to showcase real shipped products (iOS apps), an about/CV section, contact, and a technical blog. Primary audience: recruiters and companies for a curricular internship (Barcelona/UB) and general international reach.

## Stack

- **Next.js** (App Router, TypeScript) + **React**
- **Tailwind CSS** for styling; **shadcn/ui** for base primitives where useful
- **Framer Motion** for subtle micro-animations
- **MDX** for the blog
- Deployed on **Vercel** (domain `alexmatosolive.com` already lives there)
- Language: **English only** (no i18n)

## Design system — Minimal tech / Apple-like

- Light background, high contrast, generous whitespace
- Typography: **Inter** (or SF-like system stack) — clean, no decorative fonts
- Wide grid, soft shadows, monochrome accent (single restrained accent color)
- **Subtle** animations only — smooth reveals on scroll, gentle hover states. Nothing flashy or gimmicky
- Must NOT read as a template. Intentional spacing, real hierarchy, product-quality polish (fits an iOS/Swift profile)
- Fully responsive, accessible (semantic HTML, keyboard nav, good contrast), dark-mode optional/nice-to-have

## Content sections

1. **Hero / intro** — name, one-line positioning, subtle CTA
2. **Showcase** — real apps: WRD (flagship, he's CTO), migraine, TravelGuide. Screenshots, stack, links to App Store / GitHub
3. **About + CV** — bio, education (UB Computer Engineering), downloadable CV (EN)
4. **Blog** — MDX technical articles (structure ready, can ship with 1 seed post)
5. **Contact** — email, LinkedIn, GitHub. Simple form optional

Real profile data lives in `content/profile.md`. Source CV: `../Practicas UB/cv-en.md`. Use real content, never Lorem Ipsum or invented facts.

## Conventions

- Correctness and polish over speed. Think in layers: infra → data → logic → presentation → testing.
- TypeScript strict. Component-driven. Keep it clean and idiomatic Next.js App Router.
- Commit convention: `{type}({phase-##}): {description}` — `feat`, `fix`, `docs`, `refactor`, `test`.
- GSD planning lives in `.planning/` — check `STATE.md` before starting.

## Model routing (pin `model:` in every agent)

- Orchestration / hardest work: Opus 4.8
- Implementation subagents / executors / review: Sonnet 4.6
- Exploration / search / docs: Haiku 4.5

## Safety

- Never commit secrets. Vercel env vars are set in the dashboard, not committed.
- Deploys go through Vercel (git push to main auto-deploys, or `vercel` CLI). Confirm before first production deploy.
