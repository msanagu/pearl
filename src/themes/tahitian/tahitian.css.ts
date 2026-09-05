import { createTheme, globalStyle, keyframes, style } from '@vanilla-extract/css';
import { vars } from '@/theme.css';
import { inverseOverride } from '@/foundations/inverseOverride';
import { fieldMeta, label as fieldLabel } from '@components/Field/Field.css';
import { body as sphereBody } from '@components/_brand/PearlSphere/PearlSphere.css';

/**
 * Tahitian — the flagship dark editorial system: condensed poster type
 * (Anton), an exposed grid, one iridescent overtone reserved for
 * photographic plates. Dark is the default first render.
 *
 * platinum + charcoal are one continuous neutral ramp split into two named
 * halves for readability — each mode's text colour is the other half's
 * extreme step (light text is charcoal[950], dark text is platinum[100]), a
 * cross-reference, not a separate hex.
 *
 * Accent is the one place light and dark genuinely diverge: light stays
 * peacock (the signature deep green), dark moves to seaglass (brighter,
 * tuned against near-black). Both scales' rungs are placed by value against
 * the neutral ramp, so step numbers don't line up between them.
 *
 * Every non-colour scale is defined here, scoped to Tahitian alone.
 */

// ---- Primitives (raw, named hexes) ----

export const tahitianPlatinum = {
  /** raised surface / onAccent (light); reused as dark-mode text */
  100: '#FFFFFF',
  /** page background (light) */
  200: '#F2F4F3',
  /** border, subtle (light) */
  300: '#E1E3DF',
  /** border (light) */
  400: '#C9CDC8',
  /** border, strong (light); reused as dark-mode textSubtle */
  500: '#A6ABA4',
  /** text, subtle (light) */
  600: '#6B6E69',
};

export const tahitianCharcoal = {
  /** border, strong (dark) */
  700: '#45454B',
  /** border (dark) */
  800: '#2C2C30',
  /** border, subtle (dark) */
  850: '#202024',
  /** raised surface (dark) */
  900: '#1A1A1D',
  /** page background (dark); reused as light-mode text */
  950: '#0E0E10',
};

/**
 * Light mode's accent — the signature deep green. Rungs placed by value
 * against the neutral ramp: 300 ≈ platinum[300], 600 ≈ platinum[600], 700 ≈ charcoal[700].
 */
export const tahitianPeacock = {
  /** accentSubtle */
  300: '#D9EFEB',
  /** accent / primary / focusRing */
  600: '#0F7A66',
  /** hover */
  700: '#0B5F50',
};

/**
 * Dark mode's accent — a brighter green tuned to read against near-black,
 * its own hue rather than a lifted peacock. Two steps: dark accentSubtle
 * reads charcoal[800] directly. Hover step holds hue exactly and lifts ΔL
 * 0.066 (comparable to peacock's 0.084).
 */
export const tahitianSeaglass = {
  /** hover — lighter than base, since the ground is dark */
  300: '#86F6E0',
  /** base — accent / primary / focusRing */
  400: '#6FE0CB',
};

export const tahitianScrim = {
  light: 'rgba(24, 26, 25, 0.56)',
  dark: 'rgba(0, 0, 0, 0.6)',
};

// Switzer (Fontshare) — a Swiss neo-grotesque body voice distinct from
// Freshwater's, editorial enough to pair with Anton's condensed poster weight.
// Loaded via CDN link alongside South Sea's faces.
export const tahitianFonts = {
  display: "'Anton', Impact, sans-serif",
  sans: "'Switzer', system-ui, -apple-system, 'Segoe UI', sans-serif",
  mono: "'IBM Plex Mono', 'SF Mono', Menlo, monospace",
};

export const tahitianTypeTreatments = {
  monoCapsTracked: { fontFamily: tahitianFonts.mono, case: 'upper' as const, tracking: '0.08em' },
} satisfies Record<string, unknown>;

