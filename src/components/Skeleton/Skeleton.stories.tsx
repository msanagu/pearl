import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton } from './Skeleton';
import { Card } from '@components/Card/Card';
import { Row } from '@components/Row/Row';
import { Stack } from '@components/Stack/Stack';
import { Text } from '@components/Text/Text';

/**
 * A loading placeholder shaped like the content that will replace it.
 *
 * Composition-first: there is no `lines` prop and no `SkeletonCard`. A
 * paragraph is three `Skeleton`s in a `Stack` with varied widths; a card is
 * whatever arrangement of them matches the real card. That is the point — the
 * closer the placeholder tracks the real layout, the less the page moves when
 * content lands.
 *
 * The sweep is plain CSS (a Skeleton paints before whatever JS is being waited
 * on) and drops to a static tint under `prefers-reduced-motion`.
 */
const meta: Meta<typeof Skeleton> = {
  title: 'Components/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof Skeleton>;

export const TextLine: Story = {
  name: 'Text line',
  args: { variant: 'text', typeScale: 'bodyMd' },
};

export const Block: Story = {
  args: { variant: 'block', height: 160 },
};

export const Circle: Story = {
  args: { variant: 'circle', width: 48 },
};

/**
 * Each `typeScale` matches that scale's line box, so a placeholder occupies
 * exactly the height its real line will.
 */
export const MatchingTheTypeScale: Story = {
  name: 'Matching the type scale',
  render: () => (
    <Stack gap="lg" style={{ maxWidth: 520 }}>
      {(['caption', 'bodySm', 'bodyMd', 'bodyLg', 'headingSm'] as const).map(
        (scale) => (
          <Row key={scale} gap="lg" align="center">
            <Text
              as="span"
              typeScale="caption"
              prominence="subtle"
              style={{ width: 88, flexShrink: 0 }}
            >
              {scale}
            </Text>
            <Skeleton typeScale={scale} />
          </Row>
        ),
      )}
    </Stack>
  ),
};

/**
 * A paragraph: same scale throughout, varied widths, and a short last line —
 * that ragged edge is what stops a block of placeholders reading as a slab.
 */
export const Paragraph: Story = {
  render: () => (
    <Stack gap="sm" style={{ maxWidth: 520 }}>
      <Skeleton typeScale="bodyMd" />
      <Skeleton typeScale="bodyMd" />
      <Skeleton typeScale="bodyMd" width="92%" />
      <Skeleton typeScale="bodyMd" width="58%" />
    </Stack>
  ),
};

/**
 * Composed to match a real card — heading, meta row, body, and a control —
 * rather than configured from a prop. Placed inside a `Card` to show the
 * placeholder wash compositing correctly on `surface` as well as the page.
 */
export const ComposedCard: Story = {
  name: 'Composed card',
  render: () => (
    <Card padding="lg" style={{ maxWidth: 420 }}>
      <Stack gap="lg">
        <Row gap="md" align="center">
          <Skeleton variant="circle" width={40} />
          <Stack gap="xs" style={{ flex: 1 }}>
            <Skeleton typeScale="bodyMd" width="55%" />
            <Skeleton typeScale="caption" width="35%" />
          </Stack>
        </Row>
        <Stack gap="sm">
          <Skeleton typeScale="bodySm" />
          <Skeleton typeScale="bodySm" />
          <Skeleton typeScale="bodySm" width="70%" />
        </Stack>
        <Skeleton variant="block" width={120} height={40} />
      </Stack>
    </Card>
  ),
};
