import type { Meta, StoryObj } from '@storybook/react-vite';
import { WordMark } from './WordMark';
import { brandWordmarkForTheme } from './brandWordmark';

/**
 * The nav wordmark — text plus whether `inlineEmphasis` decorates it. Driven
 * here by the Storybook toolbar's active theme, via each theme's own
 * `*BrandWordmark` in `*.roles.ts` (`brandWordmark.ts`). Compare against
 * `Templates/Hero`, whose `HeroNav` renders this same component.
 */
const meta: Meta<typeof WordMark> = {
  title: 'Brand/Word Mark',
  component: WordMark,
  tags: ['autodocs'],
  decorators: [
    (Story, context) => {
      const wordmark = brandWordmarkForTheme(
        context.globals.theme as string | undefined,
      );
      return (
        <Story
          args={{
            text: context.args.text ?? wordmark.text,
            role: context.args.role ?? wordmark.role,
            // Dropped here previously — the decorator forwarded `text`/`role`
            // but not `underscoreColor`, so this story's own Freshwater
            // example fell back to `color.accent` (a duller blue,
            // `glacier[500]`) instead of the theme's real `glacier[200]`.
            // The component's own canonical docs page was the one place
            // NOT showing the wordmark it documents correctly.
            underscoreColor:
              context.args.underscoreColor ?? wordmark.underscoreColor,
          }}
        />
      );
    },
  ],
};
export default meta;

type Story = StoryObj<typeof WordMark>;

export const Default: Story = {};
