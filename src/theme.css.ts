import { createThemeContract } from '@vanilla-extract/css';
// Side-effect import — sets the 16px root the whole rem-based type scale
// assumes. theme.css.ts is imported everywhere the contract is used, so this
// guarantees the root rule ships wherever `vars` does.
import './globalStyles.css';

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
    // A subtle alpha wash — hover/focus backgrounds on ghost/icon-only controls
    // (a dismiss button, an icon-only toggle) that must composite correctly
    // over WHATEVER surface they sit on, not just `background`/`surface`. Not
    // `accentSubtle`: that's a solid, theme-branded tint (fine for selected
    // rows/active nav on a known surface), but most themes' accent is a fully
    // saturated brand hue — an accent-anchored wash would read as neutral by
    // accident in a desaturated theme and as a colored smear in a saturated
    // one. Anchored on each mode's own neutral-ink extreme instead (see
    // `pearl.css.ts`'s `inkAlpha`), same relationship `overlay` already has to
    // that ink, just at a much lower alpha for a wash instead of a backdrop.
    overlaySubtle: null,
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
    // Elevation — box-shadow color, distinct from border (see tokens.ts).
    shadow: null,
    // Primary — the main call-to-action fill (Button's `primary` variant).
    // Added after authoring real theme values: all four themes turned out to
    // need a CTA fill distinct from `accent` (an ink-primary theme's subtle
    // accent must NOT double as its button color, or every subtle use — focus
    // borders, underlines, hover states — goes loud too). Promoted once this
    // pattern repeated across all four, not designed in advance.
    primary: null,
    onPrimary: null,
    // Accent — a subtler signal color: focus borders, underlines, hover
    // states, sentiment-adjacent emphasis. NOT assumed to be the button fill
    // — an ink-primary theme (e.g. Pearl) keeps `accent` genuinely subtle and
    // uses `primary` for its CTA fill instead.
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
  // Type scale: font-size / line-height / tracking triples per variant.
  //
  // `fontSize` is rem (assumes the 16px root set in globalStyles.css.ts — see
  // WCAG SC 1.4.4 Resize Text). `lineHeight` is a UNITLESS multiplier, not a
  // fixed px value — required by WCAG SC 1.4.12 Text Spacing so a user
  // stylesheet forcing 1.5x line spacing scales with the text instead of
  // colliding with an author-fixed px value. Each theme still authors it to
  // land on the 8px soft grid (spacing-system.md) at the theme's own
  // font-size — see docs/foundations/typography.md for the accessibility rationale and
  // per-theme worked numbers.
  //
  // `letterSpacing` is per-variant rather than a standalone scale because
  // tracking is a property of a type step, not an independent axis: display
  // type is set tight, body is set at zero, and the correct value is a function
  // of size. Label tracking (mono caps at .12–.2em in three of the four themes)
  // is NOT here — `label` is not a shared role, so its tracking lives in each
  // theme's own configuration (see src/themes/roles.ts).
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
  },
});
