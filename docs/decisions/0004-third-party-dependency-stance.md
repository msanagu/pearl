---
id: ADR-0004
title: Adopt only headless third-party dependencies; build-from-scratch by default
status: accepted
date: 2026-07-17
deciders: [Mary San Agustin]
tags: [dependencies, build-vs-adopt, headless, philosophy, governance]
supersedes: null
superseded_by: null
---

# ADR-0004 — Adopt only headless dependencies; build-from-scratch by default

## Context

Later-phase components carry genuinely hard, invisible-until-broken complexity —
focus traps and focus restoration (Dialog), viewport collision math (Tooltip),
virtualization (Data Grid), pointer/keyboard drag physics (drag-and-drop),
listbox ARIA (Combobox). `roadmap.md` already frames these as deliberate
**build-vs-adopt** decisions rather than reflexive dependency installs. This ADR
records the *stance* that governs every such decision, so each one isn't
re-argued from zero. The specific library per component is intentionally **not**
decided here — that's held with a loose fist and evaluated at implementation
time (see `Revisit if`).

This ADR also records a firm styling-adjacent constraint that eliminates whole
categories of libraries up front.

## Options considered

### Option A — Styled component kits (Material UI, Chakra, Ant Design, …)
- **Cons:** they ship opinions about appearance you then have to *fight* —
  wrapping, deep style overrides, `!important` wars, theme-escape hatches — to
  reach a custom identity. That inverts this project's model, where the DS *owns*
  visual truth and consumers reskin via a clean token contract. Rejected.

### Option B — Headless / unstyled primitives (Radix, Zag.js, TanStack Table/Virtual, Floating UI, dnd-kit, …)
- **Pros:** solve exactly the invisible-until-broken piece (behavior, a11y,
  math) while leaving **rendering, markup, styling, and the override contract
  100% ours**. Many expose state via `data-*` attributes, which aligns naturally
  with ADR-0003's override model.
- **Cons:** still a dependency to vet, version, and track for maintenance health.

### Option C — Build everything from scratch
- **Pros:** total control, zero deps.
- **Cons:** re-implementing focus traps / positioning / virtualization by hand is
  where subtle, high-severity a11y and correctness bugs ship unnoticed. Not worth
  it for those specific problems.

## Decision

1. **Build-from-scratch is the default.** Anything without hidden algorithmic or
   invisible-until-broken complexity (Button, Card, Alert, Badge, Field,
   Progress Bar, layout primitives) is built in-house — adopting a dep there is
   over-engineering.
2. **When adopting, adopt _headless only._** Only unstyled behavior/logic/a11y
   primitives are eligible. **Styled component kits that must be wrestled and
   reskinned (Material UI et al.) are disqualified categorically**, regardless of
   popularity.
3. **Reject anything that assumes or requires Tailwind** (or otherwise couples to
   a utility-class styling model). This conflicts with ADR-0001 (vanilla-extract)
   and, more importantly, with a first-class project value: **human-in-the-loop
   code readability**. Utility-class markup is considered a readability
   regression here — a deliberate taste stance, not an oversight.
4. **Rendering, composition, styling, and the override contract stay fully
   custom** no matter what is adopted for logic/behavior.
5. **Human-readable code is an explicit selection criterion** for any dependency,
   weighed alongside correctness, a11y, bundle cost, and maintenance health.

## Consequences

- **Positive:** the system's visual identity, markup semantics
  (`markup-philosophy.md`), and override contract are never hostage to a
  third party; adopted deps are confined to the one thing they're best at.
- **Negative / accepted costs:** more upfront work for behavior-heavy components
  than grabbing a batteries-included kit; a smaller pool of eligible libraries
  (headless-only) to choose from.
- **Neutral:** per-component library selection is deferred — this ADR sets the
  filter, not the picks.

## Revisit if

- A specific headless dependency's maintenance lapses and no equivalent exists.
- A styled library emerges that is genuinely, cleanly themeable through a token
  contract without wrestling (would challenge point 2 — evaluate honestly if so).
- The anti-Tailwind stance ever blocks adopting an otherwise clearly-best
  behavior primitive *and* that primitive's Tailwind coupling is truly
  removable — re-weigh readability vs. capability at that point.

## Related

- `roadmap.md` — the Phase 2+ build-vs-adopt table and headless candidate list
  (TanStack, Radix, Zag.js, Floating UI, dnd-kit) this stance governs.
- ADR-0001 — the styling engine this dependency stance must stay coherent with.
- `component-philosophy.md`, `markup-philosophy.md` — the readability and
  use-the-platform values this reinforces.
