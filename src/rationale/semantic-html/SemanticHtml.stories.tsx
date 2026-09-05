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
                'If a native HTML element or attribute already provides the semantics/behavior needed, use it instead of reimplementing it with ARIA and JavaScript. Native elements come with keyboard handling, screen-reader semantics, and browser-level behavior for free — a custom <div role="button"> has to reinvent all of that by hand and will always have edge cases the native element doesn\'t.',
            },
            {
              level: 'must',
              statement:
                'Applied across this system: Button renders an actual <button>, never a styled <div> with a click handler. Text\'s as prop swaps real semantic elements (p, span, h1-h6), never a <div> styled to resemble a heading. Field wraps a real <label> with real htmlFor, not a styled span pretending to be one. Icon renders an inline <svg>, not an icon font or background-image. Stack/Row use real CSS Flexbox on plain elements.',
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
                "header names the composed area (the actual HTML5 <header> element, or a component rendering one via as=\"header\") — not any single piece of text inside it. heading is the canon type-scale step (Text's typeScale, e.g. headingLg, displayLg) paired with the correct semantic level via as (h1-h6), independently of visual size.",
            },
            {
              level: 'must-not',
              statement:
                'preheading (a Text role, not a variant — the short line above a heading) must never be an h* element. It reads as part of the title visually, but giving it a heading level puts a bogus entry in the document outline immediately above the real heading it introduces. Use as="p" inside a header, or as="span" when it sits inline.',
            },
            {
              level: 'must',
              statement:
                "Pass typeScale explicitly on a preheading unless every theme you're targeting already sizes that role — a role is a face, and whether it also carries a size is each theme's own choice (Pearl and Tahitian size preheading, South Sea and Freshwater don't). A role with no size opinion inherits the ambient scale, which for a preheading means rendering at body size directly above the heading it introduces, inverting the hierarchy. Being explicit costs nothing where the theme already agrees, and is the difference between right and broken where it doesn't.",
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
          body: 'A header composes these parts by hand today — <header><Text role="preheading" as="p">...</Text><Text as="h1" typeScale="displayLg">...</Text></header> — the system has no Header/composition component yet.',
        },
        {
          kind: 'section',
          for: 'agent',
          title: "Where it's genuinely contested: components with no native element",
          body: "Some components (Alert, Badge) have no native HTML5 equivalent — there's no <alert> or <badge> element. For these, a <div> with the appropriate ARIA role is not a compromise of this philosophy, it's simply where native HTML doesn't offer anything to defer to in the first place. Alert's role varies by variant rather than being one fixed value.",
        },
        {
          kind: 'section',
          for: 'agent',
          title: "Where it's a real trade-off: Progress Bar (not yet built, decision deferred)",
          body: 'HTML provides a native <progress> element with built-in accessible semantics and zero required ARIA, but it is difficult to style consistently across browsers (fill color/track especially). The alternative is a custom <div role="progressbar"> with manually managed aria-valuenow/aria-valuemin/aria-valuemax — full styling control, but accessibility correctness becomes hand-maintained rather than free. This decision needs to be made deliberately when Progress Bar is implemented, not defaulted into — revisit at that point rather than assuming either path now.',
        },
      ],
    },
  },
};
export default meta;

type Story = StoryObj<typeof SemanticHeaderDemo>;

export const Default: Story = {};
