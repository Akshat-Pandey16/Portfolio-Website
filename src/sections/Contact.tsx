import { motion } from 'motion/react';
import { FiArrowUpRight, FiDownload, FiGithub, FiLinkedin, FiMail } from 'react-icons/fi';
import type { IconType } from 'react-icons';
import { Section } from '../components/Section';
import { CONTACT_LINKS } from '../lib/data';

const ICONS: Record<(typeof CONTACT_LINKS)[number]['icon'], IconType> = {
  resume: FiDownload,
  github: FiGithub,
  linkedin: FiLinkedin,
  email: FiMail,
};

const VALUES: Record<(typeof CONTACT_LINKS)[number]['icon'], string> = {
  email: 'akshat16pandey@gmail.com',
  github: 'Akshat-Pandey16',
  linkedin: 'akshat16pandey',
  resume: 'Download résumé',
};

export function Contact() {
  return (
    <Section
      id="contact"
      eyebrow="Contact"
      title={
        <>
          Let&apos;s build <em className="italic text-[var(--accent)]">something.</em>
        </>
      }
      description="The best way to reach me is email. I read everything and reply quickly."
      container="wide"
    >
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <motion.a
          href="mailto:akshat16pandey@gmail.com"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="group surface relative isolate flex flex-col justify-between overflow-hidden rounded-3xl p-7 transition-all duration-300 hover:border-[var(--border-strong)] sm:p-10"
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-[var(--accent)]/15 blur-3xl transition-opacity duration-500 group-hover:opacity-80"
          />
          <p className="eyebrow">Drop a line</p>
          <p
            className="font-display mt-6 break-words text-balance leading-[0.95] text-[var(--fg)]"
            style={{ fontSize: 'var(--text-display-sm)' }}
          >
            akshat16pandey
            <span className="text-[var(--accent)]">@</span>gmail.com
          </p>
          <div className="mt-10 flex items-center justify-between gap-4">
            <p className="max-w-md text-sm text-[var(--fg-muted)] sm:text-base">
              Curious about a role, freelance gig or just want to compare notes on
              Postgres? My inbox is open.
            </p>
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-[var(--border)] text-[var(--fg)] transition-all duration-300 group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-fg)]">
              <FiArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </div>
        </motion.a>

        <motion.ul
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: 'easeOut', delay: 0.05 }}
          className="grid gap-3"
        >
          {CONTACT_LINKS.filter((l) => l.icon !== 'email').map((link, index) => {
            const Icon = ICONS[link.icon];
            return (
              <motion.li
                key={link.label}
                initial={{ opacity: 0, x: 12 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 0.35, ease: 'easeOut', delay: 0.1 + index * 0.04 }}
              >
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group surface flex items-center justify-between gap-4 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--border-strong)]"
                >
                  <span className="flex min-w-0 items-center gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--accent)] transition-colors duration-300 group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-fg)]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <p className="eyebrow">{link.label}</p>
                      <p className="font-display mt-0.5 truncate text-lg text-[var(--fg)]">
                        {VALUES[link.icon]}
                      </p>
                    </span>
                  </span>
                  <FiArrowUpRight className="h-5 w-5 text-[var(--fg-muted)] transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]" />
                </a>
              </motion.li>
            );
          })}
        </motion.ul>
      </div>
    </Section>
  );
}
