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
//
// Three palettes, each a named hue family stepped 100 (lightest) → 900
// (darkest), replacing the old light/dark-suffixed pairs (`pewter` vs
// `pewterLight`, `hairline` light vs dark, etc). Dark mode is not a second
// palette — it is the same palette read at different steps, exactly like
// the sentiment families below already work (100/300/500/700 in both modes).
//
// - `alabaster` — warm neutral. Only populated at its pale end; Pearl never
//   uses a dark step of this hue (that register belongs to squidInk).
// - `squidInk` — cool near-black neutral: page background, surfaces, default
//   border, dark-mode's border register. Only spans 600–900 (its dark end) —
//   it has no light/pale step of its own. Dark-mode text ("moonlight") needs
//   a near-white value, but that's `alabaster[300]` referenced directly, NOT
//   a squidInk step: alabaster is warm (R>G>B) and squidInk's other steps are
//   all cool (B>R>G), so a `squidInk[100]` alias would claim hue coherence
//   squidInk doesn't actually have. It's a borrowed value, not squidInk's own.
// - `marineLayer` — cool violet-gray accent. Quiet work only: focus ring,
//   selected tint, muted/body text, sheen. Never a fill.
//
// `pewterLight` (`#9B96A8`) from the old dark-mode primitives was unused in
// both the theme mapping and the assignment record — dropped rather than
// carried forward as a step nothing references.
export const alabaster = {
  100: '#FDFCFA', // [4c] chalk — secondary control top-stop / onAccent
  200: '#FBFAF7', // [spec] porcelain — raised surface
  300: '#F5F3EF', // [4c] linen — page background
  400: '#EAE7E0', // [derived] hairlineFaint — one step lighter than 500
  500: '#DEDAD2', // [4c] hairline — default border
};

export const squidInk = {
  600: '#2B2A32', // [spec] hairline — default border, dark mode
  700: '#232229', // [spec] hairlineFaint — surfaceHover doubles as faint border
  800: '#1E1D23', // [spec] slateDeep — raised surface
  900: '#17161A', // [4c/spec] ink / obsidian — primary text (light) / page background (dark)
};

/** Marine Layer — quiet work only: focus ring, selected tint, muted text, sheen. Never a fill. */
export const marineLayer = {
  100: '#D7D5DF', // [spec] marine — accent/focusRing/tint, identical hex both modes
  200: '#C9C5D2', // [spec] lavenderPale — body copy, dark mode
  300: '#B8B5C6', // [spec] marineStrong — emphasis border, light mode
  400: '#8E8B9E', // [spec] marineStrong — emphasis border, dark mode
  500: '#6E6A78', // [4c] slate — body copy, light mode
  600: '#6A6672', // labels, muted text, accent — light mode
};

/**
 * [derived] Alpha palettes — existing neutral steps re-rendered at partial
 * opacity, keyed by percent in increments of 5 (only the percents actually
 * used), so they composite over whatever's underneath instead of painting a
 * fixed surface. Two separate palettes, not one: `squidInkAlpha` anchors on
 * `squidInk[900]` (cool), `alabasterAlpha` on `alabaster[300]` (warm) —
 * squidInk has no pale step of its own to use instead (see squidInk's
 * comment above). Not anchored on `marineLayer` (accent) — most other
 * themes' accent is a saturated brand hue, so an accent-anchored wash would
 * be neutral here by coincidence and wrong everywhere else.
 */
export const squidInkAlpha = {
  10: 'rgba(23, 22, 26, 0.10)',
  55: 'rgba(23, 22, 26, 0.55)',
};

export const alabasterAlpha = {
  10: 'rgba(245, 243, 239, 0.10)',
};

