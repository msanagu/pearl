import type { Meta, StoryObj } from '@storybook/react-vite';
import { Docs } from './Docs';
import docsSource from './Docs.tsx?raw';
import { templateSource } from '@/templates/templateSource';

/**
 * The documentation page template, composed from existing primitives
 * (`Text`, `Button`, `Row`, `Stack`) and tokens. "Show code" below is the
 * template's own source, so it stays in step with what renders.
 */
const meta: Meta<typeof Docs> = {
  title: 'Templates/Docs',
  component: Docs,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', removePreviewPadding: true },
};
export default meta;

type Story = StoryObj<typeof Docs>;

export const Overview: Story = {
  // Story level, not meta — see `templateSource`.
  parameters: templateSource(docsSource),
};
