import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import {
  FiArrowDown,
  FiArrowUpRight,
  FiDownload,
  FiGithub,
  FiLinkedin,
  FiTerminal,
} from 'react-icons/fi';
import { EMAIL, GITHUB_URL, LINKEDIN_URL, RESUME_URL } from '../lib/data';
import { MagneticButton } from '../components/MagneticButton';
import { Sparkline } from '../components/Sparkline';
import { scrollToId } from '../lib/scroll';
import { prefersReducedMotion } from '../lib/motion';

const READOUTS = [
  { k: 'role', v: 'Backend lead' },
  { k: 'org', v: 'Intozi Tech' },
  { k: 'base', v: 'Gurugram, IN' },
  { k: 'status', v: 'Open to work' },
];

const ROTATING_FOCUS = [
  'Django services that stream live camera feeds',
  'Celery pipelines that keep AI off the request path',
  'Postgres schemas that age gracefully',
  'MLOps that runs dataset → deployment',
];

const NAME_LINES = [
  ['A', 'k', 's', 'h', 'a', 't'],
  ['P', 'a', 'n', 'd', 'e', 'y'],
];

function openConsole() {
  window.dispatchEvent(new CustomEvent('palette:open'));
}

function useTypewriter(words: readonly string[], speed = 52, hold = 1700) {
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
      const delay = phaseRef.current === 'erase' ? speed * 0.5 : phaseRef.current === 'type' ? speed : 40;
      timer = window.setTimeout(tick, delay);
    };
    timer = window.setTimeout(tick, speed);
    return () => window.clearTimeout(timer);
  }, [words, speed, hold]);

  return text;
}

