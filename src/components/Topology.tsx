import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useInView } from 'motion/react';
import { STACK_EDGES, STACK_NODES, type StackNode } from '../lib/data';
import { cn } from '../lib/cn';

const COL_LABELS = ['runtime', 'api', 'async', 'state'];
const PAD_Y = 46;

function useSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const r = el.getBoundingClientRect();
      setSize({ w: r.width, h: r.height });
    };
    measure(); // seed synchronously before paint → no w=0 collapse flash
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, size] as const;
}

/**
 * The stack as a live service map: a request flows left→right through the
 * runtime, API, async and state layers. Edges pulse with data; hover a node
 * to light up everything it talks to. Collapses to a clean list on phones.
 */
export function Topology() {
  const [ref, { w, h }] = useSize<HTMLDivElement>();
  const inView = useInView(ref, { margin: '160px' });
  const [hover, setHover] = useState<string | null>(null);

  const padX = w ? Math.max(88, Math.min(120, w * 0.16)) : 0;
  const innerW = Math.max(0, w - padX * 2);
  const innerH = Math.max(0, h - PAD_Y * 2);
  const ready = w > 0 && h > 0;

  const positions = useMemo(() => {
    const map = new Map<string, { x: number; y: number }>();
    for (const n of STACK_NODES) {
      const x = padX + (n.col / 3) * innerW;
      const y = PAD_Y + (0.5 + n.row * 0.42) * innerH;
      map.set(n.id, { x, y });
    }
    return map;
  }, [padX, innerW, innerH]);

  const neighbors = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const [a, b] of STACK_EDGES) {
      if (!map.has(a)) map.set(a, new Set());
      if (!map.has(b)) map.set(b, new Set());
      map.get(a)!.add(b);
      map.get(b)!.add(a);
    }
    return map;
  }, []);

  const activeNode = hover ? STACK_NODES.find((n) => n.id === hover) : null;
  const isDimmed = (id: string) => hover != null && hover !== id && !neighbors.get(hover)?.has(id);
  const edgeHot = (a: string, b: string) => hover === a || hover === b;

  return (
    <div>
      {/* graph — md+ */}
      <div ref={ref} className="relative hidden h-[400px] w-full md:block lg:h-[440px]">
        {ready && (
          <>
            {COL_LABELS.map((label, i) => (
              <span
                key={label}
                className="absolute top-0 -translate-x-1/2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--fg-subtle)]"
                style={{ left: `${padX + (i / 3) * innerW}px` }}
              >
                {label}
              </span>
            ))}

            <svg className="absolute inset-0 h-full w-full" fill="none" aria-hidden>
              {STACK_EDGES.map(([a, b]) => {
                const pa = positions.get(a);
                const pb = positions.get(b);
                if (!pa || !pb) return null;
                const dx = pb.x - pa.x;
                const d = `M${pa.x},${pa.y} C${pa.x + dx * 0.5},${pa.y} ${pb.x - dx * 0.5},${pb.y} ${pb.x},${pb.y}`;
                const hot = edgeHot(a, b);
                const dim = hover != null && !hot;
                return (
                  <g key={`${a}-${b}`} opacity={dim ? 0.25 : 1} className="transition-opacity duration-300">
                    <path d={d} stroke="var(--border-strong)" strokeWidth={1.25} />
                    <path
                      d={d}
                      stroke={hot ? 'var(--accent)' : 'var(--cyan)'}
                      strokeWidth={hot ? 2 : 1.25}
                      strokeLinecap="round"
                      strokeDasharray="1 9"
                      className={cn(
                        inView && '[animation:flow-dash_1.1s_linear_infinite]',
                        'motion-reduce:[animation:none]',
                      )}
                      style={{ opacity: hot ? 1 : 0.55 }}
                    />
                  </g>
                );
              })}
            </svg>

            {STACK_NODES.map((n) => {
              const p = positions.get(n.id);
              if (!p) return null;
              const active = hover === n.id;
              return (
                <button
                  key={n.id}
                  type="button"
                  onMouseEnter={() => setHover(n.id)}
                  onMouseLeave={() => setHover((cur) => (cur === n.id ? null : cur))}
                  onFocus={() => setHover(n.id)}
                  onBlur={() => setHover((cur) => (cur === n.id ? null : cur))}
                  aria-label={`${n.label} — ${n.note}, proficiency ${n.level}%`}
                  className={cn(
                    'absolute z-10 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-lg border bg-[var(--bg-elev)] px-3 py-2 font-mono text-[12px] transition-all duration-300',
                    active
                      ? 'border-[var(--accent)] text-[var(--fg)] shadow-[0_0_0_4px_var(--accent-soft)]'
                      : 'border-[var(--border)] text-[var(--fg-muted)] hover:border-[var(--accent)]',
                    isDimmed(n.id) && 'opacity-35',
                  )}
                  style={{ left: p.x, top: p.y }}
                >
                  <n.Icon className={cn('h-4 w-4', active ? 'text-[var(--accent)]' : 'text-[var(--fg)]')} />
                  {n.label}
                </button>
              );
            })}
          </>
        )}
      </div>

      {/* inspector caption */}
      <div className="mt-2 hidden h-6 items-center gap-2 font-mono text-xs md:flex">
        <span className="text-[var(--accent)]">▸</span>
        {activeNode ? (
          <span className="text-[var(--fg-muted)]">
            <span className="text-[var(--fg)]">{activeNode.label}</span> — {activeNode.note} ·{' '}
            <span className="text-[var(--accent)]">{activeNode.level}% load</span>
          </span>
        ) : (
          <span className="text-[var(--fg-subtle)]">hover a service to inspect the route it serves</span>
        )}
      </div>

      {/* stacked list — small screens */}
      <ol className="space-y-3 md:hidden">
        {COL_LABELS.map((label, col) => {
          const nodes = STACK_NODES.filter((n) => n.col === col);
          return (
            <li key={label} className="rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] p-3">
              <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--fg-subtle)]">
                {String(col + 1).padStart(2, '0')} · {label}
              </p>
              <ul className="flex flex-wrap gap-2">
                {nodes.map((n: StackNode) => (
                  <li
                    key={n.id}
                    className="flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-2.5 py-1.5 font-mono text-[12px] text-[var(--fg-muted)]"
                  >
                    <n.Icon className="h-4 w-4 text-[var(--accent)]" />
                    {n.label}
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
