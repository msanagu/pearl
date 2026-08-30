import { globalStyle, style } from '@vanilla-extract/css';
import { color, fontFamily, space } from '@tokens';

// Layout for the primitive-palette specimen (Tokens/Primitives). These values
// are raw theme-scoped hex constants, not CSS custom properties, so the
// swatches themselves don't recolor with the toolbar the way Tokens/Semantic
// does — the story instead reads the toolbar's theme global and renders only
// that theme's section, since only one palette is ever the thing being
// inspected at a time.

export const page = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space['2xl'],
  padding: space.xl,
  background: color.background,
  color: color.text,
  fontFamily: fontFamily.body,
});

export const themeSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space.lg,
  paddingBottom: space.xl,
  borderBottom: `1px solid ${color.border}`,
});

// No fontSize/fontWeight here — the wordmark is rendered through `Text`
// with `typeScale="displayLg"`, and this class would otherwise fight that
// scale's own font-size/weight for specificity. Margin/spacing only.
export const themeTitle = style({
  margin: 0,
  marginBottom: space.sm,
});

export const groupTitle = style({
  margin: 0,
  fontSize: '13px',
  fontWeight: 600,
  color: color.textSubtle,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
});

// One row per hue: a fixed-width label, then one swatch per step it has.
// Steps are whatever the palette actually defines — no padding to a uniform
// 100–900 run for palettes that only span part of that range.
export const scaleRow = style({
  display: 'flex',
  // `flex-start`, not `flex-end` — the label needs to align with the
  // swatches (the top of each step's column) it names, not with the hex
  // text at the bottom of the column, which read as if the label belonged
  // to the row below it.
  alignItems: 'flex-start',
  gap: space.sm,
});

export const scaleLabel = style({
  // Wide enough for AlphaScale's two-line label — name plus its
  // `(hue[step])` anchor (e.g. "(squidInk[900])"), the longest content this
  // column carries. At the old 84px the anchor line had nowhere to go but
  // to overflow rightward, overlapping the first swatch instead of wrapping.
  width: '140px',
  flexShrink: 0,
  fontSize: '13px',
  fontWeight: 500,
  // Matches `stepSwatch`'s height so the label's text sits vertically
  // centered against the swatch row specifically, not the taller
  // swatch+number+hex column.
  height: '48px',
  display: 'flex',
  // `flex-direction: row` (the default) treats AlphaScale's `{label}<br
  // />{anchor}` as flex items laid out side by side — flex items ignore a
  // `<br>`'s line break, so the anchor ran into the row instead of
  // dropping to its own line. Column direction lets the `<br>` actually
  // stack the two lines; `justifyContent: center` replaces the old
  // `alignItems: center` for vertical centering now that centering runs
  // along the (now vertical) main axis.
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'flex-start',
});

export const stepList = style({
  display: 'flex',
  gap: space.sm,
});

export const step = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: space.xs,
  fontSize: '11px',
  color: color.textSubtle,
});

export const stepNumber = style({
  fontSize: '11px',
});

// A fixed radius, decoupled from `radius.control` so a theme with a large
// authored corner can't paint these color chips as near-circles. Could likely
// track `radius.control` now that no theme uses a pill corner, but that's a
// change to every theme's docs page — leave it with the radius work.
export const stepSwatch = style({
  width: '64px',
  height: '48px',
  borderRadius: '8px',
  border: `1px solid ${color.border}`,
});

// Alpha swatches carry true transparency (`rgba(...)`, not a flat hex), so
// composited directly over the page background a low step (e.g. 10%) is
// nearly indistinguishable from "no fill" — exactly the opposite of
// readable. A checkerboard backdrop gives the eye a fixed reference so the
// opacity itself is visible regardless of the surrounding theme's
// background. Colors are a hardcoded neutral grey/white, not theme tokens —
// this is the standard transparency-grid convention, independent of
// light/dark mode.
//
// The checker and the color fill are two separate layers (`alphaSwatch` +
// `alphaSwatchFill`), not one element with `backgroundColor` set to the
// rgba step — a single-layer version makes the fill's own alpha punch a
// hole in the *opaque* checker tone underneath it, so the two squares stop
// being a shared backdrop and the opacity reads as noise instead of signal.
// Stacked, the translucent color washes evenly over both checker tones and
// the step's opacity is legible as how much checker still shows through.
export const alphaSwatch = style([
  stepSwatch,
  {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#fff',
    backgroundImage:
      'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
    backgroundSize: '8px 8px',
    backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
  },
]);

export const alphaSwatchFill = style({
  position: 'absolute',
  inset: 0,
});

export const stepHex = style({
  fontFamily: 'ui-monospace, Menlo, monospace',
  fontSize: '10px',
});

// Named (non-stepped) primitives — e.g. a theme's `linen`/`ink`/`teal` set,
// which aren't a numeric ramp. Shown as label + swatch pairs instead of a
// step grid.
export const namedGrid = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: space.md,
});

export const namedCell = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space.xs,
  fontSize: '12px',
  color: color.textSubtle,
});

export const namedSwatch = style({
  width: '96px',
  height: '56px',
  borderRadius: '8px',
  border: `1px solid ${color.border}`,
});

// Tahitian's radius tokens are `0px` for both `control` and `surface` — it is
// a hard-edged theme, so the generic 8px rounded-rect above misreports the
// palette's own identity on the page documenting that palette. Marked at the
// section level, not per-swatch: squareness is a property of the theme being
// documented, so every swatch kind nested inside picks it up (including
// `alphaSwatch`, which composes `stepSwatch`) without each call site
// remembering to opt in.
export const squareSwatches = style({});

globalStyle(
  `.${squareSwatches} .${stepSwatch}, .${squareSwatches} .${namedSwatch}`,
  {
    borderRadius: 0,
  },
);

export const modeColumns = style({
  display: 'flex',
  gap: space.xl,
  flexWrap: 'wrap',
});

export const modeColumn = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space.sm,
});

export const modeLabel = style({
  margin: 0,
  fontSize: '12px',
  fontWeight: 600,
  color: color.textSubtle,
});
