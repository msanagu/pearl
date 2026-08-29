import { createTheme, globalStyle, keyframes } from '@vanilla-extract/css';
import { vars } from '../../theme.css';
import { fieldMeta, label as fieldLabel, hint as fieldHint, errorText as fieldErrorText } from '../../components/Field/Field.css';
import { sphereWrap, body as sphereBody, contact as sphereContact } from '../../components/brand/PearlSphere.css';

/**
 * South Sea — "Golden Hour Maison" (docs/theme/theme-revision-decisions.md
 * §5). Sources: turn **1g** (flagship) → **3c** ("Atelier Detail") →
 * **11a/11b** (conch/chocolate light + dark) → **13a** (footer).
 *
 * Flat warm ecru surface, chocolate ink, conch (`#E8A184`) doing exactly one
 * small loud thing per view, radius 0 throughout. Identity is type/space/
 * restraint — no AMBIENT effect (unlike Pearl's always-sweeping sphere).
 *
 * One hover-only exception, from exploration turn **9c** ("South Sea — dark,
 * golden hour"): a static gilt sphere that sweeps once you engage it —
 * "golden hour, held still" until then. This is NOT the Theme Contract's
 * generic `luster: 115deg · ecru.100 · sand.200 · champagne.300` fabrication
 * §5 discards (that one was invented boilerplate with no source turn); 9c is
 * a real, distinctly-valued exploration frame (`champagne.800 · gold.700 ·
 * dusk.850 · 4.5s`) and resolves the doc's own open flag on this (§9,
 * "South Sea's `glow`"). See the override below, keyed to dark mode only —
 * light mode has no golden-hour equivalent and keeps Pearl's default sphere.
 *
 * Type is roman + italic serif mixing with a hairline rule in the gap
 * (`southSea.roles.ts`'s `inlineEmphasis`). Uses Zodiak — the design
 * bundle's own face (`design/Pearl Theme Contract.dc.html`), free via
 * Fontshare (not on npm/@fontsource; loaded by CDN link in
 * `.storybook/preview-head.html`) — which ships a genuine italic style, so
 * the roman/italic mix stays real rather than an oblique fake.
 *
 * Two color tiers (ADR-0005): `*Primitives`/scales are raw named hexes; the
 * `*ThemeClass` calls map them onto semantic roles. Scales are this theme's
 * own — not shared with Pearl/Tahitian/Freshwater.
 *
 * ## Neutral + accent consolidation (2026-08-29)
 * Previously two loosely-related buckets (`southSeaLightPrimitives`,
 * `southSeaDarkPrimitives`) named colors by where they were used
 * (`ecru`/`hairlineStrong`/`chocolateDeep`) rather than what they are.
 * Leaned to minimum viable steps — only values an actual role reads — and
 * split into three single-hue scales, the pattern Pearl's
 * `alabaster`/`squidInk` and Freshwater's `ice`/`graphite`/`glacier` already
 * follow: `sand` covers the light (ecru) register, `driftwood` the dark
 * (chocolate/umber) register, `conch` the accent — one scale reused across
 * both modes rather than four separately-named `conch*` primitives.
 *
 * `driftwood` is the one place this doesn't collapse as cleanly as
 * Freshwater's `ice`/`graphite`: light mode's ink (`driftwood[750]`,
 * `#3B2C1F`) and dark mode's surface (`driftwood[850]`, `#2E2116`) are
 * genuinely different values, not one value borrowed both ways — they were
 * tuned separately for different contrast jobs (text on `sand[100]` vs. a
 * surface against `driftwood[900]`), so both steps stay, rather than
 * forcing a shared value that would fail contrast in one direction.
 *
 * ## Single-hue verification (2026-08-29)
 * Checked with real HSL math, not eyeballed: each scale's steps originally
 * clustered around a hue but weren't exactly one — `sand[600]` (taupe) sat
 * ~15° off the rest of `sand`, and every scale had a few degrees of drift
 * step to step. Every hex below is now re-derived from its ORIGINAL
 * lightness and saturation at one fixed target hue per scale (`sand` 38°,
 * `driftwood` 27°, `conch` 19°) — so lightness/saturation (and therefore
 * contrast behavior) are unchanged from the prior pass, only hue moved.
 * Contrast-critical pairs were re-checked after the shift: `sand[600]` on
 * `sand[100]` is 4.6:1 (was 4.95:1, still clears WCAG AA's 4.5:1 floor).
 */

