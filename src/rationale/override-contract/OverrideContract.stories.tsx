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
                'Target the stable data-component/data-part/data-variant attributes every component renders — this is the primary, intended extension mechanism, not an implementation detail. Extend past a documented variant (e.g. a destructive/danger action when only primary/secondary exist) by targeting the closest variant\'s data attributes from a feature-level stylesheet: [data-component="button"][data-variant="primary"] { ... }.',
            },
            {
              level: 'must-not',
              statement:
                "Never use an inline style={{...}} prop to change a component's visual treatment (color, border, background). It is invisible to the rest of the app and to this design system's own maintainers — unfindable, unauditable, and impossible to promote into a real token or variant later.",
            },
            {
              level: 'must-not',
              statement:
                'Never import the library\'s internal class tokens, and never add a bespoke CSS-variable prop per element, as a substitute for targeting data attributes.',
            },
            {
              level: 'must',
              statement:
                'When an override like that is used, say so in two places: a code comment at the override site explaining what\'s missing and why (e.g. "override: Pearl has no destructive Button variant — styling primary as danger here"), and a plain statement in any prose accompanying the generated code.',
            },
            {
              level: 'must-not',
              statement:
                "Never hand-type a literal CSS custom-property name (e.g. var(--color-negative-icon)) for a Pearl color value in an override, in any environment — vanilla-extract compiles these names at build time and they are not documented, predictable, or stable across builds. A wrong guess does not error; it silently fails to apply.",
            },
            {
              level: 'must',
              statement:
                "Always reference the real token object (color.negative.surface, imported from @msanagu/pearl) as a JS value instead of a hand-typed custom-property name — its resolved value is guaranteed correct by construction.",
            },
            {
              level: 'must',
              statement:
                'Compose shipped components as-is by default, using Stack/Row for feature- and page-level layout — correct tokens, visuals, and accessibility come with them, nothing targets component internals. An override is a costed, visible exception on top of that default, not a routine styling tool: whoever writes one owns keeping it correct when the component\'s internals move, since the contract guarantees the data-* names and nothing around them.',
            },
            {
              level: 'must',
              statement:
                'Reach for className (merged via clsx, which every component/subcomponent accepts) only for genuine single-instance overrides — when two instances of the same component exist and only one needs a tweak, data attributes can\'t disambiguate between them. Use feature-scoped className overrides mostly for layout/spacing between elements, not for reaching into a specific component/part; prefer the data-component/data-part + selectors pattern for that.',
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
                'Check that an override is flagged in both places before shipping it. This is not optional politeness — an unflagged override is real evidence the variant set is incomplete, lost the moment it ships silently instead of surfacing as a signal for what the design system should grow to cover next.',
            },
            {
              title:
                'Verify a feature-level override targets a component\'s data attributes via globalStyle (a plain style() call\'s own selectors key can only target the class itself — &:hover, or `${parent} &` — never a descendant like a data-part nested inside the wrapper; reaching a descendant needs globalStyle(`${wrapperClass} [data-component="card"] [data-part="header"]`, {...}) instead).',
            },
          ],
        },
        {
          kind: 'section',
          for: 'agent',
          title: 'Why data-attribute targeting is the default',
          body: 'Zero per-element setup cost: attributes cost nothing extra beyond what the component already renders — no exported empty style token, no className prop needed at each element just to make it targetable. Specificity resolves predictably without @layer: a compound/descendant selector always outranks the base component\'s single-class style, regardless of file/import/bundle order — a CSS specificity guarantee, not build-order-dependent, as long as base component styles stay single-selector. Decoupled from implementation: data attributes are a deliberate, versioned contract the design system controls, unlike importing the library\'s actual generated class tokens, which exposes internals that can break silently if the internal DOM structure ever shifts. Doubles as a stable QA/automation selector, independent of styling entirely. Category-wide targeting: one rule styles every instance of "a card header" anywhere in the feature, which is the common case.',
        },
        {
          kind: 'section',
          for: 'agent',
          title: 'Limit: themes do not nest',
          body: 'A theme styles components through globalStyle descendant selectors keyed on its own theme class (e.g. .tahitianDarkThemeClass [data-component="button"][data-variant="primary"]). Put a Pearl-classed subtree inside a Tahitian-classed page and both selectors match the inner button at identical specificity — CSS breaks that tie by source order, not proximity, so the inner theme loses to whichever stylesheet happens to load last, at any nesting depth. Custom properties (vars.*) do nest correctly — a nested theme class re-resolves colors, spacing, and radii to the inner theme — but globalStyle rules (font family, casing, tracking, per-variant borders) leak into nested subtrees regardless. A page cannot render two themes side by side by nesting; real isolation (separate frames, not nesting) is the only reliable answer today.',
        },
        {
          kind: 'section',
          for: 'agent',
          title: 'Explicitly banned',
          body: 'Importing the library\'s internal, hashed class tokens (e.g. `import { baseButton } from \'@msanagu/pearl/button.css.ts\'` then concatenating a custom class onto it) tightly couples consumer code to internal refactors — if the design system renames or splits that internal token, the consumer\'s app breaks silently: no type error, no compile error, just wrong CSS in production. Turning every sub-element style into a bespoke custom-property injection prop (e.g. a Card accepting headerBgVar/headerPaddingVar/footerBorderVar props) is banned the same way — it turns every design token into an endless stream of bespoke props, defeating the simplicity of the component API and duplicating what a CSS selector already does natively. The correct way stays the data-part contract: target stable attribute selectors from the consumer\'s own stylesheet instead.',
        },
      ],
    },
  },
};
export default meta;

type Story = StoryObj<typeof OverrideDemo>;

export const Default: Story = {};
