import type { ThemeAssignments } from './assignment';
import { pearlFonts, pearlCapabilities } from './pearl.css';

/**
 * Pearl's assignment record — what its capabilities MEAN.
 *
 * Never becomes CSS. Read by the planned MCP/RAG corpus, the planned
 * no-raw-value lint rule, and generated documentation.
 *
 * The `satisfies` below is load-bearing: `ThemeAssignments<typeof pearlLuster>`
 * requires an assignment for every declared capability and rejects assignments
 * for capabilities that do not exist (rule 5 of
 * `docs/decisions/0007-capabilities-and-assignments.md`).
 */
export const pearlAssignments = {
  mood: 'Comfortable, quietly premium. Reads like a well-set book page that happens to have buttons; an italic serif interjection is the only flourish.',

  axes: {
    density: 'comfortable',
    displayScale: 'product-md',
    accentBudget: 'quiet-work-no-fills',
    hoverBehavior: 'lift-and-shadow',
    imagery: 'soft-neutral',
    labelTreatment: 'mono-caps',
    alignment: 'baseline-drift',
  },

  // How Pearl assigns its type primitives to jobs. These are NOT canon slots —
  // role assignment is itself a theme distinction, so it lives here rather than
  // in `fontFamily`. See docs/theme-revision-decisions.md §8.
  roles: {
    typography: {
      inlineEmphasis: {
        fontFamily: pearlFonts.serif,
        fontStyle: 'italic',
        scope: ['inline', 'wordmark'],
        // No `size` — inline emphasis rides whatever variant it's set in.
      },
      preheading: {
        fontFamily: pearlFonts.mono,
        size: 'caption',
        case: 'upper',
        tracking: '0.12em',
      },
      dataDigits: {
        fontFamily: pearlFonts.mono,
        tabularFigures: true,
      },
    },
  },

  luster: {
    intent: 'Nacre made literal — light moving across a pearl surface.',
    applications: [
      { on: 'brandObject', trigger: 'ambient', chroma: 'brand' }, // the sphere, orbSpeed
      { on: 'border', trigger: 'ambient', chroma: 'quiet' }, // the hairline rule, ruleSpeed
      { on: 'surface', trigger: 'hover', chroma: 'quiet' }, // card drift, one pass
    ],
    forbid: ['type', 'control'],
    limits: {
      /** Three hues maximum — replaces the handoff's "never rainbow" rule. */
      hues: { max: 3 },
    },
    limitsByChroma: {
      /** The brand object reads at full declared intensity — the sphere's
       * periwinkle stop sits exactly at this ceiling. */
      brand: { alpha: { max: 0.42 } },
      /** UI doing quiet work stays well under the brand ceiling. Governs
       * alpha-composited overlays specifically (the card's hover glow) —
       * the hairline rule has no alpha channel to check against this number;
       * see guidance below for how its restraint is actually achieved. */
      quiet: { alpha: { max: 0.3 } },
    },
    guidance: [
      'Luster is material, not typography — it lights a surface, never letterforms.',
      'Never more than one lustered surface in view at rest. Ambient luster belongs to the brand object and the rule; everything else waits for hover.',
      'The sphere loops; cards do not. A card that animates unprompted is off-theme.',
      "The hairline rule's quiet ceiling is not machine-checkable the way the card's is: the rule is painted in opaque hex, not a translucent overlay, so its restraint comes from choosing already-desaturated stops (silver/marine/seagreen pastels), not from an alpha value.",
    ],
    source: '4c',
  },
} satisfies ThemeAssignments<typeof pearlCapabilities>;
