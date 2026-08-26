import { style } from '@vanilla-extract/css';
import { color, radius, space } from '../../tokens';

// Base styles stay SINGLE-selector (one class each) so downstream
// `[data-part]` overrides win on specificity without needing @layer
// (override-patterns.md / ADR-0003). A restrained inset highlight and tight
// silver-toned shadow distinguish the material plane without generic elevation.
//
// The elevation shadow is a genuine CONTACT shadow (blur < 16px) rather than a
// wide diffuse one: a hairline border paired with a wide, soft shadow is a
// generated-UI tell, and it also contradicted this file's own "tight" intent.
// Keeping the border + inset highlight + a tight shadow reads as a defined
// material plane, not generic elevation.
export const card = style({
  display: 'flex',
  flexDirection: 'column',
  background: color.surface,
  border: `1px solid ${color.border}`,
  borderRadius: radius.surface,
  boxShadow: `inset 0 1px 0 ${color.surface}, 0 6px 12px -10px ${color.borderStrong}`,
  overflow: 'hidden',
});

// House hover idiom for a link-card (rule 4 of ADR-0007: idioms cascade —
// every interactive surface gets feedback even where no theme adds more).
// `position: relative` + `overflow: hidden` here (not on `card`) is what
// gives a theme's `::after` glow somewhere to anchor, without paying for a
// stacking context on the far more common non-interactive card.
export const cardInteractive = style({
  position: 'relative',
  overflow: 'hidden',
  textDecoration: 'none',
  color: 'inherit',
  cursor: 'pointer',
  transition: 'transform 200ms ease, border-color 200ms ease',
  selectors: {
    '&:hover': {
      borderColor: color.borderStrong,
      transform: 'translateY(-2px)',
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

export const cardHeader = style({
  padding: space.lg,
  borderBottom: `1px solid ${color.border}`,
});

export const cardBody = style({
  padding: space.lg,
});
