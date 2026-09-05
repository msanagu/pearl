import { style, globalStyle } from '@vanilla-extract/css';
import { color, space, text } from '@tokens';
import { measure } from '@components/Text/Text.css';

// Below this, SiteHeader shows its own mark instead of body sphere.
const MOBILE = '(max-width: 1100px)';

// Matches Introduction.css.ts / SiteHeader.css.ts phone breakpoint.
const NARROW = '(max-width: 640px)';

// Own tighter breakpoint, not NARROW: ~600px still has 200px+ per button, room to spare side by side.
const BUTTONS_NARROW = '(max-width: 480px)';

export const main = style({
  minHeight: 520,
  flexWrap: 'nowrap',
  // Padding lives here, not inline on Hero.tsx, so NARROW below can override it.
  paddingTop: `calc(${space['2xl']} * 3)`,
  paddingBottom: space['2xl'],
  paddingLeft: space.xl,
  paddingRight: space.xl,
  '@media': {
    [MOBILE]: {
      minHeight: 'auto',
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'center',
      gap: 24,
    },
    [NARROW]: {
      paddingTop: 32,
      paddingBottom: 24,
      paddingLeft: space.md,
      paddingRight: space.md,
    },
  },
});

// Shares main's NARROW gutter reduction so the two bands' left edges stay aligned.
export const content = style({
  width: `calc(100% - ${space.xl} - ${space.xl})`,
  boxSizing: 'border-box',
  '@media': {
    [NARROW]: {
      width: `calc(100% - ${space.md} - ${space.md})`,
    },
  },
});

// At BUTTONS_NARROW, stack CTA pair full-width instead of ragged-edge shrink-to-content.
export const actions = style({
  '@media': {
    [BUTTONS_NARROW]: {
      flexDirection: 'column',
      alignItems: 'stretch',
    },
  },
});

// The <button> inside isn't itself a flex item, so it needs its own width set.
globalStyle(`${actions} > a > [data-component="button"]`, {
  '@media': {
    [BUTTONS_NARROW]: { width: '100%' },
  },
});

export const header = style({
  flex: '1 1 auto',
  minWidth: 0,
});

export const sphere = style({
  flex: '0 0 auto',
  '@media': {
    [MOBILE]: {
      display: 'none',
    },
  },
});

// Even column counts only (4 -> 2 -> 1) so rows stay full; auto-fit would orphan a cell.
const TWO_COLUMNS = '(min-width: 560px)';
const FOUR_COLUMNS = '(min-width: 1040px)';

export const features = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr)',
  '@media': {
    [TWO_COLUMNS]: { gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' },
    [FOUR_COLUMNS]: { gridTemplateColumns: 'repeat(4, minmax(0, 1fr))' },
  },
});

// Seams are borders on cells, not `gap`, so an incomplete row shows a rule not a slab.
export const feature = style({
  minWidth: 0,
  padding: `clamp(${space.md}, 2.6vw, ${space.xl})`,
  overflowWrap: 'break-word',
  selectors: {
    '&:not(:first-child)': { borderTop: `1px solid ${color.border}` },
  },
  '@media': {
    [TWO_COLUMNS]: {
      selectors: {
        '&:nth-child(-n+2)': { borderTop: 'none' },
        '&:nth-child(n+3)': { borderTop: `1px solid ${color.border}` },
        '&:nth-child(2n)': { borderLeft: `1px solid ${color.border}` },
      },
    },
    [FOUR_COLUMNS]: {
      selectors: {
        '&:nth-child(n+3)': { borderTop: 'none' },
        '&:nth-child(n+5)': { borderTop: `1px solid ${color.border}` },
        '&:nth-child(4n+1)': { borderLeft: 'none' },
        '&:not(:nth-child(4n+1))': { borderLeft: `1px solid ${color.border}` },
      },
    },
  },
});

// `measure="sm"` + `bodySm` (Hero.tsx) fit a grid cell, which runs wider than
// reading width at TWO_COLUMNS+. Below TWO_COLUMNS, no grid — same cap just
// strands copy small in an otherwise full-width strip, so drop it there.
// `[data-measure="sm"]` outranks the recipe class regardless of sheet order.
globalStyle(`${feature} [data-measure="sm"]`, {
  maxWidth: 'none',
  fontSize: text.bodyMd.fontSize,
  lineHeight: text.bodyMd.lineHeight,
  '@media': {
    [TWO_COLUMNS]: {
      maxWidth: measure.sm,
      fontSize: text.bodySm.fontSize,
      lineHeight: text.bodySm.lineHeight,
    },
  },
});
