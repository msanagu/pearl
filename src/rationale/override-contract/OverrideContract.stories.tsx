import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from '@components/Card/Card';
import { Text } from '@components/Text/Text';
import { myFeatureCard } from './OverrideContract.css';

/**
 * Rationale, not a component demo: the sanctioned way to extend a component
 * past its documented surface when composition and theming genuinely can't
 * reach the case (ADR-0003). Full human-facing writeup:
 * docs/foundations/override-patterns.md.
 */

function OverrideDemo() {
  return (
    <div className={myFeatureCard}>
      <Card>
        <Card.Header>
          <Text as="h3" typeScale="headingSm">
            Overridden header
          </Text>
        </Card.Header>
        <Card.Body>
          <Text as="p">
            The uppercase transform above targets{' '}
            <code>[data-component=&quot;card&quot;][data-part=&quot;header&quot;]</code>{' '}
            — Card's own internal class names are never referenced.
          </Text>
        </Card.Body>
      </Card>
    </div>
  );
}

const meta: Meta<typeof OverrideDemo> = {
  title: 'Rationale/Override Contract',
  component: OverrideDemo,
  parameters: {
    manifest: {
      name: 'overrideContract',
      description:
        'The stable data-component/data-part/data-variant attributes every component renders are the sanctioned way to extend past a documented variant — never inline styles or internal classes.',
      sections: [
        {
          kind: 'guidelines',
          for: 'agent',
          items: [
            {
              level: 'must',
              statement:
                'Target the stable data-component/data-part/data-variant attributes every component renders — the intended extension mechanism, not an implementation detail. Extend past a documented variant (e.g. a destructive action when only primary/secondary exist) by targeting the closest variant\'s attributes from a feature stylesheet: [data-component="button"][data-variant="primary"] { ... }.',
            },
            {
              level: 'must-not',
              statement:
                "Never use inline style={{...}} to change a component's visual treatment. It's invisible to the app and to this system's maintainers — unfindable, unauditable, impossible to promote into a real token later.",
            },
            {
              level: 'must-not',
              statement:
                "Never import the library's internal class tokens, and never add a bespoke CSS-variable prop per element, as a substitute for targeting data attributes.",
            },
            {
              level: 'must',
              statement:
                'Flag an override in two places: a code comment at the site explaining what\'s missing and why (e.g. "override: no destructive Button variant — styling primary as danger"), and a plain statement in prose accompanying the generated code.',
            },
            {
              level: 'must-not',
              statement:
                'Never hand-type a CSS custom-property name (e.g. var(--color-negative-icon)) — vanilla-extract compiles these at build time, undocumented and unstable across builds. A wrong guess doesn\'t error; it silently fails to apply.',
            },
            {
              level: 'must',
              statement:
                'Always reference the real token object (color.negative.surface) as a JS value, never a hand-typed custom-property name — its resolved value is guaranteed correct by construction.',
            },
            {
              level: 'must',
              statement:
                "Compose shipped components as-is by default (Stack/Row for layout) — correct tokens, visuals, accessibility included, nothing targets internals. An override is a costed, visible exception: whoever writes one owns keeping it correct when the component's internals move, since the contract only guarantees the data-* names.",
            },
            {
              level: 'must',
              statement:
                "Reach for className (merged via clsx) only for single-instance overrides — when two instances of one component need different tweaks and data attributes can't disambiguate. Use it mostly for layout/spacing, not for reaching into a specific part; prefer data-component/data-part + selectors for that.",
            },
          ],
        },
        {
          kind: 'steps',
          for: 'agent',
          ordered: false,
          items: [
            {
              title:
                "Verify an override is flagged in both places before shipping — unflagged, it's lost evidence the variant set is incomplete, not a signal the system can act on.",
            },
            {
              title:
                'Verify a feature override reaches a descendant via globalStyle, not style()\'s own selectors key (which can only target the class itself — &:hover, `${parent} &` — never a nested data-part). Use globalStyle(`${wrapperClass} [data-component="card"] [data-part="header"]`, {...}) instead.',
            },
          ],
        },
        {
          kind: 'section',
          for: 'agent',
          title: 'Why data-attribute targeting is the default',
          body: 'Zero setup cost: attributes are already rendered, no exported style token or className needed. Specificity resolves predictably without @layer: a compound selector always outranks the base single-class style, regardless of build order, as long as base styles stay single-selector. Decoupled from implementation, unlike importing generated class tokens, which breaks silently if internal DOM shifts. Doubles as a QA/automation selector. Category-wide: one rule styles every instance of "a card header" in the feature.',
        },
        {
          kind: 'section',
          for: 'agent',
          title: 'Limit: themes do not nest',
          body: "A theme styles components via globalStyle descendant selectors keyed on its theme class. Nest one theme's subtree inside another theme's page and both selectors match the inner button at identical specificity — CSS breaks the tie by source order, not proximity, so the inner theme can lose. Custom properties (vars.*) nest correctly; globalStyle rules (font family, casing, borders) leak into nested subtrees regardless. Two themes can't render side by side by nesting — only real isolation (separate frames) works.",
        },
        {
          kind: 'section',
          for: 'agent',
          title: 'Explicitly banned',
          body: "Importing the library's internal hashed class tokens couples consumer code to internal refactors — a rename breaks the consumer silently, no compile error. A bespoke custom-property injection prop per sub-element (e.g. Card accepting headerBgVar) is banned the same way — turns every token into a prop, duplicating what a CSS selector already does. Correct way: target stable attribute selectors from the consumer's own stylesheet.",
        },
      ],
    },
  },
};
export default meta;

type Story = StoryObj<typeof OverrideDemo>;

export const Default: Story = {};
