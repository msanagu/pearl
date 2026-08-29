import { style } from '@vanilla-extract/css';
import { color, radius, space } from '../tokens';

// Layout-only module. Every color/space/type value comes from a token — the
// page is subject to the same reskinning promise as the components it
// documents (ROADMAP.md), so it must survive a theme swap untouched. Raw
// numbers here are structural (grid tracks, max-widths, breakpoints), which
// is the same line Hero.tsx and Docs.tsx draw.

const CONTENT_MAX = 1440;

export const page = style({
  maxWidth: CONTENT_MAX,
  width: '100%',
  margin: '0 auto',
  boxSizing: 'border-box',
  paddingLeft: space.xl,
  paddingRight: space.xl,
  // Composed from the scale rather than a new step, the same way Tag builds
  // its padding and Input its inset — `2xl` is the largest the theme
  // authors, and a front door wants roughly double that at the extremes.
  paddingTop: `calc(${space['2xl']} * 3)`,
  paddingBottom: `calc(${space['2xl']} * 3)`,
});

/**
 * Section rhythm. Deliberately wider than the `2xl` a `Stack` can express:
 * at this scale of heading, `2xl` reads as a list of blocks rather than a
 * sequence of statements. The air is doing the same work the type is.
 */
export const sectionFlow = style({
  display: 'flex',
  flexDirection: 'column',
  gap: `calc(${space['2xl']} * 4)`,
});

/**
 * Section opener as an asymmetric pair: the title takes the wide left column
 * at display scale, the standfirst sits in a narrow right column at body
 * scale. The tension is the point — a heading and its own explanation should
 * not read as the same kind of object, and setting them on one axis at
 * similar widths is what flattens them.
 */
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

/** Eyebrow + tick + title, stacked in the wide left column. */
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

/**
 * Space between a section's opener and the content it introduces. Wider than
 * the opener's own internal rhythm so the standfirst stays attached to its
 * heading while the content below reads as a separate beat.
 */
export const sectionBody = style({
  display: 'flex',
  flexDirection: 'column',
  gap: `calc(${space['2xl']} * 1.5)`,
});

/** Hero: wordmark + thesis beside the brand object; stacks on narrow screens. */
export const heroGrid = style({
  display: 'grid',
  // `max-content` on the text column, not `1fr`: the lede is measure-capped,
  // so a `1fr` track left it floating at ~400px inside a 1160px column with
  // 800px of dead air before the sphere. Sizing the track to its content and
  // pushing the art to the far edge makes that space deliberate negative
  // space between two masses rather than a gap nothing fills.
  gridTemplateColumns: 'minmax(0, max-content) auto',
  justifyContent: 'space-between',
  gap: space['2xl'],
  alignItems: 'center',
  // A title page, not a banner. The wordmark is the largest thing in the
  // system; giving it room to sit in is what makes the scale read as
  // deliberate rather than merely big.
  // Capped: unbounded `vh` strands the wordmark in dead space on a tall
  // window, which reads as a loading state rather than composure.
  minHeight: 'min(78vh, 720px)',
  paddingBottom: `calc(${space['2xl']} * 2)`,
  '@media': {
    '(max-width: 860px)': {
      gridTemplateColumns: 'minmax(0, 1fr)',
      justifyItems: 'start',
    },
  },
});

/**
 * The sphere is 168px of fixed artwork. Below the hero breakpoint it would
 * dominate a narrow column, so it drops out entirely rather than shrinking —
 * it is brand punctuation, not information.
 */
export const heroArt = style({
  // The sphere ships at 168px, which read as neither punctuation nor
  // artwork — close enough to the wordmark's mass to compete with it, too
  // small to hold the far edge of a wide canvas. Shrinking it made it a
  // stray dot; committing it to a proper hero visual is what resolves the
  // pairing. The wordmark still leads on TYPE, the sphere answers with
  // area, and the space between them reads as composition rather than gap.
  // Scaled from its own centre so the artwork keeps its proportions.
  transform: 'scale(1.7)',
  transformOrigin: 'center',
  '@media': {
    '(max-width: 860px)': { display: 'none' },
  },
});

