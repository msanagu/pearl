---
id: ADR-0001
title: Use vanilla-extract as the styling engine
status: accepted
date: 2026-07-17
deciders: [Mary San Agustin]
tags: [styling, tokens, theming, architecture]
supersedes: null
superseded_by: null
---

# ADR-0001 — Use vanilla-extract as the styling engine

## Context

This design system's central thesis is a **TypeScript-enforced, forkable token
contract**: every component references only theme tokens (never a raw value),
so replacing the theme layer re-skins the entire system with zero component
changes, and a theme that omits a required token *fails to compile* (see
`roadmap.md`, `docs/vanilla-extract-theming-example.md`). A second load-bearing
requirement is the downstream **override contract** — stable `data-component` /
`data-part` attributes that consumers target from a consolidated selectors
block, with predictable specificity (see `override-patterns.md`).

The styling engine has to serve both. It was briefly treated as settled, then
deliberately reopened (tracked as OPEN_QUESTIONS #11) to confirm the choice
against current-momentum alternatives rather than defaulting into it. This ADR
records that comparison and the resolution. The decision was made while only
the token layer and one component (`Button`) existed — i.e. at the cheapest
possible moment to change course.

## Options considered

### Option A — vanilla-extract (+ `@vanilla-extract/recipes`)
- **Pros:**
  - `createThemeContract` + `createTheme` model the completeness guarantee
    *natively*: the contract is one artifact, each theme is a separate artifact
    the compiler checks against it. A theme missing a token is a build error.
    This is the thesis expressed directly in the type system, not approximated.
  - Zero-runtime; no codegen step and no generated directory to manage.
  - The override contract's "predictable specificity without `@layer`"
    guarantee holds because `style()` compiles to a single, unlayered class.
  - `recipe()` closes the variant-ergonomics gap (typed `variant`/`size` props)
    without leaving the ecosystem.
- **Cons:**
  - Token IntelliSense/hover-docs require a hand-maintained wrapper layer
    (`src/tokens.ts`) — a real, ongoing maintenance cost.
  - Quieter ecosystem momentum than Panda/Tailwind in 2026.

### Option B — Panda CSS
- **Pros:**
  - Free token autocomplete via codegen — no hand-maintained wrapper.
  - `cva` recipes are terse and ergonomic for variant-heavy components.
  - Semantic tokens with inline `_dark` conditions; strong current momentum.
- **Cons:**
  - Completeness is weaker: tokens are one config object, with no second
    "theme" artifact the compiler verifies fills the whole contract — the exact
    guarantee this project is built to demonstrate is *not* native.
  - Introduces a codegen step and a generated `styled-system/` directory
    (more build ceremony; muddies "reskin = swap one file" into "edit config +
    regenerate").
  - Atomic, `@layer`-wrapped output would make the override contract's
    specificity claims engine-specific and force a rewrite around layer order.

### Option C — Tailwind v4
- **Pros:** Most mainstream/résumé-legible; CSS-first `@theme` config; fast.
- **Cons:** Utility-class-in-markup fights `markup-philosophy.md` (clean markup)
  and the `data-part` override model (consumers would override with utility
  soup). The token-contract-completeness thesis doesn't map to it at all.
  Actively the *worst* fit for this project's stated philosophy despite being
  the most popular.

### Option D — CSS Modules (the "obvious default")
- **Cons:** No type-safe token contract, no completeness enforcement, no
  first-class theming primitive. Would require hand-building the very guarantee
  the other options provide, defeating the point.

## Decision

**Adopt vanilla-extract, with `@vanilla-extract/recipes` for component
variants.**

The deciding factor: this project's differentiator is the *token contract as an
enforced, forkable artifact*. vanilla-extract models that more literally and
with less machinery than any alternative, and the override contract is
engine-agnostic in mechanism but relies on VE's unlayered-single-class output
for its specificity guarantee. The main VE weakness (variant boilerplate) is
neutralized by `recipe()`; the remaining cost (a maintained token wrapper) is
accepted deliberately in exchange for hover-doc DX and compiler-checked
token documentation — and that wrapper doubles as future retrieval-corpus
content.

## Consequences

- **Positive:**
  - The reskin thesis is demonstrable end-to-end (proven: `dist/index.css`
    is pure CSS custom properties; a light theme resolves under
    `lightThemeClass`).
  - Components stay decoupled from theming — they reference `vars.*` only and
    never branch on brand/mode.
  - The override contract's specificity behavior is stable and layer-free.
- **Negative / accepted costs:**
  - `src/tokens.ts` must be updated whenever the contract changes (structurally
    type-checked, so drift is a compile error, not a silent bug).
  - Betting on a lower-momentum tool; mitigated by VE's stability and the fact
    that the *architecture* (contract → theme → override) would survive an
    engine swap of a single component if ever forced.
- **Neutral:**
  - Adds `@vanilla-extract/recipes` and `clsx` as dependencies.

## Revisit if

- The `tokens.ts` wrapper maintenance grows nonlinearly (many token categories,
  frequent churn) — or vanilla-extract ships first-class typed token docs,
  removing the wrapper's reason to exist.
- vanilla-extract becomes unmaintained relative to a successor that preserves
  the `createThemeContract` completeness guarantee.

## Related

- `roadmap.md` — the theme-only reskinning value proposition.
- `docs/vanilla-extract-theming-example.md`, `docs/vanilla-extract-jsdoc-hover-pattern.md` — the contract + wrapper patterns this ADR commits to.
- `override-patterns.md` — the override contract whose specificity guarantee depends on VE's output shape (see its engine-dependency note).
- `docs/OPEN_QUESTIONS.md` #11 — the open question this ADR resolves.
- Code: `src/theme.css.ts`, `src/themes/light.css.ts`, `src/tokens.ts`, `src/components/Button/Button.css.ts`.
