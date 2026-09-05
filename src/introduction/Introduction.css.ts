import { style, globalStyle } from '@vanilla-extract/css';
import { color, radius, space, text } from '@tokens';

// Layout-only module — every colour/space/type value is a token, so the page
// survives a theme swap untouched. Raw numbers here are structural (grid
// tracks, max-widths, breakpoints).

const CONTENT_MAX = 1440;

// Width of the record index's ordinal column, shared by indexOrdinal and
// indexDetail so they align. Fixed rem, not 4ch — ch is font-relative and
// the two elements sit in different font contexts.
const INDEX_ORDINAL_WIDTH = '2rem';

// Fixed width for the status/date column so every title cell renders at a
// uniform size — an auto track lets a long status string shrink the title
// beside it. Wide enough for the longest status + month; drops out below 620.
const INDEX_META_WIDTH = '15rem';

export const page = style({
  maxWidth: CONTENT_MAX,
  width: '100%',
  margin: '0 auto',
  boxSizing: 'border-box',
  paddingLeft: space.xl,
  paddingRight: space.xl,
  // Composed from 2xl rather than a new step — a front door wants roughly
  // double that at top. Bottom is lighter: Footer brings its own top padding.
  paddingTop: `calc(${space['2xl']} * 3)`,
  paddingBottom: `calc(${space['2xl']} * 1.5)`,
  '@media': {
    // xl (32px) a side eats a real slice of a narrow phone viewport,
    // squeezing every bounded piece of content (theme specimen frames included).
    '(max-width: 640px)': {
      paddingLeft: space.md,
      paddingRight: space.md,
    },
  },
});

// Section rhythm — wider than a Stack's 2xl: at this heading scale, 2xl
// reads as a list of blocks, not a sequence of statements.
export const sectionFlow = style({
  display: 'flex',
  flexDirection: 'column',
  gap: `calc(${space['2xl']} * 4)`,
  '@media': {
    // Desktop-tuned flat gap reads as excess air at narrow viewports around
    // any visually short section (the stats strip especially).
    '(max-width: 640px)': {
      gap: `calc(${space['2xl']} * 2)`,
    },
  },
});

// Section opener as an asymmetric pair — title in the wide left column at
// display scale, standfirst in a narrow right column at body scale. A heading
// and its explanation shouldn't read as the same kind of object.
export const sectionHead = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1.35fr) minmax(0, 1fr)',
  columnGap: space['2xl'],
  rowGap: space.lg,
  alignItems: 'end',
  '@media': {
    '(max-width: 860px)': {
      gridTemplateColumns: 'minmax(0, 1fr)',
      alignItems: 'start',
    },
  },
});

/** Preheading + tick + title, stacked in the wide left column. */
export const sectionHeadLead = style({
  gridColumn: '1',
  display: 'flex',
  flexDirection: 'column',
  gap: space.sm,
});

/** The standfirst column — deliberately narrow against the display title. */
export const sectionStandfirst = style({
  gridColumn: '2',
  paddingBottom: space.xs,
  '@media': {
    '(max-width: 860px)': { gridColumn: '1' },
  },
});

// Premise card stacks — headline as a spanning statement, then beats in a
// row beneath it. Deliberately not the sectionHead shape: this sits right
// above the Conventions opener, and two asymmetric blocks in a row would
// read as one object twice.
export const premiseCard = style({
  display: 'flex',
  flexDirection: 'column',
  gap: `calc(${space['2xl']} * 1.25)`,
});

// Right-aligned — the one heading on this page that isn't left-anchored.
// Beats span the full width beneath it, so the headline reads as a caption
// to the row, not a column title. Falls back to left anchor on narrow screens.
export const premiseHeading = style({
  margin: 0,
  maxWidth: '20ch',
  marginLeft: 'auto',
  textAlign: 'right',
  textWrap: 'balance',
  '@media': {
    '(max-width: 640px)': {
      marginLeft: 0,
      textAlign: 'left',
    },
  },
});

// Three labelled beats side by side — different texture from the flowing
// standfirst the Conventions opener uses. Collapses to a stack, hairline
// between beats standing in for the column gutters.
export const premiseBeats = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
  gap: space.xl,
  '@media': {
    '(max-width: 860px)': {
      gridTemplateColumns: 'minmax(0, 1fr)',
      gap: space.lg,
    },
  },
});

export const premiseBeat = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space.xs,
  paddingTop: space.md,
  borderTop: `1px solid ${color.border}`,
});

