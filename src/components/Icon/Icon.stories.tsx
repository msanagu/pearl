import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  HeartIcon,
  SparkleIcon,
  ShieldCheckIcon,
  BellRingingIcon,
  WarningIcon,
  CompassIcon,
} from '@phosphor-icons/react';
import { Icon } from './Icon';
import { Row } from '../Row';
import { Stack } from '../Stack';
import { Text } from '../Text';

const iconMapping = {
  Heart: HeartIcon,
  Sparkle: SparkleIcon,
  ShieldCheck: ShieldCheckIcon,
  BellRinging: BellRingingIcon,
  Warning: WarningIcon,
  Compass: CompassIcon,
};

/**
 * Wraps a `@phosphor-icons/react` icon component. Renders
 * `data-component="icon"` for the override contract (see
 * docs/override-patterns.md).
 *
 * `weight="duotone"` recolors Phosphor's two SVG layers with canon tokens —
 * `color.accent` for the foreground shape, `color.negative.icon` (the
 * "alert" mark color) for the faint background shape — rather than
 * Phosphor's default of one color at two opacities. Both tokens exist on
 * every theme, so duotone works everywhere; Pearl (the flagship, and the
 * theme this doc site is pinned to) is where it's demonstrated first.
 */
const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
  tags: ['autodocs'],
  args: {
    // Stored as the mapping key (see `argTypes.icon` below); cast because
    // `IconProps.icon` is typed as the resolved component, not the key.
    icon: 'Heart' as unknown as typeof HeartIcon,
    weight: 'duotone',
    size: 32,
  },
  argTypes: {
    weight: {
      control: 'radio',
      options: ['thin', 'light', 'regular', 'bold', 'fill', 'duotone'],
    },
    // `icon` takes a Phosphor icon *component*, which has no readable string
    // form — without `mapping`, both the Controls addon and the "Show code"
    // panel dump the raw forwardRef object. Storing the key in args and
    // resolving it only at render time keeps both readable.
    icon: {
      control: 'select',
      options: Object.keys(iconMapping),
      mapping: iconMapping,
    },
  },
};
export default meta;

type Story = StoryObj<typeof Icon>;

export const Duotone: Story = {
  parameters: {
    docs: {
      source: {
        transform: (_code: string, storyContext: { initialArgs: Record<string, unknown> }) =>
          `<Icon icon={${String(storyContext.initialArgs.icon)}Icon} weight="${String(
            storyContext.initialArgs.weight,
          )}" size={${String(storyContext.initialArgs.size)}} />`,
      },
    },
  },
};

/** The same icons at every weight, for comparison against `duotone`. */
export const AllWeights: Story = {
  render: () => (
    <Stack gap="lg">
      {(['thin', 'light', 'regular', 'bold', 'fill', 'duotone'] as const).map((weight) => (
        <Row key={weight} gap="lg" align="center">
          <Text style={{ width: 80 }}>{weight}</Text>
          <Icon icon={HeartIcon} weight={weight} size={28} />
          <Icon icon={ShieldCheckIcon} weight={weight} size={28} />
          <Icon icon={BellRingingIcon} weight={weight} size={28} />
          <Icon icon={WarningIcon} weight={weight} size={28} />
        </Row>
      ))}
    </Stack>
  ),
};

/** Accent (foreground) + alert (background) recolor, across a small set of icons. */
export const DuotoneGallery: Story = {
  render: () => (
    <Row gap="lg">
      <Icon icon={HeartIcon} weight="duotone" size={40} />
      <Icon icon={SparkleIcon} weight="duotone" size={40} />
      <Icon icon={ShieldCheckIcon} weight="duotone" size={40} />
      <Icon icon={BellRingingIcon} weight="duotone" size={40} />
      <Icon icon={WarningIcon} weight="duotone" size={40} />
      <Icon icon={CompassIcon} weight="duotone" size={40} />
    </Row>
  ),
};
