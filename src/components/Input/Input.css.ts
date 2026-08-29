import { style } from '@vanilla-extract/css';
import { color, controlHeight, fontFamily, radius, space, text } from '@tokens';

/**
 * Horizontal padding for the control's own text.
 *
 * A rounded corner occupies the horizontal span `x ∈ [0, r]`; text starting
 * inside that span sits alongside the curve rather than the straight edge,
 * which reads as cramped. So: clear the arc, with `space.md` as the floor.
 *
 * The floor does the work at ordinary radii — a 12px arc is already cleared by
 * 16px of padding — and the radius only takes over once a control is round
 * enough to genuinely need the room (a pill at Pearl's 42px height would reach
 * 21px on its own). Every theme sits on the floor today; that is the formula
 * behaving correctly, not idling.
 *
 * Deliberately NOT mirrored by `Field`'s label/hint/error, which sit flush at
 * zero — see the note in `Field.css.ts`. Text inside a box is indented because
 * it is inside a box; nothing outside the box should copy that number.
 */
const controlInset = `max(${space.md}, ${radius.control})`;

// Height maps to `controlHeight` so inputs align with Buttons in a row and
// respond to the density lever. State styling (focus/invalid/disabled) lives on
// self-selectors — a state legitimately outranking a base override is expected.
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
});
