import { createTheme, globalStyle, style } from '@vanilla-extract/css';
import { vars } from '@/theme.css';
import { inverseOverride } from '@/foundations/inverseOverride';
import { fieldMeta, label as fieldLabel } from '@components/Field/Field.css';
import { body as sphereBody, contact as sphereContact } from '@components/_brand/PearlSphere/PearlSphere.css';

/**
 * Freshwater — a stark black/white ops-console register: neon electric-blue
 * spent only where the system speaks (statuses, deltas, selection, the primary
 * CTA), never as decoration. Radius 0 throughout (with a slight 2px on
 * controls); a heavy 2px ink rule marks structural divisions, a 1px hairline
 * everywhere else.
 *
 * Two colour tiers: `ice`/`graphite`/`glacier` are raw single-hue scales; the
 * `*ThemeClass` calls map them onto semantic roles. Scales are this theme's own.
 */

// ---- Type primitives (named by what they are — no roles assigned here) ----
export const freshwaterFonts = {
  grotesk: "'Space Grotesk', system-ui, -apple-system, 'Segoe UI', sans-serif",
  mono: "'Azeret Mono', ui-monospace, 'SF Mono', Menlo, monospace",
};

// ---- Colour primitives ----

/**
 * Light-register neutral, one cool near-white hue (every step above OKLCH L
 * 0.92) stepped 100 (brightest) → 400. Only spans its light end; the dark
 * register is `freshwaterGraphite`.
 */
export const freshwaterIce = {
  /** page background (light) / borrowed as text + inverse surfaces (dark) */
  100: '#fdfdfd',
  /** raised surface (light) / borrowed as inverse surface (dark) */
  200: '#fafafa',
  /** border, subtle */
  300: '#eef0f1',
  /** border / borrowed as borderInverse (dark) */
  400: '#e3e5e7',
};

/**
 * Dark-register neutral, stepped 500 (least dark) → 900. Only spans its dark
 * end, mirroring Pearl's `squidInk`; `900` is also borrowed directly as light
 * mode's `text`. Both mid-greys (`500`, `550`) live here, ordered by value —
 * Freshwater has no third home for mid-tones the way Pearl parks them in
 * `urchin` (that only works because Pearl's accent reads as a tinted neutral;
 * `glacier` peaks at 0.137 chroma and could never carry muted text).
 */
export const freshwaterGraphite = {
  /** text, subtle (dark) */
  500: '#9da1a6',
  /** text, subtle (light) */
  550: '#5b5b60',
  /** border (dark) / borrowed as borderInverse (light) */
  600: '#2b2d30',
  /** border, subtle (dark) / accentSubtle (dark) */
  700: '#202123',
  /** raised surface (dark) / borrowed as inverse surface (light) */
  800: '#17181a',
  /** page background (dark) / borrowed as text + inverse background (light) */
  900: '#0e0f10',
};

/**
 * The accent hue — electric blue, spent only where the system speaks. One
 * scale reused across both modes, in strict lightness order (unlike the
 * neutrals, which span one register each) because this hue is used across the
 * full range. Light mode's text-bearing roles use the deep end — the electric
 * `400` step measures 2.29:1 on paper-white, fine as a border/focus signal but
 * a failure as body text.
 */
export const freshwaterGlacier = {
  /** accentSubtle, light mode */
  100: '#e9fbff',
  /** text on the solid-ink primary fill, light mode */
  200: '#5fe1ff',
  /** accent, dark mode */
  300: '#4dd8ff',
  /** accentHover, dark mode */
  400: '#00b8e6',
  /** accent + focusRing, light mode */
  500: '#007DA0',
  /** accentHover, light mode */
  600: '#005E78',
};

/**
 * Alpha cut of `glacier[600]` for dark-mode washes. The bright near-white cyan
 * steps only lighten a dark surface (read as a glow); this deep step is darker
 * than the surfaces it composites over, so it shifts the surface's hue toward
 * blue. Alpha capped at 0.5: composited over the dark `surface`, `textSubtle`
 * against the gradient's peak stop measures 4.65:1 at 0.5 vs 4.22:1 at 0.6 —
 * the difference between clearing and missing WCAG AA.
 */
const freshwaterGlacierAlpha = {
  600: 'rgba(0, 94, 120, 0.5)',
  0: 'rgba(0, 94, 120, 0)',
};

