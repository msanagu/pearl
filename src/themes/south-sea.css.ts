import { createTheme } from '@vanilla-extract/css';
import { vars } from '../theme.css';
// Side-effect import — registers the real Boska @font-face rules.
import '../fonts/boska.css';

/**
 * South Sea — one of Pearl's three named themes
 * (docs/fable5-handoff-three-themes.md). **Rough sketch, not a final
 * identity** — warm gold/amber accent (South Sea pearls are famously golden;
 * deliberately NOT purple, to stay clear of Tahitian's aubergine) for the
 * luxury register; neutrals are still the generic placeholder scale. Replace
 * with real authored values once the Fable 5 visual exploration comes back —
 * file/export names stay stable.
 *
 * Display/heading font is Boska (real files — see boska.css.ts), not an
 * aspirational stack like Tahitian/Freshwater's fonts currently are.
 *
 * Two color tiers (ADR-0005): `*Primitives` are raw named hexes; the
 * `*ThemeClass` calls map them onto semantic roles. Scales are this theme's
 * own — not shared with Tahitian/Freshwater (see `theme.css.ts`'s contract
 * comment on the corrected inverse-token model for the `*Inverse` fields).
 */

export const southSeaLightPrimitives = {
  linen: '#ffffff',
  cloud: '#f4f4f5',
  ink: '#111113',
  slate: '#5b5b60',
  mist: '#e4e4e7',
  fog: '#c8c8cd',
  haze: '#f0f0f2',
  gold: '#B8863F',
  goldDeep: '#8F6529',
  goldMist: '#FBF1DE',
  scrim: 'rgba(17, 17, 19, 0.5)',
};

export const southSeaDarkPrimitives = {
  abyss: '#0e0e10',
  charcoal: '#1a1a1d',
  moonlight: '#f5f5f7',
  ash: '#a0a0a7',
  shadow: '#2c2c30',
  graphite: '#45454b',
  onyx: '#202024',
  amber: '#D9A752',
  amberBright: '#E6BC72',
  goldDusk: '#3A2C14',
  goldInk: '#1A1206',
  scrim: 'rgba(0, 0, 0, 0.6)',
};

// [derived] Sentiment families, one flattened 100 (lightest)→800 (darkest)
// scale per hue, shared by both modes — a step number means the same
// lightness regardless of which theme mode reads it.
export const southSeaSentiment = {
  sage: { 100: '#e8f5ec', 200: '#b7dfc4', 300: '#7ee2a0', 400: '#3fbf6a', 500: '#2e9e4f', 600: '#2f6b41', 700: '#1b5e2b', 800: '#12251a' },
  clay: { 100: '#fdeceb', 200: '#f4b9b4', 300: '#f5a8a0', 400: '#e8574a', 500: '#d64036', 600: '#8f1d17', 700: '#7a2f28', 800: '#2a1513' },
  honey: { 100: '#fdf3e2', 200: '#f2d59b', 300: '#f0cd7a', 400: '#e0a52a', 500: '#d9920b', 600: '#6e5316', 700: '#7a4d09', 800: '#28200f' },
  harbor: { 100: '#ebf1fe', 200: '#b9ccf7', 300: '#9fc0f5', 400: '#5a8cf0', 500: '#3b6fe0', 600: '#2c4a80', 700: '#1c3a80', 800: '#131d2e' },
};

