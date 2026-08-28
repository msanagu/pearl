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
stated in `../foundations/component-philosophy.md`; worked examples live in the Card and
Field stories).

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

**Composition-first, governed by a coupling test:** *default to compound
sub-components or plain `children` — the root should not need to know a part
exists. A prop is legitimate only when the root must make a layout or
behavioral decision that depends on that content's presence, or on its
relationship to another part.*

A bare boolean/enum that only gates *what renders*, with no such coupling, is
always a compositional slot, not a config prop — that's the common case the
test collapses to, and the one most prop-explosion actually looks like in
practice. But it's a corollary of the coupling test, not the test itself: the
boolean/enum framing alone gives no answer for a prop like `heading?:
ReactNode` (Alert) — not a boolean, not an enum — which is exactly the gap
that made the original wording of this decision confusing on inspection
(2026-08-27). The coupling test covers that case cleanly; the narrower framing
didn't.

### The coupling test, worked

Every deviation from plain `children` in this system's own components has a
documented coupling behind it — none are unexplained, and the pattern holds
with zero exceptions across every component built so far:

- **Alert's `heading?: ReactNode` stays a prop, not `Alert.Heading`.**
  `Alert.css.ts`'s `iconSlot` shifts `marginTop` depending on whether a
  heading exists (`:has([data-part="heading"])`) — the icon's vertical
  position is a decision only Alert's root can make, because it depends on
  content Alert doesn't own. A compound `Alert.Heading` would either lose that
  decision or require scanning `children` for a typed part, which this ADR
  already rejects as a technique (render-prop, not `cloneElement`, below).
- **Card's `href` stays a discriminated-union prop, not a variant.** Its
  presence toggles `data-interactive`, which is what lets a theme's hover
  treatment (Pearl's luster glow) apply at all — "a card with no `href` is not
  interactive and never lusters, on any theme." That's a structural identity
  decision (is this a link) with a real behavioral consequence, not a style
  toggle.
- **Card's `Header`/`Body` stay compound, plain `children`, no Context.**
  Nothing about Card's root needs to know either exists — no shared state, no
  cross-part layout decision. The code says so directly: "static-property
  namespacing, NOT a Context compound component — there is no shared state,
  so none is used."
- **Field's `required` mark is `aria-hidden`,** because the *control's own*
  `required`/`aria-required` already announces it — rendering the mark
  without suppressing it would announce the same fact twice. `size` cascades
  to a nested `Input` via CSS custom properties. Both are real cross-part
  coordination Field's root has to broker, which is why `required`/`size` are
  props and not left to the consumer to wire up between Field and Input by
  hand.

Contrast: Button's icon has no such coupling — `children` lays out via
internal flex + a token gap regardless of order — so it stays pure
composition, no `icon`/`iconPosition` prop at all.

### Corollaries

- **No `icon` / `iconPosition` prop on Button** — icons compose as `children`
  alongside text; internal flex + a token gap handles layout regardless of
  order (see ADR-forthcoming Button notes / `open-questions.md` #12).
- **Render-prop, not `cloneElement`,** where a component must hand data to an
  arbitrary child (e.g. `Field` injecting `id`/`aria-*`) — explicit at the call
  site, no hidden prop injection.
- **Context only for genuine coordination.** Compound components (`Tabs`) may
  share state within their own family via Context; components that are merely
  visually adjacent (`Card.Header`/`Card.Body`) use plain `children` with no
  Context. "Dumb outside its four walls."
- **`variant` stays a config prop** — it toggles *how something looks*, which is
  exactly the case the coupling test keeps as configuration (the root always
  needs to know its own variant to render at all).
- **A future `Modal` follows Card's precedent, not a `footer`/`header` prop
  API** — `Modal.Header`/`Modal.Body`/`Modal.Footer`, compound, no Context.
  There's no cross-part layout decision between a modal's header, body, and
  footer the way there is between Alert's icon and heading; a `footer:
  ReactNode` prop would recreate the exact coupling this ADR argues against,
  just wearing a ReactNode instead of a boolean.

## Tradeoffs

- **Positive:** small, stable prop surfaces; components compose into
  arrangements never explicitly designed; the styling/structure boundary is a
  stated rule, not a per-component judgment call.
  - **DRY angle:** structural containers (`Card.Header`, `Card.Body`) are
    written once; a config-first API would instead repeat prop-parsing,
    conditional renders, and slot toggles per layout variant across every
    component that needed one.
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

- `../foundations/component-philosophy.md` — the principle and the duplication-vs-abstraction test.
- `Card.stories.tsx`, `Field.stories.tsx` — `Card.*` namespacing and `Field` render-prop, demonstrated live.
- ADR-0003 (override contract) — the *consumer-side* complement to composition.
- Code: `src/components/Button/` (no icon-position prop).
