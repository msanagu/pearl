import type { StoryDoc } from '@/storydoc/types';

export const radiusDoc: StoryDoc = {
  name: 'concentricRadius',
  heading: 'Radius',
  concept:
    "A padded surface derives its own corner radius from radius.control plus its own padding, instead of authoring one — keeps nested corners concentric regardless of that surface's padding. Experimental, not settled.",
  overview:
    'A theme authors exactly one radius — radius.control — plus two policy tokens, nesting and cornerShape. Everything else is derived; concentric derivation is the experimental rule built on top.',
  sections: [
    {
      kind: 'definitions',
      title: 'The radius contract',
      items: [
        {
          term: 'radius.control',
          definition:
            "The theme's corner. Buttons, inputs, tags. The only radius a theme authors — a real design token, free to be any value the theme wants, not snapped to the space grid (see Space). Only a derived surface radius (control + padding) inherits grid alignment, through the padding term.",
        },
        {
          term: 'radius.full',
          definition:
            'Maximal rounding, for square-aspect elements only, never a rectangle — dots, radios, avatars, slider thumbs producing a true circle. Anything nested inside another surface (a Tag, an Alert’s close button) takes radius.control regardless of aspect ratio. A real design token.',
        },
        {
          term: 'radius.nesting',
          definition:
            "A boolean. true: a derived surface gets the concentric radius, growing with its own padding. false: the surface's radius just matches radius.control. A policy rule, not a design value — not shown on the Tokens/Semantic specimen page.",
        },
        {
          term: 'radius.cornerShape',
          definition:
            'How the corner is drawn — round, squircle, bevel. Must be uniform across everything with a radius: a squircle button in a round-cornered card breaks the concentric rule. A theme token, not per-component. Inert at border-radius: 0.',
        },
        {
          term: 'There is no radius.surface',
          definition:
            'A padded surface derives its radius via concentric derivation rather than authoring one — a single token could only fit one padding value. Card/Alert derive from their own padding; a future Modal/Popover/Sheet does the same.',
        },
      ],
    },
    {
      kind: 'note',
      title: 'Why concentric',
      body: 'Two nested rounded corners only stay parallel as they curve if the outer radius exceeds the inner by exactly the gap between them — the padding. Any other difference and the two arcs drift apart or crowd together, more visibly at larger radii. The inner radius is always radius.control; only the outer radius moves with padding.',
    },
    {
      kind: 'steps',
      title: 'Known limits',
      items: [
        {
          title: 'Nesting only goes one level deep',
          description:
            'The formula covers a control inside one padded surface — a button inside a card. A padded surface inside another padded surface would come out too large, and a third level would go negative. Nothing nests surfaces that way today; if it happens, the fix is a different, subtractive formula, not a bigger version of this one.',
        },
        {
          title: 'Very small padding looks broken, not rounded',
          description:
            "The inner radius stays fixed no matter the padding, so a small padding value makes that fixed radius look oversized next to it. At 8px padding the corner would be about two and a half times the width of the gap around it — that's why Card has no small-padding option.",
        },
        {
          title: "Squircle corners drift from the formula's exact gap",
          description:
            'The formula gives an exact gap only where corners are true circles, measured along a straight edge. A squircle corner bulges out roughly 19% further at the diagonal, so a 32px gap can look closer to 38px right at the corner. Left as-is: shrinking the radius to fix it would pinch the gap where the straight edge meets the curve, which looks worse than the corner bulging slightly.',
        },
        {
          title: "Two cards with different padding won't match",
          description:
            'Each card derives its radius from its own padding, so two cards with different padding on the same page end up with different — but individually correct — corner radii. This is accepted: padding is a per-instance choice, not something kept visually uniform across a page.',
        },
      ],
    },
  ],
  related: [{ rel: 'relates-to', to: 'foundation.space' }],
};
