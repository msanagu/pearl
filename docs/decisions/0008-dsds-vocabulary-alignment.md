---
id: ADR-0008
title: Align manifest vocabulary with DSDS; do not depend on it
status: proposed
date: 2026-08-26
deciders: [Mary San Agustin]
tags: [tokens, documentation, ai, architecture, dependencies]
supersedes: null
superseded_by: null
---

# ADR-0008 — Align manifest vocabulary with DSDS; do not depend on it

## Context

This project's stated secondary goal (`PROJECT_BRIEF.md`) is a machine-readable
manifest — generated from the same source that already drives components and
themes — that lets a coding agent generate on-system code without a retrieval
layer standing between it and the truth. That manifest doesn't exist yet.
Before building it, its shape needs a decision, and there's real prior art to
weigh: Sanity's Design System Doc Spec (DSDS, `designsystemdocspec.org`), a
draft JSON schema for exactly this problem, authored by someone independently
running evals on AI-agent design-system compatibility.

ADR-0007's "Convergent external work" section already found that this
project's capabilities/assignments split independently matches DSDS's
`Foundation` entity. That was evidence the shape is sound. This ADR is the
follow-on decision: given that DSDS exists and partially validates this
project's direction, how much of it — if any — does the eventual manifest
actually take on?

The question has the same shape as ADR-0004 (third-party dependency stance),
applied to a specification instead of a package: adopt the part that's
correct and load-bearing, reject the part that costs more than it returns.

## Options considered

### Option A — Full DSDS compliance
Emit a manifest that validates against the DSDS schema and tracks `dsdsVersion`.

- **Pros:** immediate compatibility with any tooling that grows up around the
  spec (Sanity's own eval harness, the MCP tools referenced in their write-up).
- **Cons:** DSDS is `0.15.2` — pre-1.0, unendorsed by any standards body,
  single-maintainer, and young enough to still be finding its shape. Full
  compliance means re-doing manifest work every time the spec's breaking
  changes land, for a system with one component library and one consumer.
  The dependency's maturity doesn't match this project's needs yet.

### Option B — Ignore it entirely
Design the manifest from scratch with no reference to DSDS.

- **Pros:** zero coupling, zero risk of chasing a moving target.
- **Cons:** throws away a free correctness check. DSDS is the closest thing
  that exists to a peer-reviewed answer to "what does a design system's
  machine-readable layer need to contain" — ignoring it means re-deriving
  problems it's already surfaced (e.g., where token values should live vs.
  where the manifest should only reference them).

### Option C — Adopt vocabulary and shape where it already matches; no dependency
Use DSDS's terms and structural decisions as a design reference. Emit JSON
this project's own tooling defines and controls. Never `import` or `npm install`
anything DSDS-shaped; never claim `dsdsVersion` conformance.

- **Pros:** gets the correctness check from Option B's rejection, without
  Option A's version-coupling risk. Nothing here breaks if DSDS's schema
  changes tomorrow, because nothing here depends on it — the manifest is
  authored to be *readable the same way*, not *validated against the same
  file*.
- **Cons:** if DSDS does reach 1.0 with real multi-implementer adoption, this
  project pays a migration cost later that full compliance now would have
  avoided. Accepted — see `Revisit if`.

## Decision

**Option C.** Same filter as ADR-0004 applied one layer up: adopt the part
that's correct and costs nothing to borrow, reject the part that's a
dependency on something not yet stable enough to depend on.

Concretely, adopted into this project's own (independently-defined) manifest
design:

1. **A `kind` discriminator per entity**, with a `metadata` (short, structured
   facts) / `documentBlocks` (long-form content) split. Matches this project's
   own instinct in `JOURNAL.md` — collapse anything derivable from code, keep
   what isn't as prose — but gives that instinct a concrete schema shape
   instead of an ad hoc one.
2. **Tokens as a pointer, not a copy.** DSDS's token entities hold `tokenType`
   and a `source` reference into a DTCG file rather than inlining resolved
   values. This project's `tokens.ts` already works this way in spirit — a
   typed accessor over `theme.css.ts`'s custom properties, never a second copy
   of a color. The manifest's token entries will point at the generated DTCG
   file the same way, for the same reason: one place a value can be wrong.
3. **`agentDocumentBlocks` as a parallel array**, not a fenced region inside
   human-facing content. Agent-only material — corrective notes, common
   mistakes, verification criteria — lives in its own array on the entity,
   never interleaved with prose meant for a human reader. Directly closes the
   open question in `JOURNAL.md`'s "how lean can the prose layer get" thread:
   the answer isn't leaner human docs, it's a second, smaller channel for what
   was never meant for a human in the first place.
4. **`Foundation` as the name for the assignment layer**, per ADR-0007 — not
   a new decision, restated here because the manifest is where that alignment
   actually gets encoded as data.

Explicitly **not** adopted, for now:

- The `relationships` graph (typed edges, acyclic-graph enforcement, derived
  reverse edges). Real value for a system with a hallway of components — for
  the size this system is currently at (Alert, Button, Card, Field, Icon,
  Input, Text, layout primitives), the graph would have close to nothing to
  encode. Revisit once cross-component composition rules are numerous enough
  that "Field composes Input" needing to be machine-checkable actually pays
  for the modeling cost.
- The `extends` cross-system inheritance mechanism. This project extends
  nothing and nothing extends it — solving for a problem that doesn't exist
  here yet.
- The JSON Schema (Draft 2020-12) property-type layer DSDS uses for component
  APIs. TypeScript's own types are already that authority for this project;
  duplicating them as JSON Schema would be exactly the kind of second source
  of truth ADR-0007 and this system's whole token architecture exist to
  prevent. If a consumer needs the API surface in JSON Schema form, that's a
  `tsc`-driven generation step from the real types, not a hand-authored
  parallel schema.

## Consequences

- **Positive:** the manifest, when built, starts from a shape one external
  party has already stress-tested against real agent evals, without this
  project owing that party anything — no dependency to update, no spec
  version to track, no breaking change to absorb on someone else's timeline.
- **Negative / accepted costs:** if DSDS becomes the de facto standard, this
  project's manifest will need a translation step (or a rewrite) to
  interoperate with tooling built against the real spec. Accepted as the
  cost of not committing to something pre-1.0.
- **Neutral:** this decision is about the manifest's *shape*, not its
  existence — the manifest itself is still unbuilt. This ADR constrains what
  it will look like when it is.

## Revisit if

- DSDS reaches a stable 1.0 with adoption beyond its own author's tooling —
  at that point, emitting DSDS-conformant output becomes a migration decision
  weighed against real interoperability benefit, not a bet on an unproven
  spec.
- The manifest is actually built and the borrowed shape (item 1-4 above)
  turns out not to fit this project's real usage — DSDS's correctness as a
  reference doesn't guarantee correctness as a fit.
- Cross-component composition rules grow numerous enough that the
  `relationships` graph's cost is worth paying.

## Related

- ADR-0004 (third-party dependency stance) — the same adopt-the-useful-part
  filter, applied here to a specification instead of a package.
- ADR-0007 (capabilities and assignments) — `Foundation` entity convergence,
  the finding that motivated this ADR.
- `PROJECT_BRIEF.md` — states the manifest/MCP goal this ADR's decision will
  govern once built.
- `docs/JOURNAL.md` — the "how lean can the prose layer get" thread that
  `agentDocumentBlocks` answers.
