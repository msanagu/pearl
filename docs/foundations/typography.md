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
describes a size band and its _default_ face, not a mandate. `role` overrides face
(and, per-theme, case/tracking) independently of scale — pairing a role with a
larger or smaller step than its default doesn't fight the role's meaning, the same
way rendering `headingLg` as an `h2` doesn't fight `as`. Four independent axes,
each named for what it controls — `typeScale`, `role`, `as`, `weight` — combine
any of them:

```tsx
<Text typeScale="headingLg" role="preheading">
  01
</Text>;
{
  /* preheading's mono/tracking treatment, sized at headingLg instead of its
    caption default — not a contradiction, same as typeScale/as above */
}
```

A `role` with no `typeScale` passed alongside it inherits ambient size from its
surrounding context rather than being forced to `bodyMd` — see Pearl's
`inlineEmphasis`, which has no declared size for exactly this reason.

## Units — and why, per WCAG

Three units, each chosen for a specific WCAG success criterion, not by convention:

| Property        | Unit                | Why                                                                                                                                                                                                                     |
| --------------- | ------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `fontSize`      | `rem`               | **SC 1.4.4 Resize Text (AA)** — text must scale up to 200% via the browser's own zoom/text-size setting without loss of content. `rem` inherits that; `px` ignores it.                                                  |
| `lineHeight`    | unitless multiplier | **SC 1.4.12 Text Spacing (AA)** — a user-forced line-spacing override (≥1.5×) must not break the layout. A fixed px value collides with the override; a unitless ratio recalculates against whatever font-size results. |
| `letterSpacing` | `em`                | Same SC 1.4.12 — tracking scales proportionally with font-size instead of staying a fixed px gap that reads as too tight (or too loose) once size changes.                                                              |

`rem` math assumes a 16px root — set explicitly in `src/globalStyles.css.ts` rather
than left to the browser default, so it can't drift silently (see that file's comment).

Body copy's line-height additionally targets **≥1.5×** — SC 1.4.8 Visual Presentation
(AAA), "at least 1.5 within paragraphs." Not a hard AA requirement, but the default
authored value meets it anyway rather than needing a user override to get there.

## Type scale — a shared 4px-grid ramp

`fontSize` is a strict 4px multiple at every step, in every theme — not just an 8px
soft target with occasional escapes. `caption` is the one deliberate exception: the
nearest true 4px neighbors are 8px (below the system's 11px legibility floor for
functional UI text) and 12px (collides with `bodySm`), so it holds 11px instead.
`lineHeight`'s _resolved_ pixel value is also always a 4px multiple, `caption`
included — only its raw font-size escapes the grid.

Because the size ramp itself is now shared across all four themes, only
`fontWeight`/`letterSpacing` vary per theme (see each theme's `src/themes/*.css.ts`
for those). Code stores `fontSize`/`letterSpacing` in rem/em and `lineHeight` as a
unitless ratio (see above) — this table shows Pearl's values as the reference;
`lineHeight` ratio rounded to 3 decimals.

| Variant     | `fontSize`         | `lineHeight` | Resolves to | `letterSpacing`      | Grid                       |
| ----------- | ------------------ | ------------ | ----------- | -------------------- | -------------------------- |
| `caption`   | 11px (`0.6875rem`) | `1.4545`     | 16px        | 0                    | 4px escape (fontSize only) |
| `bodySm`    | 12px (`0.75rem`)   | `1.667`      | 20px        | 0                    | 4px                        |
| `bodyMd`    | 16px (`1rem`)      | `1.5`        | 24px        | 0                    | 4px                        |
| `bodyLg`    | 24px (`1.5rem`)    | `1.5`        | 36px        | 0                    | 4px                        |
| `headingSm` | 32px (`2rem`)      | `1.25`       | 40px        | -0.32px (`-0.01em`)  | 4px                        |
| `headingMd` | 40px (`2.5rem`)    | `1.2`        | 48px        | -0.6px (`-0.015em`)  | 4px                        |
| `headingLg` | 56px (`3.5rem`)    | `1.143`      | 64px        | -1.12px (`-0.02em`)  | 4px                        |
| `displaySm` | 72px (`4.5rem`)    | `1.056`      | 76px        | -2.16px (`-0.03em`)  | 4px                        |
| `displayLg` | 112px (`7rem`)     | `1.071`      | 120px       | -4.48px (`-0.04em`)  | 4px                        |
| `displayXl` | 152px (`9.5rem`)   | `1.053`      | 160px       | -6.84px (`-0.045em`) | 4px                        |

### `displayXl` — the poster step, and why it exists

`displayXl` is identity type: a wordmark on a title page, and nothing else. It
was **promoted, not designed in advance** — the introduction page set its
wordmark at `displayLg` and measured it at 13% of the content width, with the
brand object rendering 1.75× the height of the brand name. The scale had no
larger step to reach for.

That is the promotion test this system uses for canon generally — canon grows
by promotion, not accretion: a real consumer needed it, the
absence forced a page-local workaround, and a second consumer (`Hero`) was
already queued behind it. The alternative — overriding `fontSize` on the page
— was rejected because it would put a raw type value outside the theme layer,
which is exactly what the reskinning promise forbids (see the root README's
"Forking and reskinning" section).

Adding it was a **breaking contract change**, and deliberately so: all four
themes had to author a real value before the build would pass, and the
compiler also caught two consumers that were easy to forget — `Text.css.ts`'s
recipe and `experiments/theme-generator`. That coordination tax is the
contract working, not a cost to route around.

**Do not reach for it for section headings.** `displayLg` remains the top of
the _reading_ hierarchy; `displayXl` is a register above it that most pages
should never enter.

## Font-weight scale

Four named weights, shared across all scale steps — a step's _default_ weight is
fixed per theme; `weight` on `<Text>` overrides it. Values themselves (400/500/600/700)
are consistent across all four themes; only which name a step defaults to differs:

| Name       | Value | Pearl defaults                                                               | Tahitian / Freshwater / South Sea default                                                 |
| ---------- | ----- | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `regular`  | 400   | `bodySm`, `bodyMd`, `bodyLg`                                                 | `bodySm`, `bodyMd`, `bodyLg`                                                              |
| `medium`   | 500   | `headingSm`, `headingMd`, `headingLg`, `displaySm`, `displayLg`, `displayXl` | — (override only)                                                                         |
| `semibold` | 600   | — (override only)                                                            | `headingSm`, `headingMd`, `headingLg`, and Tahitian's `displaySm`/`displayLg`/`displayXl` |
| `bold`     | 700   | — (override only)                                                            | Freshwater and South Sea's `displaySm`, `displayLg`, `displayXl`                          |

Pearl is the one outlier, defaulting headings and displays one step lighter
(`medium` throughout) than the other three (`semibold` heading / `bold` display).

## Markup philosophy tie-in

`as` should generally resolve to genuine semantic HTML5 elements (`p`, `span`,
`h1`–`h6`) — see `markup-philosophy.md`. `Text` is the polymorphic mechanism that keeps
visual styling and semantic markup honest and independently controllable.
