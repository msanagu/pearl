import { createTheme, globalStyle } from '@vanilla-extract/css';
import { vars } from '@/theme.css';
import { inverseOverride } from '@/foundations/inverseOverride';

/**
 * Pearl — the flagship theme, and the one the docs site is pinned to.
 *
 * Sans-first: General Sans carries display/heading/body; Gambetta italic is a
 * rare accent (the wordmark, inline interjections). The colour contract needs
 * slots the visual language never specified (sentiment families, border ranks,
 * inverse pairs) — those are authored here and marked `[authored]`, to review
 * as new work rather than canon.
 *
 * `pearlTreatments.luster` is a per-theme extension, not a shared contract slot
 * — see DECISIONS.md (theme extensions); its roles are declared in
 * `pearl.roles.ts`.
 */

// ---- Type primitives (named by what they are — no roles assigned here) ----
// General Sans and Gambetta (both Fontshare) load via the CDN link South Sea
// already pulls (`.storybook/preview-head.html`); named here so Pearl's stack
// resolves to them instead of system-ui.
export const pearlFonts = {
  sans: "'General Sans', system-ui, -apple-system, 'Segoe UI', sans-serif",
  serif: "'Gambetta', Georgia, 'Times New Roman', serif",
  mono: "ui-monospace, 'SF Mono', Menlo, monospace",
};

// ---- Colour primitives ----
//
// Three hue families, each stepped 100 (lightest) → 900 (darkest). Dark mode is
// not a second palette — it reads the same family at different steps, so a step
// number means the same lightness in both modes.
//
// - `alabaster` — warm neutral, pale end only. Pearl never uses a dark step of
//   this hue (that register is squidInk's).
// - `squidInk` — cool near-black neutral: dark-mode background/surface/border.
//   Dark-mode text borrows `alabaster[300]` directly rather than aliasing a
//   `squidInk[100]` that would claim a hue coherence it doesn't have.
// - `urchin` — cool violet. Quiet work only (focus ring, tints, subtle text,
//   accent); never a fill.
export const alabaster = {
  /** secondary control top-stop / onAccent */
  100: '#FDFCFA',
  /** raised surface */
  200: '#FBFAF7',
  /** page background */
  300: '#F5F3EF',
  /** one step lighter than 500 */
  400: '#EAE7E0',
  /** default border */
  500: '#DEDAD2',
};

/**
 * Neutral dark register. Steps are spaced by even *contrast* (not even OKLCH
 * L), a single hue (~297°), each ~1.4:1 against the step below — checked with
 * `validate/contrast.ts`. `900` is the canon ink anchor everything else is
 * solved against; `850`/`750` fill the gap up from it so `surface` reads above
 * `background` without a hard jump.
 */
export const squidInk = {
  /** surfaceHover doubles as a faint border */
  750: '#484550',
  /** raised surface */
  850: '#323037',
  /** primary text (light) / page background (dark) */
  900: '#17161A',
};

/**
 * Urchin — Pearl's violet family, chromatic across the whole ramp. Chroma
 * follows an eased curve (`0.008 + 0.072·t^1.3`) so the light end does quiet
 * UI-chrome work without reading as visibly violet, while `accent` (`600`)
 * still separates from `textSubtle` (`500`) by both value and hue. Every
 * text/border pairing that lands on this ramp is contrast-checked against the
 * step it actually uses, not assumed from prior values.
 */
export const urchin = {
  /** accentSubtle (light) / accent + focusRing (dark) */
  100: '#D7D6DE',
  /** body copy, dark mode */
  200: '#BCB9C8',
  /** emphasis border, light mode */
  300: '#A49DB5',
  /** emphasis border (dark) / accentSubtle (dark) / borderInverse (light) */
  400: '#8B82A3',
  /** body copy (light) / border (dark) */
  500: '#746893',
  /** accent + focusRing, light mode */
  600: '#5E4C81',
  /** accentHover, light mode */
  700: '#483072',
};

/**
 * `[authored]` Alpha palettes — neutral steps re-rendered at partial opacity,
 * keyed by percent, so they composite over whatever's underneath. Two anchors:
 * `squidInkAlpha` cool, `alabasterAlpha` warm — squidInk has no pale step to
 * use instead. Not anchored on the accent: most themes' accent is a saturated
 * brand hue, so an accent-anchored wash is neutral here only by coincidence.
 */
