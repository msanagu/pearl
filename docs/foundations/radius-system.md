# Radius System

One authored corner per theme. Everything else is geometry.

## The contract

| Entry | Kind | What it is |
|---|---|---|
| `radius.control` | length | **The theme's corner.** Buttons, inputs, tags. The only radius a theme authors. |
| `radius.full` | length | Maximal rounding, for square-aspect elements only — where it produces a true circle. |
| `radius.nesting` | `'1'` / `'0'` | **Policy, not a value.** Whether this theme derives surface radii concentrically. |
| `radius.cornerShape` | keyword | How the corner is drawn — `round`, `squircle`, `bevel`… |

Only the first two are design tokens in the ordinary sense. The last two are
**theme policy** that happens to be carried as CSS custom properties, because one
compiled stylesheet serves every theme and the theme is swapped by class — there
is nowhere else a per-theme decision can live and still be readable from a
`calc()`. They are deliberately not shown on the Tokens/Semantic specimen page:
that page exhibits values, and these express a rule.

## There is no `radius.surface`

A padded surface does not author its radius. It derives it:

```
outer = control + gap
```

where `gap` is that surface's **own padding**. A Card at `padding="md"` and a
Card at `padding="xl"` are different shapes, correctly — so a single authored
`surface` token could only ever have been right for one of them. It was removed
once Card started deriving; `Alert` derives from its own `md` padding, and any
future Modal, Popover, or Sheet does the same against theirs.

The helper is [`foundations/concentricRadius.ts`](../../src/foundations/concentricRadius.ts).
The arithmetic belongs to whoever knows the padding — the component — not to the
contract.

## Why concentric

When one rounded box sits inside another with padding between them, the two arcs
stay parallel only if the outer radius exceeds the inner one by exactly that gap.
Any other pairing makes the curves converge or diverge: subtle at small sizes,
obviously wrong at large ones. The inner radius is always `radius.control`,
because that is what every nested Button, Input, and Tag uses.

Resolved on Pearl (`control: 12px`):

| Card padding | Derived radius |
|---|---|
| `md` (16px) | 28px |
| `lg` (24px) | 36px |
| `xl` (32px) | 44px |

## How hard-edged themes opt out

`radius.nesting` is a unitless multiplier applied to the gap term, not a branch:

```
calc(control + nesting * gap)
```

South Sea and Tahitian set `control: 0px` and `nesting: '0'`, so the gap term
zeroes and every surface collapses to `0px`. One expression serves both kinds of
theme with no conditional at any call site. Without it, `calc(0px + 24px)` would
hand a square theme a 24px-rounded card — precisely backwards.

`nesting` is a boolean smuggled in as a multiplier on purpose. The alternative —
each theme authoring every surface radius longhand — puts the rule in four files
instead of one.

## Known limits

- **Control-in-surface only.** Additive derivation is correct for a control
  inside a surface. For a *surface inside a surface* it over-produces, and one
  level deeper the arithmetic goes negative. Nothing nests padded surfaces today;
  the fix if that changes is a subtractive cascade, not a bigger formula.
- **Small surfaces degenerate.** `Card` has no `sm` padding step: the derivation
  makes `radius - padding` a constant, so at an 8px padding the corner is 2.5x
  the gap it sits in and the card reads corner-first.
- **`squircle` makes the offset approximate, and that is fine.** `outer = inner +
  gap` is exact for circular arcs. CSS `squircle` is `superellipse(2)`
  (exponent 4), which reaches further along the 45 degree diagonal by a factor of
  `sqrt(2) / 2^(1/4)` = 1.189 — so a 32px gap opens to about 38px through the
  turn. **Do not compensate for it.** Along the straight runs the gap is set by
  the padding, not the radius; what the derivation buys is that both curves begin
  their turn at the same point, so the gap flows continuously out of the straight
  edge. Shrinking the outer radius to match the diagonal would break that and
  pinch the gap at the tangent points — a visible kink where continuity is most
  legible, traded for a gradual drift mid-curve that is not. The current formula
  puts the unavoidable error in the least visible place, and stays exact for
  `round`, which is why one expression serves both corner shapes.
- **Siblings can disagree.** Two cards at different paddings have different
  radii — each concentric with its own contents, inconsistent with each other.
  Accepted: `padding` is a deliberate choice per call site.

## `radius.full` — perfect circles only

Reserved for elements that are **circles by nature** — dots, radios, avatars,
slider thumbs, status marks. Not "things that happen to be square," and never
rectangles: `full` on a rectangle is a pill, and this system does not use pill
shapes.

Everything that sits *inside* something else is a nested control and takes
`radius.control`, whatever its aspect ratio. `Tag` moved off `full` for that
reason, and so did `XButton` — an icon-only close button lives inside an Alert,
so it is a nested control like any other. At 24x24 a 12px `control` is already
50%, so on Pearl it stays a circle anyway; on a hard-edged theme it now squares
off with the rest of the controls instead of being the one round thing in the
corner.

That leaves `full` with no consumers in the shipped components yet — the system
has no avatars or radios. It is not speculative, though: the CreateTheme tool
already uses it for four genuine circles (a 36px swatch dot, a 22px slider thumb,
an 18px radio, an 8px audit dot), which is exactly the reserved meaning.

Hard-edged themes still set `9999px`. Tahitian briefly set `0px`, back when `Tag`
and `XButton` read the token and a lone pill on a square theme looked like an
escapee. With both moved to `control` that reason is gone, and squaring it off
would make radio buttons look like checkboxes — a worse problem than a round dot
on a brutalist theme.

## Corner shape

`cornerShape` must be uniform across everything with a radius. A squircle button
inside a round-cornered card no longer has arcs parallel to it, which defeats the
concentric rule — so it is a theme token rather than a per-component choice, and
it is applied wherever `radius.control` or a derived radius is.

It is inert at `border-radius: 0` — there is no corner box to reshape — so
hard-edged themes are unaffected whatever they set. That is its one real
difference from `nesting`, which square themes genuinely depend on.

Progressive enhancement: browsers without support ignore the declaration and
paint the plain `border-radius`. `csstype` does not know the property yet, so it
is typed via a local augmentation — see [`src/csstype.d.ts`](../../src/csstype.d.ts).
