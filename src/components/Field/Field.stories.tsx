import { useState } from 'react';
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

/**
 * `size` cascades control height and padding to a nested `Input` via CSS
 * custom properties — sm and md deliberately share padding (only lg steps
 * up); look closely and the difference between them is height alone.
 *
 * Shown side by side to compare, not as a pattern to copy: a real form picks
 * one size and every `Field` in it uses that size. Rendering three sizes
 * stacked, as this story does, is what NOT to ship — see the `size` prop's
 * own doc comment on `Field`.
 */
export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 340 }}>
      <Field {...args} label="Small" size="sm">
        {(props) => <Input type="email" {...props} />}
      </Field>
      <Field {...args} label="Medium" size="md">
        {(props) => <Input type="email" {...props} />}
      </Field>
      <Field {...args} label="Large" size="lg">
        {(props) => <Input type="email" {...props} />}
      </Field>
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

/**
 * `required` puts a `*` on the label and, separately, `required`/
 * `aria-required` on the control itself — the mark is decorative
 * (`aria-hidden`), so it's the control's own attributes doing the real work
 * for both native constraint validation and assistive tech.
 */
export const Required: Story = {
  args: { label: 'Full name', required: true },
  render: (args) => (
    <div style={{ maxWidth: 340 }}>
      <Field {...args}>{(props) => <Input type="text" {...props} />}</Field>
    </div>
  ),
};

const ZIP_PATTERN = /^[0-9]{5}$/;

/**
 * Live-validated: `error` clears the moment `ZIP_PATTERN` is satisfied, which
 * is what shows off `Field`'s contract — the error message, `aria-invalid`,
 * and `role="alert"` are all driven by whether `error` is truthy, so there is
 * no separate "valid" state to reconcile. Starts invalid (a letter in the
 * value) so the error is visible without the reader having to type first.
 */
function ZipCodeField(args: { label: string }) {
  const [value, setValue] = useState('9021A');
  const error = ZIP_PATTERN.test(value) ? undefined : 'Enter a 5-digit ZIP code.';

  return (
    <div style={{ maxWidth: 340 }}>
      <Field {...args} error={error}>
        {(props) => (
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]{5}"
            maxLength={5}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            {...props}
          />
        )}
      </Field>
    </div>
  );
}

export const WithError: Story = {
  args: { label: 'ZIP code' },
  render: (args) => <ZipCodeField label={args.label} />,
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
