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

These are the values Pearl, Freshwater, and South Sea share. **The scale is
per-theme, not global** — each theme owns its own density (see "Composed
values" below for Tahitian's, and `theme.css.ts` on why non-color scales are
authored per theme rather than shared). The *token names* and the "multiples of
`sm`, `xs` for a named reason" rule are what is system-wide.

## Why "soft," not strict

Everything above the `xs` half-step stays a clean multiple of `sm`. The single
half-step exists as an intentional, named escape hatch — not a loophole. Things like
icon-to-text gaps or a badge's internal padding often look cramped at a full `sm` and
genuinely need the half-step. The rule: **everything is a multiple of `sm` unless
there's a specific, named reason to drop to `xs`.**

## Composed values — `calc()` of tokens is on-system

Internal design-system styles sometimes need a value that sits *between* two
steps. Composing it from scale tokens is **on-system and allowed**:

```ts
// Tag.css.ts — a pill's horizontal padding
paddingLeft: `calc(${space.sm} + ${space.xs})`,   // 8 + 4 = 12px
```

The rule: **a composed value is on-system when every operand is a scale token
and the result is justified the same way a bare `xs` would be** — a specific,
named reason, written down at the call site. A `calc()` is not an escape from
the scale; it is the `xs` half-step rule applied to a sum. The Tag example
earns it because a pill's end-caps read boxy at `sm` and bloated at `md`, and
that reasoning sits in the file next to the declaration.

What is *not* on-system is the same number written as a literal:

```ts
paddingLeft: '12px',   // ✗ — off-system, even though it computes identically
```

### Why the literal is worse than the sum, even at identical output

Because the grid is defined in **token steps, not absolute pixels**, and each
theme owns its own scale. Today:

| Theme | `xs` | `sm` | `md` | `lg` | `xl` | `2xl` | Grid |
|---|---|---|---|---|---|---|---|
| Pearl / Freshwater / South Sea | 4 | 8 | 16 | 24 | 32 | 48 | 8px, 4px half-step |
| Tahitian | 8 | 12 | 20 | 28 | 40 | 56 | 4px |

`calc(sm + xs)` is on-grid in **every** theme by construction — 12px in Pearl,
20px in Tahitian, and correct in both. The literal `12px` is on-grid only in
the themes whose scale happens to make 12 land, and silently goes off-grid the
moment a theme retunes its density. That is the whole difference: the sum
rescales with the theme, the literal does not.

It also means the heading's "8px" is shorthand for the majority case, not a
universal claim. **The grid a theme adheres to is its own scale's grid** — the
system-wide rule is "multiples of `sm`, dropping to `xs` for a named reason,"
expressed in tokens. Tahitian is the standing proof that this has to be phrased
relatively: its scale is 4px-based, and it is not in violation.

### Composing across scales

The same rule holds when a value is built from more than one scale. Every
operand must still be a token from some scale; the result inherits its
legitimacy from its inputs, not from the number it happens to produce.

The shipped example is the control-text inset in
[Input.css.ts](../../src/components/Input/Input.css.ts):

```ts
max(space.md, radius.control)
```

It crosses the **space** and **radius** scales, and mixes `rem` with `px`
deliberately: the spacing floor responds to the user's base font-size, the
corner geometry does not. Because it is composed rather than authored, it
resolves correctly per theme with no per-theme value to maintain.

Note the `max()`: **composition is not limited to addition.** A floor is
on-system as long as both branches are token expressions. It is also the part
doing the work here — every current theme resolves to its own `space.md`,
because no control radius yet exceeds it. That is the formula behaving
correctly, not idling: the radius takes over only once a control is round
enough to actually need the room.

The corollary is worth stating, since it is easy to get backwards: **prefer a
floor over an addition.** `calc(radius.control + space.sm)` also scales with the
radius, but it stacks space unconditionally — including on controls whose arc
the base padding already clears — and produces off-grid values at every step.

Card's derived corner radius is the other shipped form, and shows a **unitless
token used as a multiplier** rather than a length:

```ts
calc(radius.control + radius.nesting * <this card's padding>)
```

