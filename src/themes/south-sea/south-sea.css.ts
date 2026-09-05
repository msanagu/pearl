import { createTheme, globalStyle, keyframes } from '@vanilla-extract/css';
import { vars } from '@/theme.css';
import { inverseOverride } from '@/foundations/inverseOverride';
import { fieldMeta, label as fieldLabel, hint as fieldHint, errorText as fieldErrorText } from '@components/Field/Field.css';
import { sphereWrap, body as sphereBody, contact as sphereContact } from '@components/_brand/PearlSphere/PearlSphere.css';

// South Sea — "Golden Hour Maison". Flat warm ecru surface, chocolate ink, conch doing one loud
// thing per view, radius 0. Type: roman + italic serif (Zodiak / Times), Boska for headings/display.

// Light-register neutral, warm ecru hue, 100 (brightest) -> 600. Dark register is southSeaDriftwood.
export const southSeaSand = {
  100: '#F5EFE4',
  150: '#F3EADA',
  200: '#EFE6D6',
  300: '#E9E0D0',
  400: '#DDD1BC',
  500: '#CBBA9E',
  600: '#746650',
};

// Dark-register neutral, chocolate/umber hue, 500 -> 900. 750 (light mode's ink) is the same hue
// family, tuned for a different background.
export const southSeaDriftwood = {
  500: '#B8A18E',
  600: '#5E4632',
  700: '#4A3626',
  750: '#3B2C1F',
  800: '#382719',
  850: '#2E2116',
  900: '#241A11',
};

// Accent hue — conch — spent as "one small loud thing per view". In light mode, accent splits
// from primary (300 keeps the fill; 400/500 take the roles that land as text).
export const southSeaConch = {
  100: '#FBE8DF',
  200: '#F0B79C',
  300: '#E8A484',
  400: '#A0522F',
  500: '#713E26',
};

const southSeaScrim = {
  light: 'rgba(59, 42, 31, 0.5)',
  dark: 'rgba(0, 0, 0, 0.6)',
};

// Sentiment families, warm throughout to match the maison palette (seaMoss a moss green, pacific a
// muted steel-teal — not cool imports from another theme).
export const southSeaSentiment = {
  seaMoss: { 100: '#e7edde', 200: '#c5d3b1', 300: '#a5bb86', 400: '#8aa762', 500: '#657c46', 600: '#506237', 700: '#3d4b2a', 800: '#202716' },
  anemone: { 100: '#fdeceb', 200: '#f4b9b4', 300: '#f5a8a0', 400: '#e8574a', 500: '#d64036', 600: '#8f1d17', 700: '#7a2f28', 800: '#2a1513' },
  shell: { 100: '#fdf3e2', 200: '#f2d59b', 300: '#f0cd7a', 400: '#e0a52a', 500: '#d9920b', 600: '#6e5316', 700: '#7a4d09', 800: '#28200f' },
  pacific: { 100: '#e7efee', 200: '#c3d6d4', 300: '#a1bfbd', 400: '#6e9694', 500: '#4c7573', 600: '#395857', 700: '#2c4442', 800: '#16211f' },
};

