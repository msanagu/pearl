import { style } from '@vanilla-extract/css';
import { color, radius } from '@tokens';

// 24×24 hit target (WCAG 2.5.8) around a 16px glyph — deliberately different
// numbers. Neutral (textSubtle) at rest, not accent-colored: this is chrome,
// shouldn't compete with the sentiment icon it sits next to. Hover/focus
// background is overlaySubtle — a wash that composites over any surface,
// not a fixed accent tint.
export const xButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: '24px',
  height: '24px',
  // control, not full — nested inside Alert, takes the inner radius like any
  // other control; full is reserved for circles-by-nature (dots, avatars).
  // At 24×24 a 12px control is already 50%, so it stays circular on Pearl
  // but squares off on a hard-edged theme instead of standing out alone.
  borderRadius: radius.control,
  cornerShape: radius.cornerShape,
  background: 'transparent',
  border: 'none',
  padding: 0,
  color: color.textSubtle,
  cursor: 'pointer',
  selectors: {
    '&:hover': { background: color.overlaySubtle },
    '&:focus-visible': {
      background: color.overlaySubtle,
      outline: `2px solid ${color.focusRing}`,
      outlineOffset: '2px',
    },
  },
});
