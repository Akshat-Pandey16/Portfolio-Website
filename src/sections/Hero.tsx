import { motion } from 'motion/react';
import { FiArrowDown, FiArrowUpRight, FiDownload, FiGithub, FiLinkedin } from 'react-icons/fi';

const RESUME_URL =
  'https://drive.google.com/file/d/1AB5wbR75BfJ3VMbgNqaa94Rv9sGOf53-/view?usp=drivesdk';

const SCROLL_TO = (id: string) => () => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

const META = [
  { label: 'Role', value: 'Backend engineer' },
  { label: 'Based', value: 'Durg, India' },
  { label: 'Studying', value: 'CSE · BIT Durg' },
  { label: 'Status', value: 'Open to work' },
];

export function Hero() {
  return (
    <section
      id="hero"
      className="relative isolate overflow-hidden px-5 pb-20 pt-32 sm:px-8 sm:pt-36 lg:px-12 lg:pb-24 lg:pt-40"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [background:radial-gradient(50%_55%_at_85%_15%,color-mix(in_oklch,var(--accent)_22%,transparent),transparent_70%)]"
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
          <span className="font-mono text-xs uppercase tracking-[0.24em] text-[var(--fg-subtle)]">
            Portfolio · v2
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 }}
          className="font-display mt-12 leading-[0.86] text-[var(--fg)]"
          style={{ fontSize: 'var(--text-display-xl)', fontWeight: 800 }}
        >
          Akshat
          <br />
          Pandey<span className="text-[var(--accent)]">.</span>
        </motion.h1>

        <div className="mt-12 grid gap-12 lg:grid-cols-[1.5fr_1fr] lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.15 }}
          >
            <p className="max-w-2xl text-lg leading-relaxed text-[var(--fg-muted)] sm:text-2xl">
              Backend-leaning engineer building thoughtful software — clean APIs,
              honest data models, and the occasional polished UI when the day
              calls for it.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={SCROLL_TO('contact')}
                className="group inline-flex items-center gap-2 rounded-full bg-[var(--accent)] px-7 py-3.5 text-sm font-semibold text-[var(--accent-fg)] shadow-lg shadow-[var(--accent)]/20 transition-all duration-200 hover:opacity-95 hover:shadow-[var(--accent)]/30"
              >
                Get in touch
                <FiArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </button>
              <a
                href={RESUME_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-elev)] px-7 py-3.5 text-sm font-semibold text-[var(--fg)] transition-all duration-200 hover:border-[var(--border-strong)] hover:text-[var(--accent)]"
              >
                <FiDownload className="h-4 w-4" />
                Résumé
              </a>
              <span className="mx-1 hidden h-6 w-px bg-[var(--border)] sm:inline-block" />
              <a
                href="https://github.com/Akshat-Pandey16"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-elev)] text-[var(--fg)] transition-all duration-200 hover:border-[var(--border-strong)] hover:text-[var(--accent)]"
              >
                <FiGithub className="h-4 w-4" />
              </a>
              <a
                href="https://www.linkedin.com/in/akshat16pandey/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-elev)] text-[var(--fg)] transition-all duration-200 hover:border-[var(--border-strong)] hover:text-[var(--accent)]"
              >
                <FiLinkedin className="h-4 w-4" />
              </a>
            </div>
          </motion.div>

          <motion.dl
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
            className="grid grid-cols-2 gap-x-6 gap-y-5 border-t border-[var(--border)] pt-8 lg:border-t-0 lg:pt-0"
          >
            {META.map((m) => (
              <div key={m.label}>
                <dt className="eyebrow">{m.label}</dt>
                <dd className="font-display mt-1.5 text-xl text-[var(--fg)]">{m.value}</dd>
              </div>
            ))}
          </motion.dl>
        </div>

        <motion.button
          type="button"
          onClick={SCROLL_TO('about')}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          aria-label="Scroll to about section"
          className="mt-20 flex items-center gap-3 text-xs uppercase tracking-[0.28em] text-[var(--fg-subtle)] hover:text-[var(--accent)]"
        >
          <span className="h-px w-14 bg-[var(--border)]" />
          Scroll
          <FiArrowDown className="h-3.5 w-3.5 animate-bounce" />
        </motion.button>
      </div>
    </section>
  );
}
