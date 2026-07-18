import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from './Button';

/**
 * A native `<button>` with token-driven `variant`/`size`. Renders
 * `data-component="button"` so downstream teams can target it via the
 * documented override contract (see docs/override-patterns.md) instead of
 * reaching for internal class names.
 *
 * Compose icons directly as children — Button lays out `children` via
 * internal flex + a token gap, so there's no `icon`/`iconPosition` prop
 * (composition over configuration, per docs/component-philosophy.md).
 */
const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'md',
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['primary', 'secondary'],
      description:
        'Visual style. `primary` for the main call-to-action per surface, `secondary` for supporting actions.',
    },
    size: {
      control: 'radio',
      options: ['sm', 'md', 'lg'],
      description: 'Height on the 8px grid (32/40/48) — aligns with Field inputs.',
    },
    disabled: {
      control: 'boolean',
    },
  },
};
export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: { variant: 'primary' },
};

export const Secondary: Story = {
  args: { variant: 'secondary' },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <Button {...args} size="sm">
        Small
      </Button>
      <Button {...args} size="md">
        Medium
      </Button>
      <Button {...args} size="lg">
        Large
      </Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true },
};

/**
 * Icon-plus-text composition, both orders, to prove the no-prop layout
 * contract discussed for Icon+Button (docs/OPEN_QUESTIONS.md #12). `Icon`
 * itself doesn't exist yet (Phase 6) — this stands in with a plain span so
 * the layout mechanism (flex + gap) is visible today.
 */
export const WithIconPlaceholder: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Button {...args}>
        <span aria-hidden>💾</span>
        Save
      </Button>
      <Button {...args} variant="secondary">
        Open Menu
        <span aria-hidden>▾</span>
      </Button>
    </div>
  ),
};
