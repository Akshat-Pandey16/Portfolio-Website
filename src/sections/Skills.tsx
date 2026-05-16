import { motion } from 'motion/react';
import { Section } from '../components/Section';
import { SKILL_GROUPS } from '../lib/data';

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

            <ul className="mt-6 grid flex-1 grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
              {group.skills.map((skill) => (
                <li
                  key={skill.name}
                  className="surface-sunken group flex flex-col items-center justify-center gap-2 rounded-2xl p-4 text-center transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--border-strong)]"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--bg-elev)] p-1.5 transition-transform duration-200 group-hover:scale-110">
                    <img
                      src={skill.icon}
                      alt=""
                      className="h-full w-full object-contain"
                      loading="lazy"
                    />
                  </span>
                  <span className="text-xs font-medium text-[var(--fg)] sm:text-sm">
                    {skill.name}
                  </span>
                </li>
              ))}
            </ul>
          </motion.section>
        ))}
      </div>
    </Section>
  );
}
