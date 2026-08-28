import { style } from '@vanilla-extract/css';
import { color, space } from '../../tokens';

export const main = style({
  minHeight: 520,
  '@media': {
    '(max-width: 720px)': {
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
  '@media': {
    '(max-width: 720px)': {
      minWidth: 0,
      flex: '0 1 auto',
    },
  },
});

export const sphere = style({
  '@media': {
    '(max-width: 720px)': {
      alignSelf: 'center',
      transform: 'scale(0.72)',
      transformOrigin: 'center',
      margin: '-24px 0',
    },
  },
});

/**
 * Column counts are always EVEN where the width allows: 4 -> 2 -> 1. An
 * `auto-fit` + `minmax` grid reflows continuously, which is tempting, but with
 * four stats it lands on 3 columns across a wide band and leaves a lone cell
 * on a second row — visually lopsided, and the empty track paints as a slab.
 * Even counts divide four evenly, so every row is always full.
 *
 * The breakpoints are derived, not taste: a cell wants >= 15rem (240px) of
 * box. The strip's grid is `min(1200px, 100vw - 2 * xl)`, so 4 x 240 + gutters
 * lands at 1040px of viewport and 2 x 240 at 560px. Below that, one column.
 * `minmax(0, 1fr)` (not `1fr`, whose implicit `auto` floor is min-content)
 * lets a column shrink past its longest word, so the band just above each
 * breakpoint can't squeeze a cell into overflow — the failure that produced
 * this rebuild, when a four-across flex row met a single 720px switch and
 * left ~70px of content per cell at 721-780px.
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
 * Seams are borders on the cells, not `gap` over a border-colored container.
 * The gap trick is tidier to write, but it paints the seam color across any
 * track a cell doesn't fill — so the moment a row is incomplete you get a
 * solid block instead of a rule. Borders only ever draw where a cell is.
 *
 * Each breakpoint re-states both edges rather than inheriting: the narrower
 * media block still matches at wider widths, so its rules have to be cancelled
 * explicitly, and a reset must precede the rule that overrides it (equal
 * specificity — source order decides).
 *
 * Padding is `clamp`, a continuous function of the space available, rather
 * than a stepped override that would reintroduce a dead band between steps.
 *
 * `overflowWrap: 'break-word'` is the backstop. The column floor and the clamp
 * should mean nothing ever needs to break mid-word — but a longer label than
 * today's, or a theme with a wider face, would otherwise reopen the same
 * `text-overflow` finding. Breaking a word is the worse outcome only until the
 * alternative is text escaping its box.
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
