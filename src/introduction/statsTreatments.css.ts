import { style, globalStyle, keyframes } from '@vanilla-extract/css';
import { pearlTreatments, pearlDarkThemeClass, pearlDarkLusterGradient } from '@themes/pearl/pearl.css';
import { tahitianTreatments } from '@themes/tahitian/tahitian.css';
import { freshwaterTreatments, freshwaterDarkThemeClass } from '@themes/freshwater/freshwater.css';

/**
 * A product-team extensibility demo, not a new canon role: each theme's own
 * effect treatment (`luster`/`overtone`/`wash`), reused here exactly as
 * exported and applied ambiently to a plain stats card that is neither a
 * link nor a photographic plate — the two contexts those treatments
 * actually ship on elsewhere. South Sea has no such export and gets no
 * class here; a themeless card is the honest answer, not a fabricated one
 * (see docs/decisions/0007-treatments-and-roles.md rule 1).
 */

export const statsPearl = style({
  position: 'relative',
  overflow: 'hidden',
  isolation: 'isolate',
});
globalStyle(`${statsPearl}::after`, {
  content: '',
  position: 'absolute',
  zIndex: -1,
  inset: pearlTreatments.luster.driftInset,
  background: pearlTreatments.luster.driftGradient,
  // Half the hover-settled opacity: full strength, ambient (always on)
  // rather than transient, drops `textSubtle` on the composited peak to
  // 4.25:1 against the label text — below the 4.5:1 AA floor. Half keeps it
  // above 4.5 with margin.
  opacity: `calc(${pearlTreatments.luster.driftOpacity} * 0.5)`,
  pointerEvents: 'none',
});
globalStyle(`${pearlDarkThemeClass} ${statsPearl}::after`, {
  background: pearlDarkLusterGradient,
});

const statsOvertoneShift = keyframes({
  '0%, 100%': { backgroundPosition: tahitianTreatments.overtone.plateFrom },
  '50%': { backgroundPosition: tahitianTreatments.overtone.plateTo },
});
export const statsTahitian = style({
  position: 'relative',
  overflow: 'hidden',
  isolation: 'isolate',
});
globalStyle(`${statsTahitian}::after`, {
  content: '',
  position: 'absolute',
  zIndex: -1,
  inset: 0,
  background: tahitianTreatments.overtone.plateGradient,
  backgroundSize: '220% 100%',
  backgroundPosition: tahitianTreatments.overtone.plateFrom,
  mixBlendMode: 'screen',
  pointerEvents: 'none',
  animation: `${statsOvertoneShift} ${tahitianTreatments.overtone.plateSpeed} ease-in-out infinite`,
  '@media': { '(prefers-reduced-motion: reduce)': { animation: 'none' } },
});

export const statsFreshwater = style({
  position: 'relative',
  overflow: 'hidden',
  isolation: 'isolate',
});
globalStyle(`${statsFreshwater}::after`, {
  content: '',
  position: 'absolute',
  zIndex: -1,
  inset: 0,
  background: freshwaterTreatments.wash.gradient,
  pointerEvents: 'none',
});
globalStyle(`${freshwaterDarkThemeClass} ${statsFreshwater}::after`, {
  background: freshwaterTreatments.wash.gradientDark,
});
