import { createThemeContract } from '@vanilla-extract/css';
// Side-effect import — sets the 16px root the rem-based type scale assumes.
// theme.css.ts is imported everywhere `vars` is used, so the root rule ships
// wherever the contract does.
import './globalStyles.css';

/**
 * The theme contract — the single source of truth for *which* semantic tokens
 * exist. Leaves are `null`: this defines only the shape. Every concrete theme
 * (`src/themes/*.css.ts`) must fulfil this exact shape via `createTheme`, and
 * TypeScript fails to compile if a theme omits or misnames a token.
 *
 * Components consume this semantic layer only — role-named tokens, never raw
 * values. Each theme has its own primitive tier (module-scoped `*` objects of
 * named hexes) that the `createTheme` call maps onto these roles. Primitives
 * and non-colour scales are per-theme, not shared via a global file — each
 * theme owns its full identity, including density and type.
 *
 * Feedback/sentiment colours are keyed by valence (`positive`/`negative`/
 * `warn`/`info`), not feature — the same tokens serve an Alert's error state, a
 * metric's downward delta, and a diff's removed line. See DECISIONS.md (token
 * conventions).
 */
export const vars = createThemeContract({
  color: {
    // Surfaces — elevation is communicated via shadow, not a surface-colour
    // ladder (no `surfaceRaised`).
    background: null,
    surface: null,
    overlay: null,
    // A subtle alpha wash for hover/focus backgrounds on ghost / icon-only
    // controls, which must composite correctly over whatever surface they sit
    // on. Not `accentSubtle` — most themes' accent is a saturated brand hue, so
    // an accent-anchored wash reads as neutral by accident in a desaturated
    // theme and as a coloured smear in a saturated one. Anchored on each mode's
    // own neutral-ink extreme instead.
    overlaySubtle: null,
    // Inverse tokens: section-scoped "render as if the other mode were active"
    // without flipping the global mode — a dark band inside a light page.
    // Mode (light/dark) is a separate global axis; each mode is fully authored,
    // never derived from the other. Inverse fields approximate the *other*
    // mode's real primary values, authored only after both real modes exist.
    backgroundInverse: null,
    surfaceInverse: null,
    // Text — two ranks. `subtle` always means "one step down in prominence",
    // the same meaning it carries in border/accent. No third rung in v1.
    text: null,
    textSubtle: null,
    textInverse: null,
    textInverseSubtle: null,
    // Borders
    border: null,
    borderStrong: null,
    borderSubtle: null,
    borderInverse: null,
    // Elevation — box-shadow colour, distinct from border (see tokens.ts).
    shadow: null,
    // Primary — the main call-to-action fill. Kept distinct from `accent`: an
    // ink-primary theme's subtle accent must not double as its button colour,
    // or every subtle use (focus borders, underlines, hover) goes loud too.
    primary: null,
    onPrimary: null,
    // Accent — a subtler signal colour (focus borders, underlines, hover,
    // sentiment-adjacent emphasis), not the button fill.
    accent: null,
    accentHover: null,
    accentSubtle: null,
    onAccent: null,
    onAccentSubtle: null,
    // Focus
    focusRing: null,
    // Sentiment — each `{ surface, border, text, icon }`. Application-named (not
    // prominence-named) because a sentiment role spans multiple destinations.
    positive: { surface: null, border: null, text: null, icon: null },
    negative: { surface: null, border: null, text: null, icon: null },
    warn: { surface: null, border: null, text: null, icon: null },
    info: { surface: null, border: null, text: null, icon: null },
  },
  // Radius. `control` is the theme's one authored corner; `full` is the
  // orthogonal maximal-rounding treatment for square-aspect elements. No
  // `surface`: a padded surface derives its radius from `control` plus its own
  // padding (see foundations/concentricRadius.ts).
  radius: {
    control: null,
    full: null,
    // Concentric-nesting opt-out — a unitless `'1'` or `'0'` multiplied into the
    // padding term of a derived radius (`calc(control + nesting * pad)`). A
    // boolean smuggled in as a multiplier so one formula serves every theme with
    // no per-theme branching.
    nesting: null,
    // CSS `corner-shape` — how the corner `border-radius` carves is drawn
    // (`round`, `squircle`, `bevel`, `notch`, `scoop`, `superellipse()`). In the
    // contract, not per component, because it must be uniform: a squircle button
    // inside a round-cornered card defeats the concentric-radius rule.
    // Progressive enhancement — unsupported browsers paint the plain
    // `border-radius`; inert at `border-radius: 0`.
    cornerShape: null,
  },
  space: {
    xs: null,
    sm: null,
    md: null,
    lg: null,
    xl: null,
    '2xl': null,
  },
  // Control sizing (the density lever). Component `size` props map here.
  controlHeight: {
    sm: null,
    md: null,
    lg: null,
    xl: null,
  },
  // Font-family roles (semantic) — each maps to a primitive stack in the theme.
  fontFamily: {
    display: null,
    heading: null,
    body: null,
    mono: null,
  },
  fontWeight: {
    regular: null,
    medium: null,
    semibold: null,
    bold: null,
  },
  // Type scale: font-size / line-height / weight / tracking per variant.
  //
  // `fontSize` is rem (assumes the 16px root set in globalStyles.css.ts — WCAG
  // SC 1.4.4). `lineHeight` is a unitless multiplier, not a fixed px value —
  // WCAG SC 1.4.12, so a user stylesheet forcing 1.5x line spacing scales with
  // the text rather than colliding with it. `letterSpacing` is per-variant, not
  // a standalone scale, because the right value is a function of size.
  text: {
    caption: { fontSize: null, lineHeight: null, fontWeight: null, letterSpacing: null },
    bodySm: { fontSize: null, lineHeight: null, fontWeight: null, letterSpacing: null },
    bodyMd: { fontSize: null, lineHeight: null, fontWeight: null, letterSpacing: null },
    bodyLg: { fontSize: null, lineHeight: null, fontWeight: null, letterSpacing: null },
    headingSm: { fontSize: null, lineHeight: null, fontWeight: null, letterSpacing: null },
    headingMd: { fontSize: null, lineHeight: null, fontWeight: null, letterSpacing: null },
    headingLg: { fontSize: null, lineHeight: null, fontWeight: null, letterSpacing: null },
    displaySm: { fontSize: null, lineHeight: null, fontWeight: null, letterSpacing: null },
    displayLg: { fontSize: null, lineHeight: null, fontWeight: null, letterSpacing: null },
    // The poster step — a theme with no use for poster type still has to say
    // what its largest voice is, which is the point of a total contract.
    displayXl: { fontSize: null, lineHeight: null, fontWeight: null, letterSpacing: null },
  },
});
