import { style } from '@vanilla-extract/css';
import { color, radius, space } from '@tokens';

// Layout-only module. Every color/space/type value comes from a token — the
// page is subject to the same reskinning promise as the components it
// documents (ROADMAP.md), so it must survive a theme swap untouched. Raw
// numbers here are structural (grid tracks, max-widths, breakpoints), which
// is the same line Hero.tsx and Docs.tsx draw.

const CONTENT_MAX = 1440;

/**
 * Shared literal width for the decision index's ordinal column, used by both
 * `indexOrdinal` (the summary row) and `indexDetail` (the expanded panel's
 * left indent) so the two are guaranteed to agree — NOT `4ch` in both places
 * independently, which is what shipped originally and produced a real,
 * measured ~12px misalignment between a record's summary title and its own
 * detail title. `ch` is font-relative, and the two elements sit in different
 * font contexts: `indexOrdinal` inherits the ordinal's own small tracked
 * caption face (measured ≈6.4px/ch in Pearl), while `indexDetail` is a plain
 * wrapper with no font of its own, so its `4ch` resolved against whatever
 * ambient body font it inherited instead (≈9.3px/ch) — same token, two
 * different pixel values. A fixed rem, shared by reference, can't drift that
 * way. `2rem` comfortably covers every current ordinal ("0001"–"0010", 4
 * digits) across all four themes' caption/mono faces, with headroom for a
 * wider tracked face than Pearl's own General Sans.
 */
const INDEX_ORDINAL_WIDTH = '2rem';

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
 * The premise card's internal layout — same asymmetric proportion as
 * `sectionHead` (headline column wider than its partner, same `2xl` gap), so
 * the two-column language stays consistent across the page. Deliberately a
 * separate style rather than reusing `sectionHead`/`sectionStandfirst`
 * directly: those pair a heading with ONE short standfirst line, close
 * enough in height that bottom-aligning them (`alignItems: 'end'`) reads as
 * one shared baseline. This card pairs the headline with two full paragraph
 * beats — genuinely taller than the headline column — so bottom-aligning
 * would shove the headline down into dead space above it. `start` instead:
 * both columns share a top edge, which is the correct read when one side is
 * reliably shorter than the other, not incidentally so.
 */
export const premiseGrid = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1.35fr) minmax(0, 1fr)',
  columnGap: space['2xl'],
  rowGap: space.lg,
  alignItems: 'start',
  '@media': {
    '(max-width: 860px)': {
      gridTemplateColumns: 'minmax(0, 1fr)',
    },
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
 *
 * The gap term has to match `indexRow`'s real `columnGap` (`space.xl`, not
 * `space.md`) — this used the wrong token, so the detail title sat 16px
 * (`xl` − `md`) left of where the summary title actually starts, not a flex
 * quirk. `indexRow` is a grid, not flex, and its layout was correct; this
 * formula was the only thing computing the wrong offset. The ordinal-width
 * term is `INDEX_ORDINAL_WIDTH`, not `4ch` — see that constant's own
 * comment for the second, subtler bug this fixes alongside the gap token.
 */
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

/**
 * Fixed width so ordinals and titles align down the column — `2rem`
 * (`INDEX_ORDINAL_WIDTH`), not `4ch`. Same fix as `indexDetail`: a literal
 * shared by reference can't resolve to two different pixel values the way
 * `ch` did across these two elements' different font contexts.
 */
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

/** Stats section needs narrower width */
export const narrowContent = style({
  maxWidth: 1200,
  margin: '0 auto',
  width: '100%',
  paddingLeft: space.xl,
  paddingRight: space.xl,
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
