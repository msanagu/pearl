import { style, globalStyle } from '@vanilla-extract/css';
import { color, space } from '@tokens';
import { sphereWrap, contact as sphereContact } from '@components/_brand/PearlSphere.css';

// Header (headline + `measure="lg"` body copy) needs ~700px at its own
// natural width, plus the `2xl` gap (48px) and the sphere's own ceiling
// (220px) — call it 970px to actually fit side by side. Below 720px, `.main`
// stacked the layout but the sphere/nav swap didn't happen until here, so
// there was a dead zone where the row-layout `wrap` prop triggered an
// unstyled mid-row wrap before the intentional column layout ever kicked
// in. One breakpoint for both now — no gap between them.
const MOBILE = '(max-width: 1024px)';

export const main = style({
  minHeight: 520,
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
  '@media': {
    [MOBILE]: {
      minWidth: 0,
      flex: '0 1 auto',
    },
  },
});

// At the width it would wrap under the header, the sphere leaves the hero
// body entirely rather than stack awkwardly below the CTAs — `navSphere`
// below is its replacement, a small mark next to the wordmark instead.
export const sphere = style({
  '@media': {
    [MOBILE]: {
      display: 'none',
    },
  },
});

// Nav-scale stand-in for `sphere` on mobile: hidden by default (desktop's
// nav has no sphere at all — the hero body's is enough), shown only once
// the body's own copy disappears at `MOBILE`. Sized down via a descendant
// override on `sphereWrap` rather than a second wrapper size prop, since
// `PearlSphere` always renders that class internally regardless of context.
export const navSphere = style({
  display: 'none',
  '@media': {
    [MOBILE]: {
      display: 'flex',
      alignItems: 'center',
    },
  },
});

globalStyle(`${navSphere} .${sphereWrap}`, {
  width: 20,
  height: 20,
});

// No contact shadow at nav scale — a drop shadow under a small mark in a
// text-height row reads as a rendering artifact, not a material cue.
globalStyle(`${navSphere} .${sphereContact}`, {
  display: 'none',
});

// Anchors the descendant override below — `WordMark` renders at its
// unscaled default (`headingMd`, 2.5rem/40px) everywhere by default, which
// is fine standing alone in the desktop nav but reads as mismatched next to
// `navSphere`'s fixed 20px dot once both are visible together at `MOBILE`
// (a ~2:1 size ratio between the mark and the wordmark beside it). Scoped to
// this wrapper, not a global `WordMark` change, so the desktop nav — where
// there's no sphere to harmonize against — keeps its full size.
export const navBrand = style({});

globalStyle(`${navBrand} [data-component="brand-wordmark"]`, {
  '@media': {
    [MOBILE]: {
      // 20px, matching `navSphere`'s own fixed size exactly — a wordmark's
      // glyphs don't fill their full font-size box the way a circle fills
      // its own bounding box, so equal font-size-to-diameter reads as
      // slightly SMALLER text next to the dot, not larger — the harmonious
      // pairing this was actually solving for.
      fontSize: '20px',
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
