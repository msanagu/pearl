import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, within } from 'storybook/test';
import { Text } from './Text';
import { measure as measureScale } from './Text.css';

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
    as: 'span',
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
      // A select, not free text: `as` feeds `createElement`, so an empty string
      // (which a text control invites the moment you clear it) throws rather
      // than rendering. The list is the set of elements Text is actually
      // documented for — drive it by document structure, never by size.
      control: 'select',
      options: [
        'span', 'p', 'div',
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
        'strong', 'em', 'label', 'figcaption', 'blockquote', 'li',
      ],
      description: 'Semantic element — chosen independently of typeScale/role.',
    },
    measure: {
      control: 'radio',
      options: [undefined, 'sm', 'md', 'lg'],
      description: 'Opt-in prose line-length cap. Unset means fill the container.',
    },
  },
};
export default meta;

type Story = StoryObj<typeof Text>;

export const Playground: Story = {};

/** Visual variant and semantic element are independent — both of these are h2s. */
export const VariantVsElement: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Text typeScale="headingSm" as="h2">headingSm as h2 (prominent section)</Text>
      <Text typeScale="bodyMd" as="h2">bodyMd as h2 (subtle section label)</Text>
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
 * `role` and `typeScale` are independent axes and compose freely — a role's
 * face doesn't lock in its size. `preheading` carries the mono/uppercase/tracked
 * treatment; the scale step decides how big it renders, and the role's own
 * `caption` size is only the default that applies when the caller names none.
 *
 * This is the case that motivated the split: the Hero's ordinal numbers
 * (`01`, `02`...) need `preheading`'s treatment far larger than that default.
 */
export const RoleAndScale: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'baseline', gap: 24 }}>
      <Text role="preheading" as="span" data-testid="role-default">01</Text>
      <Text role="preheading" typeScale="bodyLg" as="span" data-testid="role-bodyLg">01</Text>
      <Text role="preheading" typeScale="headingLg" as="span" data-testid="role-headingLg">01</Text>
    </div>
  ),
  // Regression lock. The theme sets the role's default size through a
  // `[data-role]` global whose class+attribute specificity outranks the recipe
  // class, so without the `:not([data-type-scale])` gate in the theme CSS every
  // one of these renders at caption and the axes silently stop being
  // independent — which is invisible in a snapshot but obvious here.
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const px = (id: string) =>
      Number.parseFloat(getComputedStyle(canvas.getByTestId(id)).fontSize);
    expect(px('role-bodyLg')).toBeGreaterThan(px('role-default'));
    expect(px('role-headingLg')).toBeGreaterThan(px('role-bodyLg'));
  },
};

export const Prominence: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <Text prominence="default">Default prominence — primary content.</Text>
      <Text prominence="subtle">Subtle prominence — captions, metadata, helper text.</Text>
    </div>
  ),
};

/**
 * `measure` caps line length for readability. The values are `ch` — the advance
 * of the `0` glyph, *not* a character — and in the body sans a `ch` runs ~1.4×
 * wider than the average lowercase letter, so the steps land on the classic
 * 45–75 character band rather than on their own face value.
 *
 * It is opt-in and independent of `as`: measure belongs to running prose, and a
 * `<p>` is just as often a one-line form hint, where a cap would be wrong.
 */
export const Measure: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      {(['sm', 'md', 'lg'] as const).map((step) => (
        <div key={step} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Text typeScale="caption" prominence="subtle" as="p">
            measure=&quot;{step}&quot; — {measureScale[step]}
          </Text>
          <Text typeScale="bodyMd" as="p" measure={step}>
            Not a doc that goes stale. A type the compiler checks. Every theme&rsquo;s rules
            are data — structured, queryable, and impossible to drift from what actually
            ships, which is the whole reason the contract lives in TypeScript.
          </Text>
        </div>
      ))}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Text typeScale="caption" prominence="subtle" as="p">
          unset — fills the container
        </Text>
        <Text typeScale="bodyMd" as="p">
          Not a doc that goes stale. A type the compiler checks. Every theme&rsquo;s rules
          are data — structured, queryable, and impossible to drift from what actually
          ships, which is the whole reason the contract lives in TypeScript.
        </Text>
      </div>
    </div>
  ),
};
