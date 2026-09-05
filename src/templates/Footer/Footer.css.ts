import { style } from '@vanilla-extract/css';
import { color, space } from '@tokens';

const CONTENT_MAX = 1440;

export const band = style({
  position: 'relative',
  overflow: 'hidden',
  background: color.surface,
  borderTop: `1px solid ${color.border}`,
});

// No padding here — plate bleeds to outer edges; type column carries own gutters.
export const inner = style({
  maxWidth: CONTENT_MAX,
  margin: '0 auto',
  display: 'flex',
  alignItems: 'stretch',
  '@media': {
    '(max-width: 860px)': { flexDirection: 'column' },
  },
});

export const leftCol = style({
  flex: '1 1 auto',
  minWidth: 0,
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: `calc(${space['2xl']} * 1.5)`,
  paddingTop: `calc(${space['2xl']} * 1.5)`,
  paddingBottom: space.xl,
  paddingLeft: space.xl,
  paddingRight: space['2xl'],
  '@media': {
    '(max-width: 860px)': {
      paddingTop: space.xl,
      paddingRight: space.xl,
      gap: `calc(${space['2xl']} * 1.25)`,
    },
    // Matches Introduction/Docs/Hero phone-width gutter reduction.
    '(max-width: 640px)': {
      paddingLeft: space.md,
      paddingRight: space.md,
    },
  },
});

export const top = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: space.lg,
});

export const coda = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: space.sm,
});

export const sign = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: space.md,
});

export const meta = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'baseline',
  columnGap: space.lg,
  rowGap: space.xs,
});

export const metaLinks = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: space.lg,
});

// Bleeds top/bottom/right past centred CONTENT_MAX container; lead image below 860.
export const plate = style({
  flex: '0 0 clamp(300px, 36vw, 500px)',
  alignSelf: 'stretch',
  position: 'relative',
  overflow: 'hidden',
  margin: 0,
  marginRight: 'calc(50% - 50vw)',
  minHeight: 360,
  borderLeft: `1px solid ${color.border}`,
  '@media': {
    '(max-width: 860px)': {
      flex: 'none',
      order: -1,
      borderLeft: 'none',
      minHeight: 0,
      marginRight: 0,
      aspectRatio: '16 / 9',
      marginBottom: space.xl,
    },
  },
});

export const plateImage = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});
