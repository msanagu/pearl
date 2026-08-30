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
import { Link } from '@components/Link';
import { Text } from '@components/Text';
import { Stack } from '@components/Stack';
import { Row } from '@components/Row';
import { color } from '@tokens';

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

      <Row gap="sm" wrap align="center">
        <Tag variant="neutral">Neutral</Tag>
        <Tag variant="positive">Active</Tag>
        <Tag variant="negative">Deprecated</Tag>
        <Tag variant="warn">Beta</Tag>
        <Tag variant="info">New</Tag>
      </Row>

      <Row gap="lg" wrap>
        <Card href="#" style={{ flex: '1 1 300px' }}>
          <Card.Header>
            <Text typeScale="headingSm" as="h3">
              Profile
            </Text>
          </Card.Header>
          <Card.Body>
            <Text typeScale="bodyMd">
              Manage how your account appears to your team.
            </Text>
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
              {(injected) => (
                <Input placeholder="you@company.com" {...injected} />
              )}
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
          One contract, many themes
        </Text>
        <Text typeScale="headingMd" as="h3">
          Same markup, different skin
        </Text>
        <Text typeScale="bodyLg">
          Every value comes from the theme contract — swap the theme files, and
          the whole system reskins without touching a single component.
        </Text>
        <Text typeScale="bodySm" role="preheading">
          Foundations / 01
        </Text>
      </Stack>

      {/* Link is set in prose, not on its own line: it reads `color.accent` at
          body size, and the detector that matters for it is contrast against
          the surrounding text's own ground. Both states are rendered — the
          audit samples resting styles, so `accentHover` is exercised by the
          second one carrying it as its resting color. */}
      <Stack gap="sm">
        <Text as="p" typeScale="bodyMd" measure="md">
          A button performs an action; a link takes you somewhere else. See{' '}
          <Link href="#control-affordances">the control affordances note</Link>{' '}
          for the full reasoning, plus a table that splits the two apart.
        </Text>
        <Row gap="lg" wrap align="center">
          <Link href="#">Resting</Link>
          <Link href="#" style={{ color: color.accentHover }}>
            Hover
          </Link>
        </Row>
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