function useClock() {
  const fmt = () =>
    new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
      timeZone: 'Asia/Kolkata',
    }).format(new Date());
  const [time, setTime] = useState(fmt);
  useEffect(() => {
    const id = window.setInterval(() => setTime(fmt()), 1000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

export function Hero() {
  const typed = useTypewriter(ROTATING_FOCUS);
  const clock = useClock();
  const reqs = useReqCounter();

  const containerRef = useRef<HTMLElement>(null);
  const mx = useMotionValue(50);
  const my = useMotionValue(18);
  const sx = useSpring(mx, { stiffness: 60, damping: 20, mass: 0.6 });
  const sy = useSpring(my, { stiffness: 60, damping: 20, mass: 0.6 });

  useEffect(() => {
    if (prefersReducedMotion()) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    let raf = 0;
    let lastX = 0;
    let lastY = 0;
    const flush = () => {
      raf = 0;
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      mx.set(((lastX - rect.left) / rect.width) * 100);
      my.set(((lastY - rect.top) / rect.height) * 100);
    };
    const onMove = (e: PointerEvent) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (!raf) raf = requestAnimationFrame(flush);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [mx, my]);

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative isolate overflow-hidden px-5 pb-20 pt-28 sm:px-8 sm:pt-32 lg:px-10 lg:pb-24 lg:pt-36"
    >
      <motion.div
        aria-hidden
        style={{
          background:
            'radial-gradient(36rem circle at var(--gx) var(--gy), color-mix(in oklch, var(--accent) 16%, transparent), transparent 62%)',
          ['--gx' as never]: sx,
          ['--gy' as never]: sy,
        }}
        className="pointer-events-none absolute inset-0 -z-10"
      />

      <div className="mx-auto w-full max-w-[92rem]">
        {/* boot line */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="flex flex-wrap items-center justify-between gap-3 font-mono"
        >
          <span className="inline-flex items-center gap-2.5 rounded-full border border-[var(--border)] bg-[var(--bg-elev)] px-4 py-1.5 text-[11px] uppercase tracking-[0.18em] text-[var(--fg-muted)]">
            <span className="status-dot">
              <span className="absolute inline-flex h-full w-full animate-[pulse-ring_1.8s_ease-out_infinite] rounded-full bg-[var(--accent)]" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
            </span>
            System online · open to work · 2026
          </span>
          <button
            type="button"
            onClick={openConsole}
            className="hidden items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-elev)] px-3 py-1.5 text-[11px] uppercase tracking-[0.16em] text-[var(--fg-subtle)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] sm:inline-flex"
          >
            <FiTerminal className="h-3.5 w-3.5" />
            <kbd className="rounded border border-[var(--border)] bg-[var(--bg)] px-1 py-px text-[10px]">⌘K</kbd>
            console
          </button>
        </motion.div>

        <div className="mt-10 grid gap-10 lg:mt-12 lg:grid-cols-[1.45fr_1fr] lg:items-end lg:gap-14">
          {/* name + intro */}
          <div>
            <p className="mb-5 font-mono text-xs uppercase tracking-[0.24em] text-[var(--accent)]">
              <span className="text-[var(--fg-subtle)]">$</span> whoami
            </p>
            <h1
              className="font-display leading-[0.9] text-[var(--fg)]"
              style={{ fontSize: 'var(--text-display-xl)', fontWeight: 700 }}
              aria-label="Akshat Pandey"
            >
              {NAME_LINES.map((line, li) => (
                <span key={li} className="block" style={{ clipPath: 'inset(-0.05em 0 -0.25em 0)' }}>
                  <span className="inline-flex">
                    {line.map((char, ci) => (
                      <motion.span
                        key={`${li}-${ci}`}
                        initial={{ y: '115%', opacity: 0 }}
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
                        initial={{ y: '115%', opacity: 0 }}
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

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.55 }}
              className="mt-7 max-w-xl text-lg leading-relaxed text-[var(--fg-muted)] sm:text-xl"
            >
              I build the backend that holds everything up — clean APIs, honest
              data models and async pipelines that move{' '}
              <span className="text-[var(--fg)]">video and AI workloads</span> at
              scale. I sweat the frontend too, when the day calls for it.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              aria-live="polite"
              className="mt-6 flex h-6 items-center gap-2 font-mono text-xs text-[var(--fg-subtle)] sm:text-sm"
            >
              <span className="text-[var(--accent)]">▸</span>
              <span className="text-[var(--fg-muted)]">currently building</span>
              <span className="text-[var(--fg)]">{typed}</span>
              <span className="term-caret" aria-hidden />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
              className="mt-9 flex flex-wrap items-center gap-3"
            >
              <MagneticButton
                onClick={() => scrollToId('contact')}
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-lg bg-[var(--accent)] px-7 py-3.5 text-sm font-semibold text-[var(--accent-fg)] shadow-[0_10px_30px_-10px_var(--accent)] transition-shadow duration-200 hover:shadow-[0_14px_40px_-8px_var(--accent)]"
              >
                <span
                  aria-hidden
                  className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full"
                />
                <span className="relative">Open an uplink</span>
                <FiArrowUpRight className="relative h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </MagneticButton>
              <a
                href={RESUME_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] px-7 py-3.5 text-sm font-semibold text-[var(--fg)] transition-all duration-200 hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                <FiDownload className="h-4 w-4 transition-transform group-hover:translate-y-0.5" />
                Résumé
              </a>
              <span className="mx-1 hidden h-6 w-px bg-[var(--border)] sm:inline-block" />
              {[
                { href: GITHUB_URL, label: 'GitHub', Icon: FiGithub },
                { href: LINKEDIN_URL, label: 'LinkedIn', Icon: FiLinkedin },
              ].map(({ href, label, Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] text-[var(--fg)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.95 }}
              className="mt-4 font-mono text-[11px] text-[var(--fg-subtle)]"
            >
              or email{' '}
              <a
                href={`mailto:${EMAIL}`}
                className="text-[var(--fg-muted)] underline decoration-[var(--border-strong)] decoration-dotted underline-offset-4 hover:text-[var(--accent)]"
              >
                {EMAIL}
              </a>
            </motion.p>
          </div>

          {/* live status panel */}
          <motion.aside
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.5 }}
            aria-label="Live system status"
            className="bracketed panel relative w-full overflow-hidden rounded-2xl p-5 font-mono lg:max-w-sm lg:justify-self-end"
          >
            <span className="sweep-line" aria-hidden />
            <div className="flex items-center justify-between border-b border-[var(--border)] pb-3 text-[10px] uppercase tracking-[0.2em] text-[var(--fg-subtle)]">
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                akshat.sys / status
              </span>
              <span className="tabular-nums">v2026.06</span>
            </div>

            {/* req/s telemetry */}
            <div className="mt-4">
              <div className="flex items-end justify-between">
                <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--fg-subtle)]">
                  throughput · req/s
                </span>
                <span className="font-display text-2xl tabular-nums text-[var(--accent)]">
                  {reqs}
                </span>
              </div>
              <Sparkline className="mt-2 h-10 w-full" />
            </div>

            {/* readouts */}
            <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 border-t border-[var(--border)] pt-4 text-[12px]">
              {READOUTS.map((r) => (
                <div key={r.k} className="flex flex-col gap-0.5">
                  <dt className="text-[10px] uppercase tracking-[0.14em] text-[var(--fg-subtle)]">
                    {r.k}
                  </dt>
                  <dd className="text-[var(--fg)]">{r.v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-4 flex items-center justify-between border-t border-[var(--border)] pt-3 text-[10px] uppercase tracking-[0.2em] text-[var(--fg-subtle)]">
              <span className="tabular-nums">{clock} IST</span>
              <span className="inline-flex items-center gap-1.5 text-[var(--accent)]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent)]" />
                live
              </span>
            </div>
          </motion.aside>
        </div>

        <motion.button
          type="button"
          onClick={() => scrollToId('about')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.6 }}
          aria-label="Scroll to profile"
          className="group mt-16 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.26em] text-[var(--fg-subtle)] transition-colors hover:text-[var(--accent)]"
        >
          <span className="h-px w-14 bg-[var(--border)] transition-all group-hover:w-20 group-hover:bg-[var(--accent)]" />
          scroll
          <FiArrowDown className="h-3.5 w-3.5 animate-bounce" />
        </motion.button>
      </div>
    </section>
  );
}

/* a gently wandering "req/s" number for the status panel */
function useReqCounter() {
  const [n, setN] = useState(1284);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let id = 0;
    const tick = () => {
      if (!document.hidden) {
        setN((prev) => {
          const next = prev + Math.round((Math.random() - 0.45) * 90);
          return Math.max(820, Math.min(2400, next));
        });
      }
      id = window.setTimeout(tick, 900);
    };
    id = window.setTimeout(tick, 900);
    return () => window.clearTimeout(id);
  }, []);
  return n.toLocaleString('en-US');
}
