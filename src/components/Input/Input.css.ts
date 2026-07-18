import { recipe } from '@vanilla-extract/recipes';
import { color, controlHeight, fontFamily, radius, space, text } from '../../tokens';

// Height maps to `controlHeight` so inputs align with Buttons in a row and
// respond to the density lever. State styling (focus/invalid/disabled) lives on
// self-selectors — a state legitimately outranking a base override is expected.
export const input = recipe({
  base: {
    width: '100%',
    boxSizing: 'border-box',
    border: `1px solid ${color.border}`,
    borderRadius: radius.control,
    background: color.background,
    color: color.text,
    fontFamily: fontFamily.body,
    fontSize: text.bodyMd.fontSize,
    paddingLeft: space.sm,
    paddingRight: space.sm,
    selectors: {
      '&::placeholder': { color: color.textSubtle },
      '&:focus-visible': {
        outline: `2px solid ${color.focusRing}`,
        outlineOffset: '1px',
        borderColor: color.accent,
      },
      '&[aria-invalid="true"]': { borderColor: color.negative.border },
      '&:disabled': {
        opacity: 0.5,
        cursor: 'not-allowed',
        background: color.surface,
      },
    },
  },
  variants: {
    size: {
      sm: { height: controlHeight.sm },
      md: { height: controlHeight.md },
      lg: { height: controlHeight.lg },
    },
  },
  defaultVariants: { size: 'md' },
});
