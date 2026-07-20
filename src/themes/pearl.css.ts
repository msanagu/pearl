import { createTheme, globalStyle } from '@vanilla-extract/css';
import { vars } from '../theme.css';

/**
 * Pearl — the flagship theme, and the one the docs site is pinned to.
 *
 * Canonical source is the exploration log, not the handoff's schema doc:
 * turn **4c** ("Canon — 1a layout × 1b vibe"), refined by **5a** ("canon,
 * refined"), with **8a**'s pill controls. See
 * `docs/theme-revision-decisions.md` §3.
 *
 * ## Provenance of values
 * Values are marked `[4c]`, `[8a]`, or `[spec]` (the handoff's token tables)
 * where they come from the exploration. Values marked `[derived]` are NOT in
 * any source — the contract needs slots the exploration never specified
 * (sentiment families, border ranks, inverse pairs), so they are authored here
 * in Pearl's register and should be reviewed as new work, not as canon.
 *
 * ## Type
 * Sans-first. The handoff inverted this — it set Gambetta italic as the display
 * face, making serif the default for all display type. Canon is the opposite:
 * General Sans carries display/heading/body, and Gambetta italic is a *rare*
 * accent (the wordmark, and inline interjections like "the world is your
 * *oyster*"). Gambetta and IBM Plex Mono are therefore primitives with no canon
 * role yet — the type primitive tier is not built (see `theme.css.ts:107` and
 * the phase plan). They are declared below and assigned in `pearl.assignment.ts`.
 *
 * ## Capabilities
 * `pearlCapabilities.luster` is an **extension capability** (see
 * `docs/decisions/0007-capabilities-and-assignments.md`) — theme-owned, not a
 * canon slot, with a required assignment in `pearl.assignment.ts`.
 */

// ---- Type primitives (named by what they ARE — no roles assigned here) ----
// Aspirational stacks: only Boska is self-hosted so far (see boska.css.ts).
// `ideal` names the paid faces the exploration specified (4c font note).
export const pearlFonts = {
  /** shown: General Sans · ideal: Neue Haas Grotesk */
  sans: "'General Sans', system-ui, -apple-system, 'Segoe UI', sans-serif",
  /** shown: Gambetta italic · ideal: Signifier italic */
  serif: "'Gambetta', Georgia, 'Times New Roman', serif",
  /** shown: IBM Plex Mono · ideal: Söhne Mono */
  mono: "'IBM Plex Mono', ui-monospace, 'SF Mono', Menlo, monospace",
};

// ---- Color primitives ----

const pearlLightPrimitives = {
  linen: '#F5F3EF', // [4c] page background
  porcelain: '#FBFAF7', // [spec] raised surface
  chalk: '#FDFCFA', // [4c] secondary control top-stop / onAccent
  ink: '#17161A', // [4c] primary text
  slate: '#6E6A78', // [4c] body copy
  // [amended] 4c's literal #77737E reads 4.18:1 against onAccent (linen) —
  // fails WCAG AA normal text (4.5:1). Darkened within the same neutral
  // family to 5.05:1; verified via Storybook's a11y addon on the Tokens story
  // and by direct WCAG calculation. Same hue, same "quiet ink" role — this is
  // a luminance correction, not a redesign.
  pewter: '#6A6672', // labels, muted text, accent
  hairline: '#DEDAD2', // [4c] default border
  marineStrong: '#B8B5C6', // [spec] emphasis border
  hairlineFaint: '#EAE7E0', // [derived] one step lighter than hairline
  /** Marine Layer — quiet work only: focus ring, selected tint, sheen. Never a fill. */
  marine: '#D7D5DF', // [spec]
  scrim: 'rgba(23, 22, 26, 0.55)', // [derived]

  // [derived] Sentiment families. No exploration source — authored low-chroma
  // to sit inside Pearl's warm-neutral register rather than shout over it.
  // (100 tint / 300 border / 500 icon / 700 text — see ADR-0005's worked example.)
  // Verified via Storybook's a11y addon + direct WCAG calc on the Tokens
  // story: 700-on-100 (text) is 6.7–8.5:1 (AA requires 4.5). 500-on-surface
  // (icon, SC 1.4.11 non-text) is 4.27–5.73:1 (requires 3). Not re-audited
  // for Tahitian/Freshwater/South Sea.
  sage100: '#E8EDE6', sage300: '#BCCBB8', sage500: '#4A7350', sage700: '#2C4A32',
  clay100: '#F3E8E5', clay300: '#DCBCB5', clay500: '#A34C40', clay700: '#71322A',
  honey100: '#F3EDE1', honey300: '#D9C6A0', honey500: '#8F7434', honey700: '#634F22',
  harbor100: '#E7EAEF', harbor300: '#BCC4D3', harbor500: '#546480', harbor700: '#364156',
};

