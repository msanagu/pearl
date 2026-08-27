import { style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { color, radius, space } from '../../tokens';

// One `border` declaration per variant (not a shared `border: 1px solid` in
// `base` + a `borderColor` override) — vanilla-extract variants win on equal
// specificity by declaration order, but keeping the whole property together
// per variant avoids relying on that ordering at all.
export const alert = recipe({
  base: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: space.sm,
    padding: space.md,
    borderRadius: radius.surface,
  },
  variants: {
    // `color` here is a fallback/cascade root, kept for any plain-text/icon
    // descendant that doesn't set its own color — the title/body `Text` sets
    // its own explicitly instead (it always sets `color`, so it can't inherit
    // one from an ancestor), and `XButton` is intentionally neutral
    // rather than variant-colored, so it doesn't read from this either.
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

// Icon sits at the text baseline, not vertically centered on the whole
// (possibly multi-line) message block.
export const iconSlot = style({
  flexShrink: 0,
  marginTop: '0px', // Default style when heading is absent
  
  selectors: {
    // If a heading class exists in the content sibling of this icon
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
