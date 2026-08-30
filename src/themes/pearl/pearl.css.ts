import { createTheme, globalStyle } from '@vanilla-extract/css';
import { vars } from '@/theme.css';

/**
 * Pearl — the flagship theme, and the one the docs site is pinned to.
 *
 * Canonical source is the exploration log, not the handoff's schema doc:
 * turn **4c** ("Canon — 1a layout × 1b vibe"), refined by **5a** ("canon,
 * refined"). 8a's pill controls were adopted and then retired (2026-08-28) —
 * see `pearlRadius` below. See `docs/theme/theme-revision-decisions.md` §3.
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
 * the phase plan). They are declared below and given roles in `pearl.roles.ts`.
 *
 * ## Treatments
 * `pearlTreatments.luster` is an **extension treatment** (see
 * `docs/decisions/0007-treatments-and-roles.md`) — theme-owned, not a
 * canon slot, with required roles in `pearl.roles.ts`.
 */

// ---- Type primitives (named by what they ARE — no roles assigned here) ----
// General Sans (Fontshare, free) carries display/heading/body, per the file
// header. It's loaded via the same CDN link South Sea already pulls it from
// (`.storybook/preview-head.html`) — no separate load, just named here so
// Pearl's stack resolves to it instead of falling through to system-ui.
// Gambetta (Fontshare, free) is loaded the same way, italic-only.
export const pearlFonts = {
  sans: "'General Sans', system-ui, -apple-system, 'Segoe UI', sans-serif",
  serif: "'Gambetta', Georgia, 'Times New Roman', serif",
  mono: "ui-monospace, 'SF Mono', Menlo, monospace",
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
// - `urchin` — cool violet-gray accent. Quiet work only: focus ring,
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

/**
 * ## Real separation, not four names for one swatch (2026-08-29)
 * The four steps used to span OKLCH L 0.203–0.289 — an 0.086 range, closer
 * together than `alabaster`'s own top four (0.889–0.991, a register that's
 * SUPPOSED to read as one near-white wash). Pairwise contrast bore that out:
 * every adjacent pair measured 1.06–1.18:1, and `surface`(800) against
 * `background`(900) — the pair carrying dark mode's entire "surface reads
 * above background" elevation claim (see the dark theme's `shadow` comment
 * below) — was 1.08:1. Functionally one color wearing four labels.
 *
 * `900` is untouched — it's canon ink/obsidian, referenced by name and by
 * hex elsewhere, not a step free to move. `600`–`800` now spread up from it in
 * even OKLCH steps (L 0.203 → 0.500, one hue, chroma climbing with lightness
 * the way a neutral's does), so each rung is honestly further from the ink
 * than the last:
 * - `800` vs `900` (elevation): 1.08:1 → **1.33:1**.
 * - `600` vs `900` (default border vs background): 1.27:1 → **2.98:1** — just
 *   under the 3:1 non-text floor, the quiet-but-real reading
 *   docs/foundations/control-affordances.md asks of a resting boundary,
 *   distinct from `borderStrong` (`urchin[400]`, 5:1+) which still
 *   carries the emphasis case.
 * - `700` vs `800` (borderFaint vs the surface it doubles as a border on):
 *   1.06:1 → **1.47:1**.
 *
 * `alabaster`'s equivalent register (100–300) has the identical shape of
 * problem — 1.06:1 between `surface` and `background` — left alone here since
 * it wasn't what was asked; the same fix would apply if it comes up.
 */
export const squidInk = {
  600: '#656072', // hairline — default border, dark mode
  700: '#494652', // hairlineFaint — surfaceHover doubles as faint border
  800: '#2F2D35', // slateDeep — raised surface
  900: '#17161A', // [4c/spec] ink / obsidian — primary text (light) / page background (dark)
};

/**
 * Urchin — Pearl's violet family. Chromatic across the whole ramp now,
 * not just at the deep end.
 *
 * ## Why every step moved, not just accent (2026-08-29)
 * The first pass fixed `600`/`700` in isolation — the two steps `accent`/
 * `accentHover` needed — and left `100`–`500` at their original 0.014–0.028
 * OKLCH chroma. That produced a ramp that visibly BROKE partway through: five
 * gray swatches, then two saturated violet ones bolted on the end, because
 * chroma dipped (0.028 → 0.022) right before jumping to 0.070.
 *
 * Chroma and lightness now both step evenly across all seven rungs — chroma
 * 0.018 → 0.080 in six equal increments, lightness 0.878 → 0.375 in six equal
 * decrements, one hue (297°) throughout. `100`–`500` read a hair more violet
 * than before at a glance; nothing that reads them as neutral-ish UI chrome
 * (borders, tints, sheen) depends on them staying gray, and the underlying
 * problem — `accent` needing to separate from `textSubtle` — is what forced
 * the ramp to have a real endpoint to travel to in the first place:
 *
 * - `600` (`#6A6672`, the pre-fix accent) measured **1.06:1 against `500`**,
 *   which is `textSubtle`. A link and a timestamp were the same color.
 * - Against 16.25:1 prose, a 5.04:1 link read as de-emphasized text — exactly
 *   backwards for the one thing on the line you can click.
 *
 * `600` now separates from `textSubtle` by value AND hue — 1.44:1 apart at
 * roughly double the chroma. `700` is its hover, one more even step down.
 *
 * Every text/border pairing below was re-measured against the ramp it lands
 * on, not assumed from the old values:
 * - `500` (`textSubtle`, light) — 4.58:1 on `background`, 4.86:1 on `surface`.
 * - `200` (`textSubtle`, dark) — 9.34:1 / 8.68:1 on the dark ground.
 * - `600` (`accent`, light) — 6.57:1 / 6.98:1. `700` (`accentHover`) — 9.48:1 /
 *   10.07:1.
 * - `100` (`accent`, dark) — 12.47:1 / 11.58:1, untouched in practice since it
 *   already cleared every bar by a wide margin.
 * - `400` (`borderStrong`, dark) — 5.03:1 / 4.67:1, still well past the 3:1
 *   non-text floor.
 * `300` as light mode's `borderStrong` was already below 3:1 against `surface`
 * before this pass (1.92:1) — an existing gap in what "emphasis" border means
 * here, not a regression this ramp introduces (it's now 2.34:1, closer but
 * still short).
 *
 * ## Pulled back at the light end (2026-08-29)
 * The even chroma ramp above (0.018 → 0.080, linear in `t`) reads as too
 * saturated where it does UI-chrome work — `textSubtle` and section labels
 * across the app suddenly read as visibly violet, not "text with a cool
 * cast." Linear chroma against six equal steps means `100` sits at nearly a
 * quarter of `700`'s saturation, which is loud for a step whose job is a
 * background wash.
 *
 * Chroma now follows `0.008 + 0.072 · t^1.3` (`t` = rung index ÷ 6) instead of
 * a straight line — an eased curve, not a lower ceiling: `700` is UNCHANGED
 * at 0.080 (it's `accentHover`, already contrast-verified), and the curve
 * only pulls in the steps below it, hardest at the light end (`100`: 0.018 →
 * 0.008, roughly half; `300`: 0.038 → 0.025) and easing off by the time it
 * reaches `500`/`600` (0.058 → 0.050, 0.068 → 0.065 — barely moved). Every
 * contrast pairing above was re-checked against the new values and still
 * holds: `500` 4.57:1/4.85:1, `200` (dark) 9.41:1/7.09:1, `400` (dark) 5.03:1/
 * 3.79:1, `600` 6.59:1/7.00:1.
 */
export const urchin = {
  100: '#D7D6DC', // marine — accentSubtle (light) / accent + focusRing (dark)
  200: '#BCBAC5', // lavenderPale — body copy, dark mode
  300: '#A39FB0', // marineStrong — emphasis border, light mode
  400: '#8A849D', // marineStrong — emphasis border, dark mode / accentSubtle, dark
  500: '#726A8A', // slate — body copy, light mode
  600: '#5C5078', // violet — accent + focusRing, light mode
  700: '#463766', // violetDeep — accentHover, light mode
};

/**
 * [derived] Alpha palettes — existing neutral steps re-rendered at partial
 * opacity, keyed by percent in increments of 5 (only the percents actually
 * used), so they composite over whatever's underneath instead of painting a
 * fixed surface. Two separate palettes, not one: `squidInkAlpha` anchors on
 * `squidInk[900]` (cool), `alabasterAlpha` on `alabaster[300]` (warm) —
 * squidInk has no pale step of its own to use instead (see squidInk's
 * comment above). Not anchored on `urchin` (accent) — most other
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
  algae: { 100: '#E8EDE6', 200: '#BCCBB8', 300: '#9BD3A6', 400: '#5FA36E', 500: '#4A7350', 600: '#33553B', 700: '#2C4A32', 800: '#16201A' },
  coral: { 100: '#F3E8E5', 200: '#DCBCB5', 300: '#EFA89C', 400: '#D46B5B', 500: '#A34C40', 600: '#733A31', 700: '#71322A', 800: '#281815' },
  sunlight: { 100: '#F3EDE1', 200: '#E4CA92', 300: '#D9C6A0', 400: '#C6A055', 500: '#8F7434', 600: '#6B5622', 700: '#634F22', 800: '#241E10' },
  tide: { 100: '#E7EAEF', 200: '#BCC4D3', 300: '#B9C3D6', 400: '#7E8CA8', 500: '#546480', 600: '#3A455C', 700: '#364156', 800: '#171A21' },
};

// ---- Scales (Pearl's own — themes do not share a scale file) ----

/**
 * Controls are a rounded rect, not a pill.
 *
 * 8a's `999px` was itself the deviation — canon (4c and 5a) uses `3px`. It was
 * retired 2026-08-28: a pill's *painted* radius is `height / 2` (21px at
 * Pearl's 42px control), which leaves no room for concentric nesting
 * (`outer = inner + gap`) against any card radius worth having. 12px sits
 * between canon's 3px and the pill, and keeps ~43% of the control's vertical
 * edge straight, so it reads as a rectangle rather than a lozenge.
 *
 * `control` (12px) deliberately sits BELOW `surface` (16px) — inner smaller
 * than outer. The gap is not yet the concentric one (that needs Card's padding
 * to drive `surface`); this only fixes the ordering, which the pill inverted.
 * See docs/TODO-concentric-radius.md.
 *
 * `full` is untouched: Tag and XButton stay pills by identity.
 */
const pearlRadius = { control: '12px', full: '9999px', nesting: '1', cornerShape: 'squircle' };

/**
 * [derived] `usage.density = comfortable` — the midpoint of the four themes.
 * rem, not px (16px root — see `globalStyles.css`): 0.25/0.5/1/1.5/2/3rem, so
 * spacing scales with a user's base font-size preference, not just page zoom.
 */
const pearlSpace = { xs: '0.25rem', sm: '0.5rem', md: '1rem', lg: '1.5rem', xl: '2rem', '2xl': '3rem' };

/** md = 2.625rem (42px) [spec ctrlH]; the rest derived around it. rem for the same reason as `pearlSpace`. */
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
 * Every step's fontSize is a strict 4px multiple (the 8px soft grid's floor),
 * with one deliberate escape: `caption` sits at 11px — the system's 11px
 * legibility floor for functional UI text — because the nearest true 4px
 * neighbors are 8px (below that floor) and 12px (collides with `bodySm`).
 * `lineHeight` is chosen so the resolved pixel value still lands on 4px
 * (16px, same as its neighbors) even though the fontSize itself is escaping
 * the grid, `caption` included.
 *
 * Numbers no longer trace to 4c's original spec (84px hero, 15px lede) — the
 * 4px grid is the binding contract now, not the source reference.
 */
