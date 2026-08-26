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
};
export default meta;

type Story = StoryObj<typeof Card>;

export const HeaderAndBody: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <Card>
        <Card.Header>
          <Text typeScale="headingSm" as="h2">Profile</Text>
        </Card.Header>
        <Card.Body>
          <Stack gap="xs">
            <Text>Manage how your profile appears to others.</Text>
            <Text prominence="subtle" typeScale="bodySm">Last updated 2 days ago</Text>
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

/**
 * Passing `href` makes the whole card a link — that's also the only thing
 * that turns on hover feedback: a lift on every theme, plus a luster glow
 * on Pearl specifically (`data-interactive`, wired in `pearl.css.ts`). A
 * card with no `href` never gets either, on any theme — see `StaticCard`
 * below for the contrast. Try both under the Pearl theme (the toolbar's
 * default) to see the glow; other themes still show the universal lift.
 */
export const LinkCard: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <Card href="#">
        <Card.Header>
          <Text typeScale="headingSm" as="h2">Theming guide</Text>
        </Card.Header>
        <Card.Body>
          <Text prominence="subtle">Hover — this card takes you somewhere.</Text>
        </Card.Body>
      </Card>
    </div>
  ),
};

/** No `href` — a static info card. Hover does nothing, on any theme. */
export const StaticCard: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <Card>
        <Card.Header>
          <Text typeScale="headingSm" as="h2">System status</Text>
        </Card.Header>
        <Card.Body>
          <Text prominence="subtle">Hover — nothing happens. This card goes nowhere.</Text>
        </Card.Body>
      </Card>
    </div>
  ),
};
