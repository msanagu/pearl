import { createTheme, globalStyle } from '@vanilla-extract/css';
import { vars } from '@/theme.css';
import { fieldMeta, label as fieldLabel } from '@components/Field/Field.css';
import { body as sphereBody, contact as sphereContact } from '@components/_brand/PearlSphere.css';

/**
 * Freshwater — one of Pearl's three named themes
 * (docs/theme/theme-revision-decisions.md §4, source turn **2a, "Ice
 * Console"**). Stark black/white ops-console register: neon electric-blue
 * spent only where the system speaks — statuses, deltas, selection — never
 * as decoration. Radius 0 throughout; a heavy 2px ink rule marks structural
 * divisions (e.g. under a header), a 1px hairline everywhere else.
 *
 * `accentSubtle` (see `glacier[100]` below) is deliberately near-white and
 * stationary — it marks a semantic region, not a decorative luster. This
 * replaces an earlier teal/turquoise, 6px-radius placeholder that predated
 * the theme-revision pass.
 *
 * ## Neutral consolidation (2026-08-29)
 * Previously three loosely-related buckets (`freshwaterLightPrimitives`'s
 * non-accent members, `freshwaterSlate`, `freshwaterDarkPrimitives`'s
 * non-accent members) named colors by where they were used
 * (`paper`/`hairline`/`abyss`) rather than what they are. Collapsed into two
 * hue families, same rule Pearl's `alabaster`/`squidInk` already follow
 * (ADR-0005 primitive tier, one hue per lightness register, not one name per
 * usage): `ice` covers the light register (steps 100–500), `graphite` covers
 * the dark register (steps 500–900). A step number means the same lightness
 * in both scales' own register; cross-mode reuse (e.g. dark mode's text
 * borrowing `ice[100]` directly) works the same way Pearl's `squidInk[900]`
 * / `alabaster[300]` "moonlight" borrow does — see the theme classes below.
 *
 * The accent hue (formerly five separately-named `ice*` primitives) is now
 * one scale, `glacier`, for the same reason.
 *
 * Two color tiers (ADR-0005): `*Primitives`/scales are raw named hexes; the
 * `*ThemeClass` calls map them onto semantic roles. Scales are this theme's
 * own — not shared with Pearl/Tahitian/South Sea.
 */

// ---- Type primitives (named by what they ARE — no roles assigned here) ----
export const freshwaterFonts = {
  grotesk: "'Space Grotesk', system-ui, -apple-system, 'Segoe UI', sans-serif",
  mono: "'Azeret Mono', ui-monospace, 'SF Mono', Menlo, monospace",
};

// ---- Color primitives ----

/**
 * [derived] Light-register neutral, one cool near-white hue stepped
 * 100 (brightest) → 400 (least light) — replaces `paper`/`cloud` and the old
 * `freshwaterSlate` scale. Only spans its light end, same as Pearl's
 * `alabaster`; the dark register lives in `freshwaterGraphite` below, not as
 * a continuation of this scale.
 *
 * Every step here sits above OKLCH L 0.92 — a tight near-white band. The
 * former `500` (`#5b5b60`, L 0.473) was not a member of that band at all; it
 * moved to `graphite[550]` on 2026-08-29. See `freshwaterGraphite`'s note.
 */
export const freshwaterIce = {
  100: '#fdfdfd', // paper — page background (light) / borrowed as text + backgroundInverse/surfaceInverse (dark)
  200: '#fafafa', // cloud — raised surface (light) / borrowed as surfaceInverse (dark)
  300: '#eef0f1', // border, subtle
  400: '#e3e5e7', // border / borrowed as borderInverse (dark)
};

