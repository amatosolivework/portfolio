/**
 * Single source of truth for site-wide constants derived from content/profile.md.
 * Real data only — never invent links or facts.
 */

export const site = {
  name: "Alex Matos Olive",
  role: "iOS Developer · Co-founder & CTO at WRDB",
  location: "Barcelona, Spain",
  email: "amatos.work@gmail.com",
  links: {
    linkedin: "https://linkedin.com/in/alexmatosolive",
    github: "https://github.com/amatosolivework",
  },
  cv: "/cv.pdf",
} as const;

/** In-page section anchors (order = scroll order on `/`). */
export const sections = [
  { id: "work", label: "Work" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
] as const;

/** Top-nav items. Blog is a real route; the rest smooth-scroll on `/`. */
export const navItems = [
  { href: "/#work", label: "Work" },
  { href: "/#about", label: "About" },
  { href: "/blog", label: "Blog", route: true },
  { href: "/#contact", label: "Contact" },
] as const;
