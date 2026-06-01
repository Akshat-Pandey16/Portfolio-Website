import { motion } from 'motion/react';
import { FiActivity } from 'react-icons/fi';
import { Section } from '../components/Section';
import { Panel } from '../components/Panel';
import { EXPERIENCES } from '../lib/data';
import { VIEWPORT } from '../lib/motion';

export function Experience() {
  return (
    <Section
      id="experience"
      index="02"
      channel="Deployment"
      title={
        <>
          The service I run <span className="text-[var(--accent)]">in production.</span>
        </>
      }
      description="I lead the backend on a computer-vision and video-analytics platform — most of what I build never shows its face in the UI, and that's exactly the point."
      container="wide"
    >
      <div className="space-y-5">
        {EXPERIENCES.map((exp) => (
          <motion.div
            key={exp.organization}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.5, ease: [0.22, 0.8, 0.24, 1] }}
          >
            <Panel bracket spotlight sweep className="overflow-hidden p-6 sm:p-9">
              {/* header */}
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg)] font-display text-2xl font-bold text-[var(--accent)]">
                    {exp.organization.charAt(0)}
                  </div>
                  <div>
                    <h3 className="font-display text-2xl text-[var(--fg)] sm:text-3xl">
                      {exp.organization}
                    </h3>
                    <p className="mt-1 font-mono text-xs text-[var(--fg-muted)]">
                      {exp.role} · {exp.location}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[var(--accent)]/40 bg-[var(--accent-soft)] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--accent)]">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--accent)]" />
                    {exp.status}
                  </span>
                  <span className="font-mono text-[11px] text-[var(--fg-subtle)]">{exp.period}</span>
                </div>
              </div>

              {/* metrics strip */}
              <dl className="mt-6 grid grid-cols-3 gap-3 rounded-xl border border-[var(--border)] bg-[var(--bg-sunken)] p-4">
                {exp.metrics.map((m) => (
                  <div key={m.label} className="text-center">
                    <dt className="font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
                      {m.label}
                    </dt>
                    <dd className="font-display mt-1 text-base text-[var(--fg)] sm:text-lg">
                      {m.value}
                    </dd>
                  </div>
                ))}
              </dl>

              <p className="mt-6 max-w-3xl text-base leading-relaxed text-[var(--fg-muted)] sm:text-lg">
                {exp.description}
              </p>

              {/* active processes */}
              <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--fg-subtle)]">
                active processes
              </p>
              <ul className="mt-3 space-y-2.5">
                {exp.highlights.map((h, hi) => (
                  <motion.li
                    key={h}
                    initial={{ opacity: 0, x: -8 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={VIEWPORT}
                    transition={{ duration: 0.35, delay: 0.1 + hi * 0.06 }}
                    className="flex gap-3 text-sm leading-relaxed text-[var(--fg-muted)] sm:text-base"
                  >
                    <FiActivity className="mt-1 h-4 w-4 shrink-0 text-[var(--accent)]" />
                    <span>{h}</span>
                  </motion.li>
                ))}
              </ul>

              <ul className="mt-6 flex flex-wrap gap-2">
                {exp.stack.map((tech) => (
                  <li
                    key={tech}
                    className="rounded-md border border-[var(--border)] bg-[var(--bg)] px-2.5 py-1 font-mono text-[11px] text-[var(--fg-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                  >
                    {tech}
                  </li>
                ))}
              </ul>
            </Panel>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
