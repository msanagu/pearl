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

const freshwaterLightPrimitives = {
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
  sage100: '#e8f5ec', sage300: '#b7dfc4', sage500: '#2e9e4f', sage700: '#1b5e2b',
  clay100: '#fdeceb', clay300: '#f4b9b4', clay500: '#d64036', clay700: '#8f1d17',
  honey100: '#fdf3e2', honey300: '#f2d59b', honey500: '#d9920b', honey700: '#7a4d09',
  harbor100: '#ebf1fe', harbor300: '#b9ccf7', harbor500: '#3b6fe0', harbor700: '#1c3a80',
};

const freshwaterDarkPrimitives = {
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
  sage100: '#12251a', sage300: '#2f6b41', sage500: '#3fbf6a', sage700: '#7ee2a0',
  clay100: '#2a1513', clay300: '#7a2f28', clay500: '#e8574a', clay700: '#f5a8a0',
  honey100: '#28200f', honey300: '#6e5316', honey500: '#e0a52a', honey700: '#f0cd7a',
  harbor100: '#131d2e', harbor300: '#2c4a80', harbor500: '#5a8cf0', harbor700: '#9fc0f5',
};

const freshwaterRadius = { control: '6px', surface: '10px', full: '9999px' };
const freshwaterSpace = { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px', '2xl': '48px' };
const freshwaterControlHeight = { sm: '32px', md: '40px', lg: '48px', xl: '56px' };
const freshwaterFontWeight = { regular: '400', medium: '500', semibold: '600', bold: '700' };
// Aspirational — see tahitian.css.ts's note on @font-face. Moodboard refs:
// Satoshi (distinctive geometric display) paired with Geist (clean, everyday
// UI workhorse) — matches Freshwater's approachable, "most people actually
// wear this" register.
const freshwaterFontFamily = {
  display: "'Satoshi', 'Geist', system-ui, -apple-system, sans-serif",
  heading: "'Geist', system-ui, -apple-system, 'Segoe UI', sans-serif",
  body: "'Geist', system-ui, -apple-system, 'Segoe UI', sans-serif",
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
    // Still a placeholder theme (see file header) — primary passes through
    // to the existing accent fill; no dedicated CTA color authored yet.
    primary: freshwaterLightPrimitives.teal,
    onPrimary: freshwaterLightPrimitives.tealMist,
    accent: freshwaterLightPrimitives.teal,
    accentHover: freshwaterLightPrimitives.tealDeep,
    accentSubtle: freshwaterLightPrimitives.tealMist,
    onAccent: freshwaterLightPrimitives.linen,
    focusRing: freshwaterLightPrimitives.teal,
    positive: { surface: freshwaterLightPrimitives.sage100, border: freshwaterLightPrimitives.sage300, text: freshwaterLightPrimitives.sage700, icon: freshwaterLightPrimitives.sage500 },
    negative: { surface: freshwaterLightPrimitives.clay100, border: freshwaterLightPrimitives.clay300, text: freshwaterLightPrimitives.clay700, icon: freshwaterLightPrimitives.clay500 },
    warn: { surface: freshwaterLightPrimitives.honey100, border: freshwaterLightPrimitives.honey300, text: freshwaterLightPrimitives.honey700, icon: freshwaterLightPrimitives.honey500 },
    info: { surface: freshwaterLightPrimitives.harbor100, border: freshwaterLightPrimitives.harbor300, text: freshwaterLightPrimitives.harbor700, icon: freshwaterLightPrimitives.harbor500 },
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
    // Still a placeholder theme (see file header) — primary passes through
    // to the existing accent fill; no dedicated CTA color authored yet.
    primary: freshwaterDarkPrimitives.turquoise,
    onPrimary: freshwaterDarkPrimitives.tealDusk,
    accent: freshwaterDarkPrimitives.turquoise,
    accentHover: freshwaterDarkPrimitives.turquoiseBright,
    accentSubtle: freshwaterDarkPrimitives.tealDusk,
    onAccent: freshwaterDarkPrimitives.tealInk,
    focusRing: freshwaterDarkPrimitives.turquoise,
    positive: { surface: freshwaterDarkPrimitives.sage100, border: freshwaterDarkPrimitives.sage300, text: freshwaterDarkPrimitives.sage700, icon: freshwaterDarkPrimitives.sage500 },
    negative: { surface: freshwaterDarkPrimitives.clay100, border: freshwaterDarkPrimitives.clay300, text: freshwaterDarkPrimitives.clay700, icon: freshwaterDarkPrimitives.clay500 },
    warn: { surface: freshwaterDarkPrimitives.honey100, border: freshwaterDarkPrimitives.honey300, text: freshwaterDarkPrimitives.honey700, icon: freshwaterDarkPrimitives.honey500 },
    info: { surface: freshwaterDarkPrimitives.harbor100, border: freshwaterDarkPrimitives.harbor300, text: freshwaterDarkPrimitives.harbor700, icon: freshwaterDarkPrimitives.harbor500 },
  },
  radius: freshwaterRadius,
  space: freshwaterSpace,
  controlHeight: freshwaterControlHeight,
  fontWeight: freshwaterFontWeight,
  fontFamily: freshwaterFontFamily,
  text: freshwaterText,
});
