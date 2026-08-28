import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tag } from './Tag';
import { Row } from '../Row/Row';

/**
 * A static, non-interactive label. `neutral` for categorical tags (skills,
 * topics); the sentiment variants for status. Distinct from a future `Chip`
 * (interactive/dismissable) and a future `Badge` (a count or indicator
 * appended to another element) — same visual family, different interaction
 * model. See `docs/decisions` for the badge/chip/tag split rationale.
 */
const meta: Meta<typeof Tag> = {
  title: 'Components/Tag',
  component: Tag,
  tags: ['autodocs'],
  args: {
    children: 'Design systems',
  },
};
export default meta;

type Story = StoryObj<typeof Tag>;

export const Neutral: Story = {
  args: { variant: 'neutral' },
};

export const Positive: Story = {
  args: { variant: 'positive', children: 'Active' },
};

export const Negative: Story = {
  args: { variant: 'negative', children: 'Deprecated' },
};

export const Warn: Story = {
  args: { variant: 'warn', children: 'Beta' },
};

export const Info: Story = {
  args: { variant: 'info', children: 'New' },
};

export const CategoricalGroup: Story = {
  name: 'Categorical Group',
  render: () => (
    <Row gap="xs" wrap style={{ maxWidth: 360 }}>
      <Tag>Token architecture</Tag>
      <Tag>Theming infrastructure</Tag>
      <Tag>Component libraries</Tag>
      <Tag>Storybook</Tag>
      <Tag>Figma (plugin development)</Tag>
      <Tag>Chromatic</Tag>
    </Row>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <Row gap="sm" wrap>
      <Tag variant="neutral">Neutral</Tag>
      <Tag variant="positive">Positive</Tag>
      <Tag variant="negative">Negative</Tag>
      <Tag variant="warn">Warn</Tag>
      <Tag variant="info">Info</Tag>
    </Row>
  ),
};
