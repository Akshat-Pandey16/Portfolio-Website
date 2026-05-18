import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import {
  FiArrowDown,
  FiArrowUpRight,
  FiClock,
  FiCommand,
  FiDownload,
  FiGithub,
  FiLinkedin,
} from 'react-icons/fi';
import { EMAIL, RESUME_URL } from '../lib/data';
import { MagneticButton } from '../components/MagneticButton';

const SCROLL_TO = (id: string) => () => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const META = [
  { label: 'Role', value: 'Backend engineer' },
  { label: 'Based', value: 'Durg, India' },
  { label: 'Studying', value: 'CSE · BIT Durg' },
  { label: 'Status', value: 'Open to work' },
];

const ROTATING_FOCUS = [
  "FastAPI services that don't lie to clients",
  'Postgres schemas that age gracefully',
  'tiny CLIs that save a colleague an hour',
  'Redis-backed queues with sane retries',
];

const NAME_LINES = [
  ['A', 'k', 's', 'h', 'a', 't'],
  ['P', 'a', 'n', 'd', 'e', 'y'],
];

function openCommandPalette() {
  window.dispatchEvent(new CustomEvent('palette:open'));
}

function prefersReducedMotion() {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function useTypewriter(words: readonly string[], speed = 55, hold = 1800) {
  const [text, setText] = useState(() => (prefersReducedMotion() ? words[0] ?? '' : ''));
  const indexRef = useRef(0);
  const phaseRef = useRef<'type' | 'hold' | 'erase'>('type');
  const charRef = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    let timer: number;
    const tick = () => {
      const current = words[indexRef.current % words.length] ?? '';
      if (phaseRef.current === 'type') {
        charRef.current += 1;
        setText(current.slice(0, charRef.current));
        if (charRef.current >= current.length) {
          phaseRef.current = 'hold';
          timer = window.setTimeout(tick, hold);
          return;
        }
      } else if (phaseRef.current === 'hold') {
        phaseRef.current = 'erase';
      } else {
        charRef.current -= 1;
        setText(current.slice(0, Math.max(0, charRef.current)));
        if (charRef.current <= 0) {
          phaseRef.current = 'type';
          indexRef.current += 1;
        }
      }
      const delay =
        phaseRef.current === 'erase' ? speed * 0.5 : phaseRef.current === 'type' ? speed : 40;
      timer = window.setTimeout(tick, delay);
    };
    timer = window.setTimeout(tick, speed);
    return () => window.clearTimeout(timer);
  }, [words, speed, hold]);

  return text;
}

