import { style } from '@vanilla-extract/css';
import { color, radius, space } from '../../tokens';

// Base styles stay SINGLE-selector (one class each) so downstream
// `[data-part]` overrides win on specificity without needing @layer
// (override-patterns.md / ADR-0003). A restrained inset highlight and tight
// silver-toned shadow distinguish the material plane without generic elevation.
export const card = style({
  display: 'flex',
  flexDirection: 'column',
  background: color.surface,
  border: `1px solid ${color.border}`,
  borderRadius: radius.surface,
  boxShadow: `inset 0 1px 0 ${color.surface}, 0 12px 28px -24px ${color.borderStrong}`,
  overflow: 'hidden',
});

export const cardHeader = style({
  padding: space.lg,
  borderBottom: `1px solid ${color.border}`,
});

export const cardBody = style({
  padding: space.lg,
});
