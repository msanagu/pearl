import { style } from '@vanilla-extract/css';
import { color, space } from '@tokens';

// Controls sit on the heading row so they read as belonging to the track they
// scroll, not as loose chrome below it.
export const header = style({
  marginBottom: space.lg,
});

export const heading = style({
  margin: 0,
});

export const controls = style({
  display: 'flex',
  gap: space.sm,
  flexShrink: 0,
});

export const viewport = style({
  position: 'relative',
});

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
  // The edge fades and the controls carry the scroll affordance; a raw UA
  // scrollbar under the cards reads as chrome the rest of the page doesn't have.
  scrollbarWidth: 'none',
  selectors: {
    '&::-webkit-scrollbar': { display: 'none' },
    // The track is focusable (it scrolls), so it needs the same ring every
    // other focusable in the system gets.
    '&:focus-visible': {
      outline: `2px solid ${color.focusRing}`,
      outlineOffset: '2px',
    },
  },
  '@media': {
    // Also covers scrollBy(), which defers to this when given no behavior.
    '(prefers-reduced-motion: reduce)': { scrollBehavior: 'auto' },
  },
});

// rem, not px: a fixed-px card stops growing when a user raises their base
// font-size, and the text inside it doesn't. Same rule as the space tokens.
export const item = style({
  flex: '0 0 16rem',
  scrollSnapAlign: 'start',
});

// Softens the card the track cuts, so a clipped edge reads as "more this way"
// rather than as a layout mistake. Opacity is state-driven from the live scroll
// position (see Carousel.tsx), so it stays inline rather than in a variant here.
const fade = style({
  position: 'absolute',
  top: 0,
  bottom: 0,
  width: space['2xl'],
  pointerEvents: 'none',
  transition: 'opacity 200ms ease',
  '@media': {
    '(prefers-reduced-motion: reduce)': { transition: 'none' },
  },
});

export const fadeStart = style([
  fade,
  {
    left: 0,
    background: `linear-gradient(to right, ${color.background}, transparent)`,
  },
]);

export const fadeEnd = style([
  fade,
  {
    right: 0,
    background: `linear-gradient(to left, ${color.background}, transparent)`,
  },
]);
