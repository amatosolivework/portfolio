import type { Transition, Variants } from "framer-motion";

/**
 * Signature motion language for the site.
 * A small, reused set of springs/easings so every reveal feels like the same hand.
 * Ref: docs/superpowers/specs/2026-07-16-portfolio-design.md §4
 */

// Matches the CSS easing tokens in globals.css.
export const easeOutExpo = [0.16, 1, 0.3, 1] as const;
export const easeOutQuart = [0.22, 1, 0.36, 1] as const;

/** Primary spring — used for arrivals and layout. Calm, slightly weighty. */
export const spring: Transition = {
  type: "spring",
  stiffness: 220,
  damping: 30,
  mass: 0.9,
};

/** Snappier spring for interactive elements (magnetic buttons, hovers). */
export const springSnappy: Transition = {
  type: "spring",
  stiffness: 380,
  damping: 26,
  mass: 0.6,
};

/** Standard reveal: rise + fade with the signature easing. */
export const reveal: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeOutExpo },
  },
};

/** Container that staggers its children's reveal. */
export const staggerContainer = (stagger = 0.08, delay = 0): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

/** Word/line mask reveal — for editorial hero type. */
export const maskUp: Variants = {
  hidden: { y: "110%" },
  visible: {
    y: "0%",
    transition: { duration: 0.9, ease: easeOutExpo },
  },
};

export const viewportOnce = { once: true, margin: "0px 0px -12% 0px" } as const;
