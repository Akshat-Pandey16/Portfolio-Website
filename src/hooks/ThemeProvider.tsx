import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { ThemeContext, type Theme } from './theme-context';

const STORAGE_KEY = 'portfolio-theme';

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') return stored;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

type ViewTransitionDocument = Document & {
  startViewTransition?: (cb: () => void) => { finished: Promise<void> };
};

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    root.style.colorScheme = theme;
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  useEffect(() => {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (event: MediaQueryListEvent) => {
      if (!window.localStorage.getItem(STORAGE_KEY)) {
        setThemeState(event.matches ? 'dark' : 'light');
      }
    };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, []);

  const setTheme = useCallback((next: Theme) => setThemeState(next), []);
  const toggleTheme = useCallback((event?: { clientX: number; clientY: number }) => {
    const doc = document as ViewTransitionDocument;
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const apply = () => setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
    const root = document.documentElement;

    if (!doc.startViewTransition || reduced) {
      root.classList.add('theme-switching');
      apply();
      window.setTimeout(() => root.classList.remove('theme-switching'), 50);
      return;
    }
    if (event) {
      root.style.setProperty('--theme-x', `${event.clientX}px`);
      root.style.setProperty('--theme-y', `${event.clientY}px`);
    } else {
      root.style.setProperty('--theme-x', '50%');
      root.style.setProperty('--theme-y', '50%');
    }
    root.classList.add('theme-switching');
    const transition = doc.startViewTransition(apply);
    transition.finished.finally(() => root.classList.remove('theme-switching'));
  }, []);

  const value = useMemo(
    () => ({ theme, isDark: theme === 'dark', toggleTheme, setTheme }),
    [theme, toggleTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}