/**
 * [derived] Light-register neutral, one warm ecru hue stepped 100
 * (brightest) → 600 (least light). Only spans its light end, same as
 * Pearl's `alabaster` / Freshwater's `ice`; the dark register lives in
 * `southSeaDriftwood` below.
 */
// All seven steps sit at a single 38° hue (see "Single-hue verification"
// above) — only lightness/saturation vary step to step.
export const southSeaSand = {
  100: '#F5EFE4', // ecru — page background (light)
  // Near-white, distinct from ecru: tuned as its own step (not reused from
  // 100) because it does a different job — dark mode's own `text`, and
  // light mode's `textInverse` (text set on a dark ground) — same "tuned
  // separately for a different contrast job" case as `southSeaDriftwood`'s
  // own comment describes for its `750` step.
  150: '#F3EADA', // cream — text (dark mode) / textInverse (light mode)
  200: '#EFE6D6', // ecruDeep — raised surface (light)
  300: '#E9E0D0', // hairlineSubtle — border, subtle (light)
  400: '#DDD1BC', // hairline — border (light)
  // Darkened from the initial #8A7361 sample — that swatch only hit 3.9:1 on
  // sand[100], failing WCAG AA normal-text (4.5:1); hairlineStrong hits
  // 4.95:1 as `taupe` did before this consolidation (now 4.6:1 post hue-fix,
  // still clear of the 4.5:1 floor — see "Single-hue verification" above).
  500: '#CBBA9E', // hairlineStrong — borderStrong / shadow (light)
  600: '#786A53', // taupe — text, subtle (light)
};

/**
 * [derived] Dark-register neutral, one chocolate/umber hue family stepped
 * 500 (least dark) → 900 (darkest). Only spans its dark end, mirroring
 * Pearl's `squidInk`. `driftwood[750]` is the one exception — light mode's
 * text, not a dark-mode role — kept here rather than in `southSeaSand`
 * because it's the same chocolate-ink hue family, just a step tuned for a
 * different background (see the file header).
 */
// All seven steps sit at a single 27° hue (see "Single-hue verification"
// above) — only lightness/saturation vary step to step.
export const southSeaDriftwood = {
  500: '#B8A18E', // fawn — text, subtle (dark)
  600: '#5E4632', // umberStrong — borderStrong / shadow (dark)
  700: '#4A3626', // umber — border (dark)
  750: '#3B2C1F', // chocolate — text (LIGHT mode; see file header)
  800: '#382719', // umberSubtle — border, subtle (dark)
  850: '#2E2116', // chocolate — raised surface (dark)
  900: '#241A11', // chocolateDeep — page background (dark)
};

/**
 * [derived] The accent hue — conch — spent as "one small loud thing per
 * view" (file header). One scale reused across both modes: `300` is the
 * same hex in both (11a/11b's mode-invariant swatch), the rest are the
 * per-mode hover/subtle steps that used to be separately-named `conch*`
 * primitives.
 *
 * **Every step here carries conch's chroma.** At peak 0.115 this accent is far
 * too saturated to do neutral work (contrast Pearl's `marineLayer` at 0.028,
 * which legitimately doubles as muted text) — so neutral roles belong to
 * `sand`/`driftwood`, and any step that drifts toward neutral is a neutral
 * misfiled here. Two such steps were deleted 2026-08-29; see ADR-0010's
 * "What a palette may be used for":
 *
 * - `500` (`#3A2319`, ex-`conchDusk`) was dark mode's `accentSubtle`. It
 *   measured **1.03:1 against `driftwood[800]`** — the same color by any
 *   perceptual standard (OKLCH L 0.283 vs 0.289). Carrying both meant two
 *   names for one swatch, and worse, a step labelled `500` that was as dark as
 *   another palette's `800` — breaking the expectation that a rung number
 *   indicates roughly parallel value across palettes.
 * - `600` (`#241108`, ex-`conchInk`) was dark mode's `onPrimary`/`onAccent` —
 *   a near-black that had shed conch's chroma entirely. The other three themes
 *   all draw `onAccent` from a neutral; South Sea was the lone exception.
 *
 * Both now point at `driftwood` (see the dark theme below). The swapped pairs
 * were re-measured and hold: `sand[150]` on `driftwood[800]` is 11.95:1 (was
 * 12.27:1), `driftwood[900]` on `conch[300]` is 8.18:1 (was 8.69:1).
 */
