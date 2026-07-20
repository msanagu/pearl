import type { Meta, StoryObj } from '@storybook/react-vite';
import { CaretDownIcon, FloppyDiskIcon, HeartIcon } from '@phosphor-icons/react';
import { Icon } from '../Icon';
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
      options: ['primary', 'secondary', 'tertiary'],
      description:
        'Visual style. `primary` for the main call-to-action per surface, `secondary` for supporting actions, `tertiary` for a text-only, low-emphasis action.',
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

export const Tertiary: Story = {
  args: { variant: 'tertiary' },
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
 * contract (docs/OPEN_QUESTIONS.md #12) — Button lays out `children` via
 * flex + gap, so no `icon`/`iconPosition` prop is needed.
 */
export const WithIcon: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Button {...args}>
        <Icon icon={FloppyDiskIcon} size={16} />
        Save
      </Button>
      <Button {...args} variant="secondary">
        Open Menu
         <Icon icon={CaretDownIcon} size={12} />
      </Button>
    </div>
  ),
};
