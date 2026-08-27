import type { Meta, StoryObj } from '@storybook/react-vite';
import { Hero } from './Hero';

/**
 * The Pearl marketing hero, composed from existing primitives (`Text`,
 * `Button`, `Row`, `Stack`, `Icon`). Consumed as a real component by the
 * landing/docs POC (`pages/LandingPoc`). Gaps where the system has no home
 * yet — the luster sphere, a full-bleed layout primitive, a `measure` prop on
 * `Text` — are flagged inline in `Hero.tsx` rather than smoothed over.
 */
const meta: Meta<typeof Hero> = {
  title: 'Sections/Hero',
  component: Hero,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof Hero>;

export const Overview: Story = {};

/** As embedded in the docs shell: the shell owns the sticky nav, so the hero drops its own. */
export const WithoutNav: Story = {
  args: { showNav: false },
};