// All four steps sit at a single 19° hue (see "Single-hue verification"
// above) — only lightness/saturation vary step to step.
export const southSeaConch = {
  100: '#FBE8DF', // conchMist — accentSubtle, light mode
  200: '#F0B79C', // conchBright — accentHover, dark mode
  300: '#E8A484', // conch — accent / primary, both modes
  400: '#D9865F', // conchDeep — accentHover, light mode
};

const southSeaScrim = {
  light: 'rgba(59, 42, 31, 0.5)',
  dark: 'rgba(0, 0, 0, 0.6)',
};

// [derived] Sentiment families, one flattened 100 (lightest)→800 (darkest)
// scale per hue, shared by both modes — a step number means the same
// lightness regardless of which theme mode reads it.
export const southSeaSentiment = {
  // `positive` on brand: a warm sage/moss family instead of the generic
  // cool mint every other theme's scale uses — the maison palette is warm
  // throughout (ecru/chocolate/conch), and a cool green here read as an
  // import from a different theme entirely. Hue shifted from an olive/khaki
  // ~57° to a mossier, yellow-leaning ~85° at a softer ~28% sat — enough to
  // read as unambiguously green (the ~57° khaki read as tan/brown) without
  // going neon.
  seaMoss: { 100: '#e7edde', 200: '#c5d3b1', 300: '#a5bb86', 400: '#8aa762', 500: '#657c46', 600: '#506237', 700: '#3d4b2a', 800: '#202716' },
  urchin: { 100: '#fdeceb', 200: '#f4b9b4', 300: '#f5a8a0', 400: '#e8574a', 500: '#d64036', 600: '#8f1d17', 700: '#7a2f28', 800: '#2a1513' },
  shell: { 100: '#fdf3e2', 200: '#f2d59b', 300: '#f0cd7a', 400: '#e0a52a', 500: '#d9920b', 600: '#6e5316', 700: '#7a4d09', 800: '#28200f' },
  // `info`: the old scale was a saturated, undiluted blue (~221°, ~80% sat)
  // — the one hue in this family with no relationship to the warm ecru/
  // chocolate/conch palette, so it read as an import rather than a member of
  // the set. Re-hued to a muted steel-teal (~195°, ~35–40% sat): still
  // unambiguously "blue" against the other three warm hues, but grayed and
  // warmed enough to sit in the same register as `urchin`/`shell`.
  pacific: { 100: '#e7efee', 200: '#c3d6d4', 300: '#a1bfbd', 400: '#6e9694', 500: '#4c7573', 600: '#395857', 700: '#2c4442', 800: '#16211f' },
};

