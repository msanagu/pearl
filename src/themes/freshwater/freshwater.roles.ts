import type { ThemeRoles } from '@themes/roles';
import { freshwaterTreatments, freshwaterGlacier } from './freshwater.css';

/** Simple, non-CSS-var type treatments — same status as `pearlTypeTreatments`. */
export const freshwaterTypeTreatments = {
  accentText: { color: 'accent' },
} satisfies Record<string, unknown>;

type FreshwaterTreatmentName =
  | keyof typeof freshwaterTreatments
  | keyof typeof freshwaterTypeTreatments;

export const freshwaterRoles: ThemeRoles<FreshwaterTreatmentName> = {
  inlineEmphasis: {
    treatment: 'accentText',
    intent: 'Accent-colored text, undecorated — the theme\'s answer to italic serif elsewhere. Not underlined on purpose, so it reads distinctly from `Link`.',
    on: 'type',
    trigger: 'static',
    scope: ['inline'],
  },
  cardHover: {
    treatment: 'wash',
    intent: 'A left-to-right ice-blue tint fading to transparent, on hover only.',
    on: 'surface',
    trigger: 'hover',
    chroma: 'maximum',
    limitsByChroma: {
      maximum: { alpha: { max: 0.5 } },
    },
    guidance: ['Dark mode peak stop, composited over `surface`: `textSubtle` sits at 4.65:1 at this ceiling vs 4.22:1 (fails AA) one alpha step up.'],
  },
};

/** The nav wordmark. `underscoreColor` is `glacier[200]` — a graphical mark, so it can use the vivid ice-blue rather than `color.accent`'s text-safe deep step. */
export const freshwaterBrandWordmark = {
  text: 'FRESHWTR_OPS',
  role: undefined,
  underscoreColor: freshwaterGlacier[200],
};
