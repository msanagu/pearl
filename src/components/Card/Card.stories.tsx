import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';
import { Text } from '../Text/Text';
import { Stack } from '../Stack/Stack';
import { Button } from '../Button/Button';
import { Tag } from '../Tag/Tag';
import { Icon } from '../Icon/Icon';
import { Row } from '../Row/Row';
import { PiCheckBold, PiArrowUpBold, PiArrowDownBold } from 'react-icons/pi';

/**
 * A surface container built from static-property namespacing (`Card.Header` /
 * `Card.Body`) — deliberately **not** a Context compound component, because the
 * header don't coordinate any state. Every part renders the `data-part` override
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

/**
 * A card with no header at all — content sits directly inside `<Card>`.
 *
 * `Card.Body` exists to be the sibling of `Card.Header`: a separately padded
 * region below the divider. With no header there is nothing to divide, so the
 * root pads itself instead, and adding either part hands padding back to the
 * header (a `:has()` rule in `Card.css.ts` — `Card.Header`'s rule has to span the
 * card's full width, which a padded root would inset).
 */
export const BodyOnly: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <Card>
        <Stack gap="md">
          <Stack gap="xs">
            <Text role="preheading" prominence="subtle" as="p">Order 4821</Text>
            <Text typeScale="headingSm" as="h2">Shipping estimate</Text>
          </Stack>
          <Text>
            No `Card.Body` wrapper — with nothing to divide, the root pads itself
            and the content goes straight in.
          </Text>
        </Stack>
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
const paddings = ['md', 'lg', 'xl'] as const;

/**
 * `padding` sets the interior spacing **and** the corner radius together — the
 * radius derives as `radius.control + padding`, so a roomier card is a rounder
 * one and its arc stays parallel to the controls nested inside it.
 *
 * Both compositions at every step: the left column uses `Card.Header` +
 * `Card.Body`, the right puts content straight in the root. The padding matches
 * across the pair — the header read the root's value from a custom property, and
 * a card with no header pads itself.
 *
 * On a hard-edged theme all six stay square: those themes set
 * `radius.nesting: '0'`, which zeroes the padding term rather than needing a
 * branch in `Card.css.ts`.
 */
export const Padding: Story = {
  render: () => (
    <Row gap="lg" align="start" wrap>
      <Stack gap="lg" style={{ flex: 1, minWidth: 260 }}>
        <Text role="preheading" typeScale="caption" prominence="subtle" as="p">With header</Text>
        {paddings.map((padding) => (
          <Card key={padding} padding={padding}>
            <Card.Header>
              <Text typeScale="headingSm" as="h3">padding=&quot;{padding}&quot;</Text>
            </Card.Header>
            <Card.Body>
              <Text prominence="subtle">Header and body share the root’s padding.</Text>
            </Card.Body>
          </Card>
        ))}
      </Stack>

      <Stack gap="lg" style={{ flex: 1, minWidth: 260 }}>
        <Text role="preheading" typeScale="caption" prominence="subtle" as="p">No header</Text>
        {paddings.map((padding) => (
          <Card key={padding} padding={padding}>
            <Stack gap="sm">
              <Text typeScale="headingSm" as="h3">padding=&quot;{padding}&quot;</Text>
              <Text prominence="subtle">Content sits in the root, which pads itself.</Text>
            </Stack>
          </Card>
        ))}
      </Stack>
    </Row>
  ),
};

const metrics = [
  { label: 'Sign-ups', value: '12,480', unit: 'new accounts', delta: '12.4%', direction: 'up' },
  { label: 'Conversion', value: '3.36%', unit: 'visitors who checked out', delta: '2.1%', direction: 'down' },
  { label: 'Avg. order', value: '$172', unit: 'per completed checkout', delta: '8.9%', direction: 'up' },
] as const;

/**
 * `padding="md"` — the dense end, and the case that earns it.
 *
 * KPI tiles repeat, so padding multiplies: at `lg` every tile spends 48px of its
 * width on padding instead of 32px and gets taller for identical content, which
 * is fewer metrics above the fold. Tight padding is right here *because* the
 * card tiles.
 *
 * Grouping is 2:1 against the reading order. The `caption` preheading is held
 * off at `lg` so nothing crowds the value from above; the `displaySm` value,
 * its `bodySm` unit, and the delta Tag sit together at `xs`. So the tile reads
 * as one label and one block, and the value — already 5x the size of anything
 * else — is the only thing with space around it.
 */
export const MetricTiles: Story = {
  render: () => (
    // Grid, not `Row`: a wrapped flex item alone on the last row stretches to
    // fill it, which would make one tile arbitrarily wider than its peers.
    // `auto-fill` (not `auto-fit`) keeps the empty tracks, so every tile is
    // exactly one track wide at every viewport. The track minimum also covers
    // `Card`'s `overflow: hidden`, which would otherwise let a tile shrink past
    // its own value and clip it. (The system has no `Grid` component yet.)
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
        gap: '1rem',
        maxWidth: 860,
      }}
    >
      {metrics.map((m) => (
        <Card key={m.label} padding="md">
          <Stack gap="lg" align="start">
            <Text role="preheading" typeScale="caption" prominence="subtle" as="p">{m.label}</Text>
            <Stack gap="xs" align="start">
              {/* `dataDigits` is mono + tabular-nums but carries no size of its
                  own, so the scale is explicit. */}
              <Text role="dataDigits" typeScale="displaySm" as="p">{m.value}</Text>
              <Text typeScale="bodySm" prominence="subtle" as="p">{m.unit}</Text>
              <Tag variant={m.direction === 'up' ? 'positive' : 'negative'}>
                <Icon icon={m.direction === 'up' ? PiArrowUpBold : PiArrowDownBold} size={11} aria-hidden="true" />
                {m.delta}
              </Tag>
            </Stack>
          </Stack>
        </Card>
      ))}
    </div>
  ),
};

const proFeatures = [
  '25 AI agents',
  '25,000 tasks / month',
  'Unlimited integrations',
  'Priority support',
  'Advanced analytics',
];

/**
 * `padding="xl"` — the roomy end.
 *
 * One focal card, low density, persuasive rather than informational: the air is
 * doing work here, and cramping it would read as cheap. The opposite end of the
 * same lever `MetricTiles` pushes the other way, which is the whole argument for
 * padding being a prop rather than a constant.
 */
export const PricingTier: Story = {
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <Card padding="xl">
        <Stack gap="lg">
          <Stack gap="xs">
            <Text typeScale="headingSm" as="h3">Pro</Text>
            <Text prominence="subtle">For growing teams that need more power.</Text>
          </Stack>

          {/* Inline spans, not a Row: the price and its suffix share a text
              baseline, which flex `align` cannot express (no `baseline` value)
              and normal inline layout gives for free. */}
          <Text as="p">
            <Text as="span" role="dataDigits" typeScale="headingLg">$99</Text>
            <Text as="span" typeScale="bodySm" prominence="subtle">/month</Text>
          </Text>

          <Stack as="ul" gap="sm" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {proFeatures.map((f) => (
              <Row as="li" key={f} gap="sm" align="center">
                <Icon icon={PiCheckBold} size={14} aria-hidden="true" />
                <Text typeScale="bodySm">{f}</Text>
              </Row>
            ))}
          </Stack>

          <Button style={{ width: '100%' }}>Get started</Button>
        </Stack>
      </Card>
    </div>
  ),
};
