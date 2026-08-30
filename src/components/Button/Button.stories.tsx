import type { Meta, StoryObj } from '@storybook/react-vite';
import { PiCaretDown, PiFloppyDisk } from 'react-icons/pi';
import { Icon } from '@components/Icon';
import { Button } from './Button';

/**
 * A native `<button>` with a token-driven `variant`. Renders
 * `data-component="button"` so downstream teams can target it via the
 * documented override contract (see docs/foundations/override-patterns.md) instead of
 * reaching for internal class names.
 *
 * Compose icons directly as children — Button lays out `children` via
 * internal flex + a token gap, so there's no `icon`/`iconPosition` prop
 * (composition over configuration, per docs/foundations/component-philosophy.md).
 */
const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Button',
    variant: 'primary',
  },
  argTypes: {
    variant: {
      control: 'radio',
      options: ['primary', 'secondary'],
      description:
        'Visual style. `primary` for the main call-to-action per surface, `secondary` for supporting actions.',
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

/**
 * `secondary` carries a visible border in its **resting** state — in every
 * theme and every mode — not only on hover.
 *
 * Two reasons, both documented in
 * docs/foundations/control-affordances.md:
 *
 * 1. **It makes the button alignable.** The box is wider than the label by
 *    its horizontal padding. With no resting edge that padding is invisible,
 *    so the only thing to align against is the glyphs — and a button aligned
 *    by its glyphs sits `space.lg` proud of the column once its real edge
 *    appears.
 * 2. **It keeps buttons distinct from links.** A control that is bare text
 *    until you touch it reads as a link; once bare text is sometimes a
 *    button, neither affordance is trustworthy anywhere on the page.
 *
 * For a genuinely text-only action, ask for link affordances (underline or
 * accent color at rest) — not a button variant with its edges removed.
 */
export const Secondary: Story = {
  args: { variant: 'secondary' },
};

export const Disabled: Story = {
  args: { disabled: true },
};

/**
 * Icon-plus-text composition, both orders, to prove the no-prop layout
 * contract — Button lays out `children` via flex + gap, so no
 * `icon`/`iconPosition` prop is needed.
 */
export const WithIcon: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 12 }}>
      <Button {...args}>
        <Icon icon={PiFloppyDisk} size={16} />
        Save
      </Button>
      <Button {...args} variant="secondary">
        Open Menu
        <Icon icon={PiCaretDown} size={16} />
      </Button>
    </div>
  ),
};
