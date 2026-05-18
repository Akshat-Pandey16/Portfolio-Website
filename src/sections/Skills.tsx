import { motion } from 'motion/react';
import { Section } from '../components/Section';
import { SKILL_GROUPS } from '../lib/data';

const MARQUEE = [
  'Python',
  'FastAPI',
  'PostgreSQL',
  'Redis',
  'RabbitMQ',
  'AWS',
  'Nginx',
  'Linux',
  'Django',
  'React',
  'TypeScript',
  'Docker',
  'OpenAPI',
  'pytest',
  'SQL',
];

export function Skills() {
  return (
    <Section
      id="skills"
      eyebrow="Toolkit"
      title={
        <>
          Tools I <em className="italic text-[var(--accent)]">reach for</em>, by section
          of the stack.
        </>
      }
      description="A mix of what I have shipped with and what I keep coming back to."
      container="wide"
    >
      <div className="grid gap-5 lg:grid-cols-3">
        {SKILL_GROUPS.map((group, gi) => (
          <motion.section
            key={group.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.45, ease: 'easeOut', delay: gi * 0.05 }}
            className="surface flex flex-col rounded-3xl p-6 sm:p-7"
          >
            <header className="flex items-baseline justify-between gap-2">
              <h3 className="font-display text-xl text-[var(--fg)]">{group.label}</h3>
              <span className="font-mono text-xs text-[var(--fg-subtle)]">
                0{gi + 1}
              </span>
            </header>
            <p className="mt-1 text-sm text-[var(--fg-muted)]">{group.caption}</p>

            <ul className="mt-6 space-y-2.5">
              {group.skills.map(({ name, Icon, level }, si) => (
                <motion.li
                  key={name}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.4, delay: gi * 0.05 + si * 0.05 }}
                  className="group rounded-2xl border border-transparent p-3 transition-colors hover:border-[var(--border)] hover:bg-[var(--bg-sunken)]"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--bg-sunken)] text-[var(--fg)] transition-all duration-300 group-hover:scale-110 group-hover:text-[var(--accent)]">
                        <Icon className="h-[18px] w-[18px]" aria-hidden />
                      </span>
                      <span className="text-sm font-medium text-[var(--fg)]">{name}</span>
                    </span>
                    <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--fg-subtle)] tabular-nums">
                      {level}%
                    </span>
                  </div>
                  <div className="mt-2 h-1 overflow-hidden rounded-full bg-[var(--bg-sunken)]">
                    <motion.span
                      initial={{ width: 0 }}
                      whileInView={{ width: `${level}%` }}
                      viewport={{ once: true, margin: '-40px' }}
                      transition={{ duration: 1, delay: 0.2 + si * 0.06, ease: 'easeOut' }}
                      className="block h-full rounded-full bg-gradient-to-r from-[var(--accent)]/70 to-[var(--accent)]"
                    />
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.section>
        ))}
      </div>

      <div
        aria-hidden
        className="group relative mt-10 overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--bg-elev)] py-5 [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]"
      >
        <div className="flex w-max animate-[marquee_30s_linear_infinite] gap-3 pr-3 group-hover:[animation-play-state:paused] motion-reduce:animate-none">
          {[...MARQUEE, ...MARQUEE].map((label, i) => (
            <span
              key={`${label}-${i}`}
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-[var(--border)] bg-[var(--bg)] px-4 py-1.5 font-mono text-xs uppercase tracking-[0.18em] text-[var(--fg-muted)]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
              {label}
            </span>
          ))}
        </div>
      </div>
    </Section>
  );
}
