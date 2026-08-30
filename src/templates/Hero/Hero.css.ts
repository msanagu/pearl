import { style } from '@vanilla-extract/css';
import { color, space } from '@tokens';

// One breakpoint switches the whole hero to a column and drops the body sphere.
// Above it the row never wraps (see `main`), so the sphere is only ever beside
// the headline; below it, `SiteHeader` shows its own small mark instead.
const MOBILE = '(max-width: 1100px)';

export const main = style({
  minHeight: 520,
  // Never wrap: the header column takes the remaining width and re-flows its
  // own lines; the sphere holds its size. A wrapping row let a wide headline
  // push the sphere onto its own row below the content.
  flexWrap: 'nowrap',
  '@media': {
    [MOBILE]: {
      minHeight: 'auto',
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'center',
      gap: 24,
      paddingTop: 24,
      paddingBottom: 24,
    },
  },
});

export const header = style({
  // Takes whatever the sphere leaves; `min-width: 0` lets the headline wrap
  // inside that rather than forcing the row wider.
  flex: '1 1 auto',
  minWidth: 0,
});

// Body sphere: holds its clamp size, never shrinks the row. Leaves the layout
// at MOBILE — `SiteHeader`'s own small mark stands in beside the wordmark.
export const sphere = style({
  flex: '0 0 auto',
  '@media': {
    [MOBILE]: {
      display: 'none',
    },
  },
});

/**
 * Even column counts only (4 -> 2 -> 1) so every row stays full — an `auto-fit`
 * grid would land on 3 across a wide band and orphan the fourth cell.
 * Breakpoints: a cell wants >= 240px, the grid is `min(1200px, 100vw - 2*xl)`,
 * so 4-up needs ~1040px and 2-up ~560px. `minmax(0, 1fr)` lets a column shrink
 * past its longest word so a near-breakpoint width can't push a cell to overflow.
 */
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

/**
 * Seams are borders on the cells, not `gap` over a colored container — a gap
 * paints its color across any track a cell doesn't fill, so an incomplete row
 * shows a slab instead of a rule. Each breakpoint re-states both edges: the
 * narrower media block still matches wider, so its rules need explicit
 * cancelling, and the reset must precede the override (equal specificity).
 * `overflowWrap` is a backstop against a future longer label or wider face.
 */
export const feature = style({
  minWidth: 0,
  padding: `clamp(${space.md}, 2.6vw, ${space.xl})`,
  overflowWrap: 'break-word',
  selectors: {
    // One column: cells stack, so every seam is horizontal.
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
