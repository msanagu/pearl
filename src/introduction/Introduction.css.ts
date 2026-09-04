import { style } from '@vanilla-extract/css';
import { color, radius, space } from '@tokens';

// Layout-only module — every colour/space/type value is a token, so the page
// survives a theme swap untouched. Raw numbers here are structural (grid
// tracks, max-widths, breakpoints).

const CONTENT_MAX = 1440;

// Width of the record index's ordinal column, shared by `indexOrdinal` and
// `indexDetail` so they align. A fixed rem, not `4ch` — `ch` is font-relative
// and the two elements sit in different font contexts, so the same `4ch`
// resolved to different pixel widths.
const INDEX_ORDINAL_WIDTH = '2rem';

// Fixed width for the status/date column so every title cell is the same width
// and the titles render at a uniform size down the list — an `auto` track lets
// a longer status string ("in evaluation / September 2026") shrink the title
// beside it. Wide enough for the longest status + month at the mono caption
// size; the column drops out entirely below 620.
const INDEX_META_WIDTH = '15rem';

export const page = style({
  maxWidth: CONTENT_MAX,
  width: '100%',
  margin: '0 auto',
  boxSizing: 'border-box',
  paddingLeft: space.xl,
  paddingRight: space.xl,
  // Composed from `2xl` (the largest step the theme authors) rather than a new
  // step — a front door wants roughly double that at the top. The bottom is
  // lighter: the `Footer` band closes the page and brings its own top padding.
  paddingTop: `calc(${space['2xl']} * 3)`,
  paddingBottom: `calc(${space['2xl']} * 1.5)`,
  '@media': {
    // `xl` (32px) a side reads fine as a page margin at desktop width, but on
    // a narrow phone it eats a real slice of the viewport — every piece of
    // content it bounds, including the theme specimen frames, is squeezed
    // narrower than it needs to be and reflows taller as a result.
    '(max-width: 640px)': {
      paddingLeft: space.md,
      paddingRight: space.md,
    },
  },
});

// Section rhythm — wider than a `Stack`'s `2xl`: at this heading scale, `2xl`
// reads as a list of blocks rather than a sequence of statements.
export const sectionFlow = style({
  display: 'flex',
  flexDirection: 'column',
  gap: `calc(${space['2xl']} * 4)`,
  '@media': {
    // The flat gap is tuned for the desktop reading rhythm; at narrow
    // viewports it reads as excess air around any visually short section
    // (the stats strip especially), not a deliberate pause.
    '(max-width: 640px)': {
      gap: `calc(${space['2xl']} * 2)`,
    },
  },
});

// Section opener as an asymmetric pair — title in the wide left column at
// display scale, standfirst in a narrow right column at body scale. A heading
// and its own explanation shouldn't read as the same kind of object.
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

// The premise card stacks — headline as a spanning statement, then the beats in
// a row beneath it. Deliberately NOT the `sectionHead` shape (title beside a
// narrow column): this section sits right above the Conventions opener, and two
// asymmetric title-left/column-right blocks in a row read as one object twice.
export const premiseCard = style({
  display: 'flex',
  flexDirection: 'column',
  gap: `calc(${space['2xl']} * 1.25)`,
});

// Right-aligned and pushed to the right edge — the one heading on this page that
// isn't left-anchored. The beats span the full width beneath it, so the headline
// reads as a caption to the row rather than a column title. Falls back to the
// normal left anchor on narrow screens, where a ragged-left heading reads badly.
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

// Three labelled beats side by side — a different texture from the single
// flowing standfirst the Conventions opener uses. Collapses to a stack, with a
// hairline between beats standing in for the column gutters.
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

