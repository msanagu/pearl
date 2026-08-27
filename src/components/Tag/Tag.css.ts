import { recipe } from '@vanilla-extract/recipes';
import { color, radius, space, fontFamily, text } from '../../tokens';

// One `background`/`border`/`color` declaration per variant, same reasoning
// as Alert's recipe: keeps each variant's full look together rather than
// splitting a shared base color from a per-variant override.
export const tag = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    borderRadius: radius.full,
    // `sm` + `xs` (8 + 4 = 12px), not a new scale step — a pill's horizontal
    // padding needs to sit between `sm` and `md` for the end-caps to read as
    // round rather than boxy against a full radius, but that's this shape's
    // proportion, not a general layout-rhythm value other components need.
    // Composed from two real tokens rather than a literal so it still
    // rescales if a theme tightens or loosens the space scale.
    paddingLeft: `calc(${space.sm} + ${space.xs})`,
    paddingRight: `calc(${space.sm} + ${space.xs})`,
    paddingTop: space.xs,
    paddingBottom: space.xs,
    fontFamily: fontFamily.body,
    fontSize: text.bodySm.fontSize,
    lineHeight: text.bodySm.lineHeight,
    whiteSpace: 'nowrap',
  },
  variants: {
    variant: {
      neutral: { background: color.surface, border: `1px solid ${color.border}`, color: color.textSubtle },
      positive: { background: color.positive.surface, border: `1px solid ${color.positive.border}`, color: color.positive.text },
      negative: { background: color.negative.surface, border: `1px solid ${color.negative.border}`, color: color.negative.text },
      warn: { background: color.warn.surface, border: `1px solid ${color.warn.border}`, color: color.warn.text },
      info: { background: color.info.surface, border: `1px solid ${color.info.border}`, color: color.info.text },
    },
  },
  defaultVariants: {
    variant: 'neutral',
  },
});
