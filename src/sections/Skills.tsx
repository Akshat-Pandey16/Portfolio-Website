import { motion } from 'motion/react';
import { Section } from '../components/Section';
import { Panel } from '../components/Panel';
import { Topology } from '../components/Topology';
import { STACK_INFRA, MARQUEE } from '../lib/data';
import { VIEWPORT } from '../lib/motion';

export function Skills() {
  return (
    <Section
      id="skills"
      index="04"
      channel="Stack"
      title={
        <>
          The route a request <span className="text-[var(--accent)]">travels.</span>
        </>
      }
      description="This is the stack I reach for, drawn as the path a request actually takes — runtime to API to async to state. Hover any service to light up what it talks to."
      container="wide"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={VIEWPORT}
        transition={{ duration: 0.55, ease: [0.22, 0.8, 0.24, 1] }}
      >
        <Panel bracket className="overflow-hidden p-5 sm:p-7">
          <Topology />

          {/* infrastructure base */}
          <div className="mt-6 border-t border-[var(--border)] pt-5">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--fg-subtle)]">
              // infrastructure · the boxes it all runs on
            </p>
            <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {STACK_INFRA.map((s, i) => (
                <motion.li
                  key={s.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEWPORT}
                  transition={{ duration: 0.35, delay: i * 0.05 }}
                  className="group rounded-lg border border-[var(--border)] bg-[var(--bg)] p-3 transition-colors hover:border-[var(--accent)]"
                >
                  <div className="flex items-center gap-2">
                    <s.Icon className="h-4 w-4 text-[var(--fg)] transition-colors group-hover:text-[var(--accent)]" />
                    <span className="font-mono text-[12px] text-[var(--fg)]">{s.label}</span>
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--bg-sunken)]">
                    <motion.span
                      initial={{ width: 0 }}
                      whileInView={{ width: `${s.level}%` }}
                      viewport={VIEWPORT}
                      transition={{ duration: 0.9, delay: 0.15 + i * 0.05, ease: 'easeOut' }}
                      className="block h-full rounded-full bg-[var(--accent)]"
                    />
                  </div>
                </motion.li>
              ))}
            </ul>
          </div>
        </Panel>
      </motion.div>

      {/* token ticker */}
      <div
        aria-hidden
        className="group relative mt-6 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--bg-elev)] py-3 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
      >
        <div className="flex w-max animate-[marquee_34s_linear_infinite] gap-3 pr-3 group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {[...MARQUEE, ...MARQUEE].map((label, i) => (
            <span
              key={`${label}-${i}`}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--fg-muted)]"
            >
              <span className="h-1 w-1 rounded-full bg-[var(--accent)]" />
              {label}
            </span>
          ))}
        </div>
      </div>
    </Section>
  );
}
