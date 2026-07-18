---
id: ADR-0003
title: Downstream overrides via a data-part contract, not class-name imports
status: accepted
date: 2026-07-17
deciders: [Mary San Agustin]
tags: [override, theming, governance, api-design]
supersedes: null
superseded_by: null
---

# ADR-0003 — Downstream overrides via a `data-part` contract, not class-name imports

## Context

The **Consumer** persona (see `audience-model.md`) installs this system as a
versioned dependency and cannot fork or edit its source. They still need a
sanctioned, stable way to customize a component from the outside without waiting
on the maintainer. The mechanism chosen becomes a *public API surface* — so it
must be deliberate, versioned, and decoupled from internal implementation. Full
rationale in `override-patterns.md`.

## Options considered

### Option A — `data-component` / `data-part` attributes + consolidated `selectors`
- **Pros:** stable, versioned contract the DS controls; category-wide targeting
  ("any card header"); decoupled from hashed internal class names; doubles as a
  QA/automation selector; zero per-element setup cost.
- **Cons:** relies on base component styles staying single-selector so consumer
  descendant selectors win on specificity (a constraint on component authors).

### Option B — `className` passthrough on every element
- **Pros:** simple, familiar.
- **Cons:** can't target *categories*; needs a threaded prop at every element;
  only disambiguates single instances.

### Option C — Export the library's internal generated class tokens
- **Cons:** exposes implementation as if it were public API; breaks silently on
  internal restructuring even when the class name is unchanged. Rejected outright.

### Option D — Local CSS custom properties (`createVar`) as a general knob system
- **Cons:** turns every tunable into bespoke API surface; heavy. Reserved only
  for specific, deliberately-designed knobs — not a default targeting strategy.

## Decision

- **Primary:** every component/subcomponent renders stable `data-component` /
  `data-part` attributes; consumers target them from one consolidated
  `selectors` block per feature.
- **Secondary:** `className` passthrough (merged via `clsx`) for genuine
  single-instance overrides only.
- **Banned:** importing internal class tokens (Option C); `createVar` as a
  general override mechanism (Option D).

## Consequences

- **Positive:** the override surface is a small, documented, versioned contract;
  category targeting matches the common case; the same attributes serve QA and
  the future MCP "convergent override detection" (`design-in-code-canonization-loop.md`).
- **Negative / accepted costs:**
  - **Component authors must keep base styles single-selector** so consumer
    descendant selectors outrank them without `@layer`. This guarantee is
    **specific to vanilla-extract's unlayered `style()` output** (see ADR-0001) —
    a different engine with atomic/`@layer` output would force this contract to
    be rewritten around layer order.
  - Consumers **own the maintenance cost** of overrides they write: if the DS
    restructures internal DOM or renames a `data-part`, the override can drift
    with no compile error. The DS owes back-compat only on the documented
    `data-*` contract itself.
- **Neutral:** overrides are meant to be a costed, visible exception —
  composition is the Consumer happy path, not overrides.

## Revisit if

- A component legitimately needs a two-part compound base selector, breaking the
  single-selector specificity guarantee for the whole library.
- The styling engine changes (ADR-0001 superseded) — this contract's specificity
  claims are engine-dependent and would need re-derivation.

## Related

- `override-patterns.md` — the mechanism in full, incl. the single-selector constraint.
- `audience-model.md` — the Consumer persona and who owns override cost.
- `design-in-code-canonization-loop.md` — how convergent overrides feed promotion.
- ADR-0001 — the engine whose output shape this contract depends on.
- ADR-0002 — composition, the happy path this is the escape hatch from.
