import { style } from '@vanilla-extract/css';
import { color, fontFamily, radius, space } from '../tokens';

// Layout for the primitive-palette specimen (Tokens/Primitives). Unlike
// Tokens/Semantic, these values are raw theme-scoped hex constants, not
// CSS custom properties — so unlike the semantic story this page does NOT
// react to the Storybook theme toolbar. Every theme's primitives are shown
// side by side instead.

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

export const themeTitle = style({
  margin: 0,
  fontSize: '20px',
  fontWeight: 600,
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
  alignItems: 'flex-end',
  gap: space.sm,
});

export const scaleLabel = style({
  width: '84px',
  flexShrink: 0,
  fontSize: '13px',
  fontWeight: 500,
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

export const stepSwatch = style({
  width: '64px',
  height: '48px',
  borderRadius: radius.control,
  border: `1px solid ${color.border}`,
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
  borderRadius: radius.control,
  border: `1px solid ${color.border}`,
});

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
