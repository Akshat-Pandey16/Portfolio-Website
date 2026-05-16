import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  FiCheck,
  FiCommand,
  FiCornerDownLeft,
  FiCopy,
  FiDownload,
  FiGithub,
  FiLinkedin,
  FiMail,
  FiMoon,
  FiSearch,
  FiSun,
} from 'react-icons/fi';
import type { IconType } from 'react-icons';
import { EMAIL, NAV_SECTIONS, RESUME_URL } from '../lib/data';
import { useTheme } from '../hooks/useTheme';
import { cn } from '../lib/cn';

type Action = {
  id: string;
  label: string;
  hint?: string;
  keywords?: string;
  group: 'Jump to' | 'Quick actions' | 'Profiles';
  Icon: IconType;
  run: () => void | Promise<void>;
};

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  const [copied, setCopied] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const { isDark, toggleTheme } = useTheme();

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActive(0);
  }, []);

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  }, []);

  const actions = useMemo<Action[]>(() => {
    const jumps: Action[] = [
      { id: 'jump-hero', label: 'Top', group: 'Jump to', Icon: FiSearch, run: () => scrollToSection('hero') },
      ...NAV_SECTIONS.map((s) => ({
        id: `jump-${s.id}`,
        label: s.label,
        group: 'Jump to' as const,
        Icon: FiSearch,
        run: () => scrollToSection(s.id),
      })),
    ];

    const quick: Action[] = [
      {
        id: 'copy-email',
        label: 'Copy email address',
        hint: EMAIL,
        keywords: 'mail contact reach',
        group: 'Quick actions',
        Icon: copied ? FiCheck : FiCopy,
        run: () => copyEmail(),
      },
      {
        id: 'send-email',
        label: 'Send email',
        hint: `mailto:${EMAIL}`,
        keywords: 'gmail message write',
        group: 'Quick actions',
        Icon: FiMail,
        run: () => {
          window.location.href = `mailto:${EMAIL}`;
        },
      },
      {
        id: 'open-resume',
        label: 'Open résumé',
        hint: 'Google Drive · PDF',
        keywords: 'cv pdf download',
        group: 'Quick actions',
        Icon: FiDownload,
        run: () => {
          window.open(RESUME_URL, '_blank', 'noopener,noreferrer');
        },
      },
      {
        id: 'toggle-theme',
        label: isDark ? 'Switch to light mode' : 'Switch to dark mode',
        keywords: 'dark light theme appearance',
        group: 'Quick actions',
        Icon: isDark ? FiSun : FiMoon,
        run: () => toggleTheme(),
      },
    ];

    const profiles: Action[] = [
      {
        id: 'open-github',
        label: 'GitHub',
        hint: 'github.com/Akshat-Pandey16',
        keywords: 'code repos',
        group: 'Profiles',
        Icon: FiGithub,
        run: () => {
          window.open('https://github.com/Akshat-Pandey16', '_blank', 'noopener,noreferrer');
        },
      },
      {
        id: 'open-linkedin',
        label: 'LinkedIn',
        hint: 'linkedin.com/in/akshat16pandey',
        keywords: 'profile work',
        group: 'Profiles',
        Icon: FiLinkedin,
        run: () => {
          window.open('https://www.linkedin.com/in/akshat16pandey/', '_blank', 'noopener,noreferrer');
        },
      },
    ];

    return [...jumps, ...quick, ...profiles];
  }, [copied, copyEmail, isDark, toggleTheme]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return actions;
    return actions.filter((a) =>
      [a.label, a.hint, a.keywords, a.group].filter(Boolean).join(' ').toLowerCase().includes(q),
    );
  }, [query, actions]);

  const grouped = useMemo(() => {
    const map = new Map<Action['group'], Action[]>();
    for (const a of filtered) {
      if (!map.has(a.group)) map.set(a.group, []);
      map.get(a.group)!.push(a);
    }
    return Array.from(map.entries());
  }, [filtered]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActive(0);
  }, [query, open]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const isMod = event.metaKey || event.ctrlKey;
      if (isMod && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen((v) => !v);
      } else if (!open && !isMod && event.key === '/' && !isTypingTarget(event.target)) {
        event.preventDefault();
        setOpen(true);
      }
    };
    const onPaletteOpen = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('palette:open', onPaletteOpen as EventListener);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('palette:open', onPaletteOpen as EventListener);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const node = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`);
    node?.scrollIntoView({ block: 'nearest' });
  }, [active, open, filtered]);

  const handleSelect = useCallback(
    async (action: Action) => {
      await action.run();
      if (action.id !== 'copy-email' && action.id !== 'toggle-theme') {
        close();
      }
    },
    [close],
  );

  const onInputKey = (event: React.KeyboardEvent) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((i) => Math.min(filtered.length - 1, i + 1));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((i) => Math.max(0, i - 1));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      const a = filtered[active];
      if (a) handleSelect(a);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      close();
    }
  };

  let cursor = -1;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="palette"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[12vh] sm:pt-[16vh]"
          aria-modal
          role="dialog"
          aria-label="Command palette"
        >
          <button
            type="button"
            aria-label="Close palette"
            onClick={close}
            className="absolute inset-0 -z-10 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-elev)] shadow-2xl shadow-black/30"
          >
            <div className="flex items-center gap-3 border-b border-[var(--border)] px-4">
              <FiSearch className="h-4 w-4 shrink-0 text-[var(--fg-subtle)]" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKey}
                placeholder="Type a command, or search…"
                className="w-full bg-transparent py-4 text-sm text-[var(--fg)] placeholder:text-[var(--fg-subtle)] focus:outline-none"
                autoComplete="off"
                spellCheck={false}
              />
              <kbd className="hidden items-center gap-1 rounded border border-[var(--border)] bg-[var(--bg)] px-1.5 py-0.5 font-mono text-[10px] text-[var(--fg-subtle)] sm:inline-flex">
                ESC
              </kbd>
            </div>

            <ul ref={listRef} className="max-h-[55vh] overflow-y-auto p-2">
              {grouped.length === 0 && (
                <li className="px-3 py-6 text-center text-sm text-[var(--fg-subtle)]">
                  Nothing matches that. Try jumping to a section name.
                </li>
              )}
              {grouped.map(([group, items]) => (
                <li key={group} className="mb-1">
                  <p className="px-3 pb-1 pt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--fg-subtle)]">
                    {group}
                  </p>
                  <ul>
                    {items.map((action) => {
                      cursor += 1;
                      const idx = cursor;
                      const isActive = idx === active;
                      return (
                        <li key={action.id} data-idx={idx}>
                          <button
                            type="button"
                            onMouseEnter={() => setActive(idx)}
                            onClick={() => handleSelect(action)}
                            className={cn(
                              'group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors',
                              isActive
                                ? 'bg-[color-mix(in_oklch,var(--accent)_14%,transparent)] text-[var(--fg)]'
                                : 'text-[var(--fg-muted)] hover:bg-[var(--bg-sunken)]',
                            )}
                          >
                            <span
                              className={cn(
                                'flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--bg)]',
                                isActive && 'border-[var(--accent)] text-[var(--accent)]',
                              )}
                            >
                              <action.Icon className="h-3.5 w-3.5" />
                            </span>
                            <span className="flex min-w-0 flex-1 items-baseline gap-2">
                              <span className="truncate font-medium text-[var(--fg)]">
                                {action.label}
                              </span>
                              {action.hint && (
                                <span className="hidden truncate font-mono text-[11px] text-[var(--fg-subtle)] sm:inline">
                                  {action.hint}
                                </span>
                              )}
                            </span>
                            {isActive && (
                              <FiCornerDownLeft className="h-3.5 w-3.5 shrink-0 text-[var(--accent)]" />
                            )}
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </li>
              ))}
            </ul>

            <div className="flex items-center justify-between gap-3 border-t border-[var(--border)] bg-[var(--bg-sunken)] px-4 py-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--fg-subtle)]">
              <span className="flex items-center gap-3">
                <span className="inline-flex items-center gap-1">
                  <kbd className="rounded border border-[var(--border)] bg-[var(--bg)] px-1.5 py-0.5">↑↓</kbd>
                  navigate
                </span>
                <span className="inline-flex items-center gap-1">
                  <kbd className="rounded border border-[var(--border)] bg-[var(--bg)] px-1.5 py-0.5">↵</kbd>
                  select
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <FiCommand className="h-3 w-3" />
                <span>K to open</span>
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  return tag === 'input' || tag === 'textarea' || target.isContentEditable;
}
