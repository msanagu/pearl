import type { ThemeRoles } from '@themes/roles';
import { freshwaterTreatments, freshwaterGlacier } from './freshwater.css';

/**
 * Simple, non-CSS-var type treatments — same status as `pearlTypeTreatments`
 * in `pearl.roles.ts`: a named recipe simple enough to live as plain data
 * rather than a real CSS custom property in `freshwaterTreatments`.
 */
export const freshwaterTypeTreatments = {
  // Replaces `wash` for `inlineEmphasis` below — a highlighter-style
  // background read too much like a stray browser text-selection artifact,
  // and reused the exact same gradient `cardHover` already uses for a
  // hover-triggered surface tint, with nothing distinguishing "this is
  // emphasis" from "this is hovered" as concepts. Plain `color.accent`
  // instead — no `text-decoration`, deliberately, so it can't be mistaken
  // for `Link`, which is underlined.
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
    chroma: 'brand',
    limitsByChroma: {
      // Dark mode's peak stop, composited over `surface`: `textSubtle` sits
      // at 4.65:1 at this ceiling vs 4.22:1 (fails AA) one alpha step up —
      // see `freshwaterGlacierAlpha` in freshwater.css.ts.
      brand: { alpha: { max: 0.5 } },
    },
    source: '2a',
  },
};

/**
 * The nav wordmark — sourced from the theme's own 7a/7b exploration turns
 * ("Ice Console"). `underscoreColor` is `glacier[200]`, the bright cyan step —
 * not `color.accent` (glacier's deep step, kept dark for text contrast): the
 * underscore is a graphical mark, not text, so it doesn't need to clear
 * text contrast ratios and can use the theme's actually-vivid ice-blue.
 */
export const freshwaterBrandWordmark = {
  text: 'FRESHWTR_OPS',
  role: undefined,
  underscoreColor: freshwaterGlacier[200],
};
