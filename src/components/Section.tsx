import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';

type SectionProps = Omit<HTMLAttributes<HTMLElement>, 'title'> & {
  id: string;
  eyebrow?: string;
  title?: ReactNode;
  description?: ReactNode;
  container?: 'default' | 'wide' | 'narrow';
  headerAside?: ReactNode;
};

const containerClasses = {
  default: 'max-w-7xl',
  wide: 'max-w-[88rem]',
  narrow: 'max-w-5xl',
};

export function Section({
  id,
  eyebrow,
  title,
  description,
  children,
  className,
  container = 'default',
  headerAside,
  ...rest
}: SectionProps) {
  return (
    <section
      id={id}
      className={cn(
        'relative scroll-mt-20 px-5 py-16 sm:px-8 sm:py-20 lg:px-12 lg:py-24',
        className,
      )}
      {...rest}
    >
      <div className={cn('mx-auto w-full', containerClasses[container])}>
        {(eyebrow || title || description) && (
          <header className="mb-10 flex flex-col gap-6 sm:mb-14 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
              {title && (
                <h2
                  className="font-display text-balance leading-[0.95] text-[var(--fg)]"
                  style={{ fontSize: 'var(--text-display-sm)' }}
                >
                  {title}
                </h2>
              )}
              {description && (
                <p className="mt-5 max-w-xl text-base text-[var(--fg-muted)] sm:text-lg">
                  {description}
                </p>
              )}
            </div>
            {headerAside && <div className="shrink-0 lg:max-w-sm">{headerAside}</div>}
          </header>
        )}
        {children}
      </div>
    </section>
  );
}
