import { globalStyle, style } from '@vanilla-extract/css';
import { color, fontFamily, space } from '@tokens';

// Layout for the primitives half of the Color/Tokens specimen. Values are
// raw theme-scoped hex constants, not custom properties, so swatches don't
// recolor with the toolbar like the semantic half does — this half reads the
// toolbar's theme global instead and renders only that theme's section.

export const page = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space['2xl'],
  padding: space.xl,
  background: color.background,
  color: color.text,
  fontFamily: fontFamily.body,
  '@media': {
    '(max-width: 600px)': { padding: space.md, gap: space.xl },
  },
});

export const themeSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space.lg,
  paddingBottom: space.xl,
  borderBottom: `1px solid ${color.border}`,
});

export const groupTitle = style({
  margin: 0,
  fontSize: '13px',
  fontWeight: 600,
  color: color.textSubtle,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
});

// One block per hue: label on top, swatches wrapping below. Label-beside forced
// a 9-step ramp past ~640px; stacked, the strip wraps to as many rows as the
// viewport needs. Steps are whatever the palette defines — no padding to a
// uniform 100-900 run.
export const scaleRow = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space.sm,
});

export const scaleLabel = style({
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: color.text,
  lineHeight: 1.4,
});

// Stacks the hue blocks within a group (Neutral, Accent, …). Wider than
// scaleRow's own label-to-swatches gap so blocks read as separate.
export const hueGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space.lg,
});

export const stepList = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: space.sm,
});

export const step = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: space.xs,
  fontSize: '11px',
  color: color.textSubtle,
  width: '4rem',
  flexShrink: 0,
});

export const stepNumber = style({
  fontSize: '11px',
});

// Fixed radius, decoupled from radius.control so a theme with a large
// authored corner can't paint these chips as near-circles.
export const stepSwatch = style({
  width: '100%',
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
