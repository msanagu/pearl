import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from '@components/Card/Card';
import { Text } from '@components/Text/Text';
import { Row } from '@components/Row/Row';
import { Stack } from '@components/Stack/Stack';

/**
 * Rationale, not a component demo: composition over configuration (ADR-0002)
 * — favor children/slot-based props over prop-explosion. Both the default
 * rendering path and the fully-composed override path are first-class.
 */
function CompositionDemo() {
  return (
    <Row gap="lg" wrap align="start">
      <Stack gap="sm" style={{ width: 220 }}>
        <Text as="p" typeScale="bodySm" prominence="subtle">
          Default — minimal props
        </Text>
        <Card>
          <Text as="p">Sensible default layout, no composition needed.</Text>
        </Card>
      </Stack>
      <Stack gap="sm" style={{ width: 220 }}>
        <Text as="p" typeScale="bodySm" prominence="subtle">
          Composed — Card.Header + Card.Body
        </Text>
        <Card>
          <Card.Header>
            <Text as="h3" typeScale="headingSm">
              Custom
            </Text>
          </Card.Header>
          <Card.Body>
            <Text as="p">Fully overridden via composition.</Text>
          </Card.Body>
        </Card>
      </Stack>
    </Row>
  );
}

const meta: Meta<typeof CompositionDemo> = {
  title: 'Rationale/Composition',
  component: CompositionDemo,
  parameters: {
    manifest: {
      name: 'composition',
      description:
        "Favor children/slot-based props over prop-explosion — a component's own API stays small, and both its default rendering path and its fully-composed override path are first-class.",
      sections: [
        {
          kind: 'guidelines',
          for: 'agent',
          title: 'Composition over configuration',
          items: [
            {
              level: 'must',
              statement:
                "Favor children and slot-based props over prop-explosion. If a component needs many boolean/enum props whose only job is to toggle rendered structure or content, that's a signal it should be composed instead of configured. The test: does the root need to make a decision that depends on this content's presence, or its relationship to another part? If not, default to compound sub-components or plain children — the root shouldn't need to know a part exists (Card's Header/Body). A prop is legitimate exactly when the root does need to broker that — Alert's heading shifts where its icon sits, Field's required renders a static, visible * marked aria-hidden because the control's own aria-required already announces it.",
            },
            {
              level: 'must',
              statement:
                'Treat both the default rendering path (minimal props, sensible layout) and the fully-composed override path as first-class — neither is a fallback for the other. Prefer children as the primary escape hatch; reach for a render-prop pattern (children={(injectedProps) => ...}, see Field) specifically when a component needs to hand data/behavior back to an arbitrary child — implicit prop-cloning onto children is considered too "magic" for this system.',
            },
            {
              level: 'must',
              statement:
                "Keep a component dumb outside its four walls: it should not know or care about its context, siblings, or where it's rendered — no implicit coupling to global state, layout assumptions, or components outside its own family. It receives what it needs via props/children and renders, that's the whole contract. A compound component (root + sub-components sharing React Context so siblings can coordinate, e.g. a future Tabs/Tabs.List/Tabs.Trigger) is a deliberate, bounded exception: siblings within a component family may coordinate, but a component must never reach outside its own family.",
            },
            {
              level: 'must-not',
              statement:
                "Don't let \"smart defaults, always escapable\" be read as license to remove a control's affordance — every interactive control that occupies a box renders a visible boundary in its resting state, in every theme and every mode. A theme chooses how quiet that boundary is; it does not choose whether there is one.",
            },
          ],
        },
        {
          kind: 'section',
          for: 'agent',
          title: 'Composition is also how new design happens',
          body: "Composition keeps a component's own API small, and it's also how work the library doesn't cover yet gets built without leaving the system. A feature that needs something unshipped composes it from primitives in its own code — still correct tokens, accessibility, and visuals, no override contract involved. That local composition is a proposal: if the same shape recurs across features, it's a concrete candidate for promotion to a first-class component, one that was fully on-system before anyone proposed canonizing it. How candidates get detected and promoted is still being worked out; that they should come from real, recurring composition rather than speculative planning is the settled part.",
        },
        {
          kind: 'section',
          for: 'agent',
          title: 'The compound-component exception, in more detail',
          body: 'No component in this system uses Context today — Card.Header/Card.Body are static-property namespacing with no shared state — so the compound-component exception is documented ahead of its first real use, not retrofitted to one. When to use compound components: only when sub-parts need to genuinely coordinate state or behavior (which tab is active, matching ids for ARIA relationships). If sub-parts are just visually adjacent with no shared logic, use plain children composition instead — no Context needed. Most components in this system fall into the second category; compound components are the exception, used sparingly and only where justified.',
        },
        {
          kind: 'section',
          for: 'agent',
          title: 'Trade-off: duplication vs. the wrong abstraction',
          body: "DRY (avoiding repeated data) is not free — it often trades data duplication for logic complexity. Before unifying two things into one abstraction, ask: is the thing being unified structurally guaranteed to stay simple, or just simple today? Safe to unify: closed, stable properties (the shared FlexBox primitive's direction: 'row'|'column' is exactly one CSS property toggle, not going to grow surprise cases — Stack and Row each fix it to one value rather than exposing it). Risky to unify: open-ended, divergent concerns (icon 'variants' like outline vs. filled vs. duotone aren't guaranteed to be a clean transform of one shape into another). When in doubt, prefer duplicated data (multiple files, explicit registrations) over a shared abstraction whose assumptions might not hold — duplication is cheap to undo; a wrong abstraction is expensive to unwind once code has grown around it.",
        },
      ],
    },
  },
};
export default meta;

type Story = StoryObj<typeof CompositionDemo>;

export const Default: Story = {};