const freshwaterScrim = {
  light: 'rgba(14, 15, 16, 0.5)',
  dark: 'rgba(0, 0, 0, 0.6)',
};

// Sentiment families — one 100→800 scale per hue, shared by both modes. Tuned
// for harmony with the cool `glacier` accent: `spring` (positive) is a mint
// kept out of `glacier`'s blue range; `pool` (info) is the nearest hue to
// `glacier` on purpose, the system's other "cool, electric" signal; `canyon`
// (negative) is the one warm hue, so it doesn't fight `pool` for the "which
// blue is this" read; `sulphur` (warn) leans yellow-green, out of `canyon`'s range.
export const freshwaterSentiment = {
  spring: { 100: '#e4f9f1', 200: '#b7ecda', 300: '#7fdcbc', 400: '#2cbe8d', 500: '#0a9e6e', 600: '#0c7050', 700: '#0a5540', 800: '#0b241c' },
  canyon: { 100: '#fbede7', 200: '#f0c4b0', 300: '#e8a084', 400: '#d46b45', 500: '#b14e2e', 600: '#7a3620', 700: '#622a1a', 800: '#271410' },
  sulphur: { 100: '#fbf6dc', 200: '#ede29a', 300: '#dccb5a', 400: '#c2ac24', 500: '#8f7e14', 600: '#645a12', 700: '#584f10', 800: '#242009' },
  pool: { 100: '#ebf1fe', 200: '#b9ccf7', 300: '#9fc0f5', 400: '#5a8cf0', 500: '#3b6fe0', 600: '#2c4a80', 700: '#1c3a80', 800: '#131d2e' },
};

