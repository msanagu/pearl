import type { Meta, StoryObj } from '@storybook/react-vite';
import { Hero } from './Hero';
import heroSource from './Hero.tsx?raw';
import { templateSource } from '../templateSource';
import { brandWordmarkForTheme } from '../../brand/brandWordmark';

/**
 * The marketing hero, composed from existing primitives (`Text`, `Button`,
 * `Row`, `Stack`, `Icon`). The brand wordmark is the one piece that differs
 * per theme (text + whether `inlineEmphasis` decorates it) — driven here by
 * the Storybook toolbar's active theme, via each theme's own
 * `*BrandWordmark` in `*.roles.ts`. Freshwater's (`freshwater.roles.ts`) is
 * wordmark-only — it has no full role table yet, unlike the other three.
 *
 * GAP — the sphere visual (`PearlSphere`) is still Pearl-only; Tahitian's
 * hero currently reuses it under its own palette rather than a poster-plate
 * visual per 14a/14b.
 */
const meta: Meta<typeof Hero> = {
  title: 'Templates/Hero',
  component: Hero,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story, context) => {
      const wordmark = brandWordmarkForTheme(context.globals.theme as string | undefined);
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
