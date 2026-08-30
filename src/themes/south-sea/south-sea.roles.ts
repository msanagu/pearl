import type { ThemeRoles } from '@themes/roles';
import { southSeaFonts } from './south-sea.css';

/**
 * One-line disposition — feeds the planned Theme/Overview docs page intro.
 */
export const southSeaDescription =
  'Golden-hour maison restraint: a roman/italic serif mix and a hairline rule do the talking; conch does exactly one loud thing per view.';

/** The nav wordmark — text plus which typography role (if any) decorates it. */
// Sentence case ("South Sea"), not the all-lowercase "south sea" the
// wordmark carried before — matches the design reference's own logotype
// (frames 11b/13a).
export const southSeaBrandWordmark = {
  text: 'South Sea',
  role: 'inlineEmphasis' as const,
};

/**
 * South Sea's own catalog of typography treatments. No AMBIENT effect
 * treatments — per docs/theme/theme-revision-decisions.md §5, the Theme
 * Contract's generic "champagne luster" is fabricated and deliberately not
 * carried forward. South Sea's identity is type, space, and restraint, not a
 * lit surface at rest. The one exception — a hover-only golden-hour sphere
 * from exploration turn 9c, dark mode only — lives in `south-sea.css.ts`
 * as a `PearlSphere` override, not a typography role.
 */
export const southSeaTypeTreatments = {
  // Plain accent-colored text, no font/style change — replaces `serifItalic`
  // as `inlineEmphasis`'s treatment (2026-08-29, same call as Freshwater's
  // `wash` → accent-text swap). `serifItalic` itself is gone from this
  // catalog, not left orphaned: nothing else in the role table referenced
  // it (only `inlineEmphasis` did), and `southSeaFonts.serifItalic` — the
  // underlying font token — is still used directly by the theme-wide body
  // italic rule in `south-sea.css.ts`, which was never role-gated to begin
  // with. Verified against both background and surface, both modes, before
  // using accent as text color: light 4.90:1/4.53:1, dark 8.18:1/7.49:1.
  accentText: { color: 'accent' },
  /** The `/ LABEL /` slash-wrapped caption idiom — all-caps General Sans at
   * an airy tracking, not the serif: a maison identity still wants its
   * micro-labels legible and quiet, and Zodiak's italic-leaning roman reads
   * cramped at caption size and full caps. South Sea has no mono idiom
   * (ADR-0007 rule 1 — honestly aliasing to the sans rather than fabricating
   * one). */
  slashLabel: { fontFamily: southSeaFonts.sans, case: 'upper' as const, tracking: '0.28em' },
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
    treatment: 'accentText',
    intent: 'Accent-colored text, undecorated — pull quotes, inline interjections, the hairline-gapped heading pairing. Not underlined on purpose, so it reads distinctly from `Link`.',
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