export const squidInkAlpha = {
  10: 'rgba(23, 22, 26, 0.10)',
  55: 'rgba(23, 22, 26, 0.55)',
};

export const alabasterAlpha = {
  10: 'rgba(245, 243, 239, 0.10)',
};

// `[authored]` Sentiment families — one 100→800 scale per hue, shared by both
// modes on the same rule as the neutrals. Text contrast 4.5:1+, icon 3:1+ in
// both modes (checked with the a11y addon). Not re-audited for the other three
// themes.
export const pearlSentiment = {
  algae: { 100: '#E8EDE6', 200: '#BCCBB8', 300: '#9BD3A6', 400: '#5FA36E', 500: '#4A7350', 600: '#33553B', 700: '#2C4A32', 800: '#16201A' },
  coral: { 100: '#F3E8E5', 200: '#DCBCB5', 300: '#EFA89C', 400: '#D46B5B', 500: '#A34C40', 600: '#733A31', 700: '#71322A', 800: '#281815' },
  sunlight: { 100: '#F3EDE1', 200: '#E4CA92', 300: '#D9C6A0', 400: '#C6A055', 500: '#8F7434', 600: '#6B5622', 700: '#634F22', 800: '#241E10' },
  tide: { 100: '#E7EAEF', 200: '#BCC4D3', 300: '#B9C3D6', 400: '#7E8CA8', 500: '#546480', 600: '#3A455C', 700: '#364156', 800: '#171A21' },
};

// ---- Scales (Pearl's own — themes do not share a scale file) ----

/**
 * Controls are a rounded rect, not a pill. A pill's painted radius is
 * `height / 2` (21px at Pearl's 42px control), which leaves no room for
 * concentric nesting against any card radius. 12px keeps ~43% of the vertical
 * edge straight, so it reads as a rectangle, and sits below `surface` (16px) —
 * inner smaller than outer. `full` stays a pill for Tag and XButton by
 * identity.
 */
const pearlRadius = { control: '8px', full: '9999px', nesting: '1', cornerShape: 'squircle' };

/**
 * `[authored]` `usage.density = comfortable` — the midpoint of the four themes.
 * rem, not px (16px root), so spacing scales with the user's base font-size
 * preference, not just page zoom.
 */