const southSeaRadius = { control: '0px', full: '9999px', nesting: '0', cornerShape: 'round' };
const southSeaSpace = { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem', '2xl': '3rem' };
const southSeaControlHeight = { sm: '2rem', md: '2.5rem', lg: '3rem', xl: '3.5rem' };
const southSeaFontWeight = { regular: '400', medium: '500', semibold: '600', bold: '700' };

export const southSeaFonts = {
  serif: "'Zodiak', Georgia, 'Times New Roman', serif",
  // The italic half of the roman/italic mix — Times, deliberately: the design canvas's Zodiak
  // italic fell through to Times Italic and was signed off in it.
  serifItalic: "Times, 'Times New Roman', Georgia, serif",
  sans: "'General Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  boska: "'Boska', Georgia, serif",
};
const southSeaFontFamily = {
  display: southSeaFonts.serif,
  heading: southSeaFonts.serif,
  body: southSeaFonts.sans,
  mono: "ui-monospace, 'SF Mono', Menlo, monospace",
};
const southSeaText = {
  caption: { fontSize: '0.6875rem', lineHeight: '1.4545', fontWeight: '400', letterSpacing: '0' }, // 11/16
  bodySm: { fontSize: '0.75rem', lineHeight: '1.6667', fontWeight: '400', letterSpacing: '0' }, // 12/20
  bodyMd: { fontSize: '1rem', lineHeight: '1.5', fontWeight: '400', letterSpacing: '0' }, // 16/24
  bodyLg: { fontSize: '1.5rem', lineHeight: '1.5', fontWeight: '400', letterSpacing: '0' }, // 24/36
  headingSm: { fontSize: '2rem', lineHeight: '1.25', fontWeight: '600', letterSpacing: '-0.01em' }, // 32/40
  headingMd: { fontSize: '2.5rem', lineHeight: '1.2', fontWeight: '600', letterSpacing: '-0.015em' }, // 40/48
  headingLg: { fontSize: '3.5rem', lineHeight: '1.142857', fontWeight: '600', letterSpacing: '-0.02em' }, // 56/64
  displaySm: { fontSize: 'clamp(2rem, 8vw, 4.5rem)', lineHeight: '1.056', fontWeight: '700', letterSpacing: '-0.02em' }, // 76px ceiling
  displayLg: { fontSize: 'clamp(2.5rem, 9vw, 5.5rem)', lineHeight: '1.05', fontWeight: '700', letterSpacing: '-0.02em' }, // 88px ceiling
  displayXl: { fontSize: 'clamp(3rem, 13vw, 9.5rem)', lineHeight: '1', fontWeight: '700', letterSpacing: '-0.025em' }, // 152px ceiling
};

export const southSeaLightThemeClass = createTheme(vars, {
  color: {
    background: southSeaSand[100],
    surface: southSeaSand[200],
    overlay: southSeaScrim.light,
    overlaySubtle: 'rgba(59, 42, 31, 0.08)',
    text: southSeaDriftwood[750],
    textSubtle: southSeaSand[600],
    icon: southSeaSand[600],
    border: southSeaSand[400],
    borderStrong: southSeaSand[500],
    borderSubtle: southSeaSand[300],
    borderInverse: southSeaDriftwood[700],
    shadow: southSeaSand[500],
    primary: southSeaConch[300],
    onPrimary: southSeaDriftwood[750],
    accent: southSeaConch[400],
    accentHover: southSeaConch[500],
    accentSubtle: southSeaConch[100],
    onAccent: southSeaSand[150],
    onAccentSubtle: southSeaDriftwood[750],
    focusRing: southSeaConch[400],
    positive: { surface: southSeaSentiment.seaMoss[100], border: southSeaSentiment.seaMoss[200], text: southSeaSentiment.seaMoss[700], icon: `color-mix(in srgb, ${southSeaSentiment.seaMoss[500]} 65%, ${vars.color.textSubtle})` },
    negative: { surface: southSeaSentiment.anemone[100], border: southSeaSentiment.anemone[200], text: southSeaSentiment.anemone[600], icon: `color-mix(in srgb, ${southSeaSentiment.anemone[500]} 65%, ${vars.color.textSubtle})` },
    warn: { surface: southSeaSentiment.shell[100], border: southSeaSentiment.shell[200], text: southSeaSentiment.shell[700], icon: `color-mix(in srgb, ${southSeaSentiment.shell[500]} 65%, ${vars.color.textSubtle})` },
    info: { surface: southSeaSentiment.pacific[100], border: southSeaSentiment.pacific[200], text: southSeaSentiment.pacific[700], icon: `color-mix(in srgb, ${southSeaSentiment.pacific[500]} 65%, ${vars.color.textSubtle})` },
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
    background: southSeaDriftwood[900],
    surface: southSeaDriftwood[850],
    overlay: southSeaScrim.dark,
    overlaySubtle: 'rgba(255, 255, 255, 0.10)',
    text: southSeaSand[150],
    textSubtle: southSeaDriftwood[500],
    icon: southSeaDriftwood[500],
    border: southSeaDriftwood[700],
    borderStrong: southSeaDriftwood[600],
    borderSubtle: southSeaDriftwood[800],
    borderInverse: southSeaSand[400],
    // Fixed, not derived: a shadow must darken, but every dark-mode neutral this theme owns is
    // lighter than background (the darkest step).
    shadow: 'rgba(18, 11, 5, 0.55)',
    primary: southSeaConch[300],
    onPrimary: southSeaDriftwood[900],
    accent: southSeaConch[300],
    accentHover: southSeaConch[200],
    accentSubtle: southSeaDriftwood[800],
    onAccent: southSeaDriftwood[900],
    onAccentSubtle: southSeaSand[150],
    focusRing: southSeaConch[200],
    positive: { surface: southSeaSentiment.seaMoss[800], border: southSeaSentiment.seaMoss[600], text: southSeaSentiment.seaMoss[300], icon: `color-mix(in srgb, ${southSeaSentiment.seaMoss[400]} 65%, ${vars.color.textSubtle})` },
    negative: { surface: southSeaSentiment.anemone[800], border: southSeaSentiment.anemone[700], text: southSeaSentiment.anemone[300], icon: `color-mix(in srgb, ${southSeaSentiment.anemone[400]} 65%, ${vars.color.textSubtle})` },
    warn: { surface: southSeaSentiment.shell[800], border: southSeaSentiment.shell[600], text: southSeaSentiment.shell[300], icon: `color-mix(in srgb, ${southSeaSentiment.shell[400]} 65%, ${vars.color.textSubtle})` },
    info: { surface: southSeaSentiment.pacific[800], border: southSeaSentiment.pacific[600], text: southSeaSentiment.pacific[300], icon: `color-mix(in srgb, ${southSeaSentiment.pacific[400]} 65%, ${vars.color.textSubtle})` },
  },
  radius: southSeaRadius,
  space: southSeaSpace,
  controlHeight: southSeaControlHeight,
  fontWeight: southSeaFontWeight,
  fontFamily: southSeaFontFamily,
  text: southSeaText,
});

inverseOverride(southSeaLightThemeClass, {
  background: southSeaDriftwood[900],
  surface: southSeaDriftwood[850],
  text: southSeaSand[150],
  textSubtle: southSeaDriftwood[500],
  icon: southSeaDriftwood[500],
  accent: southSeaConch[300],
  accentHover: southSeaConch[200],
  accentSubtle: southSeaDriftwood[800],
  onAccent: southSeaDriftwood[900],
  onAccentSubtle: southSeaSand[150],
  positive: { surface: southSeaSentiment.seaMoss[800], border: southSeaSentiment.seaMoss[600], text: southSeaSentiment.seaMoss[300], icon: `color-mix(in srgb, ${southSeaSentiment.seaMoss[400]} 65%, ${vars.color.textSubtle})` },
  negative: { surface: southSeaSentiment.anemone[800], border: southSeaSentiment.anemone[700], text: southSeaSentiment.anemone[300], icon: `color-mix(in srgb, ${southSeaSentiment.anemone[400]} 65%, ${vars.color.textSubtle})` },
  warn: { surface: southSeaSentiment.shell[800], border: southSeaSentiment.shell[600], text: southSeaSentiment.shell[300], icon: `color-mix(in srgb, ${southSeaSentiment.shell[400]} 65%, ${vars.color.textSubtle})` },
  info: { surface: southSeaSentiment.pacific[800], border: southSeaSentiment.pacific[600], text: southSeaSentiment.pacific[300], icon: `color-mix(in srgb, ${southSeaSentiment.pacific[400]} 65%, ${vars.color.textSubtle})` },
});
inverseOverride(southSeaDarkThemeClass, {
  background: southSeaSand[100],
  surface: southSeaSand[200],
  text: southSeaDriftwood[750],
  textSubtle: southSeaSand[600],
  icon: southSeaSand[600],
  accent: southSeaConch[400],
  accentHover: southSeaConch[500],
  accentSubtle: southSeaConch[100],
  onAccent: southSeaSand[150],
  onAccentSubtle: southSeaDriftwood[750],
  positive: { surface: southSeaSentiment.seaMoss[100], border: southSeaSentiment.seaMoss[200], text: southSeaSentiment.seaMoss[700], icon: `color-mix(in srgb, ${southSeaSentiment.seaMoss[500]} 65%, ${vars.color.textSubtle})` },
  negative: { surface: southSeaSentiment.anemone[100], border: southSeaSentiment.anemone[200], text: southSeaSentiment.anemone[600], icon: `color-mix(in srgb, ${southSeaSentiment.anemone[500]} 65%, ${vars.color.textSubtle})` },
  warn: { surface: southSeaSentiment.shell[100], border: southSeaSentiment.shell[200], text: southSeaSentiment.shell[700], icon: `color-mix(in srgb, ${southSeaSentiment.shell[500]} 65%, ${vars.color.textSubtle})` },
  info: { surface: southSeaSentiment.pacific[100], border: southSeaSentiment.pacific[200], text: southSeaSentiment.pacific[700], icon: `color-mix(in srgb, ${southSeaSentiment.pacific[500]} 65%, ${vars.color.textSubtle})` },
});

// inlineEmphasis — plain accent-coloured text, not the serif mix.
globalStyle(`${southSeaLightThemeClass} [data-role="inlineEmphasis"], ${southSeaDarkThemeClass} [data-role="inlineEmphasis"]`, {
  color: vars.color.accent,
});

// Brand wordmark: own rule (not a role) so no scale can override it; span qualifier lifts it past
// the same-specificity heading Boska rule below.
globalStyle(
  `${southSeaLightThemeClass} span[data-component="brand-wordmark"], ${southSeaDarkThemeClass} span[data-component="brand-wordmark"]`,
  {
    fontFamily: southSeaFonts.serifItalic,
    fontStyle: 'italic',
    letterSpacing: 'normal',
    color: vars.color.text,
  },
);

// Body text borrows the italic voice for variety — these scale steps switch face outright.
globalStyle(
  [
    `${southSeaLightThemeClass} [data-type-scale="bodySm"]`,
    `${southSeaDarkThemeClass} [data-type-scale="bodySm"]`,
    `${southSeaLightThemeClass} [data-type-scale="bodyMd"]`,
    `${southSeaDarkThemeClass} [data-type-scale="bodyMd"]`,
    `${southSeaLightThemeClass} [data-type-scale="bodyLg"]`,
    `${southSeaDarkThemeClass} [data-type-scale="bodyLg"]`,
  ].join(', '),
  {
    fontFamily: southSeaFonts.serifItalic,
    fontStyle: 'italic',
  },
);

// Compensating size bump for the face swap above — Times' x-height reads ~12.5% smaller than sans.
globalStyle(
  [
    `${southSeaLightThemeClass} [data-type-scale="bodySm"]`,
    `${southSeaDarkThemeClass} [data-type-scale="bodySm"]`,
  ].join(', '),
  { fontSize: '0.8125rem', lineHeight: '1.5385' }, // 13/20
);
globalStyle(
  [
    `${southSeaLightThemeClass} [data-type-scale="bodyMd"]`,
    `${southSeaDarkThemeClass} [data-type-scale="bodyMd"]`,
  ].join(', '),
  { fontSize: '1.125rem', lineHeight: '1.5556' }, // 18/28
);
globalStyle(
  [
    `${southSeaLightThemeClass} [data-type-scale="bodyLg"]`,
    `${southSeaDarkThemeClass} [data-type-scale="bodyLg"]`,
  ].join(', '),
  { fontSize: '1.6875rem', lineHeight: '1.4815' }, // 27/40
);

// Headings: Boska, sentence case, roman. letterSpacing reset to normal — Boska runs tight enough at
// southSeaText's Zodiak/Times tracking that letters touch at headingLg.
globalStyle(
  [
    `${southSeaLightThemeClass} [data-type-scale="headingSm"]`,
    `${southSeaDarkThemeClass} [data-type-scale="headingSm"]`,
    `${southSeaLightThemeClass} [data-type-scale="headingMd"]`,
    `${southSeaDarkThemeClass} [data-type-scale="headingMd"]`,
    `${southSeaLightThemeClass} [data-type-scale="headingLg"]`,
    `${southSeaDarkThemeClass} [data-type-scale="headingLg"]`,
  ].join(', '),
  {
    fontFamily: southSeaFonts.boska,
    fontStyle: 'normal',
    fontWeight: '400',
    letterSpacing: 'normal',
  },
);

// Display: Boska, uppercase, roman. Same letterSpacing reset as headings.
globalStyle(
  [
    `${southSeaLightThemeClass} [data-type-scale="displaySm"]`,
    `${southSeaDarkThemeClass} [data-type-scale="displaySm"]`,
    `${southSeaLightThemeClass} [data-type-scale="displayLg"]`,
    `${southSeaDarkThemeClass} [data-type-scale="displayLg"]`,
    `${southSeaLightThemeClass} [data-type-scale="displayXl"]`,
    `${southSeaDarkThemeClass} [data-type-scale="displayXl"]`,
  ].join(', '),
  {
    fontFamily: southSeaFonts.boska,
    fontStyle: 'normal',
    fontWeight: '400',
    letterSpacing: 'normal',
    textTransform: 'uppercase',
    lineHeight: '0.96',
  },
);
// Stops an inline-emphasised word inheriting the theme's italic Times — Boska has no relationship
// to the roman/italic mix.
globalStyle(
  [
    `${southSeaLightThemeClass} [data-type-scale="displaySm"] [data-role="inlineEmphasis"]`,
    `${southSeaDarkThemeClass} [data-type-scale="displaySm"] [data-role="inlineEmphasis"]`,
    `${southSeaLightThemeClass} [data-type-scale="displayLg"] [data-role="inlineEmphasis"]`,
    `${southSeaDarkThemeClass} [data-type-scale="displayLg"] [data-role="inlineEmphasis"]`,
    `${southSeaLightThemeClass} [data-type-scale="displayXl"] [data-role="inlineEmphasis"]`,
    `${southSeaDarkThemeClass} [data-type-scale="displayXl"] [data-role="inlineEmphasis"]`,
  ].join(', '),
  {
    fontFamily: southSeaFonts.boska,
    fontStyle: 'normal',
  },
);

// Field's label falls outside data-role rules (a plain element) — matched to preheading's
// treatment but with tighter tracking; fontWeight 300 deliberately escapes southSeaFontWeight.
globalStyle(`${southSeaLightThemeClass} .${fieldMeta} .${fieldLabel}, ${southSeaDarkThemeClass} .${fieldMeta} .${fieldLabel}`, {
  fontFamily: southSeaFonts.sans,
  fontWeight: '300',
  textTransform: 'uppercase',
  letterSpacing: '0.14em',
  color: vars.color.textSubtle,
});

// Input value + hint/error copy — all body prose, so all run the italic voice; sentiment colour untouched.
globalStyle(
  [
    `${southSeaLightThemeClass} [data-component="input"]`,
    `${southSeaDarkThemeClass} [data-component="input"]`,
    `${southSeaLightThemeClass} .${fieldMeta} .${fieldHint}`,
    `${southSeaDarkThemeClass} .${fieldMeta} .${fieldHint}`,
    `${southSeaLightThemeClass} .${fieldMeta} .${fieldErrorText}`,
    `${southSeaDarkThemeClass} .${fieldMeta} .${fieldErrorText}`,
  ].join(', '),
  {
    fontFamily: southSeaFonts.serifItalic,
    fontStyle: 'italic',
  },
);

globalStyle(`${southSeaLightThemeClass} [data-type-scale="caption"], ${southSeaDarkThemeClass} [data-type-scale="caption"]`, {
  fontFamily: southSeaFonts.sans,
  textTransform: 'uppercase',
  letterSpacing: '0.28em',
});

// Uppercase button text at the canon recipe's padding/size reads cramped — caps run wider than mixed case.
globalStyle(`${southSeaLightThemeClass} [data-component="button"], ${southSeaDarkThemeClass} [data-component="button"]`, {
  fontFamily: southSeaFonts.sans,
  textTransform: 'uppercase',
  fontSize: vars.text.bodySm.fontSize,
  letterSpacing: '0.14em',
  paddingLeft: vars.space.lg,
  paddingRight: vars.space.lg,
});

// preheading — the "/ LABEL /" idiom at caption size.
globalStyle(`${southSeaLightThemeClass} [data-role="preheading"], ${southSeaDarkThemeClass} [data-role="preheading"]`, {
  fontFamily: southSeaFonts.sans,
  textTransform: 'uppercase',
  letterSpacing: '0.28em',
});

// Default size only — gated on :not([data-type-scale]) so an explicit typeScale still wins.
globalStyle(
  `${southSeaLightThemeClass} [data-role="preheading"]:not([data-type-scale]), ${southSeaDarkThemeClass} [data-role="preheading"]:not([data-type-scale])`,
  {
    fontSize: vars.text.caption.fontSize,
    lineHeight: vars.text.caption.lineHeight,
  },
);

// dataDigits aliases to the plain sans — no tabular mono face in this theme.
globalStyle(`${southSeaLightThemeClass} [data-role="dataDigits"], ${southSeaDarkThemeClass} [data-role="dataDigits"]`, {
  fontFamily: southSeaFonts.sans,
});

// The shared Button recipe's inset top-highlight is sized for Pearl's accentSubtle; dropped here.
globalStyle(
  `${southSeaLightThemeClass} [data-component="button"][data-variant="primary"], ${southSeaDarkThemeClass} [data-component="button"][data-variant="primary"]`,
  { boxShadow: 'none' },
);
globalStyle(
  [
    `${southSeaLightThemeClass} [data-component="button"][data-variant="primary"]:not(:disabled):hover`,
    `${southSeaDarkThemeClass} [data-component="button"][data-variant="primary"]:not(:disabled):hover`,
  ].join(', '),
  {
    // Restated at :hover — the base recipe's own :hover rule outranks the resting boxShadow: none above.
    backgroundColor: `color-mix(in srgb, ${vars.color.primary} 85%, ${vars.color.accent})`,
    boxShadow: 'none',
    transform: 'none',
  },
);

// The golden-hour sphere (hover-triggered): PearlSphere reads pearlTreatments.luster directly, so a
// different sphere overrides its two styled elements here.
const southSeaGoldenHour = {
  champagne800: '#8C6A34',
  gold700: '#A67C2E',
  dusk850: '#1C120A',
};

const southSeaSheenBand = `linear-gradient(115deg, transparent 32%, ${southSeaGoldenHour.champagne800}66 44%, ${southSeaGoldenHour.gold700}80 52%, transparent 72%)`;
const southSeaSheenFrom = '118% 0';
const southSeaSheenTo = '34% 0';

const southSeaSweep = keyframes({
  '0%, 100%': { backgroundPosition: `${southSeaSheenFrom}, center` },
  '50%': { backgroundPosition: `${southSeaSheenTo}, center` },
});

// Static by default ("golden hour, held still") — replaces PearlSphere.css.ts's always-on sweep
// rather than adding to it, since that keyframe is baked to Pearl's own sheen positions.
globalStyle(`${southSeaDarkThemeClass} .${sphereBody}`, {
  backgroundImage: `${southSeaSheenBand}, radial-gradient(circle at 35% 28%, #FCF4E6 0%, ${southSeaGoldenHour.champagne800} 46%, ${southSeaGoldenHour.gold700} 72%, ${southSeaGoldenHour.dusk850} 100%)`,
  backgroundPosition: `${southSeaSheenFrom}, center`,
  boxShadow: `0 18px 40px rgba(28, 18, 10, 0.45), inset 0 -8px 22px rgba(28, 18, 10, 0.35), inset 6px 4px 18px rgba(252, 244, 230, 0.25)`,
  animation: 'none',
});

globalStyle(`${southSeaDarkThemeClass} .${sphereWrap}:hover .${sphereBody}`, {
  animation: `${southSeaSweep} 4.5s ease-in-out infinite`,
});

globalStyle(`${southSeaDarkThemeClass} .${sphereContact}`, {
  background: `radial-gradient(ellipse at center, rgba(28, 18, 10, 0.5), transparent 68%)`,
});

// Light mode's counterpart is required, not optional: unstyled, PearlSphere's gradients resolve
// pearlTreatments vars to nothing and the sphere vanishes on the ecru ground.
const southSeaLightSheenBand = `linear-gradient(115deg, transparent 34%, rgba(255, 255, 255, 0.65) 45%, rgba(255, 255, 255, 0.95) 52%, rgba(255, 255, 255, 0.55) 58%, transparent 70%)`;
const southSeaLightBloom = `radial-gradient(circle at 64% 76%, rgba(251, 232, 223, 0.6), transparent 54%)`;
const southSeaLightBody = `radial-gradient(circle at 34% 27%, #FFFFFF 0%, #FFFFFF 28%, #FDFBF6 46%, #F7F0E5 63%, #EADCC6 82%, #D2BE9F 100%)`;

// Three-position keyframe (not southSeaSweep's two) — three layers need three positions.
const southSeaLightSweep = keyframes({
  '0%, 100%': { backgroundPosition: `${southSeaSheenFrom}, center, center` },
  '50%': { backgroundPosition: `${southSeaSheenTo}, center, center` },
});

globalStyle(`${southSeaLightThemeClass} .${sphereBody}`, {
  backgroundImage: `${southSeaLightSheenBand}, ${southSeaLightBloom}, ${southSeaLightBody}`,
  backgroundPosition: `${southSeaSheenFrom}, center, center`,
  // Two insets keep a white sphere from going flat: warm occlusion arc + hard white crown.
  boxShadow: `0 20px 44px rgba(120, 106, 83, 0.34), inset 0 -10px 26px rgba(120, 106, 83, 0.3), inset 5px 4px 16px rgba(255, 255, 255, 0.9)`,
  animation: 'none',
});

globalStyle(`${southSeaLightThemeClass} .${sphereWrap}:hover .${sphereBody}`, {
  animation: `${southSeaLightSweep} 4.5s ease-in-out infinite`,
});

globalStyle(`${southSeaLightThemeClass} .${sphereContact}`, {
  background: `radial-gradient(ellipse at center, rgba(120, 106, 83, 0.42), transparent 68%)`,
});