function useLocalClock() {
  const [time, setTime] = useState(() =>
    new Intl.DateTimeFormat('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Kolkata',
    }).format(new Date()),
  );
  useEffect(() => {
    const id = window.setInterval(() => {
      setTime(
        new Intl.DateTimeFormat('en-IN', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
          timeZone: 'Asia/Kolkata',
        }).format(new Date()),
      );
    }, 1000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

export function Hero() {
  const typed = useTypewriter(ROTATING_FOCUS);
  const clock = useLocalClock();

  const containerRef = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 60, damping: 20, mass: 0.6 });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const onMove = (event: PointerEvent) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      mx.set(((event.clientX - rect.left) / rect.width) * 100);
      my.set(((event.clientY - rect.top) / rect.height) * 100);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [mx, my]);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative isolate overflow-hidden px-5 pb-20 pt-32 sm:px-8 sm:pt-36 lg:px-12 lg:pb-24 lg:pt-40"
    >
      <motion.div
        aria-hidden
        style={{
          background:
            'radial-gradient(40rem circle at var(--gx) var(--gy), color-mix(in oklch, var(--accent) 22%, transparent), transparent 65%)',
          ['--gx' as never]: sx,
          ['--gy' as never]: sy,
        }}
        className="pointer-events-none absolute inset-0 -z-10 [--gx:80%] [--gy:18%]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [background-image:linear-gradient(to_right,color-mix(in_oklch,var(--border)_70%,transparent)_1px,transparent_1px),linear-gradient(to_bottom,color-mix(in_oklch,var(--border)_70%,transparent)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_80%)] opacity-50"
      />

      <div className="mx-auto w-full max-w-[88rem]">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex flex-wrap items-center justify-between gap-3"
        >
          <span className="inline-flex items-center gap-2.5 rounded-full border border-[var(--border)] bg-[var(--bg-elev)] px-4 py-1.5 text-xs font-medium text-[var(--fg-muted)]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)]/70 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
            </span>
            Available for new opportunities · 2026
          </span>
          <div className="flex items-center gap-2">
            <span
              className="hidden items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-elev)] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--fg-subtle)] sm:inline-flex"
              title="Current time in Durg, India"
            >
              <FiClock className="h-3.5 w-3.5" />
              <span aria-live="off" className="tabular-nums text-[var(--fg-muted)]">
                {clock}
              </span>
              <span className="text-[var(--fg-subtle)]">IST</span>
            </span>
            <button
              type="button"
              onClick={openCommandPalette}
              aria-label="Open command palette"
              className="group hidden items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-elev)] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[var(--fg-subtle)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] sm:inline-flex"
            >
              <FiCommand className="h-3.5 w-3.5" />
              <kbd className="rounded border border-[var(--border)] bg-[var(--bg)] px-1 py-px text-[10px] tracking-normal">
                ⌘K
              </kbd>
              <span className="group-hover:text-[var(--accent)]">to jump</span>
            </button>
          </div>
        </motion.div>

        <h1
          className="font-display mt-12 leading-[0.86] text-[var(--fg)]"
          style={{ fontSize: 'var(--text-display-xl)', fontWeight: 800 }}
          aria-label="Akshat Pandey"
        >
          {NAME_LINES.map((line, li) => (
            <span key={li} className="block overflow-hidden">
              <span className="inline-flex">
                {line.map((char, ci) => (
                  <motion.span
                    key={`${li}-${ci}`}
                    initial={{ y: '110%', opacity: 0 }}
                    animate={{ y: '0%', opacity: 1 }}
                    transition={{
                      duration: 0.7,
                      ease: [0.2, 0.8, 0.2, 1],
                      delay: 0.1 + li * 0.06 + ci * 0.035,
                    }}
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                ))}
                {li === 1 && (
                  <motion.span
                    initial={{ y: '110%', opacity: 0 }}
                    animate={{ y: '0%', opacity: 1 }}
                    transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1], delay: 0.55 }}
                    className="inline-block text-[var(--accent)]"
                  >
                    .
                  </motion.span>
                )}
              </span>
            </span>
          ))}
        </h1>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.55 }}
          >
            <p className="max-w-2xl text-lg leading-relaxed text-[var(--fg-muted)] sm:text-2xl">
              Backend-leaning engineer building thoughtful software — clean APIs,
              honest data models, and the occasional polished UI when the day
              calls for it.
            </p>

            <div
              aria-live="polite"
              className="mt-6 flex h-7 items-center gap-2 font-mono text-xs text-[var(--fg-subtle)] sm:text-sm"
            >
              <span className="text-[var(--accent)]">$</span>
              <span className="text-[var(--fg-muted)]">currently into</span>
              <span className="text-[var(--fg)]">{typed}</span>
              <span
                className="ml-0.5 inline-block h-3.5 w-1.5 animate-pulse bg-[var(--accent)]/70"
                aria-hidden
              />
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <MagneticButton
                type="button"
                onClick={SCROLL_TO('contact')}
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-[var(--accent)] px-7 py-3.5 text-sm font-semibold text-[var(--accent-fg)] shadow-lg shadow-[var(--accent)]/20 transition-shadow duration-200 hover:shadow-[var(--accent)]/40"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                />
                <span className="relative">Get in touch</span>
                <FiArrowUpRight className="relative h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </MagneticButton>
              <a
                href={RESUME_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-elev)] px-7 py-3.5 text-sm font-semibold text-[var(--fg)] transition-all duration-200 hover:border-[var(--border-strong)] hover:text-[var(--accent)]"
              >
                <FiDownload className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                Résumé
              </a>
              <span className="mx-1 hidden h-6 w-px bg-[var(--border)] sm:inline-block" />
              <a
                href="https://github.com/Akshat-Pandey16"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-elev)] text-[var(--fg)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:text-[var(--accent)]"
              >
                <FiGithub className="h-4 w-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/akshat16pandey/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-elev)] text-[var(--fg)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:text-[var(--accent)]"
              >
                <FiLinkedin className="h-4 w-4" />
              </a>
            </div>

            <p className="mt-4 font-mono text-[11px] text-[var(--fg-subtle)]">
              Or just email{' '}
              <a
                href={`mailto:${EMAIL}`}
                className="text-[var(--fg-muted)] underline decoration-[var(--border-strong)] decoration-dotted underline-offset-4 hover:text-[var(--accent)]"
              >
                {EMAIL}
              </a>
              .
            </p>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.65 }}
            className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-[var(--border)] pt-8 lg:border-t-0 lg:pt-0"
          >
            {META.map((m) => (
              <div key={m.label} className="group">
                <dt className="eyebrow">{m.label}</dt>
                <dd className="font-display mt-1.5 text-xl text-[var(--fg)] transition-colors group-hover:text-[var(--accent)]">
                  {m.value}
                </dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.button
          type="button"
          onClick={SCROLL_TO('about')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.6 }}
          aria-label="Scroll to about section"
          className="group mt-20 flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-[var(--fg-subtle)] transition-colors hover:text-[var(--accent)]"
        >
          <span className="h-px w-14 bg-[var(--border)] transition-all group-hover:w-20 group-hover:bg-[var(--accent)]" />
          Scroll
          <FiArrowDown className="h-3.5 w-3.5 animate-bounce" />
        </motion.button>
      </div>
    </section>
  );
}
