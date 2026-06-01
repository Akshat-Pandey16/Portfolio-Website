import { useEffect, useRef, useState } from 'react';
import { prefersReducedMotion } from '../lib/motion';

type Props = {
  points?: number;
  live?: boolean;
  className?: string;
  stroke?: string;
  fillFrom?: string;
};

/* deterministic-ish telemetry series: smoothed noise in [0.12, 0.96] */
function seed(n: number, phase: number) {
  const a = Math.sin(n * 12.9898 + phase) * 43758.5453;
  return a - Math.floor(a);
}
function makeSeries(count: number, phase = 0) {
  const out: number[] = [];
  let v = 0.5;
  for (let i = 0; i < count; i++) {
    const target = 0.2 + seed(i, phase) * 0.7;
    v += (target - v) * 0.55;
    const spike = seed(i * 3.1, phase + 4) > 0.86 ? 0.22 : 0;
    out.push(Math.min(0.97, Math.max(0.1, v + spike)));
  }
  return out;
}

function toPath(series: number[], w: number, h: number) {
  const n = series.length;
  if (n < 2) return '';
  const step = w / (n - 1);
  return series
    .map((val, i) => `${i === 0 ? 'M' : 'L'}${(i * step).toFixed(2)},${((1 - val) * h).toFixed(2)}`)
    .join(' ');
}

/**
 * A live "req/s" telemetry sparkline. Updates a sliding window on an interval
 * (paused when hidden / reduced-motion) — one polyline redraw, very cheap.
 */
export function Sparkline({
  points = 52,
  live = true,
  className,
  stroke = 'var(--accent)',
  fillFrom = 'var(--accent)',
}: Props) {
  const W = 100;
  const H = 36;
  const phaseRef = useRef(7);
  const [series, setSeries] = useState(() => makeSeries(points, 7));

  useEffect(() => {
    if (!live || prefersReducedMotion()) return;
    let id = 0;
    const tick = () => {
      if (!document.hidden) {
        setSeries((prev) => {
          phaseRef.current += 0.37;
          const next = 0.2 + seed(phaseRef.current * 5.3, 2) * 0.72;
          const spike = seed(phaseRef.current * 2.1, 9) > 0.85 ? 0.2 : 0;
          return [...prev.slice(1), Math.min(0.97, next + spike)];
        });
      }
      id = window.setTimeout(tick, 720);
    };
    id = window.setTimeout(tick, 720);
    return () => window.clearTimeout(id);
  }, [live]);

  const line = toPath(series, W, H);
  const area = `${line} L${W},${H} L0,${H} Z`;
  const lastY = (1 - series[series.length - 1]!) * H;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="none"
      className={className}
      aria-hidden
    >
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={fillFrom} stopOpacity="0.28" />
          <stop offset="100%" stopColor={fillFrom} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#spark-fill)" stroke="none" />
      <path
        d={line}
        fill="none"
        stroke={stroke}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
      <circle cx={W} cy={lastY} r="1.8" fill={stroke} vectorEffect="non-scaling-stroke" />
    </svg>
  );
}
