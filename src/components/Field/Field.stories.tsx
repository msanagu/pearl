import type { Meta, StoryObj } from '@storybook/react-vite';
import { Field } from './Field';
import { Input } from '../Input';

const meta: Meta<typeof Field> = {
  title: 'Components/Field',
  component: Field,
  tags: ['autodocs'],
  args: {
    label: 'Email',
  },
};
export default meta;

type Story = StoryObj<typeof Field>;

export const Default: Story = {
  render: (args) => (
    <div style={{ maxWidth: 340 }}>
      <Field {...args}>{(props) => <Input type="email" {...props} />}</Field>
    </div>
  ),
};

export const WithHint: Story = {
  args: { hint: "We'll never share your email." },
  render: (args) => (
    <div style={{ maxWidth: 340 }}>
      <Field {...args}>{(props) => <Input type="email" {...props} />}</Field>
    </div>
  ),
};

export const WithError: Story = {
  args: { label: 'ZIP code', error: 'Enter a 5-digit ZIP code.' },
  render: (args) => (
    <div style={{ maxWidth: 340 }}>
      <Field {...args}>
        {(props) => (
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]{5}"
            maxLength={5}
            defaultValue="9021A"
            {...props}
          />
        )}
      </Field>
    </div>
  ),
};

// Hint stays associated in `aria-describedby` alongside the error — both
// ids feed the input at once, not either/or.
export const WithHintAndError: Story = {
  args: {
    hint: "We'll never share your email.",
    error: 'Enter a valid email address.',
  },
  render: (args) => (
    <div style={{ maxWidth: 340 }}>
      <Field {...args}>
        {(props) => <Input type="email" defaultValue="not-an-email" {...props} />}
      </Field>
    </div>
  ),
};
