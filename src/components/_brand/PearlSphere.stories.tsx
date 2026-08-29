import type { Meta, StoryObj } from '@storybook/react-vite';
import { PearlSphere } from './PearlSphere';

/**
 * Pearl's brand object — the one surface allowed to animate at rest (the
 * `brandSphere` role, `{ on: 'brandObject', trigger: 'ambient' }`, in
 * `pearl.roles.ts`). A
 * sheen sweeps across it on a continuous loop (`orbSpeed`); compare against
 * `Components/Card`'s `LinkCard` story, whose glow only appears on hover and
 * never loops — "the sphere loops; cards do not."
 */
const meta: Meta<typeof PearlSphere> = {
  title: 'Brand/Pearl Sphere',
  component: PearlSphere,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof PearlSphere>;

function PearlSphereCentered() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <PearlSphere />
    </div>
  );
}

export const Sphere: Story = {
  render: () => <PearlSphereCentered />,
};
