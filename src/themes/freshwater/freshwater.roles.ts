import type { ThemeRoles } from '@themes/roles';
import { freshwaterTreatments } from './freshwater.css';

type FreshwaterTreatmentName = keyof typeof freshwaterTreatments;

export const freshwaterRoles: ThemeRoles<FreshwaterTreatmentName> = {
  cardHover: {
    treatment: 'wash',
    intent: 'A left-to-right ice-blue tint fading to transparent, on hover only.',
    on: 'surface',
    trigger: 'hover',
    chroma: 'brand',
    source: '2a',
  },
};

/**
 * The nav wordmark — sourced from the theme's own 7a/7b exploration turns
 * ("Ice Console"), not fabricated. Plain, no `role`: the underscore's accent
 * color is a rendering choice specific to where this text is shown (see
 * `ThemeSpecimen.tsx`'s `accentUnderscore` flag), not part of the wordmark
 * data itself — `role` here only names one of `Text`'s three typography
 * roles (`inlineEmphasis`/`preheading`/`dataDigits`), and none of them is
 * "recolor one character."
 */
export const freshwaterBrandWordmark = {
  text: 'FRESHWTR_OPS',
  role: undefined,
};
