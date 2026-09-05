import { style } from '@vanilla-extract/css';
import { color, space, radius, text, fontFamily } from '@tokens';

// Matches `SiteHeader.css.ts`'s phone-width breakpoint, where this control
// sits in the header's wrapped, full-width actions row.
const SMALL = '(max-width: 640px)';

// Shared fixed height for select and modeToggle — select's box is otherwise
// font-metric-dependent while modeToggle is a fixed square, so they'd drift
// apart without an explicit height pinning both to the same number.
const CONTROL_HEIGHT = 32;

export const group = style({
  display: 'inline-flex',
  alignItems: 'center',
  gap: space.sm,
  '@media': {
    [SMALL]: { gap: space.xs },
  },
});

// No Select component yet — this is a token-styled native `<select>`, flagged
// the way the page flags its other gaps.
export const select = style({
  boxSizing: 'border-box',
  height: CONTROL_HEIGHT,
  appearance: 'none',
  border: `1px solid ${color.border}`,
  borderRadius: radius.control,
  cornerShape: radius.cornerShape,
  background: color.surface,
  color: color.text,
  fontFamily: fontFamily.body,
  fontSize: text.bodySm.fontSize,
  padding: `0 ${space.lg} 0 ${space.sm}`,
  cursor: 'pointer',
  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${color.focusRing}`,
      outlineOffset: '2px',
    },
  },
  '@media': {
    [SMALL]: {
      padding: `0 calc(${space.lg} * 0.75) 0 ${space.xs}`,
      fontSize: text.caption.fontSize,
    },
  },
});

// The mode toggle — square, same border/radius/background as `select` so the
// pair still reads as one control group, but sized to its icon rather than
// text (no `appearance`/caret padding to match).
export const modeToggle = style({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  boxSizing: 'border-box',
  width: CONTROL_HEIGHT,
  height: CONTROL_HEIGHT,
  flexShrink: 0,
  border: `1px solid ${color.border}`,
  borderRadius: radius.control,
  cornerShape: radius.cornerShape,
  background: color.surface,
  color: color.text,
  cursor: 'pointer',
  transition: 'border-color 200ms ease, box-shadow 200ms ease',
  selectors: {
    // Same hover treatment as `Button`'s `secondary` variant, for a
    // consistent feel with the other bordered control beside it.
    '&:hover': {
      borderColor: color.accent,
      boxShadow: `0 0 0 3px ${color.accentSubtle}`,
    },
    '&:focus-visible': {
      outline: `2px solid ${color.focusRing}`,
      outlineOffset: '2px',
    },
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': { transition: 'none' },
  },
});
