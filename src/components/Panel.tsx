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
