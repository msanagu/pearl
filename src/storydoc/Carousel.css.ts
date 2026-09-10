import { style } from '@vanilla-extract/css';
import { space } from '@tokens';

export const track = style({
  display: 'flex',
  gap: space.md,
  overflowX: 'auto',
  scrollSnapType: 'x mandatory',
  scrollBehavior: 'smooth',
  // overflowX forces the y-axis non-visible too, clipping cardInteractive's
  // hover translateY(-2px) — pad top to give it room.
  paddingTop: space.xs,
  paddingBottom: space.xs,
});

export const item = style({
  flex: '0 0 260px',
  scrollSnapAlign: 'start',
});

export const controls = style({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: space.sm,
  marginTop: space.sm,
});
