import type { StoryDoc } from '@/storydoc/types';

export const compositionDoc: StoryDoc = {
  name: 'composition',
  heading: 'Composition',
  concept:
    'Compose with children and slots instead of piling on props. A component keeps a small API, and its minimal path and its fully-overridden path are both first-class.',
  overview:
    'Pearl components take children, not a wall of boolean props. The simplest use is a prop or two; the most customized is full composition — and neither is a workaround for the other.',
  sections: [
    {
      kind: 'guidelines',
      title: 'Composition over configuration',
      items: [
        {
          level: 'must',
          statement: 'Favor children/slot-based props over prop-explosion.',
          detail:
            "Test: does the root need to decide based on this content's presence or relation to another part? If not, use children/compound sub-components (Card.Header/Body needs no awareness of the other). A prop is legitimate only when the root must broker that — Alert's heading repositions its icon; Field's required marks * aria-hidden since the control's own aria-required already announces it.",
        },
        {
          level: 'must',
          statement:
            'Treat the default path (minimal props) and the fully-composed override path as equally first-class, neither a fallback.',
          detail:
            'Children is the primary escape hatch; use a render-prop (children={(injected) => ...}, see Field) only to hand data/behavior back to an arbitrary child — implicit prop-cloning is too magic here.',
        },
        {
          level: 'must',
          statement:
            'Keep a component dumb outside its four walls: no coupling to context, siblings, or global state — only props/children in, render out.',
          detail:
            'Compound components (shared React Context, e.g. a future Tabs) are the one bounded exception: siblings in one family may coordinate, a component must never reach outside its own family. No component uses Context yet (Card.Header/Body is static-property namespacing, no shared state) — the exception is documented ahead of its first use, not retrofitted.',
        },
        {
          level: 'must-not',
          statement:
            "Don't invent a wrapper component to DRY up two similar compositions from this system — repeat the composition inline.",
          detail:
            "A shared component whose assumptions don't hold is expensive to unwind once feature code grows around it; a duplicated composition is cheap to change.",
        },
      ],
    },
    {
      kind: 'note',
      title: 'Composition is also how new design happens',
      body: 'Unshipped work composes from primitives in feature code — same tokens, accessibility, visuals, no override needed. A shape that recurs across features is a promotion candidate, fully on-system before anyone proposes canonizing it. Promotion mechanics are undecided; that it comes from recurring real use, not speculative planning, is the settled part.',
    },
  ],
};
