import { createTheme, globalStyle, keyframes } from '@vanilla-extract/css';
import { vars } from '@/theme.css';
import { inverseOverride } from '@/foundations/inverseOverride';
import { fieldMeta, label as fieldLabel, hint as fieldHint, errorText as fieldErrorText } from '@components/Field/Field.css';
import { sphereWrap, body as sphereBody, contact as sphereContact } from '@components/_brand/PearlSphere/PearlSphere.css';

/**
 * South Sea — "Golden Hour Maison". Flat warm ecru surface, chocolate ink,
 * conch (`#E8A184`) doing exactly one small loud thing per view, radius 0
 * throughout. Identity is type/space/restraint — no ambient effect.
 *
 * One hover-only exception: a static gilt sphere that sweeps once engaged
 * ("golden hour, held still" until then). Light mode gets a shell-toned
 * counterpart in South Sea's own register — it can't fall through to Pearl's
 * sphere, which reads `pearlTreatments` vars this theme never applies.
 *
 * Type: roman + italic serif (Zodiak roman / Times italic — see `serifItalic`)
 * with a hairline rule in the gap; Boska for headings and display.
 *
 * Two colour tiers: `*Sand`/`*Driftwood`/`*Conch` are raw single-hue scales
 * (verified with HSL math — one target hue per scale); the `*ThemeClass` calls
 * map them onto semantic roles. Scales are this theme's own.
 */

/**
 * Light-register neutral, one warm ecru hue (38°) stepped 100 (brightest) →
 * 600. Only spans its light end; the dark register is `southSeaDriftwood`.
 */
export const southSeaSand = {
  /** page background (light) */
  100: '#F5EFE4',
  /** text (dark mode) / inverse text (light mode) — its own step, a different contrast job */
  150: '#F3EADA',
  /** raised surface (light) */
  200: '#EFE6D6',
  /** border, subtle (light) */
  300: '#E9E0D0',
  /** border (light) */
  400: '#DDD1BC',
  /** borderStrong / shadow (light) — 4.6:1 on sand[100] */
  500: '#CBBA9E',
  /** text, subtle (light) — 4.88:1 on background, 4.51:1 on surface */
  600: '#746650',
};

/**
 * Dark-register neutral, one chocolate/umber hue (27°) stepped 500 → 900.
 * `750` is the exception — light mode's ink — kept here as the same hue family,
 * a step tuned for a different background.
 */
export const southSeaDriftwood = {
  /** text, subtle (dark) */
  500: '#B8A18E',
  /** borderStrong (dark) */
  600: '#5E4632',
  /** border (dark) */
  700: '#4A3626',
  /** text (light mode) */
  750: '#3B2C1F',
  /** border, subtle (dark) */
  800: '#382719',
  /** raised surface (dark) */
  850: '#2E2116',
  /** page background (dark) */
  900: '#241A11',
};

/**
 * The accent hue — conch (19°) — spent as "one small loud thing per view".
 * One scale reused across both modes. Every step carries conch's chroma; any
 * step that drifts toward neutral is a neutral misfiled here (neutral roles
 * belong to `sand`/`driftwood`).
 *
 * `300` is a mode-invariant swatch doing four jobs — `primary` fill and
 * `accent` in both modes — and a fill and a text colour have opposite contrast
 * needs against the ecru ground. No single value satisfies both, so in light
 * mode only, `accent` splits from `primary`: `300` keeps the fill, `400`/`500`
 * (deeper, less saturated) take the roles that land as text.
 */
export const southSeaConch = {
  /** accentSubtle, light mode */
  100: '#FBE8DF',
  /** accentHover, dark mode */
  200: '#F0B79C',
  /** primary (both modes) / accent (dark mode) */
  300: '#E8A484',
  /** accent + focusRing, light mode */
  400: '#A0522F',
  /** accentHover, light mode */
  500: '#713E26',
};

const southSeaScrim = {
  light: 'rgba(59, 42, 31, 0.5)',
  dark: 'rgba(0, 0, 0, 0.6)',
};

