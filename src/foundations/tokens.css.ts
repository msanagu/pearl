import { style } from '@vanilla-extract/css';
import { color, fontFamily, radius, space } from '../tokens';
import { concentricRadius } from './concentricRadius';

// Layout for the token preview — itself built from the tokens, so this file is
// also the first proof that a `.css.ts` compiles through the vanilla-extract
// plugin inside Storybook (not just the Vite library build).

export const page = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space['2xl'],
  padding: space.xl,
  background: color.background,
  color: color.text,
  fontFamily: fontFamily.body,
});

export const section = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space.lg,
});

export const sectionTitle = style({
  margin: 0,
  fontSize: '18px',
  fontWeight: 600,
});

// The wordmark's own class — deliberately no fontSize/fontWeight, unlike
// `sectionTitle` (shared by every OTHER heading on this page, which still
// wants its fixed 18px). The wordmark is rendered through `Text` with
// `typeScale="displayLg"`; reusing `sectionTitle` here would fight that
// scale's own font-size for specificity, capping it back down to 18px.
export const wordmarkTitle = style({
  margin: 0,
  marginBottom: space.sm,
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

export const spaceBar = style({
  height: '16px',
  background: color.accent,
  borderRadius: radius.control,
});

export const radiusBox = style({
  width: '72px',
  height: '72px',
  background: color.surface,
  border: `1px solid ${color.border}`,
});

export const controlHeightBar = style({
  background: color.accentSubtle,
  border: `1px solid ${color.accent}`,
  borderRadius: radius.control,
});

// One swatch strip per sentiment role — surface/border/text/icon side by side.
export const sentimentRow = style({
  display: 'flex',
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

// The resolved-value caption under every swatch — what the token ACTUALLY
// computes to in the active theme, not just the var() reference. Turns this
// page from a paint job into a verification surface (see file doc comment).
export const resolvedValue = style({
  fontFamily: 'ui-monospace, Menlo, monospace',
  fontSize: '10px',
  color: color.textSubtle,
});

export const subsectionTitle = style({
  margin: 0,
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

// Inverse tokens mean nothing in isolation (textInverse on transparent tells
// you nothing about legibility). Render them together, in context, on the
// inverse background — the way a real "dark band inside a light page" section
// would actually use them.
export const inversePanel = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space.md,
  padding: space.lg,
  borderRadius: concentricRadius(space.lg),
  background: color.backgroundInverse,
});

export const inverseCard = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space.xs,
  padding: space.md,
  borderRadius: radius.control,
  background: color.surfaceInverse,
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
