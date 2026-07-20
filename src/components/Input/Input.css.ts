import { recipe } from '@vanilla-extract/recipes';
import { fallbackVar } from '@vanilla-extract/css';
import { color, controlHeight, fontFamily, radius, space, text } from '../../tokens';
import { fieldControlHeight, fieldPaddingX } from '../Field/fieldSize.css';

// Height maps to `controlHeight` so inputs align with Buttons in a row and
// respond to the density lever. State styling (focus/invalid/disabled) lives on
// self-selectors — a state legitimately outranking a base override is expected.
//
// height/paddingX prefer `Field`'s cascaded CSS vars (set when this Input is
// nested inside a sized `Field`) and fall back to this own `size` variant's
// token when used standalone. sm and md share padding on purpose — only lg
// steps up — matching `Field`'s own scheme.
export const input = recipe({
  base: {
    width: '100%',
    boxSizing: 'border-box',
    border: `1px solid ${color.border}`,
    borderRadius: radius.control,
    background: color.surface,
    color: color.text,
    fontFamily: fontFamily.body,
    fontSize: text.bodyMd.fontSize,
    transition: 'border-color 200ms ease, box-shadow 200ms ease',
    selectors: {
      '&::placeholder': { color: color.textSubtle },
      '&:focus-visible': {
        // A transparent `outline` (invisible in normal rendering, but the
        // one thing forced-colors/high-contrast mode respects) plus a soft
        // `box-shadow` ring for the visual glow everywhere else — box-shadow
        // alone would leave forced-colors users with no focus indicator.
        outline: '2px solid transparent',
        outlineOffset: '2px',
        borderColor: color.accent,
        boxShadow: `0 0 0 3px ${color.focusRing}`,
      },
      '&[aria-invalid="true"]': { borderColor: color.negative.border },
      '&:disabled': {
        opacity: 0.5,
        cursor: 'not-allowed',
        background: color.surface,
      },
    },
    '@media': {
      '(prefers-reduced-motion: reduce)': { transition: 'none' },
    },
  },
  variants: {
    size: {
      sm: {
        height: fallbackVar(fieldControlHeight, controlHeight.sm),
        paddingLeft: fallbackVar(fieldPaddingX, space.md),
        paddingRight: fallbackVar(fieldPaddingX, space.md),
      },
      md: {
        height: fallbackVar(fieldControlHeight, controlHeight.md),
        paddingLeft: fallbackVar(fieldPaddingX, space.md),
        paddingRight: fallbackVar(fieldPaddingX, space.md),
      },
      lg: {
        height: fallbackVar(fieldControlHeight, controlHeight.lg),
        paddingLeft: fallbackVar(fieldPaddingX, space.lg),
        paddingRight: fallbackVar(fieldPaddingX, space.lg),
      },
    },
  },
  defaultVariants: { size: 'md' },
});
