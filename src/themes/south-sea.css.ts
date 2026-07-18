import { createTheme } from '@vanilla-extract/css';
import { vars } from '../theme.css';
// Side-effect import — registers the real Boska @font-face rules.
import './boska.css';

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

const southSeaLightPrimitives = {
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
  sage100: '#e8f5ec', sage300: '#b7dfc4', sage500: '#2e9e4f', sage700: '#1b5e2b',
  clay100: '#fdeceb', clay300: '#f4b9b4', clay500: '#d64036', clay700: '#8f1d17',
  honey100: '#fdf3e2', honey300: '#f2d59b', honey500: '#d9920b', honey700: '#7a4d09',
  harbor100: '#ebf1fe', harbor300: '#b9ccf7', harbor500: '#3b6fe0', harbor700: '#1c3a80',
};

const southSeaDarkPrimitives = {
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
  sage100: '#12251a', sage300: '#2f6b41', sage500: '#3fbf6a', sage700: '#7ee2a0',
  clay100: '#2a1513', clay300: '#7a2f28', clay500: '#e8574a', clay700: '#f5a8a0',
  honey100: '#28200f', honey300: '#6e5316', honey500: '#e0a52a', honey700: '#f0cd7a',
  harbor100: '#131d2e', harbor300: '#2c4a80', harbor500: '#5a8cf0', harbor700: '#9fc0f5',
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
  bodySm: { fontSize: '12px', lineHeight: '16px', fontWeight: '400' },
  bodyMd: { fontSize: '14px', lineHeight: '20px', fontWeight: '400' },
  bodyLg: { fontSize: '16px', lineHeight: '24px', fontWeight: '400' },
  headingSm: { fontSize: '20px', lineHeight: '24px', fontWeight: '600' },
  headingMd: { fontSize: '24px', lineHeight: '32px', fontWeight: '600' },
  headingLg: { fontSize: '32px', lineHeight: '40px', fontWeight: '600' },
  displaySm: { fontSize: '40px', lineHeight: '48px', fontWeight: '700' },
  displayLg: { fontSize: '56px', lineHeight: '64px', fontWeight: '700' },
};

export const southSeaLightThemeClass = createTheme(vars, {
  color: {
    background: southSeaLightPrimitives.linen,
    surface: southSeaLightPrimitives.cloud,
    overlay: southSeaLightPrimitives.scrim,
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
    accent: southSeaLightPrimitives.gold,
    accentHover: southSeaLightPrimitives.goldDeep,
    accentSubtle: southSeaLightPrimitives.goldMist,
    onAccent: southSeaLightPrimitives.linen,
    focusRing: southSeaLightPrimitives.gold,
    positive: { surface: southSeaLightPrimitives.sage100, border: southSeaLightPrimitives.sage300, text: southSeaLightPrimitives.sage700, icon: southSeaLightPrimitives.sage500 },
    negative: { surface: southSeaLightPrimitives.clay100, border: southSeaLightPrimitives.clay300, text: southSeaLightPrimitives.clay700, icon: southSeaLightPrimitives.clay500 },
    warn: { surface: southSeaLightPrimitives.honey100, border: southSeaLightPrimitives.honey300, text: southSeaLightPrimitives.honey700, icon: southSeaLightPrimitives.honey500 },
    info: { surface: southSeaLightPrimitives.harbor100, border: southSeaLightPrimitives.harbor300, text: southSeaLightPrimitives.harbor700, icon: southSeaLightPrimitives.harbor500 },
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
    accent: southSeaDarkPrimitives.amber,
    accentHover: southSeaDarkPrimitives.amberBright,
    accentSubtle: southSeaDarkPrimitives.goldDusk,
    onAccent: southSeaDarkPrimitives.goldInk,
    focusRing: southSeaDarkPrimitives.amber,
    positive: { surface: southSeaDarkPrimitives.sage100, border: southSeaDarkPrimitives.sage300, text: southSeaDarkPrimitives.sage700, icon: southSeaDarkPrimitives.sage500 },
    negative: { surface: southSeaDarkPrimitives.clay100, border: southSeaDarkPrimitives.clay300, text: southSeaDarkPrimitives.clay700, icon: southSeaDarkPrimitives.clay500 },
    warn: { surface: southSeaDarkPrimitives.honey100, border: southSeaDarkPrimitives.honey300, text: southSeaDarkPrimitives.honey700, icon: southSeaDarkPrimitives.honey500 },
    info: { surface: southSeaDarkPrimitives.harbor100, border: southSeaDarkPrimitives.harbor300, text: southSeaDarkPrimitives.harbor700, icon: southSeaDarkPrimitives.harbor500 },
  },
  radius: southSeaRadius,
  space: southSeaSpace,
  controlHeight: southSeaControlHeight,
  fontWeight: southSeaFontWeight,
  fontFamily: southSeaFontFamily,
  text: southSeaText,
});
