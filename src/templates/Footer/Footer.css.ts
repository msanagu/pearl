import { style } from '@vanilla-extract/css';
import { color, space } from '@tokens';

// Layout-only: every colour/space value is a token, so the footer survives a
// theme swap untouched. The raw number is a structural max-width.
const CONTENT_MAX = 1440;

// Full-bleed band. The `borderTop` (the footer's only rule) separates it from
// the page; `overflow: hidden` clips the plate where it bleeds past the band.
export const band = style({
  position: 'relative',
  overflow: 'hidden',
  background: color.surface,
  borderTop: `1px solid ${color.border}`,
});

// Two columns: a type column and a full-height plate. No padding here — the
// plate bleeds to all three outer edges (top, bottom, right); the type column
// carries its own gutters.
export const inner = style({
  maxWidth: CONTENT_MAX,
  margin: '0 auto',
  display: 'flex',
  alignItems: 'stretch',
  '@media': {
    '(max-width: 860px)': { flexDirection: 'column' },
  },
});

// The type column. `space-between` pins the name story to the top and the
// signature (wordmark + meta) to the bottom; the plate's height sets how much
// air falls between them. `gap` is the floor on that air. No interior rule —
// the wordmark's scale is the separator.
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
  },
});

// The name story — the "Why Pearl" analogy and its coda.
export const top = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: space.lg,
});

// The coda: a subdued "what you can do with this" line, then the sign-off
// sentence on its own line at full body weight so "yours" lands.
export const coda = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: space.sm,
});

// The signature block: poster wordmark, then copyright + links directly under
// its left edge as one unit.
export const sign = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: space.md,
});

// Copyright then links, on one baseline.
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

// A full-height slab anchored to the band's top-right corner — bleeds top,
// bottom, and right; only the left edge is framed. Its left edge stays on the
// content column; the right edge runs to the viewport, past the centred
// `CONTENT_MAX` — `calc(50% - 50vw)` is the half-gutter on each side of the
// container, zero once the viewport is narrower than it. A floor height covers
// the case where the type column is unusually short. Drops to a lead image
// below 860.
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
