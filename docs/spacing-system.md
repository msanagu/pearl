# Spacing System — 8px Soft Grid

## The scale

| Token | Value | Typical use |
|---|---|---|
| `xs` | 4px | icon-to-label gaps, tight chip/badge padding |
| `sm` | 8px | related inline elements, compact padding |
| `md` | 16px | default component padding, standard rhythm |
| `lg` | 24px | section spacing, card padding |
| `xl` | 32px | major layout gaps |
| `2xl` | 48px | page-section separation |

## Why "soft," not strict

Everything above 4px stays a clean 8px multiple. The single 4px half-step exists as an
intentional, named escape hatch — not a loophole. Things like icon-to-text gaps or a
badge's internal padding often look cramped at a full 8px and genuinely need the
half-step. The rule: **everything is 8px unless there's a specific, named reason to drop
to 4px.**

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
- **Button** — height lands on 8px multiples (32/40/48 for sm/md/lg) so buttons align
  cleanly against Field inputs and other controls in the same row.
- **Badge / Progress Bar** — small controls are where the `xs` (4px) escape hatch earns
  its keep; full 8px padding on a small pill often looks bloated.

## Relationship to typography

Typography (font-size/line-height pairs) uses the full 4px grid more liberally than
spacing does, since font sizes don't always pair cleanly to 8. Spacing prefers the 8px
major grid; typography leans on the 4px minor grid. See `typography.md` for the paired
scale. Line-height is never computed from a unitless ratio (e.g. `1.5`) — every
line-height is a fixed, chosen value per type step, to avoid float pixel values.
