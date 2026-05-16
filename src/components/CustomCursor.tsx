import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';

const HOVER_SELECTOR =
  'a, button, [role="button"], input, select, textarea, label[for], summary, [data-cursor="hover"]';
const TEXT_SELECTOR = 'p, h1, h2, h3, h4, h5, h6, li, blockquote, [data-cursor="text"]';

type Variant = 'default' | 'hover' | 'text' | 'press' | 'hidden';

export function CustomCursor() {
  const [enabled] = useState(() => {
    if (typeof window === 'undefined') return false;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return false;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
    return true;
  });
  const [variant, setVariant] = useState<Variant>('hidden');

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);

  const ringX = useSpring(x, { stiffness: 380, damping: 30, mass: 0.55 });
  const ringY = useSpring(y, { stiffness: 380, damping: 30, mass: 0.55 });

  useEffect(() => {
    if (!enabled) return;

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);
      setVariant((prev) => {
        if (prev === 'hidden') return 'default';
        return prev;
      });
    };

    const resolveVariant = (target: EventTarget | null): Variant => {
      if (!(target instanceof Element)) return 'default';
      if (target.closest(HOVER_SELECTOR)) return 'hover';
      if (target.closest(TEXT_SELECTOR)) return 'text';
      return 'default';
    };

    const onOver = (event: MouseEvent) => {
      setVariant((prev) => (prev === 'press' ? prev : resolveVariant(event.target)));
    };

    const onDown = () => setVariant((prev) => (prev === 'hidden' ? prev : 'press'));
    const onUp = (event: MouseEvent) => setVariant(resolveVariant(event.target));

    const onLeave = () => setVariant('hidden');
    const onEnter = () => setVariant('default');

    window.addEventListener('pointermove', onMove, { passive: true });
    window.addEventListener('pointerdown', onDown);
    window.addEventListener('pointerup', onUp);
    document.addEventListener('mouseleave', onLeave);
    document.addEventListener('mouseenter', onEnter);
    document.addEventListener('mouseover', onOver, true);

    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointerup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      document.removeEventListener('mouseenter', onEnter);
      document.removeEventListener('mouseover', onOver, true);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const ringScale =
    variant === 'hover' ? 1.7 : variant === 'press' ? 0.85 : variant === 'text' ? 0.5 : 1;
  const ringOpacity = variant === 'hidden' ? 0 : variant === 'text' ? 0.35 : 0.6;
  const ringBg =
    variant === 'hover'
      ? 'color-mix(in oklch, var(--accent) 14%, transparent)'
      : 'transparent';
  const dotScale = variant === 'hover' ? 0 : variant === 'text' ? 0.4 : 1;
  const dotOpacity = variant === 'hidden' ? 0 : 1;

  return (
    <>
      <motion.div
        aria-hidden
        className="custom-cursor-ring"
        style={{ x: ringX, y: ringY }}
        animate={{
          scale: ringScale,
          opacity: ringOpacity,
          backgroundColor: ringBg,
        }}
        transition={{ type: 'spring', stiffness: 420, damping: 32, mass: 0.4 }}
      />
      <motion.div
        aria-hidden
        className="custom-cursor-dot"
        style={{ x, y }}
        animate={{ scale: dotScale, opacity: dotOpacity }}
        transition={{ type: 'spring', stiffness: 700, damping: 36 }}
      />
    </>
  );
}
