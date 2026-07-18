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

const tahitianLightPrimitives = {
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
  // Sentiment families, shade-suffixed (100 tint / 300 border / 500 icon / 700 text).
  sage100: '#E5EEE7', sage300: '#B7C8B9', sage500: '#3D704F', sage700: '#244D35',
  clay100: '#F3E9E6', clay300: '#DDBDB6', clay500: '#A8483D', clay700: '#7A3028',
  honey100: '#F3EDE0', honey300: '#D8C49D', honey500: '#95742C', honey700: '#6D531F',
  harbor100: '#E7ECEB', harbor300: '#BBC8C5', harbor500: '#52776F', harbor700: '#38534E',
};

const tahitianDarkPrimitives = {
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
  sage100: '#132018', sage300: '#2E5B3E', sage500: '#4CAE68', sage700: '#8FDB9E',
  clay100: '#2A1613', clay300: '#7A362E', clay500: '#E2604F', clay700: '#F3A79C',
  honey100: '#241D0E', honey300: '#6B531C', honey500: '#D6A233', honey700: '#EFCB7C',
  harbor100: '#131C22', harbor300: '#2C4E5C', harbor500: '#4F93AC', harbor700: '#9CC7DA',
};

// ---- Scales (this theme's own — not shared with Freshwater/South Sea) ----

const tahitianRadius = { control: '6px', surface: '10px', full: '9999px' };
const tahitianSpace = { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px', '2xl': '48px' };
const tahitianControlHeight = { sm: '32px', md: '40px', lg: '48px', xl: '56px' };
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
  bodySm: { fontSize: '12px', lineHeight: '16px', fontWeight: '400' },
  bodyMd: { fontSize: '14px', lineHeight: '20px', fontWeight: '400' },
  bodyLg: { fontSize: '16px', lineHeight: '24px', fontWeight: '400' },
  headingSm: { fontSize: '20px', lineHeight: '24px', fontWeight: '600' },
  headingMd: { fontSize: '24px', lineHeight: '30px', fontWeight: '600' },
  headingLg: { fontSize: '36px', lineHeight: '40px', fontWeight: '600' },
  displaySm: { fontSize: '56px', lineHeight: '56px', fontWeight: '600' },
  displayLg: { fontSize: '96px', lineHeight: '88px', fontWeight: '600' },
};

// ---- Semantics (map primitives onto roles) ----

export const tahitianLightThemeClass = createTheme(vars, {
  color: {
    background: tahitianLightPrimitives.pearl,
    surface: tahitianLightPrimitives.chalk,
    overlay: tahitianLightPrimitives.scrim,
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

    accent: tahitianLightPrimitives.aubergine,
    accentHover: tahitianLightPrimitives.aubergineDeep,
    accentSubtle: tahitianLightPrimitives.aubergineMist,
    onAccent: tahitianLightPrimitives.chalk,
    focusRing: tahitianLightPrimitives.aubergine,

    positive: { surface: tahitianLightPrimitives.sage100, border: tahitianLightPrimitives.sage300, text: tahitianLightPrimitives.sage700, icon: tahitianLightPrimitives.sage500 },
    negative: { surface: tahitianLightPrimitives.clay100, border: tahitianLightPrimitives.clay300, text: tahitianLightPrimitives.clay700, icon: tahitianLightPrimitives.clay500 },
    warn: { surface: tahitianLightPrimitives.honey100, border: tahitianLightPrimitives.honey300, text: tahitianLightPrimitives.honey700, icon: tahitianLightPrimitives.honey500 },
    info: { surface: tahitianLightPrimitives.harbor100, border: tahitianLightPrimitives.harbor300, text: tahitianLightPrimitives.harbor700, icon: tahitianLightPrimitives.harbor500 },
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

    accent: tahitianDarkPrimitives.orchid,
    accentHover: tahitianDarkPrimitives.orchidBright,
    accentSubtle: tahitianDarkPrimitives.aubergineDusk,
    onAccent: tahitianDarkPrimitives.aubergineInk,
    focusRing: tahitianDarkPrimitives.orchid,

    positive: { surface: tahitianDarkPrimitives.sage100, border: tahitianDarkPrimitives.sage300, text: tahitianDarkPrimitives.sage700, icon: tahitianDarkPrimitives.sage500 },
    negative: { surface: tahitianDarkPrimitives.clay100, border: tahitianDarkPrimitives.clay300, text: tahitianDarkPrimitives.clay700, icon: tahitianDarkPrimitives.clay500 },
    warn: { surface: tahitianDarkPrimitives.honey100, border: tahitianDarkPrimitives.honey300, text: tahitianDarkPrimitives.honey700, icon: tahitianDarkPrimitives.honey500 },
    info: { surface: tahitianDarkPrimitives.harbor100, border: tahitianDarkPrimitives.harbor300, text: tahitianDarkPrimitives.harbor700, icon: tahitianDarkPrimitives.harbor500 },
  },
  radius: tahitianRadius,
  space: tahitianSpace,
  controlHeight: tahitianControlHeight,
  fontWeight: tahitianFontWeight,
  fontFamily: tahitianFontFamily,
  text: tahitianText,
});
