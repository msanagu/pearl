import type { Meta, StoryObj } from '@storybook/react-vite';
import { Footer } from './Footer';
import footerSource from './Footer.tsx?raw';
import { templateSource } from '@/templates/templateSource';
import { brandWordmarkForTheme } from '@components/_brand/WordMark/brandWordmark';
import { footerPlateForTheme } from './footerPlate';

/**
 * The closing colophon, composed from `Text`, `Link`, `Row`, and `WordMark`.
 * Two things vary per theme, resolved here from the Storybook toolbar's active
 * theme: the wordmark (text + whether `inlineEmphasis` decorates it, via each
 * theme's `*BrandWordmark`) and the plate photo (`footerPlate.ts` — a nacre
 * image chosen to match the theme's palette). Everything else, the name story
 * included, is fixed.
 */
const meta: Meta<typeof Footer> = {
  title: 'Templates/Footer',
  component: Footer,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme as string | undefined;
      const wordmark = brandWordmarkForTheme(theme);
      const plate = footerPlateForTheme(theme);
      return (
        <Story
          args={{
            brandName: context.args.brandName ?? wordmark.text,
            brandRole: context.args.brandRole ?? wordmark.role,
            brandUnderscoreColor:
              context.args.brandUnderscoreColor ?? wordmark.underscoreColor,
            plateImageSrc: context.args.plateImageSrc ?? plate.src,
            plateImageAlt: context.args.plateImageAlt ?? plate.alt,
          }}
        />
      );
    },
  ],
};
export default meta;

type Story = StoryObj<typeof Footer>;

export const Overview: Story = {
  // Story level, not meta — see `templateSource`.
  parameters: templateSource(footerSource),
};
