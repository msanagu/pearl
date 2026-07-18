# Visual Language Brief (living draft)

**Status: draft, under active refinement.** This is the prompt to hand to a
visual-generation tool ("Claude Design") to produce a visual language *as token
values* that translate directly into the design system's config. It doubles as
process/corpus content — a record of how the token schema was pressure-tested.

The schema slots below are being QA'd one group at a time (see
[OPEN_QUESTIONS.md](./OPEN_QUESTIONS.md) and the ADRs). Sections marked
**🔧 OPEN** are still being decided — don't treat them as final.

---

## The prompt (copy from below)

```markdown
# Brief: Visual language for a token-driven, industry-agnostic design system

## What you're designing
I have a small React design system built as a *visual-agnostic engine*: the same
components must serve wildly different products purely by swapping token VALUES,
never touching component code. Design the visual language — but as a set of TOKEN
VALUES organized by role, not freeform mockups, so it translates into theme config.

## Token architecture (two tiers — respect this structure)
- **Primitives** (raw, context-free — named by HUE, never by use): color ramps
  (neutral + accent + 4 sentiment hues green/red/amber/blue, ~10 steps each), a
  numeric spacing scale, radius scale, font-size/line-height/weight scales, an
  elevation/shadow scale, motion durations/easings, breakpoints.
- **Semantics** (role-named, reference primitives — all the components see):
  - Surface: background, surface, surfaceRaised, [surfaceSunken 🔧], overlay
  - Text: text, textSecondary, textTertiary, onAccent
  - Border: border, borderStrong, borderSubtle
  - Accent: accent, accentHover, accentActive, accentSubtle, onAccent   [🔧 slot count]
  - Sentiment (keyed by valence, NOT feature — reusable beyond alerts):
    positive / negative / warn / info — each { surface, border, text, solid }
  - Focus: focusRing
  - Space roles: inset.{sm,md,lg}, gap.{sm,md,lg}
  - Radius roles: control, surface, full
  - DENSITY: control.height.{sm,md,lg}  ← treat as a first-class lever
  - Type: bodySm/Md/Lg, headingSm/Md/Lg, displaySm/Lg (size + line-height +
    weight each; display = ultra-large hero/marketing type above headings)
  - Elevation: raised, overlay, sticky
  - Motion: duration.{fast,base,slow}, easing.standard

## The core ask: prove the engine with THREE themes on ONE schema
Instantiate the *exact same semantic slots* three ways so identical components
visibly transform:
1. **Enterprise SaaS** — data-dense, calm, high legibility, restrained accent,
   tight control heights, small radii. Provide LIGHT and DARK.
2. **Creative agency** — expressive, high-contrast, bold display type, generous
   spacing, larger radii, a confident accent. Light is fine.
3. **Consumer mobile** — friendly, rounded, thumb-friendly control heights, soft
   elevation, warm accent. Light is fine.

## For EACH theme, deliver
- Primitive color ramps as hex (neutral, accent, 4 sentiment hues: green/red/amber/blue).
- The full semantic → primitive mapping (every slot assigned a value).
- Spacing scale + density (control heights), radius set, type scale (px/rem),
  elevation/shadow values, motion values.
- Two WCAG 2.2 AA contrast checks: text-on-background and onAccent-on-accent
  (state the ratios).

## Also render a visual specimen (the part I want to SEE)
In each theme, render the SAME small UI so the transformation is obvious: a
primary + secondary Button, a Card with header/body, a form Field (label + input
+ hint), a status Alert, and one dense data-table row. Same structure, three
identities.

## Constraints
- All values must be plain, paste-able tokens (hex, px/rem, unitless numbers).
- Use the ROLE LABELS above as keys; final token names are TBD — keep them
  literal and structural, not clever.
- Accessibility is non-negotiable: every theme must pass WCAG 2.2 AA for text.
- Don't invent new component types — stick to the specimen list.

## Output format
Per theme: a structured spec (tables or JSON-ish I can copy) for the tokens, then
the rendered visual specimen. Then a short note on which semantic slots were
hardest to keep meaningful across all three themes — that tells me where the
schema is too rigid or too loose.
```

---

## Open schema questions (being resolved before the prompt is final)

- **🔧 `surfaceSunken`** — do we need an inset-well surface in v1, or defer?
- **🔧 Accent slot count** — are `accentSubtle` + `accentActive` both pulling
  weight, or is `accent` / `accentHover` enough for v1?
- **🔧 Multiple brand colors (tabled)** — v1 has one `accent` + neutral. The
  two-tier arch supports N brand ramps at the primitive level and additive
  `accentSecondary`/etc. at the semantic level without breaking anything;
  deferred until a real multi-brand-color need appears. Also unresolved for that
  future: whether "action color" and "brand color" should be separate semantics
  (some brands act in blue but brand in purple).

## Resolved (folded into the prompt above)
- Sentiment colors: keyed by valence (`positive` / `negative` / `warn` / `info`),
  NOT by feature (`success`/`danger`) — so the same tokens serve alerts, metric
  up/down deltas, diff add/remove, etc. Each is `{ surface, border, text, solid }`;
  `onSolid` deferred (only needed if solid-filled variants ship in v1). One shared
  red for now (splitting "loss red" from "error red" later is non-breaking).
  See ADR-0005's worked example.
- Text hierarchy: rank-named `text` / `textSecondary` / `textTertiary`
  (was ambiguous `muted`/`subtle`); `textDisabled` dropped (handled via opacity).
- Radius: `control` / `surface` / `full` (was `pill`; `full` = maximal rounding,
  shape falls out of aspect ratio — pill on rectangles, circle on squares).
  `control`/`surface` are role-defaults; `full` is an orthogonal opt-in treatment
  (a pill button is a Button using `radius.full` instead of `radius.control`).
