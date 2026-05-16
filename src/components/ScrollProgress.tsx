import { motion, useScroll, useSpring } from 'motion/react';

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 220,
    damping: 30,
    mass: 0.4,
  });

  return (
    <motion.div
      aria-hidden
      style={{ scaleX, transformOrigin: '0% 50%' }}
      className="pointer-events-none fixed inset-x-0 top-0 z-[55] h-[2px] bg-gradient-to-r from-transparent via-[var(--accent)] to-transparent"
    />
  );
}