/**
 * The overtone gradient's stops, light mode. background-clip: text paints
 * these as the glyphs, so every stop owes 4.5:1 against background
 * (platinum[200]). Hue- and saturation-preserved darkenings of an
 * eye-authored set that missed (silver was 1.62:1), each verified ≥ 4.5:1.
 */
export const tahitianPearlColors = {
  peacock: '#297C68', // 4.55:1
  green: '#5FAD78', // not in either gradient
  blue: '#447591', // 4.53:1
  aubergine: '#8C5A7D', // 4.91:1
  /** Terminal stop is the theme's own textSubtle, so iridescence resolves
   *  into the type system instead of fading out of it. 4.68:1. */
  silver: tahitianPlatinum[600],
};

// Same gradient's stops, dark mode — lighter/brighter versions of each
// light-mode hue, needing contrast against near-black charcoal. green
// reuses seaglass[400], already peacock's dark-mode sibling.
export const tahitianPearlColorsBright = {
  peacock: tahitianSeaglass[400],
  green: '#8FE3A8',
  blue: '#7EC8E3',
  aubergine: '#D79FC0',
  silver: '#E7EEEC',
};

// Sentiment families — one 100→800 scale per hue, shared by both modes.
export const tahitianSentiment = {
  kelp: { 100: '#E4F1EB', 200: '#B7D9C8', 300: '#8FC2A7', 400: '#5FAD78', 500: '#3C7F5C', 600: '#2D6348', 700: '#22513A', 800: '#10271D' },
  reef: { 100: '#F7E8EA', 200: '#E8B9C0', 300: '#D796A2', 400: '#C66A7A', 500: '#9E4658', 600: '#783445', 700: '#632A3A', 800: '#2B151C' },
  dawn: { 100: '#F5F0DF', 200: '#E8D89A', 300: '#DCC46B', 400: '#C69C32', 500: '#927326', 600: '#6D541D', 700: '#574316', 800: '#241B0B' },
  wave: { 100: '#E5F0F2', 200: '#B7D5DB', 300: '#8FBCC8', 400: '#609BAE', 500: '#477C91', 600: '#365E70', 700: '#294B59', 800: '#13232A' },
};

// ---- Scales (this theme's own — not shared with Freshwater/South Sea) ----

/**
 * nesting: '0' — hard-edged by identity; derived radii stay square. full
 * stays 9999px: only elements that are circles by nature (dots, radios,
 * avatars). Tag and XButton take radius.control.
 */
const tahitianRadius = { control: '0px', full: '9999px', nesting: '0', cornerShape: 'round' };
// rem, not px — scales with the user's base font-size preference (see pearl.css.ts).
const tahitianSpace = { xs: '0.5rem', sm: '0.75rem', md: '1.25rem', lg: '1.75rem', xl: '2.5rem', '2xl': '3.5rem' };
const tahitianControlHeight = { sm: '2rem', md: '2.5rem', lg: '3rem', xl: '3.5rem' };
const tahitianFontWeight = { regular: '400', medium: '500', semibold: '600', bold: '700' };

const tahitianFontFamily = {
  display: tahitianFonts.display,
  heading: tahitianFonts.display,
  body: tahitianFonts.sans,
  mono: tahitianFonts.mono,
};

