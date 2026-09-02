import type { Meta, StoryObj } from '@storybook/react-vite';
import { Dashboard } from './Dashboard';
import dashboardSource from './Dashboard.tsx?raw';
import { templateSource } from '@/templates/templateSource';

/**
 * A SaaS metrics dashboard built entirely from existing primitives (`Card`,
 * `Alert`, `Tag`, `Button`, `Row`/`Stack`, `Text`) plus two composition-level
 * gaps this system doesn't cover yet: a responsive grid (plain CSS with media
 * queries — no Grid primitive exists) and a data-viz chart fill (bars use the
 * sentiment `surface`/`border` sub-fields, so they render at alert-strength
 * tint rather than a saturated chart color).
 */
const meta: Meta<typeof Dashboard> = {
  title: 'Templates/Dashboard',
  component: Dashboard,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj<typeof Dashboard>;

export const Overview: Story = {
  // Story level, not meta — see `templateSource`.
  parameters: templateSource(dashboardSource),
};
