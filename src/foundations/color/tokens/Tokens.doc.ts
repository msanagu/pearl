import type { StoryDoc } from '@/storydoc/types';

export const tokensDoc: StoryDoc = {
  name: 'tokenSemantics',
  heading: 'Color tokens',
  concept:
    'What each sentiment-color sub-field (surface/border/text/icon/fill/onFill) is actually for — pick by where it applies, not how bold it looks.',
  overview:
    'The whole color contract on one page. Primitives — raw, theme-scoped hex — sit on top; the semantic tier below names the role each token plays and reacts live to the toolbar theme. Consumers only ever touch the semantic tier (color.*); primitives are theme-internal.',
  sections: [
    {
      kind: 'guidelines',
      title: 'Tinted vs. solid treatment',
      items: [
        {
          level: 'must',
          statement:
            'Pick a sentiment sub-field (color.positive/negative/warn/info) by where it applies.',
          detail:
            'Tinted treatment: surface (tinted background fill), border (tinted border), text (accessible content on surface), icon (saturated mark on surface). Solid treatment: fill (one saturated background — a filled status badge, a destructive primary button) paired with onFill (accessible content on fill).',
        },
      ],
    },
    {
      kind: 'guidelines',
      title: 'Icon is not "strong sentiment"',
      items: [
        {
          level: 'must-not',
          statement:
            'Never reach for icon as a general "strong version of this sentiment."',
          detail:
            'e.g. color.negative.icon as a button background is a category error. For a solid sentiment surface use color.negative.fill + color.negative.onFill, which are contrast-checked as a pair; icon is only ever a mark on surface.',
        },
      ],
    },
    {
      kind: 'steps',
      title: 'Token semantics verification',
      items: [
        {
          title:
            'For a solid, high-emphasis sentiment element (filled badge, destructive CTA) use color.<sentiment>.fill for the background and color.<sentiment>.onFill for text and icons on it — never surface (too tinted), text, or icon. There is exactly one solid intensity; if a design needs two solid weights, flag the gap rather than inventing a second fill.',
        },
      ],
    },
  ],
};
