import { useEffect } from 'react';
import { scrollToId } from '../lib/scroll';

/**
 * Native scroll is GPU-composited and never janks, so we lean on it rather
 * than a JS scroll-hijack library — buttery on every device. This hook only
 * handles deep-links: jump to #section when the page loads with a hash.
 */
export function useSmoothScroll() {
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (!hash) return;
    const id = window.setTimeout(() => scrollToId(hash), 60);
    return () => window.clearTimeout(id);
  }, []);
}
