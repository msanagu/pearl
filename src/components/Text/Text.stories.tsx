import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from './Text';

/**
 * Token-driven typography. `typeScale` (size), `role` (theme-owned face),
 * `as` (semantic element), and `weight` are four **independent** axes — so an
 * `h2` can look restrained, a role can ride a larger scale step than its
 * default, and a visually-large label never forces a wrong heading level.
 */
const meta: Meta<typeof Text> = {
  title: 'Components/Text',
  component: Text,
  tags: ['autodocs'],
  args: {
    children: 'The quick brown fox jumps over the lazy dog',
    typeScale: 'bodyMd',
    prominence: 'default',
  },
  argTypes: {
    typeScale: {
      control: 'select',
      options: [
        'caption', 'bodySm', 'bodyMd', 'bodyLg',
        'headingSm', 'headingMd', 'headingLg',
        'displaySm', 'displayLg',
      ],
      description: 'Size band: fontSize + lineHeight + tracking, and the default face when no `role` is set.',
    },
    role: {
      control: 'select',
      options: [undefined, 'inlineEmphasis', 'preheading', 'dataDigits'],
      description: 'A theme-owned face treatment — independent of `typeScale`, combine freely.',
    },
    weight: {
      control: 'select',
      options: [undefined, 'regular', 'medium', 'semibold', 'bold'],
      description: "Overrides the scale step's default weight.",
    },
    prominence: {
      control: 'radio',
      options: ['default', 'subtle'],
    },
    as: {
      control: 'text',
      description: 'Semantic element — chosen independently of typeScale/role.',
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
        <Text key={v} typeScale={v} as="p">
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
      <Text typeScale="headingSm" as="h2">headingSm as h2 (prominent section)</Text>
      <Text typeScale="bodyMd" as="h2">bodyMd as h2 (quiet section label)</Text>
    </div>
  ),
};

/**
 * `role` targeting resolved live, in whichever theme is active in the
 * toolbar — switch themes to see it change. Pearl defines `inlineEmphasis`
 * (serif italic, no declared size — rides whatever `typeScale` it's set in,
 * or ambient size with none) and `preheading` (mono caps, defaults to the
 * `caption` step).
 */
export const Roles: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <Text typeScale="bodyLg" as="p">
        The world is your <Text as="span" role="inlineEmphasis">oyster</Text>.
      </Text>
      <Text role="preheading" as="span">Plate 01 / Nacre</Text>
      <Text role="dataDigits" as="span">1,204.50</Text>
    </div>
  ),
};

/**
 * `typeScale` and `role` are independent axes and compose freely — a role's
 * face doesn't lock in its default size. This is the case that motivated the
 * split: the Hero's ordinal numbers (`01`, `02`...) needed `preheading`'s
 * mono/tracking treatment at a much larger size than its `caption` default.
 */
export const RoleAtLargerScale: Story = {
  render: () => (
    <Text role="preheading" typeScale="headingLg" as="span">01</Text>
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
