import type { Meta, StoryObj } from '@storybook/react-vite';
import { Hero } from './Hero';
import { SiteHeader } from '@/templates/SiteHeader/SiteHeader';
import heroSource from './Hero.tsx?raw';
import { templateSource } from '@/templates/templateSource';
import { brandWordmarkForTheme } from '@components/_brand/WordMark/brandWordmark';

/**
 * The marketing hero — the pitch band and feature strip — composed from
 * `Text`, `Button`, `Row`, and `Stack`. The masthead above it is its own
 * template (`SiteHeader`); the story renders both so it reads as a real page
 * top, with the per-theme wordmark driven by the toolbar's active theme.
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
      const wordmark = brandWordmarkForTheme(
        context.globals.theme as string | undefined,
      );
      return (
        <>
          <SiteHeader
            brandName={wordmark.text}
            brandRole={wordmark.role}
            brandUnderscoreColor={wordmark.underscoreColor}
          />
          <Story />
        </>
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
