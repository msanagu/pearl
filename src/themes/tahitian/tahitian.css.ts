import { createTheme, globalStyle, keyframes, style } from '@vanilla-extract/css';
import { vars } from '../../theme.css';
import { fieldMeta, label as fieldLabel } from '../../components/Field/Field.css';
import { body as sphereBody } from '../../brand/PearlSphere.css';

/**
 * Tahitian — one of Pearl's three named themes (docs/fable5-handoff-three-themes.md).
 * The flagship: dark is the default first render (`.storybook/preview.tsx`).
 *
 * Tahitian is the dark editorial system: condensed poster type, an exposed
 * grid, and one iridescent overtone reserved for photographic plates.
 *
 * ## Two color tiers (ADR-0005)
 * `tahitianPlatinum`/`tahitianCharcoal`/`tahitianPeacock`/`tahitianSeaglass`
 * below are raw, named hexes — named by what they ARE, never by what
 * they're for. `*ThemeClass` maps those primitives onto semantic roles.
 *
 * ## One neutral ramp, two named halves
 * `tahitianPlatinum` and `tahitianCharcoal` are one continuous lightest→
 * darkest progression, not two independently-authored palettes — divided
 * into two named objects for readability, the same way `tahitianSentiment`
 * splits its hues, rather than one `tahitianNeutral[n]` object. Each mode's
 * text color is the OTHER half's extreme step (light-mode text is
 * `charcoal[950]`, dark-mode text is `platinum[100]`) — a cross-reference,
 * not a separately-authored hex.
 *
 * ## Accent diverges, neutral doesn't
 * Accent is the one place light and dark genuinely diverge rather than
 * sharing a ramp: light stays `tahitianPeacock` (the signature deep green),
 * dark moves to `tahitianSeaglass` — a brighter green tuned to read against
 * near-black rather than a lifted/tinted version of the same hex. Both are
 * unambiguously green — no purple in either (an earlier dark-mode accent
 * hover strayed into aubergine; this replaces it, not extends it), and
 * neither uses "Deep"/"Mist"-style modifier words — like the neutral ramp,
 * each is a plain 100→700 numeric scale.
 *
 * ## No shared scales.ts
 * Every non-color scale (radius/space/controlHeight/fontWeight/fontFamily/
 * text) is defined HERE, scoped to Tahitian alone — themes do not share a
 * global scale file. Each theme owns its full identity, including density and
 * type, not just color.
 */

// ---- Primitives (raw, named hexes) ----

// One continuous neutral ramp, divided into two named halves rather than
// two independently-authored palettes — `platinum` holds the light steps,
// `charcoal` the dark ones, but they're one lightest→darkest progression:
// each mode's text color is the OTHER half's extreme step (light-mode text
// is `charcoal[950]`, dark-mode text is `platinum[100]`), not a separate hex.
export const tahitianPlatinum = {
  100: '#FFFFFF', // raised surface / onAccent (light); reused as dark-mode text
  200: '#F2F4F3', // page background (light)
  300: '#E1E3DF', // border, subtle (light)
  400: '#C9CDC8', // border (light)
  500: '#A6ABA4', // border, strong (light); reused as dark-mode text, subtle
  600: '#6B6E69', // text, subtle (light)
};

export const tahitianCharcoal = {
  700: '#45454B', // border, strong (dark)
  800: '#2C2C30', // border (dark)
  850: '#202024', // border, subtle (dark)
  900: '#1A1A1D', // raised surface (dark)
  950: '#0E0E10', // page background (dark); reused as light-mode text
};

export const tahitianPeacock = {
  100: '#D9EFEB', // tint — accentSubtle
  500: '#0F7A66', // base — accent
  700: '#0B5F50', // hover
};

export const tahitianSeaglass = {
  100: '#123328', // tint — accentSubtle, dark
  500: '#6FE0CB', // base — accent, dark
  700: '#7EE8BB', // hover, dark
};

export const tahitianScrim = {
  light: 'rgba(24, 26, 25, 0.56)',
  dark: 'rgba(0, 0, 0, 0.6)',
};

// `sans` was Space Grotesk, duplicating Freshwater's display/heading face —
// Switzer (Fontshare, free) replaces it: a Swiss neo-grotesque body voice
// distinct from Freshwater's, and editorial enough to pair with Anton's
// condensed poster weight. Loaded via CDN link in `.storybook/preview-head.html`
// alongside South Sea's Zodiak/General Sans/Boska.
export const tahitianFonts = {
  display: "'Anton', Impact, sans-serif",
  sans: "'Switzer', system-ui, -apple-system, 'Segoe UI', sans-serif",
  mono: "'IBM Plex Mono', 'SF Mono', Menlo, monospace",
};

