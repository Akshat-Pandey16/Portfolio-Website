import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/cn';
import { spotlightMove } from '../lib/spotlight';

type PanelProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  bracket?: boolean;
  spotlight?: boolean;
  sweep?: boolean;
  interactive?: boolean;
};

/** The deck's base surface: a framed panel with optional HUD chrome. */
export function Panel({
  children,
  className,
  bracket = false,
  spotlight = false,
  sweep = false,
  interactive = false,
  onPointerMove,
  ...rest
}: PanelProps) {
  return (
    <div
      className={cn(
        'panel rounded-2xl',
        bracket && 'bracketed',
        spotlight && 'spotlight',
        interactive &&
          'transition-[transform,border-color,box-shadow] duration-300 hover:-translate-y-1 hover:border-[var(--border-strong)] hover:shadow-[0_18px_50px_-24px_rgba(0,0,0,0.5)]',
        className,
      )}
      onPointerMove={(e) => {
        if (spotlight) spotlightMove(e);
        onPointerMove?.(e);
      }}
      {...rest}
    >
      {sweep && <span className="sweep-line" aria-hidden />}
      {children}
    </div>
  );
}

/** A small mono header strip for a panel: label · status code. */
export function PanelTag({
  label,
  code,
  className,
}: {
  label: ReactNode;
  code?: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--fg-subtle)]',
        className,
      )}
    >
      <span className="inline-flex items-center gap-1.5">
        <span className="h-1 w-1 rounded-full bg-[var(--accent)]" />
        {label}
      </span>
      {code != null && <span className="tabular-nums">{code}</span>}
    </div>
  );
}
