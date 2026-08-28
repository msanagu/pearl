import { style } from '@vanilla-extract/css';
import { color, controlHeight, fontFamily, radius, space, text } from '../../src/tokens';
import { concentricRadius } from '../../src/foundations/concentricRadius';

// POC/CreateTheme layout. Left: the intuitive form. Right: a live preview built
// from real canon components, whose color/density/type are entirely the
// generator's output injected as CSS custom properties. The generated theme is
// scoped to the preview panel ONLY — the form chrome keeps the ambient theme.

export const page = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(340px, 400px) 1fr',
  minHeight: '100vh',
  background: color.background,
  color: color.text,
  fontFamily: fontFamily.body,
  fontSize: text.bodyMd.fontSize,
  lineHeight: text.bodyMd.lineHeight,
  '@media': {
    'screen and (max-width: 900px)': { gridTemplateColumns: '1fr' },
  },
});

// ---- Form ------------------------------------------------------------------
export const form = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space['2xl'],
  padding: space.xl,
  borderRight: `1px solid ${color.border}`,
  background: color.surface,
  position: 'sticky',
  top: 0,
  alignSelf: 'start',
  maxHeight: '100vh',
  overflowY: 'auto',
});

export const formTitle = style({
  margin: 0,
  fontFamily: fontFamily.display,
  fontSize: text.headingMd.fontSize,
  lineHeight: text.headingMd.lineHeight,
  fontWeight: text.headingMd.fontWeight,
  letterSpacing: text.headingMd.letterSpacing,
});

export const formIntro = style({
  margin: `${space.xs} 0 0`,
  color: color.textSubtle,
  fontSize: text.bodySm.fontSize,
});

export const group = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space.md,
});

export const legend = style({
  padding: 0,
  margin: 0,
  fontSize: text.caption.fontSize,
  fontWeight: 600,
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
  color: color.textSubtle,
});

// ---- Color controls (hue + lightness) --------------------------------------
export const colorField = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space.md,
});

export const colorHeader = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: space.sm,
});

export const colorHeaderMain = style({
  display: 'flex',
  alignItems: 'center',
  gap: space.sm,
});

export const swatchDot = style({
  width: 36,
  height: 36,
  flexShrink: 0,
  borderRadius: radius.full,
  border: `1px solid ${color.border}`,
});

export const colorName = style({
  fontWeight: 600,
  fontSize: text.bodyMd.fontSize,
});

export const sliderLabel = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space.xs,
});

export const sliderCaption = style({
  fontSize: text.caption.fontSize,
  color: color.textSubtle,
});

const sliderBase = style({
  width: '100%',
  appearance: 'none',
  WebkitAppearance: 'none',
  height: 14,
  borderRadius: radius.control,
  outline: 'none',
  cursor: 'pointer',
  selectors: {
    '&::-webkit-slider-thumb': {
      appearance: 'none',
      WebkitAppearance: 'none',
      width: 22,
      height: 22,
      borderRadius: radius.full,
      background: color.surface,
      border: `2px solid ${color.text}`,
      boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
      cursor: 'pointer',
    },
    '&::-moz-range-thumb': {
      width: 22,
      height: 22,
      borderRadius: radius.full,
      background: color.surface,
      border: `2px solid ${color.text}`,
      cursor: 'pointer',
    },
  },
});

export const hueSlider = style([
  sliderBase,
  {
    background:
      'linear-gradient(to right, oklch(0.7 0.16 0), oklch(0.7 0.16 60), oklch(0.7 0.16 120), oklch(0.7 0.16 180), oklch(0.7 0.16 240), oklch(0.7 0.16 300), oklch(0.7 0.16 360))',
  },
]);

// Lightness track gradient is set inline per current hue.
export const lightnessSlider = sliderBase;

export const hexInput = style({
  width: 92,
  padding: '4px 8px',
  borderRadius: radius.control,
  border: `1px solid ${color.border}`,
  background: color.background,
  color: color.text,
  font: 'inherit',
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: text.bodySm.fontSize,
  textAlign: 'center',
  textTransform: 'uppercase',
});

export const linkButton = style({
  appearance: 'none',
  border: 'none',
  background: 'none',
  padding: 0,
  font: 'inherit',
  fontSize: text.bodySm.fontSize,
  fontWeight: 600,
  color: color.accent,
  cursor: 'pointer',
  textDecoration: 'underline',
  textUnderlineOffset: '3px',
});