export const tahitianTypeTreatments = {
  monoCapsTracked: { fontFamily: tahitianFonts.mono, case: 'upper' as const, tracking: '0.08em' },
} satisfies Record<string, unknown>;

// The `overtone` gradient's stops, light mode.
//
// `background-clip: text` paints these AS the glyphs, so every stop is body
// text and owes 4.5:1 — measured against `background` (platinum[200], the
// darker of the two light surfaces), not just `surface`. The original set was
// authored by eye and missed: peacock 3.57:1, blue 3.51:1, and silver
// (`#B8C4C2`) a mere 1.62:1, which left the tail of every emphasized phrase
// effectively unreadable. Impeccable can't catch this — it SKIPS the contrast
// check on gradient-clipped text (issue #409 Case A), since painted contrast
// isn't derivable from `color`. These values are hue- and saturation-preserved
// darkenings of the originals, each verified >= 4.5:1 on platinum[200].
export const tahitianPearlColors = {
  peacock: '#297C68', // 4.55:1
  green: '#5FAD78', // pistachio through bottle-glass green — not in either gradient
  blue: '#447591', // steel/denim blue — 4.53:1
  aubergine: '#8C5A7D', // 4.91:1 — already passed, unchanged
  /**
   * The gradient's terminal stop is the theme's own subtle-text color rather
   * than a bespoke pale hex: it's the value this ramp already reserves for
   * de-emphasized body text (`textSubtle`), so the iridescence resolves INTO
   * the type system instead of fading out of it. 4.68:1.
   */
  silver: tahitianPlatinum[600],
};

// The same gradient's stops, dark mode — lighter/brighter versions of each
// light-mode hue, the same relationship `seaglass` has to `peacock`: these
// mid-saturation tones read fine against white but fall well under 4.5:1 on
// near-black `charcoal`, since `background-clip: text` renders them as
// actual foreground text color, not a decorative wash a screen-blend can
// forgive. `green` reuses `tahitianSeaglass[500]` directly rather than
// deriving a new bright green — it already IS peacock's dark-mode sibling.
export const tahitianPearlColorsBright = {
  peacock: tahitianSeaglass[500], // '#6FE0CB'
  green: '#8FE3A8',
  blue: '#7EC8E3',
  aubergine: '#D79FC0',
  silver: '#E7EEEC',
};

// Sentiment families, one flattened 100 (lightest)→800 (darkest) scale per
// hue, shared by both modes — a step number means the same lightness
// regardless of which theme mode reads it.
export const tahitianSentiment = {
  kelp: { 100: '#E4F1EB', 200: '#B7D9C8', 300: '#8FC2A7', 400: '#5FAD78', 500: '#3C7F5C', 600: '#2D6348', 700: '#22513A', 800: '#10271D' },
  reef: { 100: '#F7E8EA', 200: '#E8B9C0', 300: '#D796A2', 400: '#C66A7A', 500: '#9E4658', 600: '#783445', 700: '#632A3A', 800: '#2B151C' },
  dawn: { 100: '#F5F0DF', 200: '#E8D89A', 300: '#DCC46B', 400: '#C69C32', 500: '#927326', 600: '#6D541D', 700: '#574316', 800: '#241B0B' },
  wave: { 100: '#E5F0F2', 200: '#B7D5DB', 300: '#8FBCC8', 400: '#609BAE', 500: '#477C91', 600: '#365E70', 700: '#294B59', 800: '#13232A' },
};

// ---- Scales (this theme's own — not shared with Freshwater/South Sea) ----

/**
 * `nesting: '0'` — hard-edged by identity; derived radii stay square.
 *
 * `full` stays `9999px` even so. It was briefly `0px`, back when `Tag` and
 * `XButton` still read it and a lone pill on a square theme looked like an
 * escapee. Both now take `radius.control`, so `full` means only what it says:
 * elements that are circles by nature — dots, radios, avatars. A square radio
 * reads as a checkbox, which is a worse problem than a round dot on a hard-edged
 * theme.
 */
const tahitianRadius = { control: '0px', full: '9999px', nesting: '0', cornerShape: 'round' };
// rem, not px (16px root) — spacing/control-height scale with a user's base
// font-size preference, not just page zoom. Same reasoning as pearl.css.ts.
const tahitianSpace = { xs: '0.5rem', sm: '0.75rem', md: '1.25rem', lg: '1.75rem', xl: '2.5rem', '2xl': '3.5rem' };
const tahitianControlHeight = { sm: '2rem', md: '2.5rem', lg: '3rem', xl: '3.5rem' };
const tahitianFontWeight = { regular: '400', medium: '500', semibold: '600', bold: '700' };

