# Typography

## One `Text` component, not split `Heading`/`Text`

Typography properties (size, weight, line-height, letter-spacing) are a closed, stable
set of concerns — unifying them under one component with a `typeScale` token is the safe
kind of DRY (see component-philosophy.md's duplication-vs-abstraction test): a heading
and a paragraph aren't structurally different things, they're the same thing (styled
text) at different scale steps.

## Decoupling `typeScale` from `as`

The critical discipline: **visual scale and semantic element are chosen
independently.** Heading level should be driven by document structure (don't skip
`h1` → `h4`), never by how large something needs to look.

```tsx
<Text typeScale="headingLg" as="h1">Page Title</Text>
<Text typeScale="headingSm" as="h2">Section</Text>
<Text typeScale="bodyMd" as="h2">Quiet Section Label</Text>
{/* structurally an h2, visually restrained — both are valid and intentional */}
```

- `typeScale` — selects the token bundle (size, line-height, tracking, default weight)
- `as` — selects the actual DOM element
- `weight` — optional override on top of the scale step's default weight

The same discipline extends to `role`: a scale step name (`headingLg`, `bodyMd`)
describes a size band and its *default* face, not a mandate. `role` overrides face
(and, per-theme, case/tracking) independently of scale — pairing a role with a
larger or smaller step than its default doesn't fight the role's meaning, the same
way rendering `headingLg` as an `h2` doesn't fight `as`. Four independent axes,
each named for what it controls — `typeScale`, `role`, `as`, `weight` — combine
any of them:

```tsx
<Text typeScale="headingLg" role="preheading">01</Text>
{/* preheading's mono/tracking treatment, sized at headingLg instead of its
    caption default — not a contradiction, same as typeScale/as above */}
```

A `role` with no `typeScale` passed alongside it inherits ambient size from its
surrounding context rather than being forced to `bodyMd` — see Pearl's
`inlineEmphasis`, which has no declared size for exactly this reason.

## Units — and why, per WCAG

Three units, each chosen for a specific WCAG success criterion, not by convention:

| Property | Unit | Why |
|---|---|---|
| `fontSize` | `rem` | **SC 1.4.4 Resize Text (AA)** — text must scale up to 200% via the browser's own zoom/text-size setting without loss of content. `rem` inherits that; `px` ignores it. |
| `lineHeight` | unitless multiplier | **SC 1.4.12 Text Spacing (AA)** — a user-forced line-spacing override (≥1.5×) must not break the layout. A fixed px value collides with the override; a unitless ratio recalculates against whatever font-size results. |
| `letterSpacing` | `em` | Same SC 1.4.12 — tracking scales proportionally with font-size instead of staying a fixed px gap that reads as too tight (or too loose) once size changes. |

`rem` math assumes a 16px root — set explicitly in `src/globalStyles.css.ts` rather
than left to the browser default, so it can't drift silently (see that file's comment).

Body copy's line-height additionally targets **≥1.5×** — SC 1.4.8 Visual Presentation
(AAA), "at least 1.5 within paragraphs." Not a hard AA requirement, but the default
authored value meets it anyway rather than needing a user override to get there.

## Type scale — worked example (Pearl)

Each theme picks the unitless ratio that lands *that theme's own font-size* on the 8px
soft grid (`spacing-system.md`) — so the ratio differs per theme even where the intent
(1.5× body, 1.25× heading, ~1.05× display) is shared. Pearl:

Code stores `fontSize`/`letterSpacing` in rem/em and `lineHeight` as an unitless
ratio (see above) — the table below rounds display values to whole/near px for
readability. `lineHeight` ratio rounded to 3 decimals.

| Variant | `fontSize` | `lineHeight` | Resolves to | `letterSpacing` | Grid |
|---|---|---|---|---|---|
| `bodySm` | 12px (`0.75rem`) | `1.667` | 20px | 0 | 4px escape |
| `bodyMd` | 14px (`0.875rem`) | `1.714` | 24px | 0 | 8px |
| `bodyLg` | 15px (`0.9375rem`) | `1.6` | 24px | 0 | 8px |
| `headingSm` | 20px (`1.25rem`) | `1.2` | 24px | -0.2px (`-0.01em`) | 8px |
| `headingMd` | 24px (`1.5rem`) | `1.333` | 32px | -0.36px (`-0.015em`) | 8px |
| `headingLg` | 34px (`2.125rem`) | `1.294` | 44px | -0.68px (`-0.02em`) | 4px escape |
| `displaySm` | 56px (`3.5rem`) | `1.071` | 60px | -1.68px (`-0.03em`) | 4px escape |
| `displayLg` | 84px (`5.25rem`) | `1.048` | 88px | -3.36px (`-0.04em`) | 8px |

Other themes' values live in their own `src/themes/*.css.ts` — same method, different
numbers, since each theme's font-sizes are its own.

## Font-weight scale

Four named weights, shared across all scale steps — a step's *default* weight is
fixed per theme; `weight` on `<Text>` overrides it. Values themselves (400/500/600/700)
are consistent across all four themes; only which name a step defaults to differs:

| Name | Value | Pearl defaults | Tahitian / Freshwater / South Sea default |
|---|---|---|---|
| `regular` | 400 | `bodySm`, `bodyMd`, `bodyLg` | `bodySm`, `bodyMd`, `bodyLg` |
| `medium` | 500 | `headingSm`, `headingMd`, `headingLg`, `displaySm`, `displayLg` | — (override only) |
| `semibold` | 600 | — (override only) | `headingSm`, `headingMd`, `headingLg` |
| `bold` | 700 | — (override only) | `displaySm`, `displayLg` |

Pearl is the one outlier, defaulting headings and displays one step lighter
(`medium` throughout) than the other three (`semibold` heading / `bold` display).

## Markup philosophy tie-in

`as` should generally resolve to genuine semantic HTML5 elements (`p`, `span`,
`h1`–`h6`) — see `markup-philosophy.md`. `Text` is the polymorphic mechanism that keeps
visual styling and semantic markup honest and independently controllable.
