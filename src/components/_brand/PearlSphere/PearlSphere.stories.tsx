import type { Meta, StoryObj } from '@storybook/react-vite';
import { PearlSphere } from './PearlSphere';

/** Pearl's brand object — the only surface that animates at rest (`brandSphere` role in `pearl.roles.ts`). */
const meta: Meta<typeof PearlSphere> = {
  title: 'Brand/Pearl Sphere',
  component: PearlSphere,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <Story />
      </div>
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof PearlSphere>;

export const Sphere: Story = {};