// Sizes follow the shared 4px-grid ramp (see pearl.css.ts). Anton ships one cut
// (Regular/400) and is already an ultra-bold display face, so heading/display
// rows stay 400 rather than faux-bolding a weight it doesn't have.
const tahitianText = {
  caption: { fontSize: '0.6875rem', lineHeight: '1.4545', fontWeight: '400', letterSpacing: '0' }, // 11/16
  bodySm: { fontSize: '0.75rem', lineHeight: '1.6667', fontWeight: '400', letterSpacing: '0' }, // 12/20
  bodyMd: { fontSize: '1rem', lineHeight: '1.5', fontWeight: '400', letterSpacing: '0' }, // 16/24
  bodyLg: { fontSize: '1.5rem', lineHeight: '1.5', fontWeight: '400', letterSpacing: '0' }, // 24/36
  headingSm: { fontSize: '2rem', lineHeight: '1.25', fontWeight: '400', letterSpacing: '0' }, // 32/40
  headingMd: { fontSize: '2.5rem', lineHeight: '1.2', fontWeight: '400', letterSpacing: '0' }, // 40/48
  headingLg: { fontSize: '3.5rem', lineHeight: '1.142857', fontWeight: '400', letterSpacing: '0.004em' }, // 56/64
  displaySm: { fontSize: 'clamp(2rem, 8vw, 4.5rem)', lineHeight: '1.056', fontWeight: '400', letterSpacing: '0.004em' }, // 76px ceiling
  displayLg: { fontSize: 'clamp(2.5rem, 9vw, 5.5rem)', lineHeight: '1.05', fontWeight: '400', letterSpacing: '0.004em' }, // 88px ceiling
  displayXl: { fontSize: 'clamp(3rem, 13vw, 9.5rem)', lineHeight: '1', fontWeight: '400', letterSpacing: '0.004em' }, // 152px ceiling
};

// ---- Extension treatment: overtone ----

/**
 * One recipe with two consumers: a colour treatment for inline emphasis, and
 * a moving screen-blend layer for grayscale photographic plates. Class/
 * object split same as Pearl's luster — see DECISIONS.md.
 */
export const [tahitianExtensionClass, tahitianTreatments] = createTheme({
  overtone: {
    // Text-clip gradient is mode-specific (see split rules below); this var
    // is the dark version (dark is the default render). Light mode supplies its own literal.
    gradient: `linear-gradient(105deg, ${tahitianPearlColorsBright.peacock} 0%, ${tahitianPearlColorsBright.blue} 42%, ${tahitianPearlColorsBright.aubergine} 78%, ${tahitianPearlColorsBright.silver} 100%)`,
    // Screen-blended over a grayscale image, not read as flat text — mode-forgiving, one shared value.
    plateGradient: 'linear-gradient(105deg, rgba(47, 143, 120, 0.38) 0%, rgba(79, 136, 168, 0.34) 42%, rgba(140, 90, 125, 0.38) 78%, rgba(184, 196, 194, 0.38) 100%)',
    plateFrom: '0% 50%',
    plateTo: '100% 50%',
    plateSpeed: '8s',
  },
});

// Light mode's inlineEmphasis gradient — built from tahitianPearlColors, not
// the treatment var (one CSS custom property can't hold two values for the two mode selectors below).
const tahitianOvertoneGradientLight = `linear-gradient(105deg, ${tahitianPearlColors.peacock} 0%, ${tahitianPearlColors.blue} 42%, ${tahitianPearlColors.aubergine} 78%, ${tahitianPearlColors.silver} 100%)`;

const overtoneShift = keyframes({
  '0%, 100%': { backgroundPosition: tahitianTreatments.overtone.plateFrom },
  '50%': { backgroundPosition: tahitianTreatments.overtone.plateTo },
});

/** Apply to a grayscale photographic plate; the image remains visible below. */
export const overtonePlate = style({
  position: 'relative',
  overflow: 'hidden',
  isolation: 'isolate',
});

globalStyle(`${overtonePlate}::after`, {
  content: '',
  position: 'absolute',
  zIndex: 1,
  inset: 0,
  background: tahitianTreatments.overtone.plateGradient,
  backgroundSize: '220% 100%',
  backgroundPosition: tahitianTreatments.overtone.plateFrom,
  mixBlendMode: 'screen',
  pointerEvents: 'none',
  animation: `${overtoneShift} ${tahitianTreatments.overtone.plateSpeed} ease-in-out infinite`,
  '@media': { '(prefers-reduced-motion: reduce)': { animation: 'none' } },
});

globalStyle(`${overtonePlate} > img`, {
  display: 'block',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  filter: 'grayscale(1)',
});

// ---- Semantics (map primitives onto roles) ----

