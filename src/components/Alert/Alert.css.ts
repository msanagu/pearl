import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { color, radius, space } from '@tokens';
import { concentricRadius } from '@/foundations/concentricRadius';

// One `border` declaration per variant, not shared base + borderColor override
// — keeps the whole property together instead of relying on declaration order.
export const alert = recipe({
  base: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: space.sm,
    padding: space.md,
    // Derived from Alert's own padding, not shared with Card (which pads `lg`).
    borderRadius: concentricRadius(space.md),
    cornerShape: radius.cornerShape,
  },
  variants: {
    // Fallback/cascade root for descendants without their own color — title/body
    // Text always sets its own; XButton stays neutral, doesn't read from this.
    variant: {
      positive: { background: color.positive.surface, border: `1px solid ${color.positive.border}`, color: color.positive.text },
      negative: { background: color.negative.surface, border: `1px solid ${color.negative.border}`, color: color.negative.text },
      warn: { background: color.warn.surface, border: `1px solid ${color.warn.border}`, color: color.warn.text },
      info: { background: color.info.surface, border: `1px solid ${color.info.border}`, color: color.info.text },
    },
  },
  defaultVariants: {
    variant: 'info',
  },
});

// Icon sits at the text baseline, not centered on the whole (possibly multi-line) message.
export const iconSlot = style({
  flexShrink: 0,
  marginTop: '0px',

  selectors: {
    [`[data-component="alert"]:has([data-part="content"] [data-part="heading"]) &`]: {
      marginTop: '2px',
    },
  }  
});

export const content = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space.xs,
  flex: 1,
  minWidth: 0,
});
