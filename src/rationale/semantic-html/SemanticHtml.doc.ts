import type { StoryDoc } from '@/storydoc/types';

export const semanticHtmlDoc: StoryDoc = {
  name: 'semanticHtml',
  heading: 'Semantic HTML',
  concept:
    'Defer to a native HTML element/attribute wherever one already provides the needed semantics/behavior, instead of reimplementing it with ARIA and JavaScript.',
  overview:
    'The platform already solves keyboard handling, screen-reader semantics, and focus behavior for its native elements. Reimplementing that with a styled <div> and ARIA is the fallback, not the default — reach for it only where nothing native covers the case.',
  sections: [
    {
      kind: 'guidelines',
      title: 'Use the platform first',
      items: [
        {
          level: 'must',
          statement:
            'Reach for the native element or attribute before reimplementing behavior with ARIA and JavaScript.',
          detail:
            'Native elements get keyboard handling, screen-reader semantics, and browser behavior for free — a custom <div role="button"> reinvents all of it and still has edge cases the native element doesn\'t. Applied across this system: Button renders <button>. Text\'s as prop swaps real elements (p, span, h1-h6), never a <div> styled to resemble a heading. Field wraps a real <label> with real htmlFor. Icon renders inline <svg>, not an icon font. Stack/Row use real Flexbox on plain elements.',
        },
      ],
    },
    {
      kind: 'definitions',
      title: 'Header vocabulary',
      items: [
        {
          term: 'header',
          definition:
            '<header> (the HTML5 element, or as="header") names the composed region — not any text inside it.',
        },
        {
          term: 'heading',
          definition:
            'typeScale (e.g. headingLg) paired with the correct semantic level via as (h1-h6), independent of visual size.',
        },
      ],
    },
    {
      kind: 'guidelines',
      title: 'contextLabel above a heading',
      items: [
        {
          level: 'must-not',
          statement: 'Never render contextLabel as an h* element.',
          detail:
            'contextLabel is a Text role (the mono/caps micro-label treatment: eyebrows, status, category and metadata labels, index numbers), not a heading. As the line above a heading, an h* level there inserts a bogus entry in the document outline right above the real heading — use as="p" inside a header, or as="span" inline.',
        },
        {
          level: 'must',
          statement:
            'Pass typeScale explicitly on a contextLabel that sits above a heading.',
          detail:
            "Unless every targeted theme already sizes the role (some do, some don't — check the theme's typography entry). A role with no size opinion inherits ambient scale — body size directly above the heading it introduces, inverting the hierarchy.",
        },
        {
          level: 'should',
          statement:
            'Treat a deck or standfirst as its own concern, not a contextLabel mirror.',
          detail:
            'A short line below a heading is running prose, sized via typeScale on a p — it has no role of its own yet.',
        },
      ],
    },
    {
      kind: 'note',
      title: 'Composing a header',
      body: 'Assembled by hand today — <header><Text role="contextLabel" as="p">...</Text><Text as="h1" typeScale="displayMd">...</Text></header> — no Header/composition component yet.',
    },
    {
      kind: 'note',
      title: 'No native equivalent',
      body: "Alert and Badge have no native HTML5 equivalent — a <div> with the appropriate ARIA role isn't a compromise here, native HTML just has nothing to defer to. Alert's role varies by variant rather than being fixed.",
    },
    {
      kind: 'note',
      title: 'Progress Bar tradeoff',
      body: 'Native <progress> gives accessible semantics free but is hard to style consistently across browsers. The alternative, <div role="progressbar"> with manual aria-valuenow/min/max, trades that for full styling control. Decide deliberately when Progress Bar is built — revisit then, not now.',
    },
  ],
};
