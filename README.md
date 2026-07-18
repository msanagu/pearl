# Design System

A small, intentional, composition-first React component library — built as a
portfolio project to demonstrate enterprise-grade design-system judgment:
composition over configuration, a token/theme contract that makes the whole
system reskinnable, a sanctioned downstream override contract, and
accessibility as a first-class concern.

> **Status: Phase 0 — scaffold.** Toolchain only; no tokens or components yet.
> The binding design decisions live in [`docs/`](./docs). Read those first.

## Stack

- **React 19** + **TypeScript** (strict)
- **Vite 8** (library build)
- **vanilla-extract** for styling (theme-contract-driven, zero-runtime)
- **Storybook 10** (react-vite) with the a11y addon — component docs double as
  the future knowledge corpus, so docs quality is load-bearing

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Vite dev server (rarely used directly — Storybook is the workbench) |
| `npm run storybook` | Storybook dev server on port 6006 |
| `npm run build` | Library build to `dist/` |
| `npm run build-storybook` | Static Storybook build |
| `npm run typecheck` | `tsc --noEmit` type check |

## Documentation

The philosophy and convention docs in [`docs/`](./docs) are the source of
truth for everything built here. Start with `docs/roadmap.md`.
