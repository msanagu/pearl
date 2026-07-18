import { style } from '@vanilla-extract/css';
import { color, fontFamily, radius, space } from '../tokens';

// Layout for the token preview — itself built from the tokens, so this file is
// also the first proof that a `.css.ts` compiles through the vanilla-extract
// plugin inside Storybook (not just the Vite library build).

export const page = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space.xl,
  padding: space.xl,
  background: color.background,
  color: color.text,
  fontFamily: fontFamily.body,
});

export const section = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space.md,
});

export const sectionTitle = style({
  margin: 0,
  fontSize: '18px',
  fontWeight: 600,
});

export const row = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: space.lg,
});

export const cell = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space.xs,
  fontSize: '12px',
  color: color.textSubtle,
});

export const swatch = style({
  width: '112px',
  height: '72px',
  borderRadius: radius.control,
  border: `1px solid ${color.border}`,
});

export const spaceBar = style({
  height: '16px',
  background: color.accent,
  borderRadius: radius.control,
});

export const radiusBox = style({
  width: '72px',
  height: '72px',
  background: color.surface,
  border: `1px solid ${color.border}`,
});

export const controlHeightBar = style({
  background: color.accentSubtle,
  border: `1px solid ${color.accent}`,
  borderRadius: radius.control,
});

// One swatch strip per sentiment role — surface/border/text/icon side by side.
export const sentimentRow = style({
  display: 'flex',
  gap: space.md,
});

export const sentimentCard = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: space.xs,
  width: '96px',
  height: '64px',
  borderRadius: radius.surface,
});
