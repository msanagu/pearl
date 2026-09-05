import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from '@components/Text/Text';

/**
 * Rationale, not a component demo: use semantic HTML — aligned with the
 * first rule of ARIA, defer to a native element/attribute wherever one
 * already provides the needed semantics/behavior, rather than reimplementing
 * it with ARIA and JavaScript.
 */
function SemanticHeaderDemo() {
  return (
    <header>
      <Text role="preheading" as="p">
        A design system for identities that refuse sameness
      </Text>
      <Text as="h1" typeScale="displayLg">
        Pearl
      </Text>
    </header>
  );
}

const meta: Meta<typeof SemanticHeaderDemo> = {
  title: 'Rationale/Semantic HTML',
  component: SemanticHeaderDemo,
  parameters: {
    manifest: {
      name: 'semanticHtml',
      description:
        'Defer to a native HTML element/attribute wherever one already provides the needed semantics/behavior, instead of reimplementing it with ARIA and JavaScript.',
      sections: [
        {
          kind: 'guidelines',
          for: 'agent',
          title: 'Use the platform first',
          items: [
            {
              level: 'must',
              statement:
                'If a native HTML element/attribute already provides the semantics/behavior needed, use it instead of reimplementing with ARIA and JavaScript. Native elements get keyboard handling, screen-reader semantics, and browser behavior for free — a custom <div role="button"> reinvents all of it and will still have edge cases the native element doesn\'t.',
            },
            {
              level: 'must',
              statement:
                "Applied across this system: Button renders <button>, never a styled <div> with a click handler. Text's as prop swaps real elements (p, span, h1-h6), never a <div> styled to resemble a heading. Field wraps a real <label> with real htmlFor. Icon renders inline <svg>, not an icon font. Stack/Row use real Flexbox on plain elements.",
            },
          ],
        },
        {
          kind: 'guidelines',
          for: 'agent',
          title: 'Header vocabulary: header, heading, preheading, subheading',
          items: [
            {
              level: 'must',
              statement:
                'header names the composed area (the HTML5 <header> element, or a component rendering one via as="header") — not any text inside it. heading is the canon type-scale step (typeScale, e.g. headingLg) paired with the correct semantic level via as (h1-h6), independently of visual size.',
            },
            {
              level: 'must-not',
              statement:
                'preheading (a Text role, not a variant — the short line above a heading) must never be an h* element — a heading level there puts a bogus entry in the document outline immediately above the real heading. Use as="p" inside a header, or as="span" inline.',
            },
            {
              level: 'must',
              statement:
                "Pass typeScale explicitly on a preheading unless every targeted theme already sizes that role (some do, some don't — check the theme's typography entry) — a role with no size opinion inherits ambient scale, which for a preheading means body size directly above the heading it introduces, inverting the hierarchy.",
            },
            {
              level: 'should',
              statement:
                'subheading is not yet a role — reserved for a short line below a heading, same pattern as preheading, once a theme needs one.',
            },
          ],
        },
        {
          kind: 'section',
          for: 'agent',
          title: 'Composing a header',
          body: 'Assembled by hand today — <header><Text role="preheading" as="p">...</Text><Text as="h1" typeScale="displayLg">...</Text></header> — no Header/composition component yet.',
        },
        {
          kind: 'section',
          for: 'agent',
          title: "Where it's genuinely contested: components with no native element",
          body: "Alert and Badge have no native HTML5 equivalent — a <div> with the appropriate ARIA role isn't a compromise here, native HTML just has nothing to defer to. Alert's role varies by variant rather than being fixed.",
        },
        {
          kind: 'section',
          for: 'agent',
          title: "Where it's a real trade-off: Progress Bar (not yet built, decision deferred)",
          body: 'Native <progress> gives accessible semantics free but is hard to style consistently across browsers. The alternative, <div role="progressbar"> with manual aria-valuenow/min/max, trades that for full styling control. Decide deliberately when Progress Bar is built — revisit then, not now.',
        },
      ],
    },
  },
};
export default meta;

type Story = StoryObj<typeof SemanticHeaderDemo>;

export const Default: Story = {};
