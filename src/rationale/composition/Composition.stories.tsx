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
                "Favor children/slot-based props over prop-explosion. Test: does the root need to decide based on this content's presence or relation to another part? If not, use children/compound sub-components (Card.Header/Body needs no awareness of the other). A prop is legitimate only when the root must broker that — Alert's heading repositions its icon; Field's required marks * aria-hidden since the control's own aria-required already announces it.",
            },
            {
              level: 'must',
              statement:
                'Treat the default path (minimal props) and the fully-composed override path as equally first-class, neither a fallback. Children is the primary escape hatch; use a render-prop (children={(injected) => ...}, see Field) only to hand data/behavior back to an arbitrary child — implicit prop-cloning is too magic here.',
            },
            {
              level: 'must',
              statement:
                "Keep a component dumb outside its four walls: no coupling to context, siblings, or global state — only props/children in, render out. Compound components (shared React Context, e.g. a future Tabs) are the one bounded exception: siblings in one family may coordinate, a component must never reach outside its own family. No component uses Context yet (Card.Header/Body is static-property namespacing, no shared state) — the exception is documented ahead of its first use, not retrofitted.",
            },
            {
              level: 'must-not',
              statement:
                "Don't invent a wrapper component to DRY up two similar compositions from this system — repeat the composition inline. A shared component whose assumptions don't hold is expensive to unwind once feature code grows around it; a duplicated composition is cheap to change.",
            },
          ],
        },
        {
          kind: 'section',
          for: 'agent',
          title: 'Composition is also how new design happens',
          body: 'Unshipped work composes from primitives in feature code — same tokens, accessibility, visuals, no override needed. A shape that recurs across features is a promotion candidate, fully on-system before anyone proposes canonizing it. Promotion mechanics are undecided; that it comes from recurring real use, not speculative planning, is the settled part.',
        },
      ],
    },
  },
};
export default meta;

type Story = StoryObj<typeof CompositionDemo>;

export const Default: Story = {};
