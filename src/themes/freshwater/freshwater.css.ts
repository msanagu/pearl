import { createTheme, globalStyle } from '@vanilla-extract/css';
import { vars } from '../../theme.css';
import { fieldMeta, label as fieldLabel } from '../../components/Field/Field.css';

/**
 * Freshwater — one of Pearl's three named themes
 * (docs/theme/theme-revision-decisions.md §4, source turn **2a, "Ice
 * Console"**). Stark black/white ops-console register: neon ice-blue spent
 * only where the system speaks — statuses, deltas, selection — never as
 * decoration. Radius 0 throughout; a heavy 2px ink rule marks structural
 * divisions (e.g. under a header), a 1px hairline everywhere else.
 *
 * `wash` (see `accentSubtle` below) is deliberately near-white and
 * stationary — it marks a semantic region, not a decorative luster. This
 * replaces an earlier teal/turquoise, 6px-radius placeholder that predated
 * the theme-revision pass.
 *
 * Two color tiers (ADR-0005): `*Primitives` are raw named hexes; the
 * `*ThemeClass` calls map them onto semantic roles. Scales are this theme's
 * own — not shared with Pearl/Tahitian/South Sea.
 */

export const freshwaterLightPrimitives = {
  // Crisp near-white, not literal `#fff` — the console reads as bright, not
  // clinical. `cloud` (surface) sits one step off `paper` (background) so a
  // Card is still legible as its own plane, without the visible gray cast
  // the previous `#f7f7f8` had.
  paper: '#fdfdfd',
  cloud: '#fafafa',
  ink: '#0e0f10',
  slate: '#5b5b60',
  hairline: '#e3e5e7',
  hairlineSubtle: '#eef0f1',
  ice: '#00b8e6',
  // Doc's "ideal" pairing (§4) for hover/pressed feedback — a deeper, less
  // neon step of the same hue rather than a tint.
  iceDeep: '#0089b3',
  // A brighter step of `ice`, for text set on the solid-ink primary fill —
  // `ice` itself is tuned for contrast on `paper`/`cloud`, not on near-black.
  // Same role dark mode's `iceBright` plays, just authored for light mode's
  // ink-fill button rather than a dark ground.
  iceBright: '#5fe1ff',
  // The `wash` tint (§4: "attention stat cell") — near-white, stationary,
  // marks a semantic region. Not a luster; see the file header.
  iceWash: '#e9fbff',
  scrim: 'rgba(14, 15, 16, 0.5)',
};

export const freshwaterDarkPrimitives = {
  abyss: '#0e0f10',
  charcoal: '#17181a',
  paper: '#f5f5f7',
  ash: '#9da1a6',
  graphite: '#2b2d30',
  graphiteSubtle: '#202123',
  iceBright: '#4dd8ff',
  iceDusk: '#062a33',
  scrim: 'rgba(0, 0, 0, 0.6)',
};

// [derived] Sentiment families, one flattened 100 (lightest)→800 (darkest)
// scale per hue, shared by both modes — a step number means the same
// lightness regardless of which theme mode reads it.
export const freshwaterSentiment = {
  // `positive` on brand: a cyan family tuned around the `ice` accent hue
  // (~193°) rather than the generic green every other theme's scale uses —
  // it reads as "the system's own good signal," not a borrowed traffic-light
  // color. Kept a distinct hue from `tide` (info, ~226° indigo-blue) so the
  // two don't collapse into each other.
  lagoon: { 100: '#e3f6fc', 200: '#b9e7f5', 300: '#7dd3ec', 400: '#29b6e0', 500: '#0098c4', 600: '#116e8a', 700: '#0b5468', 800: '#0a222b' },
  coral: { 100: '#fdeceb', 200: '#f4b9b4', 300: '#f5a8a0', 400: '#e8574a', 500: '#d64036', 600: '#8f1d17', 700: '#7a2f28', 800: '#2a1513' },
  sunlight: { 100: '#fdf3e2', 200: '#f2d59b', 300: '#f0cd7a', 400: '#e0a52a', 500: '#d9920b', 600: '#6e5316', 700: '#7a4d09', 800: '#28200f' },
  tide: { 100: '#ebf1fe', 200: '#b9ccf7', 300: '#9fc0f5', 400: '#5a8cf0', 500: '#3b6fe0', 600: '#2c4a80', 700: '#1c3a80', 800: '#131d2e' },
};

