import { motion } from 'motion/react';
import { Section } from '../components/Section';
import { Panel } from '../components/Panel';
import { REASONS } from '../lib/data';
import { VIEWPORT } from '../lib/motion';

export function WhyHire() {
  return (
    <Section
      id="why-hire"
      index="05"
      channel="Runbook"
      title={
        <>
          How I operate <span className="text-[var(--accent)]">under load.</span>
        </>
      }
      description="If you need someone who can move between backend, frontend and the parts in-between without losing the plot — here's the runbook."
      container="wide"
    >
      <ol className="grid gap-5 sm:grid-cols-2">
        {REASONS.map((reason, index) => (
          <motion.li
            key={reason.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.4, ease: 'easeOut', delay: index * 0.05 }}
          >
            <Panel bracket spotlight interactive className="group relative h-full overflow-hidden p-7">
              <span
                aria-hidden
                className="font-display absolute -right-2 -top-6 text-[7rem] leading-none text-[var(--fg)]/[0.04] transition-all duration-500 group-hover:text-[var(--accent)]/15"
              >
                {String(index + 1).padStart(2, '0')}
              </span>
              <div className="relative">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--bg)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--accent)]">
                  {reason.tag}
                </span>
                <h3 className="font-display mt-4 text-xl text-[var(--fg)] sm:text-2xl">
                  {reason.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-[var(--fg-muted)] sm:text-base">
                  {reason.body}
                </p>
              </div>
            </Panel>
          </motion.li>
        ))}
      </ol>
    </Section>
  );
}
