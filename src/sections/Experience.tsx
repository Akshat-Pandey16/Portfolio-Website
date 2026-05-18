import { useRef } from 'react';
import { FiArrowUpRight, FiCheck, FiGithub } from 'react-icons/fi';
import { motion, useScroll, useTransform } from 'motion/react';
import { Section } from '../components/Section';
import { EXPERIENCES } from '../lib/data';
import { spotlightMove } from '../lib/spotlight';

export function Experience() {
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ['start 80%', 'end 35%'],
  });
  const lineScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <Section
      id="experience"
      eyebrow="Experience"
      title={
        <>
          Places that <em className="italic text-[var(--accent)]">gave me a desk.</em>
        </>
      }
      description="Two internships, two very different problem spaces, both of which sharpened how I ship."
      container="wide"
    >
      <ol ref={listRef} className="relative space-y-6 sm:space-y-8 lg:pl-12">
        <span
          aria-hidden
          className="pointer-events-none absolute left-[19px] top-3 hidden h-[calc(100%-1.5rem)] w-px bg-[var(--border)] lg:block"
        />
        <motion.span
          aria-hidden
          style={{ scaleY: lineScale, transformOrigin: '50% 0%' }}
          className="pointer-events-none absolute left-[19px] top-3 hidden h-[calc(100%-1.5rem)] w-px bg-gradient-to-b from-[var(--accent)] via-[var(--accent)] to-transparent lg:block"
        />

        {EXPERIENCES.map((exp, index) => (
          <motion.li
            key={exp.organization}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.45, ease: 'easeOut', delay: index * 0.05 }}
            className="relative"
          >
            <span
              aria-hidden
              className="absolute -left-[37px] top-7 hidden h-3 w-3 -translate-x-1/2 rounded-full border-2 border-[var(--accent)] bg-[var(--bg)] shadow-[0_0_0_4px_color-mix(in_oklch,var(--accent)_18%,transparent)] lg:block"
            />
            <article
              onPointerMove={spotlightMove}
              className="surface spotlight group grid gap-6 rounded-3xl p-7 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-400 hover:shadow-xl hover:shadow-accent-500/5 sm:p-9 lg:grid-cols-[220px_1fr]"
            >
              <div className="flex items-start gap-4 lg:flex-col lg:items-start">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-[var(--border)] bg-white/80 transition-transform group-hover:rotate-3 dark:bg-white/95">
                  <img
                    src={exp.logo}
                    alt={`${exp.organization} logo`}
                    width={64}
                    height={64}
                    className="h-full w-full object-contain p-2"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <div className="lg:mt-2">
                  <p className="eyebrow">{exp.period}</p>
                  <p className="mt-1 text-sm font-semibold text-[var(--fg)]">{exp.role}</p>
                </div>
              </div>

              <div>
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h3 className="font-display text-2xl text-[var(--fg)] sm:text-3xl">
                    {exp.organization}
                  </h3>
                  {exp.link && (
                    <a
                      href={exp.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group/link inline-flex items-center gap-1.5 rounded-full border border-[var(--border)] bg-[var(--bg)] px-4 py-1.5 text-xs font-semibold text-[var(--fg)] transition-colors hover:border-accent-400 hover:text-accent-500"
                    >
                      <FiGithub className="h-3.5 w-3.5" />
                      Repository
                      <FiArrowUpRight className="h-3 w-3 transition-transform group-hover/link:-translate-y-0.5 group-hover/link:translate-x-0.5" />
                    </a>
                  )}
                </div>

                <p className="mt-4 max-w-3xl text-base leading-relaxed text-[var(--fg-muted)] sm:text-lg">
                  {exp.description}
                </p>

                {exp.highlights.length > 0 && (
                  <ul className="mt-5 space-y-2.5">
                    {exp.highlights.map((highlight, hi) => (
                      <motion.li
                        key={highlight}
                        initial={{ opacity: 0, x: -8 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: '-40px' }}
                        transition={{ duration: 0.35, delay: 0.1 + hi * 0.05 }}
                        className="flex gap-3 text-sm leading-relaxed text-[var(--fg-muted)] sm:text-base"
                      >
                        <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklch,var(--accent)_18%,transparent)] text-[var(--accent)]">
                          <FiCheck className="h-2.5 w-2.5" strokeWidth={3} />
                        </span>
                        <span>{highlight}</span>
                      </motion.li>
                    ))}
                  </ul>
                )}

                <ul className="mt-6 flex flex-wrap gap-2">
                  {exp.stack.map((tech) => (
                    <li
                      key={tech}
                      className="rounded-full bg-accent-100 px-3 py-1 text-xs font-medium text-accent-700 transition-transform hover:-translate-y-0.5 dark:bg-accent-500/15 dark:text-accent-200"
                    >
                      {tech}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          </motion.li>
        ))}
      </ol>
    </Section>
  );
}
