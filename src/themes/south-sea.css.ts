import { createTheme } from '@vanilla-extract/css';
import { vars } from '../theme.css';

/**
 * South Sea — "Golden Hour Maison" (docs/theme/theme-revision-decisions.md
 * §5). Sources: turn **1g** (flagship) → **3c** ("Atelier Detail") →
 * **11a/11b** (conch/chocolate light + dark) → **13a** (footer).
 *
 * Flat warm ecru surface, chocolate ink, conch (`#E8A184`) doing exactly one
 * small loud thing per view, radius 0 throughout. Identity is type/space/
 * restraint — **no named effect**; the Theme Contract's "champagne luster"
 * is fabricated and deliberately not implemented here.
 *
 * Type is roman + italic serif mixing with a hairline rule in the gap
 * (`southSea.roles.ts`'s `inlineEmphasis`). The spec's ideal faces (a
 * "roman + italic" editorial serif pairing) aren't self-hosted — this uses
 * Georgia, a free system serif with a genuine (not synthesized) italic, so
 * the roman/italic mix stays real rather than an oblique fake.
 *
 * Two color tiers (ADR-0005): `*Primitives` are raw named hexes; the
 * `*ThemeClass` calls map them onto semantic roles. Scales are this theme's
 * own — not shared with Pearl/Tahitian/Freshwater.
 */

export const southSeaLightPrimitives = {
  ecru: '#F5EFE4',
  ecruDeep: '#EFE6D6',
  chocolate: '#3B2A1F',
  // Darkened from the initial #8A7361 sample — that swatch only hit 3.9:1 on
  // `ecru`, failing WCAG AA normal-text (4.5:1); this hits 4.95:1.
  taupe: '#786353',
  hairline: '#DDD0BC',
  hairlineStrong: '#CBBA9E',
  hairlineSubtle: '#E9E1D0',
  conch: '#E8A184',
  conchDeep: '#D9895F',
  conchMist: '#FBE9DF',
  scrim: 'rgba(59, 42, 31, 0.5)',
};

export const southSeaDarkPrimitives = {
  chocolateDeep: '#241811',
  chocolate: '#2E2016',
  cream: '#F3E9DA',
  fawn: '#B8A48E',
  umber: '#4A3626',
  umberStrong: '#5E4732',
  umberSubtle: '#382919',
  conch: '#E8A184',
  conchBright: '#F0B79C',
  conchDusk: '#3A2419',
  conchInk: '#241108',
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

// Radius 0 throughout — flat maison geometry, not a rounded-corner register.
const southSeaRadius = { control: '0px', surface: '0px', full: '9999px' };
// rem, not px (16px root) — spacing/control-height scale with a user's base
// font-size preference, not just page zoom. Same reasoning as pearl.css.ts.
const southSeaSpace = { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem', '2xl': '3rem' };
const southSeaControlHeight = { sm: '2rem', md: '2.5rem', lg: '3rem', xl: '3.5rem' };
const southSeaFontWeight = { regular: '400', medium: '500', semibold: '600', bold: '700' };
// Zero-cost for MVP: Georgia is the roman+italic editorial serif carrying
// display/heading; body stays a clean neutral sans. No paid face named —
// see the file header for why Boska (South Sea's old placeholder face) was
// dropped: it has no italic style registered, and the maison identity's
// roman/italic mix needs a real one.
export const southSeaFonts = {
  serif: "Georgia, 'Times New Roman', serif",
  sans: "system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
};
const southSeaFontFamily = {
  display: southSeaFonts.serif,
  heading: southSeaFonts.serif,
  body: southSeaFonts.sans,
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
    background: southSeaLightPrimitives.ecru,
    surface: southSeaLightPrimitives.ecruDeep,
    overlay: southSeaLightPrimitives.scrim,
    overlaySubtle: 'rgba(59, 42, 31, 0.08)',
    backgroundInverse: southSeaDarkPrimitives.chocolateDeep,
    surfaceInverse: southSeaDarkPrimitives.chocolate,
    text: southSeaLightPrimitives.chocolate,
    textSubtle: southSeaLightPrimitives.taupe,
    textInverse: southSeaDarkPrimitives.cream,
    textInverseSubtle: southSeaDarkPrimitives.fawn,
    border: southSeaLightPrimitives.hairline,
    borderStrong: southSeaLightPrimitives.hairlineStrong,
    borderSubtle: southSeaLightPrimitives.hairlineSubtle,
    borderInverse: southSeaDarkPrimitives.umber,
    shadow: southSeaLightPrimitives.hairlineStrong,
    // Conch is the one loud accent — reused for `primary` and `accent` rather
    // than authoring a second CTA hue: the maison identity is "one small
    // loud thing per view," not two.
    primary: southSeaLightPrimitives.conch,
    onPrimary: southSeaLightPrimitives.chocolate,
    accent: southSeaLightPrimitives.conch,
    accentHover: southSeaLightPrimitives.conchDeep,
    accentSubtle: southSeaLightPrimitives.conchMist,
    onAccent: southSeaLightPrimitives.chocolate,
    onAccentSubtle: southSeaLightPrimitives.chocolate,
    focusRing: southSeaLightPrimitives.conchDeep,
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
    background: southSeaDarkPrimitives.chocolateDeep,
    surface: southSeaDarkPrimitives.chocolate,
    overlay: southSeaDarkPrimitives.scrim,
    overlaySubtle: 'rgba(255, 255, 255, 0.10)',
    backgroundInverse: southSeaLightPrimitives.ecru,
    surfaceInverse: southSeaLightPrimitives.ecruDeep,
    text: southSeaDarkPrimitives.cream,
    textSubtle: southSeaDarkPrimitives.fawn,
    textInverse: southSeaLightPrimitives.chocolate,
    textInverseSubtle: southSeaLightPrimitives.taupe,
    border: southSeaDarkPrimitives.umber,
    borderStrong: southSeaDarkPrimitives.umberStrong,
    borderSubtle: southSeaDarkPrimitives.umberSubtle,
    borderInverse: southSeaLightPrimitives.hairline,
    shadow: southSeaDarkPrimitives.umberStrong,
    // Conch stays the same hue across modes (11a/11b) — a mode-invariant
    // swatch, same model as Pearl's sentiment steps — brightened one notch
    // (`conchBright`) only where it sits as hover feedback against the dark
    // ground, not as a second accent.
    primary: southSeaDarkPrimitives.conch,
    onPrimary: southSeaDarkPrimitives.conchInk,
    accent: southSeaDarkPrimitives.conch,
    accentHover: southSeaDarkPrimitives.conchBright,
    accentSubtle: southSeaDarkPrimitives.conchDusk,
    onAccent: southSeaDarkPrimitives.conchInk,
    onAccentSubtle: southSeaDarkPrimitives.cream,
    focusRing: southSeaDarkPrimitives.conchBright,
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
