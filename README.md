# Akshat Pandey — Portfolio

Single-page portfolio site built with React 19, Vite 7, TypeScript 5 and Tailwind CSS 4.

## Stack

- **React 19** + **Vite 7** (SWC fast refresh)
- **TypeScript 5.9** with strict + verbatim module syntax
- **Tailwind CSS 4** (CSS-first `@theme` config) via `@tailwindcss/vite`
- **Motion** (Framer Motion successor) for micro-animations
- **ESLint 9** flat config with `typescript-eslint` + React Hooks + React Refresh
- **pnpm** for package management

## Project layout

```
src/
├── App.tsx                # Composes sections and chrome
├── main.tsx               # Entry, ThemeProvider, createRoot
├── index.css              # Tailwind v4 + design tokens + fonts
├── components/            # Reusable UI: Navbar, Footer, Section, ThemeToggle
├── hooks/                 # ThemeProvider, useTheme, useActiveSection
├── lib/                   # cn helper, content/data
├── sections/              # Hero, About, Experience, Projects, Skills, WhyHire, Contact
└── assets/                # Fonts and section imagery
```

## Scripts

| Command          | Description                              |
| ---------------- | ---------------------------------------- |
| `pnpm dev`       | Start the Vite dev server with HMR       |
| `pnpm build`     | Type-check then build for production     |
| `pnpm preview`   | Preview the production bundle locally    |
| `pnpm lint`      | Run ESLint                                |
| `pnpm typecheck` | Run `tsc -b` without emitting             |

A `Makefile` is included as a convenience wrapper — `make help` lists every target.

## Theming

Theme tokens live in `src/index.css` under the `@theme` block. The dark variant
flips a small set of CSS custom properties on `html.dark`, so every component
picks up the right palette without conditional class names.

`ThemeProvider` persists the choice in `localStorage` and respects
`prefers-color-scheme` until the user makes an explicit selection.
