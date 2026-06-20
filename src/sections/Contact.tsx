import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import {
  FiArrowUpRight,
  FiCheck,
  FiCopy,
  FiDownload,
  FiGithub,
  FiLinkedin,
  FiMail,
} from 'react-icons/fi';
import type { IconType } from 'react-icons';
import { Section } from '../components/Section';
import { CONTACT_LINKS, EMAIL } from '../lib/data';
import { spotlightMove } from '../lib/spotlight';
import { VIEWPORT } from '../lib/motion';

const ICONS: Record<(typeof CONTACT_LINKS)[number]['icon'], IconType> = {
  resume: FiDownload,
  github: FiGithub,
  linkedin: FiLinkedin,
  email: FiMail,
};

export function Contact() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      window.location.href = `mailto:${EMAIL}`;
    }
  };

  return (
    <Section
      id="contact"
      index="06"
      channel="Uplink"
      plain="Contact"
      title={
        <>
          Let&apos;s open <span className="text-[var(--accent)]">a channel.</span>
        </>
      }
      description="The fastest way to reach me is email — I read everything and reply quickly. Curious about a role, a freelance gig, or just want to compare notes on Postgres? The inbox is open."
      container="wide"
    >
      <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <motion.a
          href={`mailto:${EMAIL}`}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          onPointerMove={spotlightMove}
          className="group spotlight panel bracketed relative isolate flex flex-col justify-between overflow-hidden rounded-2xl p-7 transition-colors duration-300 hover:border-[var(--accent)] sm:p-10"
        >
          <span className="sweep-line" aria-hidden />
          <div
            aria-hidden
            className="pointer-events-none absolute -right-10 -top-10 h-56 w-56 rounded-full bg-[var(--accent)]/14 blur-3xl transition-all duration-500 group-hover:-translate-x-6 group-hover:translate-y-6"
          />
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--fg-subtle)]">
              // establish connection
            </p>
            <button
              type="button"
              onClick={handleCopy}
              aria-label="Copy email address"
              className="inline-flex items-center gap-1.5 rounded-md border border-[var(--border)] bg-[var(--bg)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--fg-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
            >
              <AnimatePresence mode="wait" initial={false}>
                {copied ? (
                  <motion.span
                    key="check"
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.7, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="inline-flex items-center gap-1.5"
                  >
                    <FiCheck className="h-3 w-3" /> copied
                  </motion.span>
                ) : (
                  <motion.span
                    key="copy"
                    initial={{ scale: 0.7, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.7, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                    className="inline-flex items-center gap-1.5"
                  >
                    <FiCopy className="h-3 w-3" /> copy
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          </div>
          <p
            className="font-display mt-8 break-words text-balance leading-[0.98] text-[var(--fg)]"
            style={{ fontSize: 'var(--text-display-sm)', fontWeight: 600 }}
          >
            akshat16pandey
            <span className="text-[var(--accent)]">@</span>gmail.com
          </p>
          <div className="mt-10 flex items-center justify-between gap-4">
            <p className="font-mono text-xs text-[var(--fg-muted)]">
              avg. response time · &lt; 24h
            </p>
            <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[var(--border)] text-[var(--fg)] transition-all duration-300 group-hover:rotate-45 group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-fg)]">
              <FiArrowUpRight className="h-5 w-5" />
            </span>
          </div>
        </motion.a>

        <motion.ul
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
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
                viewport={VIEWPORT}
                transition={{ duration: 0.35, ease: 'easeOut', delay: 0.1 + index * 0.05 }}
                className="h-full"
              >
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group panel flex h-full items-center justify-between gap-4 rounded-2xl p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-[var(--accent)]"
                >
                  <span className="flex min-w-0 items-center gap-4">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--bg)] text-[var(--accent)] transition-all duration-300 group-hover:border-[var(--accent)] group-hover:bg-[var(--accent)] group-hover:text-[var(--accent-fg)]">
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--fg-subtle)]">
                        {link.label}
                      </p>
                      <p className="font-display mt-0.5 truncate text-lg text-[var(--fg)]">
                        {link.value}
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
