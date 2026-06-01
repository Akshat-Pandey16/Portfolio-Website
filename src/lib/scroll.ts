function reduced() {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: reduced() ? 'auto' : 'smooth', block: 'start' });
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: reduced() ? 'auto' : 'smooth' });
}

export function scrollToBottom() {
  window.scrollTo({ top: document.body.scrollHeight, behavior: reduced() ? 'auto' : 'smooth' });
}
