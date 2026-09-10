import { style, globalStyle } from '@vanilla-extract/css';
import { color, fontFamily, fontWeight, space, text } from '@tokens';

// Rail appears alongside the article above this width; below it, one column.
const RAIL = '(min-width: 1180px)';

export const page = style({
  maxWidth: '62rem',
  margin: '0 auto',
  padding: 'clamp(2rem, 6vw, 4.5rem) clamp(1rem, 5vw, 3rem)',
  boxSizing: 'border-box',
});

// Widen and open a rail column when there are enough sections to warrant one.
// The rail track is wider than a minimal fit — long section titles
// ("Declaring a new primitive scale") wrapped to 2 lines at 12rem; 15rem
// clears them at the cost of a slightly narrower article, which is the
// better trade for a table of contents.
export const pageWithRail = style({
  '@media': {
    [RAIL]: {
      maxWidth: '78rem',
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr) 15rem',
      columnGap: space['2xl'],
      alignItems: 'start',
    },
  },
});

// Sticky table of contents — only rendered/visible where the grid has a column
// for it. It's navigation over a real sequence of sections, not decoration.
export const rail = style({
  display: 'none',
  '@media': {
    [RAIL]: {
      display: 'block',
      position: 'sticky',
      top: space.xl,
    },
  },
});

export const railLabel = style({
  display: 'block',
  marginBottom: space.sm,
  color: color.textSubtle,
});

export const railList = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  borderLeft: `1px solid ${color.borderSubtle}`,
});

// Top-level rail rhythm — one per caption group AND one per standalone
// (uncaptioned) entry, so a flat entry right after a group gets the same
// breathing room a group boundary gets, instead of sitting flush against
// the sub-list above it. `:first-child` zeroes the very first block.
export const railGroup = style({
  marginTop: space.md,
  selectors: {
    '&:first-child': { marginTop: 0 },
  },
});

// Second level, subordinate to railLabel ("On this page"): same face, no
// heavier a treatment — indentation and the nested list below it carry the
// hierarchy instead of size or color.
export const railGroupLabel = style({
  display: 'block',
  padding: `0 ${space.md}`,
  marginBottom: space.xs,
});

// No border of its own — a second hairline this close to railList's spine
// read as two parallel lines rather than one hierarchy. Indentation alone
// carries the nesting; the outer spine keeps running behind it uninterrupted.
export const railSubList = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  marginLeft: space.md,
});

export const railLink = style({
  display: 'block',
  padding: `${space.xs} ${space.md}`,
  marginLeft: '-1px',
  borderLeft: '1px solid transparent',
  color: color.textSubtle,
  textDecoration: 'none',
  fontSize: text.bodySm.fontSize,
  lineHeight: text.bodySm.lineHeight,
  selectors: {
    '&:hover': { color: color.text },
    '&:focus-visible': {
      outline: `2px solid ${color.focusRing}`,
      outlineOffset: '2px',
    },
    '&[aria-current="true"]': {
      color: color.accent,
      fontWeight: fontWeight.semibold,
      borderLeftColor: color.accent,
    },
    // Nested links sit inside railSubList's own marginLeft indent, so their
    // border-left would draw indented too — a floating accent segment, not
    // one overlaying the spine. Pull the box (and its border) back onto the
    // spine's x-position and restore the text's indent via padding instead,
    // so the border keeps landing at x:0 regardless of nesting depth.
    [`${railSubList} &`]: {
      marginLeft: `calc(-1px - ${space.md})`,
      paddingLeft: `calc(${space.md} + ${space.md})`,
    },
  },
});

export const article = style({
  minWidth: 0,
});

export const header = style({
  marginBottom: space.xl,
});

export const lede = style({
  marginTop: space.md,
});

// The live demo the story passes as children. A hairline above sets it apart
// from the prose without a box or a label.
export const demo = style({
  marginTop: space.xl,
  paddingTop: space.xl,
  borderTop: `1px solid ${color.borderSubtle}`,
});

export const section = style({
  marginTop: space['2xl'],
  scrollMarginTop: space.xl,
});

// Crossing into a new caption group: same hairline device as `demo`, layered
// on top of the base section's marginTop rather than replacing it.
export const sectionNewCategory = style({
  paddingTop: space.xl,
  borderTop: `1px solid ${color.borderSubtle}`,
});

