import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from '@components/Card/Card';
import { Text } from '@components/Text/Text';
import { Row } from '@components/Row/Row';
import { Stack } from '@components/Stack/Stack';

/**
 * Rationale, not a component demo: composition over configuration (ADR-0002)
 * — favor children/slot-based props over prop-explosion. Both the default
 * rendering path and the fully-composed override path are first-class.
 *
 * Agent-facing content lives in Composition.doc.ts, feeding the manifest
 * directly — no StoryDoc human page yet, held off deliberately.
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
};
export default meta;

type Story = StoryObj<typeof CompositionDemo>;

export const Default: Story = {};