/**
 * Numbered principle cards. Fixed at two columns rather than `auto-fit`:
 * there are exactly four, and letting them flow to three across strands the
 * fourth alone on a second row. Two-up gives a 2×2 block and buys each card
 * enough width to keep its title on one line.
 */
export const principleGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
  gap: space.xl,
  '@media': {
    '(max-width: 720px)': {
      gridTemplateColumns: 'minmax(0, 1fr)',
    },
  },
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

/**
 * One theme specimen, rendered in its own frame. Nesting theme classes in the
 * same document does not work: a theme styles components through
 * `globalStyle` descendant selectors keyed on its theme class, both the outer
 * and inner selectors match a nested component at identical specificity, and
 * CSS breaks that tie by source order rather than by proximity — so the inner
 * theme loses to whichever stylesheet loads last. See `ThemeSpecimen.tsx`.
 */
export const themeSwatch = style({
  borderRadius: radius.control,
  cornerShape: radius.cornerShape,
  border: `1px solid ${color.border}`,
  overflow: 'hidden',
});

/**
 * Fixed height — a frame has no content-driven size to inherit (an iframe
 * can't auto-size to its own content without a postMessage handshake, which
 * is real infrastructure this specimen doesn't warrant). 700, not 400: each
 * theme's own type scale/weight renders `ThemeSpecimen`'s fixed markup at a
 * genuinely different height (measured: Pearl 596px, Freshwater 593px,
 * South Sea 594px, Tahitian tallest at 667px — Anton's line-height runs
 * heaviest), and it barely moves with the frame's width (`measure="md"` on
 * the body copy caps its line length regardless of column layout, so
 * single- vs two-column wouldn't have bought back the space anyway). 700
 * clears the tallest theme with real margin rather than the exact number,
 * so a future tweak to any theme's scale doesn't immediately reopen this.
 */
export const themeFrame = style({
  display: 'block',
  width: '100%',
  height: 700,
  border: 'none',
});

/** Next-steps cards sit two-up, then one-up on narrow screens. */
export const nextGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
  gap: space.lg,
});

/* ------------------------------------------------------------------ *
 * Decision index — a framed plate with chrome bars top and bottom, an
 * anchoring inverse panel on the left, and the record list on the right.
 *
 * The hierarchy is carried by SCALE CONTRAST, not decoration: a dim mono
 * ordinal, a large title at heading scale, and small mono meta. Nothing
 * here forces uppercase — Tahitian's theme already cases its headings, and
 * Pearl's deliberately does not, so each theme states its own voice
 * (markup-philosophy.md). GAP — no `Table` primitive; this is plain markup.
 * ------------------------------------------------------------------ */

/** The outer frame. `overflow: hidden` clips the inverse plate to the radius. */
export const indexPanel = style({
  border: `1px solid ${color.border}`,
  borderRadius: radius.control,
  cornerShape: radius.cornerShape,
  overflow: 'hidden',
});

/**
 * Header rail. A grid on the SAME track as the body below, so the divider
 * between its first and second cell lands exactly on the plate/list seam —
 * the rail reads as the top edge of one object rather than a separate strip.
 */