// Radius 0 throughout — flat maison geometry, not a rounded-corner register.
/** `nesting: '0'` — hard-edged by identity; derived radii stay square. */
const southSeaRadius = { control: '0px', full: '9999px', nesting: '0', cornerShape: 'round' };
// rem, not px (16px root) — spacing/control-height scale with a user's base
// font-size preference, not just page zoom. Same reasoning as pearl.css.ts.
const southSeaSpace = { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem', '2xl': '3rem' };
const southSeaControlHeight = { sm: '2rem', md: '2.5rem', lg: '3rem', xl: '3.5rem' };
const southSeaFontWeight = { regular: '400', medium: '500', semibold: '600', bold: '700' };
// Zodiak (Fontshare, free) is the roman editorial serif carrying
// display/heading; body stays a clean neutral sans. Falls back to Georgia —
// a system serif with a genuine (not synthesized) italic — so the
// roman/italic mix stays real even before the CDN font loads.
export const southSeaFonts = {
  serif: "'Zodiak', Georgia, 'Times New Roman', serif",
  /**
   * The ITALIC half of the roman/italic mix — Times, deliberately, and NOT
   * Zodiak's own italic.
   *
   * This looks like a mistake and isn't. The design canvas
   * (`design/Pearl Directions.dc.html`, frames 11a/13a) was authored against
   * `font-family: Zodiak, serif` while its Fontshare request
   * (`zodiak@400,500,700`) never asked for an italic style — so every
   * italic in that canvas silently fell through to the local system serif
   * and was composed, and signed off, in **Times Italic**. Verified in
   * DevTools: `PostScript name: Times-Italic, Font origin: Local file`.
   *
   * Times' italic is a high-contrast calligraphic face; Zodiak's is squarer
   * and far more contemporary. They are not interchangeable, and the
   * calligraphic one is the maison voice this theme was designed around. So
   * the fallback is promoted to the intended face rather than "corrected"
   * to Zodiak and losing the identity.
   *
   * `Times` before `'Times New Roman'`: macOS resolves `Times` to the exact
   * PostScript face the reference rendered; Windows has only Times New
   * Roman, which is the closest equivalent there.
   */
  serifItalic: "Times, 'Times New Roman', Georgia, serif",
  sans: "'General Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  /**
   * Boska (Fontshare, free) — the theme's third voice, carrying all
   * heading AND display scale steps (see those `globalStyle` rules below):
   * sentence-case Regular for headings, uppercase Regular for display —
   * distinct from the italic Zodiak/Times mix body text runs on. One
   * weight (Regular/400) across the board; no Light cut in use anywhere in
   * this theme. Falls back to Georgia, not Zodiak — this face has no
   * relationship to the roman/italic pairing, so it shouldn't inherit that
   * fallback's identity either.
   */
  boska: "'Boska', Georgia, serif",
};
const southSeaFontFamily = {
  display: southSeaFonts.serif,
  heading: southSeaFonts.serif,
  body: southSeaFonts.sans,
  mono: "ui-monospace, 'SF Mono', Menlo, monospace",
};
// Sizes follow the shared 4px-grid ramp (see pearl.css.ts's pearlText comment
// for the rationale, incl. caption's deliberate 11px escape); weight/tracking
// stay South Sea's own.
const southSeaText = {
  caption: { fontSize: '0.6875rem', lineHeight: '1.4545', fontWeight: '400', letterSpacing: '0' }, // 11px floor, 16px 4px-grid line-height
  bodySm: { fontSize: '0.75rem', lineHeight: '1.6667', fontWeight: '400', letterSpacing: '0' }, // 20px 4px grid
  bodyMd: { fontSize: '1rem', lineHeight: '1.5', fontWeight: '400', letterSpacing: '0' }, // 24px 4px grid
  bodyLg: { fontSize: '1.5rem', lineHeight: '1.5', fontWeight: '400', letterSpacing: '0' }, // 36px 4px grid
  headingSm: { fontSize: '2rem', lineHeight: '1.25', fontWeight: '600', letterSpacing: '-0.01em' }, // 40px 4px grid
  headingMd: { fontSize: '2.5rem', lineHeight: '1.2', fontWeight: '600', letterSpacing: '-0.015em' }, // 48px 4px grid
  headingLg: { fontSize: '3.5rem', lineHeight: '1.142857', fontWeight: '600', letterSpacing: '-0.02em' }, // 64px 4px grid
  displaySm: { fontSize: '4.5rem', lineHeight: '1.056', fontWeight: '700', letterSpacing: '-0.02em' }, // 76px 4px grid
  displayLg: { fontSize: '7rem', lineHeight: '1.071429', fontWeight: '700', letterSpacing: '-0.02em' }, // 120px 4px grid
  displayXl: { fontSize: '9.5rem', lineHeight: '1.052632', fontWeight: '700', letterSpacing: '-0.025em' }, // 160px 4px grid
};

export const southSeaLightThemeClass = createTheme(vars, {
  color: {
    background: southSeaSand[100],
    surface: southSeaSand[200],
    overlay: southSeaScrim.light,
    overlaySubtle: 'rgba(59, 42, 31, 0.08)',
    backgroundInverse: southSeaDriftwood[900],
    surfaceInverse: southSeaDriftwood[850],
    text: southSeaDriftwood[750],
    textSubtle: southSeaSand[600],
    textInverse: southSeaSand[150],
    textInverseSubtle: southSeaDriftwood[500],
    border: southSeaSand[400],
    borderStrong: southSeaSand[500],
    borderSubtle: southSeaSand[300],
    borderInverse: southSeaDriftwood[700],
    shadow: southSeaSand[500],
    // Conch is the one loud accent — reused for `primary` and `accent` rather
    // than authoring a second CTA hue: the maison identity is "one small
    // loud thing per view," not two.
    primary: southSeaConch[300],
    onPrimary: southSeaDriftwood[750],
    accent: southSeaConch[300],
    accentHover: southSeaConch[400],
    accentSubtle: southSeaConch[100],
    onAccent: southSeaDriftwood[750],
    onAccentSubtle: southSeaDriftwood[750],
    focusRing: southSeaConch[400],
    // `icon` is toned down toward `textSubtle` via `color-mix` — the raw
    // sentiment hue at full strength reads as more visually prominent than
    // body text despite having a lower luminance-contrast ratio (saturation,
    // not just lightness, drives perceived prominence); 65% keeps the hue
    // identifiable while quieting it below both `text` and plain body copy.
    positive: { surface: southSeaSentiment.seaMoss[100], border: southSeaSentiment.seaMoss[200], text: southSeaSentiment.seaMoss[700], icon: `color-mix(in srgb, ${southSeaSentiment.seaMoss[500]} 65%, ${vars.color.textSubtle})` },
    negative: { surface: southSeaSentiment.urchin[100], border: southSeaSentiment.urchin[200], text: southSeaSentiment.urchin[600], icon: `color-mix(in srgb, ${southSeaSentiment.urchin[500]} 65%, ${vars.color.textSubtle})` },
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
    backgroundInverse: southSeaSand[100],
    surfaceInverse: southSeaSand[200],
    text: southSeaSand[150],
    textSubtle: southSeaDriftwood[500],
    textInverse: southSeaDriftwood[750],
    textInverseSubtle: southSeaSand[600],
    border: southSeaDriftwood[700],
    borderStrong: southSeaDriftwood[600],
    borderSubtle: southSeaDriftwood[800],
    borderInverse: southSeaSand[400],
    shadow: southSeaDriftwood[600],
    // Conch stays the same hue across modes (11a/11b) — a mode-invariant
    // swatch, same model as Pearl's sentiment steps — brightened one notch
    // (`conch[200]`) only where it sits as hover feedback against the dark
    // ground, not as a second accent.
    //
    // `onPrimary`/`onAccent`/`accentSubtle` read from `driftwood`, not from
    // conch: a text foreground and a dark-mode background are neutral jobs,
    // and conch is an accent-only palette (see `southSeaConch`'s comment for
    // the two steps deleted over exactly this). This also brings South Sea
    // in line with Pearl/Freshwater/Tahitian, all of which already source
    // `onAccent` from a neutral.
    primary: southSeaConch[300],
    onPrimary: southSeaDriftwood[900],
    accent: southSeaConch[300],
    accentHover: southSeaConch[200],
    accentSubtle: southSeaDriftwood[800],
    onAccent: southSeaDriftwood[900],
    onAccentSubtle: southSeaSand[150],
    focusRing: southSeaConch[200],
    positive: { surface: southSeaSentiment.seaMoss[800], border: southSeaSentiment.seaMoss[600], text: southSeaSentiment.seaMoss[300], icon: `color-mix(in srgb, ${southSeaSentiment.seaMoss[400]} 65%, ${vars.color.textSubtle})` },
    negative: { surface: southSeaSentiment.urchin[800], border: southSeaSentiment.urchin[700], text: southSeaSentiment.urchin[300], icon: `color-mix(in srgb, ${southSeaSentiment.urchin[400]} 65%, ${vars.color.textSubtle})` },
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

// ---- Role treatments (southSeaRoles in south-sea.roles.ts) ----
//
// The role table declares intent (which treatment fulfills which job); this
// is where that intent actually becomes CSS. `Text` only ever writes
// `data-role` — each theme decides here what the attribute looks like.
// Mode-agnostic (one rule covers both theme classes): none of these three
// treatments reference a color, so there's nothing for light/dark to diverge
// on the way `inlineEmphasis`'s gradient does in Tahitian.

// `serifItalic` — the roman/italic serif mix. Verified against Fontshare's
// live Zodiak delivery (both roman and italic download and apply
// correctly), so this is a genuine italic style switch, not an oblique fake
// riding on a fallback font.
globalStyle(`${southSeaLightThemeClass} [data-role="inlineEmphasis"], ${southSeaDarkThemeClass} [data-role="inlineEmphasis"]`, {
  fontFamily: southSeaFonts.serifItalic,
  fontStyle: 'italic',
  letterSpacing: '-0.02em',
});

// Body text borrows the italic voice for variety — Zodiak roman stays the
// workhorse for `display`/`heading`'s base font-family token, but these
// specific scale steps switch to the italic face outright rather than
// needing `role="inlineEmphasis"` on every call site. Each scale keeps its
// OWN letter-spacing (already tuned per step in `southSeaText`, above) —
// only the wordmark's `inlineEmphasis` rule gets an explicit override,
// matching the one concrete tracking value the design reference specified.
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

// Headings: Boska, sentence case, roman, Regular — NOT the uppercase poster
// treatment `display*` gets below. `southSeaText`'s own casing (whatever
// the caller typed) stands, so `textTransform` is left unset here.
//
// `letterSpacing: 'normal'` deliberately DROPS `southSeaText`'s own
// per-step negative tracking (-0.01/-0.015/-0.02em) rather than reusing it:
// those values were tuned against Zodiak/Times' metrics, and Boska runs
// noticeably tighter at the same negative tracking — enough that adjacent
// letters started touching at `headingLg` size. Zero tracking is the
// deliberately safe choice until this face gets its own tuned (positive or
// near-zero) values per step.
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

// The wordmark (`WordMark`/`HeroNav`) carries BOTH `data-type-scale="headingMd"`
// and `data-role="inlineEmphasis"` on the SAME element — unlike the display
// case below, there's no nested descendant to give one selector higher
// specificity, so the two single-attribute selectors above tie and source
// order alone decided the winner (the heading rule, being later, was
// silently clobbering the wordmark's Times italic with Boska). This compound
// selector — both attributes on one element — outranks either rule alone and
// restores the roman/italic mix wherever a heading step is also marked
// `inlineEmphasis`.
globalStyle(
  [
    `${southSeaLightThemeClass} [data-type-scale="headingSm"][data-role="inlineEmphasis"]`,
    `${southSeaDarkThemeClass} [data-type-scale="headingSm"][data-role="inlineEmphasis"]`,
    `${southSeaLightThemeClass} [data-type-scale="headingMd"][data-role="inlineEmphasis"]`,
    `${southSeaDarkThemeClass} [data-type-scale="headingMd"][data-role="inlineEmphasis"]`,
    `${southSeaLightThemeClass} [data-type-scale="headingLg"][data-role="inlineEmphasis"]`,
    `${southSeaDarkThemeClass} [data-type-scale="headingLg"][data-role="inlineEmphasis"]`,
  ].join(', '),
  {
    fontFamily: southSeaFonts.serifItalic,
    fontStyle: 'italic',
    letterSpacing: '-0.02em',
  },
);

// Display (all three steps, including the hero numerals like "1,284" that
// ride `displaySm`) — Boska, uppercase, roman, Regular. One weight across
// the whole Boska range now (no Light cut in use anywhere in this theme —
// see `southSeaFonts.boska`'s own comment). Same `letterSpacing: 'normal'`
// reasoning as headings above: `southSeaText`'s per-step negative tracking
// was tuned for Zodiak, not Boska.
//
// The second selector (`[data-role="inlineEmphasis"]` nested inside)
// matters: a display headline can carry an inline-emphasized word (see
// Introduction.tsx's hero) as a separate nested element, and that word
// would otherwise inherit the theme's italic Times treatment — wrong here,
// since Boska has no relationship to the roman/italic mix at all. Matching
// one extra attribute (the `[data-type-scale="..."]` ancestor) gives this
// higher specificity than `inlineEmphasis`'s own rule above, regardless of
// source order.
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

// Field's label — a plain element (not `<Text>`), so it never carries
// `data-type-scale`/`data-role` and falls outside every rule above. Matched
// to `caption`/`preheading`'s own treatment instead: General Sans, Light,
// uppercase, `textSubtle` for color (the design reference's own muted
// taupe/fawn on its form labels — 13a). Tracking is deliberately its OWN,
// tighter value — `preheading`'s `0.28em` (tuned for a short all-caps word
// like "COLLECTION") reads as too loose on a label sitting right above an
// input, so this is closer to the button's `0.14em`.
// `fontWeight: '300'` is a deliberate escape from `southSeaFontWeight`
// (regular/medium/semibold/bold — no light tier) for the same reason
// `boska`'s comment gives: one caller wants a real Light cut, not a shared
// scale step.
globalStyle(`${southSeaLightThemeClass} .${fieldMeta} .${fieldLabel}, ${southSeaDarkThemeClass} .${fieldMeta} .${fieldLabel}`, {
  fontFamily: southSeaFonts.sans,
  fontWeight: '300',
  textTransform: 'uppercase',
  letterSpacing: '0.14em',
  color: vars.color.textSubtle,
});

// The value a person actually types, plus hint/error copy — all body
// prose, so all three run the same italic voice `bodySm`/`bodyMd`/`bodyLg`
// get above. `errorText`/`requiredMark`'s sentiment color stays untouched
// (that's the point of those elements) — only the face changes.
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

// Bare caption-scale text (not just `role="preheading"`, which already
// covers itself below) — button text, standalone captions: General Sans,
// uppercase, the same airy `0.28em` tracking `preheading` uses (matched, not
// the field label's tighter `0.14em` — a standalone caption isn't crowding
// an input the way a label is). `southSeaText.caption`'s own tracking is
// `0`, tuned for mixed-case reading, not uppercase micro-type. The maison's
// micro-type register stays quiet, legible sans against the display/heading
// serif, per the design reference.
globalStyle(`${southSeaLightThemeClass} [data-type-scale="caption"], ${southSeaDarkThemeClass} [data-type-scale="caption"]`, {
  fontFamily: southSeaFonts.sans,
  textTransform: 'uppercase',
  letterSpacing: '0.28em',
});

// Uppercase text at the canon recipe's own padding/size reads cramped —
// caps run wider than mixed case at the same size, and the recipe's padding
// was tuned for mixed case. Wider horizontal padding, a size down
// (`bodySm`, not `bodyMd`), and tracking (uppercase without it looks like
// an accident, not a choice) — matching the airier "REQUEST A VIEWING" /
// "SIGN UP" button register in the design reference (11a/11b/13a).
globalStyle(`${southSeaLightThemeClass} [data-component="button"], ${southSeaDarkThemeClass} [data-component="button"]`, {
  fontFamily: southSeaFonts.sans,
  textTransform: 'uppercase',
  fontSize: vars.text.bodySm.fontSize,
  letterSpacing: '0.14em',
  paddingLeft: vars.space.lg,
  paddingRight: vars.space.lg,
});

// `slashLabel` — preheading's `/ LABEL /` idiom, at caption size (see
// `southSeaRoles.preheading.size` in south-sea.roles.ts).
globalStyle(`${southSeaLightThemeClass} [data-role="preheading"], ${southSeaDarkThemeClass} [data-role="preheading"]`, {
  fontFamily: southSeaFonts.sans,
  textTransform: 'uppercase',
  letterSpacing: '0.28em',
});

// `sansBody` — dataDigits honestly aliases to the plain sans; no tabular
// mono face exists in this theme (ADR-0007 rule 1).
globalStyle(`${southSeaLightThemeClass} [data-role="dataDigits"], ${southSeaDarkThemeClass} [data-role="dataDigits"]`, {
  fontFamily: southSeaFonts.sans,
});

// The shared Button recipe's canon primary carries an `inset 0 1px 0
// accentSubtle` top-highlight, sized for Pearl's near-fill-hued
// `accentSubtle`. South Sea's is `conchMist`/`conchDusk` — a light wash,
// miles off the flat conch fill — so that same inset reads as a stark seam
// across the top edge, not a sheen. The doc is explicit that South Sea gets
// no effect at all ("No named effect. Its identity is type, space, and
// restraint..."; discard the contract's fabricated luster), so it's dropped
// entirely rather than re-tuned — same call Pearl's own comment on this
// exact inset technique reached for its flagship button ("read as *borders*
// rather than as light"). A background hue-shift carries hover/press
// feedback instead.
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
    // The base recipe's own `:hover` rule (translateY lift + drop shadow)
    // outranks this file's plain resting `boxShadow: none` once `:hover`
    // matches — needs restating here, not just at rest.
    backgroundColor: `color-mix(in srgb, ${vars.color.primary} 85%, ${vars.color.accent})`,
    boxShadow: 'none',
    transform: 'none',
  },
);

// ---- 9c: the golden-hour sphere (dark mode only, hover-triggered) ----
//
// `PearlSphere` reads `pearlTreatments.luster` directly (it's bespoke brand
// artwork, not a themeable canon component — see its own file comment), so
// giving South Sea's dark mode a different sphere means overriding its two
// styled elements (`sphereBody`/`sphereContact`) here, the same mechanism
// Tahitian uses for its own sphere override in `tahitian.css.ts`.
//
// Approximated from 9c's visible swatches (`champagne.800 · gold.700 ·
// dusk.850`) — the frame's exact hex stops weren't legible in the reference
// capture, so these are a best-effort match to the labeled hues, not a
// pixel-exact port. Revisit against the source render if precision matters.
const southSeaGoldenHour = {
  champagne800: '#8C6A34',
  gold700: '#A67C2E',
  dusk850: '#1C120A',
};

// 115deg matches 9c's own labeled angle — coincidentally the same angle
// Pearl's `sheenBand` sweeps at, but this is a separate gradient with South
// Sea's own warm stops, not a shared treatment.
const southSeaSheenBand = `linear-gradient(115deg, transparent 32%, ${southSeaGoldenHour.champagne800}66 44%, ${southSeaGoldenHour.gold700}80 52%, transparent 72%)`;
const southSeaSheenFrom = '118% 0';
const southSeaSheenTo = '34% 0';

const southSeaSweep = keyframes({
  '0%, 100%': { backgroundPosition: `${southSeaSheenFrom}, center` },
  '50%': { backgroundPosition: `${southSeaSheenTo}, center` },
});

// Static by default — "golden hour, held still": the sheen band sits fully
// off to one side (`sheenFrom`) and only the hover rule below sets it
// sweeping. This is why the override doesn't just add `animation` on top of
// `PearlSphere.css.ts`'s own always-on `sweep` — that keyframe is baked to
// Pearl's own sheen positions, not South Sea's.
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

// TEMP-DISABLED — candidate B for review, remove or keep.
/*
globalStyle(`${southSeaLightThemeClass} [data-component="tag"][data-variant="positive"]`, {
  background: southSeaSentiment.lagoon[600],
  color: southSeaSand[100],
  border: 'none',
});
globalStyle(`${southSeaDarkThemeClass} [data-component="tag"][data-variant="positive"]`, {
  background: southSeaSentiment.lagoon[300],
  color: southSeaDriftwood[900],
  border: 'none',
});
*/

