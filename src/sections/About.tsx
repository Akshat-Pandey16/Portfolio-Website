import { motion } from 'motion/react';
import { FiCpu, FiCoffee, FiFeather, FiGithub } from 'react-icons/fi';
import { Section } from '../components/Section';
import { Panel } from '../components/Panel';
import { CountUp } from '../components/CountUp';
import { STATS } from '../lib/data';
import { VIEWPORT, reveal } from '../lib/motion';

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
      index="01"
      channel="Profile"
      title={
        <>
          The operator behind <span className="text-[var(--accent)]">the deck.</span>
        </>
      }
      description="Backend developer at Intozi Tech building Python services for a computer-vision product. CS grad from Bhilai Institute of Technology (CPI 9.68). Backend is home base; everything else is curiosity."
      container="wide"
    >
      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <motion.div variants={reveal} initial="hidden" whileInView="show" viewport={VIEWPORT}>
          <Panel bracket spotlight className="h-full p-7 sm:p-10">
            <div className="space-y-5 text-base leading-relaxed text-[var(--fg-muted)] sm:text-lg">
              <p>
                I&apos;m mostly self-taught, and I move into unfamiliar stacks
                without ceremony. I lean on AI tools when they earn their place —
                great accelerants, terrible substitutes for taste.
              </p>
              <p>
                I&apos;ve led teams in hackathons and learned a lot doing it —
                including winning{' '}
                <span className="text-[var(--fg)]">KAVACH&apos;23</span>, the
                Government of India&apos;s national cybersecurity hackathon. The
                pattern that travels: stay close to the problem, keep the data
                model honest, and write the boring docs.
              </p>
              <p>
                This deck is the product of that same curiosity — rebuilt from
                scratch, end to end, once the first cut started to embarrass me.
              </p>
            </div>

            <ul className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {TRAITS.map(({ Icon, label }, i) => (
                <motion.li
                  key={label}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={VIEWPORT}
                  transition={{ duration: 0.3, delay: 0.1 + i * 0.06 }}
                  className="group flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] px-3 py-2 text-xs font-medium text-[var(--fg-muted)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--accent)] hover:text-[var(--fg)]"
                >
                  <Icon className="h-4 w-4 text-[var(--accent)] transition-transform group-hover:rotate-12" />
                  {label}
                </motion.li>
              ))}
            </ul>
          </Panel>
        </motion.div>

        <div className="grid gap-4">
          <ul className="grid grid-cols-2 gap-4">
            {STATS.map((stat, i) => (
              <motion.li
                key={stat.label}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={VIEWPORT}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <Panel spotlight interactive className="group h-full overflow-hidden p-5">
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--fg-subtle)]">
                    {stat.hint}
                  </p>
                  <p className="font-display mt-2 text-[2.6rem] leading-none text-[var(--accent)] tabular-nums">
                    {stat.literal ? (
                      stat.literal
                    ) : (
                      <CountUp to={stat.to} suffix={stat.suffix} />
                    )}
                  </p>
                  <p className="mt-2 text-sm leading-snug text-[var(--fg-muted)]">{stat.label}</p>
                </Panel>
              </motion.li>
            ))}
          </ul>

          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={VIEWPORT}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Panel spotlight className="p-6">
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-[var(--fg-subtle)]">
                // note to self
              </p>
              <blockquote className="font-display mt-3 text-lg leading-snug text-[var(--fg)]">
                &ldquo;Backend is where I came from. Frontend is where I came to
                stretch.&rdquo;
              </blockquote>
              <p className="mt-3 text-sm text-[var(--fg-muted)]">
                — somewhere around year three
              </p>
            </Panel>
          </motion.div>
        </div>
      </div>
    </Section>
  );
}
