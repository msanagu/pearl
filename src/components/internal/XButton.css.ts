import { style } from '@vanilla-extract/css';
import { color, radius } from '../../tokens';

// 24×24 hit target (WCAG 2.5.8) around a 16px glyph — visual size and touch
// target are deliberately different numbers, not the same one. Neutral
// (`textSubtle`) at rest, not variant/accent-colored: this is chrome, not
// message content, so it shouldn't compete with whatever sentiment icon it
// sits next to. Hover/focus background is `color.overlaySubtle` — a wash
// that composites over whatever surface this sits on (four different
// sentiment tints in Alert alone), not a fixed accent tint.
export const xButton = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  flexShrink: 0,
  width: '24px',
  height: '24px',
  // `control`, not `full`. This sits INSIDE an Alert, so it is a nested control
  // and takes the inner radius like every other one — `full` is reserved for
  // elements that are circles by nature (dots, radios, avatars), not for
  // anything that merely happens to be square. At 24x24 a 12px `control` is
  // already 50%, so on Pearl it stays a circle regardless; on a hard-edged theme
  // it now squares off with the rest of the controls instead of being the one
  // round thing in the corner.
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