// Sentiment families — one 100→800 scale per hue, shared by both modes. Warm
// throughout to match the maison palette: `seaMoss` (a moss green, not a cool
// mint), `pacific` (a muted steel-teal, not a saturated blue) — so `info`/
// `positive` sit in the same register as `anemone`/`shell` rather than reading
// as imports from another theme.
export const southSeaSentiment = {
  seaMoss: { 100: '#e7edde', 200: '#c5d3b1', 300: '#a5bb86', 400: '#8aa762', 500: '#657c46', 600: '#506237', 700: '#3d4b2a', 800: '#202716' },
  anemone: { 100: '#fdeceb', 200: '#f4b9b4', 300: '#f5a8a0', 400: '#e8574a', 500: '#d64036', 600: '#8f1d17', 700: '#7a2f28', 800: '#2a1513' },
  shell: { 100: '#fdf3e2', 200: '#f2d59b', 300: '#f0cd7a', 400: '#e0a52a', 500: '#d9920b', 600: '#6e5316', 700: '#7a4d09', 800: '#28200f' },
  pacific: { 100: '#e7efee', 200: '#c3d6d4', 300: '#a1bfbd', 400: '#6e9694', 500: '#4c7573', 600: '#395857', 700: '#2c4442', 800: '#16211f' },
};

/** Radius 0 — hard-edged by identity; derived radii stay square. */
const southSeaRadius = { control: '0px', full: '9999px', nesting: '0', cornerShape: 'round' };
// rem, not px — scales with the user's base font-size preference (see pearl.css.ts).
const southSeaSpace = { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem', '2xl': '3rem' };
const southSeaControlHeight = { sm: '2rem', md: '2.5rem', lg: '3rem', xl: '3.5rem' };
const southSeaFontWeight = { regular: '400', medium: '500', semibold: '600', bold: '700' };

export const southSeaFonts = {
  serif: "'Zodiak', Georgia, 'Times New Roman', serif",
  /**
   * The italic half of the roman/italic mix — Times, deliberately. The design
   * canvas was authored against `font-family: Zodiak` but never requested a
   * Zodiak italic, so every italic there fell through to Times Italic and was
   * signed off in it. Times' calligraphic italic is the maison voice; Zodiak's
   * is squarer. So the fallback is promoted to the intended face rather than
   * "corrected". `Times` before `'Times New Roman'` for the exact macOS face.
   */
  serifItalic: "Times, 'Times New Roman', Georgia, serif",
  sans: "'General Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  /** Boska (Fontshare) — headings (sentence case) and display (uppercase), one weight. */
  boska: "'Boska', Georgia, serif",
};
const southSeaFontFamily = {
  display: southSeaFonts.serif,
  heading: southSeaFonts.serif,
  body: southSeaFonts.sans,
  mono: "ui-monospace, 'SF Mono', Menlo, monospace",
};
// Sizes follow the shared 4px-grid ramp (see pearl.css.ts); weight/tracking are South Sea's own.
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
    // `accent` and `primary` take different steps of conch in light mode — a
    // fill and a text colour have opposite contrast needs against the ecru
    // ground (see `southSeaConch`). Measured on `sand[200]` (the harder
    // ground): `accent` 4.52:1, `accentHover` 7.03:1.
    primary: southSeaConch[300],
    onPrimary: southSeaDriftwood[750],
    accent: southSeaConch[400],
    accentHover: southSeaConch[500],
    accentSubtle: southSeaConch[100],
    // `sand[150]`, not `driftwood[750]`: `accent` is a deep step now, so text
    // on it comes from the light register. Cream measures 4.7:1.
    onAccent: southSeaSand[150],
    onAccentSubtle: southSeaDriftwood[750],
    focusRing: southSeaConch[400],
    // `icon` mixed toward `textSubtle` — full-strength sentiment hue reads more
    // prominent than body text despite lower contrast (saturation drives
    // perceived prominence).
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
    // A shadow is occlusion — it must darken. Every neutral this theme owns in
    // dark mode is lighter than `background` (which is the darkest step), so
    // this is a fixed value below the ramp, on driftwood's warm hue.
    shadow: 'rgba(18, 11, 5, 0.55)',
    // `onPrimary`/`onAccent`/`accentSubtle` read from `driftwood`, not conch —
    // a text foreground and a dark-mode background are neutral jobs, and conch
    // is accent-only.
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
});
inverseOverride(southSeaDarkThemeClass, {
  background: southSeaSand[100],
  surface: southSeaSand[200],
  text: southSeaDriftwood[750],
  textSubtle: southSeaSand[600],
  icon: southSeaSand[600],
});

// ---- Role treatments (roles declared in south-sea.roles.ts) ----
// `Text` only ever writes `data-role`; each theme decides here what it looks
// like. All mode-agnostic — none of these reference a colour except
// `inlineEmphasis`, which is contrast-checked against both grounds in both
// modes (light 4.90:1 / 4.53:1, dark 8.18:1 / 7.49:1).

