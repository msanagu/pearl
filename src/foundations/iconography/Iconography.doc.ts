import type { StoryDoc } from '@/storydoc/types';

export const iconographyDoc: StoryDoc = {
  name: 'iconVocabulary',
  heading: 'Iconography',
  concept:
    'No built-in icon set — Icon accepts any react-icons IconType. Set choice is a theme-level decision (ThemeIconProvider) for the small internal vocabulary Alert/Field need; everything else is a per-usage icon prop, unaffected by theme.',
  overview:
    'A theme picks a set the way it picks a typeface. Size derives from existing tokens rather than a parallel icon-only scale.',
  sections: [
    {
      kind: 'definitions',
      title: 'The iconography contract',
      items: [
        {
          term: 'IconType',
          definition:
            'Any react-icons component. Icon wraps, not owns, a set — swapping sets is an import change at the call site, nothing more.',
        },
        {
          term: 'ThemeIconSet',
          definition:
            'The five-icon vocabulary (positive/negative/warn/info/close) Alert and Field render without the consumer supplying one. Each theme maps this vocabulary to its own react-icons set via ThemeIconProvider. No provider → Phosphor, unchanged default behavior.',
        },
        {
          term: 'Tone',
          definition:
            'A typed prop — accent, or one of the four alert sentiments (positive/negative/warn/info) — recoloring the icon via the same tokens Text and surfaces use. Sentiment tokens flip inside a [data-inverse] container like every other color token; see the Tone story on Components/Icon.',
        },
        {
          term: 'size',
          definition:
            "A numeric prop, snapped to the theme's space grid and rendered in rem — never a raw px number. Same grid as spacing and radius; see the Space foundation.",
        },
      ],
    },
  ],
  related: [
    { rel: 'relates-to', to: 'foundation.space' },
    { rel: 'relates-to', to: 'foundation.color' },
    { rel: 'relates-to', to: 'component.Icon' },
  ],
};
