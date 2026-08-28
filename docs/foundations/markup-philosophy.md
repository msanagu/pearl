# Markup Philosophy — Closest to Vanilla HTML5

## Core principle: use the platform first

Aligned with the first rule of ARIA: if a native HTML element or attribute already
provides the semantics/behavior needed, use it instead of reimplementing it with ARIA
and JavaScript. Native elements come with keyboard handling, screen-reader semantics,
and browser-level behavior for free — a custom `<div role="button">` has to reinvent all
of that by hand and will always have edge cases the native element doesn't.

## Applied across the system

- **Button** — renders an actual `<button>`, never a styled `<div>` with a click handler.
- **Text** — the `as` prop swaps real semantic elements (`p`, `span`, `h1`–`h6`), never a
  `<div>` styled to resemble a heading. See `typography.md`.
- **Field** — wraps a real `<label>` with real `htmlFor`, not a styled span pretending to
  be a label.
- **Icon** — inline `<svg>`, not an icon font or background-image — accessible, scalable,
  and stylable via CSS natively.
- **Stack / Row / Grid** — real CSS Flexbox/Grid on plain elements.

## Vocabulary: header, heading, preheading, subheading

These four terms get conflated easily, so they're pinned down here:

- **`header`** — reserved for the actual HTML5 `<header>` element (or a component
  rendering one via `as="header"`, e.g. `Stack`). It names the composed *area*, not
  any single piece of text inside it.
- **heading** — the canon type-scale step (`Text`'s `variant`, e.g. `headingLg`,
  `displayLg`) paired with the correct semantic level via `as` (`h1`–`h6`),
  independently of visual size — see "Applied across the system" above.
- **preheading** — a `Text` `role` (`themes/roles.ts`'s `TypographyRole`), not
  a variant. The short line *above* a heading (Pearl's "A design system for
  identities that refuse sameness" above its hero `h1`). Deliberately not called
  "eyebrow": the name should say what it relates to. Kept distinct from `label`
  even where a theme's treatment happens to match, because it always pairs with a
  heading rather than standing alone next to data/IDs.

  **It is never an `h*` element.** A preheading reads as part of the title
  visually, but giving it a heading level puts a bogus entry in the document
  outline immediately above the real heading it introduces. `as="p"` inside a
  `header`, or `as="span"` when it sits inline.

  **Pass `typeScale` unless every theme you target sizes the role.** A role is a
  *face*, and whether it also carries a size is each theme's choice: Pearl sets
  `text.caption` on `[data-role="preheading"]`, Tahitian now does too, and South
  Sea and Freshwater have no treatment at all. A role with no size opinion
  inherits the ambient scale — which for a preheading means rendering at body
  size directly above the heading it introduces, inverting the hierarchy. Being
  explicit costs nothing where the theme already agrees, and is the difference
  between right and broken where it does not.
- **subheading** — not yet a role; reserved for a short line *below* a heading,
  same pattern as `preheading` when a theme needs one.

A `header` composes these — `<header><Text role="preheading">…</Text><Text as="h1"
variant="displayLg">…</Text></header>` — but the system has no `Header`/composition
component yet, so today that's assembled by hand.

## Where it's genuinely contested: components with no native element

Some components (Alert, Badge) have no native HTML5 equivalent — there's no `<alert>` or
`<badge>` element. For these, a `<div>` with the appropriate ARIA role is not a
compromise of this philosophy — it's simply where native HTML doesn't offer anything to
defer to in the first place. Alert's role varies by variant rather than being one fixed
value — see accessibility-standards.md.

## Where it's a real trade-off: Progress Bar

HTML provides a native `<progress>` element with built-in accessible semantics and zero
required ARIA — but it's difficult to style consistently across browsers (fill
color/track especially). The alternative is a custom `<div role="progressbar">` with
manually managed `aria-valuenow` / `aria-valuemin` / `aria-valuemax` — full styling
control, but accessibility correctness is now hand-maintained rather than free.

**Status: deferred.** This decision needs to be made deliberately when Progress Bar is
implemented, not defaulted into. Revisit at that point.
