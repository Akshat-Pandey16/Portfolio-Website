import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  FiArrowDown,
  FiArrowUpRight,
  FiDownload,
  FiGithub,
  FiLinkedin,
  FiTerminal,
} from 'react-icons/fi';
import { AVAILABILITY, EMAIL, GITHUB_URL, LINKEDIN_URL, RESUME_URL, ROLE } from '../lib/data';
import { MagneticButton } from '../components/MagneticButton';
import { useClock } from '../hooks/useClock';
import { scrollToId } from '../lib/scroll';
import { prefersReducedMotion } from '../lib/motion';

/* real, defensible signals — no fabricated metrics */
const READOUTS = [
  { k: 'role', v: ROLE },
  { k: 'org', v: 'Intozi Tech' },
  { k: 'base', v: 'Gurugram, IN' },
  { k: 'focus', v: 'Video AI' },
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

export function Hero() {
  const typed = useTypewriter(ROTATING_FOCUS);

  return (
    <section
      id="hero"
      className="relative isolate px-5 pb-20 pt-28 sm:px-8 sm:pt-32 lg:px-10 lg:pb-24 lg:pt-36"
    >
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
              className="mt-6 flex h-6 items-center gap-2 font-mono text-xs text-[var(--fg-subtle)] sm:text-sm"
            >
              <span className="text-[var(--accent)]" aria-hidden>▸</span>
              <span className="text-[var(--fg-muted)]">currently building</span>
              {/* aria-hidden: the rotating text is ambient flourish — a live region
                  here would announce it character-by-character to screen readers */}
              <span className="text-[var(--fg)]" aria-hidden>{typed}</span>
              <span className="sr-only">Django services, Celery pipelines, Postgres schemas and MLOps.</span>
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
                download
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

          {/* status panel — real signals, no fabricated metrics */}
          <motion.aside
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.5 }}
            aria-label="Availability and profile status"
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

            {/* headline signal: open to work */}
            <div className="mt-4">
              <span className="text-[10px] uppercase tracking-[0.18em] text-[var(--fg-subtle)]">
                availability
              </span>
              <p className="font-display mt-1.5 flex items-center gap-2.5 text-2xl text-[var(--fg)]">
                <span className="status-dot">
                  <span className="absolute inline-flex h-full w-full animate-[pulse-ring_1.8s_ease-out_infinite] rounded-full bg-[var(--accent)]" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
                </span>
                Open to work
              </p>
              <p className="mt-1.5 text-[12px] text-[var(--fg-muted)]">{AVAILABILITY}</p>
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
              <LiveClock />
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

/* leaf component so the per-second tick re-renders only itself, not all of Hero */
function LiveClock() {
  const clock = useClock();
  return <span className="tabular-nums">{clock} IST</span>;
}
