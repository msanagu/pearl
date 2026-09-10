import type { StoryDoc } from '@/storydoc/types';

export const spaceDoc: StoryDoc = {
  name: 'sizingGrid',
  heading: 'Space',
  concept:
    "The soft sizing-grid mechanic — snap every raw pixel size to the active theme's own scale-token grid; per-theme increment values live in each theme's own foundations entry.",
  overview:
    "Spacing, type, icon size — all snap to one scale grid, so proportions stay consistent no matter what they're sizing. Each theme sets its own increments, but the grid itself doesn't change.",
  sections: [
    {
      kind: 'definitions',
      title: 'The space scale',
      items: [
        {
          term: 'xs',
          definition:
            '0.25rem (4px). Icon-to-label gaps, tight chip/badge padding. The one named half-step — used only for a stated reason, never the default increment.',
        },
        {
          term: 'sm',
          definition: '0.5rem (8px). Related inline elements, compact padding.',
        },
        {
          term: 'md',
          definition:
            '1rem (16px). Default component padding, standard rhythm.',
        },
        {
          term: 'lg',
          definition: '1.5rem (24px). Section spacing, card padding.',
        },
        { term: 'xl', definition: '2rem (32px). Major layout gaps.' },
        {
          term: '2xl',
          definition: '3rem (48px). Page-section separation.',
        },
      ],
    },
    {
      kind: 'steps',
      title: 'Icon-to-text sizing',
      items: [
        {
          title:
            "Size the icon to the paired text's line-height (grid-aligned by the type scale, not font-size) — a bodySm label pairs with a matching-line-height icon. Gap is the theme's space.sm token, not a literal. Align to the line box, not cap-height.",
        },
      ],
    },
    {
      kind: 'note',
      caption: 'Accessibility',
      title: 'Units: rem, not px',
      body: "Spacing is rem, not px — it scales with a user's base font-size preference, not just zoom (WCAG SC 1.4.4). Browser zoom scales px/rem identically; they diverge only when someone raises base font size without zooming. px-pinned spacing stays fixed while rem text grows around it — overflowing buttons, cramped padding at larger sizes. rem math assumes a 16px root, set explicitly so it can't drift.",
    },
    {
      kind: 'steps',
      title: 'Enforcement',
      items: [
        {
          title: 'No type gate on internal .css.ts values',
          description:
            'The composed-value rule (every operand a token) is what a no-raw-values lint would encode: a calc() of all vars.* references passes, any bare length literal fails.',
        },
        {
          title: 'Where the grid already applies',
          description:
            "Stack/Row type gap against the scale; Card/Alert/Field default padding to a scale token (md); Button's height is controlHeight.md, the same token Input uses, so the two align in a row regardless of theme; Progress Bar (not yet built) is where xs earns its keep.",
        },
      ],
    },
  ],
};
