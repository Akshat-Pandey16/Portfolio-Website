import { useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { VIEWPORT } from '../lib/motion';

type Props = {
  value: number; // 0..100
  size?: number;
  stroke?: number;
  label?: string;
  className?: string;
};

/** A radial telemetry gauge — animated arc fill on scroll into view. */
export function Gauge({ value, size = 72, stroke = 5, label, className }: Props) {
  const ref = useRef<SVGSVGElement>(null);
  const inView = useInView(ref, VIEWPORT);
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.max(0, Math.min(100, value)) / 100;

  return (
    <svg
      ref={ref}
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      className={className}
      role="img"
      aria-label={label ? `${label}: ${value}%` : `${value}%`}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--border)"
        strokeWidth={stroke}
      />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="var(--accent)"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        animate={inView ? { strokeDashoffset: c * (1 - pct) } : { strokeDashoffset: c }}
        transition={{ duration: 1.1, ease: [0.22, 0.8, 0.24, 1], delay: 0.15 }}
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text
        x="50%"
        y="50%"
        dominantBaseline="central"
        textAnchor="middle"
        className="fill-[var(--fg)] font-mono"
        style={{ fontSize: size * 0.24, fontWeight: 600 }}
      >
        {value}
      </text>
    </svg>
  );
}