export const tahitianLightThemeClass = createTheme(vars, {
  color: {
    background: tahitianPlatinum[200],
    surface: tahitianPlatinum[100],
    overlay: tahitianScrim.light,
    overlaySubtle: 'rgba(0, 0, 0, 0.08)',

    text: tahitianCharcoal[950],
    textSubtle: tahitianPlatinum[600],
    icon: tahitianPlatinum[600],

    border: tahitianPlatinum[400],
    borderStrong: tahitianPlatinum[500],
    borderSubtle: tahitianPlatinum[300],
    borderInverse: tahitianCharcoal[800],
    shadow: tahitianPlatinum[500],

    primary: tahitianPeacock[600],
    onPrimary: tahitianPlatinum[100],
    accent: tahitianPeacock[600],
    accentHover: tahitianPeacock[700],
    accentSubtle: tahitianPeacock[300],
    onAccent: tahitianPlatinum[100],
    onAccentSubtle: tahitianCharcoal[950],
    focusRing: tahitianPeacock[600],

    // icon mixed toward textSubtle — full-strength sentiment hue reads more
    // prominent than body text despite lower contrast.
    positive: { surface: tahitianSentiment.kelp[100], border: tahitianSentiment.kelp[300], text: tahitianSentiment.kelp[700], icon: `color-mix(in srgb, ${tahitianSentiment.kelp[500]} 65%, ${vars.color.textSubtle})` },
    negative: { surface: tahitianSentiment.reef[100], border: tahitianSentiment.reef[200], text: tahitianSentiment.reef[700], icon: `color-mix(in srgb, ${tahitianSentiment.reef[500]} 65%, ${vars.color.textSubtle})` },
    warn: { surface: tahitianSentiment.dawn[100], border: tahitianSentiment.dawn[300], text: tahitianSentiment.dawn[600], icon: `color-mix(in srgb, ${tahitianSentiment.dawn[500]} 65%, ${vars.color.textSubtle})` },
    info: { surface: tahitianSentiment.wave[100], border: tahitianSentiment.wave[200], text: tahitianSentiment.wave[600], icon: `color-mix(in srgb, ${tahitianSentiment.wave[500]} 65%, ${vars.color.textSubtle})` },
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
    background: tahitianCharcoal[950],
    surface: tahitianCharcoal[900],
    overlay: tahitianScrim.dark,
    overlaySubtle: 'rgba(255, 255, 255, 0.10)',

    text: tahitianPlatinum[100],
    textSubtle: tahitianPlatinum[500],
    icon: tahitianPlatinum[500],

    border: tahitianCharcoal[800],
    borderStrong: tahitianCharcoal[700],
    borderSubtle: tahitianCharcoal[850],
    borderInverse: tahitianPlatinum[400],
    shadow: tahitianCharcoal[700],

    primary: tahitianSeaglass[400],
    onPrimary: tahitianCharcoal[950],
    accent: tahitianSeaglass[400],
    accentHover: tahitianSeaglass[300], // hover is lighter than base — the ground is near-black
    accentSubtle: tahitianCharcoal[800], // a neutral, not a seaglass step
    onAccent: tahitianCharcoal[950],
    onAccentSubtle: tahitianPlatinum[100],
    focusRing: tahitianSeaglass[400],

    positive: { surface: tahitianSentiment.kelp[800], border: tahitianSentiment.kelp[600], text: tahitianSentiment.kelp[200], icon: `color-mix(in srgb, ${tahitianSentiment.kelp[400]} 65%, ${vars.color.textSubtle})` },
    negative: { surface: tahitianSentiment.reef[800], border: tahitianSentiment.reef[600], text: tahitianSentiment.reef[300], icon: `color-mix(in srgb, ${tahitianSentiment.reef[400]} 65%, ${vars.color.textSubtle})` },
    warn: { surface: tahitianSentiment.dawn[800], border: tahitianSentiment.dawn[700], text: tahitianSentiment.dawn[200], icon: `color-mix(in srgb, ${tahitianSentiment.dawn[400]} 65%, ${vars.color.textSubtle})` },
    info: { surface: tahitianSentiment.wave[800], border: tahitianSentiment.wave[700], text: tahitianSentiment.wave[300], icon: `color-mix(in srgb, ${tahitianSentiment.wave[400]} 65%, ${vars.color.textSubtle})` },
  },
  radius: tahitianRadius,
  space: tahitianSpace,
  controlHeight: tahitianControlHeight,
  fontWeight: tahitianFontWeight,
  fontFamily: tahitianFontFamily,
  text: tahitianText,
});

