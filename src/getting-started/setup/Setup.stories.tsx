import type { Meta, StoryObj } from '@storybook/react-vite';
import { StoryDoc } from '@/storydoc/StoryDoc';
import type { StoryDoc as StoryDocData } from '@/storydoc/types';
import { SetupDemo } from './Setup';

const setupDoc: StoryDocData = {
  name: 'setup',
  heading: 'Setup',
  overview:
    'Install the package, apply a theme, and wire up the pieces that need a decision. Six steps, most of them optional.',
  sections: [],
};

const DEMO_SECTIONS = [
  { title: 'Install', id: 'install' },
  { title: 'Applying a theme', id: 'theme' },
  { title: 'Icon sets', id: 'icons' },
  { title: 'Fonts', id: 'fonts' },
  { title: 'Extension classes', id: 'extension' },
  { title: 'Next steps', id: 'next' },
];

/**
 * Practical install/wiring reference — sits beside Introduction, doesn't
 * replace it. No motion, no hero: this page answers "what do I run and what
 * do I render," once, plainly. Same `<StoryDoc>` shell as
 * Foundations/Iconography and Foundations/Radius, not a bespoke page.
 */
const meta: Meta = {
  title: 'Getting Started/Setup',
  parameters: { layout: 'fullscreen', removePreviewPadding: true },
};
export default meta;

type Story = StoryObj;

// Named to match the title's last segment so Storybook collapses the group
// into a single sidebar entry (no Setup/Default nesting).
export const Setup: Story = {
  render: () => (
    <StoryDoc doc={setupDoc} demoSections={DEMO_SECTIONS}>
      <SetupDemo />
    </StoryDoc>
  ),
};
