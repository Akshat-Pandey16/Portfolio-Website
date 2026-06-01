import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { scrollToBottom, scrollToTop } from '../lib/scroll';

const KONAMI = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a',
];

const SUBSYSTEMS = [
  'api.gateway',
  'postgres.primary',
  'celery.workers',
  'rabbitmq.broker',
  'redis.cache',
  'rtsp.ingest',
  'auth.pam',
];

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  return tag === 'input' || tag === 'textarea' || target.isContentEditable;
}

export function EasterEgg() {
  const [running, setRunning] = useState(false);
  const lastKeyRef = useRef<{ key: string; at: number } | null>(null);

  useEffect(() => {
    const trigger = () => {
      setRunning(true);
      window.setTimeout(() => setRunning(false), 5200);
    };
    window.addEventListener('diagnostics:run', trigger);

    const onKey = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const key = event.key.length === 1 ? event.key.toLowerCase() : event.key;
      const now = performance.now();
      const prev = lastKeyRef.current;
      if (prev && now - prev.at < 800) {
        if (prev.key === 'g' && key === 't') {
          scrollToTop();
          lastKeyRef.current = null;
          return;
        }
        if (prev.key === 'g' && key === 'b') {
          scrollToBottom();
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
          trigger();
        }
      } else {
        progress = got === KONAMI[0] ? 1 : 0;
      }
    };

    window.addEventListener('keydown', onKey);
    window.addEventListener('keydown', onKonami);
    return () => {
      window.removeEventListener('diagnostics:run', trigger);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('keydown', onKonami);
    };
  }, []);

  useEffect(() => {
    if (!running) return;
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setRunning(false);
    };
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [running]);

  return (
    <AnimatePresence>
      {running && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setRunning(false)}
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          role="dialog"
          aria-modal="true"
          aria-label="System diagnostics — press Escape to close"
        >
          <div className="absolute inset-0 bg-[color-mix(in_oklch,var(--bg-sunken)_55%,transparent)] backdrop-blur-sm" />
          <Bits />
          <motion.div
            initial={{ scale: 0.7, opacity: 0, y: 24 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: -12 }}
            transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            className="bracketed relative w-full max-w-sm overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-elev)] p-6 shadow-2xl shadow-black/40"
          >
            <span className="sweep-line" aria-hidden />
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--fg-subtle)]">
              ↑↑↓↓←→←→ba · diagnostic
            </p>
            <ul className="mt-4 space-y-1.5 font-mono text-[13px]">
              {SUBSYSTEMS.map((name, i) => (
                <motion.li
                  key={name}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.22 }}
                  className="flex items-center justify-between gap-3"
                >
                  <span className="text-[var(--fg-muted)]">{name}</span>
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.32 + i * 0.22 }}
                    className="inline-flex items-center gap-1.5 text-[var(--accent)]"
                  >
                    OK ✓
                  </motion.span>
                </motion.li>
              ))}
            </ul>
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + SUBSYSTEMS.length * 0.22 }}
              className="font-display mt-5 text-2xl text-[var(--fg)]"
            >
              All systems nominal.
            </motion.p>
            <p className="mt-1.5 text-sm text-[var(--fg-muted)]">
              You found the cheat code — mention it when you email, it&apos;s a +1.
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

type Bit = {
  left: number;
  delay: number;
  duration: number;
  drift: number;
  char: string;
  color: string;
};

function makeBits(): Bit[] {
  const palette = ['var(--accent)', 'var(--cyan)', 'var(--amber)'];
  return Array.from({ length: 56 }, (_, i) => ({
    left: Math.random() * 100,
    delay: Math.random() * 0.7,
    duration: 1.6 + Math.random() * 1.8,
    drift: (Math.random() - 0.5) * 140,
    char: Math.random() > 0.5 ? '1' : '0',
    color: palette[i % palette.length]!,
  }));
}

function Bits() {
  const [bits] = useState<Bit[]>(makeBits);
  const yEnd = typeof window === 'undefined' ? -900 : -(window.innerHeight + 80);
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {bits.map((b, i) => (
        <motion.span
          key={i}
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: yEnd, opacity: [0, 1, 1, 0], x: b.drift }}
          transition={{ duration: b.duration, delay: b.delay, ease: 'easeOut' }}
          style={{
            position: 'absolute',
            bottom: 0,
            left: `${b.left}%`,
            color: b.color,
            fontFamily: 'var(--font-mono)',
            fontSize: 12,
          }}
        >
          {b.char}
        </motion.span>
      ))}
    </div>
  );
}
