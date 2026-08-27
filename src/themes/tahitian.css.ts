import { createTheme } from '@vanilla-extract/css';
import { vars } from '../theme.css';

/**
 * Tahitian — one of Pearl's three named themes (docs/fable5-handoff-three-themes.md).
 * The flagship: dark is the default first render (`.storybook/preview.tsx`).
 *
 * **Both light and dark are still PLACEHOLDER drafts** pending the Fable 5
 * visual exploration — this file gets replaced with real authored values once
 * that comes back; file/export names stay stable.
 *
 * ## Two color tiers (ADR-0005)
 * `*Primitives` below are raw, named hexes — named by what they ARE (a real
 * color name), never by what they're for. `*ThemeClass` maps those primitives
 * onto semantic roles. Two primitive objects, one per mode — NOT because tiers
 * are per-mode in general, but because Tahitian's light and dark are
 * independently authored palettes (see below) with no shared hex between them.
 *
 * ## No shared scales.ts
 * Every non-color scale (radius/space/controlHeight/fontWeight/fontFamily/
 * text) is defined HERE, scoped to Tahitian alone — themes do not share a
 * global scale file. Each theme owns its full identity, including density and
 * type, not just color.
 *
 * ## Independent modes, mirrored inverse (theme.css.ts's contract comment)
 * Light and dark are fully independent palettes — dark is never derived from
 * light. Each mode's five `*Inverse` fields instead reference the OTHER
 * mode's real primitives directly (see the `tahitianDarkPrimitives.abyss`
 * references below) — not a copy, an actual reference, so they can never
 * silently drift out of sync.
 */

// ---- Primitives (raw, named hexes) ----

export const tahitianLightPrimitives = {
  pearl: '#ECEEEA', // base surface — soft warm off-white
  chalk: '#FAFAF7', // raised surface / onAccent
  ink: '#222422', // primary text
  slate: '#6B6E69', // subtle text
  mist: '#C9CDC8', // border
  fog: '#AEB3AD', // border strong
  cloud: '#E1E3DF', // border subtle
  aubergine: '#624C5D', // accent
  aubergineDeep: '#4E3C4A', // accent hover
  aubergineMist: '#E9E1E7', // accent tint
  scrim: 'rgba(24, 26, 25, 0.56)',
};

export const tahitianDarkPrimitives = {
  abyss: '#0E0E10', // base surface — near-black
  charcoal: '#1A1A1D', // raised surface
  moonlight: '#F5F5F7', // primary text
  ash: '#A0A0A7', // subtle text
  shadow: '#2C2C30', // border
  graphite: '#45454B', // border strong
  onyx: '#202024', // border subtle
  orchid: '#8C6E86', // accent — aubergine lifted for dark bg
  orchidBright: '#A588A0', // accent hover
  aubergineDusk: '#2A2230', // accent tint
  aubergineInk: '#14111A', // text/icon on accent
  scrim: 'rgba(0, 0, 0, 0.6)',
};

// Sentiment families, one flattened 100 (lightest)→800 (darkest) scale per
// hue, shared by both modes — a step number means the same lightness
// regardless of which theme mode reads it.
export const tahitianSentiment = {
  sage: { 100: '#E5EEE7', 200: '#8FDB9E', 300: '#B7C8B9', 400: '#4CAE68', 500: '#3D704F', 600: '#2E5B3E', 700: '#244D35', 800: '#132018' },
  clay: { 100: '#F3E9E6', 200: '#DDBDB6', 300: '#F3A79C', 400: '#E2604F', 500: '#A8483D', 600: '#7A362E', 700: '#7A3028', 800: '#2A1613' },
  honey: { 100: '#F3EDE0', 200: '#EFCB7C', 300: '#D8C49D', 400: '#D6A233', 500: '#95742C', 600: '#6D531F', 700: '#6B531C', 800: '#241D0E' },
  harbor: { 100: '#E7ECEB', 200: '#BBC8C5', 300: '#9CC7DA', 400: '#4F93AC', 500: '#52776F', 600: '#38534E', 700: '#2C4E5C', 800: '#131C22' },
};

