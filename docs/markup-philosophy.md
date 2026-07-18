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

## Where it's genuinely contested: components with no native element

Some components (Alert, Badge) have no native HTML5 equivalent — there's no `<alert>` or
`<badge>` element. For these, a `<div>` with the appropriate ARIA role (`role="alert"` /
`role="status"` for Alert) is not a compromise of this philosophy — it's simply where
native HTML doesn't offer anything to defer to in the first place.

## Where it's a real trade-off: Progress Bar

HTML provides a native `<progress>` element with built-in accessible semantics and zero
required ARIA — but it's difficult to style consistently across browsers (fill
color/track especially). The alternative is a custom `<div role="progressbar">` with
manually managed `aria-valuenow` / `aria-valuemin` / `aria-valuemax` — full styling
control, but accessibility correctness is now hand-maintained rather than free.

**Status: deferred.** This decision needs to be made deliberately when Progress Bar is
implemented, not defaulted into. Revisit at that point.
