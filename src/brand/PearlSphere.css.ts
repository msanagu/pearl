import { keyframes, style } from '@vanilla-extract/css';
import { pearlCapabilities } from '../themes/pearl.css';

// Ambient sweep — light drifting across the sphere's surface. Shares its
// angle and hue stops with the Card hover glow (pearl.css.ts) — same "sweep
// angle, shared by sphere / rule / surface drift" token, different trigger
// (this one loops; Card's is a one-pass hover per pearl.assignment.ts's
// luster guidance: "the sphere loops; cards do not").
const sweep = keyframes({
  '0%': { transform: 'translate3d(-8%, -6%, 0) rotate(0deg)' },
  '100%': { transform: 'translate3d(8%, 6%, 0) rotate(6deg)' },
});

export const sphereWrap = style({
  position: 'relative',
  width: 160,
  height: 160,
  flexShrink: 0,
});

export const body = style({
  position: 'absolute',
  inset: 0,
  borderRadius: '50%',
  overflow: 'hidden',
  background: pearlCapabilities.luster.bodyGradient,
  boxShadow: pearlCapabilities.luster.bodyShadow,
});

export const sheen = style({
  position: 'absolute',
  inset: '-30%',
  background: `linear-gradient(${pearlCapabilities.luster.angle}, ${pearlCapabilities.luster.seaGreen}, ${pearlCapabilities.luster.periwinkle}, ${pearlCapabilities.luster.blush})`,
  mixBlendMode: 'soft-light',
  animation: `${sweep} ${pearlCapabilities.luster.orbSpeed} ease-in-out infinite alternate`,
  '@media': {
    '(prefers-reduced-motion: reduce)': { animation: 'none' },
  },
});

export const contact = style({
  position: 'absolute',
  left: '50%',
  bottom: '-18px',
  width: '70%',
  height: '28px',
  transform: 'translateX(-50%)',
  background: pearlCapabilities.luster.contactShadow,
  pointerEvents: 'none',
});