const tahitianFontFamily = {
  display: tahitianFonts.display,
  heading: tahitianFonts.display,
  body: tahitianFonts.sans,
  mono: tahitianFonts.mono,
};

// Sizes follow the shared 4px-grid ramp (see pearl.css.ts's pearlText comment
// for the rationale, incl. caption's deliberate 11px escape); weight/tracking
// stay Tahitian's own.
const tahitianText = {
  caption: { fontSize: '0.6875rem', lineHeight: '1.4545', fontWeight: '400', letterSpacing: '0' }, // 11px floor, 16px 4px-grid line-height
  bodySm: { fontSize: '0.75rem', lineHeight: '1.6667', fontWeight: '400', letterSpacing: '0' }, // 20px 4px grid
  bodyMd: { fontSize: '1rem', lineHeight: '1.5', fontWeight: '400', letterSpacing: '0' }, // 24px 4px grid
  bodyLg: { fontSize: '1.5rem', lineHeight: '1.5', fontWeight: '400', letterSpacing: '0' }, // 36px 4px grid
  // Anton ships one cut, Regular/400 (@fontsource/anton/400.css) — it's
  // already an ultra-bold display face by design, so heading/display rows
  // stay 400 rather than faux-bolding a 600 weight Anton doesn't have.
  headingSm: { fontSize: '2rem', lineHeight: '1.25', fontWeight: '400', letterSpacing: '0' }, // 40px 4px grid
  headingMd: { fontSize: '2.5rem', lineHeight: '1.2', fontWeight: '400', letterSpacing: '0' }, // 48px 4px grid
  headingLg: { fontSize: '3.5rem', lineHeight: '1.142857', fontWeight: '400', letterSpacing: '0.004em' }, // 64px 4px grid
  displaySm: { fontSize: '4.5rem', lineHeight: '1.056', fontWeight: '400', letterSpacing: '0.004em' }, // 76px 4px grid
  displayLg: { fontSize: '7rem', lineHeight: '1.071429', fontWeight: '400', letterSpacing: '0.004em' }, // 120px 4px grid
  displayXl: { fontSize: '9.5rem', lineHeight: '1.052632', fontWeight: '400', letterSpacing: '0.004em' }, // 160px 4px grid
};

// ---- Extension treatment: overtone ----

/**
 * Tahitian's overtone is one recipe with two role consumers: a restrained
 * color treatment for inline emphasis, and a moving screen-blend layer for
 * grayscale photographic plates.
 */
export const [tahitianTreatmentClass, tahitianTreatments] = createTheme({
  overtone: {
    // Text-clip gradient is mode-specific (see the split globalStyle rules
    // below) — this var is the DARK version, since dark is the flagship
    // default render; light mode's override supplies its own literal.
    gradient: `linear-gradient(105deg, ${tahitianPearlColorsBright.peacock} 0%, ${tahitianPearlColorsBright.blue} 42%, ${tahitianPearlColorsBright.aubergine} 78%, ${tahitianPearlColorsBright.silver} 100%)`,
    // Screen-blended over a grayscale image, not read as flat foreground
    // text — the underlying alpha wash is forgiving of mode regardless, so
    // this stays the one shared value.
    plateGradient: 'linear-gradient(105deg, rgba(47, 143, 120, 0.38) 0%, rgba(79, 136, 168, 0.34) 42%, rgba(140, 90, 125, 0.38) 78%, rgba(184, 196, 194, 0.38) 100%)',
    plateFrom: '0% 50%',
    plateTo: '100% 50%',
    plateSpeed: '8s',
  },
});

