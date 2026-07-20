import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from './Text';

/**
 * Token-driven typography. One component spans body → heading → display via
 * `variant`, while `as` picks the semantic element **independently** — so an
 * `h2` can look restrained and a visually-large label never forces a wrong
 * heading level.
 */
const meta: Meta<typeof Text> = {
  title: 'Components/Text',
  component: Text,
  tags: ['autodocs'],
  args: {
    children: 'The quick brown fox jumps over the lazy dog',
    variant: 'bodyMd',
    prominence: 'default',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: [
        'caption', 'bodySm', 'bodyMd', 'bodyLg',
        'headingSm', 'headingMd', 'headingLg',
        'displaySm', 'displayLg',
      ],
      description: 'Type-scale step (size + line-height + default weight).',
    },
    role: {
      control: 'select',
      options: [undefined, 'inlineEmphasis', 'label', 'numeric'],
      description: 'A theme-owned typographic job — mutually exclusive with variant.',
    },
    prominence: {
      control: 'radio',
      options: ['default', 'subtle'],
    },
    as: {
      control: 'text',
      description: 'Semantic element — chosen independently of variant.',
    },
  },
};
export default meta;

type Story = StoryObj<typeof Text>;

export const Playground: Story = {};

export const Scale: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {(
        ['displayLg', 'displaySm', 'headingLg', 'headingMd', 'headingSm', 'bodyLg', 'bodyMd', 'bodySm', 'caption'] as const
      ).map((v) => (
        <Text key={v} variant={v} as="p">
          {v} — The quick brown fox
        </Text>
      ))}
    </div>
  ),
};

/** Visual variant and semantic element are independent — both of these are h2s. */
export const VariantVsElement: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Text variant="headingSm" as="h2">headingSm as h2 (prominent section)</Text>
      <Text variant="bodyMd" as="h2">bodyMd as h2 (quiet section label)</Text>
    </div>
  ),
};

/**
 * `role` targeting resolved live, in whichever theme is active in the
 * toolbar — switch themes to see it change. Pearl defines `inlineEmphasis`
 * (serif italic) and `label` (mono caps at the `caption` step); a theme with
 * no assignment for a role falls back to canon `bodyMd`, silently.
 */
export const Roles: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Text variant="bodyLg" as="p">
        The world is your <Text as="span" role="inlineEmphasis">oyster</Text>.
      </Text>
      <Text role="label" as="span">Plate 01 / Nacre</Text>
      <Text role="numeric" as="span">1,204.50</Text>
    </div>
  ),
};

export const Prominence: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Text prominence="default">Default prominence — primary content.</Text>
      <Text prominence="subtle">Subtle prominence — captions, metadata, helper text.</Text>
    </div>
  ),
};