const pearlSpace = { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem', '2xl': '3rem' };

/** `md` = 42px; the rest derived around it. rem for the same reason as `pearlSpace`. */
const pearlControlHeight = { sm: '2.125rem', md: '2.625rem', lg: '3rem', xl: '3.5rem' };

const pearlFontWeight = { regular: '400', medium: '500', semibold: '600', bold: '700' };

/** All three canon roles are the grotesk. Serif is an accent, not a role. */
const pearlFontFamily = {
  display: pearlFonts.sans,
  heading: pearlFonts.sans,
  body: pearlFonts.sans,
  mono: pearlFonts.mono,
};

/**
 * Every `fontSize` is a 4px multiple except `caption` (11px — the legibility
 * floor for functional UI text; 8px is below it, 12px collides with `bodySm`).
 * `lineHeight` is chosen so the resolved pixel value still lands on 4px.
 */
const pearlText = {
  caption: { fontSize: '0.6875rem', lineHeight: '1.4545', fontWeight: '400', letterSpacing: '0' }, // 11/16
  bodySm: { fontSize: '0.75rem', lineHeight: '1.6667', fontWeight: '400', letterSpacing: '0' }, // 12/20
  bodyMd: { fontSize: '1rem', lineHeight: '1.5', fontWeight: '400', letterSpacing: '0' }, // 16/24
  bodyLg: { fontSize: '1.5rem', lineHeight: '1.5', fontWeight: '400', letterSpacing: '0' }, // 24/36
  headingSm: { fontSize: '2rem', lineHeight: '1.25', fontWeight: '500', letterSpacing: '-0.01em' }, // 32/40
  headingMd: { fontSize: '2.5rem', lineHeight: '1.2', fontWeight: '500', letterSpacing: '-0.015em' }, // 40/48
  headingLg: { fontSize: '3.5rem', lineHeight: '1.142857', fontWeight: '500', letterSpacing: '-0.02em' }, // 56/64
  displaySm: { fontSize: 'clamp(2rem, 8vw, 4.5rem)', lineHeight: '1.056', fontWeight: '500', letterSpacing: '-0.03em' }, // 76px ceiling, clamped fluid below
  displayLg: { fontSize: 'clamp(2.5rem, 9vw, 5.5rem)', lineHeight: '1.05', fontWeight: '500', letterSpacing: '-0.04em' }, // 88px ceiling
  displayXl: { fontSize: 'clamp(3rem, 13vw, 9.5rem)', lineHeight: '1', fontWeight: '500', letterSpacing: '-0.045em' }, // 152px ceiling
};

// ---- Canon theme (light) ----

export const pearlLightThemeClass = createTheme(vars, {
  color: {
    background: alabaster[300],
    surface: alabaster[200],
    overlay: squidInkAlpha[55],
    overlaySubtle: squidInkAlpha[10],

    text: squidInk[900],
    textSubtle: urchin[500],
    icon: urchin[500],

    border: alabaster[500],
    borderStrong: urchin[300],
    borderSubtle: alabaster[400],
    // Accent register, not a fourth gray. 3.61:1 vs the dark-mode surface.
    borderInverse: urchin[400],
    shadow: urchin[300],

    // Primary CTA fill — a flat approximation of the dark gradient (no gradient
    // token in the contract yet; see DECISIONS.md).
    primary: squidInk[900],
    onPrimary: alabaster[300],

    // Pearl is ink-primary, but `accent` stays genuinely subtle — it is not the
    // button fill (`primary`). Reusing accent for both would make every subtle
    // use (focus borders, underlines, hover) go loud too. `accentHover` is one
    // even step past `accent`, not prose ink.
    accent: urchin[600],
    accentHover: urchin[700],
    accentSubtle: urchin[100],
    onAccent: alabaster[300],
    onAccentSubtle: squidInk[900],
    // `urchin[600]`, not `[100]`: `urchin[100]` is 1.3:1 on light-mode
    // background (invisible), `[600]` is 6.6:1. Dark mode keeps `[100]`
    // (12.5:1 on dark-mode background) — same relationship, different step.
    focusRing: urchin[600],

    // `icon` is mixed toward `textSubtle` — the raw sentiment hue at full
    // strength reads more prominent than body text despite a lower contrast
    // ratio (saturation drives perceived prominence). 65% keeps the hue
    // identifiable while quieting it.
    positive: { surface: pearlSentiment.algae[100], border: pearlSentiment.algae[200], text: pearlSentiment.algae[700], icon: `color-mix(in srgb, ${pearlSentiment.algae[500]} 65%, ${vars.color.textSubtle})` },
    negative: { surface: pearlSentiment.coral[100], border: pearlSentiment.coral[200], text: pearlSentiment.coral[700], icon: `color-mix(in srgb, ${pearlSentiment.coral[500]} 65%, ${vars.color.textSubtle})` },
    warn: { surface: pearlSentiment.sunlight[100], border: pearlSentiment.sunlight[300], text: pearlSentiment.sunlight[700], icon: `color-mix(in srgb, ${pearlSentiment.sunlight[500]} 65%, ${vars.color.textSubtle})` },
    info: { surface: pearlSentiment.tide[100], border: pearlSentiment.tide[200], text: pearlSentiment.tide[700], icon: `color-mix(in srgb, ${pearlSentiment.tide[500]} 65%, ${vars.color.textSubtle})` },
  },
  radius: pearlRadius,
  space: pearlSpace,
  controlHeight: pearlControlHeight,
  fontWeight: pearlFontWeight,
  fontFamily: pearlFontFamily,
  text: pearlText,
});

// ---- Canon theme (dark) ----

export const pearlDarkThemeClass = createTheme(vars, {
  color: {
    background: squidInk[900],
    surface: squidInk[850],
    overlay: 'rgba(0, 0, 0, 0.62)', // pure black — a backdrop must always darken, and squidInk has no dark-appropriate pale step to flip to
    overlaySubtle: alabasterAlpha[10],

    text: alabaster[300], // borrowed directly, not a squidInk step — see squidInk's own comment above
    textSubtle: urchin[200],
    icon: urchin[200],

    // Accent register, not a `squidInk` step. 3.55:1 vs `background`, one step
    // quieter than `borderStrong` so the two separate.
    border: urchin[500],
    borderStrong: urchin[400],
    borderSubtle: squidInk[750],
    borderInverse: alabaster[500],
    // Black, not a neutral step. A shadow is occlusion — it must darken. Every
    // neutral this theme has in dark mode is *lighter* than `background`, so
    // used as a shadow it reads as a halo. Alpha rather than solid so it
    // composites over sentiment surfaces; recipes dilute it by geometry
    // (negative spread), not by fading the colour.
    shadow: 'rgba(0, 0, 0, 0.55)',

    // Mode swap inverts the CTA: dark fill on light, light fill on dark.
    primary: alabaster[100],
    onPrimary: squidInk[900],

    // `urchin[100]` is the same hex in both modes — accentSubtle in light,
    // accent in dark — and never a fill in either.
    accent: urchin[100],
    accentHover: alabaster[100],
    accentSubtle: urchin[400],
    onAccent: squidInk[900],
    onAccentSubtle: squidInk[900],
    focusRing: urchin[100],

    positive: { surface: pearlSentiment.algae[800], border: pearlSentiment.algae[600], text: pearlSentiment.algae[300], icon: `color-mix(in srgb, ${pearlSentiment.algae[400]} 65%, ${vars.color.textSubtle})` },
    negative: { surface: pearlSentiment.coral[800], border: pearlSentiment.coral[600], text: pearlSentiment.coral[300], icon: `color-mix(in srgb, ${pearlSentiment.coral[400]} 65%, ${vars.color.textSubtle})` },
    warn: { surface: pearlSentiment.sunlight[800], border: pearlSentiment.sunlight[600], text: pearlSentiment.sunlight[200], icon: `color-mix(in srgb, ${pearlSentiment.sunlight[400]} 65%, ${vars.color.textSubtle})` },
    info: { surface: pearlSentiment.tide[800], border: pearlSentiment.tide[600], text: pearlSentiment.tide[300], icon: `color-mix(in srgb, ${pearlSentiment.tide[400]} 65%, ${vars.color.textSubtle})` },
  },
  radius: pearlRadius,
  space: pearlSpace,
  controlHeight: pearlControlHeight,
  fontWeight: pearlFontWeight,
  fontFamily: pearlFontFamily,
  text: pearlText,
});

// `[data-inverse]` scoped island — see inverseOverride.ts. Values mirror the
// other mode's own background/surface/text/textSubtle/icon.
inverseOverride(pearlLightThemeClass, {
  background: squidInk[900],
  surface: squidInk[850],
  text: alabaster[300],
  textSubtle: urchin[200],
  icon: urchin[200],
});
inverseOverride(pearlDarkThemeClass, {
  background: alabaster[300],
  surface: alabaster[200],
  text: squidInk[900],
  textSubtle: urchin[500],
  icon: urchin[500],
});

// ---- Role treatments (roles declared in pearl.roles.ts) ----
// `Text` only ever writes `data-role`; each theme decides here what that looks
// like.

globalStyle(
  `${pearlLightThemeClass} [data-role="inlineEmphasis"], ${pearlDarkThemeClass} [data-role="inlineEmphasis"]`,
  {
    fontFamily: pearlFonts.serif,
    fontStyle: 'italic',
    letterSpacing: '-0.02em',
  },
);

// The wordmark takes `inlineEmphasis` (italic serif), whose advance widths run
// narrower than the sans around it — at wordmark size the mark looks shrunken.
// Open it back toward optical parity with tracking (`em`, so it holds through
// the component's `scale` prop). `span` (0,1,1) beats the role rule above.
globalStyle(
  `${pearlLightThemeClass} span[data-component="brand-wordmark"], ${pearlDarkThemeClass} span[data-component="brand-wordmark"]`,
  {
    letterSpacing: '-0.02em',
  },
);

// Preheading face — unconditional. Sentence case, body face: mono/upper/tracked
// is Freshwater/Tahitian's console idiom, the wrong register for Pearl.
globalStyle(
  `${pearlLightThemeClass} [data-role="preheading"], ${pearlDarkThemeClass} [data-role="preheading"]`,
  {
    fontFamily: pearlFonts.sans,
  },
);

// Preheading *default* size only — gated on `:not([data-type-scale])` so an
// explicit `typeScale` (the Hero's oversized `01`/`02` ordinals) still wins.
// `Text` writes `data-type-scale` exactly when the caller named a scale.
globalStyle(
  `${pearlLightThemeClass} [data-role="preheading"]:not([data-type-scale]), ${pearlDarkThemeClass} [data-role="preheading"]:not([data-type-scale])`,
  {
    fontSize: vars.text.caption.fontSize,
    lineHeight: vars.text.caption.lineHeight,
  },
);

// Pearl only. Its 12px control radius curves an Input's left border away from
// the text baseline, so a flush label reads a hair left of the value beneath
// it. A 2px nudge re-seats them — a raw value, not a token, because optical
// corrections are sub-grid by nature (`xs`, 4px, would overshoot).
globalStyle(
  [
    `${pearlLightThemeClass} [data-component="field"][data-part="label"]`,
    `${pearlDarkThemeClass} [data-component="field"][data-part="label"]`,
    `${pearlLightThemeClass} [data-component="field"][data-part="hint"]`,
    `${pearlDarkThemeClass} [data-component="field"][data-part="hint"]`,
    `${pearlLightThemeClass} [data-component="field"][data-part="error"]`,
    `${pearlDarkThemeClass} [data-component="field"][data-part="error"]`,
  ].join(', '),
  { paddingLeft: '2px' },
);

globalStyle(
  `${pearlLightThemeClass} [data-role="dataDigits"], ${pearlDarkThemeClass} [data-role="dataDigits"]`,
  {
    fontFamily: pearlFonts.mono,
    fontVariantNumeric: 'tabular-nums',
    letterSpacing: '-0.05em',
  },
);

// ---- Primary button: "lacquered ink" ----

/**
 * The canon recipe gives every theme a lifted, floating button. Pearl keeps the
 * flat ink fill (the identity) and puts every affordance somewhere other than
 * the fill's own surface: a single contact shadow grounds it (built from
 * `color.shadow` diluted by negative spread), hover/press mix a little `accent`
 * into the fill and bloom an `accentSubtle` halo — the same halo language
 * `secondary` uses, so the two variants read as one system.
 */

/** Both mode classes — for rules that are genuinely mode-agnostic. */
const pearlButton = (variant: 'primary' | 'secondary' | null, state = '') =>
  [pearlLightThemeClass, pearlDarkThemeClass].map((c) => sel(c, variant, state)).join(', ');

/** One mode only. Unused today; kept because `pearlButton` is built on it. */
const sel = (themeClass: string, variant: 'primary' | 'secondary' | null, state = '') =>
  `${themeClass} [data-component="button"]${variant ? `[data-variant="${variant}"]` : ''}${state}`;

const primaryCta = (state = '') => pearlButton('primary', state);

/**
 * Press occlusion. Black, not `color.shadow` — an inset must darken, and in
 * light mode `color.shadow` is lighter than the ink fill it would sit inside.
 * Occlusion inside the control, unrelated to elevation, so not a theme slot.
 */
const ctaPress = 'rgba(0, 0, 0, 0.30)';

/**
 * Contact shadow. `color.shadow` is a solid token, so the blur-to-spread ratio
 * is the only thing diluting it — a wide blur well past the spread turns the
 * token into an actual gradient of occlusion rather than a crisp hairline.
 */
const ctaGround = `0 2px 6px -3px ${vars.color.shadow}, 0 10px 20px -12px ${vars.color.shadow}`;
const ctaGroundHover = `0 4px 10px -4px ${vars.color.shadow}, 0 14px 26px -14px ${vars.color.shadow}`;

/**
 * The focus ring as a box-shadow pair, not an `outline`. `outline` draws a
 * plain rounded rect (it ignores `corner-shape: squircle`); `box-shadow`
 * follows the border box exactly. The 2px spacer painted in `background`
 * reproduces `outline-offset`, so the ring is only ever judged against the page
 * — a single flush ring can't clear 3:1 against both the ink fill and the page
 * at once.
 */
const ctaFocusRing = `0 0 0 2px ${vars.color.background}, 0 0 0 4px ${vars.color.focusRing}`;

globalStyle(primaryCta(), {
  boxShadow: ctaGround,
  transition: 'background-color 180ms ease, box-shadow 200ms ease',
  '@media': {
    '(prefers-reduced-motion: reduce)': { transition: 'none' },
  },
});

globalStyle(primaryCta(':not(:disabled):hover'), {
  // Mixing toward `accent` cools the fill in both modes — hover is a hue event,
  // not a brightness step (the dark-mode fill is already near-white).
  backgroundColor: `color-mix(in srgb, ${vars.color.primary} 88%, ${vars.color.accent})`,
  transform: 'none', // Pearl's controls stay seated — canon's lift is not restored
  boxShadow: `0 0 0 3px ${vars.color.accentSubtle}, ${ctaGroundHover}`,
});

globalStyle(primaryCta(':not(:disabled):active'), {
  backgroundColor: `color-mix(in srgb, ${vars.color.primary} 78%, ${vars.color.accent})`,
  transform: 'none',
  // Contact shadow out, occlusion in: the surface is pushed into the page.
  boxShadow: `inset 0 2px 5px ${ctaPress}, 0 0 0 2px ${vars.color.accentSubtle}`,
});

/**
 * Focus, both variants — one ring, one colour. The `outline` stays declared but
 * transparent: forced-colors mode discards box-shadows, and a transparent
 * outline is re-coloured by the OS palette and takes over there.
 */
globalStyle(pearlButton(null, ':focus-visible'), {
  outline: '2px solid transparent',
  outlineOffset: '2px',
});

// The hover/active rules above carry two pseudo-classes; matching their weight
// and sitting later in the file makes focus win — a focus ring should outrank a
// hover halo.
globalStyle(primaryCta(':not(:disabled):focus-visible'), {
  boxShadow: `${ctaGround}, ${ctaFocusRing}`,
});

globalStyle(pearlButton('secondary', ':not(:disabled):focus-visible'), {
  boxShadow: ctaFocusRing,
});

/** Nothing disabled should look lit or lifted. */
globalStyle(primaryCta(':disabled'), {
  boxShadow: 'none',
});

// ---- Extension treatment: luster ----

/**
 * `luster` — nacre made literal: light moving across a pearl surface.
 *
 * Not a contract slot. Declared via the single-argument `createTheme` overload
 * — the same public mechanism a downstream author uses, no privileged internal
 * path. The returned tuple's two halves do different jobs: the class *extends*
 * the contract (`pearlExtensionClass`), the vars object holds the treatments
 * (`pearlTreatments`). See DECISIONS.md (theme extensions).
 *
 * Constraint: three sheen hues max, none above 0.42 alpha — recorded as a
 * machine-checkable `limit` in `pearl.roles.ts`. Dark-mode values are authored;
 * the visual language only specifies light.
 */
export const [pearlExtensionClass, pearlTreatments] = createTheme({
  luster: {
    /** Sweep angle, shared by sphere / rule / surface drift. */
    angle: '115deg',
    /** The three sheen hues. */
    seaGreen: 'rgba(158, 214, 196, 0.38)',
    periwinkle: 'rgba(214, 228, 255, 0.42)',
    blush: 'rgba(255, 214, 236, 0.30)',
    /** A band, not a wash: transparent below 32% / above 72%. */
    sheenBand:
      'linear-gradient(115deg, transparent 32%, rgba(158, 214, 196, 0.38) 44%, rgba(214, 228, 255, 0.42) 52%, rgba(255, 214, 236, 0.30) 60%, transparent 72%)',
    /** Sheen layer oversized so it has room to travel across the body. */
    sheenSize: '260% 260%',
    /** Sheen start/end position; the animation drives it to `sheenTo`. */
    sheenFrom: '118% 0',
    /** Midpoint of the sweep — the light crossing the face. */
    sheenTo: '34% 0',
    /** Nacre body of the sphere — neutral; the hues ride on top. */
    bodyGradient:
      'radial-gradient(circle at 34% 30%, #FEFEFC 0%, #F0EFEC 26%, #DEE3DF 50%, #C3CCC6 72%, #A9B4AD 100%)',
    /** Sphere depth: outer drop + inner floor + warm top-left bounce. */
    bodyShadow:
      '0 18px 40px rgba(70, 80, 76, 0.22), inset 0 -8px 22px rgba(143, 160, 151, 0.30), inset 6px 4px 18px rgba(214, 205, 192, 0.18)',
    /** Contact shadow cast beneath the sphere — a separate element. */
    contactShadow: 'radial-gradient(ellipse at center, rgba(70, 80, 76, 0.28), transparent 68%)',
    /** Ambient loop on the brand object. */
    orbSpeed: '9s',
    /** Ambient loop on the hairline rule — slower than the sphere. */
    ruleSpeed: '12s',
    /** The hairline rule's own stops: sea green → blue → sand → blush. */
    ruleGradient: 'linear-gradient(90deg, #D6E4DD, #CFE0EA, #EAE0CC, #E8D2DC 80%, transparent)',
    /**
     * Hover drift on card surfaces — one pass, never a loop. `driftInset`
     * spills the ellipse past the card's box so no hard edge shows. Alpha held
     * at the `desaturated` ceiling (0.42) from `pearl.roles.ts`.
     */
    driftGradient:
      'radial-gradient(ellipse at center, rgba(216, 210, 240, 0.42) 0%, rgba(252, 250, 243, 0.26) 32%, rgba(231, 244, 234, 0.15) 52%, transparent 68%)',
    /** How far the bloom spills past the card, so its edge never shows. */
    driftInset: '-45%',
    /** Resting and hovered positions — a ~30% diagonal traverse. */
    driftFrom: 'translate3d(-16%, 8%, 0)',
    driftTo: 'translate3d(14%, -8%, 0)',
    /** Opacity ramps faster than the drift: light arrives, then settles. */
    driftOpacityDuration: '700ms',
    driftDuration: '1000ms',
    driftEasing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    /** Opacity the drift settles at on hover — light mode. */
    driftOpacity: '1',
    /** Same, dark mode — lower, since the same alpha reads brighter on a dark surface. */
    driftOpacityDark: '0.68',
  },
});

// ---- Luster drift — Card hover only ----
//
// Card-only now: on the secondary button the sheen was barely visible against
// the button's own surface, and axe can't resolve contrast through a
// gradient `::after`, so every secondary button audited as inconclusive
// rather than pass. Not worth the trade for an effect nobody could see.
const cardAfter = (themeClass: string, state = '') => `${themeClass} [data-component="card"][data-interactive="true"]${state}`;
const lusterAfterLight = (state = '') => cardAfter(pearlLightThemeClass, state);
const lusterAfterDark = (state = '') => cardAfter(pearlDarkThemeClass, state);
const lusterAfterBoth = (state = '') => [lusterAfterLight(state), lusterAfterDark(state)].join(', ');

globalStyle(lusterAfterBoth('::after'), {
  content: '',
  position: 'absolute',
  zIndex: -1,
  background: pearlTreatments.luster.driftGradient,
  opacity: 0,
  pointerEvents: 'none',
  transform: pearlTreatments.luster.driftFrom,
  transition: `opacity ${pearlTreatments.luster.driftOpacityDuration} ease, transform ${pearlTreatments.luster.driftDuration} ${pearlTreatments.luster.driftEasing}`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { transition: 'none' },
  },
});

globalStyle([cardAfter(pearlLightThemeClass, '::after'), cardAfter(pearlDarkThemeClass, '::after')].join(', '), {
  inset: pearlTreatments.luster.driftInset,
});

globalStyle(lusterAfterLight(':not(:disabled):hover::after'), {
  opacity: pearlTreatments.luster.driftOpacity,
  transform: pearlTreatments.luster.driftTo,
});

globalStyle(lusterAfterDark(':not(:disabled):hover::after'), {
  opacity: pearlTreatments.luster.driftOpacityDark,
  transform: pearlTreatments.luster.driftTo,
});

// Dark mode re-stops the gradient — a sheen needs to catch light against a dark
// ground, so these are the same three hues light-toned. Contrast checked:
// `textSubtle` still clears 4.5:1 against the composited card background at the
// dominant stop's peak.
export const pearlDarkLusterGradient = [
  `radial-gradient(ellipse at center, rgba(201, 226, 255, 0.22) 0%`,
  `rgba(227, 222, 240, 0.14) 32%`,
  `rgba(178, 248, 213, 0.08) 52%`,
  `transparent 68%)`,
].join(', ');

globalStyle(lusterAfterDark('::after'), {
  background: pearlDarkLusterGradient,
});
