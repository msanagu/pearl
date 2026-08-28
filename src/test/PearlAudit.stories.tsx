import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { runImpeccableAudit } from './impeccablePlay';
import { StoryAudit } from './StoryAudit';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { Input } from '../components/Input';
import { Field } from '../components/Field';
import { Alert } from '../components/Alert';
import { Text } from '../components/Text';
import { Stack } from '../components/Stack';
import { Row } from '../components/Row';

/**
 * Pearl component audit — runs Impeccable's deterministic detectors against the
 * REAL rendered Pearl components (in headless chromium, via the Storybook vitest
 * addon), so layout/contrast/shadow rules actually fire. This is the "promote
 * Mode B to a CI gate" step: the same engine that grades the theme-builder
 * preview now grades the design system itself, attributing each finding to the
 * `data-component` it lands on.
 *
 * The `play` function fails with a grouped report if any non-advisory
 * anti-pattern is found, so `vitest --project=storybook` surfaces exactly what
 * Pearl needs to fix.
 */

// A representative sampler of Pearl's component surface at realistic width.
function PearlSampler() {
  return (
    <Stack gap="2xl" style={{ padding: 32, maxWidth: 960 }}>
      <Row gap="md" wrap align="center">
        <Button size="sm">Primary sm</Button>
        <Button>Primary md</Button>
        <Button size="lg">Primary lg</Button>
        <Button variant="secondary">Secondary</Button>
      </Row>

      <Row gap="lg" wrap>
        <Card style={{ flex: '1 1 300px' }}>
          <Card.Header>
            <Text typeScale="headingSm" as="h3">
              Profile
            </Text>
          </Card.Header>
          <Card.Body>
            <Text typeScale="bodyMd">Manage how your account appears to your team.</Text>
          </Card.Body>
        </Card>
        <Card style={{ flex: '1 1 300px' }}>
          <Card.Header>
            <Text typeScale="headingSm" as="h3">
              Billing
            </Text>
          </Card.Header>
          <Card.Body>
            <Field label="Work email" hint="We only use this for receipts.">
              {(injected) => <Input placeholder="you@company.com" {...injected} />}
            </Field>
          </Card.Body>
        </Card>
      </Row>

      <Stack gap="sm">
        <Alert variant="positive" heading="Saved">
          Your changes have been published.
        </Alert>
        <Alert variant="warn" heading="Heads up">
          Your trial ends in three days.
        </Alert>
        <Alert variant="negative" heading="Payment failed">
          We couldn't process your card.
        </Alert>
        <Alert variant="info" heading="New feature">
          Team workspaces are now available.
        </Alert>
      </Stack>

      <Stack gap="xs">
        <Text typeScale="displaySm" as="h2">
          Built to change
        </Text>
        <Text typeScale="headingMd" as="h3">
          A durable structure
        </Text>
        <Text typeScale="bodyLg">
          Pearl keeps its defaults quiet enough for information, then lets a distinctive undertone
          surface in the seams.
        </Text>
        <Text typeScale="bodySm" role="preheading">
          Foundations / 01
        </Text>
      </Stack>
    </Stack>
  );
}

const meta: Meta<typeof PearlSampler> = {
  title: 'Audit/Pearl',
  component: PearlSampler,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof PearlSampler>;

export const Components: Story = {
  render: () => (
    <StoryAudit>
      <PearlSampler />
    </StoryAudit>
  ),
  play: async ({ canvasElement }) => {
    const { count, text } = await runImpeccableAudit(canvasElement);
    // Locked gate: Pearl components must stay clean of Impeccable anti-patterns.
    expect(count, text).toBe(0);
  },
};
