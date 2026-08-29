import type { Meta, StoryObj } from '@storybook/react-vite';
import { Introduction } from './Introduction';
import introductionSource from './Introduction.tsx?raw';
import { templateSource } from '@/templates/templateSource';
import { overtonePlate } from '@themes/tahitian/tahitian.css';

/**
 * The system's front door — what Pearl is, the decisions that shape it, and
 * where to go next. Pinned to the top of the sidebar via the `storySort`
 * order in `.storybook/preview.tsx`.
 *
 * Composed from shipped primitives only, so it doubles as a specimen of the
 * system it introduces. "Show code" is the page's own source.
 */
const meta: Meta<typeof Introduction> = {
  title: 'Introduction',
  component: Introduction,
  parameters: { layout: 'fullscreen', removePreviewPadding: true },
  decorators: [
    // The index plate's treatment is theme-owned, so it is selected here from
    // the toolbar's active theme rather than inside the page — the same shape
    // as `Hero.stories`' per-theme wordmark. Themes with no plate treatment
    // pass nothing and the plate stays a plain inverse surface.
    (Story, context) => (
      <Story
        args={{
          plateTreatment:
            context.args.plateTreatment ??
            (context.globals.theme === 'tahitian' ? overtonePlate : ''),
        }}
      />
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof Introduction>;

export const Overview: Story = {
  // Story level, not meta — see `templateSource`.
  parameters: templateSource(introductionSource),
};
