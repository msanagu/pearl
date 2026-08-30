import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from './Stack';
import { Row } from '@components/Row/Row';
import { color } from '@tokens';

/**
 * `Stack` (vertical) and `Row` (horizontal) are thin presets over one shared
 * flex primitive. `gap` is typed to the space scale — a raw number is a compile
 * error, so layout spacing stays on-system.
 */
const meta: Meta<typeof Stack> = {
  title: 'Components/Layout',
  component: Stack,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    gap: {
      control: 'select',
      options: ['xs', 'sm', 'md', 'lg', 'xl', '2xl'],
      description: 'Gap between children — space-scale token names only.',
    },
    align: {
      control: 'select',
      options: [undefined, 'start', 'center', 'end', 'stretch'],
    },
    justify: {
      control: 'select',
      options: [undefined, 'start', 'center', 'end', 'between'],
    },
  },
};
export default meta;

type Story = StoryObj<typeof Stack>;

const Box = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{
      padding: '12px 16px',
      background: color.surface,
      border: `1px solid ${color.border}`,
      borderRadius: 6,
      fontSize: 13,
    }}
  >
    {children}
  </div>
);

export const VerticalStack: Story = {
  args: { gap: 'md' },
  render: (args) => (
    <Stack {...args}>
      <Box>First</Box>
      <Box>Second</Box>
      <Box>Third</Box>
    </Stack>
  ),
};

export const HorizontalRow: Story = {
  render: () => (
    <Row gap="sm">
      <Box>One</Box>
      <Box>Two</Box>
      <Box>Three</Box>
    </Row>
  ),
};

/** Common form footer: right-aligned button row. */
export const RowJustifyEnd: Story = {
  render: () => (
    <Row gap="sm" justify="end">
      <Box>Cancel</Box>
      <Box>Save</Box>
    </Row>
  ),
};