export const sectionCaption = style({
  display: 'block',
  margin: `0 0 ${space.xs}`,
});

// A category's first section reads its caption as the group header, not the
// quiet per-section eyebrow — weight only, no new color or size.
export const sectionCaptionNewCategory = style({
  fontWeight: fontWeight.medium,
});

export const sectionTitle = style({
  margin: `0 0 ${space.lg}`,
});

/* --- guidelines: grouped Do list, then Don't list --- */

export const guidelineGroup = style({
  selectors: {
    '& + &': { marginTop: space.xl },
  },
});

export const groupHead = style({
  display: 'flex',
  alignItems: 'center',
  gap: space.xs,
  margin: `0 0 ${space.md}`,
  fontSize: text.bodyMd.fontSize,
  lineHeight: text.bodyMd.lineHeight,
  fontWeight: text.headingSm.fontWeight,
  color: color.text,
});

// Coloured spine ties each list to its Do / Don't head and carries the
// signal down the group without a marker on every line.
export const groupItems = style({
  listStyle: 'none',
  margin: 0,
  padding: `${space.xs} 0 ${space.xs} ${space.md}`,
  borderLeft: '2px solid transparent',
});

export const groupItemsDo = style({ borderLeftColor: color.positive.border });
export const groupItemsDont = style({ borderLeftColor: color.negative.border });

export const markerDo = style({ color: color.positive.icon });
export const markerDont = style({ color: color.negative.icon });

export const statement = style({
  maxWidth: '68ch',
  fontSize: text.bodyMd.fontSize,
  lineHeight: text.bodyMd.lineHeight,
  fontWeight: fontWeight.medium,
  color: color.text,
  selectors: {
    '& + &': { marginTop: space.lg },
  },
});

// `should` / `should-not` — real guidance, lower obligation. Quieter than a
// must via weight only: dropping to `textSubtle` here would match `detail`'s
// color exactly and flatten the statement/detail hierarchy.
export const statementSoft = style({
  fontWeight: fontWeight.regular,
});

// The precise elaboration under a rule. Regular weight and subtle colour so the
// medium-weight lead carries the scan and the detail is there when wanted.
export const detail = style({
  display: 'block',
  maxWidth: '68ch',
  marginTop: space.xs,
  fontSize: text.bodyMd.fontSize,
  lineHeight: text.bodyMd.lineHeight,
  fontWeight: fontWeight.regular,
  color: color.textSubtle,
});

/* --- definitions: term / meaning table --- */

export const tableScroll = style({
  overflowX: 'auto',
});

export const table = style({
  width: '100%',
  borderCollapse: 'collapse',
  textAlign: 'left',
});

globalStyle(`${table} th, ${table} td`, {
  padding: `${space.md} ${space.lg} ${space.md} 0`,
  borderTop: `1px solid ${color.borderSubtle}`,
  // baseline, not top: term (monospace, bodySm) and def (sans, bodyMd) have
  // different font metrics, so equal box-top/line-height still misaligns the
  // glyphs. Baseline aligns by font metrics instead.
  verticalAlign: 'baseline',
});

globalStyle(`${table} tr:first-child th, ${table} tr:first-child td`, {
  borderTop: 'none',
});

export const term = style({
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: text.bodySm.fontSize,
  fontWeight: 400,
  color: color.text,
  whiteSpace: 'nowrap',
});

export const def = style({
  fontSize: text.bodyMd.fontSize,
  lineHeight: text.bodyMd.lineHeight,
  color: color.textSubtle,
});

export const usage = style({
  display: 'block',
  marginTop: space.xs,
  color: color.text,
});

/* --- note: freeform prose --- */

export const noteBody = style({
  fontSize: text.bodyMd.fontSize,
  lineHeight: text.bodyMd.lineHeight,
  color: color.text,
  whiteSpace: 'pre-line',
});

/* --- steps: numbered procedure, shown only when `showSteps` is set --- */

export const stepsList = style({
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: space.lg,
});

export const stepItem = style({
  display: 'flex',
  gap: space.md,
});

export const stepNumber = style({
  flexShrink: 0,
  minWidth: '1.5em',
  fontFamily: fontFamily.mono,
  fontSize: text.bodySm.fontSize,
  color: color.textSubtle,
});

export const stepTitle = style({
  margin: 0,
});

export const stepDescription = style({
  marginTop: space.xs,
});
