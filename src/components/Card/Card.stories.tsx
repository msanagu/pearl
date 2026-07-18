import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';
import { Text } from '../Text/Text';
import { Stack } from '../Stack/Stack';

/**
 * A surface container built from static-property namespacing (`Card.Header` /
 * `Card.Body`) — deliberately **not** a Context compound component, because the
 * parts don't coordinate any state. Every part renders the `data-part` override
 * contract, so a feature team can restyle "any card header" without forking.
 */
const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
};
export default meta;

type Story = StoryObj<typeof Card>;

export const HeaderAndBody: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <Card>
        <Card.Header>
          <Text variant="headingSm" as="h2">Profile</Text>
        </Card.Header>
        <Card.Body>
          <Stack gap="xs">
            <Text>Manage how your profile appears to others.</Text>
            <Text tone="subtle" variant="bodySm">Last updated 2 days ago</Text>
          </Stack>
        </Card.Body>
      </Card>
    </div>
  ),
};

export const BodyOnly: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <Card>
        <Card.Body>
          <Text>A card with just a body — no header needed.</Text>
        </Card.Body>
      </Card>
    </div>
  ),
};
