/*
  The portrait is a photo converted with a dark-ink-on-paper ramp: the denser
  the glyph, the DARKER that part of the photo. `@` is hair and shadow, `+` is
  a highlight.

  That only reproduces on paper, where a dense glyph lays down more ink. Invert
  it onto a dark terminal and the densest cells emit the MOST light, so the
  photo comes out as a negative. Colour can't undo it (coverage caps how bright
  a cell can be) and swapping the glyphs for opposite-density partners fixes the
  tonality but coarsens the likeness — the fine highlight stipple becomes solid
  blocks.

  So the portrait is always rendered as ink on paper, and in dark mode it gets
  its own paper to sit on — the way a terminal image viewer (chafa, kitty icat)
  puts a picture in a shell. One likeness, both themes.
*/

/* the backdrop rectangle the subject sits in — always recedes */
const BACKDROP = new Set([' ', '.', ',', ':', '-', '=', '\n']);

type Run = { bright: boolean; text: string };

function toRuns(art: string): Run[] {
  const out: Run[] = [];
  for (const ch of art) {
    const bright = !BACKDROP.has(ch);
    const last = out[out.length - 1];
    if (last && last.bright === bright) last.text += ch;
    else out.push({ bright, text: ch });
  }
  return out;
}

export function AsciiFace({ art }: { art: string }) {
  return (
    <pre className="face" role="img" aria-label="ASCII-art portrait of Akshat Pandey">
      {toRuns(art).map((r, i) => (
        <span key={i} className={r.bright ? 'fb' : 'fd'}>{r.text}</span>
      ))}
    </pre>
  );
}
