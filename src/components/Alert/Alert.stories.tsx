import type { Meta, StoryObj } from '@storybook/react-vite';
import { Alert } from './Alert';
import { Stack } from '../Stack/Stack';

/**
 * Inline, persistent feedback keyed by valence (`positive`/`negative`/`warn`/
 * `info`) — the same sentiment tokens used for metrics and diffs elsewhere.
 * Severity lives entirely in `variant`; there's no separate component for
 * "informational" vs "urgent" messages.
 */
const meta: Meta<typeof Alert> = {
  title: 'Components/Alert',
  component: Alert,
  tags: ['autodocs'],
  args: {
    heading: 'Payment failed',
    children: 'Your card was declined. Try a different payment method.',
  },
};
export default meta;

type Story = StoryObj<typeof Alert>;

export const Positive: Story = {
  args: { variant: 'positive', heading: 'Changes saved', children: 'Your profile has been updated.' },
};

export const Negative: Story = {
  args: { variant: 'negative' },
};

export const Warn: Story = {
  args: { variant: 'warn', heading: 'Scheduled maintenance', children: 'The service will be unavailable Tuesday 2–4am.' },
};

export const Info: Story = {
  args: { variant: 'info', heading: 'New feature', children: 'You can now export reports as CSV.' },
};

export const WithoutHeading: Story = {
  args: { heading: undefined, children: 'A shorter message with no lead-in.' },
};

export const Dismissible: Story = {
  args: { onDismiss: () => {} },
};

export const AllVariants: Story = {
  render: () => (
    <Stack gap="sm" style={{ maxWidth: 480 }}>
      <Alert variant="positive" heading="Changes saved">Your profile has been updated.</Alert>
      <Alert variant="negative" heading="Payment failed">Your card was declined.</Alert>
      <Alert variant="warn" heading="Scheduled maintenance">Service will be unavailable Tuesday.</Alert>
      <Alert variant="info" heading="New feature">Reports can now be exported as CSV.</Alert>
    </Stack>
  ),
};