export const indexRailTop = style({
  display: 'grid',
  gridTemplateColumns: '36% minmax(0, 1fr) auto',
  background: color.surface,
  borderBottom: `1px solid ${color.border}`,
  '@media': {
    '(max-width: 860px)': { gridTemplateColumns: 'minmax(0, 1fr) auto' },
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
  // The theme's OWN ground, not `backgroundInverse`. Inverting looked right
  // under Pearl and broke under Tahitian: in a dark theme the inverse pair is
  // light, and Tahitian's overtone is a screen blend specified for a dark
  // grayscale plate — screen over near-white renders nothing. Sitting in the
  // theme's own voice keeps the plate dark wherever the theme is dark, which
  // is exactly where the treatment expects to be.
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

/**
 * The photographic layer. Held at partial opacity rather than run full
 * strength: the plate's text uses the `textInverse` pair, whose contrast is
 * guaranteed against `backgroundInverse` — not against a photograph. Keeping
 * the inverse ground dominant means the type stays legible in every theme
 * while the image still reads as texture.
 *
 * Tahitian's `overtonePlate` restates `object-fit` and `grayscale` on this
 * same element at higher specificity; the values agree, so the plate looks
 * the same with or without that treatment.
 */
export const indexPlateImage = style({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
  filter: 'grayscale(1)',
  opacity: 0.45,
  zIndex: 0,
});

/** Lifts plate type above both the image and the overtone's `::after`. */
export const indexPlateContent = style({
  position: 'relative',
  zIndex: 2,
  display: 'flex',
  flexDirection: 'column',
  // Both lines are plate metadata, so they sit together at the foot rather
  // than being pushed to opposite ends. Count above wordmark reuses the
  // eyebrow-above-title idiom every section opener on this page already uses.
  justifyContent: 'flex-end',
  flex: 1,
  gap: space.md,
});

/** The list column. */
export const indexList = style({
  display: 'flex',
  flexDirection: 'column',
});

/**
 * One record — a native `<details>`. Progressive disclosure with no JS and
 * no ARIA of our own: the platform already gives `<summary>` a button role,
 * keyboard operation, and expanded state, which a hand-rolled toggle would
 * only reimplement worse (markup-philosophy.md).
 */
export const indexRecord = style({
  borderTop: `1px solid ${color.borderSubtle}`,
  selectors: {
    // The first record sits under the header rail, which already draws a
    // full-strength rule — a second hairline would double it.
    '&:first-child': { borderTop: 'none' },
  },
});

/**
 * The always-visible row. The ordinal column is fixed so every title starts
 * on the same vertical, which is what makes the column read as an index
 * rather than a ragged list.
 */
export const indexRow = style({
  display: 'grid',
  gridTemplateColumns: 'auto minmax(0, 1fr) auto',
  columnGap: space.xl,
  // Baseline, not center: the ordinal, the title, and the meta are three
  // sizes of the same line and should sit on one optical rule. Centering
  // three wildly different type sizes in a row leaves none of them aligned
  // to anything.
  //
  // `end`, not `baseline`: plain `baseline` hangs the ordinal and meta off a
  // wrapped title's FIRST line, stranding them halfway up a two-line row.
  // `last baseline` fixes that but makes grid add the baseline offset as track
  // space — measured at 216px rows against 100px for the same content — so the
  // cure is worse. Bottom-aligning the boxes lands in the same place visually
  // and keeps row height driven by content alone.
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

/**
 * Optical correction for the title's baseline against the ordinal/meta
 * columns it bottom-aligns with (see `indexRow`'s `alignItems: 'end'`
 * comment). Bottom-aligning the three BOXES only lines up their visual
 * baselines when each box has the same leftover space below its glyphs —
 * it doesn't. `displaySm`'s line-height leaves a large half-leading gap
 * below the glyphs at its size; `caption` (the ordinal/meta's own scale)
 * leaves a proportionally much smaller one. The title's box bottom sits
 * well below its own baseline, so bottom-aligning boxes strands the title's
 * TEXT visibly higher than the ordinal's.
 *
 * `lineHeight: 1` tightens the title's box to its font's own ascent/descent,
 * closing most of that gap — not perfect (still font-metric-dependent, and
 * varies per theme's own face), but close enough that the row reads as one
 * optical line instead of a floating ordinal.
 *
 * Specificity, not source order: `[data-type-scale="displaySm"]` (written
 * by `Text.tsx`) combined with this class beats the plain recipe class
 * regardless of which stylesheet loads first.
 */
export const indexTitle = style({
  selectors: {
    '&[data-type-scale="displaySm"]': { lineHeight: 1 },
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

/**
 * The revealed panel. Indented to the title column so the disclosure reads
 * as belonging to the record above it rather than starting a new one.
 */
export const indexDetail = style({
  paddingLeft: `calc(${space.lg} + 4ch + ${space.md})`,
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
  minWidth: '4ch',
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

/**
 * A quiet rule that opens each section — an accent tick, not a full-width
 * divider, so sections read as a sequence without the page turning into a
 * stack of boxes.
 */
export const sectionTick = style({
  width: 32,
  height: 2,
  background: color.accent,
  borderRadius: radius.full,
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