`radius.nesting` is `'1'` or `'0'`, so a hard-edged theme zeroes the padding
term and the whole expression collapses to its `control` (`0px`). One formula,
no per-theme branching. See [radius-system.md](radius-system.md) for the
shipped derivation and its rejected alternatives.

### When a composed value is the wrong answer entirely

Composition is cheap, which makes it tempting to derive a number just because
you can. `Field`'s label/hint/error insets were derived twice — once from the
control's text padding, once from `radius.control` — and both were wrong. The
label belongs flush at zero, sharing the card's content edge with the heading
and the control's border box. Text inside a box is indented because it is inside
a box; nothing outside the box should copy that number.

The test is not "are the operands tokens?" but "is there a relationship here at
all?" A derived value that tracks the wrong thing is worse than a literal,
because it looks principled.

A second cross-scale form (`calc(radius.controlEffective + radius.nesting *
space.md)`) is **proposed, not shipped** — see [radius-system.md](radius-system.md)
for what shipped instead.

## Enforcement

`gap` / `padding` props on components accept only the scale token names
(`'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl'`) — never raw pixel numbers. This is a
type-level constraint, not a style convention: passing an arbitrary number is a
compile-time error, not just a lint warning.

That covers the *public* API. Internal `.css.ts` values have no such type gate,
so the composed-value rule above is what the planned no-raw-values lint rule
(OPEN_QUESTIONS #7) has to encode: **a `calc()` whose operands are all
`vars.*` references passes; a `calc()` containing any bare length literal
fails.** Written that way the rule needs no allowlist of "blessed" composed
values — legitimacy is checkable from the operands alone.

## Where this cascades into other component APIs

- **Stack / Row / Grid** — `gap` typed against the scale. Grid may need independent
  `columnGap` / `rowGap`, both still scale-token-typed.
- **Card / Alert / Field** — internal padding defaults to a scale token (`md` by
  default) rather than a bespoke value, so nested components inherit consistent rhythm.
- **Icon** — sizes land on the grid (16px, 20px, 24px, 32px) so icons align cleanly with
  text and other components regardless of context.
- **Button** — height is the shared `controlHeight.md` token (ADR-0005's density lever),
  not a value Button picks itself — the same token Input consumes, so the two land at an
  identical height and align cleanly in the same row regardless of theme. Padding is
  still declared on Button (`paddingTop`/`paddingBottom: space.sm`), but with an explicit
  `height` and `box-sizing: border-box` it doesn't change the rendered box; it states the
  real inset so anything reasoning about breathing room doesn't see a cramped control.
- **Progress Bar** — not yet built; small controls are where the `xs` (4px) escape hatch
  will earn its keep once it exists.

## Grouping: gap ratios, not gap values

Where several elements stack, the *ratio* between gaps is what communicates
structure — a uniform gap leaves equally-weighted lines with no visible grouping,
however well-chosen the value is.

A title block is the common case: a `preheading` and its heading are one unit and
sit at `xs`; the body that follows is a separate unit and is held off at `md`.
Four-to-one, and the grouping reads without a rule or a box. Close that to
`xs`/`sm` and the body becomes a third line of the title.

The same applies to a form: a label and its control are one unit (`Field` owns
that gap internally), and a submit action is another — `Form` separates them at
`lg`.

The rule: **an inner gap must be clearly smaller than the gap separating the
group from what surrounds it.** "Clearly" means a scale step apart at minimum,
and the pairs above are two steps apart. Adjacent steps (`sm` inside `md`) read
as a rendering inconsistency rather than a grouping.

## Relationship to typography

Typography shares this same 8px soft grid — line-height, in px, lands on it exactly
the way spacing does. But line-height is *authored* as a unitless multiplier, not a
fixed px value: WCAG SC 1.4.12 (Text Spacing) requires that a user's forced
line-spacing override scale with font-size rather than collide with an author-fixed
px number, which only a unitless ratio allows. Each theme picks the ratio that lands
that theme's font-size on the grid (8px preferred, 4px escape hatch, same rule as
above). See `typography.md` for the accessibility rationale and worked numbers.