const pearlDarkPrimitives = {
  obsidian: '#17161A', // [spec] page background
  slateDeep: '#1E1D23', // [spec] raised surface
  slateSunk: '#1B1A20', // [spec] recessed surface
  moonlight: '#F5F3EF', // [spec] primary text
  lavenderPale: '#C9C5D2', // [spec] body copy
  pewterLight: '#9B96A8', // [spec] muted text
  hairline: '#2B2A32', // [spec] default border
  marineStrong: '#8E8B9E', // [spec] emphasis border
  hairlineFaint: '#232229', // [spec] surfaceHover doubles as faint border
  marine: '#D7D5DF', // [spec] accent — identical hex to light, inverted role
  chalk: '#FDFCFA', // [spec] accent hover
  scrim: 'rgba(0, 0, 0, 0.62)', // [derived]

  // [derived] Sentiment families, lifted for a dark background.
  sage100: '#16201A', sage300: '#33553B', sage500: '#5FA36E', sage700: '#9BD3A6',
  clay100: '#281815', clay300: '#733A31', clay500: '#D46B5B', clay700: '#EFA89C',
  honey100: '#241E10', honey300: '#6B5622', honey500: '#C6A055', honey700: '#E4CA92',
  harbor100: '#171A21', harbor300: '#3A455C', harbor500: '#7E8CA8', harbor700: '#B9C3D6',
};

// ---- Scales (Pearl's own — themes do not share a scale file) ----

/** Pills. [8a] — a deliberate deviation: 4c and 5a both use 3px. */
const pearlRadius = { control: '999px', surface: '16px', full: '9999px' };

/** [derived] `usage.density = comfortable` — the midpoint of the four themes. */
const pearlSpace = { xs: '4px', sm: '8px', md: '16px', lg: '24px', xl: '32px', '2xl': '48px' };

/** md = 42px [spec ctrlH]; the rest derived around it. */
const pearlControlHeight = { sm: '34px', md: '42px', lg: '48px', xl: '56px' };

const pearlFontWeight = { regular: '400', medium: '500', semibold: '600', bold: '700' };

/** All three canon roles are the grotesk. Serif is an accent, not a role. */
const pearlFontFamily = {
  display: pearlFonts.sans,
  heading: pearlFonts.sans,
  body: pearlFonts.sans,
};

/**
 * displayLg is 4c's hero (84px/1.02). bodyLg is 4c's lede (15px/1.6). The rest
 * are [derived] to sit on that ramp.
 *
 * Note: 4c also sets `letter-spacing: -.04em` on the hero. The contract has no
 * tracking token, so that is currently unexpressable — flagged, not solved.
 */
const pearlText = {
  caption: { fontSize: '0.6875rem', lineHeight: '1.4545', fontWeight: '400', letterSpacing: '0' }, // 16px 8-grid
  bodySm: { fontSize: '0.75rem', lineHeight: '1.6667', fontWeight: '400', letterSpacing: '0' }, // 20px 4px escape
  bodyMd: { fontSize: '0.875rem', lineHeight: '1.7143', fontWeight: '400', letterSpacing: '0' }, // 24px 8-grid
  bodyLg: { fontSize: '0.9375rem', lineHeight: '1.6', fontWeight: '400', letterSpacing: '0' }, // 24px 8-grid
  headingSm: { fontSize: '1.25rem', lineHeight: '1.2', fontWeight: '500', letterSpacing: '-0.01em' }, // 24px 8-grid
  headingMd: { fontSize: '1.5rem', lineHeight: '1.3333', fontWeight: '500', letterSpacing: '-0.015em' }, // 32px 8-grid
  headingLg: { fontSize: '2.125rem', lineHeight: '1.2941', fontWeight: '500', letterSpacing: '-0.02em' }, // 44px 4px escape
  displaySm: { fontSize: '3.5rem', lineHeight: '1.0714', fontWeight: '500', letterSpacing: '-0.03em' }, // 60px 4px escape
  displayLg: { fontSize: '5.25rem', lineHeight: '1.0476', fontWeight: '500', letterSpacing: '-0.04em' }, // 88px 8-grid
};

// ---- Canon theme (light) ----

