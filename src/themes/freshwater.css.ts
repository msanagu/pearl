import { createTheme } from '@vanilla-extract/css';
import { vars } from '../theme.css';

/**
 * Freshwater — one of Pearl's three named themes
 * (docs/fable5-handoff-three-themes.md). **Rough sketch, not a final
 * identity** — teal/turquoise accent + Satoshi/Geist typefaces, chosen from
 * the visual-language moodboard as a starting direction; neutrals are still
 * the generic placeholder scale. Replace with real authored values once the
 * Fable 5 visual exploration comes back — file/export names stay stable.
 *
 * Two color tiers (ADR-0005): `*Primitives` are raw named hexes; the
 * `*ThemeClass` calls map them onto semantic roles. Scales are this theme's
 * own — not shared with Tahitian/South Sea (see `theme.css.ts`'s contract
 * comment on the corrected inverse-token model for the `*Inverse` fields).
 */

export const freshwaterLightPrimitives = {
  linen: '#ffffff',
  cloud: '#f4f4f5',
  ink: '#111113',
  slate: '#5b5b60',
  mist: '#e4e4e7',
  fog: '#c8c8cd',
  haze: '#f0f0f2',
  teal: '#0EA5A0',
  tealDeep: '#0B7C79',
  tealMist: '#E3FBF8',
  scrim: 'rgba(17, 17, 19, 0.5)',
};

export const freshwaterDarkPrimitives = {
  abyss: '#0e0e10',
  charcoal: '#1a1a1d',
  moonlight: '#f5f5f7',
  ash: '#a0a0a7',
  shadow: '#2c2c30',
  graphite: '#45454b',
  onyx: '#202024',
  turquoise: '#2DD4C8',
  turquoiseBright: '#5EEAE0',
  tealDusk: '#0F3B38',
  tealInk: '#052E2B',
  scrim: 'rgba(0, 0, 0, 0.6)',
};

// [derived] Sentiment families, one flattened 100 (lightest)→800 (darkest)
// scale per hue, shared by both modes — a step number means the same
// lightness regardless of which theme mode reads it.
export const freshwaterSentiment = {
  lagoon: { 100: '#e8f5ec', 200: '#b7dfc4', 300: '#7ee2a0', 400: '#3fbf6a', 500: '#2e9e4f', 600: '#2f6b41', 700: '#1b5e2b', 800: '#12251a' },
  coral: { 100: '#fdeceb', 200: '#f4b9b4', 300: '#f5a8a0', 400: '#e8574a', 500: '#d64036', 600: '#8f1d17', 700: '#7a2f28', 800: '#2a1513' },
  sunlight: { 100: '#fdf3e2', 200: '#f2d59b', 300: '#f0cd7a', 400: '#e0a52a', 500: '#d9920b', 600: '#6e5316', 700: '#7a4d09', 800: '#28200f' },
  tide: { 100: '#ebf1fe', 200: '#b9ccf7', 300: '#9fc0f5', 400: '#5a8cf0', 500: '#3b6fe0', 600: '#2c4a80', 700: '#1c3a80', 800: '#131d2e' },
};

