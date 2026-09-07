import type { Variants } from "framer-motion";

/**
 * Shared motion language.
 *
 * Two curves, one rule:
 * - EASE_OUT     for things arriving on screen (reveals, entrances).
 * - EASE_IN_OUT  for things transforming between two on-screen states
 *                (layout morphs, menus, sticky nav).
 */
export const EASE_OUT = [0.22, 1, 0.36, 1] as const;
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;

export const DUR = {
  fast: 0.3,
  base: 0.5,
  slow: 0.8,
} as const;

/** Distance, in px, that revealed content travels upward into place. */
export const REVEAL_OFFSET = 40;

/** Viewport config shared by every scroll-triggered group. */
export const REVEAL_VIEWPORT = { once: true, margin: "-100px" } as const;

/** Parent of a staggered grid. Pair with `itemVariants` on each child. */
export const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.12 },
  },
};

/** Child of a staggered grid. */
export const itemVariants: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DUR.slow, ease: EASE_OUT },
  },
};
