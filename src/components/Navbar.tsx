import { useEffect, useState } from 'react';
import { FiMenu, FiX } from 'react-icons/fi';
import { AnimatePresence, motion } from 'motion/react';
import { NAV_SECTIONS } from '../lib/data';
import { useActiveSection } from '../hooks/useActiveSection';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '../lib/cn';

const SECTION_IDS = NAV_SECTIONS.map((s) => s.id);

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = useActiveSection(['hero', ...SECTION_IDS]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
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

  const goTo = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    setOpen(false);
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-[var(--border)] bg-[color-mix(in_oklch,var(--bg)_82%,transparent)] backdrop-blur-xl'
          : 'border-b border-transparent',
      )}
    >
      <nav className="mx-auto flex max-w-[88rem] items-center justify-between gap-4 px-5 py-3 sm:px-8 lg:px-12">
        <button
          type="button"
          onClick={() => goTo('hero')}
          className="group flex items-center gap-2.5"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] font-display text-base text-[var(--fg)] transition-colors group-hover:border-[var(--accent)] group-hover:text-[var(--accent)]">
            AP
          </span>
          <span className="hidden text-sm font-semibold tracking-wide text-[var(--fg-muted)] sm:inline">
            Akshat Pandey
          </span>
        </button>

        <ul className="hidden items-center gap-1 lg:flex">
          {NAV_SECTIONS.map((section, i) => {
            const isActive = active === section.id;
            return (
              <li key={section.id}>
                <button
                  type="button"
                  onClick={() => goTo(section.id)}
                  className={cn(
                    'relative rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    isActive
                      ? 'text-[var(--fg)]'
                      : 'text-[var(--fg-muted)] hover:text-[var(--fg)]',
                  )}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 -z-10 rounded-full bg-[color-mix(in_oklch,var(--accent)_18%,transparent)] dark:bg-[color-mix(in_oklch,var(--accent)_22%,transparent)]"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <span className="mr-1.5 font-mono text-[10px] text-[var(--fg-subtle)]">
                    0{i + 1}
                  </span>
                  {section.label}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--bg-elev)] text-[var(--fg)] lg:hidden"
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
            <ul className="mx-4 mb-3 flex flex-col gap-1 rounded-2xl border border-[var(--border)] bg-[var(--bg-elev)] p-2 shadow-2xl shadow-black/5">
              {NAV_SECTIONS.map((section, i) => {
                const isActive = active === section.id;
                return (
                  <li key={section.id}>
                    <button
                      type="button"
                      onClick={() => goTo(section.id)}
                      className={cn(
                        'flex w-full items-center justify-between rounded-xl px-4 py-3 text-left text-base font-medium transition-colors',
                        isActive
                          ? 'bg-[color-mix(in_oklch,var(--accent)_18%,transparent)] text-[var(--fg)]'
                          : 'text-[var(--fg-muted)] hover:bg-[color-mix(in_oklch,var(--bg)_60%,transparent)] hover:text-[var(--fg)]',
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <span className="font-mono text-xs text-[var(--fg-subtle)]">
                          0{i + 1}
                        </span>
                        {section.label}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
