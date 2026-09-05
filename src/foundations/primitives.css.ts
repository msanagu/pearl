import { globalStyle, style } from '@vanilla-extract/css';
import { color, fontFamily, space } from '@tokens';

// Layout for the primitive-palette specimen (Tokens/Primitives). Values are
// raw theme-scoped hex constants, not custom properties, so swatches don't
// recolor with the toolbar like Tokens/Semantic does — the story reads the
// toolbar's theme global instead and renders only that theme's section.

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

// One row per hue: fixed-width label, then one swatch per step it has.
// Steps are whatever the palette defines — no padding to a uniform 100-900 run.
export const scaleRow = style({
  display: 'flex',
  // flex-start, not flex-end — label aligns with the top of the swatch
  // column it names, not the hex text at the bottom.
  alignItems: 'flex-start',
  gap: space.sm,
});

export const scaleLabel = style({
  // Wide enough for AlphaScale's two-line label — name plus its (hue[step])
  // anchor, the longest content this column carries.
  width: '140px',
  flexShrink: 0,
  fontSize: '13px',
  fontWeight: 500,
  // Matches stepSwatch's height so the label centers against the swatch row.
  height: '48px',
  display: 'flex',
  // Row (the default) would lay AlphaScale's `{label}<br/>{anchor}` side by
  // side — flex items ignore <br>. Column direction stacks the two lines.
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

// Fixed radius, decoupled from radius.control so a theme with a large
// authored corner can't paint these chips as near-circles.
export const stepSwatch = style({
  width: '64px',
  height: '48px',
  borderRadius: '8px',
  border: `1px solid ${color.border}`,
});

// Alpha swatches carry true transparency (rgba, not flat hex) — a low step
// composited directly over the page background is nearly indistinguishable
// from no fill. A checkerboard backdrop gives the eye a fixed reference so
// opacity stays visible regardless of the theme's background. Hardcoded
// grey/white, not theme tokens — the standard transparency-grid convention.
//
// Checker and color fill are two separate layers (alphaSwatch +
// alphaSwatchFill), not one element with backgroundColor set to the rgba
// step — single-layer would punch a hole in the opaque checker underneath,
// reading as noise. Stacked, the wash evenly covers both checker tones and
// opacity reads as how much checker still shows through.
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

// Tahitian's radius tokens are 0px for both control and surface — a
// hard-edged theme, so the generic 8px rounded-rect above misreports it.
// Marked at the section level so every nested swatch kind picks it up
// without each call site opting in.
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
