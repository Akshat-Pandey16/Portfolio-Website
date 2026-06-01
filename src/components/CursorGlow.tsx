import { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { isFinePointer, prefersReducedMotion } from '../lib/motion';

const SIZE = 760; // px — the glow's diameter

/**
 * A soft accent light that trails the cursor across the WHOLE deck. It's a
 * fixed, fixed-size element moved with transform only (GPU-composited, no
 * per-frame repaint) and sits behind content, so it's seamless across every
 * section and never clips at a section edge.
 */
export function CursorGlow() {
  const [enabled] = useState(() => isFinePointer() && !prefersReducedMotion());
  const x = useMotionValue(-9999);
  const y = useMotionValue(-9999);
  const sx = useSpring(x, { stiffness: 90, damping: 22, mass: 0.6 });
  const sy = useSpring(y, { stiffness: 90, damping: 22, mass: 0.6 });

  useEffect(() => {
    if (!enabled) return;
    const onMove = (e: PointerEvent) => {
      x.set(e.clientX - SIZE / 2);
      y.set(e.clientY - SIZE / 2);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [enabled, x, y]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden
      style={{
        x: sx,
        y: sy,
        width: SIZE,
        height: SIZE,
        background:
          'radial-gradient(circle, color-mix(in oklch, var(--accent) 16%, transparent), transparent 62%)',
      }}
      className="pointer-events-none fixed left-0 top-0 -z-[5] rounded-full"
    />
  );
}
