import { useMemo, useState } from 'react';
import { FiArrowUpRight, FiGithub } from 'react-icons/fi';
import { AnimatePresence, motion } from 'motion/react';
import type { Project } from '../lib/data';
import { Section } from '../components/Section';
import { PROJECTS, LAB_REPOS, GITHUB_URL } from '../lib/data';
import { cn } from '../lib/cn';
import { useTilt } from '../hooks/useTilt';
import { VIEWPORT } from '../lib/motion';

const ALL = 'All';

const STATUS_STYLES: Record<Project['status'], string> = {
  live: 'text-[var(--accent)] border-[var(--accent)]/40 bg-[var(--accent-soft)]',
  active: 'text-[var(--cyan)] border-[var(--cyan)]/40 bg-[color-mix(in_oklch,var(--cyan)_14%,transparent)]',
  shipped: 'text-[var(--fg-muted)] border-[var(--border-strong)] bg-[var(--bg-sunken)]',
};

function StatusChip({ status }: { status: Project['status'] }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em]',
        STATUS_STYLES[status],
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

function ProjectCard({
  project,
  variant = 'small',
  index,
}: {
  project: Project;
  variant?: 'feature' | 'small';
  index: number;
}) {
  const ref = useTilt<HTMLAnchorElement>({ max: variant === 'feature' ? 4 : 6, scale: 1.012 });

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
      viewport={VIEWPORT}
      transition={{ duration: 0.45, ease: 'easeOut', delay: index * 0.04 }}
      style={{ transformStyle: 'preserve-3d' }}
      className={cn(
        'group panel relative flex h-full flex-col overflow-hidden rounded-2xl transition-[box-shadow,border-color] duration-300',
        'hover:border-[var(--border-strong)] hover:shadow-[0_24px_60px_-30px_rgba(0,0,0,0.55)]',
        variant === 'feature' && 'lg:row-span-2',
      )}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            'radial-gradient(220px circle at var(--mx,50%) var(--my,50%), color-mix(in oklch, var(--accent) 13%, transparent), transparent 70%)',
        }}
      />
      <div className={cn('relative overflow-hidden', variant === 'feature' ? 'aspect-[16/11]' : 'aspect-[16/10]')}>
        <img
          src={project.image}
          alt={`${project.title} preview`}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg)] via-[var(--bg)]/20 to-transparent" />
        <span className="absolute right-3 top-3 inline-flex items-center rounded-full bg-black/45 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-white backdrop-blur">
          {project.year}
        </span>
        <span className="absolute left-3 top-3">
          <StatusChip status={project.status} />
        </span>
      </div>

      <div className={cn('flex flex-1 flex-col gap-4 p-5', variant === 'feature' && 'sm:p-7')}>
        <div className="flex items-start justify-between gap-3">
          <h3
            className={cn(
              'font-display leading-tight text-[var(--fg)] transition-colors group-hover:text-[var(--accent)]',
              variant === 'feature' ? 'text-3xl sm:text-4xl' : 'text-xl',
            )}
          >
            {project.title}
          </h3>
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--fg-muted)] transition-all duration-200 group-hover:rotate-45 group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-fg)]">
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
        <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-1">
          <ul className="flex flex-wrap gap-1.5">
            {project.tags.map((tag) => (
              <li
                key={tag}
                className="rounded-md border border-[var(--border)] bg-[var(--bg-sunken)] px-2 py-0.5 font-mono text-[10px] text-[var(--fg-muted)]"
              >
                {tag}
              </li>
            ))}
          </ul>
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-[var(--fg-muted)]">
            <FiGithub className="h-3.5 w-3.5" />
            source
          </span>
        </div>
      </div>
    </motion.a>
  );
}

function LabCard({ project, index }: { project: Project; index: number }) {
  return (
    <motion.a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${project.title} — open repository`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="group panel spotlight flex h-full flex-col rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[var(--accent)]"
    >
      <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] pb-3 font-mono text-[11px]">
        <span className="inline-flex items-center gap-2 text-[var(--fg-muted)]">
          <span className="text-[var(--accent)]">$</span>
          {project.title}
        </span>
        <StatusChip status={project.status} />
      </div>
      <p className="mt-3 flex-1 text-sm leading-relaxed text-[var(--fg-muted)]">{project.blurb}</p>
      <div className="mt-4 flex items-center justify-between gap-3">
        <ul className="flex flex-wrap gap-1.5">
          {project.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-md border border-[var(--border)] bg-[var(--bg-sunken)] px-2 py-0.5 font-mono text-[10px] text-[var(--fg-muted)]"
            >
              {tag}
            </li>
          ))}
        </ul>
        <FiArrowUpRight className="h-4 w-4 text-[var(--fg-muted)] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]" />
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
  // only promote a feature card when there are enough small cards to backfill
  // its second row on lg — otherwise it leaves an empty hole after filtering
  const useFeature = rest.length >= 2;

  return (
    <Section
      id="projects"
      index="03"
      channel="Services"
      plain="Projects"
      title={
        <>
          Things I&apos;ve shipped <span className="text-[var(--accent)]">into the world.</span>
        </>
      }
      description="A short list of work I'm happy to show. Each one is open source — and each taught me something different."
      container="wide"
      headerAside={
        <a
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] px-5 py-3 font-mono text-sm text-[var(--fg)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
        >
          <FiGithub className="h-4 w-4" />
          all repositories
          <FiArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      }
    >
      <ul className="mb-6 flex flex-wrap gap-2" role="group" aria-label="Filter services by capability">
        {tags.map((tag) => {
          const active = filter === tag;
          return (
            <li key={tag}>
              <button
                type="button"
                aria-pressed={active}
                onClick={() => setFilter(tag)}
                className={cn(
                  'relative rounded-md px-3.5 py-1.5 font-mono text-[12px] transition-colors',
                  active
                    ? 'text-[var(--accent-fg)]'
                    : 'border border-[var(--border)] bg-[var(--bg-elev)] text-[var(--fg-muted)] hover:border-[var(--border-strong)] hover:text-[var(--fg)]',
                )}
              >
                {active && (
                  <motion.span
                    layoutId="project-filter-pill"
                    className="absolute inset-0 -z-10 rounded-md bg-[var(--accent)]"
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
            <ProjectCard
              project={featured}
              variant={useFeature ? 'feature' : 'small'}
              index={0}
            />
            {rest.map((project, i) => (
              <ProjectCard key={project.title} project={project} index={i + 1} />
            ))}
          </motion.div>
        ) : (
          <p className="rounded-2xl border border-dashed border-[var(--border)] p-10 text-center font-mono text-sm text-[var(--fg-muted)]">
            no services tagged <span className="text-[var(--accent)]">{filter}</span>. try another.
          </p>
        )}
      </AnimatePresence>

      {/* lab — backend foundations */}
      <div className="mt-12">
        <p className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-subtle)]">
          // lab · backend foundations
        </p>
        <div className="grid gap-5 sm:grid-cols-2">
          {LAB_REPOS.map((repo, i) => (
            <LabCard key={repo.title} project={repo} index={i} />
          ))}
        </div>
      </div>
    </Section>
  );
}