// Beat body copy (bodySm, Introduction.tsx) is sized for a column — three
// narrow ones side by side above 860px. Below that premiseBeats collapses to
// one full-width column, so bump size only where the grid is stacked.
globalStyle(`${premiseBeat} [data-type-scale="bodySm"]`, {
  fontSize: text.bodyMd.fontSize,
  lineHeight: text.bodyMd.lineHeight,
  '@media': {
    '(min-width: 861px)': {
      fontSize: text.bodySm.fontSize,
      lineHeight: text.bodySm.lineHeight,
    },
  },
});

// Space between a section's opener and its content — wider than the
// opener's internal rhythm, reads as a separate beat.
export const sectionBody = style({
  display: 'flex',
  flexDirection: 'column',
  gap: `calc(${space['2xl']} * 1.5)`,
});

/** Theme specimens — two wide columns that collapse to one. */
export const themeGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: space.lg,
  '@media': {
    '(max-width: 720px)': {
      gridTemplateColumns: 'minmax(0, 1fr)',
    },
  },
});

// One theme specimen in its own frame. Theme classes can't nest in one
// document — source order breaks the specificity tie. See ThemeSpecimen.tsx.
export const themeSwatch = style({
  position: 'relative', // loading placeholder stacks over the frame
  borderRadius: radius.control,
  cornerShape: radius.cornerShape,
  border: `1px solid ${color.border}`,
  overflow: 'hidden',
  '@media': {
    // Each specimen has its own internal padding (ThemeSpecimen.tsx's
    // Stack + Card) — at phone width, page's padding plus that stacked a
    // card inside a card. Full-bleed (same 50vw technique as indexPanel)
    // makes the outer page padding the specimen's own padding instead.
    '(max-width: 640px)': {
      marginLeft: 'calc(50% - 50vw)',
      marginRight: 'calc(50% - 50vw)',
      borderRadius: 0,
      borderLeft: 'none',
      borderRight: 'none',
    },
  },
});

// Fixed height — an iframe can't auto-size to its content without a
// postMessage handshake. 700 clears the tallest theme (Tahitian, ~667px).
export const themeFrame = style({
  display: 'block',
  width: '100%',
  height: 700,
  border: 'none',
  // Each frame is a real document; a touch gesture over it gets captured by
  // that document instead of the page (scrolling="no" doesn't stop this on
  // mobile Safari). Frames are non-interactive, so disabling pointer events
  // lets every gesture fall through to the page.
  pointerEvents: 'none',
});

/** Next-steps cards sit two-up, then one-up on narrow screens. */
export const nextGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: space.lg,
});


/* The record index — a framed plate with chrome bars, an anchoring inverse
 * panel on the left, and the record list on the right. Hierarchy is carried by
 * scale contrast, not decoration; nothing forces uppercase, so each theme
 * states its own voice. No `Table` primitive — plain markup. */

// Full-bleed band. Escapes `page`'s max-width and side padding so the record
// index runs edge to edge, like the hero strip and the footer — at this
// heading scale the boxed-in version left too little room and wrapped the
// long titles apart. Only top and bottom rules; the sides meet the viewport,
// so no L/R border and no radius. `overflow: hidden` still clips the plate.
export const indexPanel = style({
  marginLeft: 'calc(50% - 50vw)',
  marginRight: 'calc(50% - 50vw)',
  borderTop: `1px solid ${color.border}`,
  borderBottom: `1px solid ${color.border}`,
  overflow: 'hidden',
});

/**
 * Header rail. A grid on the SAME track as the body below, so the divider
 * between its first and second cell lands exactly on the plate/list seam —
 * the rail reads as the top edge of one object rather than a separate strip.
 */
export const indexRailTop = style({
  display: 'grid',
  gridTemplateColumns: `36% minmax(0, 1fr) ${INDEX_META_WIDTH}`,
  background: color.surface,
  borderBottom: `1px solid ${color.border}`,
  '@media': {
    '(max-width: 860px)': {
      gridTemplateColumns: `minmax(0, 1fr) ${INDEX_META_WIDTH}`,
    },
  },
});

/** One rail cell; every cell after the first carries the vertical divider. */
export const indexRailCell = style({
  display: 'flex',
  alignItems: 'center',
  paddingLeft: space.lg,
  paddingRight: space.lg,
  paddingTop: space.md,
  paddingBottom: space.md,
  selectors: {
    '& + &': { borderLeft: `1px solid ${color.border}` },
  },
});

/** The span/range cell is the first thing to go when the plate does. */
export const indexRailCellRange = style({
  '@media': {
    '(max-width: 860px)': { display: 'none' },
  },
});

