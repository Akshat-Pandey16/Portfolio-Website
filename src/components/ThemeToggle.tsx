import { FiMoon, FiSun } from 'react-icons/fi';
import { useTheme } from '../hooks/useTheme';
import { cn } from '../lib/cn';

type Props = {
  className?: string;
};

export function ThemeToggle({ className }: Props) {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={isDark}
      className={cn(
        'group relative inline-flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border border-[var(--border)]',
        'bg-[var(--bg-elev)] text-[var(--fg)] transition-all duration-300',
        'hover:border-[var(--border-strong)] hover:text-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--ring)]',
        className,
      )}
    >
      <FiSun
        className={cn(
          'absolute h-5 w-5 transition-all duration-300',
          isDark ? '-rotate-90 scale-0 opacity-0' : 'rotate-0 scale-100 opacity-100',
        )}
      />
      <FiMoon
        className={cn(
          'h-5 w-5 transition-all duration-300',
          isDark ? 'rotate-0 scale-100 opacity-100' : 'rotate-90 scale-0 opacity-0',
        )}
      />
    </button>
  );
}
