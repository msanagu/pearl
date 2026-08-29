import type { ThemeRoles } from '@themes/roles';
import { tahitianTreatments, tahitianTypeTreatments } from './tahitian.css';

export const tahitianDescription =
  'Poster-scale editorial energy: hard grid, condensed type, and iridescence reserved for the image plate and one word at a time.';

/**
 * The nav wordmark — plain, no `role`. Overtone is reserved for one
 * emphasized word and image plates (`inlineEmphasis`/`imageOverlay`); the
 * brand mark itself stays undecorated white/near-black, matching 14a. Text
 * is hardcoded uppercase (not a CSS `text-transform`) — Tahitian's poster
 * register renders every wordmark in caps, same as the other three themes'
 * own name.
 */
export const tahitianBrandWordmark = {
  text: 'TAHITIAN',
  role: undefined,
};

type TahitianTreatmentName = keyof typeof tahitianTreatments | keyof typeof tahitianTypeTreatments;

export const tahitianRoles: ThemeRoles<TahitianTreatmentName> = {
  inlineEmphasis: {
    treatment: 'overtone',
    intent: 'A single word can carry the overtone gradient as a poster-like emphasis.',
    scope: ['inline', 'headline'],
    forbid: ['surface', 'control'],
    source: '14a',
  },
  preheading: {
    treatment: 'monoCapsTracked',
    intent: 'The short line above a heading, and standalone labels/IDs/metadata — index numbers, plate captions, filter labels.',
    size: 'caption',
    source: '14b',
  },
  imageOverlay: {
    treatment: 'overtone',
    intent: 'Moving peacock, blue, aubergine, and rose light over grayscale photography in an editorial plate.',
    on: 'imagery',
    trigger: 'ambient',
    chroma: 'brand',
    forbid: ['type', 'control', 'surface'],
    limits: { hues: { max: 3 }, alpha: { max: 0.48 } },
    guidance: [
      'The image stays grayscale underneath; overtone adds color without obscuring its texture.',
      'Use screen blending on photographic plates only. Do not turn the gradient into a flat surface fill.',
    ],
    source: '14a',
  },
  fieldMeta: {
    treatment: 'monoCapsTracked',
    intent: 'Field labels use tracked IBM Plex Mono; labels, hints, and errors stay flush-left against square controls.',
    scope: ['field'],
    source: '6c',
  },
};
