import { useEffect, useRef } from 'react';

const HOVER_SELECTOR =
  'a, button, [role="button"], input, select, textarea, label[for], summary, [data-cursor="hover"]';

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ringX = mouseX;
    let ringY = mouseY;
    let rafId = 0;

    const onMove = (event: PointerEvent) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      document.documentElement.classList.remove('cursor-hidden');
    };

    const tick = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      rafId = requestAnimationFrame(tick);
    };

    const onOver = (event: Event) => {
      const target = event.target as Element | null;
      if (target?.closest?.(HOVER_SELECTOR)) {
        document.documentElement.classList.add('cursor-hover');
      }
    };
    const onOut = (event: Event) => {
      const target = event.target as Element | null;
      if (target?.closest?.(HOVER_SELECTOR)) {
        document.documentElement.classList.remove('cursor-hover');
      }
    };

    const onDown = () => document.documentElement.classList.add('cursor-pressed');
    const onUp = () => document.documentElement.classList.remove('cursor-pressed');
    const onLeave = () => document.documentElement.classList.add('cursor-hidden');

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', () =>
      document.documentElement.classList.remove('cursor-hidden'),
    );
    document.addEventListener('mouseover', onOver, true);
    document.addEventListener('mouseout', onOut, true);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseover', onOver, true);
      document.removeEventListener('mouseout', onOut, true);
      cancelAnimationFrame(rafId);
      document.documentElement.classList.remove(
        'cursor-hover',
        'cursor-pressed',
        'cursor-hidden',
      );
    };
  }, []);

  return (
    <>
      <div ref={ringRef} className="cursor-ring" aria-hidden />
      <div ref={dotRef} className="cursor-dot" aria-hidden />
    </>
  );
}