export const addAccent = style([
  linkButton,
  {
    alignSelf: 'flex-start',
    color: color.text,
    display: 'inline-flex',
    alignItems: 'center',
    gap: space.xs,
  },
]);

// ---- Refinement chips (sub-variants of the active category) -----------------
export const categoryHeader = style({
  display: 'flex',
  alignItems: 'baseline',
  gap: space.sm,
});

export const categoryName = style({
  fontFamily: fontFamily.heading,
  fontSize: text.bodyLg.fontSize,
  fontWeight: 600,
});

export const categoryHint = style({
  fontSize: text.caption.fontSize,
  color: color.textSubtle,
});

// Single column, roomy — readability over density (feedback: chips too cramped).
export const variantList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space.sm,
});

export const variantChip = style({
  display: 'flex',
  alignItems: 'center',
  gap: space.md,
  textAlign: 'left',
  padding: `${space.md} ${space.md}`,
  borderRadius: radius.control,
  border: `1px solid ${color.border}`,
  background: color.background,
  color: color.text,
  cursor: 'pointer',
  font: 'inherit',
  transition: 'border-color 120ms ease, background 120ms ease',
  selectors: {
    '&[data-active="true"]': {
      borderColor: color.primary,
      background: color.accentSubtle,
    },
    '&:hover': { borderColor: color.borderStrong },
  },
});

export const variantRadio = style({
  width: 18,
  height: 18,
  flexShrink: 0,
  borderRadius: radius.full,
  border: `2px solid ${color.borderStrong}`,
  display: 'grid',
  placeItems: 'center',
  selectors: {
    [`${variantChip}[data-active="true"] &`]: {
      borderColor: color.primary,
    },
    [`${variantChip}[data-active="true"] &::after`]: {
      content: '""',
      width: 8,
      height: 8,
      borderRadius: radius.full,
      background: color.primary,
    },
  },
});

export const variantText = style({
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
});

export const variantLabel = style({
  fontWeight: 600,
  fontSize: text.bodyMd.fontSize,
});

export const variantBlurb = style({
  fontSize: text.bodySm.fontSize,
  lineHeight: 1.4,
  color: color.textSubtle,
});

// ---- Preview ---------------------------------------------------------------
export const preview = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space['2xl'],
  padding: space['2xl'],
  background: color.background,
  minWidth: 0,
});

// The previewed "website" — the subtree Impeccable audits (excludes the panel).
export const site = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space['2xl'],
});

// ---- Impeccable live audit panel -------------------------------------------
export const auditPanel = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space.sm,
  padding: space.md,
  borderRadius: concentricRadius(space.md),
  border: `1px solid ${color.border}`,
  background: color.surface,
});

export const auditHead = style({
  display: 'flex',
  alignItems: 'center',
  gap: space.md,
});

export const auditScore = style({
  display: 'flex',
  alignItems: 'baseline',
  gap: 2,
  fontFamily: fontFamily.display,
  fontWeight: 700,
  fontSize: text.headingMd.fontSize,
  lineHeight: '1',
});

export const auditScoreUnit = style({
  fontSize: text.bodySm.fontSize,
  fontWeight: 500,
  color: color.textSubtle,
});

export const auditCounts = style({
  display: 'flex',
  gap: space.sm,
  flexWrap: 'wrap',
});

export const auditBadge = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: space.xs,
  padding: `2px ${space.sm}`,
  borderRadius: radius.control,
  fontSize: text.caption.fontSize,
  fontWeight: 600,
  border: `1px solid ${color.border}`,
});

export const auditTitle = style({
  margin: 0,
  marginRight: 'auto',
  fontSize: text.bodySm.fontSize,
  fontWeight: 600,
  color: color.textSubtle,
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
});

export const auditList = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space.xs,
  margin: 0,
  padding: 0,
  listStyle: 'none',
});

export const auditItem = style({
  display: 'flex',
  alignItems: 'flex-start',
  gap: space.sm,
  padding: `${space.xs} 0`,
  borderTop: `1px solid ${color.borderSubtle}`,
  fontSize: text.bodySm.fontSize,
});

export const auditDot = style({
  width: 8,
  height: 8,
  marginTop: 6,
  flexShrink: 0,
  borderRadius: radius.full,
});

export const auditRule = style({
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: text.caption.fontSize,
  color: color.textSubtle,
});

export const auditClean = style({
  fontSize: text.bodySm.fontSize,
  color: color.textSubtle,
});

