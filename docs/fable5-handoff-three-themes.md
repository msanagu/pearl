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

Pearl is the system's own name — not a theme. Within it I need THREE named
themes, each proving the engine can swing to a genuinely different register
without becoming a different codebase. Each theme is named after a real pearl
type; let that type's real-world character inform (not dictate) its register:

- **Tahitian** — naturally the darkest pearls (black, grey, peacock-green,
  aubergine overtones), rare, exotic. This is the flagship theme — its DARK
  mode is what a first-time visitor sees on page load. A rough, discardable
  sketch already exists (aubergine/orchid accent; Druk for display, Neue
  Montreal for UI text) — a starting point, not a constraint.
- **Freshwater** — the most common, affordable, versatile pearls (white, pink,
  lavender); approachable, everyday, "the one most people actually wear." Rough
  sketch: teal/turquoise accent, Satoshi (display) + Geist (UI text).
- **South Sea** — the largest, most luminous pearls (gold, white), rare and
  prized; the luxury register. Rough sketch: warm gold/amber accent
  (deliberately NOT purple — stay clear of Tahitian's aubergine), a serif
  display pairing (RST Thermal / Aire-style).

All three sketches are placeholders — reinterpret freely, including the fonts
and accent hues. They exist so the mechanism has something real to render
today, not to constrain your direction.

Don't treat these as literal color-matching exercises (e.g. Tahitian ≠ "make
everything grey-black") — they're a starting *mood*, not a palette mandate.

## The exact token schema (two tiers — fill this shape precisely)

**Primitives — give every raw color a real, descriptive NAME, not a role.**
Example from the existing sketch: `aubergine: '#624C5D'`. Not `accentColor`,
not `purple500` — an actual color name, the way a paint swatch or a fashion
palette would name it. I'll wire `accent: primitives.aubergine` on my end. Do
this for every distinct hex you use: neutrals (surfaces/text/borders), the
accent family (base + hover + tint), and the four sentiment hue families
(positive/negative/warn/info — do NOT call these success/danger; they're
reused outside alerts, e.g. metric deltas). Primitives are scoped per THEME
and per MODE — Tahitian Light and Tahitian Dark are two separate named
palettes, not one ramp split in half. Also name the font stacks per role.

**Semantics** (what components actually consume — fill every field below,
every theme, for BOTH light and dark, each value a reference to a named
primitive):

- Surface: `background`, `surface`, `overlay`
- Text: `text`, `textSubtle` (exactly two ranks — `subtle` always means "one
  step down in prominence," everywhere it's used)
- Border: `border`, `borderStrong`, `borderSubtle`
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

## Two independent modes per theme — then the inverse tokens

`light` and `dark` are a GLOBAL axis. For each theme, author both modes as two
FULLY INDEPENDENT, completely filled token sets — never derive one mode's
colors from the other's (not by inverting lightness, not by any formula).
Each mode should look like a real, deliberately-designed mode on its own.

Only AFTER both real modes exist, fill the inverse tokens —
`backgroundInverse`, `surfaceInverse`, `textInverse`, `textInverseSubtle`,
`borderInverse`. These are a different, SECTION-scoped concept: "render this
one element/band as if the other mode were active," without switching the
whole page's mode (Material Design 3's `inverseSurface`/`inverseOnSurface`
pattern — used there for Snackbar, so it reads clearly against either theme).
Each mode's inverse fields should approximate the OTHER mode's real primary
values — e.g. `<theme>Light.backgroundInverse` ≈ `<theme>Dark.background`,
and `<theme>Dark.backgroundInverse` ≈ `<theme>Light.background`. Don't invent
new colors for these — reuse (or closely approximate) values you already
authored for the other mode.

## The three themes to design

Each must be a genuinely different REGISTER, not a recolor. Each needs a full
LIGHT and DARK pair (six token sets total), per the pearl-type character
above:

1. **Tahitian** — the flagship; dark mode is the default first render.
   Exotic, rare register — could lean dark/moody even in its light mode, with
   iridescent (peacock/aubergine) touches at the seams rather than an
   all-over color wash.
2. **Freshwater** — the approachable, everyday register. Softer, warmer,
   more forgiving — this could be the one with AIRY/touch-friendly
   `controlHeight` and rounder radii, if that reads as "everyday-friendly"
   to you.
3. **South Sea** — the luxury register. Confident, spacious, a lustrous
   golden/warm-white accent that isn't afraid to be seen — generous spacing,
   larger radii, maybe the most expressive `displayLg` treatment of the three.

These register hints are suggestions, not requirements — reinterpret freely
if a different read of each pearl type produces a more interesting system.

## What I want back, per theme, per mode (6 total token sets)

- A **primitives table**: every named color you invented → its hex (e.g.
  `aubergine → #624C5D`), plus the named font stacks.
- A **semantics table**: every semantic field above (including the five
  inverse fields) → which PRIMITIVE NAME it references (not a raw hex here —
  the whole point is the semantic table should read like `accent →
  aubergine`, `accentHover → aubergineDeep`). Size tokens (space/radius/
  controlHeight/type) can stay literal px/rem, they don't need primitive names.
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

Pearl's early exploration used a restrained material treatment on hover: a
soft radial-gradient highlight (very low opacity, ~5-8%, using
`accentSubtle`), a slow easing transition, subtle inset-highlight + tight
shadow instead of generic elevation. This is about DEPTH from layered
translucency, not gloss or rainbow iridescence — literally how real pearl
luster works (light penetrating multiple translucent layers), not a
decorative shine. If a theme's register suits it (Tahitian and South Sea seem
like natural fits; Freshwater's everyday register might not), suggest how its
OWN accent/surface tokens would drive an equivalent restrained hover
treatment — but any theme may be better served by NO motion at all if that
reads as more honest to its register. Call this out explicitly per theme
rather than defaulting it in.

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
For each of the 3 themes (Tahitian, Freshwater, South Sea): light primitives
table + light semantics table + specimen render → dark primitives table +
dark semantics table + specimen render → rationale paragraph → luster note
(if applicable). Then one closing note: which semantic group (or specific
field) was hardest to keep meaningful across all three very different
registers — that's a signal for me about where the schema itself might still
be too rigid or too loose.
```

---

## After themes come back (engineering checklist — not part of the prompt)

The scaffold already exists — `src/themes/tahitian.css.ts`,
`freshwater.css.ts`, `south-sea.css.ts`, each a fully self-contained file (no
shared `scales.ts` — removed) exporting `<name>LightThemeClass`/
`<name>DarkThemeClass`. Each already has the two-tier structure: a
module-scoped `*Primitives` object (named hexes) per theme+mode, and the
`createTheme(...)` semantic call references those primitives by name. All
values are currently rough sketches pulled from the visual-language moodboard
(distinct per theme, not yet final). Replace values, keep the structure:

1. In each file, replace the `*Primitives` object's values (and add/remove
   named entries as needed) with Fable 5's real primitives, then update the
   semantic `createTheme(...)` references if any primitive names changed.
   Also replace the inlined `radius`/`space`/`controlHeight`/`fontWeight`/
   `fontFamily`/`text` consts — each theme owns these fully (the
   density/register levers the brief asks Fable 5 to use).
2. Author both real modes' primitives independently first, THEN point each
   mode's five inverse semantic fields at the OTHER mode's primitive object
   directly (`tahitianLightPrimitives.pearl`, not a copied hex) — never the
   reverse. See `theme.css.ts`'s contract comment for the full rule.
3. File/export names and the `themeMatrix` in `.storybook/preview.tsx` don't
   change — the toolbar already points at the real names.
4. Spot-check the "hardest to keep meaningful" field the brief asks Fable 5 to
   flag — likely candidate for a schema revision (log in `OPEN_QUESTIONS.md`
   #13, which tracks this handoff's status).
5. Run the token-editor POC (`src/pages/DocSitePoc.stories.tsx`) against the
   new values as a sanity check before writing new stories.
