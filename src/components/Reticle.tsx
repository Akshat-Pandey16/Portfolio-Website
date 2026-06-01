import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { isFinePointer, prefersReducedMotion } from '../lib/motion';

const HOVER_SELECTOR =
  'a, button, [role="button"], input, select, textarea, label[for], summary, [data-cursor="hover"]';

type Variant = 'default' | 'hover' | 'press' | 'hidden';

/**
 * A control-room targeting reticle: a precise center dot plus a spring-lagged
 * corner-bracket frame that locks onto interactive elements. Transform-only.
 */
export function Reticle() {
  const [enabled] = useState(() => isFinePointer() && !prefersReducedMotion());
  const [variant, setVariant] = useState<Variant>('hidden');

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const fx = useSpring(x, { stiffness: 420, damping: 34, mass: 0.5 });
  const fy = useSpring(y, { stiffness: 420, damping: 34, mass: 0.5 });

  useEffect(() => {
    if (!enabled) return;

    const resolve = (target: EventTarget | null): Variant => {
      if (!(target instanceof Element)) return 'default';
      return target.closest(HOVER_SELECTOR) ? 'hover' : 'default';
    };

    const onMove = (e: PointerEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setVariant((prev) => (prev === 'hidden' ? 'default' : prev));
    };
    const onOver = (e: MouseEvent) =>
      setVariant((prev) => (prev === 'press' ? prev : resolve(e.target)));
    const onDown = () => setVariant((prev) => (prev === 'hidden' ? prev : 'press'));
    const onUp = (e: MouseEvent) => setVariant(resolve(e.target));
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

  const frameScale = variant === 'hover' ? 1.55 : variant === 'press' ? 0.78 : 1;
  const frameOpacity = variant === 'hidden' ? 0 : variant === 'hover' ? 1 : 0.7;
  const dotScale = variant === 'hover' ? 0.4 : variant === 'press' ? 1.4 : 1;
  const dotOpacity = variant === 'hidden' ? 0 : 1;

  return (
    <>
      {/* corner-bracket frame, spring-lagged */}
      <motion.div
        aria-hidden
        className="reticle"
        style={{ x: fx, y: fy }}
        animate={{
          scale: frameScale,
          opacity: frameOpacity,
          rotate: variant === 'hover' ? 45 : 0,
        }}
        transition={{ type: 'spring', stiffness: 380, damping: 30, mass: 0.5 }}
      >
        <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
          {[
            'M2 9 L2 2 L9 2',
            'M21 2 L28 2 L28 9',
            'M28 21 L28 28 L21 28',
            'M9 28 L2 28 L2 21',
          ].map((d) => (
            <path
              key={d}
              d={d}
              stroke="var(--accent)"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          ))}
        </svg>
      </motion.div>
      {/* precise center dot */}
      <motion.div
        aria-hidden
        className="reticle"
        style={{ x, y }}
        animate={{ scale: dotScale, opacity: dotOpacity }}
        transition={{ type: 'spring', stiffness: 800, damping: 38 }}
      >
        <span className="block h-[5px] w-[5px] rounded-full bg-[var(--accent)]" />
      </motion.div>
    </>
  );
}