/**
 * [derived] Dark-register neutral, stepped 500 (least dark) → 900
 * (darkest) — replaces `abyss`/`charcoal`/`ash`/`graphite`/`graphiteSubtle`.
 * Only spans its dark end, mirroring Pearl's `squidInk`; `graphite[900]` is
 * also borrowed directly as light mode's `text` (a "same hex, different
 * role" reuse, not a duplicate value — same pattern as `freshwaterIce[100]`
 * being borrowed as dark mode's `text`).
 *
 * ## Both mid-tones live here (2026-08-29)
 * `550` arrived from `ice[500]` — same hex, refiled. The two scales had been
 * split by *which mode consumed a step* rather than by *what value it is*,
 * which put the two mid-greys on opposite sides of the divide and inverted
 * them: `graphite[500]` (L 0.707) was lighter than `ice[500]` (L 0.473), so
 * the dark palette's lightest step outranked the light palette's darkest,
 * while both claimed rung 500 despite sitting 2.6:1 apart.
 *
 * Both now sit at graphite's light end, ordered by value. Freshwater has no
 * third home for mid-tones the way Pearl parks them in `marineLayer` — that
 * only works there because Pearl's accent measures 0.028 chroma and reads as
 * a tinted neutral; `glacier` peaks at 0.137 and could never carry muted text
 * (ADR-0010, "What a palette may be used for").
 *
 * `550`, not a renumber of `600`–`900`: the half-step keeps the churn to one
 * key and matches the precedent already set by `sand[150]`/`driftwood[750]`
 * in South Sea. The rung spacing here is genuinely lumpy — L 0.707, 0.473,
 * then 0.296/0.248/0.209/0.168 bunched at the dark end — but that is the
 * canonical-ladder work, not this refiling.
 */
export const freshwaterGraphite = {
  500: '#9da1a6', // text, subtle (dark)
  550: '#5b5b60', // text, subtle (light) — ex-`ice[500]`, see above
  600: '#2b2d30', // border (dark) / borrowed as borderInverse (light)
  700: '#202123', // border, subtle (dark) / accentSubtle (dark)
  800: '#17181a', // raised surface (dark) / borrowed as surfaceInverse (light)
  900: '#0e0f10', // page background (dark) / borrowed as text + backgroundInverse (light)
};

/**
 * [derived] The accent hue — electric blue, spent only where the system
 * speaks (statuses, deltas, selection, the primary CTA). One scale reused
 * across both modes rather than five separately-named `ice*` primitives:
 * `100`/`600` are the near-white wash and near-black dusk used as
 * `accentSubtle` in light/dark respectively, `200`–`500` are the hue itself
 * at descending lightness. Steps happen to fall in strict lightness order
 * (unlike `freshwaterIce`/`freshwaterGraphite`, which only span one register
 * each) because this hue is genuinely used across the full range in both
 * modes.
 */
export const freshwaterGlacier = {
  100: '#e9fbff', // wash — accentSubtle, light mode
  200: '#5fe1ff', // bright step — text on the solid-ink primary fill, light mode
  300: '#4dd8ff', // accent, dark mode
  400: '#00b8e6', // accent, light mode
  500: '#0089b3', // deep step — accentHover, light mode
};

const freshwaterScrim = {
  light: 'rgba(14, 15, 16, 0.5)',
  dark: 'rgba(0, 0, 0, 0.6)',
};

// [derived] Sentiment families, one flattened 100 (lightest)→800 (darkest)
// scale per hue, shared by both modes — a step number means the same
// lightness regardless of which theme mode reads it. Retuned 2026-08-29 for
// harmony with the cool, vibrant `glacier` accent: `spring` (positive) is a
// cool mint kept out of `glacier`'s own blue range so the two don't read as
// one hue; `pool` (info, ~226° indigo-blue) stays as-is — closest in the
// wheel to `glacier` (~193°) of any sentiment hue, which is deliberate, it's
// the system's other "cool, electric" signal; `canyon` (negative) is the
// palette's one warm hue, picked over a cooler red/coral so it doesn't fight
// `pool` for the "which blue is this" read; `sulphur` (warn) leans
// yellow-green rather than amber, keeping it out of `canyon`'s warm range.
export const freshwaterSentiment = {
  spring: { 100: '#e4f9f1', 200: '#b7ecda', 300: '#7fdcbc', 400: '#2cbe8d', 500: '#0a9e6e', 600: '#0c7050', 700: '#0a5540', 800: '#0b241c' },
  canyon: { 100: '#fbede7', 200: '#f0c4b0', 300: '#e8a084', 400: '#d46b45', 500: '#b14e2e', 600: '#7a3620', 700: '#622a1a', 800: '#271410' },
  sulphur: { 100: '#fbf6dc', 200: '#ede29a', 300: '#dccb5a', 400: '#c2ac24', 500: '#8f7e14', 600: '#645a12', 700: '#584f10', 800: '#242009' },
  pool: { 100: '#ebf1fe', 200: '#b9ccf7', 300: '#9fc0f5', 400: '#5a8cf0', 500: '#3b6fe0', 600: '#2c4a80', 700: '#1c3a80', 800: '#131d2e' },
};

