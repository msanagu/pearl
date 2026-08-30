import { keyframes, style } from '@vanilla-extract/css';
import { pearlTreatments } from '@themes/pearl/pearl.css';

/**
 * The ambient sweep — light travelling across the sphere's face.
 *
 * Drives `background-position` on the sheen layer, not `transform` on a
 * separate element — the distinction is load-bearing: a translated overlay
 * moves the whole highlight rigidly, while shifting an oversized background
 * slides the band across a body that stays put, which is what reads as light
 * on a surface.
 *
 * Only the first layer moves; `center` pins the nacre body underneath.
 * `9s ease-in-out infinite` matches `orbSpeed`.
 */
const sweep = keyframes({
  '0%, 100%': {
    backgroundPosition: `${pearlTreatments.luster.sheenFrom}, center`,
  },
  '50%': { backgroundPosition: `${pearlTreatments.luster.sheenTo}, center` },
});

// Fluid, not a single breakpoint swap — scales continuously from mobile up
// to its 220px ceiling, so there's no hard jump at any viewport width. The
// 120px floor matches what the old `scale(0.72)` mobile override produced
// (168 × 0.72 ≈ 121px), so small screens read the same as before.
export const sphereWrap = style({
  position: 'relative',
  width: 'clamp(120px, 20vw, 420px)',
  height: 'clamp(120px, 20vw, 420px)',
  // marginRight: ,
  flexShrink: 0,
});

/**
 * One element, two background layers: the sheen band over the nacre body.
 *
 * Deliberately NOT a blended overlay child. The previous implementation put a
 * `mix-blend-mode: soft-light` div on top, which washed three already-low-alpha
 * hues into near-invisibility against a pale body. The stops carry their own
 * alpha; they composite normally and need no blend mode.
 */
export const body = style({
  position: 'absolute',
  inset: 0,
  borderRadius: '50%',
  backgroundImage: `${pearlTreatments.luster.sheenBand}, ${pearlTreatments.luster.bodyGradient}`,
  backgroundRepeat: 'no-repeat, no-repeat',
  backgroundSize: `${pearlTreatments.luster.sheenSize}, 100% 100%`,
  backgroundPosition: `${pearlTreatments.luster.sheenFrom}, center`,
  boxShadow: pearlTreatments.luster.bodyShadow,
  animation: `${sweep} ${pearlTreatments.luster.orbSpeed} ease-in-out infinite`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none' },
  },
});

/**
 * Contact shadow beneath the sphere — its own element, never animated.
 * Percentage-sized against `sphereWrap` (a square), so it scales with the
 * sphere instead of needing its own breakpoint — theme overrides that resize
 * or reposition this (Freshwater) do the same in percentages, not px.
 */
export const contact = style({
  position: 'absolute',
  left: '50%',
  bottom: '-6%',
  width: '77%',
  height: '9.5%',
  borderRadius: '50%',
  transform: 'translateX(-50%)',
  background: pearlTreatments.luster.contactShadow,
  pointerEvents: 'none',
});
