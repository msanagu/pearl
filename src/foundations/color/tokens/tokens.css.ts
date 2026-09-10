import { style, globalStyle } from '@vanilla-extract/css';
import { color, radius, space } from '@tokens';

// Layout for the Color/Tokens specimen — both halves. The primitives half
// renders raw theme-scoped hex (no custom properties, so swatches don't
// recolor with the toolbar); the semantic half is built from the tokens
// themselves, which also makes this the first proof that a `.css.ts` compiles
// through the vanilla-extract plugin inside Storybook, not just the Vite build.
//
// No padding/background/font here — this renders inside <StoryDoc>'s own
// page chrome now, not as a standalone full-bleed canvas.
export const page = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space['2xl'],
  '@media': {
    '(max-width: 600px)': { gap: space.xl },
  },
});

/* --- semantic half --- */

// No gap here — proximity is carried by sectionTitle/subsectionTitle margins
// instead, so a heading sits close to its own content and a full step away
// from the previous group, rather than every sibling getting the same gap.
export const section = style({
  display: 'flex',
  flexDirection: 'column',
});

export const sectionTitle = style({
  margin: `0 0 ${space.sm}`,
  fontSize: '18px',
  fontWeight: 600,
});

export const row = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: space.lg,
});

export const cell = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space.xs,
  fontSize: '12px',
  color: color.textSubtle,
});

export const swatch = style({
  width: '112px',
  height: '72px',
  borderRadius: radius.control,
  border: `1px solid ${color.border}`,
});

// One sentiment group (positive, negative, …): label above its swatch strip —
// same layout and label weight as the hue blocks on the primitives half.
export const sentimentGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space.sm,
});

export const sentimentGroupLabel = style({
  fontSize: '13px',
  fontWeight: 600,
  color: color.text,
  lineHeight: 1.4,
});

// One swatch strip per sentiment role — surface/border/text/icon/fill side by side,
// wrapping to a 2x2 block once four 96px cards no longer fit (portrait mobile).
export const sentimentRow = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: space.md,
});

export const sentimentCard = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: space.xs,
  width: '96px',
  height: '64px',
  // No interior padding, so nothing to be concentric with — the theme's own
  // corner is the honest answer.
  borderRadius: radius.control,
});

// Resolved-value caption under every swatch — what the token actually
// computes to in the active theme, not just the var() reference.
export const resolvedValue = style({
  fontFamily: 'ui-monospace, Menlo, monospace',
  fontSize: '10px',
  color: color.textSubtle,
});

export const subsectionTitle = style({
  margin: `${space.xl} 0 ${space.sm}`,
  fontSize: '13px',
  fontWeight: 600,
  color: color.textSubtle,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
});

// A border/divider token shown as an actual rule, not a filled box — a border
// color swatch-as-fill misrepresents how the token is ever used.
export const borderRule = style({
  width: '112px',
  height: 0,
  borderTop: '2px solid',
});

// Accent shown as it's actually consumed: a filled pill with onAccent text,
// so a contrast problem is visible rather than inferred from two flat swatches.
export const accentPill = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: space.sm,
  padding: `${space.sm} ${space.lg}`,
  borderRadius: radius.control,
  background: color.accent,
  color: color.onAccent,
  fontWeight: 600,
  width: 'fit-content',
});

// focusRing is a ring, never a fill — show the actual box-shadow usage.
export const focusDemo = style({
  width: '96px',
  height: '40px',
  borderRadius: radius.control,
  border: `1px solid ${color.border}`,
  background: color.surface,
  boxShadow: `0 0 0 3px ${color.focusRing}`,
});

export const familySample = style({
  fontSize: '20px',
});

export const weightSwatch = style({
  fontSize: '24px',
});

/* --- primitives half (raw hex, reads the toolbar theme only) --- */

export const themeSection = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space.lg,
  paddingBottom: space.xl,
  borderBottom: `1px solid ${color.border}`,
});

export const groupTitle = style({
  margin: 0,
  fontSize: '13px',
  fontWeight: 600,
  color: color.textSubtle,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
});

// One block per hue: label on top, swatches wrapping below. Label-beside forced
// a 9-step ramp past ~640px; stacked, the strip wraps to as many rows as the
// viewport needs. Steps are whatever the palette defines — no padding to a
// uniform 100-900 run.
export const scaleRow = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space.sm,
});

export const scaleLabel = style({
  display: 'block',
  fontSize: '13px',
  fontWeight: 600,
  color: color.text,
  lineHeight: 1.4,
});

// Stacks the hue blocks within a group (Neutral, Accent, …). Wider than
// scaleRow's own label-to-swatches gap so blocks read as separate.
export const hueGroup = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space.lg,
});

export const stepList = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: space.sm,
});

export const step = style({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: space.xs,
  fontSize: '11px',
  color: color.textSubtle,
  width: '4rem',
  flexShrink: 0,
});

export const stepNumber = style({
  fontSize: '11px',
});

// Fixed radius, decoupled from radius.control so a theme with a large
// authored corner can't paint these chips as near-circles.
export const stepSwatch = style({
  width: '100%',
  height: '48px',
  borderRadius: '8px',
  border: `1px solid ${color.border}`,
});

// Alpha swatches carry true transparency (rgba, not flat hex) — a low step
// composited directly over the page background is nearly indistinguishable
// from no fill. A checkerboard backdrop gives the eye a fixed reference so
// opacity stays visible regardless of the theme's background. Hardcoded
// grey/white, not theme tokens — the standard transparency-grid convention.
//
// Checker and color fill are two separate layers (alphaSwatch +
// alphaSwatchFill), not one element with backgroundColor set to the rgba
// step — single-layer would punch a hole in the opaque checker underneath,
// reading as noise. Stacked, the wash evenly covers both checker tones and
// opacity reads as how much checker still shows through.
export const alphaSwatch = style([
  stepSwatch,
  {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: '#fff',
    backgroundImage:
      'linear-gradient(45deg, #ccc 25%, transparent 25%), linear-gradient(-45deg, #ccc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ccc 75%), linear-gradient(-45deg, transparent 75%, #ccc 75%)',
    backgroundSize: '8px 8px',
    backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
  },
]);

export const alphaSwatchFill = style({
  position: 'absolute',
  inset: 0,
});

export const stepHex = style({
  fontFamily: 'ui-monospace, Menlo, monospace',
  fontSize: '10px',
});

// Named (non-stepped) primitives — e.g. a theme's `linen`/`ink`/`teal` set,
// which aren't a numeric ramp. Shown as label + swatch pairs instead of a
// step grid.
export const namedGrid = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: space.md,
});

export const namedCell = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space.xs,
  fontSize: '12px',
  color: color.textSubtle,
});

export const namedSwatch = style({
  width: '96px',
  height: '56px',
  borderRadius: '8px',
  border: `1px solid ${color.border}`,
});

// Tahitian's radius tokens are 0px for both control and surface — a
// hard-edged theme, so the generic 8px rounded-rect above misreports it.
// Marked at the section level so every nested swatch kind picks it up
// without each call site opting in.
export const squareSwatches = style({});

globalStyle(
  `.${squareSwatches} .${stepSwatch}, .${squareSwatches} .${namedSwatch}`,
  {
    borderRadius: 0,
  },
);

export const modeColumns = style({
  display: 'flex',
  gap: space.xl,
  flexWrap: 'wrap',
});

export const modeColumn = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space.sm,
});

export const modeLabel = style({
  margin: 0,
  fontSize: '12px',
  fontWeight: 600,
  color: color.textSubtle,
});
