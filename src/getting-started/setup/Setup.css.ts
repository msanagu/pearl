import { style } from '@vanilla-extract/css';
import { color, radius, space } from '@tokens';

// data-inverse code sample. Same shape as Docs.tsx's block: control radius,
// lg padding, horizontal scroll for long lines instead of wrapping.
export const codeBlock = style({
  borderRadius: radius.control,
  cornerShape: radius.cornerShape,
  padding: space.lg,
  overflowX: 'auto',
  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${color.focusRing}`,
      outlineOffset: '2px',
    },
  },
});
