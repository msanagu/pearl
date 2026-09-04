import { style, globalStyle } from '@vanilla-extract/css';
import { color, space, text } from '@tokens';
import { measure } from '@components/Text/Text.css';

// One breakpoint switches the whole hero to a column and drops the body sphere.
// Above it the row never wraps (see `main`), so the sphere is only ever beside
// the headline; below it, `SiteHeader` shows its own small mark instead.
const MOBILE = '(max-width: 1100px)';

// Narrower than `MOBILE` on purpose — matches `Introduction.css.ts`'s /
// `SiteHeader.css.ts`'s phone-width breakpoint. `MOBILE` also covers tablets
// and a resized desktop window; the reduced top padding below is a mobile
// *portrait* correction and shouldn't fire that early.
const NARROW = '(max-width: 640px)';

// The two CTAs together are ~380px at their natural content width — anything
// at or above this still has room to spare and reads deliberately narrow, not
// cramped, side by side. Its own (tighter) breakpoint rather than reusing
// `NARROW`: a ~600px width already has 200px+ to give each button, so forcing
// the stacked/stretched treatment at `NARROW` kicked in a breakpoint early.
const BUTTONS_NARROW = '(max-width: 480px)';

export const main = style({
  minHeight: 520,
  // Never wrap: the header column takes the remaining width and re-flows its
  // own lines; the sphere holds its size. A wrapping row let a wide headline
  // push the sphere onto its own row below the content.
  flexWrap: 'nowrap',
  // Asymmetric on purpose — a landing zone above the headline, tight below so
  // the strip reads as its footnote. Composed from `2xl`. Lives here, not in
  // `Hero.tsx`'s inline `style`, specifically so the `NARROW` override below
  // can win: an inline style always beats a stylesheet rule, media query or
  // not, so a same-property inline value would silently block this override
  // at every viewport.
  paddingTop: `calc(${space['2xl']} * 3)`,
  paddingBottom: space['2xl'],
  // Horizontal gutter — lives here rather than as an inline value on `Hero`'s
  // `Row` specifically so `NARROW`'s override below can win; an inline style
  // always beats a stylesheet rule regardless of media query.
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
    // The desktop top padding is a deliberate landing zone; it only reads as
    // excess once the hero has also dropped to a single narrow column. `32`,
    // not `24` — flush against the header felt tighter than intended.
    [NARROW]: {
      paddingTop: 32,
      paddingBottom: 24,
      // `xl` (32px) a side is a real slice of a phone viewport — matches
      // Introduction.css.ts's / Docs.css.ts's own `NARROW` gutter reduction.
      paddingLeft: space.md,
      paddingRight: space.md,
    },
  },
});

// The feature strip's own content column — separate from `main`'s inline
// `maxWidth`/`margin` (a fixed constant, no override needed) but sharing its
// `NARROW` gutter reduction. Without this the strip kept its `xl` gutter while
// `main` above it dropped to `md`, so the two bands' left edges stopped
// lining up on a phone.
export const content = style({
  width: `calc(100% - ${space.xl} - ${space.xl})`,
  boxSizing: 'border-box',
  '@media': {
    [NARROW]: {
      width: `calc(100% - ${space.md} - ${space.md})`,
    },
  },
});

// The primary/secondary CTA pair. Above `BUTTONS_NARROW`, `wrap` (set on the
// `Row` itself) drops the second button to its own line once the pair
// together outgrows the header column. At `BUTTONS_NARROW` that leaves two
// shrink-to-content buttons of different widths stacked with a ragged right
// edge — switching to a column stretches both to the same width instead.
export const actions = style({
  '@media': {
    [BUTTONS_NARROW]: {
      flexDirection: 'column',
      alignItems: 'stretch',
    },
  },
});

// `a` is blockified automatically as a flex item, so `alignItems: stretch`
// above already stretches it full-width; the `<button>` inside is a plain
// block child of that anchor, not a flex item itself, so it still needs its
// own width set explicitly.
globalStyle(`${actions} > a > [data-component="button"]`, {
  '@media': {
    [BUTTONS_NARROW]: { width: '100%' },
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

// The description's `measure="sm"` + `bodySm` (Hero.tsx) are sized for a
// *grid cell* — at TWO_COLUMNS+ the cell can run wider than a comfortable
// reading line, so both keep it compact. Below TWO_COLUMNS there's no grid:
// one column IS the phone's own reading width, nothing beside it competing
// for space, so the same cap just strands the copy in a narrow strip with
// dead air to its right and reads small against all that unused room.
// `[data-measure="sm"]` (Text's own attribute hook, not its recipe class) is
// what wins here — one class + one attribute outranks the recipe's single
// class regardless of stylesheet order, the same trick the theme files use
// for their own default-size overrides.
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
