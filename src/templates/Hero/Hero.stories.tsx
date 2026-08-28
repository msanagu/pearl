import type { Meta, StoryObj } from '@storybook/react-vite';
import { Hero } from './Hero';
import heroSource from './Hero.tsx?raw';
import { templateSource } from '../templateSource';
import { pearlBrandWordmark } from '../../themes/pearl.roles';
import { tahitianBrandWordmark } from '../../themes/tahitian.roles';
import { southSeaBrandWordmark } from '../../themes/south-sea.roles';

/**
 * The marketing hero, composed from existing primitives (`Text`, `Button`,
 * `Row`, `Stack`, `Icon`). The brand wordmark is the one piece that differs
 * per theme (text + whether `inlineEmphasis` decorates it) — driven here by
 * the Storybook toolbar's active theme, via each theme's own
 * `*BrandWordmark` in `*.roles.ts`. Freshwater has no role table yet, so it
 * falls back to Pearl's wordmark rather than fabricating one.
 *
 * GAP — the sphere visual (`PearlSphere`) is still Pearl-only; Tahitian's
 * hero currently reuses it under its own palette rather than a poster-plate
 * visual per 14a/14b.
 */
const brandWordmarkByTheme: Record<string, { text: string; role?: 'inlineEmphasis' }> = {
  pearl: pearlBrandWordmark,
  tahitian: tahitianBrandWordmark,
  southSea: southSeaBrandWordmark,
};

const meta: Meta<typeof Hero> = {
  title: 'Templates/Hero',
  component: Hero,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story, context) => {
      const theme = (context.globals.theme as string) ?? 'pearl';
      const wordmark = brandWordmarkByTheme[theme] ?? pearlBrandWordmark;
      return (
        <Story
          args={{
            brandName: context.args.brandName ?? wordmark.text,
            brandRole: context.args.brandRole ?? wordmark.role,
          }}
        />
      );
    },
  ],
};
export default meta;

type Story = StoryObj<typeof Hero>;

export const Overview: Story = {
  // Story level, not meta — see `templateSource`.
  parameters: templateSource(heroSource),
};
