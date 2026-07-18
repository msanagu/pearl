import { createThemeContract } from '@vanilla-extract/css';

/**
 * The theme contract — the single source of truth for *which* semantic tokens
 * exist. Leaves are `null`: this defines only the *shape*. Every concrete theme
 * (`src/themes/*.css.ts`) must fulfill this exact shape via `createTheme`, and
 * TypeScript fails to compile if a theme omits or misnames a token.
 *
 * ## Tiering (ADR-0005)
 * Components consume this **semantic** layer only — role-named tokens, never raw
 * values. Each theme (`src/themes/*.css.ts`) now has a real primitive tier: a
 * module-scoped `*Primitives` object of raw, named hexes (e.g. `aubergine:
 * '#624C5D'`), which the `createTheme()` call maps onto these semantic roles.
 * Primitives are scoped per theme (not shared across Tahitian/Freshwater/South
 * Sea) and per mode within a theme — see any `themes/*.css.ts` file. Values are
 * still placeholders pending the Fable 5 visual-language pass; the tier
 * structure itself is final.
 *
 * Non-color scales (radius/space/controlHeight/fontWeight/fontFamily/text) are
 * likewise defined per theme, not shared via a global scales file — each theme
 * owns its full identity, including density and type, not just color.
 *
 * ## Color naming (ADR-0005 worked example)
 * Feedback/sentiment colors are keyed by *valence* (`positive`/`negative`/
 * `warn`/`info`), not by feature — so the same tokens serve an Alert's error
 * state, a metric's downward delta, and a diff's removed line.
 */
export const vars = createThemeContract({
  color: {
    // Surfaces — elevation is communicated via shadow, not a surface color
    // ladder (no `surfaceRaised`). Revisit only if a dark theme proves shadow
    // alone doesn't read (Material's dark-elevation precedent) — additive if so.
    background: null,
    surface: null,
    overlay: null,
    // Inverse tokens: section-scoped "render as if the OTHER mode were
    // active," without flipping the global mode — a dark band inside an
    // otherwise-light page (or vice versa). Same pattern as Material 3's
    // inverseSurface/inverseOnSurface/inversePrimary (used there for Snackbar).
    //
    // Mode (light/dark) is a separate, GLOBAL axis: each mode is a fully
    // independent, completely authored token set — never derived from the
    // other. Inverse tokens are the bridge between them: each mode's inverse
    // fields should approximate the OTHER mode's real primary values (e.g.
    // lightTheme.backgroundInverse ≈ darkTheme.background), authored only
    // after both real modes exist — never the other way around (a mode must
    // never be seeded FROM an inverse value).
    backgroundInverse: null,
    surfaceInverse: null,
    // Text — two ranks. `subtle` always means "one step down in prominence,"
    // the same meaning it carries in border/accent (ADR-0006). No third rung
    // (`textFaint`) in v1 — added risk of contrast failure for little payoff.
    text: null,
    textSubtle: null,
    textInverse: null,
    textInverseSubtle: null,
    // Borders
    border: null,
    borderStrong: null,
    borderSubtle: null,
    borderInverse: null,
    // Accent — the one hue: primary/brand action color (ADR-0006). A theme
    // wanting an "ink-primary, color-at-the-seams" identity (e.g. Pearl) still
    // expresses it through `accent` — set it to a near-neutral ink, and use
    // `focusRing`/sentiment for where color actually shows.
    accent: null,
    accentHover: null,
    accentSubtle: null,
    onAccent: null,
    // Focus
    focusRing: null,
    // Sentiment — each { surface, border, text, icon }. Application-named (not
    // prominence-named like strong/subtle) because a sentiment role spans
    // multiple destinations — surface/border/text map directly to their CSS
    // property, `icon` is the saturated mark color (ADR-0006).
    positive: { surface: null, border: null, text: null, icon: null },
    negative: { surface: null, border: null, text: null, icon: null },
    warn: { surface: null, border: null, text: null, icon: null },
    info: { surface: null, border: null, text: null, icon: null },
  },
  // Radius roles (ADR discussion): control/surface are element-role defaults;
  // `full` is the orthogonal maximal-rounding treatment (pill/circle/avatar).
  radius: {
    control: null,
    surface: null,
    full: null,
  },
  // Spacing scale — t-shirt (kept deliberately; see naming/scale decision).
  space: {
    xs: null,
    sm: null,
    md: null,
    lg: null,
    xl: null,
    '2xl': null,
  },
  // Control sizing (the density lever). Component `size` props map here, so an
  // enterprise theme sets tight heights and an agency theme sets airy ones.
  controlHeight: {
    sm: null,
    md: null,
    lg: null,
    xl: null,
  },
  // Font-family ROLES (semantic) — each maps to a primitive stack in the theme.
  // Roles line up with the type-size groups: Text applies these by variant.
  // (Primitive stacks — sans/serif/mono — are the values in scales.ts for now;
  // named primitives arrive with the visual language.)
  fontFamily: {
    display: null,
    heading: null,
    body: null,
  },
  fontWeight: {
    regular: null,
    medium: null,
    semibold: null,
    bold: null,
  },
  // Type scale: fixed font-size / line-height pairs per variant. Line-height is
  // always an absolute value, never a unitless ratio.
  text: {
    bodySm: { fontSize: null, lineHeight: null, fontWeight: null },
    bodyMd: { fontSize: null, lineHeight: null, fontWeight: null },
    bodyLg: { fontSize: null, lineHeight: null, fontWeight: null },
    headingSm: { fontSize: null, lineHeight: null, fontWeight: null },
    headingMd: { fontSize: null, lineHeight: null, fontWeight: null },
    headingLg: { fontSize: null, lineHeight: null, fontWeight: null },
    displaySm: { fontSize: null, lineHeight: null, fontWeight: null },
    displayLg: { fontSize: null, lineHeight: null, fontWeight: null },
  },
});
