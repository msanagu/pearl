import type { StoryDoc } from '@/storydoc/types';

export const typographyDoc: StoryDoc = {
  name: 'typography',
  heading: 'Typography',
  concept:
    'One Text component, not split Heading/Text — typeScale (size), role (face), as (element), and weight are four independent axes that combine any of them; heading level is driven by document structure, never by how large something needs to look.',
  overview:
    'Four independent knobs — scale, face, element, weight — that a theme recombines into named roles.',
  sections: [
    {
      kind: 'definitions',
      title: 'Type scale',
      items: [
        {
          term: 'caption',
          definition:
            '11px (0.6875rem), 1.4545 lineHeight (16px), 0 letterSpacing. The one 4px-grid exception — true neighbors are 8px (below the 11px legibility floor) and 12px (collides with bodySm). Only fontSize escapes the grid; resolved lineHeight still lands on it.',
        },
        {
          term: 'bodySm',
          definition:
            '12px (0.75rem), 1.667 lineHeight (20px), 0 letterSpacing.',
        },
        {
          term: 'bodyMd',
          definition: '16px (1rem), 1.5 lineHeight (24px), 0 letterSpacing.',
        },
        {
          term: 'bodyLg',
          definition: '24px (1.5rem), 1.5 lineHeight (36px), 0 letterSpacing.',
        },
        {
          term: 'headingSm',
          definition:
            '32px (2rem), 1.25 lineHeight (40px), -0.01em letterSpacing (-0.32px).',
        },
        {
          term: 'headingMd',
          definition:
            '40px (2.5rem), 1.2 lineHeight (48px), -0.015em letterSpacing (-0.6px).',
        },
        {
          term: 'headingLg',
          definition:
            '56px (3.5rem), 1.143 lineHeight (64px), -0.02em letterSpacing (-1.12px).',
        },
        {
          term: 'displaySm',
          definition:
            '72px (4.5rem), 1.056 lineHeight (76px), -0.03em letterSpacing (-2.16px).',
        },
        {
          term: 'displayMd',
          definition:
            '112px (7rem), 1.071 lineHeight (120px), -0.04em letterSpacing (-4.48px). Top of the reading hierarchy — see displayLg.',
        },
        {
          term: 'displayLg',
          definition:
            '152px (9.5rem), 1.053 lineHeight (160px), -0.045em letterSpacing (-6.84px). Identity type only — a wordmark on a title page. Not for section headings.',
        },
      ],
    },
    {
      kind: 'note',
      title: 'Line-height lands on the grid',
      body: "fontSize is the one value chosen freely per step. Every resolved lineHeight is still a multiple of the space grid (see Space) — the same discipline spacing and radius follow, applied to type.",
    },
    {
      kind: 'definitions',
      title: 'Font-weight scale',
      items: [
        {
          term: 'regular (400)',
          definition: 'Default for bodySm/bodyMd/bodyLg in every theme.',
          usage:
            'Values are identical across themes; which step defaults where varies — check the active theme entry.',
        },
        {
          term: 'medium (500)',
          definition:
            'One step up from body. A heading and display default in the lighter-weight themes; override-only in the others.',
        },
        {
          term: 'semibold (600)',
          definition:
            'A heading default in most themes, and a display default in some; override-only where a theme sets its headings lighter.',
        },
        {
          term: 'bold (700)',
          definition:
            'Heaviest step. A display default in some themes; override-only elsewhere.',
        },
      ],
    },
  ],
  related: [{ rel: 'relates-to', to: 'foundation.space' }],
};
