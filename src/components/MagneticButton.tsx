import { useEffect, useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import type { MouseEventHandler, ReactNode } from 'react';

type Props = {
  children: ReactNode;
  onClick?: MouseEventHandler<HTMLButtonElement>;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  'aria-label'?: string;
  radius?: number;
  strength?: number;
};

export function MagneticButton({
  children,
  onClick,
  type = 'button',
  className,
  radius = 110,
  strength = 0.32,
  ...rest
}: Props) {
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 220, damping: 18, mass: 0.5 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    const el = ref.current;
    if (!el) return;

    const onMove = (event: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = event.clientX - cx;
      const dy = event.clientY - cy;
      const dist = Math.hypot(dx, dy);
      if (dist < radius) {
        const k = (1 - dist / radius) * strength;
        x.set(dx * k);
        y.set(dy * k);
      } else if (x.get() !== 0 || y.get() !== 0) {
        x.set(0);
        y.set(0);
      }
    };

    const onLeave = () => {
      x.set(0);
      y.set(0);
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('mouseleave', onLeave);
    };
  }, [radius, strength, x, y]);

  return (
    <motion.button
      ref={ref}
      type={type}
      onClick={onClick}
      style={{ x: sx, y: sy }}
      className={className}
      aria-label={rest['aria-label']}
    >
      {children}
    </motion.button>
  );
}
