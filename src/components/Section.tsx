import type { HTMLAttributes, ReactNode } from 'react';
import { motion } from 'motion/react';
import { cn } from '../lib/cn';
import { VIEWPORT } from '../lib/motion';

type SectionProps = Omit<HTMLAttributes<HTMLElement>, 'title'> & {
  id: string;
  index?: string;
  channel?: string;
  title?: ReactNode;
  description?: ReactNode;
  container?: 'default' | 'wide' | 'narrow';
  headerAside?: ReactNode;
};

const containerClasses = {
  default: 'max-w-7xl',
  wide: 'max-w-[92rem]',
  narrow: 'max-w-5xl',
};

export function Section({
  id,
  index,
  channel,
  title,
  description,
  children,
  className,
  container = 'default',
  headerAside,
  ...rest
}: SectionProps) {
  const hasHeader = channel || title || description;
  return (
    <section
      id={id}
      className={cn('relative scroll-mt-24 px-5 py-16 sm:px-8 sm:py-20 lg:px-10 lg:py-24', className)}
      {...rest}
    >
      <div className={cn('mx-auto w-full', containerClasses[container])}>
        {hasHeader && (
          <motion.header
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, ease: [0.22, 0.8, 0.24, 1] }}
            className="mb-10 sm:mb-14"
          >
            {/* channel header bar */}
            {channel && (
              <div className="mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.26em] text-[var(--fg-subtle)]">
                <span className="text-[var(--accent)]">{index ?? '//'}</span>
                <span>{channel}</span>
                <span className="relative h-px flex-1 overflow-hidden bg-[var(--border)]">
                  <motion.span
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={VIEWPORT}
                    transition={{ duration: 0.9, ease: 'easeOut', delay: 0.1 }}
                    className="absolute inset-0 origin-left bg-gradient-to-r from-[var(--accent)] to-transparent"
                  />
                </span>
              </div>
            )}
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl">
                {title && (
                  <h2
                    className="font-display text-balance leading-[0.98] text-[var(--fg)]"
                    style={{ fontSize: 'var(--text-display-sm)', fontWeight: 600 }}
                  >
                    {title}
                  </h2>
                )}
                {description && (
                  <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--fg-muted)] sm:text-lg">
                    {description}
                  </p>
                )}
              </div>
              {headerAside && <div className="shrink-0 lg:max-w-sm">{headerAside}</div>}
            </div>
          </motion.header>
        )}
        {children}
      </div>
    </section>
  );
}
