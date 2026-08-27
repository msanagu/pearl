import { useState } from 'react';
import type { ComponentProps } from 'react';
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
    // Neutral, `info`-appropriate default copy — this is what any story
    // renders if it doesn't override heading/children/variant, so it must
    // match the default `variant` ('info'). "Payment failed" lived here
    // previously and leaked into Dismissible/WithoutHeading, which don't set
    // a variant: both rendered error copy inside an info-styled alert.
    heading: 'New feature',
    children: 'You can now export reports as CSV.',
  },
};
export default meta;

type Story = StoryObj<typeof Alert>;

export const Positive: Story = {
  args: { variant: 'positive', heading: 'Changes saved', children: 'Your profile has been updated.' },
};

export const Negative: Story = {
  args: { variant: 'negative', heading: 'Payment failed', children: 'Your card was declined. Try a different payment method.' },
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

/**
 * A no-op `onDismiss` renders the button but visibly does nothing when
 * clicked — Alert never removes itself; that's the consumer's state to own
 * (composition over configuration, ADR-0002). Real local state here so the
 * story demonstrates the actual contract, not just the button's presence.
 * Defined at module scope, not inline in `render` — a component defined
 * inside a render callback is a new identity every re-render, which remounts
 * it and silently discards `visible` the moment Storybook's controls trigger
 * a re-render.
 */
function DismissibleDemo(args: ComponentProps<typeof Alert>) {
  const [visible, setVisible] = useState(true);
  if (!visible) {
    return <p>Dismissed. Reload the story to see it again.</p>;
  }
  return <Alert {...args} onDismiss={() => setVisible(false)} />;
}

export const Dismissible: Story = {
  render: (args) => <DismissibleDemo {...args} />,
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
