import type { MouseEvent } from 'react';

/** Open the in-app résumé viewer. */
export function openResume() {
  window.dispatchEvent(new CustomEvent('resume:open'));
}

/**
 * onClick for a résumé <a href={RESUME_FILE}>: a plain left-click opens the
 * in-app viewer; modifier / middle clicks fall through so the PDF still opens
 * natively in a new tab. Keeps a real, crawlable link AND the nicer UX.
 */
export function onResumeClick(e: MouseEvent) {
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
  e.preventDefault();
  openResume();
}
