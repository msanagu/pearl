import { style } from '@vanilla-extract/css';
import { color, fontFamily, radius, space } from '@tokens';

// Layout for the semantic half of the Color/Tokens specimen — itself built
// from the tokens, so also the first proof that a `.css.ts` compiles through
// the vanilla-extract plugin inside Storybook (not just the Vite library build).

export const page = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space['2xl'],
  padding: space.xl,
  background: color.background,
  color: color.text,
  fontFamily: fontFamily.body,
  // Portrait mobile: 32px each side eats a tenth of a 360px viewport.
  '@media': {
    '(max-width: 600px)': { padding: space.md, gap: space.xl },
  },
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
// same layout and label weight as the hue blocks on Color/Tokens primitives.
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