// `inlineEmphasis` — plain accent-coloured text, not the serif mix.
globalStyle(`${southSeaLightThemeClass} [data-role="inlineEmphasis"], ${southSeaDarkThemeClass} [data-role="inlineEmphasis"]`, {
  color: vars.color.accent,
});

// The brand wordmark is the maison's italic — Times, neutral ink. Its own rule
// (not a `role`) so no scale can override it. The `span` qualifier lifts it
// past the same-specificity `[data-type-scale="heading*"]` Boska rule below.
globalStyle(
  `${southSeaLightThemeClass} span[data-component="brand-wordmark"], ${southSeaDarkThemeClass} span[data-component="brand-wordmark"]`,
  {
    fontFamily: southSeaFonts.serifItalic,
    fontStyle: 'italic',
    letterSpacing: 'normal',
    color: vars.color.text,
  },
);

// Body text borrows the italic voice for variety — these scale steps switch to
// the italic face outright rather than needing `role="inlineEmphasis"` per call
// site. Each scale keeps its own letter-spacing.
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

// Compensating size bump for the face swap above. Times' x-height sits ~0.448em
// — a "16px" Times paragraph reads like a 13–14px sans one. Rather than inflate
// the shared token (and Button/Input's already-correct size), each step is
// bumped 12.5% here, at the selector that owns the face swap. Line-heights are
// re-picked on the 4px grid at the new sizes.
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

// Headings: Boska, sentence case, roman, Regular. `letterSpacing: 'normal'`
// drops `southSeaText`'s per-step negative tracking — those values were tuned
// for Zodiak/Times, and Boska runs tight enough at the same tracking that
// letters touch at `headingLg`.
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

// Display: Boska, uppercase, roman, Regular. Same `letterSpacing: 'normal'`
// reasoning as headings. The nested `[data-role="inlineEmphasis"]` selector
// stops an inline-emphasised word inheriting the theme's italic Times — Boska
// has no relationship to the roman/italic mix.
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
    // Caps have no descenders — display leading goes tighter than the base,
    // not looser. Boska sits a hair tall, so not as tight as Freshwater's.
    lineHeight: '0.96',
  },
);
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

// Field's label — a plain element, so it carries no `data-*` and falls outside
// every rule above. Matched to `preheading`'s treatment: General Sans, Light,
// uppercase, `textSubtle`, with its own tighter tracking (a label above an
// input reads too loose at `preheading`'s `0.28em`). `fontWeight: '300'`
// deliberately escapes `southSeaFontWeight` — one caller wants a real Light cut.
globalStyle(`${southSeaLightThemeClass} .${fieldMeta} .${fieldLabel}, ${southSeaDarkThemeClass} .${fieldMeta} .${fieldLabel}`, {
  fontFamily: southSeaFonts.sans,
  fontWeight: '300',
  textTransform: 'uppercase',
  letterSpacing: '0.14em',
  color: vars.color.textSubtle,
});

// Input value + hint/error copy — all body prose, so all run the italic voice.
// `errorText`/`requiredMark` sentiment colour is untouched — only the face changes.
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

// Bare caption-scale text (button text, standalone captions) — General Sans,
// uppercase, `preheading`'s airy `0.28em`. `southSeaText.caption`'s own
// tracking is `0`, tuned for mixed case.
globalStyle(`${southSeaLightThemeClass} [data-type-scale="caption"], ${southSeaDarkThemeClass} [data-type-scale="caption"]`, {
  fontFamily: southSeaFonts.sans,
  textTransform: 'uppercase',
  letterSpacing: '0.28em',
});

// Uppercase button text at the canon recipe's padding/size reads cramped — caps
// run wider than mixed case. Wider padding, a size down, and tracking.
globalStyle(`${southSeaLightThemeClass} [data-component="button"], ${southSeaDarkThemeClass} [data-component="button"]`, {
  fontFamily: southSeaFonts.sans,
  textTransform: 'uppercase',
  fontSize: vars.text.bodySm.fontSize,
  letterSpacing: '0.14em',
  paddingLeft: vars.space.lg,
  paddingRight: vars.space.lg,
});

