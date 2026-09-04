import type { ThemeRoles } from '@themes/roles';
import { southSeaFonts } from './south-sea.css';

export const southSeaDescription =
  'Golden-hour maison restraint: a roman/italic serif mix and a hairline rule do the talking; conch does exactly one loud thing per view.';

/**
 * The nav wordmark. No `role` — the mark is the maison's italic (Times, neutral
 * ink), styled directly in `south-sea.css.ts` off `[data-component="brand-
 * wordmark"]`, not the accent-coloured `inlineEmphasis`.
 */
export const southSeaBrandWordmark = {
  text: 'South Sea',
};

/** South Sea's own catalog of typography treatments. No ambient effect treatments — see `south-sea.css.ts`. */
export const southSeaTypeTreatments = {
  accentText: { color: 'accent' },
  slashLabel: { fontFamily: southSeaFonts.sans, case: 'upper' as const, tracking: '0.28em' },
  sansBody: { fontFamily: southSeaFonts.sans },
} satisfies Record<string, unknown>;

type SouthSeaTreatmentName = keyof typeof southSeaTypeTreatments;

/** South Sea's role table — which treatment fulfills each named typography job. */
export const southSeaRoles: ThemeRoles<SouthSeaTreatmentName> = {
  inlineEmphasis: {
    treatment: 'accentText',
    intent: 'Accent-colored text, undecorated — pull quotes, inline interjections, the hairline-gapped heading pairing. Not underlined on purpose, so it reads distinctly from `Link`.',
    scope: ['inline', 'heading'],
    guidance: ['Verified against both background and surface, both modes, as text color: light 4.90:1/4.53:1, dark 8.18:1/7.49:1.'],
  },
  preheading: {
    treatment: 'slashLabel',
    intent: 'The `/ LABEL /` slash-wrapped caption — standalone labels/IDs/metadata.',
    size: 'caption',
  },
  dataDigits: {
    treatment: 'sansBody',
    intent: 'No dedicated tabular face exists yet — honestly aliases to the body sans rather than fabricating a tabular treatment.',
  },
};
