import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { FiDownload, FiExternalLink, FiX } from 'react-icons/fi';
import { RESUME_DOWNLOAD_NAME, RESUME_FILE } from '../lib/data';

/**
 * In-app résumé viewer — opens an on-brand deck panel with the PDF embedded,
 * plus first-class Download and Open-in-new-tab actions, instead of bouncing
 * the visitor out to a Drive link. Listens for the global `resume:open` event.
 */
export function ResumeModal() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onOpen = () => setOpen(true);
    window.addEventListener('resume:open', onOpen as EventListener);
    return () => window.removeEventListener('resume:open', onOpen as EventListener);
  }, []);

  useEffect(() => {
    if (!open) return;
    const restore = document.activeElement as HTMLElement | null;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    const id = window.setTimeout(() => closeRef.current?.focus(), 40);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      window.clearTimeout(id);
      restore?.focus?.();
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="resume"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[90] flex items-center justify-center p-3 sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-label="Résumé"
        >
          <button
            type="button"
            aria-label="Close résumé"
            onClick={() => setOpen(false)}
            className="absolute inset-0 -z-10 bg-[color-mix(in_oklch,var(--bg-sunken)_60%,transparent)] backdrop-blur-sm"
          />
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            initial={{ opacity: 0, y: 12, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.985 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="bracketed flex h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl border border-[var(--border-strong)] bg-[var(--bg-elev)] shadow-2xl shadow-black/40 focus:outline-none"
          >
            {/* header / chrome */}
            <div className="flex items-center justify-between gap-3 border-b border-[var(--border)] px-4 py-3">
              <span className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-[var(--fg-subtle)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                akshat.sys / resume
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={RESUME_FILE}
                  download={RESUME_DOWNLOAD_NAME}
                  className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-3.5 py-2 font-mono text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--accent-fg)] transition-transform hover:-translate-y-0.5"
                >
                  <FiDownload className="h-3.5 w-3.5" />
                  Download
                </a>
                <a
                  href={RESUME_FILE}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Open résumé in a new tab"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--fg-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  <FiExternalLink className="h-4 w-4" />
                </a>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--fg-muted)] transition-colors hover:border-[var(--accent)] hover:text-[var(--accent)]"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* embedded PDF (desktop/tablet) */}
            <object
              data={`${RESUME_FILE}#toolbar=0&navpanes=0&view=FitH`}
              type="application/pdf"
              aria-label="Résumé preview"
              className="hidden flex-1 bg-[var(--bg-sunken)] sm:block"
            >
              <ResumeFallback />
            </object>

            {/* mobile: embeds are unreliable on phones — offer clear actions */}
            <div className="flex flex-1 items-center justify-center sm:hidden">
              <ResumeFallback />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ResumeFallback() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="max-w-xs text-sm text-[var(--fg-muted)]">
        Preview isn’t available here — open or download the PDF directly.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <a
          href={RESUME_FILE}
          download={RESUME_DOWNLOAD_NAME}
          className="inline-flex items-center gap-2 rounded-lg bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-[var(--accent-fg)]"
        >
          <FiDownload className="h-4 w-4" />
          Download PDF
        </a>
        <a
          href={RESUME_FILE}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--bg-elev)] px-5 py-3 text-sm font-semibold text-[var(--fg)]"
        >
          <FiExternalLink className="h-4 w-4" />
          Open in new tab
        </a>
      </div>
    </div>
  );
}
