/*
  The portrait is a photo converted with a dark-ink-on-paper ramp: the denser
  the glyph, the DARKER that part of the photo. `@` is hair and shadow, `+` is
  a highlight. The art uses exactly five subject glyphs plus a `=`/`-`/`:`
  backdrop.

  On paper that needs no help — a dense glyph simply lays down more ink, so one
  flat dark colour reproduces the photograph exactly as intended.

  A dark terminal inverts it. Bright ink means a dense glyph now emits the MOST
  light, so the darkest parts of the photo come out brightest and the face reads
  as a negative. Colour alone can't undo that: you cannot paint a bright region
  with sparse glyphs, because coverage caps how much light a cell can emit.

  So for dark backgrounds the ramp itself is flipped — each glyph is swapped for
  its opposite-density partner, in place, so a bright part of the photo is drawn
  with a dense glyph. Colour then tracks the same axis (see --tone-1..5 in
  index.css). Every substitution is 1:1 in a monospace grid, so not one column
  of the art moves.
*/

/* the five subject glyphs, sparse → dense */
const RAMP = ['+', '*', '#', '%', '@'];

/* sparse ⇄ dense, for the dark-background render */
const FLIP: Record<string, string> = { '+': '@', '*': '%', '#': '#', '%': '*', '@': '+' };

/* the filler rectangle the subject sits in — always recedes */
const BACKDROP = new Set([' ', '.', ',', ':', '-', '=', '\n']);

type Run = { cls: string; text: string };

function toRuns(art: string, invert: boolean): Run[] {
  const out: Run[] = [];
  for (const ch of art) {
    const g = !invert || BACKDROP.has(ch) ? ch : (FLIP[ch] ?? ch);
    const i = RAMP.indexOf(g);
    // t1 = brightest … t5 = dimmest. After the flip, dense glyphs carry the
    // photo's highlights, so density and brightness point the same way again.
    const cls = BACKDROP.has(g) ? 'fd' : i < 0 ? 't3' : `t${5 - i}`;
    const last = out[out.length - 1];
    if (last && last.cls === cls) last.text += g;
    else out.push({ cls, text: g });
  }
  return out;
}

export function AsciiFace({ art, invert = false }: { art: string; invert?: boolean }) {
  return (
    <pre className="face" role="img" aria-label="ASCII-art portrait of Akshat Pandey">
      {toRuns(art, invert).map((r, i) => (
        <span key={i} className={r.cls}>{r.text}</span>
      ))}
    </pre>
  );
}
