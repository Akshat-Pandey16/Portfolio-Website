import { FiArrowUp, FiGithub, FiHeart, FiLinkedin, FiMail } from 'react-icons/fi';

const SOCIALS = [
  { href: 'https://github.com/Akshat-Pandey16', label: 'GitHub', Icon: FiGithub },
  { href: 'https://www.linkedin.com/in/akshat16pandey/', label: 'LinkedIn', Icon: FiLinkedin },
  { href: 'mailto:akshat16pandey@gmail.com', label: 'Email', Icon: FiMail },
];

export function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-[var(--border)]">
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -bottom-40 -z-10 h-80 bg-gradient-to-t from-[color-mix(in_oklch,var(--accent)_18%,transparent)] to-transparent blur-3xl"
      />
      <div className="mx-auto flex max-w-[88rem] flex-col gap-10 px-5 pb-10 pt-16 sm:px-8 lg:px-12">
        <div className="flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="eyebrow">Thanks for scrolling.</p>
            <h2
              className="font-display mt-4 leading-[0.95] text-[var(--fg)]"
              style={{ fontSize: 'var(--text-display-sm)' }}
            >
              Let&apos;s make something{' '}
              <em className="italic text-[var(--accent)]">good.</em>
            </h2>
          </div>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-elev)] px-5 py-3 text-sm font-semibold text-[var(--fg)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:text-[var(--accent)]"
          >
            Back to top
            <FiArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-[var(--border)] pt-6 sm:flex-row sm:items-center">
          <p className="flex flex-wrap items-center gap-1.5 text-xs text-[var(--fg-muted)]">
            © {new Date().getFullYear()} Akshat Pandey · Built with
            <FiHeart className="h-3 w-3 animate-pulse text-[var(--accent)]" aria-hidden />
            <span className="font-mono">React</span>·<span className="font-mono">Motion</span>·
            <span className="font-mono">Tailwind</span>
            <span className="hidden sm:inline">— if you scrolled this far, we should probably talk.</span>
          </p>
          <ul className="flex items-center gap-2">
            {SOCIALS.map(({ href, label, Icon }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-elev)] text-[var(--fg-muted)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)] hover:text-[var(--accent)]"
                >
                  <Icon className="h-4 w-4 transition-transform group-hover:scale-110" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-center font-mono text-[10px] uppercase tracking-[0.32em] text-[var(--fg-subtle)]">
          <span aria-hidden>·</span> Try <kbd className="rounded border border-[var(--border)] bg-[var(--bg-elev)] px-1.5 py-0.5 normal-case tracking-normal text-[var(--fg-muted)]">⌘K</kbd> to teleport <span aria-hidden>·</span> Press <kbd className="rounded border border-[var(--border)] bg-[var(--bg-elev)] px-1.5 py-0.5 normal-case tracking-normal text-[var(--fg-muted)]">G</kbd> then <kbd className="rounded border border-[var(--border)] bg-[var(--bg-elev)] px-1.5 py-0.5 normal-case tracking-normal text-[var(--fg-muted)]">T</kbd> for top <span aria-hidden>·</span>
        </p>
      </div>
    </footer>
  );
}
