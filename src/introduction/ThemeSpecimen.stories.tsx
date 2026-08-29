import type { Meta, StoryObj } from '@storybook/react-vite';
import { ThemeSpecimen, specimenFor } from './ThemeSpecimen';

/**
 * The per-theme specimen the introduction page frames four times. Hidden from
 * the sidebar (`!dev`) — it is a fragment rendered inside another page, not a
 * destination of its own, but it must stay a real story so each frame can
 * address it by id with its own `globals`.
 */
const meta: Meta<typeof ThemeSpecimen> = {
  title: 'Introduction/Theme specimen',
  component: ThemeSpecimen,
  tags: ['!dev'],
  parameters: { layout: 'fullscreen', removePreviewPadding: true },
};
export default meta;

type Story = StoryObj<typeof ThemeSpecimen>;

export const Specimen: Story = {
  // Name and draft status are derived from the frame's own theme global rather
  // than passed as args, so the page only has to vary one thing in the URL.
  render: (_args, context) => {
    const specimen = specimenFor(context.globals.theme);
    return <ThemeSpecimen name={specimen.name} authored={specimen.authored} wordmark={specimen.wordmark} />;
  },
};
