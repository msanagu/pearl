# Spacing System — 8px Soft Grid

## Units: rem, not px

Every value below is authored in `rem`, not `px` — spacing scales with a user's
browser/OS **base font-size** preference, not just page zoom (WCAG SC 1.4.4). Standard
browser zoom (Ctrl/Cmd +) scales `px` and `rem` identically, since it zooms the whole
rendered page; the two units only diverge when someone raises their *base* font size as
a persistent accessibility setting without zooming. `px`-pinned spacing (and control
height) stays fixed while `rem`-based text grows around it, which is how you get
overflowing buttons and cramped padding at larger base sizes. Same reasoning
`typography.md` already documents for line-height.

The px figures below are what each token resolves to at the browser default 16px root —
useful for eyeballing sizes, not the authored unit.

## The scale

| Token | Value | ≈px at 16px root | Typical use |
|---|---|---|---|
| `xs` | 0.25rem | 4px | icon-to-label gaps, tight chip/badge padding |
| `sm` | 0.5rem | 8px | related inline elements, compact padding |
| `md` | 1rem | 16px | default component padding, standard rhythm |
| `lg` | 1.5rem | 24px | section spacing, card padding |
| `xl` | 2rem | 32px | major layout gaps |
| `2xl` | 3rem | 48px | page-section separation |

## Why "soft," not strict

Everything above the `xs` half-step stays a clean multiple of `sm`. The single
half-step exists as an intentional, named escape hatch — not a loophole. Things like
icon-to-text gaps or a badge's internal padding often look cramped at a full `sm` and
genuinely need the half-step. The rule: **everything is a multiple of `sm` unless
there's a specific, named reason to drop to `xs`.**

## Enforcement

`gap` / `padding` props on components accept only the scale token names
(`'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'`) — never raw pixel numbers. This is a
type-level constraint, not a style convention: passing an arbitrary number is a
compile-time error, not just a lint warning.

## Where this cascades into other component APIs

- **Stack / Row / Grid** — `gap` typed against the scale. Grid may need independent
  `columnGap` / `rowGap`, both still scale-token-typed.
- **Card / Alert / Field** — internal padding defaults to a scale token (`md` by
  default) rather than a bespoke value, so nested components inherit consistent rhythm.
- **Icon** — sizes land on the grid (16px, 20px, 24px, 32px) so icons align cleanly with
  text and other components regardless of context.
- **Button** — height lands on the same 8px-equivalent multiples (2/2.5/3rem ≈
  32/40/48px for sm/md/lg) so buttons align cleanly against Field inputs and other
  controls in the same row.
- **Badge / Progress Bar** — small controls are where the `xs` (4px) escape hatch earns
  its keep; full 8px padding on a small pill often looks bloated.

## Relationship to typography

Typography shares this same 8px soft grid — line-height, in px, lands on it exactly
the way spacing does. But line-height is *authored* as a unitless multiplier, not a
fixed px value: WCAG SC 1.4.12 (Text Spacing) requires that a user's forced
line-spacing override scale with font-size rather than collide with an author-fixed
px number, which only a unitless ratio allows. Each theme picks the ratio that lands
that theme's font-size on the grid (8px preferred, 4px escape hatch, same rule as
above). See `typography.md` for the accessibility rationale and worked numbers.
