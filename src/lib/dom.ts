/** True when the event target is a text input the user is typing into, so
 *  global keyboard shortcuts (⌘K, `/`, konami) don't fire mid-typing. */
export function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName.toLowerCase();
  return tag === 'input' || tag === 'textarea' || target.isContentEditable;
}