// `preheading` — the `/ LABEL /` idiom at caption size.
globalStyle(`${southSeaLightThemeClass} [data-role="preheading"], ${southSeaDarkThemeClass} [data-role="preheading"]`, {
  fontFamily: southSeaFonts.sans,
  textTransform: 'uppercase',
  letterSpacing: '0.28em',
});

// `dataDigits` aliases to the plain sans — no tabular mono face in this theme.
globalStyle(`${southSeaLightThemeClass} [data-role="dataDigits"], ${southSeaDarkThemeClass} [data-role="dataDigits"]`, {
  fontFamily: southSeaFonts.sans,
});

// The shared Button recipe's primary carries an `inset` top-highlight sized for
// Pearl's near-fill-hued `accentSubtle`. South Sea's is a light wash, so that
// inset reads as a stark seam. South Sea has no effect at all, so it's dropped
// entirely; a background hue-shift carries hover/press feedback instead.
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
    // Restated at `:hover` — the base recipe's own `:hover` rule outranks this
    // file's resting `boxShadow: none` once `:hover` matches. In light mode,
    // with `accent` split onto the deep `conch[400]`, mixing 15% into the fill
    // reads as a real state change; dark mode mixes conch with conch (both
    // roles hold `300`) and is unchanged.
    backgroundColor: `color-mix(in srgb, ${vars.color.primary} 85%, ${vars.color.accent})`,
    boxShadow: 'none',
    transform: 'none',
  },
);

// ---- The golden-hour sphere (hover-triggered) ----
//
// `PearlSphere` reads `pearlTreatments.luster` directly (bespoke brand artwork,
// not a themeable canon component), so a different sphere means overriding its
// two styled elements here — the same mechanism Tahitian uses. Values are a
// best-effort match to the reference's labelled hues, not a pixel-exact port.

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

// Static by default ("golden hour, held still") — the sheen sits fully off to
// one side and only the hover rule sets it sweeping. This is why the override
// replaces `PearlSphere.css.ts`'s always-on `sweep` rather than adding to it —
// that keyframe is baked to Pearl's own sheen positions.
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

// Light mode's counterpart — required, not optional: unstyled, `PearlSphere`'s
// gradients resolve `pearlTreatments` vars to nothing and the sphere vanishes
// on the ecru ground. The nacre reads white, not ecru — a tinted body dissolves
// into `sand[100]`; value separation comes from the terminator and contact
// shadow, leaving the body free to run brighter than the background.
const southSeaLightSheenBand = `linear-gradient(115deg, transparent 34%, rgba(255, 255, 255, 0.65) 45%, rgba(255, 255, 255, 0.95) 52%, rgba(255, 255, 255, 0.55) 58%, transparent 70%)`;
const southSeaLightBloom = `radial-gradient(circle at 64% 76%, rgba(251, 232, 223, 0.6), transparent 54%)`;
const southSeaLightBody = `radial-gradient(circle at 34% 27%, #FFFFFF 0%, #FFFFFF 28%, #FDFBF6 46%, #F7F0E5 63%, #EADCC6 82%, #D2BE9F 100%)`;

// Three-position keyframe (not `southSeaSweep`'s two): CSS cycles a short
// `background-position` list across the layer count, so three layers need three
// positions with `center, center` pinning the bloom and body.
const southSeaLightSweep = keyframes({
  '0%, 100%': { backgroundPosition: `${southSeaSheenFrom}, center, center` },
  '50%': { backgroundPosition: `${southSeaSheenTo}, center, center` },
});

globalStyle(`${southSeaLightThemeClass} .${sphereBody}`, {
  backgroundImage: `${southSeaLightSheenBand}, ${southSeaLightBloom}, ${southSeaLightBody}`,
  backgroundPosition: `${southSeaSheenFrom}, center, center`,
  // The drop shadow does the lifting the body no longer does; the two insets
  // keep a white sphere from going flat (warm occlusion arc + hard white crown).
  boxShadow: `0 20px 44px rgba(120, 106, 83, 0.34), inset 0 -10px 26px rgba(120, 106, 83, 0.3), inset 5px 4px 16px rgba(255, 255, 255, 0.9)`,
  animation: 'none',
});

globalStyle(`${southSeaLightThemeClass} .${sphereWrap}:hover .${sphereBody}`, {
  animation: `${southSeaLightSweep} 4.5s ease-in-out infinite`,
});

globalStyle(`${southSeaLightThemeClass} .${sphereContact}`, {
  background: `radial-gradient(ellipse at center, rgba(120, 106, 83, 0.42), transparent 68%)`,
});