/** 2px on controls only — a hair softer than the console's hard-edged cards. */
const freshwaterRadius = { control: '2px', full: '9999px', nesting: '0', cornerShape: 'round' };
// rem, not px — scales with the user's base font-size preference (see pearl.css.ts).
const freshwaterSpace = { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem', '2xl': '3rem' };
const freshwaterControlHeight = { sm: '2rem', md: '2.5rem', lg: '3rem', xl: '3.5rem' };
const freshwaterFontWeight = { regular: '400', medium: '500', semibold: '600', bold: '700' };
// Body copy reads in Azeret Mono too, leaning into the ops-console register;
// Space Grotesk is reserved for display/heading. Both loaded via @fontsource.
const freshwaterFontFamily = {
  display: freshwaterFonts.grotesk,
  heading: freshwaterFonts.grotesk,
  body: freshwaterFonts.mono,
  mono: freshwaterFonts.mono,
};
// Sizes follow the shared 4px-grid ramp (see pearl.css.ts); weight/tracking are Freshwater's own.
const freshwaterText = {
  caption: { fontSize: '0.6875rem', lineHeight: '1.4545', fontWeight: '400', letterSpacing: '0' }, // 11/16
  bodySm: { fontSize: '0.75rem', lineHeight: '1.6667', fontWeight: '400', letterSpacing: '0' }, // 12/20
  bodyMd: { fontSize: '1rem', lineHeight: '1.5', fontWeight: '400', letterSpacing: '0' }, // 16/24
  bodyLg: { fontSize: '1.5rem', lineHeight: '1.5', fontWeight: '400', letterSpacing: '0' }, // 24/36
  headingSm: { fontSize: '2rem', lineHeight: '1.25', fontWeight: '600', letterSpacing: '-0.005em' }, // 32/40
  headingMd: { fontSize: '2.5rem', lineHeight: '1.2', fontWeight: '600', letterSpacing: '-0.01em' }, // 40/48
  headingLg: { fontSize: '3.5rem', lineHeight: '1.142857', fontWeight: '600', letterSpacing: '-0.01em' }, // 56/64
  displaySm: { fontSize: 'clamp(2rem, 8vw, 4.5rem)', lineHeight: '1.056', fontWeight: '700', letterSpacing: '-0.02em' }, // 76px ceiling
  displayLg: { fontSize: 'clamp(2.5rem, 9vw, 5.5rem)', lineHeight: '1.05', fontWeight: '700', letterSpacing: '-0.03em' }, // 88px ceiling
  displayXl: { fontSize: 'clamp(3rem, 13vw, 9.5rem)', lineHeight: '1', fontWeight: '700', letterSpacing: '-0.035em' }, // 152px ceiling
};

export const freshwaterLightThemeClass = createTheme(vars, {
  color: {
    background: freshwaterIce[100],
    surface: freshwaterIce[200],
    overlay: freshwaterScrim.light,
    overlaySubtle: 'rgba(14, 15, 16, 0.08)',
    text: freshwaterGraphite[900],
    textSubtle: freshwaterGraphite[550],
    icon: freshwaterGraphite[550],
    border: freshwaterIce[400],
    borderStrong: freshwaterGraphite[900], // the heavy structural rule — full ink, not a lifted neutral
    borderSubtle: freshwaterIce[300],
    borderInverse: freshwaterGraphite[600],
    shadow: freshwaterIce[400],
    // Primary is the console's own ink, not the glacier accent — glacier is
    // spent only where the system speaks, never as a CTA fill.
    primary: freshwaterGraphite[900],
    onPrimary: freshwaterIce[100],
    // The deep end of glacier — these roles land as text on paper-white.
    // Measured on `ice[200]` (the harder ground): `accent` 4.53:1,
    // `accentHover` 7.00:1.
    accent: freshwaterGlacier[500],
    accentHover: freshwaterGlacier[600],
    accentSubtle: freshwaterGlacier[100],
    onAccent: freshwaterIce[100], // flips with `accent`: the deep step needs paper-white, not ink (4.65:1)
    onAccentSubtle: freshwaterGraphite[900],
    focusRing: freshwaterGlacier[500],
    // `icon` mixed toward `textSubtle` — full-strength sentiment hue reads more
    // prominent than body text despite lower contrast.
    positive: { surface: freshwaterSentiment.spring[100], border: freshwaterSentiment.spring[200], text: freshwaterSentiment.spring[700], icon: `color-mix(in srgb, ${freshwaterSentiment.spring[500]} 65%, ${vars.color.textSubtle})` },
    negative: { surface: freshwaterSentiment.canyon[100], border: freshwaterSentiment.canyon[200], text: freshwaterSentiment.canyon[600], icon: `color-mix(in srgb, ${freshwaterSentiment.canyon[500]} 65%, ${vars.color.textSubtle})` },
    warn: { surface: freshwaterSentiment.sulphur[100], border: freshwaterSentiment.sulphur[200], text: freshwaterSentiment.sulphur[700], icon: `color-mix(in srgb, ${freshwaterSentiment.sulphur[500]} 65%, ${vars.color.textSubtle})` },
    info: { surface: freshwaterSentiment.pool[100], border: freshwaterSentiment.pool[200], text: freshwaterSentiment.pool[700], icon: `color-mix(in srgb, ${freshwaterSentiment.pool[500]} 65%, ${vars.color.textSubtle})` },
  },
  radius: freshwaterRadius,
  space: freshwaterSpace,
  controlHeight: freshwaterControlHeight,
  fontWeight: freshwaterFontWeight,
  fontFamily: freshwaterFontFamily,
  text: freshwaterText,
});

export const freshwaterDarkThemeClass = createTheme(vars, {
  color: {
    background: freshwaterGraphite[900],
    surface: freshwaterGraphite[800],
    overlay: freshwaterScrim.dark,
    overlaySubtle: 'rgba(255, 255, 255, 0.10)',
    text: freshwaterIce[100],
    textSubtle: freshwaterGraphite[500],
    icon: freshwaterGraphite[500],
    border: freshwaterGraphite[600],
    borderStrong: freshwaterIce[100], // structural rule inverts — full paper-white
    borderSubtle: freshwaterGraphite[700],
    borderInverse: freshwaterIce[400],
    // A shadow is occlusion — it must darken; every neutral in dark mode is
    // lighter than `background`, so this is a fixed value.
    shadow: 'rgba(0, 0, 0, 0.55)',
    primary: freshwaterIce[100], // ink fill flips to paper-white against near-black text
    onPrimary: freshwaterGraphite[900],
    accent: freshwaterGlacier[300],
    accentHover: freshwaterGlacier[400],
    // A neutral, not a glacier step — a background wash is decoration, which
    // this theme's own identity rules out.
    accentSubtle: freshwaterGraphite[700],
    onAccent: freshwaterGraphite[900],
    onAccentSubtle: freshwaterIce[100],
    focusRing: freshwaterGlacier[300],
    positive: { surface: freshwaterSentiment.spring[800], border: freshwaterSentiment.spring[600], text: freshwaterSentiment.spring[300], icon: `color-mix(in srgb, ${freshwaterSentiment.spring[400]} 65%, ${vars.color.textSubtle})` },
    negative: { surface: freshwaterSentiment.canyon[800], border: freshwaterSentiment.canyon[700], text: freshwaterSentiment.canyon[300], icon: `color-mix(in srgb, ${freshwaterSentiment.canyon[400]} 65%, ${vars.color.textSubtle})` },
    warn: { surface: freshwaterSentiment.sulphur[800], border: freshwaterSentiment.sulphur[600], text: freshwaterSentiment.sulphur[300], icon: `color-mix(in srgb, ${freshwaterSentiment.sulphur[400]} 65%, ${vars.color.textSubtle})` },
    info: { surface: freshwaterSentiment.pool[800], border: freshwaterSentiment.pool[600], text: freshwaterSentiment.pool[300], icon: `color-mix(in srgb, ${freshwaterSentiment.pool[400]} 65%, ${vars.color.textSubtle})` },
  },
  radius: freshwaterRadius,
  space: freshwaterSpace,
  controlHeight: freshwaterControlHeight,
  fontWeight: freshwaterFontWeight,
  fontFamily: freshwaterFontFamily,
  text: freshwaterText,
});

inverseOverride(freshwaterLightThemeClass, {
  background: freshwaterGraphite[900],
  surface: freshwaterGraphite[800],
  text: freshwaterIce[100],
  textSubtle: freshwaterGraphite[500],
  icon: freshwaterGraphite[500],
  accent: freshwaterGlacier[300],
  accentHover: freshwaterGlacier[400],
  accentSubtle: freshwaterGraphite[700],
  onAccent: freshwaterGraphite[900],
  onAccentSubtle: freshwaterIce[100],
  positive: { surface: freshwaterSentiment.spring[800], border: freshwaterSentiment.spring[600], text: freshwaterSentiment.spring[300], icon: `color-mix(in srgb, ${freshwaterSentiment.spring[400]} 65%, ${vars.color.textSubtle})` },
  negative: { surface: freshwaterSentiment.canyon[800], border: freshwaterSentiment.canyon[700], text: freshwaterSentiment.canyon[300], icon: `color-mix(in srgb, ${freshwaterSentiment.canyon[400]} 65%, ${vars.color.textSubtle})` },
  warn: { surface: freshwaterSentiment.sulphur[800], border: freshwaterSentiment.sulphur[600], text: freshwaterSentiment.sulphur[300], icon: `color-mix(in srgb, ${freshwaterSentiment.sulphur[400]} 65%, ${vars.color.textSubtle})` },
  info: { surface: freshwaterSentiment.pool[800], border: freshwaterSentiment.pool[600], text: freshwaterSentiment.pool[300], icon: `color-mix(in srgb, ${freshwaterSentiment.pool[400]} 65%, ${vars.color.textSubtle})` },
});
inverseOverride(freshwaterDarkThemeClass, {
  background: freshwaterIce[100],
  surface: freshwaterIce[200],
  text: freshwaterGraphite[900],
  textSubtle: freshwaterGraphite[550],
  icon: freshwaterGraphite[550],
  accent: freshwaterGlacier[500],
  accentHover: freshwaterGlacier[600],
  accentSubtle: freshwaterGlacier[100],
  onAccent: freshwaterIce[100],
  onAccentSubtle: freshwaterGraphite[900],
  positive: { surface: freshwaterSentiment.spring[100], border: freshwaterSentiment.spring[200], text: freshwaterSentiment.spring[700], icon: `color-mix(in srgb, ${freshwaterSentiment.spring[500]} 65%, ${vars.color.textSubtle})` },
  negative: { surface: freshwaterSentiment.canyon[100], border: freshwaterSentiment.canyon[200], text: freshwaterSentiment.canyon[600], icon: `color-mix(in srgb, ${freshwaterSentiment.canyon[500]} 65%, ${vars.color.textSubtle})` },
  warn: { surface: freshwaterSentiment.sulphur[100], border: freshwaterSentiment.sulphur[200], text: freshwaterSentiment.sulphur[700], icon: `color-mix(in srgb, ${freshwaterSentiment.sulphur[500]} 65%, ${vars.color.textSubtle})` },
  info: { surface: freshwaterSentiment.pool[100], border: freshwaterSentiment.pool[200], text: freshwaterSentiment.pool[700], icon: `color-mix(in srgb, ${freshwaterSentiment.pool[500]} 65%, ${vars.color.textSubtle})` },
});

// Primary CTA — caps label in both modes (the console-readout register).
globalStyle(
  `${freshwaterLightThemeClass} [data-component="button"][data-variant="primary"], ${freshwaterDarkThemeClass} [data-component="button"][data-variant="primary"]`,
  { textTransform: 'uppercase' },
);

// Light mode's primary fill is solid ink — `glacier[200]` (tuned for contrast
// on near-black) reads clean there. Dark mode's fill inverts to paper-white,
// where the same bright cyan would fail contrast, so it keeps its default
// near-black `onPrimary`.
globalStyle(`${freshwaterLightThemeClass} [data-component="button"][data-variant="primary"]`, {
  color: freshwaterGlacier[200],
});

// The shared Button recipe's primary carries an `inset` top-highlight sized for
// Pearl's near-fill-hued `accentSubtle`. Freshwater's is a bright wash, so it
// reads as a stark seam — dropped entirely; a background hue-shift carries
// hover/press feedback.
globalStyle(
  `${freshwaterLightThemeClass} [data-component="button"][data-variant="primary"], ${freshwaterDarkThemeClass} [data-component="button"][data-variant="primary"]`,
  { boxShadow: 'none' },
);
globalStyle(`${freshwaterLightThemeClass} [data-component="button"][data-variant="primary"]:not(:disabled):hover`, {
  // Restated at `:hover` — the base recipe's own `:hover` rule outranks this
  // file's resting `boxShadow: none` once `:hover` matches.
  backgroundColor: `color-mix(in srgb, ${vars.color.primary} 85%, ${vars.color.accent})`,
  boxShadow: 'none',
  transform: 'none',
});

// Dark mode: full bright-blue fill, ink border — the accent carries the whole box.
globalStyle(`${freshwaterDarkThemeClass} [data-component="button"][data-variant="primary"]`, {
  backgroundColor: freshwaterGlacier[300],
  color: freshwaterGraphite[900],
  border: `1px solid ${freshwaterGraphite[900]}`,
  boxShadow: 'none',
});
globalStyle(`${freshwaterDarkThemeClass} [data-component="button"][data-variant="primary"]:not(:disabled):hover`, {
  backgroundColor: freshwaterIce[100],
  boxShadow: 'none',
  transform: 'none',
});

// Input's resting border reads too quiet against the console register at the
// shared `color.border` hairline — `color.text` gives it the same weight as the
// labels next to it.
globalStyle(
  `${freshwaterLightThemeClass} [data-component="input"], ${freshwaterDarkThemeClass} [data-component="input"]`,
  { borderColor: vars.color.text },
);

// Button text a step down from `bodyMd` — compact controls, not headline-weight CTAs.
globalStyle(
  `${freshwaterLightThemeClass} [data-component="button"], ${freshwaterDarkThemeClass} [data-component="button"]`,
  { fontSize: vars.text.bodySm.fontSize },
);

// Preheading + Field's label: subtle mono caps, the console's metadata idiom.
// `textSubtle` so the readout recedes behind the value it labels.
const freshwaterMetaCaps = {
  fontFamily: vars.fontFamily.mono,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: vars.color.textSubtle,
} as const;
globalStyle(
  `${freshwaterLightThemeClass} [data-role="preheading"], ${freshwaterDarkThemeClass} [data-role="preheading"]`,
  freshwaterMetaCaps,
);

// Preheading *default* size only — gated on `:not([data-type-scale])` so an
// explicit `typeScale` still wins. `Text` writes `data-type-scale` exactly
// when the caller named a scale; without this, a bare `role="preheading"`
// inherits its ambient size instead of caption, reading oversized.
globalStyle(
  `${freshwaterLightThemeClass} [data-role="preheading"]:not([data-type-scale]), ${freshwaterDarkThemeClass} [data-role="preheading"]:not([data-type-scale])`,
  {
    fontSize: vars.text.caption.fontSize,
    lineHeight: vars.text.caption.lineHeight,
  },
);
globalStyle(
  [
    `${freshwaterLightThemeClass} .${fieldMeta} .${fieldLabel}`,
    `${freshwaterDarkThemeClass} .${fieldMeta} .${fieldLabel}`,
  ].join(', '),
  freshwaterMetaCaps,
);

// `headingSm` and `displayLg` only — where real statement headlines and the
// console's section-label register land. `displaySm` (stat figures) is excluded
// — caps is a no-op on digits.
globalStyle(
  [
    `${freshwaterLightThemeClass} [data-type-scale="headingSm"]`,
    `${freshwaterDarkThemeClass} [data-type-scale="headingSm"]`,
    `${freshwaterLightThemeClass} [data-type-scale="displayLg"]`,
    `${freshwaterDarkThemeClass} [data-type-scale="displayLg"]`,
  ].join(', '),
  {
    textTransform: 'uppercase',
    lineHeight: '0.92', // caps have no descenders — tighter than the base, not looser
  },
);

// ---- Freshwater's own sphere ----
//
// `PearlSphere` reads `pearlTreatments.luster` directly (bespoke brand
// artwork), so a per-theme look means overriding its two styled elements here.
// A hard two-tone split and a zero-blur offset shadow — flat, graphic shading
// to match the console's flat surfaces. Static, no sweep: an ambient loop is
// exactly the decoration this theme rules out.
globalStyle(`${freshwaterLightThemeClass} .${sphereBody}`, {
  backgroundImage: `
    radial-gradient(circle at 30% 24%, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.76) 16%, rgba(255,255,255,0.18) 28%, transparent 42%),
    radial-gradient(circle at 66% 76%, rgba(6, 67, 87, 0.28) 0%, rgba(6, 67, 87, 0.14) 32%, transparent 62%),
    linear-gradient(135deg, #ebffff 0%, #b8f2ff 12%, #67dfff 30%, #1db3de 52%, #0d8fbd 70%, #0b5f7d 100%)
  `,
  backgroundColor: '#1db3de',
  boxShadow: `0 0 0 2px ${freshwaterGraphite[900]}`,
  filter: 'contrast(1.08) saturate(1.08)',
  animation: 'none',
});
// The cast shadow is a flattened ellipse on `sphereContact` alone, detached
// from the sphere's edge — the body highlight sits top-left, so the shadow
// falls down-and-right.
globalStyle(`${freshwaterLightThemeClass} .${sphereContact}`, {
  background: 'radial-gradient(ellipse at center, rgba(14, 15, 16, 0.32) 0%, rgba(14, 15, 16, 0.16) 55%, transparent 78%)',
  opacity: 1,
  width: '77.4%',
  height: '20.2%',
  left: 'calc(50% + 13.1%)',
  bottom: '-13.1%',
});

globalStyle(`${freshwaterDarkThemeClass} .${sphereBody}`, {
  backgroundImage: `
    radial-gradient(circle at 30% 24%, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.7) 16%, rgba(255,255,255,0.16) 28%, transparent 42%),
    radial-gradient(circle at 66% 76%, rgba(5, 42, 56, 0.34) 0%, rgba(5, 42, 56, 0.14) 32%, transparent 62%),
    linear-gradient(135deg, #dffcff 0%, #a8efff 12%, #6fdfff 30%, #2cb0df 52%, #0b7eaa 70%, #083d4a 100%)
  `,
  backgroundColor: '#2cb0df',
  boxShadow: `0 0 0 2px ${freshwaterGraphite[900]}`,
  filter: 'contrast(1.1) saturate(1.12)',
  animation: 'none',
});
globalStyle(`${freshwaterDarkThemeClass} .${sphereContact}`, {
  background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.28) 55%, transparent 78%)',
  opacity: 1,
  width: '77.4%',
  height: '20.2%',
  left: 'calc(50% + 13.1%)',
  bottom: '-13.1%',
});

