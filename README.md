# Akshat Pandey — Portfolio

A single-page portfolio for a **data platform engineer**, built as an interactive
terminal. A short boot splash gives way to a two-pane shell: a right-hand rail with
a neofetch identity, the menu and a real command line, and a left content pane that
**swaps in place** as you click a menu item or type a command — so the page never
scrolls away from you.

Built with React 19, Vite 8, TypeScript 6 and Tailwind CSS 4.

## Highlights

- **Two-pane, click-first** — designed to be legible to non-technical visitors, with
  the terminal's power tucked into an optional command line.
- **Terminal delighters** for developers/recruiters who poke around: `neofetch`,
  `git log` (career history), `htop` (a live process monitor of a real video-AI
  backend), `ssh <project>` (a live log tail), a mini filesystem (`ls`/`cd`/`cat`),
  and `sudo hire-me`.
- **Deep links** — `site.com/#projects` opens straight to a section.
- **Reduced-motion aware** and keyboard navigable (`↑/↓` history, `Tab` completion,
  `Ctrl+L` clear), with a no-JS `<noscript>` résumé for crawlers.

## Stack

- **React 19** + **Vite 8** (Rolldown) via `@vitejs/plugin-react`
- **TypeScript 6** with strict + verbatim module syntax
- **Tailwind CSS 4** (CSS-first, design tokens in `src/index.css`) via `@tailwindcss/vite`
- **ESLint 10** flat config with `typescript-eslint` + React Hooks + React Refresh
- **Vitest** for the `data.ts` content contract tests
- **Bun** for package management and scripts
- Self-hosted, latin-subset **JetBrains Mono** variable font (preloaded)

## Project layout

```
public/
├── fonts/                    # self-hosted latin-subset JetBrains Mono woff2 (preloaded)
├── Akshat-Pandey-Resume.pdf  # served same-origin for the résumé view/download
├── og.png                    # 1200×630 social-share card
├── robots.txt, sitemap.xml
src/
├── App.tsx                   # renders <Terminal/>
├── main.tsx                  # entry, createRoot
├── index.css                 # Tailwind v4 + design tokens + two-pane layout + @font-face
├── components/
│   ├── Terminal.tsx          # the whole app: rail, pane, dispatcher, delighters
│   ├── AsciiFace.tsx         # two-tone ASCII portrait renderer
│   └── Htop.tsx              # the `htop` overlay
└── lib/
    ├── data.ts               # ALL content: role, experience, projects, skills, contact
    ├── data.test.ts          # content contract tests
    └── face.ts               # the ASCII self-portrait
```

## Scripts

| Command             | Description                             |
| ------------------- | --------------------------------------- |
| `bun install`       | Install dependencies                    |
| `bun run dev`       | Start the Vite dev server with HMR      |
| `bun run build`     | Type-check then build for production    |
| `bun run preview`   | Preview the production bundle locally   |
| `bun run test`      | Run the Vitest content tests            |
| `bun run typecheck` | Run `tsc -b` without emitting           |

A `Makefile` wraps these — `make help` lists every target.

## Editing content

Almost everything lives in **[`src/lib/data.ts`](src/lib/data.ts)** — the role title
(`ROLE`), the tagline, experience, projects, lab repos, skills and contact links.
The career `git log`, the `htop` process list and the `ssh` log tails live near the
top of [`src/components/Terminal.tsx`](src/components/Terminal.tsx).

## Configuration

Set your deployed domain in **one** place — `SITE_URL` in
[`src/lib/data.ts`](src/lib/data.ts) — and mirror it in the absolute URLs inside
[`index.html`](index.html) (`canonical`, `og:url`, `og:image`, JSON-LD),
[`public/robots.txt`](public/robots.txt) and [`public/sitemap.xml`](public/sitemap.xml).

## Theming

The palette is a set of CSS custom properties under `:root` in `src/index.css`
(`--accent`, `--fg`, `--bg`, …). The site is committed to a single dark world, so
every component reads the tokens directly — no conditional class names.