inverseOverride(tahitianLightThemeClass, {
  background: tahitianCharcoal[950],
  surface: tahitianCharcoal[900],
  text: tahitianPlatinum[100],
  textSubtle: tahitianPlatinum[500],
  icon: tahitianPlatinum[500],
  accent: tahitianSeaglass[400],
  accentHover: tahitianSeaglass[300],
  accentSubtle: tahitianCharcoal[800],
  onAccent: tahitianCharcoal[950],
  onAccentSubtle: tahitianPlatinum[100],
  positive: { surface: tahitianSentiment.kelp[800], border: tahitianSentiment.kelp[600], text: tahitianSentiment.kelp[200], icon: `color-mix(in srgb, ${tahitianSentiment.kelp[400]} 65%, ${vars.color.textSubtle})` },
  negative: { surface: tahitianSentiment.reef[800], border: tahitianSentiment.reef[600], text: tahitianSentiment.reef[300], icon: `color-mix(in srgb, ${tahitianSentiment.reef[400]} 65%, ${vars.color.textSubtle})` },
  warn: { surface: tahitianSentiment.dawn[800], border: tahitianSentiment.dawn[700], text: tahitianSentiment.dawn[200], icon: `color-mix(in srgb, ${tahitianSentiment.dawn[400]} 65%, ${vars.color.textSubtle})` },
  info: { surface: tahitianSentiment.wave[800], border: tahitianSentiment.wave[700], text: tahitianSentiment.wave[300], icon: `color-mix(in srgb, ${tahitianSentiment.wave[400]} 65%, ${vars.color.textSubtle})` },
});
inverseOverride(tahitianDarkThemeClass, {
  background: tahitianPlatinum[200],
  surface: tahitianPlatinum[100],
  text: tahitianCharcoal[950],
  textSubtle: tahitianPlatinum[600],
  icon: tahitianPlatinum[600],
  accent: tahitianPeacock[600],
  accentHover: tahitianPeacock[700],
  accentSubtle: tahitianPeacock[300],
  onAccent: tahitianPlatinum[100],
  onAccentSubtle: tahitianCharcoal[950],
  positive: { surface: tahitianSentiment.kelp[100], border: tahitianSentiment.kelp[300], text: tahitianSentiment.kelp[700], icon: `color-mix(in srgb, ${tahitianSentiment.kelp[500]} 65%, ${vars.color.textSubtle})` },
  negative: { surface: tahitianSentiment.reef[100], border: tahitianSentiment.reef[200], text: tahitianSentiment.reef[700], icon: `color-mix(in srgb, ${tahitianSentiment.reef[500]} 65%, ${vars.color.textSubtle})` },
  warn: { surface: tahitianSentiment.dawn[100], border: tahitianSentiment.dawn[300], text: tahitianSentiment.dawn[600], icon: `color-mix(in srgb, ${tahitianSentiment.dawn[500]} 65%, ${vars.color.textSubtle})` },
  info: { surface: tahitianSentiment.wave[100], border: tahitianSentiment.wave[200], text: tahitianSentiment.wave[600], icon: `color-mix(in srgb, ${tahitianSentiment.wave[500]} 65%, ${vars.color.textSubtle})` },
});

