import type { StoryDoc } from '@/storydoc/types';

export const inverseDoc: StoryDoc = {
  name: 'inverseConvention',
  heading: 'Inverse',
  concept:
    'A local mode flip. [data-inverse] on a container makes that subtree render in the opposite mode — a dark band on a light page, or the reverse — without changing the app-wide theme. Every color token inside resolves to the opposite mode, so ordinary token names just work.',
  overview:
    'Most of an app follows one theme, light or dark, set globally. [data-inverse] is for the exception: a single region meant to read as the other mode. Add the attribute to a container and its whole subtree flips — the rest of the app is untouched.',
  sections: [
    {
      kind: 'guidelines',
      title: 'When to reach for it',
      items: [
        {
          level: 'should',
          statement:
            'Use it for a region meant to stand apart in the opposite mode.',
          detail:
            'A dark call-to-action band on a light page, an inverted footer, a spotlight panel.',
        },
        {
          level: 'must-not',
          statement: 'Don’t use it to switch the whole app.',
          detail:
            'Light or dark for everything is the global theme’s job, not a container attribute.',
        },
        {
          level: 'must-not',
          statement: 'Don’t use it just to get a darker surface.',
          detail:
            'A raised or recessed panel in the same mode is color.surface and elevation — [data-inverse] is a full mode flip, not a shade.',
        },
      ],
    },
    {
      kind: 'guidelines',
      title: 'Inside an inverse container',
      items: [
        {
          level: 'must',
          statement:
            'Add data-inverse to the container, then use ordinary token names.',
          detail:
            'Every color token flips automatically — there is none you swap by hand.',
        },
        {
          level: 'must-not',
          statement: 'Don’t conflate the two axes.',
          detail:
            'An inverse container always renders as if the opposite mode were active there, without touching the global app theme.',
        },
      ],
    },
    {
      kind: 'steps',
      title: 'Extending inverse to a new theme or token',
      items: [
        {
          title:
            'Give every color-contract key an inverse value when adding a theme or a new token.',
          description:
            "Extend both inverseOverride(...) calls with that key set to the theme's own other-mode value — inverse.ts hands the whole object to assignVars, so every contract key must be present. Never invent a fresh color for the inverse case.",
        },
        {
          title:
            'Mirror any per-mode component override into an inverse-scoped rule.',
          description:
            "If a theme restyles a component per mode with its own globalStyle keyed on the mode class (e.g. the primary button in freshwater/tahitian), add a matching [data-inverse]-scoped rule that applies the other mode's treatment — the var flip alone can't move a hardcoded per-mode fill.",
        },
      ],
    },
  ],
};
