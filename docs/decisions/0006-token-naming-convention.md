---
id: ADR-0006
title: Token naming — one prominence ladder, application-named where roles span multiple destinations
status: accepted
date: 2026-07-17
deciders: [Mary San Agustin]
tags: [tokens, naming, color, governance]
supersedes: null
superseded_by: null
---

# ADR-0006 — Token naming convention

## Context

Early semantic-token drafts used inconsistent vocabulary for "how prominent is
this": `borderStrong`/`borderSubtle`, `accentSubtle`, but `textSecondary`/
`textTertiary` and `solid` (sentiment). Different words for the same idea in
different groups make the system harder to predict — a consumer can't guess
`color.text.subtle` behaves like `color.border.subtle` if the words don't match.
Separately, Codex's session proposed adding a `brand`/`brandSubtle` color pair
alongside `accent`, reopening whether primary-action color and product-identity
color should be two token axes.

## Decision

**One prominence ladder, reused verbatim across every group that is a single
application varying only in emphasis:** `strong` › (base) › `subtle`. No
synonyms (`muted`, `faint`, `secondary`, `tertiary`) anywhere in the token
vocabulary — `subtle` always means "one step down," full stop.

- Border: `border` / `borderStrong` / `borderSubtle` ✅ (already canonical)
- Accent: `accent` / `accentSubtle` ✅
- Text: `text` / `textSubtle` (collapsed from rank-named `textSecondary`/
  `textTertiary` — same ladder, no synonym)

**Groups whose role spans multiple CSS destinations are application-named
instead** — each field names *where* it applies, not how prominent it is,
because prominence doesn't disambiguate "the border" from "the icon":

- Sentiment: `{ surface, border, text, icon }` (not `{ subtle, strong, ... }`;
  `icon` was chosen over the initially-proposed `solid` because it names the
  destination, matching `surface`/`border`/`text`)

**Corollary — single accent hue, no separate `brand` token (v1):** primary
action color and product-identity color stay one axis, `accent`. A theme
wanting an "ink-primary, color-at-the-seams" identity (Pearl's concept)
expresses it by setting `accent` itself to a near-neutral ink and letting color
surface through `focusRing`/sentiment/selective use — not by adding a second
brand-hue token. This keeps the token surface from doubling for a distinction
(action vs. identity) that a single well-chosen `accent` value can already
express. Multiple *simultaneous* brand hues (not this case) remain the
already-tabled multi-accent question (see `visual-language-brief.md`).

## Consequences

- **Positive:** predictable vocabulary — learning one group's prominence words
  teaches all of them; sentiment stays disambiguated by destination.
- **Negative / accepted costs:** a theme that genuinely wants two independent
  brand hues (identity ≠ action) has to wait for the multi-accent extension
  rather than reach for `brand` today.
- **Neutral:** `textSubtle` re-introduces the word "subtle" for text after an
  earlier rank-named draft (`textSecondary`/`textTertiary`) — a deliberate
  reversal once the cross-group ladder was seen to matter more than avoiding a
  prior ambiguous pairing (`muted`/`subtle`); the ambiguity is resolved by
  `subtle` being the *only* prominence word in the system, not by picking a
  synonym.

## Revisit if

- A real theme needs identity and action to diverge simultaneously (e.g. a
  brand that acts in blue but identifies in purple) — promote to the tabled
  multi-accent extension rather than reviving a single `brand` token.
- A new token group emerges that is neither single-application-emphasis nor
  cleanly application-named — decide its convention explicitly rather than
  defaulting into either pattern.

## Related

- `naming-conventions.md` — casing rules this ADR extends with a vocabulary rule.
- ADR-0005 — the tier architecture; this ADR governs naming *within* the semantic tier.
- `docs/visual-language-brief.md` — the tabled multi-accent/multi-brand-color question.
- Code: `src/theme.css.ts`, `src/tokens.ts`, `src/themes/*.css.ts`.
