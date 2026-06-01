import { useEffect } from 'react';
import Lenis from 'lenis';
import { setLenis, scrollToId } from '../lib/scroll';
import { prefersReducedMotion } from '../lib/motion';

/**
 * Buttery wheel-scroll on pointer devices via Lenis. Touch is left native
 * (already smooth on phones, and avoids hijack-jank). Disabled entirely for
 * users who ask for reduced motion. Lenis drives real scrollTop, so Motion's
 * useScroll keeps working.
 */
export function useSmoothScroll() {
  useEffect(() => {
    // Deep-link support: jump to #section on load (works with or without Lenis).
    const hash = window.location.hash.slice(1);

    if (prefersReducedMotion()) {
      if (hash) requestAnimationFrame(() => scrollToId(hash));
      return;
    }

    const lenis = new Lenis({
      lerp: 0.11,
      smoothWheel: true,
      wheelMultiplier: 1,
      syncTouch: false,
    });
    setLenis(lenis);

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    if (hash) {
      // let layout settle, then route through Lenis
      window.setTimeout(() => {
        const el = document.getElementById(hash);
        if (el) lenis.scrollTo(el, { offset: -8, immediate: true });
      }, 80);
    }

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      setLenis(null);
    };
  }, []);
}
