import { keyframes, style } from '@vanilla-extract/css';
import { pearlTreatments } from '@themes/pearl/pearl.css';

/**
 * The ambient sweep — light travelling across the sphere's face.
 *
 * Drives `background-position` on the sheen LAYER, not `transform` on a
 * separate element. That is the mechanic in the canonized reference
 * (`design/Pearl Directions.dc.html`, `dvOrb`),
 * and the distinction is load-bearing: a translated overlay moves the whole
 * highlight rigidly, while shifting an oversized background slides the band
 * across a body that stays put — which is what reads as light on a surface.
 *
 * Only the first layer moves; `center` pins the nacre body underneath.
 * `9s ease-in-out infinite` matches `orbSpeed`.
 */
const sweep = keyframes({
  '0%, 100%': { backgroundPosition: `${pearlTreatments.luster.sheenFrom}, center` },
  '50%': { backgroundPosition: `${pearlTreatments.luster.sheenTo}, center` },
});

export const sphereWrap = style({
  position: 'relative',
  width: 168,
  height: 168,
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

/** Contact shadow beneath the sphere — its own element, never animated. */
export const contact = style({
  position: 'absolute',
  left: '50%',
  bottom: '-10px',
  width: 130,
  height: 16,
  borderRadius: '50%',
  transform: 'translateX(-50%)',
  background: pearlTreatments.luster.contactShadow,
  pointerEvents: 'none',
});
