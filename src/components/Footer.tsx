import { FiArrowUp, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import { GITHUB_URL, LINKEDIN_URL, EMAIL } from '../lib/data';
import { scrollToTop } from '../lib/scroll';
import { useClock } from '../hooks/useClock';

const SOCIALS = [
  { href: GITHUB_URL, label: 'GitHub', Icon: FiGithub },
  { href: LINKEDIN_URL, label: 'LinkedIn', Icon: FiLinkedin },
  { href: `mailto:${EMAIL}`, label: 'Email', Icon: FiMail },
];

export function Footer() {
  const clock = useClock();
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-[var(--border)]">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-44 -z-10 h-80 bg-gradient-to-t from-[color-mix(in_oklch,var(--accent)_16%,transparent)] to-transparent blur-3xl"
      />
      <div className="mx-auto flex max-w-[92rem] flex-col gap-8 px-5 pb-10 pt-14 sm:px-8 lg:px-10">
        {/* status strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--fg-subtle)]">
          <span className="inline-flex items-center gap-2">
            <span className="status-dot">
              <span className="absolute inline-flex h-full w-full animate-[pulse-ring_1.8s_ease-out_infinite] rounded-full bg-[var(--accent)]" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
            </span>
            All systems nominal
          </span>
          <span className="hidden sm:inline tabular-nums">{clock} IST</span>
          <span>build v{year}.06</span>
        </div>

        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="eyebrow">end of transmission</p>
            <h2
              className="font-display mt-4 leading-[0.96] text-[var(--fg)]"
              style={{ fontSize: 'var(--text-display-sm)', fontWeight: 600 }}
            >
              Let&apos;s ship something <em className="not-italic text-[var(--accent)]">real.</em>
            </h2>
          </div>
          <button
            type="button"
            onClick={scrollToTop}
            className="group inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] px-5 py-3 font-mono text-sm text-[var(--fg)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)]"
          >
            top of deck
            <FiArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-[var(--border)] pt-6 sm:flex-row sm:items-center">
          <p className="flex flex-wrap items-center gap-1.5 font-mono text-xs text-[var(--fg-muted)]">
            © {year} <span className="text-[var(--fg)]">Akshat Pandey</span> · designed &amp;
            built from scratch · Gurugram, IN
          </p>
          <ul className="flex items-center gap-2">
            {SOCIALS.map(({ href, label, Icon }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] text-[var(--fg-muted)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-center font-mono text-[10px] uppercase tracking-[0.3em] text-[var(--fg-subtle)]">
          <span aria-hidden>·</span> press{' '}
          <kbd className="rounded border border-[var(--border)] bg-[var(--bg-elev)] px-1.5 py-0.5 normal-case tracking-normal text-[var(--fg-muted)]">⌘K</kbd>{' '}
          for the console <span aria-hidden>·</span> try{' '}
          <kbd className="rounded border border-[var(--border)] bg-[var(--bg-elev)] px-1.5 py-0.5 normal-case tracking-normal text-[var(--fg-muted)]">↑↑↓↓←→←→ba</kbd>{' '}
          <span aria-hidden>·</span>
        </p>
      </div>
    </footer>
  );
}
