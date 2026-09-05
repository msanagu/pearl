import { style } from '@vanilla-extract/css';
import { color, controlHeight, fontFamily, radius, space, text } from '@tokens';

/**
 * Horizontal padding for the control's own text.
 *
 * A rounded corner occupies span `x ∈ [0, r]`; text starting inside that span
 * sits against the curve, reading cramped. So: clear the arc, `space.md` as
 * the floor. The floor does the work at ordinary radii (12px arc cleared by
 * 16px padding); radius only takes over once a control is round enough to
 * need the room. Every theme sits on the floor today — expected, not idling.
 *
 * Deliberately not mirrored by Field's label/hint/error, which sit flush at
 * zero — see Field.css.ts. Text inside a box is indented because it's inside
 * a box; nothing outside should copy that.
 */
const controlInset = `max(${space.md}, ${radius.control})`;

// Height maps to controlHeight so inputs align with Buttons in a row and
// respond to the density lever.
export const input = style({
  width: '100%',
  boxSizing: 'border-box',
  border: `1px solid ${color.border}`,
  borderRadius: radius.control,
  cornerShape: radius.cornerShape,
  background: color.surface,
  color: color.text,
  fontFamily: fontFamily.body,
  fontSize: text.bodyMd.fontSize,
  height: controlHeight.md,
  paddingLeft: controlInset,
  paddingRight: controlInset,
  transition: 'border-color 200ms ease, box-shadow 200ms ease',
  selectors: {
    '&::placeholder': { color: color.textSubtle },
    '&:focus-visible': {
      // Transparent outline — invisible normally, but what forced-colors
      // mode respects — plus box-shadow for the glow everywhere else.
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
});