// Light mode's inlineEmphasis gradient — built from `tahitianPearlColors`
// (not the treatment var above, which is the dark version) since a single
// CSS custom property can't hold two different values for the two
// `[data-role="inlineEmphasis"]` selectors below.
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
    // Same ramp's dark-end steps, not a separate dark primitive set.
    backgroundInverse: tahitianCharcoal[950],
    surfaceInverse: tahitianCharcoal[900],

    text: tahitianCharcoal[950],
    textSubtle: tahitianPlatinum[600],
    textInverse: tahitianPlatinum[100],
    textInverseSubtle: tahitianPlatinum[500],

    border: tahitianPlatinum[400],
    borderStrong: tahitianPlatinum[500],
    borderSubtle: tahitianPlatinum[300],
    borderInverse: tahitianCharcoal[800],
    shadow: tahitianPlatinum[500],

    primary: tahitianPeacock[500],
    onPrimary: tahitianPlatinum[100],
    accent: tahitianPeacock[500],
    accentHover: tahitianPeacock[700],
    accentSubtle: tahitianPeacock[100],
    onAccent: tahitianPlatinum[100],
    onAccentSubtle: tahitianCharcoal[950],
    focusRing: tahitianPeacock[500],

    // `icon` is toned down toward `textSubtle` via `color-mix` — the raw
    // sentiment hue at full strength reads as more visually prominent than
    // body text despite having a lower luminance-contrast ratio (saturation,
    // not just lightness, drives perceived prominence); 65% keeps the hue
    // identifiable while quieting it below both `text` and plain body copy.
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
    overlaySubtle: 'rgba(255, 255, 255, 0.10)', // placeholder, see light mode's comment above
    // Same ramp's light-end steps, not a separate light primitive set.
    backgroundInverse: tahitianPlatinum[200],
    surfaceInverse: tahitianPlatinum[100],

    text: tahitianPlatinum[100],
    textSubtle: tahitianPlatinum[500],
    textInverse: tahitianCharcoal[950],
    textInverseSubtle: tahitianPlatinum[600],

    border: tahitianCharcoal[800],
    borderStrong: tahitianCharcoal[700],
    borderSubtle: tahitianCharcoal[850],
    borderInverse: tahitianPlatinum[400],
    shadow: tahitianCharcoal[700],

    primary: tahitianSeaglass[500],
    onPrimary: tahitianCharcoal[950],
    accent: tahitianSeaglass[500],
    accentHover: tahitianSeaglass[700],
    accentSubtle: tahitianSeaglass[100],
    onAccent: tahitianCharcoal[950],
    onAccentSubtle: tahitianPlatinum[100],
    focusRing: tahitianSeaglass[500],

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

// PearlSphere's own styling reads `pearlTreatments.luster.*` — CSS vars only
// defined under `pearlTreatmentClass`, which Tahitian never applies as an
// ancestor. Left alone, the sphere renders with empty background/shadow
// vars and disappears against the near-black surface (not literally absent
// from the DOM, just invisible). This is 12a's sphere verbatim
// (design/Pearl Directions.dc.html, line 266) — three layered radials (a
// pale mint highlight, a faint pink blush, a dark green-black body), not a
// derived tint of `overtone`'s hues. Static — 12a's sphere carries no sweep
// animation.
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

// Dark mode only: the nav wordmark is forced white against Tahitian's
// near-black surface (14a's masthead). Light mode's surface is pale
// silver-grey — the same white would be invisible there, so light mode
// falls back to ordinary `color.text` instead of a hardcoded override.
globalStyle(`${tahitianDarkThemeClass} [data-component="brand-wordmark"]`, {
  color: tahitianPlatinum[100],
});

// The face — unconditional. A role owns its treatment wherever it is set.
globalStyle(
  `${tahitianLightThemeClass} [data-role="preheading"], ${tahitianDarkThemeClass} [data-role="preheading"]`,
  {
    fontFamily: tahitianFonts.mono,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
  },
);

// Size, not just face. Without these the role inherits the ambient scale,
// so a preheading renders at body size and stops out-ranking the heading it
// sits above — the hierarchy inverts. Pearl has always set these; Tahitian
// did not, which is what surfaced the gap.
//
// Gated on `:not([data-type-scale])` because this is the role's *default*
// size, not a mandate — see the matching note in `pearl.css.ts`. An explicit
// `typeScale` has to win, or the rule's class+attribute specificity pins every
// preheading to caption no matter what the caller asked for.
globalStyle(
  `${tahitianLightThemeClass} [data-role="preheading"]:not([data-type-scale]), ${tahitianDarkThemeClass} [data-role="preheading"]:not([data-type-scale])`,
  {
    fontSize: vars.text.caption.fontSize,
    lineHeight: vars.text.caption.lineHeight,
  },
);

// Split by mode — `background-clip: text` renders these as actual
// foreground text color, so each mode needs stops that pass contrast
// against ITS surface: `tahitianPearlColors` (mid-saturation) on light's
// pale platinum, `tahitianPearlColorsBright` (lighter/brighter — see the
// comment above that palette) on dark's near-black charcoal.
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
    // More breathing room than Pearl gets from `space.lg` alone (14a's pill
    // buttons read airier than a standard CTA) — still theme space tokens,
    // not hardcoded values, so it tracks Tahitian's scale if that changes.
    fontSize: tahitianText.bodySm.fontSize,
    paddingTop: tahitianSpace.lg,
    paddingBottom: tahitianSpace.lg,
  },
);

