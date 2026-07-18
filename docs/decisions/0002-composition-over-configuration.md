---
id: ADR-0002
title: Favor composition over configuration in component APIs
status: accepted
date: 2026-07-17
deciders: [Mary San Agustin]
tags: [api-design, composition, philosophy]
supersedes: null
superseded_by: null
---

# ADR-0002 — Favor composition over configuration in component APIs

## Context

Component libraries drift toward **prop-explosion**: a component accumulates
boolean/enum props (`hasIcon`, `iconPosition`, `showHeader`, `variant`,
`withDivider`, …) until its API is a configuration language nobody can hold in
their head, and every new use case adds another prop. The alternative is to let
consumers *compose* structure via `children`/slots. This system takes an
explicit position rather than deciding case-by-case each time (the principle is
stated in `component-philosophy.md`; worked examples in
`composition-patterns-examples.md`).

## Options considered

### Option A — Configuration-first (prop-heavy)
- **Pros:** terse call sites for the exact cases the props anticipate; easy to
  discover via autocomplete.
- **Cons:** API grows unbounded with use cases; props that only toggle *what
  renders* leak layout/structure decisions into the component; hard to cover
  arrangements the author didn't foresee.

### Option B — Composition-first (children/slots)
- **Pros:** the component owns *how it looks*, the consumer owns *what goes in
  it*; open to arrangements never anticipated; smaller, stabler prop surface.
- **Cons:** slightly more verbose call sites; requires discipline about when a
  prop is genuinely styling vs. structure.

## Decision

**Composition-first, governed by an explicit heuristic:** *if a prop is a
boolean/enum whose only job is to toggle what gets rendered (not how something
looks), it is a compositional slot, not a config prop.*

Corollaries that follow from this decision:
- **No `icon` / `iconPosition` prop on Button** — icons compose as `children`
  alongside text; internal flex + a token gap handles layout regardless of
  order (see ADR-forthcoming Button notes / `OPEN_QUESTIONS.md` #12).
- **Render-prop, not `cloneElement`,** where a component must hand data to an
  arbitrary child (e.g. `Field` injecting `id`/`aria-*`) — explicit at the call
  site, no hidden prop injection.
- **Context only for genuine coordination.** Compound components (`Tabs`) may
  share state within their own family via Context; components that are merely
  visually adjacent (`Card.Header`/`Card.Body`) use plain `children` with no
  Context. "Dumb outside its four walls."
- **`variant` stays a config prop** — it toggles *how something looks*, which is
  exactly the case the heuristic keeps as configuration.

## Consequences

- **Positive:** small, stable prop surfaces; components compose into
  arrangements never explicitly designed; the styling/structure boundary is a
  stated rule, not a per-component judgment call.
- **Negative / accepted costs:** marginally more verbose call sites; contributors
  must internalize the heuristic to apply it consistently.
- **Neutral:** pushes some decisions (layout of composed children) to CSS on the
  component root rather than to props.

## Revisit if

- The heuristic produces call sites that are meaningfully worse for a whole
  class of components (evidence, not aesthetics).
- A composed pattern turns out to need coordination that neither plain
  `children` nor a bounded Context can express cleanly.

## Related

- `component-philosophy.md` — the principle and the duplication-vs-abstraction test.
- `composition-patterns-examples.md` — `Card.*` namespacing and `Field` render-prop.
- ADR-0003 (override contract) — the *consumer-side* complement to composition.
- Code: `src/components/Button/` (no icon-position prop).
