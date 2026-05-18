import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

const KONAMI = [
  'ArrowUp',
  'ArrowUp',
  'ArrowDown',
  'ArrowDown',
  'ArrowLeft',
  'ArrowRight',
  'ArrowLeft',
  'ArrowRight',
  'b',
  'a',
];

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  return tag === 'input' || tag === 'textarea' || target.isContentEditable;
}

export function EasterEgg() {
  const [confetti, setConfetti] = useState(false);
  const lastKeyRef = useRef<{ key: string; at: number } | null>(null);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      const now = performance.now();
      const prev = lastKeyRef.current;
      if (prev && now - prev.at < 800) {
        if (prev.key === 'g' && key === 't') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          lastKeyRef.current = null;
          return;
        }
        if (prev.key === 'g' && key === 'b') {
          window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
          lastKeyRef.current = null;
          return;
        }
      }
      lastKeyRef.current = { key, at: now };
    };

    let progress = 0;
    const onKonami = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;
      const expected = KONAMI[progress];
      const got = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      if (got === expected) {
        progress += 1;
        if (progress === KONAMI.length) {
          progress = 0;
          setConfetti(true);
          window.setTimeout(() => setConfetti(false), 5000);
        }
      } else {
        progress = got === KONAMI[0] ? 1 : 0;
      }
    };

    window.addEventListener('keydown', onKey);
    window.addEventListener('keydown', onKonami);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keydown', onKonami);
    };
  }, []);

  return (
    <AnimatePresence>
      {confetti && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center"
          aria-live="polite"
        >
          <Confetti />
          <motion.div
            initial={{ scale: 0.6, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.7, opacity: 0, y: -10 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            className="rounded-3xl border border-[var(--border-strong)] bg-[var(--bg-elev)] px-7 py-5 text-center shadow-2xl shadow-black/30"
          >
            <p className="font-mono text-[10px] uppercase tracking-[0.32em] text-[var(--accent)]">
              ↑↑↓↓←→←→BA
            </p>
            <p className="font-display mt-2 text-3xl text-[var(--fg)]">
              You found the cheat code.
            </p>
            <p className="mt-2 text-sm text-[var(--fg-muted)]">
              Tell me you noticed when you email — it&apos;s a +1.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type ConfettiPiece = {
  left: number;
  delay: number;
  duration: number;
  rotate: number;
  driftX: number;
  size: number;
  hue: string;
};

function makePieces(): ConfettiPiece[] {
  const palette = ['var(--accent)', 'var(--pop)', 'var(--fg)'];
  return Array.from({ length: 70 }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 0.6,
    duration: 1.6 + Math.random() * 1.6,
    rotate: 360 + Math.random() * 360,
    driftX: (Math.random() - 0.5) * 220,
    size: 6 + Math.round(Math.random() * 8),
    hue: palette[i % palette.length] ?? 'var(--accent)',
  }));
}

function Confetti() {
  const [pieces] = useState<ConfettiPiece[]>(makePieces);
  const yEnd = typeof window === 'undefined' ? 900 : window.innerHeight + 60;

  return (
    <div className="absolute inset-0 overflow-hidden">
      {pieces.map((p, i) => (
        <motion.span
          key={i}
          initial={{ y: -30, opacity: 0, rotate: 0 }}
          animate={{
            y: yEnd,
            opacity: [0, 1, 1, 0],
            rotate: p.rotate,
            x: p.driftX,
          }}
          transition={{ duration: p.duration, delay: p.delay, ease: 'easeIn' }}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: 0,
            width: p.size,
            height: p.size * 0.4,
            background: p.hue,
            borderRadius: 2,
          }}
        />
      ))}
    </div>
  );
}
