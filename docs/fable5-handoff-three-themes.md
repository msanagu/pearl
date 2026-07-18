# Handoff — Claude Design (Fable 5): Three Themes for Pearl

**Status: ready to send.** This is a prompt for a visual-generation session, not
engineering work. Once themes come back, engineering wires them into
`src/themes/*.css.ts` and the Storybook theme×mode toolbar (already built —
see `.storybook/preview.tsx`) with no new mechanism needed.

---

## The prompt (copy from below)

```markdown
# Brief: Three visual themes for Pearl, a token-driven design system

## What Pearl is
Pearl is a small, engineered React design system built to prove one thing: the
SAME components can serve completely different products by swapping token
VALUES alone — never touching component code. Its name comes from a metaphor:
a pearl isn't manufactured, it's an organism's layered, emergent response to
friction — just as a design system is an organization's accumulated response to
recurring problems. Structure is fixed; identity is authored on top of it.

Pearl already has one authored identity ("Pearl" — oyster stone, black shell,
silver, near-white; quiet by default, color only at the seams: focus states,
selection, material emphasis). I need THREE MORE, each proving the engine can
swing to a genuinely different register without becoming a different codebase.

## The exact token schema (two tiers — fill this shape precisely)

**Primitives** (raw, per-theme swappable): a neutral ramp, an accent ramp, four
sentiment hues (positive/negative/warn/info — do NOT call these
success/danger; they're reused outside alerts, e.g. metric deltas), a font
stack per role.

**Semantics** (what components actually consume — fill every field below,
every theme, for BOTH light and dark):

- Surface: `background`, `surface`, `overlay`
- Inverse surface (for in-page contrast bands, e.g. a dark hero on a light
  theme): `backgroundInverse`, `surfaceInverse`
- Text: `text`, `textSubtle` (exactly two ranks — `subtle` always means "one
  step down in prominence," everywhere it's used)
- Text (inverse): `textInverse`, `textInverseSubtle`
- Border: `border`, `borderStrong`, `borderSubtle`, `borderInverse`
- Accent — ONE hue axis only, no separate "brand" color: `accent`,
  `accentHover`, `accentSubtle`, `onAccent`. A quiet/ink-primary identity is
  achieved by setting `accent` itself to a near-neutral, not by adding a
  second color.
- Focus: `focusRing`
- Sentiment — `positive` / `negative` / `warn` / `info`, each shaped
  `{ surface, border, text, icon }` (surface = tinted bg, border = tinted
  edge, text = accessible content color on that surface, icon = saturated
  mark color)
- Radius roles: `control` (buttons/inputs), `surface` (cards/panels), `full`
  (maximal rounding — pill/circle, shape follows aspect ratio)
- Space: `xs, sm, md, lg, xl, 2xl` (t-shirt scale, NOT raw pixel-named)
- Control height (the density lever — how tight or airy every control feels):
  `sm, md, lg, xl`
- Font family roles: `display`, `heading`, `body` (each a full font stack)
- Font weight: `regular, medium, semibold, bold`
- Type scale — fixed size/line-height PAIRS (never a unitless ratio), for:
  `bodySm, bodyMd, bodyLg, headingSm, headingMd, headingLg, displaySm, displayLg`

## The three themes to design

Each must be a genuinely different REGISTER, not a recolor. Each needs a full
LIGHT and DARK pair (six token sets total). Name each theme.

1. **Enterprise SaaS / data-dense** — calm, high legibility, restrained accent,
   TIGHT control heights (small `controlHeight` values), small radii, a
   type scale favoring information density over drama.
2. **Creative agency / expressive** — high-contrast, bold display type (lean
   into `displayLg`), generous spacing, larger radii, a confident accent that
   isn't afraid to be loud. This is the one place `accent` can be vivid.
3. **Consumer / friendly / mobile-leaning** — rounded (radii closer to
   `full`), AIRY/touch-friendly control heights, soft sentiment colors, a warm
   approachable accent.

## What I want back, per theme, per mode (6 total token sets)

- Every semantic token above as a hex value (or px/rem for size tokens),
  organized in a table or JSON-ish block I can paste directly into a
  `createTheme()` call.
- Two WCAG 2.2 AA contrast checks per mode: `text` on `background`, and
  `onAccent` on `accent`. State the actual ratios.
- A one-paragraph rationale: what makes this register distinct, and which
  tokens carry that distinction (e.g. "this theme's identity lives almost
  entirely in `controlHeight` and `radius`, not color").

## Also render a visual specimen (what I actually want to SEE)

Per theme, per mode: the SAME small UI — a primary + secondary button, a card
with header/body, a labeled input with a hint, a status alert (pick one
sentiment), and one dense data row. Identical structure across all six
renders, so the token swap is the only variable.

## On "luster" — Pearl's existing material language (optional, explore if it
## resonates with a given theme; do not force it into all three)

Pearl's own theme uses a restrained material treatment on hover: a soft
radial-gradient highlight (very low opacity, ~5-8%, using `accentSubtle`),
a slow easing transition, subtle inset-highlight + tight shadow instead of
generic elevation. This is about DEPTH from layered translucency, not gloss or
rainbow iridescence. If a theme's register suits it (e.g. the creative-agency
one, maybe not enterprise), suggest how its OWN accent/surface tokens would
drive an equivalent restrained hover treatment — but the enterprise theme in
particular may be better served by NO motion at all. Call this out explicitly
per theme rather than defaulting it in.

## Constraints
- Every value must be a literal, paste-able token (hex / px / rem /
  unquoted font stack) — no design-tool-specific formats.
- Accessibility is non-negotiable: all six token sets must pass WCAG 2.2 AA
  for body text.
- Use the exact semantic field names above — don't invent new ones or rename
  existing ones; if a field doesn't make sense for a theme, use the closest
  fit and note why in the rationale, don't skip it.
- Don't design new components — stick to the specimen list so all six renders
  are directly comparable.

## Output format
For each of the 3 themes: theme name → light token table + specimen render →
dark token table + specimen render → rationale paragraph → luster note (if
applicable). Then one closing note: which of the 8 semantic groups above (or
which specific field) was hardest to keep meaningful across all three very
different registers — that's a signal for me about where the schema itself
might still be too rigid or too loose.
```

---

## After themes come back (engineering checklist — not part of the prompt)

1. One `src/themes/<name>.css.ts` per theme, light+dark pair each — same
   pattern as `pearl.css.ts` (spread `scales` from `themes/scales.ts` only for
   whatever a theme doesn't intentionally override; enterprise/agency/consumer
   will likely each want their OWN `controlHeight`/`radius`/`text` scale, since
   those are exactly the density/register levers the brief asks Fable 5 to use).
2. Register each in the `themeMatrix` in `.storybook/preview.tsx` (already
   generalized to theme×mode — just add matrix entries).
3. Spot-check the "hardest to keep meaningful" field the brief asks Fable 5 to
   flag — likely candidate for a schema revision (log in `OPEN_QUESTIONS.md`).
4. Run the existing token-editor POC (`PearlExperience` story) against the new
   themes as a sanity check before writing new stories.