// Space between a section's opener and its content — wider than the opener's
// internal rhythm so the content reads as a separate beat.
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
// document — both selectors match a nested component at equal specificity and
// source order (not proximity) breaks the tie. See `ThemeSpecimen.tsx`.
export const themeSwatch = style({
  position: 'relative', // the loading placeholder is stacked over the frame
  borderRadius: radius.control,
  cornerShape: radius.cornerShape,
  border: `1px solid ${color.border}`,
  overflow: 'hidden',
  '@media': {
    // Each specimen already has its own internal padding (see
    // `ThemeSpecimen.tsx`'s `Stack` + `Card`) — at phone width, `page`'s
    // padding around the frame plus that internal padding stacked a card
    // inside a card, each losing more width to margins the same content
    // could have used. Breaking the frame full-bleed (same `50vw` technique
    // as `indexPanel`) means the outer page padding IS the specimen's
    // padding, not a second layer on top of it.
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
// postMessage handshake. 700 clears the tallest theme (Tahitian, ~667px)
// with margin, so a scale tweak doesn't immediately reopen this.
export const themeFrame = style({
  display: 'block',
  width: '100%',
  height: 700,
  border: 'none',
  // Each frame is a real document, so it can scroll independently of the
  // page. A touch (or wheel) gesture that starts over one gets captured by
  // *that* document instead of the outer page — `scrolling="no"` on the
  // element doesn't stop this on mobile Safari, which ignores the attribute
  // for touch. The frames are non-interactive demo content, so disabling
  // pointer events entirely is safe and makes every gesture over a specimen
  // fall through to the page underneath it.
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
 * The anchoring plate. Uses the inverse pair, which exists for exactly this
 * — a section that flips against the page around it — so the panel reads as
 * one composed object rather than a list floating in a box.
 */
export const indexPlate = style({
  position: 'relative',
  isolation: 'isolate',
  overflow: 'hidden',
  // The theme's own ground, not a `[data-inverse]` container: in a dark theme
  // the inverse value is light, and a screen-blend overtone renders nothing
  // over near-white. The plate needs to stay dark wherever the theme is dark.
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

// The photographic layer, held at partial opacity. `0.3` is a computed
// ceiling, not a taste call: composite a worst-case pure-white pixel (the
// grayscale filter's brightest possible value) over the darkest ground at
// this opacity, and the plate text's contrast against that composite still
// clears 4.5:1 — so the guarantee holds regardless of which photo is used or
// where the text sits over it, not just for today's crop. Above ~0.33 that
// stops being true (verified: 0.45 composites to ~3.2:1 in the worst case).
//
// A tool auditing this will still report contrast here as inconclusive — any
// element with an image node intersecting the text's box reads that way,
// since axe checks for an image in the stack rather than sampling the
// rendered pixel. That's a real limit of automated checking, not a signal
// this needs a scrim: the math above is the actual verification.
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

// Query context for `indexTitle` — the title sizes to this cell's width, not
// the viewport (see `indexTitle`).
export const indexTitleCell = style({
  containerType: 'inline-size',
  minWidth: 0,
});

// The display `typeScale` on this title sets a viewport-scaled `font-size`
// (`displaySm` is `clamp(2rem, 8vw, 4.5rem)`, `displayLg` larger still) — built
// for a full-width section title, far too big for one cell of a record row. At
// that size a single long word ("Composition", "MACHINE-READABLE") is wider
// than the cell, and `overflow-wrap` then breaks it mid-word.
//
// The fix is to size the title to *its cell*, not the viewport: `cqi` against
// the `indexTitleCell` container. That keeps every word within one line's
// width at the rendered size, so `overflow-wrap` only ever fires as a last
// resort on a genuinely unbreakable string. `lineHeight: 1` also drops the
// display half-leading so the title sits on the ordinal/meta optical line.
//
// Matches whichever display scale the markup passes — the `&[data-type-scale]`
// selector (0,2,0) outranks `Text.css.ts`'s own `[data-type-scale]` rule.
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

// The revealed panel, indented to align its title with the summary title
// above. The `calc` mirrors `indexRow`'s real column layout: left padding +
// ordinal width + column gap.
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
  // Without this, `width: 100%` (content-box by default) plus this element's
  // own padding add up to *more* than 100% of the parent — it was overflowing
  // its container by exactly `paddingLeft + paddingRight` and shifting right,
  // which is what actually made the stats card look off-center; the grid
  // layout below wasn't the cause.
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
    // Matches `statDivider`'s breakpoint, where the dividers drop out. A flex
    // row's `gap` is a minimum, not a cap — once the Card's own padding has
    // already eaten into a phone-width viewport, `space-between` (or any
    // extra gap) can push a wrapped pair wider than the Card and spill past
    // its edge instead of centering. A 2-column grid can't do that: its
    // tracks are capped to the container's width no matter what the content
    // wants, so this both centers the pairs and guarantees no overflow.
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

// A variation on `sectionHead` — title a step down (`headingLg`), columns
// top-aligned and closer to even, so the standfirst reads as a partner. The
// CTA lives in the left column under the heading, so it's the first thing the
// eye reaches after the title.
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
