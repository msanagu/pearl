import type { ThemeRoles } from '@themes/roles';
import { pearlFonts, pearlTreatments } from './pearl.css';

/** One-line disposition — how the theme feels, not copywriting. */
export const pearlDescription =
  'Comfortable, restrained premium. Reads like a well-set book page that happens to have buttons; an italic serif interjection is the only flourish.';

/** The nav wordmark — text plus which typography role (if any) decorates it. */
export const pearlBrandWordmark = {
  text: 'pearl',
  role: 'inlineEmphasis' as const,
};

/** Pearl's own catalog of typography treatments — named recipes, same status as `luster`. */
export const pearlTypeTreatments = {
  serifItalic: { fontFamily: pearlFonts.serif, fontStyle: 'italic' as const },
  sansSentence: { fontFamily: pearlFonts.sans },
  monoTabular: { fontFamily: pearlFonts.mono, tabularFigures: true, letterSpacing: '-0.05em' },
} satisfies Record<string, unknown>;

type PearlTreatmentName = keyof typeof pearlTypeTreatments | keyof typeof pearlTreatments;

/** Pearl's role table — which treatment fulfills each named job/context. Never becomes CSS. */
export const pearlRoles: ThemeRoles<PearlTreatmentName> = {
  inlineEmphasis: {
    treatment: 'serifItalic',
    intent: 'The face carrying rare emphasis — pull quotes, inline interjections.',
    scope: ['inline', 'wordmark'],
  },
  preheading: {
    treatment: 'sansSentence',
    intent: 'The short line above a heading, and standalone labels/IDs/metadata.',
    size: 'caption',
  },
  dataDigits: {
    treatment: 'monoTabular',
    intent: 'The face carrying tabular data — table cells, counters, form values.',
  },

  brandSphere: {
    treatment: 'luster',
    intent: 'Nacre made literal — light moving across the brand object.',
    on: 'brandObject',
    trigger: 'ambient',
    chroma: 'brand',
    forbid: ['type', 'control'],
    limits: {
      hues: { max: 3 },
    },
    limitsByChroma: {
      brand: { alpha: { max: 0.5 } },
    },
    guidance: [
      'Luster is material, not typography — it lights a surface, never letterforms.',
      'The sphere loops; cards do not. A card that animates unprompted is off-theme.',
    ],
    source: '4c',
  },
  hairlineRule: {
    treatment: 'luster',
    intent: 'The one other surface allowed to carry ambient luster, at a lower ceiling than the brand object.',
    on: 'border',
    trigger: 'ambient',
    chroma: 'desaturated',
    limitsByChroma: {
      desaturated: { alpha: { max: 0.42 } },
    },
    guidance: [
      'Never more than one lustered surface in view at rest — ambient luster belongs to the brand object and this rule; everything else waits for hover.',
      "This role's ceiling is not machine-checkable the way the card's is: the rule is painted in opaque hex, not a translucent overlay, so its restraint comes from choosing already-desaturated stops (silver/marine/seagreen pastels), not from an alpha value.",
    ],
    source: '4c',
  },
  cardHover: {
    treatment: 'luster',
    intent: 'A single quiet drift pass on hover — never ambient, never louder than the two roles above.',
    on: 'surface',
    trigger: 'hover',
    chroma: 'desaturated',
    limitsByChroma: {
      desaturated: { alpha: { max: 0.42 } },
    },
    source: '4c',
  },
};