// Dark mode: a light wash (14a's "CONTACT" pill) — the near-black surface
// shows through and a translucent fill reads as emphasis there. Light
// mode's surface is pale silver-grey, where the same wash would look
// weaker than secondary's plain white-bordered box, not stronger — so
// light mode gets a solid accent fill instead (below).
//
// Primary carries a real accent border on top of the wash (the wash alone
// doesn't read as emphasized against near-black). Secondary keeps its own
// neutral border at rest — the two are told apart by border COLOR (accent
// vs. `borderStrong`) and fill, never by one of them having no visible
// edge; see the secondary rule below for why.
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
    // The base recipe's own `:hover` rule (translateY lift + drop shadow,
    // tuned for a solid fill) has higher specificity on hover than this
    // file's plain default-state `boxShadow: none` — left unset here, it
    // wins back on hover and the button visibly lifts off a shadow. Explicit
    // `none`/`none` needed on every hover override, not just the base state.
    boxShadow: 'none',
    transform: 'none',
  },
);

// Unfilled, but never unbordered. The base recipe fills secondary with
// `color.surface`, which in dark mode is charcoal[900] — one step off the
// charcoal[950] page background. Left inherited, that fill reads as a grey
// slab, and it disappears outright when the button sits on a panel that is
// itself `color.surface` (Docs' emphasis panel) — the same declaration
// reading as two different components depending on what's underneath it.
// Dropping the fill fixes that; dropping the BORDER with it (what this rule
// used to do) traded one bug for two worse ones:
//
//   1. Alignment. With no resting edge, the control's box is invisible
//      until hover, so its horizontal padding is invisible too. A designer
//      lining the button up against body copy or a field above it has only
//      the glyphs to go by, aligns to those, and the real box then sits
//      `space.lg` proud of everything else. The edge has to be there at
//      rest for the padding to be predictable.
//   2. Button vs. link. A control that is nothing but text until you touch
//      it reads as a link, and once one of them does, neither affordance
//      means anything on the page.
//
// See docs/foundations/control-affordances.md — this is a system-wide rule,
// not a Tahitian preference. `borderStrong`, not `border`: at 1px against
// charcoal[950], `color.border` (charcoal[800]) is under 1.4:1 and reads as
// no edge at all, which is the same failure by a subtler route.
globalStyle(`${tahitianDarkThemeClass} [data-component="button"][data-variant="secondary"]`, {
  background: 'transparent',
  border: `1px solid ${vars.color.borderStrong}`,
});

// Light mode: near-opaque accent fill, near-white text — primary needs to
// read as more emphasized than secondary's plain bordered box, which a
// translucent wash can't do against a light surface. 80%, not 100% — fully
// solid read flatter/harder-edged than the rest of Tahitian's restrained
// fills.
globalStyle(`${tahitianLightThemeClass} [data-component="button"][data-variant="primary"]`, {
  background: `color-mix(in srgb, ${vars.color.accent} 92%, transparent)`,
  color: vars.color.onAccent,
  boxShadow: 'none',
});

globalStyle(
  `${tahitianLightThemeClass} [data-component="button"][data-variant="primary"]:not(:disabled):hover`,
  { background: vars.color.accentHover, boxShadow: 'none', transform: 'none' },
);

// Secondary reads quieter than primary's accent wash — subtle text against
// the bordered, unfilled control, not full-strength `color.text`.
globalStyle(
  `${tahitianLightThemeClass} [data-component="button"][data-variant="secondary"], ${tahitianDarkThemeClass} [data-component="button"][data-variant="secondary"]`,
  { color: vars.color.textSubtle },
);

// Secondary's hover stays neutral in both modes — the base recipe's
// `color.accent` border is what primary already uses to signal emphasis;
// secondary borrowing it on hover would blur the two variants together.
//
// Hover is a *change of state*, not the arrival of the control: the box and
// its padding are already visible at rest (see above), so hover only has to
// confirm the pointer is on target. Light steps the border up its own ramp
// (`border` → `borderStrong`); dark can't reuse that — its resting border
// IS `borderStrong` — so it lifts a neutral wash instead. Both modes bring
// the label from `textSubtle` up to full `text`, which is the part that
// reads at a glance regardless of border contrast.
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