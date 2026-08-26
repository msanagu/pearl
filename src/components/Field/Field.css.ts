import { recipe } from '@vanilla-extract/recipes';
import { style } from '@vanilla-extract/css';
import { color, controlHeight, fontFamily, fontWeight, space, text } from '../../tokens';
import { fieldControlHeight, fieldPaddingX } from './fieldSize.css';

// `size` is exposed as CSS custom properties on the container, not injected
// as a React prop — that's how a nested `Input` picks it up without Field
// forcing a `size` prop onto arbitrary children (on a native `<select>`,
// `size` sets the visible row count, not a scale). sm and md share padding
// on purpose — only lg steps up.
export const field = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    gap: space.xs,
  },
  variants: {
    size: {
      sm: { vars: { [fieldControlHeight]: controlHeight.sm, [fieldPaddingX]: space.md } },
      md: { vars: { [fieldControlHeight]: controlHeight.md, [fieldPaddingX]: space.md } },
      lg: { vars: { [fieldControlHeight]: controlHeight.lg, [fieldPaddingX]: space.lg } },
    },
  },
  defaultVariants: { size: 'md' },
});

export const label = style({
  fontFamily: fontFamily.body,
  fontSize: text.bodySm.fontSize,
  lineHeight: text.bodySm.lineHeight,
  fontWeight: fontWeight.medium,
  color: color.text,
  paddingLeft: fieldPaddingX,
});

// A required mark reads as attention, not an error — reuses the same
// sentiment color as `error` but the label carries no `role="alert"`, so
// unlike a live error it never interrupts assistive tech on mount.
export const requiredMark = style({
  color: color.negative.text,
});

export const hint = style({
  fontFamily: fontFamily.body,
  fontSize: text.bodySm.fontSize,
  lineHeight: text.bodySm.lineHeight,
  color: color.textSubtle,
  paddingLeft: fieldPaddingX,
});

// Error needs its own sentiment color — Text's `prominence` prop only covers
// default/subtle — so it's a plain span, not `<Text>`.
export const error = style({
  fontFamily: fontFamily.body,
  fontSize: text.bodySm.fontSize,
  lineHeight: text.bodySm.lineHeight,
  color: color.negative.text,
  paddingLeft: fieldPaddingX,
});