// `wash` — Freshwater's extension treatment, assigned to `cardHover` in
// freshwater.roles.ts. See DECISIONS.md (theme extensions).
export const [freshwaterExtensionClass, freshwaterTreatments] = createTheme({
  wash: {
    angle: '90deg',
    gradient: 'linear-gradient(90deg, #E9FBFF 0%, rgba(233, 251, 255, 0) 60%)',
    // Deep glacier alpha, not a neutral gray or the bright cyan steps — both of
    // those lighten a dark surface (read as a glow); this tints it.
    gradientDark: `linear-gradient(90deg, ${freshwaterGlacierAlpha[600]} 0%, ${freshwaterGlacierAlpha[0]} 60%)`,
    duration: '250ms',
    easing: 'ease',
    opacity: '1',
    // The saturated cyan step at low alpha, not a literal near-white swatch —
    // over an already-dimmed photo the near-white reads as plain white.
    plateGradient: 'linear-gradient(135deg, rgba(95, 225, 255, 0.4) 0%, rgba(95, 225, 255, 0) 65%)',
    plateGradientDark: `linear-gradient(135deg, ${freshwaterGlacierAlpha[600]} 0%, rgba(0, 94, 120, 0.3) 55%, ${freshwaterGlacierAlpha[0]} 100%)`,
  },
});

