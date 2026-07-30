/*
  The portrait is a photo converted with a dark-ink-on-paper ramp: the denser
  the glyph, the DARKER that part of the photo. `@` is hair and shadow, `+` is
  a highlight. On paper that reproduces exactly — a dense glyph simply lays down
  more ink — which is why the light theme renders the art untouched.

  A dark terminal inverts it. Bright ink means a dense glyph emits the MOST
  light, so the darkest parts of the photo come out brightest and the face reads
  as a negative. Colour alone cannot undo that, because ink coverage caps how
  much light a cell can emit.

  So on dark backgrounds the ramp is re-mapped: each glyph is swapped for one
  whose coverage matches how BRIGHT that part of the photo is. The shadows map
  to a space — real black, so the hair separates from the face instead of
  scattering light — and the highlights map to the densest glyph. Colour then
  follows the same axis. Every swap is 1:1 in a monospace grid, so not one
  column of the art moves.
*/

/* photo-dark → photo-bright, re-cut for a dark ground */
const DARK_RAMP: Record<string, string> = {
  '@': ' ', // deepest shadow → nothing at all
  '%': '.',
  '#': '*',
  '*': '%',
  '+': '@', // brightest highlight → densest glyph
};

/* t1 = brightest … t5 = deepest shadow, keyed off the ORIGINAL glyph */
const TONE: Record<string, string> = { '+': 't1', '*': 't2', '#': 't3', '%': 't4', '@': 't5' };

/* the backdrop rectangle the subject sits in — always recedes */
const BACKDROP = new Set([' ', '.', ',', ':', '-', '=', '\n']);

type Run = { cls: string; text: string };

function toRuns(art: string, dark: boolean): Run[] {
  const out: Run[] = [];
  for (const ch of art) {
    const backdrop = BACKDROP.has(ch);
    const glyph = backdrop || !dark ? ch : (DARK_RAMP[ch] ?? ch);
    const cls = backdrop ? 'fd' : dark ? (TONE[ch] ?? 't3') : 'fb';
    const last = out[out.length - 1];
    if (last && last.cls === cls) last.text += glyph;
    else out.push({ cls, text: glyph });
  }
  return out;
}

export function AsciiFace({ art, dark = false }: { art: string; dark?: boolean }) {
  return (
    <pre className="face" role="img" aria-label="ASCII-art portrait of Akshat Pandey">
      {toRuns(art, dark).map((r, i) => (
        <span key={i} className={r.cls}>{r.text}</span>
      ))}
    </pre>
  );
}