export const pearlLightThemeClass = createTheme(vars, {
  color: {
    background: pearlLightPrimitives.linen,
    surface: pearlLightPrimitives.porcelain,
    overlay: pearlLightPrimitives.scrim,
    // References the DARK primitives directly — cannot drift.
    backgroundInverse: pearlDarkPrimitives.obsidian,
    surfaceInverse: pearlDarkPrimitives.slateDeep,

    text: pearlLightPrimitives.ink,
    textSubtle: pearlLightPrimitives.slate,
    textInverse: pearlDarkPrimitives.moonlight,
    textInverseSubtle: pearlDarkPrimitives.lavenderPale,

    border: pearlLightPrimitives.hairline,
    borderStrong: pearlLightPrimitives.marineStrong,
    borderSubtle: pearlLightPrimitives.hairlineFaint,
    borderInverse: pearlDarkPrimitives.hairline,

    // [4c] Primary CTA fill — the dark gradient's flat approximation (no
    // gradient token in canon yet; see decisions doc §8, "under evaluation").
    primary: pearlLightPrimitives.ink,
    onPrimary: pearlLightPrimitives.linen,

    // Pearl is an ink-primary identity, but `accent` stays genuinely quiet —
    // it is NOT the button fill (that's `primary`, above). Reusing accent for
    // both would make every quiet use (focus borders, underlines, hover
    // states) go loud too.
    accent: pearlLightPrimitives.pewter,
    accentHover: pearlLightPrimitives.ink,
    accentSubtle: pearlLightPrimitives.marine,
    onAccent: pearlLightPrimitives.linen,
    focusRing: pearlLightPrimitives.marine,

    positive: { surface: pearlLightPrimitives.sage100, border: pearlLightPrimitives.sage300, text: pearlLightPrimitives.sage700, icon: pearlLightPrimitives.sage500 },
    negative: { surface: pearlLightPrimitives.clay100, border: pearlLightPrimitives.clay300, text: pearlLightPrimitives.clay700, icon: pearlLightPrimitives.clay500 },
    warn: { surface: pearlLightPrimitives.honey100, border: pearlLightPrimitives.honey300, text: pearlLightPrimitives.honey700, icon: pearlLightPrimitives.honey500 },
    info: { surface: pearlLightPrimitives.harbor100, border: pearlLightPrimitives.harbor300, text: pearlLightPrimitives.harbor700, icon: pearlLightPrimitives.harbor500 },
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
    background: pearlDarkPrimitives.obsidian,
    surface: pearlDarkPrimitives.slateDeep,
    overlay: pearlDarkPrimitives.scrim,
    backgroundInverse: pearlLightPrimitives.linen,
    surfaceInverse: pearlLightPrimitives.porcelain,

    text: pearlDarkPrimitives.moonlight,
    textSubtle: pearlDarkPrimitives.lavenderPale,
    textInverse: pearlLightPrimitives.ink,
    textInverseSubtle: pearlLightPrimitives.slate,

    border: pearlDarkPrimitives.hairline,
    borderStrong: pearlDarkPrimitives.marineStrong,
    borderSubtle: pearlDarkPrimitives.hairlineFaint,
    borderInverse: pearlLightPrimitives.hairline,

    // [spec] Mode swap inverts the CTA: dark pill on light, light pill on dark.
    primary: pearlDarkPrimitives.chalk,
    onPrimary: pearlDarkPrimitives.obsidian,

    // Marine (#D7D5DF) is the same hex in both modes — highlight in light,
    // accent in dark — and never becomes a fill in either.
    accent: pearlDarkPrimitives.marine,
    accentHover: pearlDarkPrimitives.chalk,
    accentSubtle: pearlDarkPrimitives.marineStrong,
    onAccent: pearlDarkPrimitives.obsidian,
    focusRing: pearlDarkPrimitives.marine,

    positive: { surface: pearlDarkPrimitives.sage100, border: pearlDarkPrimitives.sage300, text: pearlDarkPrimitives.sage700, icon: pearlDarkPrimitives.sage500 },
    negative: { surface: pearlDarkPrimitives.clay100, border: pearlDarkPrimitives.clay300, text: pearlDarkPrimitives.clay700, icon: pearlDarkPrimitives.clay500 },
    warn: { surface: pearlDarkPrimitives.honey100, border: pearlDarkPrimitives.honey300, text: pearlDarkPrimitives.honey700, icon: pearlDarkPrimitives.honey500 },
    info: { surface: pearlDarkPrimitives.harbor100, border: pearlDarkPrimitives.harbor300, text: pearlDarkPrimitives.harbor700, icon: pearlDarkPrimitives.harbor500 },
  },
  radius: pearlRadius,
  space: pearlSpace,
  controlHeight: pearlControlHeight,
  fontWeight: pearlFontWeight,
  fontFamily: pearlFontFamily,
  text: pearlText,
});