// `inlineEmphasis` (freshwater.roles.ts) — plain accent-coloured text, not
// `wash`: a highlighter background sat next to `cardHover`'s own use of `wash`
// with nothing distinguishing "emphasis" from "hovered". `color.accent`, not a
// raw glacier step, so it tracks the theme's accent; clears 4.5:1 text contrast
// against both grounds in both modes (light 4.65:1 / 4.53:1, dark 11.5:1 /
// 10.6:1). No underline — so it can't be mistaken for `Link`.
globalStyle(`${freshwaterLightThemeClass} [data-role="inlineEmphasis"]`, {
  color: vars.color.accent,
});
globalStyle(`${freshwaterDarkThemeClass} [data-role="inlineEmphasis"]`, {
  color: vars.color.accent,
});

// The brand wordmark stays neutral ink even when a mount point decorates it
// with `inlineEmphasis` (the Pearl-only Introduction page does). Freshwater's
// mark is `FRESHWTR_OPS` with an accent underscore alone — the word itself is
// never accent-coloured. Own rule, not a role: `span` qualifier (0,1,1) beats
// the `[data-role="inlineEmphasis"]` rule above.
globalStyle(
  `${freshwaterLightThemeClass} span[data-component="brand-wordmark"], ${freshwaterDarkThemeClass} span[data-component="brand-wordmark"]`,
  { color: vars.color.text },
);

