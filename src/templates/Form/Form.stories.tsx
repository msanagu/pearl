import type { Meta, StoryObj } from '@storybook/react-vite';
import { Form } from './Form';
import formSource from './Form.tsx?raw';
import { templateSource } from '../templateSource';

/**
 * A shipping-details form built entirely from existing primitives (`Field`,
 * `Input`, `Alert`, `Card`, `Button`, `Text`, `Stack`, `Row`) — real
 * `useState` values, submit-time validation, per-field `Field` errors, and a
 * page-level `Alert` summarizing the outcome. No `Select`/`Checkbox`/
 * `Radio`/`Textarea` exist in the system yet, so every field is deliberately
 * an `Input` rather than reaching for a control that isn't there.
 *
 * Try submitting empty, then fix one field at a time to see the error
 * summary count and inline `Field` errors update together.
 */
const meta: Meta<typeof Form> = {
  title: 'Templates/Form',
  component: Form,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof Form>;

export const Overview: Story = {
  // Story level, not meta — see `templateSource`.
  parameters: templateSource(formSource),
};
