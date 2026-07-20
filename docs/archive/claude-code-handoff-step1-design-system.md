# Claude Code Handoff — Step 1: Personal Design System Scaffold

## Context

I'm building a personal, open-source-bound design system as a portfolio project. This is step 1 of a larger multi-phase build (later phases will add a GitHub-aware MCP server that ingests this design system's Storybook as its knowledge source for RAG-based retrieval — not needed yet, just context for why some choices below matter).

**Important constraint:** This is an original, from-scratch project. Do not reference, infer, or reproduce any specific architecture, token structure, component API, or naming convention from any employer's design system. Build this from general React/TypeScript/design-systems best practices and my own direction below — not from any existing proprietary system.

## Goals for This System

- A **small, intentional** component library (8-10 components to start) that showcases real range: complex prop APIs, composition/nesting patterns, and accessibility rigor — not a kitchen-sink library.
- Should reflect my own philosophy on React composition (favor composition over configuration where reasonable, minimal prop-drilling, sensible compound component patterns where they fit).
- Documentation-first: every component should have rich Storybook docs (MDX or `argTypes` descriptions) written as if teaching someone *why*, not just *what* — this content will later become the semantic search corpus for the MCP server, so writing quality and reasoning depth in docs matters as much as the code.
- Accessibility is a first-class concern, not an afterthought — proper ARIA usage, keyboard navigation, focus management where relevant.

## Tech Stack (Step 1)

- **React 18+** with **TypeScript** (strict mode on)
- **Vite** for build tooling
- **Storybook** (latest major version) with the React + Vite framework integration
- **CSS**: your recommendation is welcome here — options I'm open to: CSS Modules, vanilla-extract, or a lightweight token-based approach with CSS custom properties. Propose one and explain the tradeoff briefly before committing.
- Package manager: npm (unless you have a strong reason to prefer pnpm/yarn — flag it if so)
- Repo will eventually go public on GitHub, so structure it like a real open-source library from the start (clean README, LICENSE placeholder, sensible folder structure) — but this can be minimal/stubbed in step 1, not polished yet.

## Scope for This Session (Step 1 Only)

1. Scaffold a new project: React + TypeScript + Vite, configured for building a component library (not an app) — i.e., set up so components can eventually be built/exported as a consumable package.
2. Install and configure Storybook against this setup.
3. Set up a basic design token foundation — a small, original token set (color, spacing, typography scale) using CSS custom properties or your recommended approach. Keep this intentionally small (not a full multi-brand theming system yet — that may come later).
4. Build **2 starter components** to validate the whole pipeline end-to-end:
   - One simple, low-complexity component (e.g., a `Button`) — to prove the basic pattern: props, styling, a11y, Storybook story with rich docs.
   - One moderately complex component that demonstrates composition (e.g., a `Card` with sub-components like `Card.Header` / `Card.Body`, or similar compound pattern) — to prove out the composition philosophy.
5. Each component should have:
   - Full TypeScript prop types with JSDoc comments (this doubles as documentation)
   - A Storybook story file with multiple variants/states
   - An MDX docs page (or rich `argTypes` descriptions) explaining not just usage but *when/why* you'd reach for this component vs. alternatives — treat this as the first real content for the future RAG corpus
   - Basic accessibility considerations addressed and noted in the docs
6. Confirm everything runs: `npm run storybook` should launch cleanly and show both components with working docs.

## Explicitly Out of Scope for This Session

- No MCP server work yet
- No GitHub integration/webhooks yet
- No theming/dark-mode/white-label infrastructure yet (may come in a later phase)
- No more than 2 components — resist the urge to scaffold the full 8-10 yet; I want to validate the foundation first

## Deliverable / What I Want Back

- Working scaffold with Storybook running locally
- The 2 components described above, fully documented
- A short summary of the folder structure and key architectural decisions you made (especially the styling approach), so I can review before we continue to the next batch of components

Let's start by proposing the styling approach and overall folder structure before scaffolding, so I can confirm before you generate a lot of files.