// Deliberate deviation from the doc's "radius 0 throughout": a slight 2px
// control radius, so controls read as a hair softer than the console's own
// hard-edged cards/rules — `nesting: '0'` keeps the rest of the geometry
// (cards, panels) flat, this only touches controls.
const freshwaterRadius = { control: '2px', full: '9999px', nesting: '0', cornerShape: 'round' };
// rem, not px (16px root) — spacing/control-height scale with a user's base
// font-size preference, not just page zoom. Same reasoning as pearl.css.ts.
const freshwaterSpace = { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem', '2xl': '3rem' };
const freshwaterControlHeight = { sm: '2rem', md: '2.5rem', lg: '3rem', xl: '3.5rem' };
const freshwaterFontWeight = { regular: '400', medium: '500', semibold: '600', bold: '700' };
// Doc §4: "Space Grotesk (ideal: Söhne Breit) + Azeret Mono (ideal: Söhne
// Mono)." Deviates from the doc's "mono for data only" split: body copy now
// reads in Azeret Mono too, leaning further into the ops-console register —
// Space Grotesk stays reserved for display/heading. Both loaded via
// @fontsource in .storybook/preview.tsx.
export const freshwaterFonts = {
  grotesk: "'Space Grotesk', system-ui, -apple-system, 'Segoe UI', sans-serif",
  mono: "'Azeret Mono', ui-monospace, 'SF Mono', Menlo, monospace",
};
const freshwaterFontFamily = {
  display: freshwaterFonts.grotesk,
  heading: freshwaterFonts.grotesk,
  body: freshwaterFonts.mono,
  mono: freshwaterFonts.mono,
};
// Sizes follow the shared 4px-grid ramp (see pearl.css.ts's pearlText comment
// for the rationale, incl. caption's deliberate 11px escape); weight/tracking
// stay Freshwater's own.
const freshwaterText = {
  caption: { fontSize: '0.6875rem', lineHeight: '1.4545', fontWeight: '400', letterSpacing: '0' }, // 11px floor, 16px 4px-grid line-height
  bodySm: { fontSize: '0.75rem', lineHeight: '1.6667', fontWeight: '400', letterSpacing: '0' }, // 20px 4px grid
  bodyMd: { fontSize: '1rem', lineHeight: '1.5', fontWeight: '400', letterSpacing: '0' }, // 24px 4px grid
  bodyLg: { fontSize: '1.5rem', lineHeight: '1.5', fontWeight: '400', letterSpacing: '0' }, // 36px 4px grid
  headingSm: { fontSize: '2rem', lineHeight: '1.25', fontWeight: '600', letterSpacing: '-0.005em' }, // 40px 4px grid
  headingMd: { fontSize: '2.5rem', lineHeight: '1.2', fontWeight: '600', letterSpacing: '-0.01em' }, // 48px 4px grid
  headingLg: { fontSize: '3.5rem', lineHeight: '1.142857', fontWeight: '600', letterSpacing: '-0.01em' }, // 64px 4px grid
  displaySm: { fontSize: '4.5rem', lineHeight: '1.056', fontWeight: '700', letterSpacing: '-0.02em' }, // 76px 4px grid
  displayLg: { fontSize: '7rem', lineHeight: '1.071429', fontWeight: '700', letterSpacing: '-0.03em' }, // 120px 4px grid
  displayXl: { fontSize: '9.5rem', lineHeight: '1.052632', fontWeight: '700', letterSpacing: '-0.035em' }, // 160px 4px grid
};

export const freshwaterLightThemeClass = createTheme(vars, {
  color: {
    background: freshwaterLightPrimitives.paper,
    surface: freshwaterLightPrimitives.cloud,
    overlay: freshwaterLightPrimitives.scrim,
    overlaySubtle: 'rgba(14, 15, 16, 0.08)',
    backgroundInverse: freshwaterDarkPrimitives.abyss,
    surfaceInverse: freshwaterDarkPrimitives.charcoal,
    text: freshwaterLightPrimitives.ink,
    textSubtle: freshwaterLightPrimitives.slate,
    textInverse: freshwaterDarkPrimitives.paper,
    textInverseSubtle: freshwaterDarkPrimitives.ash,
    border: freshwaterLightPrimitives.hairline,
    // The doc's heavy "2px solid #0E0F10" structural rule — full ink, not a
    // lifted neutral step.
    borderStrong: freshwaterLightPrimitives.ink,
    borderSubtle: freshwaterLightPrimitives.hairlineSubtle,
    borderInverse: freshwaterDarkPrimitives.graphite,
    shadow: freshwaterLightPrimitives.hairline,
    // Doc §4 Geometry: "Solid-ink primary (#0E0F10, white text), outlined
    // secondary." Primary is the console's own ink, not the ice accent —
    // ice is spent only where the system speaks (statuses, deltas,
    // selection), never as a CTA fill.
    primary: freshwaterLightPrimitives.ink,
    onPrimary: freshwaterLightPrimitives.paper,
    accent: freshwaterLightPrimitives.ice,
    accentHover: freshwaterLightPrimitives.iceDeep,
    accentSubtle: freshwaterLightPrimitives.iceWash,
    onAccent: freshwaterLightPrimitives.ink,
    onAccentSubtle: freshwaterLightPrimitives.ink,
    focusRing: freshwaterLightPrimitives.ice,
    // `icon` is toned down toward `textSubtle` via `color-mix` — the raw
    // sentiment hue at full strength reads as more visually prominent than
    // body text despite having a lower luminance-contrast ratio (saturation,
    // not just lightness, drives perceived prominence); 65% keeps the hue
    // identifiable while quieting it below both `text` and plain body copy.
    positive: { surface: freshwaterSentiment.lagoon[100], border: freshwaterSentiment.lagoon[200], text: freshwaterSentiment.lagoon[700], icon: `color-mix(in srgb, ${freshwaterSentiment.lagoon[500]} 65%, ${vars.color.textSubtle})` },
    negative: { surface: freshwaterSentiment.coral[100], border: freshwaterSentiment.coral[200], text: freshwaterSentiment.coral[600], icon: `color-mix(in srgb, ${freshwaterSentiment.coral[500]} 65%, ${vars.color.textSubtle})` },
    warn: { surface: freshwaterSentiment.sunlight[100], border: freshwaterSentiment.sunlight[200], text: freshwaterSentiment.sunlight[700], icon: `color-mix(in srgb, ${freshwaterSentiment.sunlight[500]} 65%, ${vars.color.textSubtle})` },
    info: { surface: freshwaterSentiment.tide[100], border: freshwaterSentiment.tide[200], text: freshwaterSentiment.tide[700], icon: `color-mix(in srgb, ${freshwaterSentiment.tide[500]} 65%, ${vars.color.textSubtle})` },
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
    background: freshwaterDarkPrimitives.abyss,
    surface: freshwaterDarkPrimitives.charcoal,
    overlay: freshwaterDarkPrimitives.scrim,
    overlaySubtle: 'rgba(255, 255, 255, 0.10)',
    backgroundInverse: freshwaterLightPrimitives.paper,
    surfaceInverse: freshwaterLightPrimitives.cloud,
    text: freshwaterDarkPrimitives.paper,
    textSubtle: freshwaterDarkPrimitives.ash,
    textInverse: freshwaterLightPrimitives.ink,
    textInverseSubtle: freshwaterLightPrimitives.slate,
    border: freshwaterDarkPrimitives.graphite,
    // Structural rule inverts too — full paper-white against the dark
    // ground, the same "full ink" idea the light mode's rule carries.
    borderStrong: freshwaterDarkPrimitives.paper,
    borderSubtle: freshwaterDarkPrimitives.graphiteSubtle,
    borderInverse: freshwaterLightPrimitives.hairline,
    shadow: freshwaterDarkPrimitives.graphite,
    // Solid-ink primary flips with the ground: dark mode's "ink" fill is the
    // paper-white step, set against near-black text — same B/W-console
    // identity, inverted.
    primary: freshwaterDarkPrimitives.paper,
    onPrimary: freshwaterDarkPrimitives.abyss,
    accent: freshwaterDarkPrimitives.iceBright,
    accentHover: freshwaterLightPrimitives.ice,
    accentSubtle: freshwaterDarkPrimitives.iceDusk,
    onAccent: freshwaterDarkPrimitives.abyss,
    onAccentSubtle: freshwaterDarkPrimitives.paper,
    focusRing: freshwaterDarkPrimitives.iceBright,
    positive: { surface: freshwaterSentiment.lagoon[800], border: freshwaterSentiment.lagoon[600], text: freshwaterSentiment.lagoon[300], icon: `color-mix(in srgb, ${freshwaterSentiment.lagoon[400]} 65%, ${vars.color.textSubtle})` },
    negative: { surface: freshwaterSentiment.coral[800], border: freshwaterSentiment.coral[700], text: freshwaterSentiment.coral[300], icon: `color-mix(in srgb, ${freshwaterSentiment.coral[400]} 65%, ${vars.color.textSubtle})` },
    warn: { surface: freshwaterSentiment.sunlight[800], border: freshwaterSentiment.sunlight[600], text: freshwaterSentiment.sunlight[300], icon: `color-mix(in srgb, ${freshwaterSentiment.sunlight[400]} 65%, ${vars.color.textSubtle})` },
    info: { surface: freshwaterSentiment.tide[800], border: freshwaterSentiment.tide[600], text: freshwaterSentiment.tide[300], icon: `color-mix(in srgb, ${freshwaterSentiment.tide[400]} 65%, ${vars.color.textSubtle})` },
  },
  radius: freshwaterRadius,
  space: freshwaterSpace,
  controlHeight: freshwaterControlHeight,
  fontWeight: freshwaterFontWeight,
  fontFamily: freshwaterFontFamily,
  text: freshwaterText,
});

// The primary CTA's console-readout register — caps label in both modes.
globalStyle(
  `${freshwaterLightThemeClass} [data-component="button"][data-variant="primary"], ${freshwaterDarkThemeClass} [data-component="button"][data-variant="primary"]`,
  { textTransform: 'uppercase' },
);

// Light mode's primary fill is solid ink — `iceBright` (tuned for contrast
// on near-black) reads clean there, matching the reference mockup's button
// text. Dark mode's primary fill inverts to paper-white (see
// `freshwaterDarkThemeClass.color.primary` above), where this same bright
// cyan would fail contrast, so it keeps its default near-black `onPrimary`
// text instead of an accent override.
globalStyle(`${freshwaterLightThemeClass} [data-component="button"][data-variant="primary"]`, {
  color: freshwaterLightPrimitives.iceBright,
});

// The shared Button recipe's canon primary carries an `inset 0 1px 0
// accentSubtle` top-highlight, sized for Pearl's near-fill-hued
// `accentSubtle`. Freshwater's is a bright wash instead (`iceWash`/
// `iceDusk`) — miles lighter than the solid-ink/paper-white fill — so that
// same inset reads as a stark seam across the top edge, not a sheen. The
// doc's own geometry rules this out anyway ("No offset shadows — those
// belong to 6a, a different flavor"), so it's dropped entirely rather than
// re-tuned; a background hue-shift carries hover/press feedback instead,
// same technique Pearl and Tahitian use for their own flat fills.
globalStyle(
  `${freshwaterLightThemeClass} [data-component="button"][data-variant="primary"], ${freshwaterDarkThemeClass} [data-component="button"][data-variant="primary"]`,
  { boxShadow: 'none' },
);
globalStyle(
  [
    `${freshwaterLightThemeClass} [data-component="button"][data-variant="primary"]:not(:disabled):hover`,
    `${freshwaterDarkThemeClass} [data-component="button"][data-variant="primary"]:not(:disabled):hover`,
  ].join(', '),
  {
    // The base recipe's own `:hover` rule (translateY lift + drop shadow)
    // outranks this file's plain resting `boxShadow: none` once `:hover`
    // matches — needs restating here, not just at rest.
    backgroundColor: `color-mix(in srgb, ${vars.color.primary} 85%, ${vars.color.accent})`,
    boxShadow: 'none',
    transform: 'none',
  },
);

// Input's resting border reads too quiet against the console's hard-edged
// register at the shared `color.border` hairline — `color.text` (near-black
// in light, near-white in dark) gives it the same weight as the labels
// sitting next to it.
globalStyle(
  `${freshwaterLightThemeClass} [data-component="input"], ${freshwaterDarkThemeClass} [data-component="input"]`,
  { borderColor: vars.color.text },
);

// Button text a step down from the base recipe's `bodyMd` — the console's
// buttons read as compact controls, not headline-weight CTAs.
globalStyle(
  `${freshwaterLightThemeClass} [data-component="button"], ${freshwaterDarkThemeClass} [data-component="button"]`,
  { fontSize: vars.text.bodySm.fontSize },
);

// Preheading role + Field's label: subtle mono caps, the console's own
// metadata idiom (same technique Tahitian uses for its Field label — see
// tahitian.css.ts, and the `fieldMeta`/`label` hook Field.css.ts documents
// for exactly this). `textSubtle`, not the label's own default `color.text`,
// because a mono-caps readout should recede behind the value it labels, not
// compete with it.
globalStyle(
  `${freshwaterLightThemeClass} [data-role="preheading"], ${freshwaterDarkThemeClass} [data-role="preheading"]`,
  {
    fontFamily: vars.fontFamily.mono,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: vars.color.textSubtle,
  },
);
globalStyle(
  [
    `${freshwaterLightThemeClass} .${fieldMeta} .${fieldLabel}`,
    `${freshwaterDarkThemeClass} .${fieldMeta} .${fieldLabel}`,
  ].join(', '),
  {
    fontFamily: vars.fontFamily.mono,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: vars.color.textSubtle,
  },
);

// `headingSm` and `displayLg` only, not the full heading→display range
// Tahitian uppercases (see tahitian.css.ts) — Freshwater's console register
// is restrained ("neon ice-blue only where the system speaks," docs/theme/
// theme-revision-decisions.md §4), not poster-scale maximalism everywhere.
// `displaySm` (stat figures, numerals) is excluded on purpose: caps is a
// no-op on digits, so uppercasing it would do nothing for the numbers that
// scale actually carries. `displayLg` is where real statement headlines
// land, and `headingSm` is the console's own section-label register — those
// are the two worth the console shouting.
globalStyle(
  [
    `${freshwaterLightThemeClass} [data-type-scale="headingSm"]`,
    `${freshwaterDarkThemeClass} [data-type-scale="headingSm"]`,
    `${freshwaterLightThemeClass} [data-type-scale="displayLg"]`,
    `${freshwaterDarkThemeClass} [data-type-scale="displayLg"]`,
  ].join(', '),
  { textTransform: 'uppercase' },
);
