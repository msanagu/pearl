---
id: ADR-0009
title: JSDoc stays minimum-viable; stories are the usage reference, not @example
status: accepted
date: 2026-08-26
deciders: [Mary San Agustin]
tags: [documentation, jsdoc, ai, philosophy]
supersedes: null
superseded_by: null
---

# ADR-0009 — JSDoc stays minimum-viable; stories are the usage reference

## Context

`JOURNAL.md`'s open thread asks how lean the prose layer can get, with a test
already stated there: if a document's content is derivable from the code, the
prose copy isn't documentation, it's a second system to keep from drifting.
Two things this session made that test concrete rather than abstract:

- Every shipped component has a Storybook story demonstrating real usage —
  compiled, typechecked, actually rendered. Several components also carry a
  hand-written `@example` in JSDoc showing the same usage as an inert code
  block inside a comment, checked by nothing.
- The reasoning for keeping an anti-pattern out of JSDoc and pointing at
  `Field`'s `Sizes` story instead (see that commit) turned out to generalize:
  a model reading this codebase sees `.stories.tsx` files exactly as easily as
  a JSDoc block. The "models can't see rendered Storybook" argument is true of
  pixels, not of the story's own source — so `@example` isn't buying model
  legibility either. It was two copies of one fact.

## Options considered

### Option A — Keep `@example` as the primary usage reference
- **Pros:** visible on hover in an editor without navigating to a story file.
- **Cons:** unchecked — can drift the moment a prop changes and nothing
  catches it (the exact failure mode `theme-contract.test.ts` was rewritten
  to stop relying on, applied to prose instead of a runtime assertion). A
  second source of truth for something already demonstrated correctly and
  compiled elsewhere.

### Option B — Drop `@example`; the story is the only usage reference
- **Pros:** one example, and it's the one the compiler holds accountable.
  Nothing to keep in sync by hand.
- **Cons:** one extra navigation for a reader working from the editor alone,
  not Storybook. Accepted — this system already treats Storybook as
  first-class, not supplementary (`README.md`, `PROJECT_BRIEF.md`).

## Decision

**Option B**, plus a general standard: JSDoc states what isn't derivable from
the code or a story — a non-obvious constraint, a rejected alternative, a
pointer to the ADR that decided something — and stops there. Not a place to
restate a prop's own type, and not a place to keep a hand-maintained example
current by hand when a real, compiled one already exists.

Applies retroactively to the seven components that had `@example`: Alert,
Card, Field, Input, Row, Stack, Text — each already has a story demonstrating
the same usage.

## Consequences

- **Positive:** fewer places for a component's real API and its documented
  API to quietly disagree. Shorter files.
- **Negative / accepted costs:** hover-in-editor convenience drops for anyone
  not also running Storybook.
- **Neutral:** doesn't touch the `@param`/type-level JSDoc for the same
  reason `tokens.ts`'s wrapper JSDoc stays — those explain intent a type
  alone can't carry, which is a different job than an example.

## Revisit if

A consumer workflow emerges where Storybook genuinely isn't reachable (e.g. a
published package consumed with no access to its Storybook build) and
in-editor `@example` turns out to matter more than the drift risk costs.

## Related

- `docs/JOURNAL.md` — the thread this graduates, per its own stated process.
- ADR-0007, ADR-0008 — the same "don't duplicate what's already real
  elsewhere" instinct, applied there to treatment values and manifest shape.