const southSeaRadius = { control: '6px', surface: '10px', full: '9999px' };
const southSeaSpace = { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px', '2xl': '48px' };
const southSeaControlHeight = { sm: '32px', md: '40px', lg: '48px', xl: '56px' };
const southSeaFontWeight = { regular: '400', medium: '500', semibold: '600', bold: '700' };
// Boska is a real, embedded font (boska.css.ts) — display/heading use it
// directly, no fallback-only aspiration. Body stays a clean neutral sans for
// reading text.
const southSeaFontFamily = {
  display: "'Boska', 'Georgia', 'Times New Roman', serif",
  heading: "'Boska', 'Georgia', 'Times New Roman', serif",
  body: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
};
const southSeaText = {
  caption: { fontSize: '0.6875rem', lineHeight: '1.4545', fontWeight: '400', letterSpacing: '0' }, // 16px 8-grid
  bodySm: { fontSize: '0.75rem', lineHeight: '1.6667', fontWeight: '400', letterSpacing: '0' }, // 20px 4px escape
  bodyMd: { fontSize: '0.875rem', lineHeight: '1.7143', fontWeight: '400', letterSpacing: '0' }, // 24px 8-grid
  bodyLg: { fontSize: '1rem', lineHeight: '1.5', fontWeight: '400', letterSpacing: '0' }, // 24px 8-grid
  headingSm: { fontSize: '1.25rem', lineHeight: '1.2', fontWeight: '600', letterSpacing: '-0.01em' }, // 24px 8-grid
  headingMd: { fontSize: '1.5rem', lineHeight: '1.3333', fontWeight: '600', letterSpacing: '-0.015em' }, // 32px 8-grid
  headingLg: { fontSize: '2rem', lineHeight: '1.25', fontWeight: '600', letterSpacing: '-0.02em' }, // 40px 8-grid
  displaySm: { fontSize: '2.5rem', lineHeight: '1', fontWeight: '700', letterSpacing: '-0.02em' }, // 40px 8-grid
  displayLg: { fontSize: '3.5rem', lineHeight: '1.0714', fontWeight: '700', letterSpacing: '-0.02em' }, // 60px 4px escape
};

export const southSeaLightThemeClass = createTheme(vars, {
  color: {
    background: southSeaLightPrimitives.linen,
    surface: southSeaLightPrimitives.cloud,
    overlay: southSeaLightPrimitives.scrim,
    // Placeholder — South Sea doesn't have its own alpha-neutral primitive yet
    // (see pearl.css.ts's `inkAlpha` for the pattern to follow when it does).
    overlaySubtle: 'rgba(0, 0, 0, 0.08)',
    backgroundInverse: southSeaDarkPrimitives.abyss,
    surfaceInverse: southSeaDarkPrimitives.charcoal,
    text: southSeaLightPrimitives.ink,
    textSubtle: southSeaLightPrimitives.slate,
    textInverse: southSeaDarkPrimitives.moonlight,
    textInverseSubtle: southSeaDarkPrimitives.ash,
    border: southSeaLightPrimitives.mist,
    borderStrong: southSeaLightPrimitives.fog,
    borderSubtle: southSeaLightPrimitives.haze,
    borderInverse: southSeaDarkPrimitives.shadow,
    // Still a placeholder theme (see file header) — primary passes through
    // to the existing accent fill; no dedicated CTA color authored yet.
    primary: southSeaLightPrimitives.gold,
    onPrimary: southSeaLightPrimitives.goldMist,
    accent: southSeaLightPrimitives.gold,
    accentHover: southSeaLightPrimitives.goldDeep,
    accentSubtle: southSeaLightPrimitives.goldMist,
    onAccent: southSeaLightPrimitives.linen,
    focusRing: southSeaLightPrimitives.gold,
    positive: { surface: southSeaSentiment.sage[100], border: southSeaSentiment.sage[200], text: southSeaSentiment.sage[700], icon: southSeaSentiment.sage[500] },
    negative: { surface: southSeaSentiment.clay[100], border: southSeaSentiment.clay[200], text: southSeaSentiment.clay[600], icon: southSeaSentiment.clay[500] },
    warn: { surface: southSeaSentiment.honey[100], border: southSeaSentiment.honey[200], text: southSeaSentiment.honey[700], icon: southSeaSentiment.honey[500] },
    info: { surface: southSeaSentiment.harbor[100], border: southSeaSentiment.harbor[200], text: southSeaSentiment.harbor[700], icon: southSeaSentiment.harbor[500] },
  },
  radius: southSeaRadius,
  space: southSeaSpace,
  controlHeight: southSeaControlHeight,
  fontWeight: southSeaFontWeight,
  fontFamily: southSeaFontFamily,
  text: southSeaText,
});

export const southSeaDarkThemeClass = createTheme(vars, {
  color: {
    background: southSeaDarkPrimitives.abyss,
    surface: southSeaDarkPrimitives.charcoal,
    overlay: southSeaDarkPrimitives.scrim,
    overlaySubtle: 'rgba(255, 255, 255, 0.10)', // placeholder, see light mode's comment above
    backgroundInverse: southSeaLightPrimitives.linen,
    surfaceInverse: southSeaLightPrimitives.cloud,
    text: southSeaDarkPrimitives.moonlight,
    textSubtle: southSeaDarkPrimitives.ash,
    textInverse: southSeaLightPrimitives.ink,
    textInverseSubtle: southSeaLightPrimitives.slate,
    border: southSeaDarkPrimitives.shadow,
    borderStrong: southSeaDarkPrimitives.graphite,
    borderSubtle: southSeaDarkPrimitives.onyx,
    borderInverse: southSeaLightPrimitives.mist,
    // Still a placeholder theme (see file header) — primary passes through
    // to the existing accent fill; no dedicated CTA color authored yet.
    primary: southSeaDarkPrimitives.amber,
    onPrimary: southSeaDarkPrimitives.goldDusk,
    accent: southSeaDarkPrimitives.amber,
    accentHover: southSeaDarkPrimitives.amberBright,
    accentSubtle: southSeaDarkPrimitives.goldDusk,
    onAccent: southSeaDarkPrimitives.goldInk,
    focusRing: southSeaDarkPrimitives.amber,
    positive: { surface: southSeaSentiment.sage[800], border: southSeaSentiment.sage[600], text: southSeaSentiment.sage[300], icon: southSeaSentiment.sage[400] },
    negative: { surface: southSeaSentiment.clay[800], border: southSeaSentiment.clay[700], text: southSeaSentiment.clay[300], icon: southSeaSentiment.clay[400] },
    warn: { surface: southSeaSentiment.honey[800], border: southSeaSentiment.honey[600], text: southSeaSentiment.honey[300], icon: southSeaSentiment.honey[400] },
    info: { surface: southSeaSentiment.harbor[800], border: southSeaSentiment.harbor[600], text: southSeaSentiment.harbor[300], icon: southSeaSentiment.harbor[400] },
  },
  radius: southSeaRadius,
  space: southSeaSpace,
  controlHeight: southSeaControlHeight,
  fontWeight: southSeaFontWeight,
  fontFamily: southSeaFontFamily,
  text: southSeaText,
});
