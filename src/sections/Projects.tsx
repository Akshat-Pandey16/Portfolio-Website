import { FiArrowUpRight, FiGithub } from 'react-icons/fi';
import { motion } from 'motion/react';
import type { Project } from '../lib/data';
import { Section } from '../components/Section';
import { PROJECTS } from '../lib/data';
import { cn } from '../lib/cn';

const featured = PROJECTS.find((p) => p.featured) ?? PROJECTS[0];
const rest = PROJECTS.filter((p) => p !== featured);

function ProjectCard({
  project,
  variant = 'small',
  index,
}: {
  project: Project;
  variant?: 'feature' | 'small';
  index: number;
}) {
  return (
    <motion.a
      href={project.link}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${project.title} — open repository`}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.45, ease: 'easeOut', delay: index * 0.04 }}
      className={cn(
        'group surface relative flex h-full flex-col overflow-hidden rounded-3xl transition-all duration-300',
        'hover:-translate-y-1 hover:border-[var(--border-strong)] hover:shadow-xl hover:shadow-black/5',
        variant === 'feature' && 'lg:row-span-2',
      )}
    >
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
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
        <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-white backdrop-blur">
          {project.year}
        </span>
        {project.featured && (
          <span className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-[var(--accent)] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--accent-fg)] shadow-lg shadow-black/20">
            Featured
          </span>
        )}
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
              'font-display leading-tight text-[var(--fg)]',
              variant === 'feature' ? 'text-3xl sm:text-4xl' : 'text-xl',
            )}
          >
            {project.title}
          </h3>
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-[var(--fg-muted)] transition-all duration-200 group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-fg)]">
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
      <div className="grid auto-rows-fr gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <ProjectCard project={featured} variant="feature" index={0} />
        {rest.map((project, i) => (
          <ProjectCard key={project.title} project={project} index={i + 1} />
        ))}
      </div>
    </Section>
  );
}
