import { useMemo, useState } from 'react';
import { FiArrowUpRight, FiGithub } from 'react-icons/fi';
import { AnimatePresence, motion } from 'motion/react';
import type { Project } from '../lib/data';
import { Section } from '../components/Section';
import { PROJECTS } from '../lib/data';
import { cn } from '../lib/cn';
import { useTilt } from '../hooks/useTilt';

const ALL = 'All';

function ProjectCard({
  project,
  variant = 'small',
  index,
}: {
  project: Project;
  variant?: 'feature' | 'small';
  index: number;
}) {
  const ref = useTilt<HTMLAnchorElement>({
    max: variant === 'feature' ? 5 : 7,
    scale: 1.015,
  });

  return (
    <motion.a
      ref={ref}
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${project.title} — open repository`}
      layout
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.45, ease: 'easeOut', delay: index * 0.04 }}
      style={{ transformStyle: 'preserve-3d' }}
      className={cn(
        'group surface relative flex h-full flex-col overflow-hidden rounded-3xl transition-[box-shadow,border-color] duration-300',
        'hover:border-[var(--border-strong)] hover:shadow-xl hover:shadow-black/10',
        variant === 'feature' && 'lg:row-span-2',
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(220px circle at var(--mx, 50%) var(--my, 50%), color-mix(in oklch, var(--accent) 14%, transparent), transparent 70%)',
        }}
      />
      <div
        className={cn(
          'relative overflow-hidden',
          variant === 'feature' ? 'aspect-[16/11]' : 'aspect-[16/10]',
        )}
      >
        <img
          src={project.image}
          alt={`${project.title} preview`}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/15 to-transparent" />
        <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-white backdrop-blur">
          {project.year}
        </span>
        {project.featured && (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent-fg)] shadow-lg shadow-black/20">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent-fg)]/60 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--accent-fg)]" />
            </span>
            Featured
          </span>
        )}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/80 to-transparent p-6 text-xs font-mono uppercase tracking-[0.18em] text-white/90 transition-transform duration-500 group-hover:translate-y-0"
        >
          Open repository →
        </span>
      </div>

      <div
        className={cn(
          'flex flex-1 flex-col gap-4 p-6',
          variant === 'feature' && 'sm:p-8',
        )}
      >
        <div className="flex items-start justify-between gap-3">
          <h3
            className={cn(
              'font-display leading-tight text-[var(--fg)] transition-colors group-hover:text-[var(--accent)]',
              variant === 'feature' ? 'text-3xl sm:text-4xl' : 'text-xl',
            )}
          >
            {project.title}
          </h3>
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-[var(--fg-muted)] transition-all duration-200 group-hover:rotate-45 group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-fg)]">
            <FiArrowUpRight className="h-4 w-4" />
          </span>
        </div>
        <p
          className={cn(
            'text-[var(--fg-muted)]',
            variant === 'feature' ? 'text-base leading-relaxed sm:text-lg' : 'text-sm leading-relaxed',
          )}
        >
          {project.blurb}
        </p>
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-2">
          <ul className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full border border-[var(--border)] bg-[var(--bg-sunken)] px-2.5 py-0.5 text-[11px] font-medium text-[var(--fg-muted)]"
              >
                {tag}
              </li>
            ))}
          </ul>
          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[var(--fg-muted)]">
            <FiGithub className="h-3.5 w-3.5" />
            View source
          </span>
        </div>
      </div>
    </motion.a>
  );
}

export function Projects() {
  const tags = useMemo(() => {
    const set = new Set<string>();
    PROJECTS.forEach((p) => p.tags.forEach((t) => set.add(t)));
    return [ALL, ...Array.from(set).sort()];
  }, []);

  const [filter, setFilter] = useState<string>(ALL);

  const list = useMemo(() => {
    if (filter === ALL) return PROJECTS;
    return PROJECTS.filter((p) => p.tags.includes(filter));
  }, [filter]);

  const featured = list.find((p) => p.featured) ?? list[0];
  const rest = featured ? list.filter((p) => p !== featured) : [];

  return (
    <Section
      id="projects"
      eyebrow="Selected work"
      title={
        <>
          Things I have <em className="italic text-[var(--accent)]">built.</em>
        </>
      }
      description="A short list of work I am happy to show. Each one taught me something different."
      container="wide"
      headerAside={
        <a
          href="https://github.com/Akshat-Pandey16"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--bg-elev)] px-5 py-3 text-sm font-semibold text-[var(--fg)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          <FiGithub className="h-4 w-4" />
          See everything on GitHub
          <FiArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      }
    >
      <ul className="mb-6 flex flex-wrap gap-2" role="tablist" aria-label="Filter projects by tag">
        {tags.map((tag) => {
          const active = filter === tag;
          return (
            <li key={tag}>
              <button
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(tag)}
                className={cn(
                  'relative rounded-full px-4 py-1.5 text-xs font-medium transition-colors',
                  active
                    ? 'text-[var(--accent-fg)]'
                    : 'border border-[var(--border)] bg-[var(--bg-elev)] text-[var(--fg-muted)] hover:border-[var(--border-strong)] hover:text-[var(--fg)]',
                )}
              >
                {active && (
                  <motion.span
                    layoutId="project-filter-pill"
                    className="absolute inset-0 -z-10 rounded-full bg-[var(--accent)]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                {tag}
              </button>
            </li>
          );
        })}
      </ul>

      <AnimatePresence mode="popLayout">
        {featured ? (
          <motion.div
            key={filter}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3"
          >
            <ProjectCard project={featured} variant="feature" index={0} />
            {rest.map((project, i) => (
              <ProjectCard key={project.title} project={project} index={i + 1} />
            ))}
          </motion.div>
        ) : (
          <p className="rounded-2xl border border-dashed border-[var(--border)] p-10 text-center text-sm text-[var(--fg-muted)]">
            Nothing here yet for <span className="font-mono">{filter}</span>. Try another tag.
          </p>
        )}
      </AnimatePresence>
    </Section>
  );
}
