---
id: ADR-0005
title: Two-tier token architecture — primitives and semantics
status: accepted
date: 2026-07-17
deciders: [Mary San Agustin]
tags: [tokens, theming, architecture, api-design]
supersedes: null
superseded_by: null
---

# ADR-0005 — Two-tier token architecture: primitives and semantics

## Context

The system's value proposition is a **visual-agnostic engine**: the same
component library should serve a spectrum of products — data-dense enterprise
SaaS, an expressive creative-agency site, a friendly consumer-mobile app —
purely by swapping token *values*, never touching component code (ADR-0001,
`roadmap.md`). For that to hold, the token layer needs a stable *schema* whose
slots stay constant while values change per product.

A single flat tier (the current `background`/`brandPrimary`/… set) conflates two
different jobs: raw palette/scale definition, and role assignment. That
conflation is what makes broad reskinning fragile — you can't restyle "every
border" or shift the whole product warmer/cooler/denser by intent, only by
hunting individual values. Mature systems (Radix, Material, Salesforce Lightning)
resolve this with tiers. This ADR fixes the tiering *principle*; the concrete
semantic names are being developed via the visual-language exploration and are
held with a loose fist.

## Decision

**A minimum of two tiers:**

1. **Primitives (tier 1)** — raw, context-free values named by *what they are*:
   color ramps (`neutral.50…950`, accent/status ramps), a numeric spacing scale,
   radius/size/type/elevation/motion scales, breakpoints. Rarely touched
   directly.
2. **Semantics (tier 2)** — role-named tokens that *reference* primitives, named
   by *what they're for*: `color.border`, `color.surface`, `color.text.muted`,
   `color.accent`, `space.inset.md`, `radius.control`, etc.

**Components consume the semantic tier only.** The reskinnable contract — the
surface the Maintainer/Consumer personas (`audience-model.md`) reason about — is
the semantic layer. Primitives are swappable too, but a typical reskin edits
semantic→primitive mappings and the ramps, not component-facing names.

## Consequences

- **Positive:**
  - Whole-product restyling by *intent*: remap semantics to shift density,
    warmth, or brand without touching components.
  - The "serve any industry by pasting values" claim becomes structurally true,
    not aspirational.
  - Semantic names document design intent and become clean retrieval corpus.
- **Negative / accepted costs:**
  - One more layer of indirection to author and to hold in your head.
  - The `tokens.ts` JSDoc wrapper (ADR-0001) grows to cover both tiers; the VE
    contract expresses semantics whose theme values are primitive var references.
- **Neutral:**
  - The current flat tokens become the *semantic* tier; a primitive tier is
    added beneath. Small migration — only `Button` + the token layer exist.

## Revisit if

- Two tiers prove insufficient (e.g. a genuine need for a component-scoped third
  tier) — or overkill for this project's scale (unlikely given the engine goal).
- A concrete semantic schema, once validated against real visual instantiations,
  wants restructuring — expected; refine via a superseding ADR, don't rewrite.

## Worked example — sentiment semantics over hue primitives

The tier split is what lets one palette serve unrelated intents. Primitives are
named by hue (`green`, `red`, `amber`, `blue`), never by use. The feedback/status
semantics are therefore keyed by **sentiment**, not feature — `positive`,
`negative`, `warn`, `info` (each `{ surface, border, text, solid }`) — so the
same tokens serve an Alert's error state, a metric's downward delta, and a diff's
removed line, with a name that stays honest in every context (`negative`, not
`danger`).

Because the sentiment→hue mapping lives in the theme, it is remappable per theme:
a Chinese/Japanese/Korean finance theme can point `positive → red` and
`negative → green` (the inverted local convention) and every metric and delta in
the product flips correctly with zero component changes. Component APIs stay free
to use their own vocabulary (`<Alert variant="error">`) mapped onto these tokens —
token names describe palette-meaning, component props describe component-meaning.

## Implementation note (post-acceptance)

The primitive tier landed as plain, module-scoped JS objects per theme file —
`const tahitianLightPrimitives = { aubergine: '#624C5D', ... }` — not a second
vanilla-extract contract/`createGlobalTheme`. The semantic `createTheme(vars,
{...})` call then references those primitives by name (`accent:
tahitianLightPrimitives.aubergine`). Primitives are scoped per theme *and* per
mode (Tahitian's light and dark are two separate primitive objects) — a mode's
`*Inverse` semantic fields reference the *other* mode's primitive object
directly (see `theme.css.ts`'s contract comment), so they can't silently drift
out of sync with a copy-pasted value. Non-color scales followed the same
per-theme-not-shared principle: no global `scales.ts` — each theme file also
owns its own `radius`/`space`/`controlHeight`/`fontWeight`/`fontFamily`/`text`.

## Related

- ADR-0001 — vanilla-extract; the semantic tier is its `createThemeContract` +
  `createTheme`, per the implementation note above.
- `roadmap.md` — the theme-only reskinning proposition this makes robust.
- `spacing-system.md`, `typography.md` — existing scales that become primitives
  with semantic roles layered on.
- `docs/fable5-handoff-three-themes.md` — the vehicle developing the concrete
  primitive + semantic values for Tahitian/Freshwater/South Sea.
