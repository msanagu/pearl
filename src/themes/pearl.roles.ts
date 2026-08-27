import type { ThemeRoles } from './roles';
import { pearlFonts, pearlTreatments } from './pearl.css';

/**
 * One-line disposition — not copywriting, how the theme feels. Feeds the
 * planned Theme/Overview docs page as the intro line.
 */
export const pearlDescription =
  'Comfortable, restrained premium. Reads like a well-set book page that happens to have buttons; an italic serif interjection is the only flourish.';

/**
 * Pearl's own catalog of typography treatments — named recipes, same status
 * as `luster` in `pearlTreatments`, just simple enough to live as plain data
 * here instead of becoming real CSS custom properties. Exported: a role only
 * names *which* treatment it uses (`pearlRoles.inlineEmphasis.treatment ===
 * 'serifItalic'`) — resolving that name to the actual fontFamily/fontStyle
 * means looking it up here.
 */
export const pearlTypeTreatments = {
  serifItalic: { fontFamily: pearlFonts.serif, fontStyle: 'italic' as const },
  monoCapsTracked: { fontFamily: pearlFonts.mono, case: 'upper' as const, tracking: '0.12em' },
  monoTabular: { fontFamily: pearlFonts.mono, tabularFigures: true },
} satisfies Record<string, unknown>;

type PearlTreatmentName = keyof typeof pearlTypeTreatments | keyof typeof pearlTreatments;

/**
 * Pearl's role table — which treatment fulfills each named job/context.
 *
 * Never becomes CSS. Read by the planned MCP/RAG corpus, the planned
 * no-raw-value lint rule, and generated documentation. The three `luster`
 * roles below (`cardHover`, `brandSphere`, `hairlineRule`) replace what used
 * to be an anonymous `applications` array — same information, but each
 * context now has a real, addressable name instead of a position + comment.
 */
export const pearlRoles: ThemeRoles<PearlTreatmentName> = {
  // --- Typography roles — Text's `role` prop accepts exactly these three ---
  inlineEmphasis: {
    treatment: 'serifItalic',
    intent: 'The face carrying rare emphasis — pull quotes, inline interjections.',
    scope: ['inline', 'wordmark'],
    // No `size` — inline emphasis rides whatever variant it's set in.
  },
  preheading: {
    treatment: 'monoCapsTracked',
    intent: 'The short line above a heading, and standalone labels/IDs/metadata.',
    size: 'caption',
  },
  dataDigits: {
    treatment: 'monoTabular',
    intent: 'The face carrying tabular data — table cells, counters, form values.',
  },

  // --- Luster's roles — one treatment, three contexts ---
  brandSphere: {
    treatment: 'luster',
    intent: 'Nacre made literal — light moving across the brand object.',
    on: 'brandObject',
    trigger: 'ambient',
    chroma: 'brand',
    forbid: ['type', 'control'],
    limits: {
      /** Three hues maximum — replaces the handoff's "never rainbow" rule. */
      hues: { max: 3 },
    },
    limitsByChroma: {
      /** The brand object reads at full declared intensity — the sphere's
       * periwinkle stop sits exactly at this ceiling. */
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