globalStyle(
  `${freshwaterLightThemeClass} [data-component="card"][data-interactive="true"]::after, ${freshwaterDarkThemeClass} [data-component="card"][data-interactive="true"]::after`,
  {
    content: '',
    position: 'absolute',
    inset: 0,
    zIndex: -1,
    background: freshwaterTreatments.wash.gradient,
    opacity: 0,
    pointerEvents: 'none',
    transition: `opacity ${freshwaterTreatments.wash.duration} ${freshwaterTreatments.wash.easing}`,
    '@media': {
      '(prefers-reduced-motion: reduce)': { transition: 'none' },
    },
  },
);

globalStyle(`${freshwaterDarkThemeClass} [data-component="card"][data-interactive="true"]::after`, {
  background: freshwaterTreatments.wash.gradientDark,
});

globalStyle(
  `${freshwaterLightThemeClass} [data-component="card"][data-interactive="true"]:hover::after, ${freshwaterDarkThemeClass} [data-component="card"][data-interactive="true"]:hover::after`,
  {
    opacity: freshwaterTreatments.wash.opacity,
  },
);

/** Static wash over a photographic plate — Tahitian's `overtonePlate`
 * equivalent, stationary: apply as a className to a wrapper around an `<img>`. */
export const washPlate = style({
  position: 'relative',
  overflow: 'hidden',
  isolation: 'isolate',
});

globalStyle(`${washPlate}::after`, {
  content: '',
  position: 'absolute',
  zIndex: 1,
  inset: 0,
  background: freshwaterTreatments.wash.plateGradient,
  pointerEvents: 'none',
});

globalStyle(`${freshwaterDarkThemeClass} ${washPlate}::after`, {
  background: freshwaterTreatments.wash.plateGradientDark,
});

globalStyle(`${washPlate} > img`, {
  display: 'block',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  filter: 'grayscale(1)',
});
