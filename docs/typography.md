# Typography

## One `Text` component, not split `Heading`/`Text`

Typography properties (size, weight, line-height, letter-spacing) are a closed, stable
set of concerns — unifying them under one component with a `variant` token is the safe
kind of DRY (see component-philosophy.md's duplication-vs-abstraction test): a heading
and a paragraph aren't structurally different things, they're the same thing (styled
text) at different scale steps.

## Decoupling `variant` from `as`

The critical discipline: **visual variant and semantic element are chosen
independently.** Heading level should be driven by document structure (don't skip
`h1` → `h4`), never by how large something needs to look.

```tsx
<Text variant="headingLg" as="h1">Page Title</Text>
<Text variant="headingSm" as="h2">Section</Text>
<Text variant="bodyMd" as="h2">Quiet Section Label</Text>
{/* structurally an h2, visually restrained — both are valid and intentional */}
```

- `variant` — selects the token bundle (size, line-height, default weight)
- `as` — selects the actual DOM element
- `weight` — optional override on top of the variant's default weight

## Type scale (font-size / line-height pairs)

Line-height is never computed from a unitless ratio — every pair is a fixed, deliberately
chosen value, so nothing produces float pixel values.

| Variant | Font size | Line height |
|---|---|---|
| `bodySm` | 12px | 16px |
| `bodyMd` | 14px | 20px |
| `bodyLg` | 16px | 24px |
| `headingSm` | 20px | 24px |
| `headingMd` | 24px | 32px |
| `headingLg` | 32px | 40px |

## Markup philosophy tie-in

`as` should generally resolve to genuine semantic HTML5 elements (`p`, `span`,
`h1`–`h6`) — see `markup-philosophy.md`. `Text` is the polymorphic mechanism that keeps
visual styling and semantic markup honest and independently controllable.