const freshwaterRadius = { control: '6px', full: '9999px', nesting: '1', cornerShape: 'round' };
// rem, not px (16px root) — spacing/control-height scale with a user's base
// font-size preference, not just page zoom. Same reasoning as pearl.css.ts.
const freshwaterSpace = { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem', '2xl': '3rem' };
const freshwaterControlHeight = { sm: '2rem', md: '2.5rem', lg: '3rem', xl: '3.5rem' };
const freshwaterFontWeight = { regular: '400', medium: '500', semibold: '600', bold: '700' };
// Aspirational — see tahitian.css.ts's note on @font-face. Moodboard refs:
// Satoshi (distinctive geometric display) paired with Geist (clean, everyday
// UI workhorse) — matches Freshwater's approachable, "most people actually
// wear this" register.
const freshwaterFontFamily = {
  display: "'Satoshi', 'Geist', system-ui, -apple-system, sans-serif",
  heading: "'Geist', system-ui, -apple-system, 'Segoe UI', sans-serif",
  body: "'Geist', system-ui, -apple-system, 'Segoe UI', sans-serif",
  mono: "ui-monospace, 'SF Mono', Menlo, monospace",
};
const freshwaterText = {
  caption: { fontSize: '0.6875rem', lineHeight: '1.4545', fontWeight: '400', letterSpacing: '0' }, // 16px 8-grid
  bodySm: { fontSize: '0.75rem', lineHeight: '1.6667', fontWeight: '400', letterSpacing: '0' }, // 20px 4px escape
  bodyMd: { fontSize: '0.875rem', lineHeight: '1.7143', fontWeight: '400', letterSpacing: '0' }, // 24px 8-grid
  bodyLg: { fontSize: '1rem', lineHeight: '1.5', fontWeight: '400', letterSpacing: '0' }, // 24px 8-grid
  headingSm: { fontSize: '1.25rem', lineHeight: '1.2', fontWeight: '600', letterSpacing: '-0.005em' }, // 24px 8-grid
  headingMd: { fontSize: '1.5rem', lineHeight: '1.3333', fontWeight: '600', letterSpacing: '-0.01em' }, // 32px 8-grid
  headingLg: { fontSize: '2rem', lineHeight: '1.25', fontWeight: '600', letterSpacing: '-0.01em' }, // 40px 8-grid
  displaySm: { fontSize: '2.5rem', lineHeight: '1', fontWeight: '700', letterSpacing: '-0.02em' }, // 40px 8-grid
  displayLg: { fontSize: '3.5rem', lineHeight: '1.0714', fontWeight: '700', letterSpacing: '-0.03em' }, // 60px 4px escape
};

export const freshwaterLightThemeClass = createTheme(vars, {
  color: {
    background: freshwaterLightPrimitives.linen,
    surface: freshwaterLightPrimitives.cloud,
    overlay: freshwaterLightPrimitives.scrim,
    // Placeholder — Freshwater doesn't have its own alpha-neutral primitive
    // yet (see pearl.css.ts's `inkAlpha` for the pattern to follow when it does).
    overlaySubtle: 'rgba(0, 0, 0, 0.08)',
    backgroundInverse: freshwaterDarkPrimitives.abyss,
    surfaceInverse: freshwaterDarkPrimitives.charcoal,
    text: freshwaterLightPrimitives.ink,
    textSubtle: freshwaterLightPrimitives.slate,
    textInverse: freshwaterDarkPrimitives.moonlight,
    textInverseSubtle: freshwaterDarkPrimitives.ash,
    border: freshwaterLightPrimitives.mist,
    borderStrong: freshwaterLightPrimitives.fog,
    borderSubtle: freshwaterLightPrimitives.haze,
    borderInverse: freshwaterDarkPrimitives.shadow,
    shadow: freshwaterLightPrimitives.fog,
    // Still a placeholder theme (see file header) — primary passes through
    // to the existing accent fill; no dedicated CTA color authored yet.
    primary: freshwaterLightPrimitives.teal,
    onPrimary: freshwaterLightPrimitives.tealMist,
    accent: freshwaterLightPrimitives.teal,
    accentHover: freshwaterLightPrimitives.tealDeep,
    accentSubtle: freshwaterLightPrimitives.tealMist,
    onAccent: freshwaterLightPrimitives.linen,
    onAccentSubtle: freshwaterLightPrimitives.ink,
    focusRing: freshwaterLightPrimitives.teal,
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
    overlaySubtle: 'rgba(255, 255, 255, 0.10)', // placeholder, see light mode's comment above
    backgroundInverse: freshwaterLightPrimitives.linen,
    surfaceInverse: freshwaterLightPrimitives.cloud,
    text: freshwaterDarkPrimitives.moonlight,
    textSubtle: freshwaterDarkPrimitives.ash,
    textInverse: freshwaterLightPrimitives.ink,
    textInverseSubtle: freshwaterLightPrimitives.slate,
    border: freshwaterDarkPrimitives.shadow,
    borderStrong: freshwaterDarkPrimitives.graphite,
    borderSubtle: freshwaterDarkPrimitives.onyx,
    borderInverse: freshwaterLightPrimitives.mist,
    shadow: freshwaterDarkPrimitives.graphite,
    // Still a placeholder theme (see file header) — primary passes through
    // to the existing accent fill; no dedicated CTA color authored yet.
    primary: freshwaterDarkPrimitives.turquoise,
    onPrimary: freshwaterDarkPrimitives.tealDusk,
    accent: freshwaterDarkPrimitives.turquoise,
    accentHover: freshwaterDarkPrimitives.turquoiseBright,
    accentSubtle: freshwaterDarkPrimitives.tealDusk,
    onAccent: freshwaterDarkPrimitives.tealInk,
    onAccentSubtle: freshwaterDarkPrimitives.moonlight,
    focusRing: freshwaterDarkPrimitives.turquoise,
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
