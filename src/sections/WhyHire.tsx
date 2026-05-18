import { motion } from 'motion/react';
import { FiCode, FiLayers, FiUsers, FiZap } from 'react-icons/fi';
import { Section } from '../components/Section';
import { spotlightMove } from '../lib/spotlight';

const REASONS = [
  {
    Icon: FiZap,
    title: 'I pick up stacks fast',
    body:
      'This entire site was my first React project. I learned TypeScript, Tailwind and Figma to get it shipped — then rebuilt it once I knew better.',
  },
  {
    Icon: FiLayers,
    title: 'I think backend-first',
    body:
      'Most of my comfort is in APIs, data and the boring parts that have to be right before the UI matters. I write the schema before I write the screen.',
  },
  {
    Icon: FiUsers,
    title: 'I have led teams under pressure',
    body:
      'Hackathon-style ownership, with the receipts: a couple of wins and many honest learnings. I am comfortable being the one who has to decide.',
  },
  {
    Icon: FiCode,
    title: 'I sweat the small things',
    body:
      'Tabs, spacing, copy, edge cases. The small things compound into a product that feels considered. I would rather ship less and finish it.',
  },
];

export function WhyHire() {
  return (
    <Section
      id="why-hire"
      eyebrow="How I work"
      title={
        <>
          Four habits I bring to the <em className="italic text-[var(--accent)]">work.</em>
        </>
      }
      description="If you are looking for someone who can move between backend, frontend and the parts in-between without losing the plot — here is how I tend to operate."
      container="wide"
    >
      <ol className="grid gap-5 sm:grid-cols-2">
        {REASONS.map((reason, index) => (
          <motion.li
            key={reason.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.4, ease: 'easeOut', delay: index * 0.05 }}
            onPointerMove={spotlightMove}
            className="surface spotlight group relative flex gap-5 overflow-hidden rounded-3xl p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--border-strong)] hover:shadow-xl hover:shadow-black/5"
          >
            <span
              aria-hidden
              className="font-display absolute -right-3 -top-6 text-[7rem] leading-none text-[var(--fg)]/[0.04] transition-all duration-500 group-hover:translate-x-1 group-hover:text-[var(--accent)]/15"
            >
              0{index + 1}
            </span>
            <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--bg)] text-[var(--accent)] transition-all duration-300 group-hover:rotate-6 group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-fg)]">
              <reason.Icon className="h-5 w-5" />
              <span
                aria-hidden
                className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{
                  boxShadow:
                    '0 0 0 4px color-mix(in oklch, var(--accent) 14%, transparent)',
                }}
              />
            </div>
            <div className="relative">
              <h3 className="font-display text-xl text-[var(--fg)] sm:text-2xl">
                {reason.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[var(--fg-muted)] sm:text-base">
                {reason.body}
              </p>
            </div>
          </motion.li>
        ))}
      </ol>
    </Section>
  );
}
