import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { runImpeccableAudit } from './impeccablePlay';
import { StoryAudit } from './StoryAudit';
import { Button } from '@components/Button';
import { Card } from '@components/Card';
import { Input } from '@components/Input';
import { Field } from '@components/Field';
import { Alert } from '@components/Alert';
import { Tag } from '@components/Tag';
import { Text } from '@components/Text';
import { Stack } from '@components/Stack';
import { Row } from '@components/Row';

/**
 * Component audit — runs Impeccable's deterministic detectors against the REAL
 * rendered components (in headless chromium, via the Storybook vitest addon),
 * so layout/contrast/shadow rules actually fire. This is the "promote Mode B to
 * a CI gate" step: the same engine that grades the theme-builder preview now
 * grades the design system itself, attributing each finding to the
 * `data-component` it lands on.
 *
 * Theme-agnostic by design — the story renders under whatever the Theme/Mode
 * toolbar globals select, so the same gate covers every theme × mode pair.
 *
 * The `play` function fails with a grouped report if any non-advisory
 * anti-pattern is found, so `vitest --project=storybook` surfaces exactly what
 * needs to be fixed.
 */

// A representative sampler of the component surface at realistic width.
function ComponentSampler() {
  return (
    <Stack gap="2xl" style={{ padding: 32, maxWidth: 960 }}>
      <Row gap="md" wrap align="center">
        <Button>Primary</Button>
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

      <Row gap="sm" wrap align="center">
        <Tag variant="neutral">Neutral</Tag>
        <Tag variant="positive">Active</Tag>
        <Tag variant="negative">Deprecated</Tag>
        <Tag variant="warn">Beta</Tag>
        <Tag variant="info">New</Tag>
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
          Defaults stay quiet enough for information, then let the active theme surface in the
          seams.
        </Text>
        <Text typeScale="bodySm" role="preheading">
          Foundations / 01
        </Text>
      </Stack>
    </Stack>
  );
}

const meta: Meta<typeof ComponentSampler> = {
  title: 'Audit/Components',
  component: ComponentSampler,
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof ComponentSampler>;

export const Components: Story = {
  render: () => (
    <StoryAudit>
      <ComponentSampler />
    </StoryAudit>
  ),
  play: async ({ canvasElement }) => {
    const { count, text } = await runImpeccableAudit(canvasElement);
    // Locked gate: components must stay clean of Impeccable anti-patterns in every theme.
    expect(count, text).toBe(0);
  },
};
