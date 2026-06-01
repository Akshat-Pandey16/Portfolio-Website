import type { Variants } from 'motion/react';

export function prefersReducedMotion(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function isFinePointer(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(hover: hover) and (pointer: fine)').matches;
}

/** Standard scroll-reveal: panel rises and fades in. */
export const reveal: Variants = {
  hidden: { opacity: 0, y: 22 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: [0.22, 0.8, 0.24, 1], delay: i * 0.06 },
  }),
};

/** Shared viewport config for whileInView reveals. */
export const VIEWPORT = { once: true, margin: '-72px' } as const;
