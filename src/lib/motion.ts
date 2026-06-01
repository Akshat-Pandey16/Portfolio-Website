import type { Transition, Variants } from 'motion/react';

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isFinePointer(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

/** A snappy, organic spring used across reveals and HUD chrome. */
export const SPRING: Transition = { type: 'spring', stiffness: 320, damping: 32, mass: 0.7 };
export const SOFT_SPRING: Transition = { type: 'spring', stiffness: 180, damping: 26, mass: 0.9 };

/** Standard scroll-reveal: panel rises and fades in. */
export const reveal: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 0.8, 0.24, 1], delay: i * 0.06 },
  }),
};

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 12 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 0.8, 0.24, 1], delay: i * 0.05 },
  }),
};

/** Shared viewport config for whileInView reveals. */
export const VIEWPORT = { once: true, margin: '-72px' } as const;
