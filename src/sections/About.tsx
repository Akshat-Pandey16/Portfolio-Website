import { motion } from 'motion/react';
import { FiCpu, FiCoffee, FiFeather, FiGithub } from 'react-icons/fi';
import { Section } from '../components/Section';

const STATS = [
  { label: 'Years writing code', value: '5+' },
  { label: 'Internships shipped', value: '2' },
  { label: 'Projects in the wild', value: '10+' },
  { label: 'Hackathons led', value: 'A few' },
];

const TRAITS = [
  { Icon: FiCpu, label: 'Backend-first thinking' },
  { Icon: FiFeather, label: 'Sweats the small details' },
  { Icon: FiGithub, label: 'Ships in the open' },
  { Icon: FiCoffee, label: 'Calm under deadline' },
];

export function About() {
  return (
    <Section
      id="about"
      eyebrow="About"
      title={
        <>
          A short story about <em className="italic text-[var(--accent)]">how I got here.</em>
        </>
      }
      description="22 years old, finishing a Bachelors in Computer Science at Bhilai Institute of Technology, Durg. Backend is home base; everything else is curiosity."
      container="wide"
    >
      <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="surface rounded-3xl p-7 sm:p-10"
        >
          <div className="space-y-5 text-base leading-relaxed text-[var(--fg-muted)] sm:text-lg">
            <p>
              I&apos;m mostly self-taught. I navigate unfamiliar stacks without
              ceremony, and I lean on AI tools when they earn their place — they
              are great accelerants, terrible substitutes for taste.
            </p>
            <p>
              I&apos;ve led teams in hackathons, won a couple, and learned more
              from the ones we didn&apos;t. The pattern: stay close to the
              problem, keep the data model honest, and write the boring docs.
            </p>
            <p>
              This site is the product of that curiosity — a first React
              project, learned end-to-end in TypeScript and Tailwind, then
              rewritten when the original got embarrassing.
            </p>
          </div>

          <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {TRAITS.map(({ Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-xs font-medium text-[var(--fg-muted)]"
              >
                <Icon className="h-4 w-4 text-accent-500" />
                {label}
              </li>
            ))}
          </ul>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
          className="space-y-3"
        >
          <ul className="grid grid-cols-2 gap-3">
            {STATS.map((stat) => (
              <li
                key={stat.label}
                className="surface rounded-2xl p-5 transition-transform duration-200 hover:-translate-y-0.5"
              >
                <p className="font-display text-4xl leading-none text-accent-500">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-[var(--fg-muted)]">{stat.label}</p>
              </li>
            ))}
          </ul>
          <blockquote className="surface rounded-2xl p-6">
            <p className="font-display text-lg leading-snug text-[var(--fg)]">
              &ldquo;Backend is where I came from. Frontend is where I came to
              stretch.&rdquo;
            </p>
            <footer className="mt-3 text-sm text-[var(--fg-muted)]">
              — note to self, somewhere around year three
            </footer>
          </blockquote>
        </motion.div>
      </div>
    </Section>
  );
}