const pearlText = {
  caption: { fontSize: '0.6875rem', lineHeight: '1.4545', fontWeight: '400', letterSpacing: '0' }, // 11px floor, 16px 4px-grid line-height
  bodySm: { fontSize: '0.75rem', lineHeight: '1.6667', fontWeight: '400', letterSpacing: '0' }, // 20px 4px grid
  bodyMd: { fontSize: '1rem', lineHeight: '1.5', fontWeight: '400', letterSpacing: '0' }, // 24px 4px grid
  bodyLg: { fontSize: '1.5rem', lineHeight: '1.5', fontWeight: '400', letterSpacing: '0' }, // 36px 4px grid
  headingSm: { fontSize: '2rem', lineHeight: '1.25', fontWeight: '500', letterSpacing: '-0.01em' }, // 40px 4px grid
  headingMd: { fontSize: '2.5rem', lineHeight: '1.2', fontWeight: '500', letterSpacing: '-0.015em' }, // 48px 4px grid
  headingLg: { fontSize: '3.5rem', lineHeight: '1.142857', fontWeight: '500', letterSpacing: '-0.02em' }, // 64px 4px grid
  displaySm: { fontSize: '4.5rem', lineHeight: '1.056', fontWeight: '500', letterSpacing: '-0.03em' }, // 76px 4px grid
  displayLg: { fontSize: '7rem', lineHeight: '1.071429', fontWeight: '500', letterSpacing: '-0.04em' }, // 120px 4px grid
  displayXl: { fontSize: '9.5rem', lineHeight: '1.052632', fontWeight: '500', letterSpacing: '-0.045em' }, // 160px 4px grid
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
    textSubtle: urchin[500],
    textInverse: alabaster[300], // moonlight — borrowed, see squidInk's comment above
    textInverseSubtle: urchin[200],

    border: alabaster[500],
    borderStrong: urchin[300],
    borderSubtle: alabaster[400],
    borderInverse: squidInk[600],
    shadow: urchin[300],

    // [4c] Primary CTA fill — the dark gradient's flat approximation (no
    // gradient token in canon yet; see decisions doc §8, "under evaluation").
    primary: squidInk[900],
    onPrimary: alabaster[300],

    // Pearl is an ink-primary identity, but `accent` stays genuinely subtle —
    // it is NOT the button fill (that's `primary`, above). Reusing accent for
    // both would make every subtle use (focus borders, underlines, hover
    // states) go loud too.
    //
    // `600`/`700`, not `100` — see `urchin`'s comment for why the whole
    // ramp is chromatic now. `accentHover` used to BE `squidInk[900]` (prose
    // ink); that made hover the loudest thing on the page rather than a step
    // beyond resting, and it left accent with nowhere to go on press. `700` is
    // a real hover: 1.44:1 darker than `600`, one more even step down the
    // same ramp.
    accent: urchin[600],
    accentHover: urchin[700],
    accentSubtle: urchin[100],
    onAccent: alabaster[300],
    onAccentSubtle: squidInk[900],
    /**
     * Urchin 600, not urchin 100 — the one place the "same hex in both modes"
     * symmetry below had to break.
     *
     * A focus ring is painted OUTSIDE the control, on the page, so the only
     * contrast that matters is ring-vs-background. Urchin 100 against linen is
     * 1.3:1 — in light mode the ring was, in practice, invisible on every
     * control that draws one (Button, Card, Input, XButton). Urchin 600 is the
     * ramp's violet accent step (6.6:1, `urchin`'s comment explains why
     * it's chromatic at all), which clears the 3:1 non-text minimum with room
     * to spare. Dark mode keeps marine 100 (12.5:1 on obsidian) — the step
     * differs per mode precisely so the *relationship* to the background stays
     * the same, which is the rule the palettes already follow everywhere else.
     */
    focusRing: urchin[600],

    // `icon` is toned down toward `textSubtle` via `color-mix` — the raw
    // sentiment hue at full strength reads as more visually prominent than
    // body text despite having a lower luminance-contrast ratio (saturation,
    // not just lightness, drives perceived prominence); 65% keeps the hue
    // identifiable while quieting it below both `text` and plain body copy.
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
    surface: squidInk[800],
    overlay: 'rgba(0, 0, 0, 0.62)', // [derived] pure black, not squidInk-anchored — a backdrop must always darken, and squidInk has no dark-appropriate pale step to flip to for this mode
    overlaySubtle: alabasterAlpha[10],
    backgroundInverse: alabaster[300],
    surfaceInverse: alabaster[200],

    text: alabaster[300], // moonlight — borrowed, see squidInk's comment above
    textSubtle: urchin[200],
    textInverse: squidInk[900],
    textInverseSubtle: urchin[500],

    border: squidInk[600],
    borderStrong: urchin[400],
    borderSubtle: squidInk[700],
    borderInverse: alabaster[500],
    // [derived] Black, not a urchin step. A shadow is occlusion: it must
    // always DARKEN. Every neutral this theme has in dark mode — marine,
    // squidInk's own steps — is LIGHTER than `background`, so used as a shadow
    // it renders as a halo glowing out from under the element instead of light
    // being blocked behind it. That glow is the dark-mode tell this theme is
    // trying not to have; the industry-standard dark elevation cue is already
    // present here without it (surface reads above background, plus a
    // hairline). Same argument, and the same pure-black answer, as `overlay`
    // above. Alpha rather than a solid so it composites over sentiment
    // surfaces; the recipes dilute it by geometry (negative spread), not by
    // fading the color, so the token itself carries the strength.
    shadow: 'rgba(0, 0, 0, 0.55)',

    // [spec] Mode swap inverts the CTA: dark fill on light, light fill on dark.
    // ("pill" in the original spec note — the shape is a rounded rect since
    // 2026-08-28; the mode-inversion point is unaffected.)
    primary: alabaster[100], // chalk
    onPrimary: squidInk[900],

    // Urchin 100 is the same hex in both modes — accentSubtle in light,
    // accent in dark — and never becomes a fill in either.
    accent: urchin[100],
    accentHover: alabaster[100], // chalk
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

// ---- Role treatments (pearlRoles in pearl.roles.ts) ----
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

// The face — unconditional. A role owns its treatment wherever it is set.
// Sentence case, body face (`pearlRoles.preheading` → `sansSentence` in
// pearl.roles.ts) — mono/upper/tracked is Freshwater/Tahitian's console
// idiom, not Pearl's; a plain sentence-case label like "Active sessions"
// read as a data readout under that treatment, which is the wrong register
// for the flagship's quiet register.
globalStyle(
  `${pearlLightThemeClass} [data-role="preheading"], ${pearlDarkThemeClass} [data-role="preheading"]`,
  {
    fontFamily: pearlFonts.sans,
  },
);

// The size — the role's *default* only, which is why it is gated on
// `:not([data-type-scale])`. Without a size the role would inherit the ambient
// scale and a preheading would render at body size, stopping it out-ranking the
// heading it sits above. But this is a default, not a mandate: `typeScale` and
// `role` are independent axes, so `role="preheading" typeScale="headingLg"`
// (the Hero's oversized `01`/`02` ordinals) has to keep the preheading face
// at the larger size. `Text` writes `data-type-scale` exactly when the caller
// named a scale, so this rule stands down whenever they did — otherwise its
// class+attribute specificity would silently outrank the recipe and pin every
// preheading to caption.
globalStyle(
  `${pearlLightThemeClass} [data-role="preheading"]:not([data-type-scale]), ${pearlDarkThemeClass} [data-role="preheading"]:not([data-type-scale])`,
  {
    fontSize: vars.text.caption.fontSize,
    lineHeight: vars.text.caption.lineHeight,
  },
);

// Pearl only. Its 12px control radius means an Input's left border curves away
// from the text baseline, so a label sitting flush at 0 reads a hair left of the
// value beneath it. A 2px nudge re-seats them.
//
// Deliberately a raw `2px` and not a scale token: this is an OPTICAL correction,
// and optical corrections are sub-grid by nature — the smallest step on the
// scale (`xs`, 4px) is already twice the error being fixed. Rounding it up to a
// token would overshoot and introduce the misalignment it exists to remove.
// See docs/foundations/spacing-system.md on the xs half-step for the general
// shape of this argument.
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
 * Pearl's primary CTA. The canon recipe gives every theme a lifted, floating
 * button (translateY + a spreading drop shadow); Pearl used to answer that by
 * deleting it (`boxShadow: none`, `transform: none`), which left the flagship
 * control with a flat ink slab and NO hover or press feedback at all — only the
 * focus ring said the thing was interactive.
 *
 * This replaces the deletion with a real treatment — one that keeps the flat
 * fill (the identity) and puts every affordance somewhere other than the fill's
 * own surface. The model is a seated control, not a floating card: it never
 * lifts, and it is grounded by a single contact shadow built from `color.shadow`
 * diluted by negative spread, the same way Card does it, rather than by fading
 * the token.
 *
 * Two earlier layers were tried and cut. A specular hairline along the top edge
 * and a 1px inner edge ring both read as *borders* rather than as light: the
 * inner ring drew a full stroke inside the fill, and the specular only made
 * physical sense in light mode (in dark it painted a dark line along the top of
 * a white button). The fill is now edge-to-edge in both modes.
 *
 * `accent` earns its place in the *states*, not the rest fill (the reasoning in
 * `color.accent` still holds: accent is the quiet signal color, and Pearl's CTA
 * is ink). Hover and press mix a little marine INTO the fill and bloom an
 * `accentSubtle` halo — the same halo language `secondary` already uses on
 * hover, so the two variants read as one system rather than two ideas.
 */

/** Both mode classes — for rules that are genuinely mode-agnostic. */
const pearlButton = (variant: 'primary' | 'secondary' | null, state = '') =>
  [pearlLightThemeClass, pearlDarkThemeClass].map((c) => sel(c, variant, state)).join(', ');

/** One mode only. Nothing needs it today; kept because `pearlButton` is built on it. */
const sel = (themeClass: string, variant: 'primary' | 'secondary' | null, state = '') =>
  `${themeClass} [data-component="button"]${variant ? `[data-variant="${variant}"]` : ''}${state}`;

const primaryCta = (state = '') => pearlButton('primary', state);

/**
 * Press occlusion. Black, not `color.shadow`, for the reason recorded on the
 * dark theme's `shadow` token — an inset must DARKEN. Here that argument binds
 * in *both* modes: light mode's `shadow` (#A39FB0) is far lighter than the ink
 * fill it would be painted inside, so it lightens the press instead of
 * deepening it. This is occlusion inside the control, unrelated to elevation
 * under it, so it is deliberately not a theme color slot.
 */
const ctaPress = 'rgba(0, 0, 0, 0.30)';

/**
 * Contact shadow. `color.shadow` is a SOLID token (marine 300 in light), so the
 * blur-to-spread ratio is the only thing diluting it — and the previous
 * `0 1px 2px -1px` barely diluted at all: the first pixel below the button
 * measured #CFCDD7, a crisp hairline hugging the fill that read as yet another
 * border. Widening the blur well past the spread turns the same token into an
 * actual gradient of occlusion.
 */
const ctaGround = `0 2px 6px -3px ${vars.color.shadow}, 0 10px 20px -12px ${vars.color.shadow}`;
const ctaGroundHover = `0 4px 10px -4px ${vars.color.shadow}, 0 14px 26px -14px ${vars.color.shadow}`;

/**
 * The focus ring, as a box-shadow pair rather than an `outline`.
 *
 * Two bugs forced this. First, `outline` is drawn as a plain rounded rect — it
 * does NOT follow `corner-shape: squircle`, so on Pearl the ring's corners bowed
 * away from the button's own and the `outline-offset` gap read as an uneven
 * white band pinching at each corner. `box-shadow` follows the border box
 * exactly, squircle included. Second, a ring needs 3:1 against what sits on BOTH
 * of its sides; a single flush ring against an ink fill cannot clear that
 * against the fill and the page at once. The 2px spacer in `background`
 * reproduces what `outline-offset` gave us, so the ring is only ever judged
 * against the page.
 *
 * (The spacer paints `background` even when the button sits on `surface` — in
 * Pearl those are linen and porcelain, ~1.5 L* apart, so the seam is invisible.
 * A theme with a high-contrast raised surface would need a different answer.)
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
  // Nacre, not a brightness step: mixing toward `accent` cools the ink in light
  // mode and cools the chalk in dark, so hover is a *hue* event in both. A
  // luminance step can't work symmetrically here — the dark-mode fill is
  // already near-white, with nowhere brighter to go.
  backgroundColor: `color-mix(in srgb, ${vars.color.primary} 88%, ${vars.color.accent})`,
  // Canon's lift is intentionally NOT restored — Pearl's controls stay seated.
  transform: 'none',
  boxShadow: `0 0 0 3px ${vars.color.accentSubtle}, ${ctaGroundHover}`,
});

globalStyle(primaryCta(':not(:disabled):active'), {
  backgroundColor: `color-mix(in srgb, ${vars.color.primary} 78%, ${vars.color.accent})`,
  transform: 'none',
  // Contact shadow gone, occlusion in: the surface is being pushed into the
  // page, so the light it was sitting above goes away.
  boxShadow: `inset 0 2px 5px ${ctaPress}, 0 0 0 2px ${vars.color.accentSubtle}`,
});

/**
 * Focus, for BOTH variants — one ring, one color. An earlier revision recolored
 * only `primary`'s outline to `accent`, which fixed its contrast and broke
 * something worse: primary and secondary were then ringed in two different
 * colors. Contrast is now fixed where it was actually wrong (the light theme's
 * `focusRing` token, above), and both variants read the same token here.
 *
 * The `outline` stays declared but transparent. Forced-colors mode throws away
 * box-shadows and would otherwise leave a focused button with no ring at all; a
 * transparent outline is re-colored by the OS palette and takes over there.
 */
globalStyle(pearlButton(null, ':focus-visible'), {
  outline: '2px solid transparent',
  outlineOffset: '2px',
});

// Specificity: the hover/active rules above carry two pseudo-classes, so a
// plain `:focus-visible` would lose to them and the ring would disappear the
// moment the pointer entered a keyboard-focused button. Matching their weight
// and sitting later in the file makes focus win, which is the right precedence —
// a focus ring is an accessibility affordance, a hover halo is decoration.
globalStyle(primaryCta(':not(:disabled):focus-visible'), {
  boxShadow: `${ctaGround}, ${ctaFocusRing}`,
});

globalStyle(pearlButton('secondary', ':not(:disabled):focus-visible'), {
  boxShadow: ctaFocusRing,
});

/** Nothing disabled should look lit or lifted; opacity alone left it floating. */
globalStyle(primaryCta(':disabled'), {
  boxShadow: 'none',
});

// ---- Extension treatment: luster ----

/**
 * `luster` — nacre made literal: light moving across a pearl surface.
 *
 * NOT a canon slot. Declared via the single-argument `createTheme` overload,
 * which infers its own contract — the same public mechanism a downstream author
 * uses, per rule 2 (no privileged internal path).
 *
 * The two halves of the returned tuple are named for the two different jobs
 * they do, which is why they don't share a stem. The class is what *extends*
 * the contract — applying it adds slots `theme.css.ts` never declared, so it
 * is `pearlExtensionClass`. The vars object holds the treatments themselves
 * (`luster`), so it stays `pearlTreatments`. "Extension treatment" (ADR-0007)
 * is the pair, not either half.
 *
 * Stops are [4c]'s sphere: three hues at low alpha. This retires the handoff's
 * "highlights, never rainbow" rule and its near-monochrome silver stops. The
 * replacement constraint — three hues max, none above .42 alpha — is recorded
 * as a machine-checkable `limit` in `pearl.roles.ts`.
 *
 * Dark-mode values are [derived]; 4c only specifies light.
 */
export const [pearlExtensionClass, pearlTreatments] = createTheme({
  luster: {
    /** Sweep angle, shared by sphere / rule / surface drift. [4c] */
    angle: '115deg',
    /** The three sheen hues. [4c] */
    seaGreen: 'rgba(158, 214, 196, 0.38)',
    periwinkle: 'rgba(214, 228, 255, 0.42)',
    blush: 'rgba(255, 214, 236, 0.30)',
    /** A BAND, not a wash: transparent below 32%/above 72%, so light reads
     * as a bounded highlight, not a tint. [4c] */
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
     * Hover drift on card surfaces — one pass, never a loop. Radial (this
     * project's choice, not the canonical mechanic — see git log for why).
     * `driftInset` spills the ellipse past the card's own box so no hard
     * edge shows. Palette: marine dominant, silver undertone, seagreen a
     * thin late breath (own spec, not the sphere's — `theme-revision-
     * decisions.md`). Held under limitsByChroma.desaturated.alpha.max (0.30).
     */
    driftGradient:
      'radial-gradient(ellipse at center, rgba(215, 213, 223, 0.42) 0%, rgba(251, 250, 247, 0.26) 32%, rgba(237, 241, 238, 0.15) 52%, transparent 68%)',
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
    /** Same, dark mode — lower, since the same alpha reads brighter/glowier
     * against a dark surface. */
    driftOpacityDark: '0.52',
  },
});

// Pearl's answer to `cardHover` (pearl.roles.ts) — `Card` writes
// `data-interactive`, themes decide what to do with it.
globalStyle(
  `${pearlLightThemeClass} [data-component="card"][data-interactive="true"]::after, ${pearlDarkThemeClass} [data-component="card"][data-interactive="true"]::after`,
  {
    content: '',
    position: 'absolute',
    zIndex: -1,
    inset: pearlTreatments.luster.driftInset,
    background: pearlTreatments.luster.driftGradient,
    opacity: 0,
    pointerEvents: 'none',
    transform: pearlTreatments.luster.driftFrom,
    transition: `opacity ${pearlTreatments.luster.driftOpacityDuration} ease, transform ${pearlTreatments.luster.driftDuration} ${pearlTreatments.luster.driftEasing}`,
    '@media': {
      '(prefers-reduced-motion: reduce)': { transition: 'none' },
    },
  },
);

globalStyle(`${pearlLightThemeClass} [data-component="card"][data-interactive="true"]:hover::after`, {
  opacity: pearlTreatments.luster.driftOpacity,
  transform: pearlTreatments.luster.driftTo,
});

globalStyle(`${pearlDarkThemeClass} [data-component="card"][data-interactive="true"]:hover::after`, {
  opacity: pearlTreatments.luster.driftOpacityDark,
  transform: pearlTreatments.luster.driftTo,
});

// 9a: deeper dark-mode stops for the same drift.
globalStyle(`${pearlDarkThemeClass} [data-component="card"][data-interactive="true"]::after`, {
  background: [
    // marine.850 (#332F3D) — dominant, matching light mode's own ordering.
    `radial-gradient(ellipse at center, rgba(51, 47, 61, 0.30) 0%`,
    // silver.850 (#4A4850) — undertone.
    `rgba(74, 72, 80, 0.19) 32%`,
    // seagreen.900 (#16211C) — the thin late breath.
    `rgba(22, 33, 28, 0.11) 52%`,
    `transparent 68%)`,
  ].join(', '),
  transition: 'opacity 3.5s ease, transform 3.5s cubic-bezier(0.22, 1, 0.36, 1)',
});