/** Footer rail — a plain two-up strip, no internal divisions. */
export const indexRailBottom = style({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: space.md,
  paddingLeft: space.lg,
  paddingRight: space.lg,
  paddingTop: space.md,
  paddingBottom: space.md,
  background: color.surface,
  borderTop: `1px solid ${color.border}`,
});

/** Plate + list. The plate drops out below the breakpoint. */
export const indexBody = style({
  display: 'grid',
  gridTemplateColumns: '36% minmax(0, 1fr)',
  '@media': {
    '(max-width: 860px)': {
      gridTemplateColumns: 'minmax(0, 1fr)',
    },
  },
});

/**
 * Anchoring plate. Uses the inverse pair — a section that flips against the
 * page around it — so the panel reads as one composed object, not a list
 * floating in a box.
 */
export const indexPlate = style({
  position: 'relative',
  isolation: 'isolate',
  overflow: 'hidden',
  // Theme's own ground, not [data-inverse]: in a dark theme the inverse
  // value is light, and a screen-blend overtone renders nothing over near-white.
  background: color.background,
  padding: space.xl,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: space['2xl'],
  minHeight: 260,
  borderRight: `1px solid ${color.border}`,
  '@media': {
    '(max-width: 860px)': {
      display: 'none',
    },
  },
});

// Photographic layer, held at partial opacity. 0.3 is a computed ceiling,
// not taste: compositing a worst-case pure-white pixel over the darkest
// ground at this opacity still clears 4.5:1 text contrast, for any photo.
// Above ~0.33 that stops holding (0.45 composites to ~3.2:1 worst case).
//
// An axe-style tool will still flag contrast here as inconclusive — it
// checks for an image in the stack, not the rendered pixel. Real limit of
// automated checking, not a signal this needs a scrim; the math above is
// the actual verification.
export const indexPlateImage = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  filter: 'grayscale(1)',
  opacity: 0.3,
  zIndex: 0,
});

/** Lifts plate type above both the image and the overtone's `::after`. */
export const indexPlateContent = style({
  position: 'relative',
  zIndex: 2,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end', // both lines are plate metadata — keep them together at the foot
  flex: 1,
  gap: space.md,
});

/** The list column. */
export const indexList = style({
  display: 'flex',
  flexDirection: 'column',
});

// One record — a native `<details>`. No JS, no ARIA of our own: the platform
// gives `<summary>` a button role, keyboard operation, and expanded state.
export const indexRecord = style({
  borderTop: `1px solid ${color.borderSubtle}`,
  selectors: {
    // The first record sits under the header rail, which already draws a
    // full-strength rule — a second hairline would double it.
    '&:first-child': { borderTop: 'none' },
  },
});

// The always-visible row. Fixed ordinal column so every title starts on the
// same vertical.
export const indexRow = style({
  display: 'grid',
  gridTemplateColumns: `auto minmax(0, 1fr) ${INDEX_META_WIDTH}`,
  columnGap: space.xl,
  // Bottom-aligned, not `baseline`: `baseline` hangs the ordinal off a wrapped
  // title's first line, and `last baseline` makes grid add the offset as track
  // space. Aligning the boxes lands in the same place visually.
  alignItems: 'end',
  paddingLeft: space.lg,
  paddingRight: space.lg,
  paddingTop: space.md,
  paddingBottom: space.md,
  cursor: 'pointer',
  listStyle: 'none',
  transition: 'background 200ms ease',
  selectors: {
    // Both spellings — WebKit still ships the pseudo-element form.
    '&::-webkit-details-marker': { display: 'none' },
    '&::marker': { content: '""' },
    '&:hover': { background: color.surface },
    '&:focus-visible': {
      outline: `2px solid ${color.focusRing}`,
      outlineOffset: '-2px',
    },
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': { transition: 'none' },
    '(max-width: 620px)': {
      gridTemplateColumns: 'auto minmax(0, 1fr)',
      rowGap: space.xs,
      alignItems: 'start',
    },
  },
});

// Query context for indexTitle — title sizes to this cell's width, not the viewport.
export const indexTitleCell = style({
  containerType: 'inline-size',
  minWidth: 0,
});

// Display typeScale here sets a viewport-scaled font-size, built for a
// full-width section title — far too big for one record-row cell, so a long
// word overflows the cell and overflow-wrap breaks it mid-word.
//
// Fix: size the title to its cell instead, cqi against indexTitleCell. Keeps
// every word within one line's width, so overflow-wrap only fires as a last
// resort. lineHeight: 1 drops display half-leading so the title sits on the
// ordinal/meta optical line. Matches whichever display scale the markup
// passes — &[data-type-scale] (0,2,0) outranks Text.css.ts's own rule.
export const indexTitle = style({
  overflowWrap: 'break-word',
  selectors: {
    '&[data-type-scale="displaySm"], &[data-type-scale="displayLg"]': {
      lineHeight: 1,
      fontSize: 'clamp(2rem, 9cqi, 5rem)',
    },
  },
});

