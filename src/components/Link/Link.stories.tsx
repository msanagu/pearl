import type { Meta, StoryObj } from '@storybook/react-vite';
import { Link } from './Link';
import { Text } from '@components/Text/Text';
import { Row } from '@components/Row/Row';

/**
 * Bare text with an underline — the navigation affordance. Underlined at rest
 * and underlined on hover: the rule is what marks the text as a link, so it
 * never goes away. Size and weight are inherited, so a Link set inside a
 * caption or a heading takes that context's type rather than imposing its own.
 */
const meta: Meta<typeof Link> = {
  title: 'Components/Link',
  component: Link,
  tags: ['autodocs'],
  args: {
    children: 'Read the documentation',
    href: '#',
  },
};
export default meta;

type Story = StoryObj<typeof Link>;

export const Default: Story = {};

export const Inline: Story = {
  name: 'Inline',
  render: () => (
    <Text as="p" measure="md">
      Every control in this system states its affordance at rest. The full
      reasoning lives in the <Link href="#">Link component documentation</Link>,
      alongside the table that splits buttons from links.
    </Text>
  ),
};

export const InheritsAmbientType: Story = {
  name: 'Inherits Ambient Type',
  render: () => (
    <Row gap="lg" wrap>
      <Text typeScale="caption">
        Caption — <Link href="#">a link</Link>
      </Text>
      <Text typeScale="bodyMd">
        Body — <Link href="#">a link</Link>
      </Text>
      <Text typeScale="headingMd">
        Heading — <Link href="#">a link</Link>
      </Text>
    </Row>
  ),
};

export const External: Story = {
  args: {
    children: 'Vanilla Extract',
    href: 'https://vanilla-extract.style',
    target: '_blank',
    rel: 'noreferrer',
  },
};