export const previewHero = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space.md,
  padding: space.xl,
  borderRadius: concentricRadius(space.md),
  background: color.surface,
  border: `1px solid ${color.border}`,
});

export const kicker = style({
  margin: 0,
  fontSize: text.caption.fontSize,
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
  fontWeight: 600,
  // Quiet neutral, deliberately NOT accent — accent is reserved for focus/icons.
  color: color.textSubtle,
});

export const display = style({
  margin: 0,
  fontFamily: fontFamily.display,
  fontSize: text.displaySm.fontSize,
  lineHeight: text.displaySm.lineHeight,
  fontWeight: text.displaySm.fontWeight,
  letterSpacing: text.displaySm.letterSpacing,
  maxWidth: '18ch',
});

export const lead = style({
  margin: 0,
  maxWidth: '52ch',
  fontSize: text.bodyLg.fontSize,
  lineHeight: text.bodyLg.lineHeight,
  color: color.textSubtle,
});

export const actionRow = style({
  display: 'flex',
  gap: space.sm,
  flexWrap: 'wrap',
  alignItems: 'center',
});

export const sectionTitle = style({
  margin: `0 0 ${space.md}`,
  fontFamily: fontFamily.heading,
  fontSize: text.headingSm.fontSize,
  lineHeight: text.headingSm.lineHeight,
  fontWeight: text.headingSm.fontWeight,
});

export const grid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
  gap: space.md,
});

export const alertStack = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space.sm,
});

// ---- Features (accent applies to icons only) -------------------------------
export const featureGrid = style({
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
  gap: space.lg,
});

export const feature = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space.xs,
});

export const featureIcon = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 44,
  height: 44,
  marginBottom: space.xs,
  borderRadius: radius.control,
  // A quiet accent-tinted chip behind the icon; the icon itself is accent.
  background: color.accentSubtle,
});

// ---- Neutral scale showcase ------------------------------------------------
export const neutralWrap = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space.sm,
});

export const neutralRow = style({
  display: 'flex',
  gap: 0,
  borderRadius: radius.control,
  overflow: 'hidden',
  border: `1px solid ${color.border}`,
});

export const neutralStep = style({
  flex: 1,
  minWidth: 0,
  height: 72,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  padding: 6,
  gap: 2,
});

export const neutralStepNumber = style({
  fontSize: '10px',
  fontVariantNumeric: 'tabular-nums',
  opacity: 0.75,
});

export const neutralRole = style({
  fontSize: '9px',
  fontWeight: 600,
  lineHeight: 1.2,
});

// Applied demo: real tokens in context beneath the raw scale.
export const appliedDemo = style({
  display: 'flex',
  gap: space.md,
  flexWrap: 'wrap',
  alignItems: 'stretch',
});

export const appliedCard = style({
  flex: '1 1 200px',
  padding: space.md,
  borderRadius: concentricRadius(space.md),
  background: color.surface,
  border: `1px solid ${color.border}`,
  display: 'flex',
  flexDirection: 'column',
  gap: space.xs,
});

export const appliedMuted = style({
  color: color.textSubtle,
  fontSize: text.bodySm.fontSize,
});

// Brand ramp with per-step hex; the `exact` step (the user's literal color)
// is flagged so it's obvious which swatch is 1:1 pasteable.
export const brandRamp = style({
  display: 'flex',
  gap: 0,
  borderRadius: radius.control,
  overflow: 'hidden',
  border: `1px solid ${color.border}`,
});

export const brandStep = style({
  flex: 1,
  minWidth: 0,
  height: 96,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
  gap: 2,
  padding: 6,
  position: 'relative',
  selectors: {
    '&[data-exact="true"]': {
      outline: `3px solid ${color.text}`,
      outlineOffset: '-3px',
      zIndex: 1,
    },
  },
});

export const brandStepNumber = style({
  fontSize: '10px',
  fontVariantNumeric: 'tabular-nums',
  opacity: 0.85,
});

export const brandStepHex = style({
  fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  fontSize: '9px',
  textTransform: 'uppercase',
  opacity: 0.9,
});

export const brandStepTag = style({
  position: 'absolute',
  top: 6,
  left: 6,
  fontSize: '9px',
  fontWeight: 700,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
});

export const densityNote = style({
  fontSize: text.caption.fontSize,
  color: color.textSubtle,
  height: controlHeight.sm,
  display: 'inline-flex',
  alignItems: 'center',
});