// Deliberate deviation from the doc's "radius 0 throughout": a slight 2px
// control radius, so controls read as a hair softer than the console's own
// hard-edged cards/rules — `nesting: '0'` keeps the rest of the geometry
// (cards, panels) flat, this only touches controls.
const freshwaterRadius = { control: '2px', full: '9999px', nesting: '0', cornerShape: 'round' };
// rem, not px (16px root) — spacing/control-height scale with a user's base
// font-size preference, not just page zoom. Same reasoning as pearl.css.ts.
const freshwaterSpace = { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem', '2xl': '3rem' };
const freshwaterControlHeight = { sm: '2rem', md: '2.5rem', lg: '3rem', xl: '3.5rem' };
const freshwaterFontWeight = { regular: '400', medium: '500', semibold: '600', bold: '700' };
// Doc §4: "Space Grotesk (ideal: Söhne Breit) + Azeret Mono (ideal: Söhne
// Mono)." Deviates from the doc's "mono for data only" split: body copy now
// reads in Azeret Mono too, leaning further into the ops-console register —
// Space Grotesk stays reserved for display/heading. Both loaded via
// @fontsource in .storybook/preview.tsx.
const freshwaterFontFamily = {
  display: freshwaterFonts.grotesk,
  heading: freshwaterFonts.grotesk,
  body: freshwaterFonts.mono,
  mono: freshwaterFonts.mono,
};
// Sizes follow the shared 4px-grid ramp (see pearl.css.ts's pearlText comment
// for the rationale, incl. caption's deliberate 11px escape); weight/tracking
// stay Freshwater's own.
const freshwaterText = {
  caption: { fontSize: '0.6875rem', lineHeight: '1.4545', fontWeight: '400', letterSpacing: '0' }, // 11px floor, 16px 4px-grid line-height
  bodySm: { fontSize: '0.75rem', lineHeight: '1.6667', fontWeight: '400', letterSpacing: '0' }, // 20px 4px grid
  bodyMd: { fontSize: '1rem', lineHeight: '1.5', fontWeight: '400', letterSpacing: '0' }, // 24px 4px grid
  bodyLg: { fontSize: '1.5rem', lineHeight: '1.5', fontWeight: '400', letterSpacing: '0' }, // 36px 4px grid
  headingSm: { fontSize: '2rem', lineHeight: '1.25', fontWeight: '600', letterSpacing: '-0.005em' }, // 40px 4px grid
  headingMd: { fontSize: '2.5rem', lineHeight: '1.2', fontWeight: '600', letterSpacing: '-0.01em' }, // 48px 4px grid
  headingLg: { fontSize: '3.5rem', lineHeight: '1.142857', fontWeight: '600', letterSpacing: '-0.01em' }, // 64px 4px grid
  displaySm: { fontSize: '4.5rem', lineHeight: '1.056', fontWeight: '700', letterSpacing: '-0.02em' }, // 76px 4px grid
  displayLg: { fontSize: '7rem', lineHeight: '1.071429', fontWeight: '700', letterSpacing: '-0.03em' }, // 120px 4px grid
  displayXl: { fontSize: '9.5rem', lineHeight: '1.052632', fontWeight: '700', letterSpacing: '-0.035em' }, // 160px 4px grid
};

export const freshwaterLightThemeClass = createTheme(vars, {
  color: {
    background: freshwaterIce[100],
    surface: freshwaterIce[200],
    overlay: freshwaterScrim.light,
    overlaySubtle: 'rgba(14, 15, 16, 0.08)',
    backgroundInverse: freshwaterGraphite[900],
    surfaceInverse: freshwaterGraphite[800],
    text: freshwaterGraphite[900],
    textSubtle: freshwaterGraphite[550],
    textInverse: freshwaterIce[100],
    textInverseSubtle: freshwaterGraphite[500],
    border: freshwaterIce[400],
    // The doc's heavy "2px solid #0E0F10" structural rule — full ink, not a
    // lifted neutral step.
    borderStrong: freshwaterGraphite[900],
    borderSubtle: freshwaterIce[300],
    borderInverse: freshwaterGraphite[600],
    shadow: freshwaterIce[400],
    // Doc §4 Geometry: "Solid-ink primary (#0E0F10, white text), outlined
    // secondary." Primary is the console's own ink, not the glacier accent —
    // glacier is spent only where the system speaks (statuses, deltas,
    // selection), never as a CTA fill.
    primary: freshwaterGraphite[900],
    onPrimary: freshwaterIce[100],
    accent: freshwaterGlacier[400],
    accentHover: freshwaterGlacier[500],
    accentSubtle: freshwaterGlacier[100],
    onAccent: freshwaterGraphite[900],
    onAccentSubtle: freshwaterGraphite[900],
    focusRing: freshwaterGlacier[400],
    // `icon` is toned down toward `textSubtle` via `color-mix` — the raw
    // sentiment hue at full strength reads as more visually prominent than
    // body text despite having a lower luminance-contrast ratio (saturation,
    // not just lightness, drives perceived prominence); 65% keeps the hue
    // identifiable while quieting it below both `text` and plain body copy.
    positive: { surface: freshwaterSentiment.spring[100], border: freshwaterSentiment.spring[200], text: freshwaterSentiment.spring[700], icon: `color-mix(in srgb, ${freshwaterSentiment.spring[500]} 65%, ${vars.color.textSubtle})` },
    negative: { surface: freshwaterSentiment.canyon[100], border: freshwaterSentiment.canyon[200], text: freshwaterSentiment.canyon[600], icon: `color-mix(in srgb, ${freshwaterSentiment.canyon[500]} 65%, ${vars.color.textSubtle})` },
    warn: { surface: freshwaterSentiment.sulphur[100], border: freshwaterSentiment.sulphur[200], text: freshwaterSentiment.sulphur[700], icon: `color-mix(in srgb, ${freshwaterSentiment.sulphur[500]} 65%, ${vars.color.textSubtle})` },
    info: { surface: freshwaterSentiment.pool[100], border: freshwaterSentiment.pool[200], text: freshwaterSentiment.pool[700], icon: `color-mix(in srgb, ${freshwaterSentiment.pool[500]} 65%, ${vars.color.textSubtle})` },
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
    background: freshwaterGraphite[900],
    surface: freshwaterGraphite[800],
    overlay: freshwaterScrim.dark,
    overlaySubtle: 'rgba(255, 255, 255, 0.10)',
    backgroundInverse: freshwaterIce[100],
    surfaceInverse: freshwaterIce[200],
    text: freshwaterIce[100],
    textSubtle: freshwaterGraphite[500],
    textInverse: freshwaterGraphite[900],
    textInverseSubtle: freshwaterGraphite[550],
    border: freshwaterGraphite[600],
    // Structural rule inverts too — full paper-white against the dark
    // ground, the same "full ink" idea the light mode's rule carries.
    borderStrong: freshwaterIce[100],
    borderSubtle: freshwaterGraphite[700],
    borderInverse: freshwaterIce[400],
    // [derived] A shadow is occlusion: it must always DARKEN, and every
    // neutral this theme has in dark mode is lighter than `background` — so
    // this stays a fixed dark value rather than a `freshwaterGraphite` step,
    // same reasoning as Pearl's dark-mode `shadow` token.
    shadow: 'rgba(0, 0, 0, 0.55)',
    // Solid-ink primary flips with the ground: dark mode's "ink" fill is the
    // paper-white step, set against near-black text — same B/W-console
    // identity, inverted.
    primary: freshwaterIce[100],
    onPrimary: freshwaterGraphite[900],
    accent: freshwaterGlacier[300],
    accentHover: freshwaterGlacier[400],
    // A neutral, not a glacier step. The former `glacier[600]` (`#062a33`) was
    // a near-neutral filed under the accent — 0.043 chroma against glacier's
    // own 0.116–0.137 working range, and 1.06:1 against `graphite[700]`, i.e.
    // the same value. It was deleted 2026-08-29 (ADR-0010, "What a palette may
    // be used for"). `graphite[700]` sits one step above `surface`, so the
    // region still reads as raised; what it no longer carries is a teal tint,
    // which this theme's own identity rule argues against anyway — ice-blue is
    // "spent only where the system speaks," and a background wash is decoration.
    accentSubtle: freshwaterGraphite[700],
    onAccent: freshwaterGraphite[900],
    onAccentSubtle: freshwaterIce[100],
    focusRing: freshwaterGlacier[300],
    positive: { surface: freshwaterSentiment.spring[800], border: freshwaterSentiment.spring[600], text: freshwaterSentiment.spring[300], icon: `color-mix(in srgb, ${freshwaterSentiment.spring[400]} 65%, ${vars.color.textSubtle})` },
    negative: { surface: freshwaterSentiment.canyon[800], border: freshwaterSentiment.canyon[700], text: freshwaterSentiment.canyon[300], icon: `color-mix(in srgb, ${freshwaterSentiment.canyon[400]} 65%, ${vars.color.textSubtle})` },
    warn: { surface: freshwaterSentiment.sulphur[800], border: freshwaterSentiment.sulphur[600], text: freshwaterSentiment.sulphur[300], icon: `color-mix(in srgb, ${freshwaterSentiment.sulphur[400]} 65%, ${vars.color.textSubtle})` },
    info: { surface: freshwaterSentiment.pool[800], border: freshwaterSentiment.pool[600], text: freshwaterSentiment.pool[300], icon: `color-mix(in srgb, ${freshwaterSentiment.pool[400]} 65%, ${vars.color.textSubtle})` },
  },
  radius: freshwaterRadius,
  space: freshwaterSpace,
  controlHeight: freshwaterControlHeight,
  fontWeight: freshwaterFontWeight,
  fontFamily: freshwaterFontFamily,
  text: freshwaterText,
});

// The primary CTA's console-readout register — caps label in both modes.
globalStyle(
  `${freshwaterLightThemeClass} [data-component="button"][data-variant="primary"], ${freshwaterDarkThemeClass} [data-component="button"][data-variant="primary"]`,
  { textTransform: 'uppercase' },
);

// Light mode's primary fill is solid ink — `glacier[200]` (tuned for contrast
// on near-black) reads clean there, matching the reference mockup's button
// text. Dark mode's primary fill inverts to paper-white (see
// `freshwaterDarkThemeClass.color.primary` above), where this same bright
// cyan would fail contrast, so it keeps its default near-black `onPrimary`
// text instead of an accent override.
globalStyle(`${freshwaterLightThemeClass} [data-component="button"][data-variant="primary"]`, {
  color: freshwaterGlacier[200],
});

// The shared Button recipe's canon primary carries an `inset 0 1px 0
// accentSubtle` top-highlight, sized for Pearl's near-fill-hued
// `accentSubtle`. Freshwater's is a bright wash instead (`glacier[100]` in
// light, `graphite[700]` in dark) — miles off the solid-ink/paper-white fill —
// so that same inset reads as a stark seam across the top edge, not a sheen.
// The doc's own geometry rules this out anyway ("No offset shadows — those
// belong to 6a, a different flavor"), so it's dropped entirely rather than
// re-tuned; a background hue-shift carries hover/press feedback instead,
// same technique Pearl and Tahitian use for their own flat fills.
globalStyle(
  `${freshwaterLightThemeClass} [data-component="button"][data-variant="primary"], ${freshwaterDarkThemeClass} [data-component="button"][data-variant="primary"]`,
  { boxShadow: 'none' },
);
globalStyle(`${freshwaterLightThemeClass} [data-component="button"][data-variant="primary"]:not(:disabled):hover`, {
  // The base recipe's own `:hover` rule (translateY lift + drop shadow)
  // outranks this file's plain resting `boxShadow: none` once `:hover`
  // matches — needs restating here, not just at rest.
  backgroundColor: `color-mix(in srgb, ${vars.color.primary} 85%, ${vars.color.accent})`,
  boxShadow: 'none',
  transform: 'none',
});

// Dark mode: full bright-blue fill, ink border — the accent carries the
// whole box instead of a strip along one edge.
globalStyle(`${freshwaterDarkThemeClass} [data-component="button"][data-variant="primary"]`, {
  backgroundColor: freshwaterGlacier[300],
  color: freshwaterGraphite[900],
  border: `1px solid ${freshwaterGraphite[900]}`,
  boxShadow: 'none',
});
globalStyle(`${freshwaterDarkThemeClass} [data-component="button"][data-variant="primary"]:not(:disabled):hover`, {
  backgroundColor: freshwaterIce[100],
  boxShadow: 'none',
  transform: 'none',
});

// Input's resting border reads too quiet against the console's hard-edged
// register at the shared `color.border` hairline — `color.text` (near-black
// in light, near-white in dark) gives it the same weight as the labels
// sitting next to it.
globalStyle(
  `${freshwaterLightThemeClass} [data-component="input"], ${freshwaterDarkThemeClass} [data-component="input"]`,
  { borderColor: vars.color.text },
);

// Button text a step down from the base recipe's `bodyMd` — the console's
// buttons read as compact controls, not headline-weight CTAs.
globalStyle(
  `${freshwaterLightThemeClass} [data-component="button"], ${freshwaterDarkThemeClass} [data-component="button"]`,
  { fontSize: vars.text.bodySm.fontSize },
);

// Preheading role + Field's label: subtle mono caps, the console's own
// metadata idiom (same technique Tahitian uses for its Field label — see
// tahitian.css.ts, and the `fieldMeta`/`label` hook Field.css.ts documents
// for exactly this). `textSubtle`, not the label's own default `color.text`,
// because a mono-caps readout should recede behind the value it labels, not
// compete with it.
globalStyle(
  `${freshwaterLightThemeClass} [data-role="preheading"], ${freshwaterDarkThemeClass} [data-role="preheading"]`,
  {
    fontFamily: vars.fontFamily.mono,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: vars.color.textSubtle,
  },
);
globalStyle(
  [
    `${freshwaterLightThemeClass} .${fieldMeta} .${fieldLabel}`,
    `${freshwaterDarkThemeClass} .${fieldMeta} .${fieldLabel}`,
  ].join(', '),
  {
    fontFamily: vars.fontFamily.mono,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: vars.color.textSubtle,
  },
);

// `headingSm` and `displayLg` only, not the full heading→display range
// Tahitian uppercases (see tahitian.css.ts) — Freshwater's console register
// is restrained ("neon accent only where the system speaks," docs/theme/
// theme-revision-decisions.md §4), not poster-scale maximalism everywhere.
// `displaySm` (stat figures, numerals) is excluded on purpose: caps is a
// no-op on digits, so uppercasing it would do nothing for the numbers that
// scale actually carries. `displayLg` is where real statement headlines
// land, and `headingSm` is the console's own section-label register — those
// are the two worth the console shouting.
globalStyle(
  [
    `${freshwaterLightThemeClass} [data-type-scale="headingSm"]`,
    `${freshwaterDarkThemeClass} [data-type-scale="headingSm"]`,
    `${freshwaterLightThemeClass} [data-type-scale="displayLg"]`,
    `${freshwaterDarkThemeClass} [data-type-scale="displayLg"]`,
  ].join(', '),
  { textTransform: 'uppercase' },
);

// ---- 8b, adapted: Freshwater's own sphere ----
//
// `PearlSphere` reads `pearlTreatments.luster` directly (bespoke brand
// artwork — see its own file comment), so a per-theme look means overriding
// its two styled elements here, same mechanism as Tahitian's and South Sea's
// own sphere overrides.
//
// Not a port of 8b's soft nacre gradient — that reads as decorative, and
// this console's whole identity is "electric blue spent only where the
// system speaks, never as decoration" (file header). So: a hard two-tone
// split (`glacier[400]`/`glacier[200]`, no blended midtones) instead of a
// smooth radial, and a zero-blur offset shadow instead of a soft drop —
// flat, graphic shading to match the console's own flat surfaces (`radius:
// 0` everywhere else in this theme). Static, no sweep — an ambient animated
// loop is exactly the kind of decoration this theme's identity rules out;
// Pearl's is the one brand object allowed to animate at rest (`PearlSphere`'s
// own comment).
// Prior freshwater sphere version kept in git history for quick rollback.
globalStyle(`${freshwaterLightThemeClass} .${sphereBody}`, {
  backgroundImage: `
    radial-gradient(circle at 30% 24%, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.76) 16%, rgba(255,255,255,0.18) 28%, transparent 42%),
    radial-gradient(circle at 66% 76%, rgba(6, 67, 87, 0.28) 0%, rgba(6, 67, 87, 0.14) 32%, transparent 62%),
    linear-gradient(135deg, #ebffff 0%, #b8f2ff 12%, #67dfff 30%, #1db3de 52%, #0d8fbd 70%, #0b5f7d 100%)
  `,
  backgroundColor: '#1db3de',
  boxShadow: `0 0 0 2px ${freshwaterGraphite[900]}`,
  filter: 'contrast(1.08) saturate(1.08)',
  animation: 'none',
});
// Cast shadow lives on `sphereContact` alone now — a flattened ellipse, not
// a clone of the sphere's own circle. The highlight in `sphereBody`'s
// gradient sits at `30% 24%` (top-left), so the shadow it casts falls
// down-and-right, detached from the sphere's edge rather than fused to it.
globalStyle(`${freshwaterLightThemeClass} .${sphereContact}`, {
  background: 'radial-gradient(ellipse at center, rgba(14, 15, 16, 0.32) 0%, rgba(14, 15, 16, 0.16) 55%, transparent 78%)',
  opacity: 1,
  width: '130px',
  height: '34px',
  left: 'calc(50% + 22px)',
  bottom: '-22px',
});

globalStyle(`${freshwaterDarkThemeClass} .${sphereBody}`, {
  backgroundImage: `
    radial-gradient(circle at 30% 24%, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.7) 16%, rgba(255,255,255,0.16) 28%, transparent 42%),
    radial-gradient(circle at 66% 76%, rgba(5, 42, 56, 0.34) 0%, rgba(5, 42, 56, 0.14) 32%, transparent 62%),
    linear-gradient(135deg, #dffcff 0%, #a8efff 12%, #6fdfff 30%, #2cb0df 52%, #0b7eaa 70%, #083d4a 100%)
  `,
  backgroundColor: '#2cb0df',
  boxShadow: `0 0 0 2px ${freshwaterGraphite[900]}`,
  filter: 'contrast(1.1) saturate(1.12)',
  animation: 'none',
});
globalStyle(`${freshwaterDarkThemeClass} .${sphereContact}`, {
  background: 'radial-gradient(ellipse at center, rgba(0, 0, 0, 0.55) 0%, rgba(0, 0, 0, 0.28) 55%, transparent 78%)',
  opacity: 1,
  width: '130px',
  height: '34px',
  left: 'calc(50% + 22px)',
  bottom: '-22px',
});
