import type { Meta, StoryObj } from '@storybook/react-vite';
import { Row } from './Row';
import { color } from '@tokens';

/**
 * `Row` is a thin horizontal preset over the shared flex primitive it shares
 * with `Stack`. `gap` is typed to the space scale — a raw number is a compile
 * error, so layout spacing stays on-system.
 */
const meta: Meta<typeof Row> = {
  title: 'Components/Row',
  component: Row,
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

type Story = StoryObj<typeof Row>;

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

export const HorizontalRow: Story = {
  args: { gap: 'sm' },
  render: (args) => (
    <Row {...args}>
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
