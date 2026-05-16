import { FiArrowUp, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';

const SOCIALS = [
  { href: 'https://github.com/Akshat-Pandey16', label: 'GitHub', Icon: FiGithub },
  { href: 'https://www.linkedin.com/in/akshat16pandey/', label: 'LinkedIn', Icon: FiLinkedin },
  { href: 'mailto:akshat16pandey@gmail.com', label: 'Email', Icon: FiMail },
];

export function Footer() {
  return (
    <footer className="relative border-t border-[var(--border)]">
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
            className="group inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-elev)] px-5 py-3 text-sm font-semibold text-[var(--fg)] transition-all duration-200 hover:border-[var(--border-strong)] hover:text-[var(--accent)]"
          >
            Back to top
            <FiArrowUp className="h-4 w-4 transition-transform group-hover:-translate-y-0.5" />
          </button>
        </div>

        <div className="flex flex-col items-start justify-between gap-4 border-t border-[var(--border)] pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-[var(--fg-muted)]">
            © {new Date().getFullYear()} Akshat Pandey · Hand-written, then rewritten. If you scrolled this far, we should probably talk.
          </p>
          <ul className="flex items-center gap-2">
            {SOCIALS.map(({ href, label, Icon }) => (
              <li key={href}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-elev)] text-[var(--fg-muted)] transition-all duration-200 hover:border-[var(--border-strong)] hover:text-[var(--accent)]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
