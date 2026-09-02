import { recipe } from '@vanilla-extract/recipes';
import { color, radius, space, fontFamily, text } from '@tokens';

// One `background`/`border`/`color` declaration per variant, same reasoning
// as Alert's recipe: keeps each variant's full look together rather than
// splitting a shared base color from a per-variant override.
export const tag = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    // `control`, not `full`. A Tag is a small rectangle, and `full` on a
    // rectangle is a pill — a shape this system does not want. `full` is now
    // reserved for genuinely square-aspect elements where maximal rounding
    // produces a real circle (avatars, dots, status marks). Matching `control`
    // also means a Tag sitting beside a Button or Input shares its corner
    // rather than introducing a second one.
    borderRadius: radius.control,
    cornerShape: radius.cornerShape,
    // `sm` + `xs` (8 + 4 = 12px), not a new scale step — the horizontal padding
    // has to clear the corner arc or the label sits inside the curve, the same
    // rule Input's text inset follows. Composed from two real tokens rather
    // than a literal so it still rescales if a theme retunes its space scale.
    paddingLeft: `calc(${space.sm} + ${space.xs})`,
    paddingRight: `calc(${space.sm} + ${space.xs})`,
    paddingTop: space.xs,
    paddingBottom: space.xs,
    // Gap, so a leading icon (a delta arrow, a status dot) does not butt
    // against the label.
    gap: space.xs,
    fontFamily: fontFamily.body,
    // `caption`, not `bodySm` — a Tag is a mark ON content, not a line OF it.
    // At body size it competes with the text it annotates; caption is the step
    // the scale already reserves for "below the reading floor" (see tokens.ts).
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