// ---- Scales (this theme's own — not shared with Freshwater/South Sea) ----

const tahitianRadius = { control: '6px', surface: '10px', full: '9999px' };
// rem, not px (16px root) — spacing/control-height scale with a user's base
// font-size preference, not just page zoom. Same reasoning as pearl.css.ts.
const tahitianSpace = { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem', '2xl': '3rem' };
const tahitianControlHeight = { sm: '2rem', md: '2.5rem', lg: '3rem', xl: '3.5rem' };
const tahitianFontWeight = { regular: '400', medium: '500', semibold: '600', bold: '700' };

// Aspirational — these named faces aren't embedded via @font-face yet, so the
// browser falls back to the trailing stack until real font files are wired
// in; the primary names document the intended identity (moodboard refs:
// Druk for bold condensed display, Neue Montreal for UI text).
const tahitianFontFamily = {
  display: "'Druk', 'Helvetica Neue', Arial, sans-serif",
  heading: "'Neue Montreal', 'Helvetica Neue', Arial, sans-serif",
  body: "'Neue Montreal', system-ui, -apple-system, 'Segoe UI', sans-serif",
};

const tahitianText = {
  caption: { fontSize: '0.6875rem', lineHeight: '1.4545', fontWeight: '400', letterSpacing: '0' }, // 16px 8-grid
  bodySm: { fontSize: '0.75rem', lineHeight: '1.6667', fontWeight: '400', letterSpacing: '0' }, // 20px 4px escape
  bodyMd: { fontSize: '0.875rem', lineHeight: '1.7143', fontWeight: '400', letterSpacing: '0' }, // 24px 8-grid
  bodyLg: { fontSize: '1rem', lineHeight: '1.5', fontWeight: '400', letterSpacing: '0' }, // 24px 8-grid
  headingSm: { fontSize: '1.25rem', lineHeight: '1.2', fontWeight: '600', letterSpacing: '0' }, // 24px 8-grid
  headingMd: { fontSize: '1.5rem', lineHeight: '1.3333', fontWeight: '600', letterSpacing: '0' }, // 32px 8-grid
  headingLg: { fontSize: '2.25rem', lineHeight: '1.2222', fontWeight: '600', letterSpacing: '0.004em' }, // 44px 4px escape
  displaySm: { fontSize: '3.5rem', lineHeight: '1.0714', fontWeight: '600', letterSpacing: '0.004em' }, // 60px 4px escape
  displayLg: { fontSize: '6rem', lineHeight: '1.0417', fontWeight: '600', letterSpacing: '0.004em' }, // 100px 4px escape
};

// ---- Semantics (map primitives onto roles) ----

export const tahitianLightThemeClass = createTheme(vars, {
  color: {
    background: tahitianLightPrimitives.pearl,
    surface: tahitianLightPrimitives.chalk,
    overlay: tahitianLightPrimitives.scrim,
    // Placeholder — Tahitian doesn't have its own alpha-neutral primitive yet
    // (see pearl.css.ts's `inkAlpha` for the pattern to follow when it does).
    overlaySubtle: 'rgba(0, 0, 0, 0.08)',
    // References the DARK mode's real primitives directly — can't drift.
    backgroundInverse: tahitianDarkPrimitives.abyss,
    surfaceInverse: tahitianDarkPrimitives.charcoal,

    text: tahitianLightPrimitives.ink,
    textSubtle: tahitianLightPrimitives.slate,
    textInverse: tahitianDarkPrimitives.moonlight,
    textInverseSubtle: tahitianDarkPrimitives.ash,

    border: tahitianLightPrimitives.mist,
    borderStrong: tahitianLightPrimitives.fog,
    borderSubtle: tahitianLightPrimitives.cloud,
    borderInverse: tahitianDarkPrimitives.shadow,

    // Still a placeholder theme (see file header) — primary passes through
    // to the existing accent fill; no dedicated CTA color authored yet.
    primary: tahitianLightPrimitives.aubergine,
    onPrimary: tahitianLightPrimitives.aubergineMist,
    accent: tahitianLightPrimitives.aubergine,
    accentHover: tahitianLightPrimitives.aubergineDeep,
    accentSubtle: tahitianLightPrimitives.aubergineMist,
    onAccent: tahitianLightPrimitives.chalk,
    focusRing: tahitianLightPrimitives.aubergine,

    positive: { surface: tahitianSentiment.sage[100], border: tahitianSentiment.sage[300], text: tahitianSentiment.sage[700], icon: tahitianSentiment.sage[500] },
    negative: { surface: tahitianSentiment.clay[100], border: tahitianSentiment.clay[200], text: tahitianSentiment.clay[700], icon: tahitianSentiment.clay[500] },
    warn: { surface: tahitianSentiment.honey[100], border: tahitianSentiment.honey[300], text: tahitianSentiment.honey[600], icon: tahitianSentiment.honey[500] },
    info: { surface: tahitianSentiment.harbor[100], border: tahitianSentiment.harbor[200], text: tahitianSentiment.harbor[600], icon: tahitianSentiment.harbor[500] },
  },
  radius: tahitianRadius,
  space: tahitianSpace,
  controlHeight: tahitianControlHeight,
  fontWeight: tahitianFontWeight,
  fontFamily: tahitianFontFamily,
  text: tahitianText,
});

export const tahitianDarkThemeClass = createTheme(vars, {
  color: {
    background: tahitianDarkPrimitives.abyss,
    surface: tahitianDarkPrimitives.charcoal,
    overlay: tahitianDarkPrimitives.scrim,
    overlaySubtle: 'rgba(255, 255, 255, 0.10)', // placeholder, see light mode's comment above
    // References the LIGHT mode's real primitives directly — can't drift.
    backgroundInverse: tahitianLightPrimitives.pearl,
    surfaceInverse: tahitianLightPrimitives.chalk,

    text: tahitianDarkPrimitives.moonlight,
    textSubtle: tahitianDarkPrimitives.ash,
    textInverse: tahitianLightPrimitives.ink,
    textInverseSubtle: tahitianLightPrimitives.slate,

    border: tahitianDarkPrimitives.shadow,
    borderStrong: tahitianDarkPrimitives.graphite,
    borderSubtle: tahitianDarkPrimitives.onyx,
    borderInverse: tahitianLightPrimitives.mist,

    // Still a placeholder theme (see file header) — primary passes through
    // to the existing accent fill; no dedicated CTA color authored yet.
    primary: tahitianDarkPrimitives.orchid,
    onPrimary: tahitianDarkPrimitives.aubergineDusk,
    accent: tahitianDarkPrimitives.orchid,
    accentHover: tahitianDarkPrimitives.orchidBright,
    accentSubtle: tahitianDarkPrimitives.aubergineDusk,
    onAccent: tahitianDarkPrimitives.aubergineInk,
    focusRing: tahitianDarkPrimitives.orchid,

    positive: { surface: tahitianSentiment.sage[800], border: tahitianSentiment.sage[600], text: tahitianSentiment.sage[200], icon: tahitianSentiment.sage[400] },
    negative: { surface: tahitianSentiment.clay[800], border: tahitianSentiment.clay[600], text: tahitianSentiment.clay[300], icon: tahitianSentiment.clay[400] },
    warn: { surface: tahitianSentiment.honey[800], border: tahitianSentiment.honey[700], text: tahitianSentiment.honey[200], icon: tahitianSentiment.honey[400] },
    info: { surface: tahitianSentiment.harbor[800], border: tahitianSentiment.harbor[700], text: tahitianSentiment.harbor[300], icon: tahitianSentiment.harbor[400] },
  },
  radius: tahitianRadius,
  space: tahitianSpace,
  controlHeight: tahitianControlHeight,
  fontWeight: tahitianFontWeight,
  fontFamily: tahitianFontFamily,
  text: tahitianText,
});
