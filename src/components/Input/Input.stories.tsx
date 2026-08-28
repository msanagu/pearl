import type { Meta, StoryObj } from '@storybook/react-vite';
import { userEvent } from 'storybook/test';
import { Input } from './Input';

/**
 * A token-styled native `<input>`. These stories pair it with a plain
 * `<label>` directly — see the `Field` component's stories for the
 * label/hint/error-coordinated version.
 */
const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  args: {
    placeholder: 'you@studio.co',
  },
  argTypes: {
    disabled: { control: 'boolean' },
  },
};
export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  render: (args) => (
    <div style={{ maxWidth: 340 }}>
      <Input {...args} id="email-default" type="email" />
    </div>
  ),
};

/**
 * Tabs into the field via `play` rather than `autoFocus` — `:focus-visible`
 * (deliberately used over `:focus`, so a mouse click doesn't show a ring)
 * only matches keyboard-driven focus. A programmatic `.focus()` call (what
 * `autoFocus` does) doesn't reliably qualify; a real Tab keypress does.
 */
export const Focused: Story = {
  render: (args) => (
    <div style={{ maxWidth: 340 }}>
      <Input {...args} id="email-focused" type="email" />
    </div>
  ),
  play: async () => {
    await userEvent.tab();
  },
};

export const Invalid: Story = {
  args: { 'aria-invalid': true, defaultValue: 'not-an-email' },
  render: (args) => (
    <div style={{ maxWidth: 340 }}>
      <Input {...args} id="email-invalid" type="email" />
    </div>
  ),
};

export const Disabled: Story = {
  args: { disabled: true, defaultValue: 'you@studio.co' },
  render: (args) => (
    <div style={{ maxWidth: 340 }}>
      <Input {...args} id="email-disabled" type="email" />
    </div>
  ),
};
