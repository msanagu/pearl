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
  borderRadius: radius.full,
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
