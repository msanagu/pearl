import type { StoryDoc } from '@/storydoc/types';

export const tokensDoc: StoryDoc = {
  name: 'tokenSemantics',
  heading: 'Color tokens',
  concept:
    'What each sentiment-color sub-field (surface/border/text/icon/fill/onFill) is actually for — pick by where it applies, not how bold it looks.',
  overview:
    'Two tiers: primitives, and semantic tokens built on top of them. Primitives are raw, theme-scoped hex values, internal to the theme — a consumer never references one directly. Semantic tokens (color.*) name what each color is for; that\'s the only tier a consumer touches, and switching the toolbar\'s theme or mode just changes which primitive each one currently resolves to.',
  sections: [
    {
      kind: 'note',
      caption: 'Primitives',
      title: "Modes share a scale, they don't duplicate one",
      body: "Neutral and sentiment primitives are each one shared scale — light and dark mode draw different steps from it and invert roles (light's text comes from the same register as dark's background, and vice versa), rather than each mode authoring its own. Accent is the exception: it's tuned per theme, and a theme is free to use different values per mode where it needs to. Reusing one scale for neutral and sentiment keeps color declarations reductive — fewer raw values to author and keep consistent, not a second palette per mode.",
    },
    {
      kind: 'note',
      caption: 'Accent',
      title: "Accent isn't necessarily primary",
      body: "accent is a named role, not a promise that a theme's primary button reads from it. Pearl's own primary is squidInk (ink), not accent — deliberately: reusing its subtle accent (urchin) for primary would make every subtle accent use go loud too. Freshwater goes further and gives primary an entirely unrelated scale. A theme can point primary at accent, at a dedicated scale, or use accent as pure decoration — whichever the brand calls for (see Getting Started/Setup, Building your own theme, for how to declare a new one).",
    },
    {
      kind: 'note',
      caption: 'Sentiment',
      title: 'Why positive/negative, not success/danger',
      body: "Broader than an action's outcome: positive/negative also cover upward/downward and gain/loss — a stock-price arrow, an account balance — not just a form succeeding or failing. success/danger are action-result names; positive/negative are sentiment names, so they still read correctly outside a confirmation-toast context.",
    },
    {
      kind: 'note',
      caption: 'Sentiment',
      title: 'Surface tier vs. fill tier',
      body: "Pick a sentiment sub-field (color.positive/negative/warn/info) by tier, not by how bold it looks. Surface tier — surface, border, text, icon — is the tinted, Alert-level treatment; icon is a saturated mark that sits ON that surface, never a stand-in for a solid background. Fill tier — fill paired with onFill — is the one solid, high-emphasis background, contrast-checked as a pair: a filled status badge, a destructive primary button. There's exactly one fill intensity per sentiment; a design wanting a second solid weight is a gap to flag, not a reason to reach for icon as a background.",
    },
  ],
};
