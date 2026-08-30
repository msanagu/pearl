import { style } from '@vanilla-extract/css';
import { color, space, radius, text, fontFamily } from '@tokens';

export const group = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: space.sm,
});

// No Select component yet — this is a token-styled native `<select>`, flagged
// the way the page flags its other gaps.
export const select = style({
  appearance: 'none',
  border: `1px solid ${color.border}`,
  borderRadius: radius.control,
  cornerShape: radius.cornerShape,
  background: color.surface,
  color: color.text,
  fontFamily: fontFamily.body,
  fontSize: text.bodySm.fontSize,
  padding: `${space.xs} ${space.lg} ${space.xs} ${space.sm}`,
  cursor: 'pointer',
  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${color.focusRing}`,
      outlineOffset: '2px',
    },
  },
});