// ---- Role treatments (roles.typography in pearl.assignment.ts) ----
//
// The assignment record never becomes CSS itself — it's the spec these
// selectors are checked against. `Text` only ever writes `data-role`; each
// theme decides here what that attribute actually looks like.

globalStyle(
  `${pearlLightThemeClass} [data-role="inlineEmphasis"], ${pearlDarkThemeClass} [data-role="inlineEmphasis"]`,
  {
    fontFamily: pearlFonts.serif,
    fontStyle: 'italic',
  },
);

globalStyle(`${pearlLightThemeClass} [data-role="label"], ${pearlDarkThemeClass} [data-role="label"]`, {
  fontFamily: pearlFonts.mono,
  textTransform: 'uppercase',
  letterSpacing: '0.12em',
  fontSize: vars.text.caption.fontSize,
  lineHeight: vars.text.caption.lineHeight,
});

globalStyle(
  `${pearlLightThemeClass} [data-role="preheading"], ${pearlDarkThemeClass} [data-role="preheading"]`,
  {
    fontFamily: pearlFonts.mono,
    textTransform: 'uppercase',
    letterSpacing: '0.12em',
    fontSize: vars.text.caption.fontSize,
    lineHeight: vars.text.caption.lineHeight,
  },
);

globalStyle(
  `${pearlLightThemeClass} [data-role="numeric"], ${pearlDarkThemeClass} [data-role="numeric"]`,
  {
    fontFamily: pearlFonts.mono,
    fontVariantNumeric: 'tabular-nums',
  },
);

// ---- Extension capability: luster ----

/**
 * `luster` — nacre made literal: light moving across a pearl surface.
 *
 * NOT a canon slot. Declared via the single-argument `createTheme` overload,
 * which infers its own contract — the same public mechanism a downstream author
 * uses, per rule 2 (no privileged internal path).
 *
 * Stops are [4c]'s sphere: three hues at low alpha. This retires the handoff's
 * "highlights, never rainbow" rule and its near-monochrome silver stops. The
 * replacement constraint — three hues max, none above .42 alpha — is recorded
 * as a machine-checkable `limit` in `pearl.assignment.ts`.
 *
 * Dark-mode values are [derived]; 4c only specifies light.
 */
export const [pearlCapabilityClass, pearlCapabilities] = createTheme({
  luster: {
    /** Sweep angle, shared by sphere / rule / surface drift. [4c] */
    angle: '115deg',
    /** The three sheen hues. [4c] */
    seaGreen: 'rgba(158, 214, 196, 0.38)',
    periwinkle: 'rgba(214, 228, 255, 0.42)',
    blush: 'rgba(255, 214, 236, 0.30)',
    /** Nacre body of the sphere — neutral, the hues ride on top. [4c] */
    bodyGradient:
      'radial-gradient(circle at 34% 30%, #FEFEFC 0%, #F0EFEC 26%, #DEE3DF 50%, #C3CCC6 72%, #A9B4AD 100%)',
    /** Sphere depth: outer drop + inner floor + warm top-left bounce. [4c] */
    bodyShadow:
      '0 18px 40px rgba(70, 80, 76, 0.22), inset 0 -8px 22px rgba(143, 160, 151, 0.30), inset 6px 4px 18px rgba(214, 205, 192, 0.18)',
    /** Contact shadow cast beneath the sphere — a separate element. [4c] */
    contactShadow: 'radial-gradient(ellipse at center, rgba(70, 80, 76, 0.28), transparent 68%)',
    /** Ambient loop on the brand object. [4c] */
    orbSpeed: '9s',
    /** Ambient loop on the hairline rule — slower than the sphere. [4c] */
    ruleSpeed: '12s',
    /** The hairline rule's own stops: sea green → blue → sand → blush. [4c] */
    ruleGradient: 'linear-gradient(90deg, #D6E4DD, #CFE0EA, #EAE0CC, #E8D2DC 80%, transparent)',
    /** Hover drift on card surfaces — one pass, never a loop. [doc-site-poc.css.ts:300] */
    driftDuration: '1000ms',
    driftEasing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    /** Opacity the drift settles at on hover. [doc-site-poc.css.ts:316] */
    driftOpacity: '0.72',
  },
});
