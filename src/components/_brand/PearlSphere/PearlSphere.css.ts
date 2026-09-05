import { keyframes, style } from '@vanilla-extract/css';
import { pearlTreatments } from '@themes/pearl/pearl.css';

/**
 * Ambient sweep — light travelling across the sphere's face.
 *
 * Drives `background-position` on the sheen layer, not `transform` on a
 * separate element — a translated overlay moves the highlight rigidly, while
 * shifting an oversized background slides the band across a body that stays
 * put, reading as light on a surface. Only the first layer moves; `center`
 * pins the nacre body underneath.
 */
const sweep = keyframes({
  '0%, 100%': {
    backgroundPosition: `${pearlTreatments.luster.sheenFrom}, center`,
  },
  '50%': { backgroundPosition: `${pearlTreatments.luster.sheenTo}, center` },
});

/**
 * Mount reveal: body surfacing. Blur and scale clearing together read as
 * rising through water into focus, not an image loading. Opacity finishes at
 * 45% so the last two-thirds is a felt settle; 1.02 overshoot stays below
 * bounce-threshold.
 *
 * 62%→100% settle carries its own gentler timing function — a single
 * expo-out easing would squeeze that final shrink into a sliver of real
 * time and read as a snap, so it gets its own ease-out instead.
 */
const emerge = keyframes({
  '0%': { opacity: 0, transform: 'scale(0.86)', filter: 'blur(14px)' },
  '45%': { opacity: 1 },
  '62%': {
    transform: 'scale(1.02)',
    filter: 'blur(0px)',
    animationTimingFunction: 'ease-out',
  },
  '100%': { transform: 'scale(1)', filter: 'blur(0px)' },
});

// Fluid, not a breakpoint swap — scales continuously to its 220px ceiling.
// 120px floor matches the old scale(0.72) mobile override (168 × 0.72 ≈ 121px).
export const sphereWrap = style({
  position: 'relative',
  width: 'clamp(120px, 20vw, 420px)',
  height: 'clamp(120px, 20vw, 420px)',
  // marginRight: ,
  flexShrink: 0,
});

/**
 * One element, two background layers: sheen band over the nacre body.
 *
 * Deliberately not a blended overlay child — a prior `mix-blend-mode:
 * soft-light` div washed three already-low-alpha hues into near-invisibility
 * against a pale body. The stops carry their own alpha; no blend mode needed.
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
 * Opt-in mount reveal for `body` — applied only where the sphere is the
 * first thing seen (the hero); SiteHeader's nav-scale mark renders at rest.
 * Composes `emerge` with the same `sweep` loop `body` already runs, so the
 * ambient animation isn't interrupted, just given a blurred entrance ahead of it.
 */
export const revealBody = style({
  animation: `${emerge} 1.15s cubic-bezier(0.22, 1, 0.36, 1) both, ${sweep} ${pearlTreatments.luster.orbSpeed} ease-in-out infinite`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none' },
  },
});

/**
 * Contact shadow beneath the sphere — own element, never animated.
 * Percentage-sized against `sphereWrap` (a square), so it scales with the
 * sphere without its own breakpoint — theme overrides (Freshwater) do the
 * same in percentages, not px.
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
