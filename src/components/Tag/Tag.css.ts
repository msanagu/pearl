import { recipe } from '@vanilla-extract/recipes';
import { color, radius, space, fontFamily, text } from '@tokens';

// One background/border/color declaration per variant, same reasoning as
// Alert's recipe: keeps each variant's full look together.
export const tag = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    // control, not full — full on a rectangle is a pill, a shape this system
    // avoids; full is reserved for square-aspect elements (avatars, dots).
    // Matching control also shares corner with a neighboring Button/Input.
    borderRadius: radius.control,
    cornerShape: radius.cornerShape,
    // sm + xs (8 + 4 = 12px), not a new scale step — clears the corner arc,
    // same rule as Input's text inset. Composed from tokens so it rescales.
    paddingLeft: `calc(${space.sm} + ${space.xs})`,
    paddingRight: `calc(${space.sm} + ${space.xs})`,
    paddingTop: space.xs,
    paddingBottom: space.xs,
    // So a leading icon (delta arrow, status dot) doesn't butt against the label.
    gap: space.xs,
    fontFamily: fontFamily.body,
    // caption, not bodySm — a Tag marks content, it isn't a line of it; body
    // size would compete with the text it annotates.
    fontSize: text.caption.fontSize,
    lineHeight: 1,
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
