import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from './Card';
import { Text } from '@components/Text/Text';
import { Stack } from '@components/Stack/Stack';
import { Button } from '@components/Button/Button';
import { Tag } from '@components/Tag/Tag';
import { Icon } from '@components/Icon/Icon';
import { Row } from '@components/Row/Row';
import { PiCheckBold, PiArrowUpBold, PiArrowDownBold } from 'react-icons/pi';

/**
 * A surface container. `Card.Header` / `Card.Body` are static-property
 * namespacing, not a Context compound component — no shared state. Every part
 * renders the `data-part` override contract, so a feature team can restyle
 * "any card header" without forking.
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
          <Text typeScale="headingSm" as="h2">
            Profile
          </Text>
        </Card.Header>
        <Card.Body>
          <Stack gap="xs">
            <Text>Manage how your profile appears to others.</Text>
            <Text prominence="subtle" typeScale="bodySm">
              Last updated 2 days ago
            </Text>
          </Stack>
        </Card.Body>
      </Card>
    </div>
  ),
};

/**
 * A card with no header at all — content sits directly inside `<Card>`.
 *
 * `Card.Body` is the sibling of `Card.Header` — a separately padded region
 * below the divider. With no header, the root pads itself instead (a `:has()`
 * rule in `Card.css.ts`).
 */
export const BodyOnly: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <Card>
        <Stack gap="md">
          <Stack gap="xs">
            <Text role="preheading" prominence="subtle" as="p">
              Order 4821
            </Text>
            <Text typeScale="headingSm" as="h2">
              Shipping estimate
            </Text>
          </Stack>
          <Text>
            No `Card.Body` wrapper — with nothing to divide, the root pads
            itself and the content goes straight in.
          </Text>
        </Stack>
      </Card>
    </div>
  ),
};

/**
 * Passing `href` makes the whole card a link — and is the only thing that
 * turns on hover feedback: a lift on every theme, plus a luster glow on Pearl
 * (`data-interactive`). A card with no `href` gets neither — see `StaticCard`.
 */
export const LinkCard: Story = {
  render: () => (
    <div style={{ maxWidth: 420 }}>
      <Card href="#">
        <Card.Header>
          <Text typeScale="headingSm" as="h2">
            Theming guide
          </Text>
        </Card.Header>
        <Card.Body>
          <Text prominence="subtle">
            Hover — this card takes you somewhere.
          </Text>
        </Card.Body>
      </Card>
    </div>
  ),
};
const paddings = ['md', 'lg', 'xl'] as const;

/**
 * `padding` sets interior spacing and corner radius together
 * (`radius.control + padding`), so a roomier card is a rounder one.
 *
 * Both compositions at every step: left uses `Card.Header` + `Card.Body`, right
 * puts content in the root. Padding matches across the pair. Hard-edged themes
 * set `radius.nesting: '0'` and stay square at every step.
 */
export const Padding: Story = {
  render: () => (
    <Row gap="lg" align="start" wrap>
      <Stack gap="lg" style={{ flex: 1, minWidth: 260 }}>
        <Text role="preheading" typeScale="caption" prominence="subtle" as="p">
          With header
        </Text>
        {paddings.map((padding) => (
          <Card key={padding} padding={padding}>
            <Card.Header>
              <Text typeScale="headingSm" as="h3">
                padding=&quot;{padding}&quot;
              </Text>
            </Card.Header>
            <Card.Body>
              <Text prominence="subtle">
                Header and body share the root’s padding.
              </Text>
            </Card.Body>
          </Card>
        ))}
      </Stack>

      <Stack gap="lg" style={{ flex: 1, minWidth: 260 }}>
        <Text role="preheading" typeScale="caption" prominence="subtle" as="p">
          No header
        </Text>
        {paddings.map((padding) => (
          <Card key={padding} padding={padding}>
            <Stack gap="sm">
              <Text typeScale="headingSm" as="h3">
                padding=&quot;{padding}&quot;
              </Text>
              <Text prominence="subtle">
                Content sits in the root, which pads itself.
              </Text>
            </Stack>
          </Card>
        ))}
      </Stack>
    </Row>
  ),
};

const metrics = [
  {
    label: 'Sign-ups',
    value: '12,480',
    unit: 'new accounts',
    delta: '12.4%',
    direction: 'up',
  },
  {
    label: 'Conversion',
    value: '3.36%',
    unit: 'visitors who checked out',
    delta: '2.1%',
    direction: 'down',
  },
  {
    label: 'Avg. order',
    value: '$172',
    unit: 'per completed checkout',
    delta: '8.9%',
    direction: 'up',
  },
] as const;

/**
 * `padding="md"` — the dense end. KPI tiles repeat, so padding multiplies:
 * tighter padding means more metrics above the fold. Grouping is uneven on
 * purpose — the preheading is held off from the value, while the value, its
 * unit, and the delta Tag sit tight together.
 */
export const MetricTiles: Story = {
  render: () => (
    // Grid, not `Row` — a lone wrapped flex item would stretch to fill its row.
    // `auto-fill` keeps empty tracks so every tile is one track wide; the track
    // minimum also stops `Card`'s `overflow: hidden` clipping a shrunk tile.
    // (No `Grid` component yet.)
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
            <Text
              role="preheading"
              typeScale="caption"
              prominence="subtle"
              as="p"
            >
              {m.label}
            </Text>
            <Stack gap="xs" align="start">
              {/* `dataDigits` is mono + tabular-nums but carries no size of its
                  own, so the scale is explicit. */}
              <Text role="dataDigits" typeScale="displaySm" as="p">
                {m.value}
              </Text>
              <Text typeScale="bodySm" prominence="subtle" as="p">
                {m.unit}
              </Text>
              <Tag variant={m.direction === 'up' ? 'positive' : 'negative'}>
                <Icon
                  icon={m.direction === 'up' ? PiArrowUpBold : PiArrowDownBold}
                  size={11}
                  aria-hidden="true"
                />
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
 * `padding="xl"` — the roomy end. One focal card, low density, where the air is
 * doing the work. The opposite end of the lever `MetricTiles` pushes.
 */
export const PricingTier: Story = {
  render: () => (
    <div style={{ maxWidth: 360 }}>
      <Card padding="xl">
        <Stack gap="lg">
          <Stack gap="xs">
            <Row gap="sm" align="center">
              <Text typeScale="headingSm" as="h3">
                Pro
              </Text>
              <Tag variant="info">Popular</Tag>
            </Row>
            <Text prominence="subtle">
              For growing teams that need more power.
            </Text>
          </Stack>

          {/* Inline spans, not a Row: the price and its suffix share a text
              baseline, which flex `align` cannot express (no `baseline` value)
              and normal inline layout gives for free. */}
          <Text as="p">
            <Text as="span" role="dataDigits" typeScale="headingLg">
              $99
            </Text>
            <Text as="span" typeScale="bodySm" prominence="subtle">
              /month
            </Text>
          </Text>

          <Stack
            as="ul"
            gap="sm"
            style={{ listStyle: 'none', margin: 0, padding: 0 }}
          >
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
