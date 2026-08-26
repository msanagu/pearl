# Architecture Decision Records

This directory holds **ADRs** — short, immutable records of significant
engineering decisions and *why* they were made. They are the reasoning layer of
this project: not "what the code does" (the code shows that) but "what was
weighed, what was rejected, and under what conditions the decision still holds."

ADRs are deliberately a first-class artifact here, not an afterthought. They
serve three purposes at once:

1. **Engineering judgment, made legible** — the actual portfolio evidence. A
   reviewer can trace every non-obvious choice to its trade-off.
2. **Retrieval corpus** — these are prime material for the future MCP/RAG layer.
   When someone asks the assistant "why no `iconPosition` prop on Button?", the
   answer should pull the composition ADR + the philosophy doc + the component,
   so it reads like it came from an engineering organization, not just API docs.
3. **Onboarding memory** — a future contributor (or future Mary) recovers the
   context behind a decision instead of re-litigating it.

## Process

- Copy [`adr-template.md`](./adr-template.md), take the next number.
- One decision per file. Keep it short; link out rather than restate.
- ADRs are **append-only records**, but the **decisions are held with a loose
  fist**. `accepted` means "current best judgment given what's known now," not
  "permanent." Superseding an ADR later is expected and healthy, not a failure —
  it's the paper trail working as intended.
- Don't rewrite an accepted ADR to change the decision — write a new one and set
  `superseded_by` / `supersedes` on both. The history is the value.
- Status flows: `proposed → accepted`, later possibly `→ superseded` or
  `→ deprecated`.
- The **`Revisit if`** section is where the loose fist lives — every ADR names
  the concrete conditions that would reopen it.

## Frontmatter schema (shared across the knowledge base)

Every retrievable knowledge-base doc carries YAML frontmatter so the future
embedding pipeline can chunk and filter cleanly:

| Field | Meaning |
|---|---|
| `id` | Stable id, e.g. `ADR-0001` |
| `title` | Short imperative phrase |
| `status` | `proposed` / `accepted` / `superseded` / `deprecated` |
| `date` | ISO date decided |
| `deciders` | Who made the call |
| `tags` | Retrieval facets, e.g. `[styling, tokens]` |
| `supersedes` / `superseded_by` | Cross-links for decision lineage |

## Index

| ADR | Title | Status |
|---|---|---|
| [0001](./0001-styling-engine.md) | Use vanilla-extract as the styling engine | accepted |
| [0002](./0002-composition-over-configuration.md) | Favor composition over configuration in component APIs | accepted |
| [0003](./0003-override-contract.md) | Downstream overrides via a `data-part` contract, not class-name imports | accepted |
| [0004](./0004-third-party-dependency-stance.md) | Adopt only headless dependencies; build-from-scratch by default | accepted |
| [0005](./0005-token-tier-architecture.md) | Two-tier token architecture — primitives and semantics | accepted |
| [0006](./0006-token-naming-convention.md) | Token naming — one prominence ladder, application-named where roles span multiple destinations | accepted |
| [0007](./0007-capabilities-and-assignments.md) | Two system tiers — capabilities and assignments | proposed |
| [0008](./0008-dsds-vocabulary-alignment.md) | Align manifest vocabulary with DSDS; do not depend on it | proposed |

## Where ADRs sit in the wider knowledge base

ADRs are one document *type* in a planned retrieval corpus that spans more than
component docs — the point being an AI that understands the engineering
*philosophy*, not just the component API. Planned types (see `PROJECT_BRIEF.md`
and the portfolio strategy):

- **ADRs** (this dir) — decisions and their trade-offs. ✅ started
- **Philosophy** (`component-philosophy.md`, `audience-model.md`, …) — the
  principles ADRs apply. ✅ exists
- **RFCs** — *proposed* changes not yet decided (e.g. a new variant promoted
  from a convergent override). ⏳ planned
- **Governance** — versioning, deprecation policy, contribution/canonization
  model. ⏳ planned
- **Architecture** — token pipeline, theme model, the MCP/retrieval design.
  ⏳ planned
- **Changelog** — release history. ⏳ planned
- **Storybook / source** — API, examples, a11y notes, component code.
  ✅ started (Button)

The corpus is the source-of-truth markdown/MDX/TS — **not** the built Storybook
site (its bundled output is a poor retrieval source). Storybook is one
*rendering* of a subset of this content, not the corpus itself.
