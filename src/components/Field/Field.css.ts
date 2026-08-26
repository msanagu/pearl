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
// default/subtle — so it's plain spans, not `<Text>`.
//
// Split in three: `errorRow` is the `role="alert"` container (icon + message,
// so both are announced as one description — see aria-describedby wiring in
// Field.tsx), `errorIcon` and `errorText` style the two children. `alignItems:
// center` assumes a short, single-line message, matching every error string
// in this system today; a message that wraps would want `flex-start` instead
// so the icon sits at cap-height of the first line, not centered on the block.
export const errorRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: space.xs,
  paddingLeft: fieldPaddingX,
});

// Sized to bodySm's cap-height, not Icon's 20px default sized for standalone
// use — matches Alert's negative-sentiment icon (PiXCircleFill, color.negative.icon)
// so a field error and an Alert read as the same visual vocabulary. aria-hidden
// in Field.tsx: the icon carries no text a screen reader could read, and the
// row's own role="alert" is what gets announced.
export const errorIcon = style({
  flexShrink: 0,
  color: color.negative.icon,
});

export const errorText = style({
  fontFamily: fontFamily.body,
  fontSize: text.bodySm.fontSize,
  lineHeight: text.bodySm.lineHeight,
  color: color.negative.text,
});
