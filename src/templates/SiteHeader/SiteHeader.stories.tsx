import type { Meta, StoryObj } from '@storybook/react-vite';
import { SiteHeader } from './SiteHeader';
import siteHeaderSource from './SiteHeader.tsx?raw';
import { templateSource } from '@/templates/templateSource';
import { brandWordmarkForTheme } from '@components/_brand/WordMark/brandWordmark';

/**
 * The persistent site masthead, composed from `WordMark`, `Link`, `Row`, and
 * `PearlSphere`. The wordmark is the one per-theme piece (text + whether
 * `inlineEmphasis` decorates it), resolved here from the toolbar's active
 * theme via each theme's `*BrandWordmark`.
 *
 * The introduction page wraps this in its own `AutoHideHeader` for sticky /
 * summon-on-scroll behavior — that motion layer is landing-page-only and does
 * not live here.
 */
const meta: Meta<typeof SiteHeader> = {
  title: 'Templates/SiteHeader',
  component: SiteHeader,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story, context) => {
      const wordmark = brandWordmarkForTheme(
        context.globals.theme as string | undefined,
      );
      return (
        <Story
          args={{
            brandName: context.args.brandName ?? wordmark.text,
            brandRole: context.args.brandRole ?? wordmark.role,
            brandUnderscoreColor:
              context.args.brandUnderscoreColor ?? wordmark.underscoreColor,
          }}
        />
      );
    },
  ],
};
export default meta;

type Story = StoryObj<typeof SiteHeader>;

export const Overview: Story = {
  // Story level, not meta — see `templateSource`.
  parameters: templateSource(siteHeaderSource),
};
