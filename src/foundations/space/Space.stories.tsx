import type { Meta, StoryObj } from '@storybook/react-vite';
import { space } from '@tokens';
import { Text } from '@components/Text/Text';
import { Stack } from '@components/Stack/Stack';
import { Row } from '@components/Row/Row';
import { StoryDoc } from '@/storydoc/StoryDoc';
import { spaceDoc } from './Space.doc';

const STEPS = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

function ScaleBar({ step }: { step: (typeof STEPS)[number] }) {
  return (
    <Row gap="md" align="center">
      <div style={{ width: '4.5rem', flexShrink: 0 }}>
        <Text as="span" typeScale="bodySm">
          space.{step}
        </Text>
      </div>
      <div
        style={{
          height: 12,
          width: space[step],
          background: 'currentColor',
          borderRadius: 2,
        }}
      />
    </Row>
  );
}

function SpaceScale() {
  return (
    <Stack gap="md">
      <Text as="h2" typeScale="headingSm">
        Space tokens
      </Text>
      <Stack gap="sm">
        {STEPS.map((step) => (
          <ScaleBar key={step} step={step} />
        ))}
      </Stack>
    </Stack>
  );
}

const meta: Meta<typeof SpaceScale> = {
  title: 'Foundations/Space',
  component: SpaceScale,
  parameters: {
    layout: 'fullscreen',
    removePreviewPadding: true,
  },
};
export default meta;

type Story = StoryObj<typeof SpaceScale>;

// Named to match the title's last segment so Storybook collapses the group
// into a single sidebar entry (no Space/Default nesting).
export const Space: Story = {
  render: () => (
    <StoryDoc doc={spaceDoc} entityId="foundation.space">
      <SpaceScale />
    </StoryDoc>
  ),
};