/** Caret flips when its record opens. */
export const indexCaret = style({
  flexShrink: 0,
  transition: 'transform 200ms ease',
  selectors: {
    [`${indexRecord}[open] &`]: { transform: 'rotate(180deg)' },
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': { transition: 'none' },
  },
});

// Revealed panel, indented to align its title with the summary title above.
// calc mirrors indexRow's real column layout: left padding + ordinal width + column gap.
export const indexDetail = style({
  paddingLeft: `calc(${space.lg} + ${INDEX_ORDINAL_WIDTH} + ${space.xl})`,
  paddingRight: space.xl,
  paddingBottom: space.lg,
  paddingTop: space.sm,
  '@media': {
    '(max-width: 620px)': {
      paddingLeft: space.lg,
    },
  },
});

/** Fixed width so ordinals and titles align down the column. */
export const indexOrdinal = style({
  minWidth: INDEX_ORDINAL_WIDTH,
});

/** Right-aligned mono meta; wraps under the title on narrow screens. */
export const indexMeta = style({
  justifySelf: 'end',
  textAlign: 'right',
  '@media': {
    '(max-width: 620px)': {
      gridColumn: '2',
      justifySelf: 'start',
      textAlign: 'left',
    },
  },
});

// A quiet accent tick that opens each section — not a full-width divider.
export const sectionTick = style({
  width: 32,
  height: 2,
  background: color.accent,
  borderRadius: radius.full,
});

/** Stats section needs narrower width */
export const narrowContent = style({
  // Without this, width: 100% (content-box) plus this element's own padding
  // adds to more than 100% of the parent — overflowed and shifted right,
  // which made the stats card look off-center; not the grid layout below.
  boxSizing: 'border-box',
  maxWidth: 1200,
  margin: '0 auto',
  width: '100%',
  paddingLeft: space.xl,
  paddingRight: space.xl,
  '@media': {
    '(max-width: 640px)': {
      paddingLeft: space.md,
      paddingRight: space.md,
    },
  },
});

/** Stat strip — mirrors `Row`'s flex layout so `Stagger` can wrap the counts
 * directly without an extra flex parent fighting its own children's spacing. */
export const statsRow = style({
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: space.lg,
  width: '100%',
  minWidth: 0,
  '@media': {
    // Matches statDivider's breakpoint. A flex row's gap is a minimum, not a
    // cap — at phone width, space-between can push a wrapped pair wider than
    // the Card and spill past its edge. A grid's tracks stay capped to the
    // container width, so this centers pairs and guarantees no overflow.
    '(max-width: 620px)': {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
      justifyItems: 'center',
      columnGap: space.md,
      rowGap: space.xl,
    },
  },
});

/** Stat strip separators — vertical hairlines between the counts. */
export const statDivider = style({
  width: 1,
  alignSelf: 'stretch',
  background: color.borderSubtle,
  '@media': {
    '(max-width: 620px)': { display: 'none' },
  },
});

/* Playground section — a screenshot of an assistant thread + live render. */

/** Figure wrapper — full-width frame, caption beneath. */
export const playgroundShot = style({
  margin: 0,
});

/** Frames the screenshot to match the record index's outer frame. */
export const playgroundFrame = style({
  border: `1px solid ${color.border}`,
  borderRadius: radius.control,
  cornerShape: radius.cornerShape,
  overflow: 'hidden',
  background: color.surface,
});

/** The screenshot itself — block, fluid, never overflows its frame. */
export const playgroundImage = style({
  display: 'block',
  width: '100%',
  height: 'auto',
});

/** Caption under the frame. */
export const playgroundCaption = style({
  marginTop: space.md,
});

/** CTA — button over its how-it-runs note, grouped under the heading. */
export const playgroundCta = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: space.sm,
  marginTop: space.md,
});

// A variation on sectionHead — title a step down (headingLg), columns
// top-aligned and closer to even, so the standfirst reads as a partner.
export const playgroundHead = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 0.9fr)',
  columnGap: space['2xl'],
  rowGap: space.lg,
  alignItems: 'start',
  '@media': {
    '(max-width: 860px)': { gridTemplateColumns: 'minmax(0, 1fr)' },
  },
});

export const playgroundHeadLead = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space.sm,
});

/** BYOK / how-it-runs note, under the button. */
export const playgroundNote = style({
  margin: 0,
});