// PearlSphere reads pearlTreatments.luster.* — vars Tahitian never applies —
// so left alone it renders empty and disappears against near-black. Bespoke
// three-radial sphere (pale mint highlight, faint pink blush, dark
// green-black body), static, no sweep.
globalStyle(
  `${tahitianLightThemeClass} .${sphereBody}, ${tahitianDarkThemeClass} .${sphereBody}`,
  {
    backgroundImage: [
      'radial-gradient(circle at 36% 28%, rgba(214, 232, 226, 0.95), transparent 42%)',
      'radial-gradient(circle at 62% 76%, rgba(216, 164, 192, 0.4), transparent 52%)',
      'radial-gradient(circle at 50% 50%, #3A4642 20%, #161C1A 85%)',
    ].join(', '),
    backgroundSize: '100% 100%, 100% 100%, 100% 100%',
    backgroundPosition: 'center, center, center',
    boxShadow: '0 24px 48px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
    animation: 'none',
  },
);

// Dark mode only: nav wordmark forced white against near-black. Light
// mode's pale surface would hide the same white, so it falls back to color.text.
globalStyle(`${tahitianDarkThemeClass} [data-component="brand-wordmark"]`, {
  color: tahitianPlatinum[100],
});

// Preheading face — unconditional.
globalStyle(
  `${tahitianLightThemeClass} [data-role="preheading"], ${tahitianDarkThemeClass} [data-role="preheading"]`,
  {
    fontFamily: tahitianFonts.mono,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
);

// Default size only — gated on :not([data-type-scale]) so an explicit
// typeScale wins (see matching note in pearl.css.ts). Without this a
// preheading inherits the ambient scale and renders at body size.
globalStyle(
  `${tahitianLightThemeClass} [data-role="preheading"]:not([data-type-scale]), ${tahitianDarkThemeClass} [data-role="preheading"]:not([data-type-scale])`,
  {
    fontSize: vars.text.caption.fontSize,
    lineHeight: vars.text.caption.lineHeight,
  },
);

// Split by mode — background-clip: text renders these as foreground text,
// so each mode needs stops that pass contrast against its surface.
globalStyle(`${tahitianLightThemeClass} [data-role="inlineEmphasis"]`, {
  background: tahitianOvertoneGradientLight,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  WebkitTextFillColor: 'transparent',
});

globalStyle(`${tahitianDarkThemeClass} [data-role="inlineEmphasis"]`, {
  background: tahitianTreatments.overtone.gradient,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  WebkitTextFillColor: 'transparent',
});

globalStyle(
  `${tahitianLightThemeClass} .${fieldMeta} .${fieldLabel}, ${tahitianDarkThemeClass} .${fieldMeta} .${fieldLabel}`,
  { fontFamily: tahitianFonts.mono, textTransform: 'uppercase', letterSpacing: '0.10em' },
);

globalStyle(
  `${tahitianLightThemeClass} [data-component="button"], ${tahitianDarkThemeClass} [data-component="button"]`,
  {
    fontFamily: tahitianFonts.mono,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    fontSize: tahitianText.bodySm.fontSize,
    paddingTop: tahitianSpace.lg, // airier than a standard CTA — still theme tokens
    paddingBottom: tahitianSpace.lg,
  },
);

// Dark mode primary: light accent wash + real accent border — wash alone
// doesn't read as emphasised against near-black. Light mode gets a solid
// fill instead (below): translucent wash reads weaker on a pale surface.
globalStyle(`${tahitianDarkThemeClass} [data-component="button"][data-variant="primary"]`, {
  background: `color-mix(in srgb, ${vars.color.accent} 8%, transparent)`,
  color: vars.color.accent,
  border: `1px solid ${vars.color.accent}`,
  boxShadow: 'none',
});

globalStyle(
  `${tahitianDarkThemeClass} [data-component="button"][data-variant="primary"]:not(:disabled):hover`,
  {
    background: `color-mix(in srgb, ${vars.color.accent} 22%, transparent)`,
    // Restated at :hover — base recipe's :hover rule outranks this file's
    // default-state boxShadow: none once :hover matches.
    boxShadow: 'none',
    transform: 'none',
  },
);

// Secondary: unfilled, but never unbordered. Base recipe fills it with
// color.surface (charcoal[900]), reading as a grey slab that disappears on a
// surface panel. Dropping the fill fixes that; dropping the border too would
// break alignment and blur button vs. link — see control-affordances.md.
// borderStrong, not border: color.border against charcoal[950] is under
// 1.4:1, reads as no edge.
globalStyle(`${tahitianDarkThemeClass} [data-component="button"][data-variant="secondary"]`, {
  background: 'transparent',
  border: `1px solid ${vars.color.borderStrong}`,
});

// Light mode primary: near-opaque accent fill. 92%, not 100% — fully solid
// reads flatter than the rest of Tahitian's restrained fills.
globalStyle(`${tahitianLightThemeClass} [data-component="button"][data-variant="primary"]`, {
  background: `color-mix(in srgb, ${vars.color.accent} 92%, transparent)`,
  color: vars.color.onAccent,
  boxShadow: 'none',
});

globalStyle(
  `${tahitianLightThemeClass} [data-component="button"][data-variant="primary"]:not(:disabled):hover`,
  { background: vars.color.accentHover, boxShadow: 'none', transform: 'none' },
);

// Secondary reads quieter than primary — subtle text against the bordered,
// unfilled control.
globalStyle(
  `${tahitianLightThemeClass} [data-component="button"][data-variant="secondary"], ${tahitianDarkThemeClass} [data-component="button"][data-variant="secondary"]`,
  { color: vars.color.textSubtle },
);

// Secondary's hover stays neutral in both modes — primary uses the accent
// border for emphasis; secondary borrowing it would blur the two. Light
// steps the border up its ramp; dark (already borderStrong at rest) lifts a
// neutral wash instead. Both bring the label to full text.
globalStyle(
  `${tahitianLightThemeClass} [data-component="button"][data-variant="secondary"]:not(:disabled):hover`,
  { borderColor: vars.color.borderStrong, color: vars.color.text, boxShadow: 'none' },
);

globalStyle(
  `${tahitianDarkThemeClass} [data-component="button"][data-variant="secondary"]:not(:disabled):hover`,
  {
    background: `color-mix(in srgb, ${vars.color.text} 8%, transparent)`,
    borderColor: vars.color.borderStrong,
    color: vars.color.text,
    boxShadow: 'none',
  },
);

globalStyle(
  `${tahitianLightThemeClass} [data-type-scale="headingSm"], ${tahitianLightThemeClass} [data-type-scale="headingMd"], ${tahitianLightThemeClass} [data-type-scale="headingLg"], ${tahitianLightThemeClass} [data-type-scale="displaySm"], ${tahitianLightThemeClass} [data-type-scale="displayLg"], ${tahitianLightThemeClass} [data-type-scale="displayXl"], ${tahitianDarkThemeClass} [data-type-scale="headingSm"], ${tahitianDarkThemeClass} [data-type-scale="headingMd"], ${tahitianDarkThemeClass} [data-type-scale="headingLg"], ${tahitianDarkThemeClass} [data-type-scale="displaySm"], ${tahitianDarkThemeClass} [data-type-scale="displayLg"], ${tahitianDarkThemeClass} [data-type-scale="displayXl"]`,
  { textTransform: 'uppercase' },
);

// Caps have no descenders — a stacked display headline wants tight leading,
// or lines read as separate strips. Display steps only; headings keep the base.
globalStyle(
  `${tahitianLightThemeClass} [data-type-scale="displaySm"], ${tahitianLightThemeClass} [data-type-scale="displayLg"], ${tahitianLightThemeClass} [data-type-scale="displayXl"], ${tahitianDarkThemeClass} [data-type-scale="displaySm"], ${tahitianDarkThemeClass} [data-type-scale="displayLg"], ${tahitianDarkThemeClass} [data-type-scale="displayXl"]`,
  { lineHeight: '0.95' },
);
