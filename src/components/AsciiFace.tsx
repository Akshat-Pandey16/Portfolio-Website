/*
  Renders an ASCII portrait two-tone: "dark" glyphs (background / shadow) are
  dimmed so they recede, and "dense" glyphs (the subject) glow in the accent —
  which is what makes the face read on a dark terminal. Newlines are treated as
  dim so a single <pre> preserves the layout without per-line wrappers.
*/
const DIM = new Set([' ', '.', ',', ':', '-', '=', '\n']);

type Run = { bright: boolean; text: string };

function toRuns(art: string): Run[] {
  const out: Run[] = [];
  for (const ch of art) {
    const bright = !DIM.has(ch);
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