// [derived] Sentiment families, one flattened 100 (lightest)→800 (darkest)
// scale per hue, shared by both modes — same rule as alabaster/squidInk
// above. Light theme reads its surface/border/text/icon from the light end,
// dark theme from the dark end; a step number always means the same
// lightness in both. Verified via Storybook's a11y addon: 4.5:1+ text
// contrast, 3:1+ icon contrast in both modes. Not re-audited for
// Tahitian/Freshwater/South Sea.
export const pearlSentiment = {
  sage: { 100: '#E8EDE6', 200: '#BCCBB8', 300: '#9BD3A6', 400: '#5FA36E', 500: '#4A7350', 600: '#33553B', 700: '#2C4A32', 800: '#16201A' },
  clay: { 100: '#F3E8E5', 200: '#DCBCB5', 300: '#EFA89C', 400: '#D46B5B', 500: '#A34C40', 600: '#733A31', 700: '#71322A', 800: '#281815' },
  honey: { 100: '#F3EDE1', 200: '#E4CA92', 300: '#D9C6A0', 400: '#C6A055', 500: '#8F7434', 600: '#6B5622', 700: '#634F22', 800: '#241E10' },
  harbor: { 100: '#E7EAEF', 200: '#BCC4D3', 300: '#B9C3D6', 400: '#7E8CA8', 500: '#546480', 600: '#3A455C', 700: '#364156', 800: '#171A21' },
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
    background: alabaster[300],
    surface: alabaster[200],
    overlay: squidInkAlpha[55],
    overlaySubtle: squidInkAlpha[10],
    // References squidInk directly — cannot drift from the dark theme below,
    // since both read the same module-scoped palette.
    backgroundInverse: squidInk[900],
    surfaceInverse: squidInk[800],

    text: squidInk[900],
    textSubtle: marineLayer[500],
    textInverse: alabaster[300], // moonlight — borrowed, see squidInk's comment above
    textInverseSubtle: marineLayer[200],

    border: alabaster[500],
    borderStrong: marineLayer[300],
    borderSubtle: alabaster[400],
    borderInverse: squidInk[600],

    // [4c] Primary CTA fill — the dark gradient's flat approximation (no
    // gradient token in canon yet; see decisions doc §8, "under evaluation").
    primary: squidInk[900],
    onPrimary: alabaster[300],

    // Pearl is an ink-primary identity, but `accent` stays genuinely quiet —
    // it is NOT the button fill (that's `primary`, above). Reusing accent for
    // both would make every quiet use (focus borders, underlines, hover
    // states) go loud too.
    accent: marineLayer[600],
    accentHover: squidInk[900],
    accentSubtle: marineLayer[100],
    onAccent: alabaster[300],
    focusRing: marineLayer[100],

    positive: { surface: pearlSentiment.sage[100], border: pearlSentiment.sage[200], text: pearlSentiment.sage[700], icon: pearlSentiment.sage[500] },
    negative: { surface: pearlSentiment.clay[100], border: pearlSentiment.clay[200], text: pearlSentiment.clay[700], icon: pearlSentiment.clay[500] },
    warn: { surface: pearlSentiment.honey[100], border: pearlSentiment.honey[300], text: pearlSentiment.honey[700], icon: pearlSentiment.honey[500] },
    info: { surface: pearlSentiment.harbor[100], border: pearlSentiment.harbor[200], text: pearlSentiment.harbor[700], icon: pearlSentiment.harbor[500] },
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
    surface: squidInk[800],
    overlay: 'rgba(0, 0, 0, 0.62)', // [derived] pure black, not squidInk-anchored — a backdrop must always darken, and squidInk has no dark-appropriate pale step to flip to for this mode
    overlaySubtle: alabasterAlpha[10],
    backgroundInverse: alabaster[300],
    surfaceInverse: alabaster[200],

    text: alabaster[300], // moonlight — borrowed, see squidInk's comment above
    textSubtle: marineLayer[200],
    textInverse: squidInk[900],
    textInverseSubtle: marineLayer[500],

    border: squidInk[600],
    borderStrong: marineLayer[400],
    borderSubtle: squidInk[700],
    borderInverse: alabaster[500],

    // [spec] Mode swap inverts the CTA: dark pill on light, light pill on dark.
    primary: alabaster[100], // chalk
    onPrimary: squidInk[900],

    // Marine (#D7D5DF) is the same hex in both modes — highlight in light,
    // accent in dark — and never becomes a fill in either.
    accent: marineLayer[100],
    accentHover: alabaster[100], // chalk
    accentSubtle: marineLayer[400],
    onAccent: squidInk[900],
    focusRing: marineLayer[100],

    positive: { surface: pearlSentiment.sage[800], border: pearlSentiment.sage[600], text: pearlSentiment.sage[300], icon: pearlSentiment.sage[400] },
    negative: { surface: pearlSentiment.clay[800], border: pearlSentiment.clay[600], text: pearlSentiment.clay[300], icon: pearlSentiment.clay[400] },
    warn: { surface: pearlSentiment.honey[800], border: pearlSentiment.honey[600], text: pearlSentiment.honey[200], icon: pearlSentiment.honey[400] },
    info: { surface: pearlSentiment.harbor[800], border: pearlSentiment.harbor[600], text: pearlSentiment.harbor[300], icon: pearlSentiment.harbor[400] },
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
  `${pearlLightThemeClass} [data-role="dataDigits"], ${pearlDarkThemeClass} [data-role="dataDigits"]`,
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
    /**
     * The sheen as a BAND, not a wash: transparent below 32% and above 72%, so
     * light reads as a bounded highlight travelling across the surface rather
     * than a tint covering it. Dropping the transparent stops is what made the
     * previous sphere invisible. [4c]
     */
    sheenBand:
      'linear-gradient(115deg, transparent 32%, rgba(158, 214, 196, 0.38) 44%, rgba(214, 228, 255, 0.42) 52%, rgba(255, 214, 236, 0.30) 60%, transparent 72%)',
    /** Sheen layer oversized so it has room to travel across the body. [4c] */
    sheenSize: '260% 260%',
    /** Sheen start/end position; the animation drives it to `sheenTravelTo`. [4c] */
    sheenFrom: '118% 0',
    /** Midpoint of the sweep — the light crossing the face. [4c] */
    sheenTo: '34% 0',
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
    /**
     * Hover drift on card surfaces — one pass, never a loop.
     *
     * A RADIAL ellipse fading to transparent, inset well past the card's own
     * box (`driftInset`), so what a hover shows is a soft bloom with no
     * visible edge — a linear gradient clipped to `inset: 0` paints a
     * hard-edged rectangle instead. Radial is this project's own choice: the
     * canonical reference (`Pearl Theme Contract.dc.html`'s `lusterStops`,
     * 115deg linear, animated `background-position`) uses the sphere's sweep
     * mechanic, not a bloom. [doc-site-poc.css.ts:292] is where the radial
     * mechanic comes from; the STOPS below are not from that file.
     *
     * The color composition IS from the canonical reference, and it is a
     * different palette from the sphere's — reusing the sphere's saturated
     * seaGreen/periwinkle/blush trio here was the earlier mistake. Card hover
     * is its own spec: "Silver into marine with one breath of dusty sea green
     * — highlights, never rainbow" (`lusterStops`, light mode: silver.100,
     * marine.150, marine.200, seagreen.150). Marine is the dominant hue,
     * silver the undertone, seagreen a thin, late breath — not a third equal
     * partner. `marineLayer[100]` (#D7D5DF) and `alabaster[200]` (#FBFAF7)
     * are already this system's primitives for exactly those two roles;
     * seagreen.150 (#EDF1EE) has no existing token, so it's inlined here at
     * the lowest alpha and the widest stop position, which is what keeps it
     * a breath rather than a dominant third hue.
     */
    driftGradient:
      'radial-gradient(ellipse at center, rgba(215, 213, 223, 0.45) 0%, rgba(251, 250, 247, 0.28) 32%, rgba(237, 241, 238, 0.16) 52%, transparent 68%)',
    /** How far the bloom spills past the card, so its edge never shows. */
    driftInset: '-45%',
    /** Resting and hovered positions — a ~30% diagonal traverse. */
    driftFrom: 'translate3d(-16%, 8%, 0)',
    driftTo: 'translate3d(14%, -8%, 0)',
    /** Opacity ramps faster than the drift: light arrives, then settles. */
    driftOpacityDuration: '700ms',
    driftDuration: '1000ms',
    driftEasing: 'cubic-bezier(0.22, 1, 0.36, 1)',
    /** Opacity the drift settles at on hover. [doc-site-poc.css.ts:316] */
    driftOpacity: '0.72',
  },
});

