import { useEffect, useState } from 'react';
import {
  FiDownload,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiMenu,
  FiTerminal,
  FiX,
} from 'react-icons/fi';
import { AnimatePresence, motion } from 'motion/react';
import {
  EMAIL,
  GITHUB_URL,
  LINKEDIN_URL,
  NAV_SECTIONS,
  RESUME_FILE,
} from '../lib/data';
import { onResumeClick } from '../lib/resume';
import { useActiveSection } from '../hooks/useActiveSection';
import { scrollToId, scrollToTop } from '../lib/scroll';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '../lib/cn';

const SECTION_IDS = NAV_SECTIONS.map((s) => s.id);
// stable reference so useActiveSection's observer isn't rebuilt every render
const NAV_IDS = ['hero', ...SECTION_IDS];

function openConsole() {
  window.dispatchEvent(new CustomEvent('palette:open'));
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(NAV_IDS);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 14);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const go = (id: string) => {
    setOpen(false);
    scrollToId(id);
  };

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-[var(--border)] bg-[color-mix(in_oklch,var(--bg)_72%,transparent)] backdrop-blur-xl'
          : 'border-b border-transparent',
      )}
    >
      <nav className="mx-auto flex max-w-[92rem] items-center justify-between gap-4 px-5 py-2.5 sm:px-8 lg:px-10">
        {/* brand / callsign */}
        <button
          type="button"
          onClick={() => {
            setOpen(false);
            scrollToTop();
          }}
          className="group flex items-center gap-2.5"
          aria-label="Back to top"
        >
          <span className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] font-display text-sm font-bold text-[var(--fg)] transition-colors group-hover:border-[var(--accent)] group-hover:text-[var(--accent)]">
            AP
            <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />
          </span>
          <span className="hidden leading-tight sm:block">
            <span className="block font-mono text-[11px] font-semibold tracking-[0.16em] text-[var(--fg)]">
              AKSHAT.SYS
            </span>
            <span className="block font-mono text-[9px] uppercase tracking-[0.22em] text-[var(--fg-subtle)]">
              backend · video AI
            </span>
          </span>
        </button>

        {/* channels */}
        <ul className="hidden items-center gap-0.5 lg:flex">
          {NAV_SECTIONS.map((section, i) => {
            const isActive = active === section.id;
            return (
              <li key={section.id}>
                <button
                  type="button"
                  onClick={() => go(section.id)}
                  aria-current={isActive ? 'true' : undefined}
                  aria-label={`${section.plain} — ${section.label}`}
                  className={cn(
                    'relative rounded-md px-3 py-1 font-mono text-[12px] tracking-tight transition-colors',
                    isActive
                      ? 'text-[var(--fg)]'
                      : 'text-[var(--fg-muted)] hover:text-[var(--fg)]',
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-md border border-[var(--border)] bg-[var(--accent-soft)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="flex flex-col items-start leading-[1.1]">
                    <span>{section.plain}</span>
                    <span className="text-[8.5px] uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
                      {String(i + 1).padStart(2, '0')} · {section.label}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          {/* live status pill */}
          <span className="hidden items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-elev)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--fg-muted)] xl:inline-flex">
            <span className="status-dot">
              <span className="absolute inline-flex h-full w-full animate-[pulse-ring_1.8s_ease-out_infinite] rounded-full bg-[var(--accent)]" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--accent)]" />
            </span>
            Open to work
          </span>
          <button
            type="button"
            onClick={openConsole}
            aria-label="Open command console"
            title="Command console (⌘K)"
            className="hidden items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] px-2.5 py-2 font-mono text-[11px] text-[var(--fg-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)] md:inline-flex"
          >
            <FiTerminal className="h-3.5 w-3.5" />
            <kbd className="rounded border border-[var(--border)] bg-[var(--bg)] px-1.5 py-0.5 text-[10px] text-[var(--fg-subtle)]">
              ⌘K
            </kbd>
          </button>
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] text-[var(--fg)] lg:hidden"
          >
            {open ? <FiX className="h-5 w-5" /> : <FiMenu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="lg:hidden"
          >
            <ul
              className="mx-4 mb-3 flex flex-col gap-1 rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-2 shadow-2xl shadow-black/20"
            >
              {NAV_SECTIONS.map((section, i) => {
                const isActive = active === section.id;
                return (
                  <li key={section.id}>
                    <button
                      type="button"
                      onClick={() => go(section.id)}
                      aria-current={isActive ? 'true' : undefined}
                      aria-label={`${section.plain} — ${section.label}`}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-mono text-[15px] transition-colors',
                        isActive
                          ? 'bg-[var(--accent-soft)] text-[var(--fg)]'
                          : 'text-[var(--fg-muted)] hover:bg-[var(--bg-sunken)] hover:text-[var(--fg)]',
                      )}
                    >
                      <span className="text-xs text-[var(--fg-subtle)]">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span className="flex items-baseline gap-2">
                        {section.plain}
                        <span className="text-[11px] text-[var(--fg-subtle)]">· {section.label}</span>
                      </span>
                    </button>
                  </li>
                );
              })}

              {/* primary actions — recruiters shouldn't have to hunt for these */}
              <li className="mt-1 grid grid-cols-2 gap-1 border-t border-[var(--border)] pt-2">
                {[
                  { href: RESUME_FILE, label: 'Résumé', Icon: FiDownload, ext: true, resume: true },
                  { href: `mailto:${EMAIL}`, label: 'Email', Icon: FiMail, ext: false, resume: false },
                  { href: GITHUB_URL, label: 'GitHub', Icon: FiGithub, ext: true, resume: false },
                  { href: LINKEDIN_URL, label: 'LinkedIn', Icon: FiLinkedin, ext: true, resume: false },
                ].map(({ href, label, Icon, ext, resume }) => (
                  <a
                    key={label}
                    href={href}
                    {...(ext ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    onClick={(e) => {
                      if (resume) onResumeClick(e);
                      setOpen(false);
                    }}
                    className="flex items-center gap-2.5 rounded-xl px-4 py-3 font-mono text-[13px] text-[var(--fg-muted)] transition-colors hover:bg-[var(--bg-sunken)] hover:text-[var(--fg)]"
                  >
                    <Icon className="h-4 w-4 text-[var(--accent)]" />
                    {label}
                  </a>
                ))}
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
