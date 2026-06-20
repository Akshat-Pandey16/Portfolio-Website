# Akshat Pandey — Portfolio

A single-page "Mission Control" portfolio — an observability-deck UI for a
backend engineer. Built with React 19, Vite 8, TypeScript 6 and Tailwind CSS 4.

## Stack

- **React 19** + **Vite 8** (Rolldown) via `@vitejs/plugin-react`
- **TypeScript 6** with strict + verbatim module syntax
- **Tailwind CSS 4** (CSS-first `@theme` config) via `@tailwindcss/vite`
- **Motion** (Framer Motion successor) for micro-animations
- **ogl** — a GPU fragment-shader "telemetry field" backdrop
- **ESLint 10** flat config with `typescript-eslint` + React Hooks + React Refresh
- **Bun** for package management and scripts
- Self-hosted, latin-subset variable fonts (Space Grotesk · Inter · JetBrains Mono)

## Project layout

```
public/
├── fonts/                 # self-hosted latin-subset woff2 (preloaded)
├── og.png                 # 1200×630 social-share card
├── robots.txt, sitemap.xml
src/
├── App.tsx                # Composes sections and chrome
├── main.tsx               # Entry, ThemeProvider, createRoot
├── index.css              # Tailwind v4 + design tokens + @font-face
├── components/            # Reusable UI: Navbar, Footer, Section, Panel, ...
├── hooks/                 # ThemeProvider, useTheme, useClock, useActiveSection
├── lib/                   # cn, dom, motion, scroll helpers + content/data
├── sections/              # Hero, About, Projects, Experience, Skills, WhyHire, Contact
└── assets/                # Section imagery and org logos
```

## Scripts

| Command           | Description                              |
| ----------------- | ---------------------------------------- |
| `bun install`     | Install dependencies                     |
| `bun run dev`     | Start the Vite dev server with HMR       |
| `bun run build`   | Type-check then build for production     |
| `bun run preview` | Preview the production bundle locally    |
| `bun run lint`    | Run ESLint                               |
| `bun run typecheck` | Run `tsc -b` without emitting           |

A `Makefile` is included as a convenience wrapper — `make help` lists every target.

## Configuration

Set your deployed domain in **one** place — `SITE_URL` in
[`src/lib/data.ts`](src/lib/data.ts) — and mirror it in the absolute URLs inside
[`index.html`](index.html) (`canonical`, `og:url`, `og:image`),
[`public/robots.txt`](public/robots.txt) and
[`public/sitemap.xml`](public/sitemap.xml). The résumé link and content
(experience, projects, skills) all live in `src/lib/data.ts`.

## Theming

Theme tokens live in `src/index.css` under the `@theme` block. The dark variant
flips a small set of CSS custom properties on `html.dark`, so every component
picks up the right palette without conditional class names. `ThemeProvider`
persists the choice in `localStorage` and respects `prefers-color-scheme` until
the user makes an explicit selection.
