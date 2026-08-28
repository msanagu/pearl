import type { ThemeRoles } from './roles';
import { southSeaFonts } from './south-sea.css';

/**
 * One-line disposition — feeds the planned Theme/Overview docs page intro.
 */
export const southSeaDescription =
  'Golden-hour maison restraint: a roman/italic serif mix and a hairline rule do the talking; conch does exactly one loud thing per view.';

/** The nav wordmark — text plus which typography role (if any) decorates it. */
export const southSeaBrandWordmark = {
  text: 'south sea',
  role: 'inlineEmphasis' as const,
};

/**
 * South Sea's own catalog of typography treatments. No effect treatments —
 * per docs/theme/theme-revision-decisions.md §5, the Theme Contract's
 * "champagne luster" is fabricated and deliberately not carried forward.
 * South Sea's identity is type, space, and restraint, not a lit surface.
 */
export const southSeaTypeTreatments = {
  serifItalic: { fontFamily: southSeaFonts.serif, fontStyle: 'italic' as const },
  /** The `/ LABEL /` slash-wrapped caption idiom — sentence-tracked roman
   * serif, not mono: South Sea has no mono idiom (ADR-0007 rule 1 — honestly
   * aliasing rather than fabricating one). */
  slashLabel: { fontFamily: southSeaFonts.serif, case: 'upper' as const, tracking: '0.2em' },
  /** The plain body sans — what `dataDigits` honestly aliases to, since no
   * dedicated tabular/mono face exists in this theme. */
  sansBody: { fontFamily: southSeaFonts.sans },
} satisfies Record<string, unknown>;

type SouthSeaTreatmentName = keyof typeof southSeaTypeTreatments;

/**
 * South Sea's role table — which treatment fulfills each named typography
 * job. `dataDigits` has no dedicated face here (no mono primitive exists for
 * this theme) — it honestly aliases to the roman serif rather than
 * fabricating a tabular treatment that isn't part of the maison identity.
 */
export const southSeaRoles: ThemeRoles<SouthSeaTreatmentName> = {
  inlineEmphasis: {
    treatment: 'serifItalic',
    intent: 'The roman/italic serif mix — pull quotes, inline interjections, the hairline-gapped heading pairing.',
    scope: ['inline', 'heading'],
    source: '1g',
  },
  preheading: {
    treatment: 'slashLabel',
    intent: 'The `/ LABEL /` slash-wrapped caption — standalone labels/IDs/metadata.',
    size: 'caption',
    source: '3c',
  },
  dataDigits: {
    treatment: 'sansBody',
    intent: 'No dedicated tabular face exists yet — honestly aliases to the body sans rather than fabricating a tabular treatment.',
  },
};