// `{ on: 'surface', trigger: 'hover' }` from pearl.assignment.ts's luster
// application rules — `Card` writes `data-interactive` without knowing what
// any theme does with it (same mechanism as the role treatments above); this
// is Pearl's answer. `zIndex: -1` on the glow (not `zIndex: 1` on the card's
// real content) is what keeps header/body text readable — a negative-z
// absolutely-positioned layer paints below its static in-flow siblings by
// spec, so nothing else needs to opt in.
globalStyle(
  `${pearlLightThemeClass} [data-component="card"][data-interactive="true"]::after, ${pearlDarkThemeClass} [data-component="card"][data-interactive="true"]::after`,
  {
    content: '',
    position: 'absolute',
    zIndex: -1,
    inset: pearlCapabilities.luster.driftInset,
    background: pearlCapabilities.luster.driftGradient,
    opacity: 0,
    pointerEvents: 'none',
    transform: pearlCapabilities.luster.driftFrom,
    transition: `opacity ${pearlCapabilities.luster.driftOpacityDuration} ease, transform ${pearlCapabilities.luster.driftDuration} ${pearlCapabilities.luster.driftEasing}`,
    '@media': {
      '(prefers-reduced-motion: reduce)': { transition: 'none' },
    },
  },
);

globalStyle(
  `${pearlLightThemeClass} [data-component="card"][data-interactive="true"]:hover::after, ${pearlDarkThemeClass} [data-component="card"][data-interactive="true"]:hover::after`,
  {
    opacity: pearlCapabilities.luster.driftOpacity,
    transform: pearlCapabilities.luster.driftTo,
  },
);
