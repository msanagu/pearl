import type { Meta, StoryObj } from '@storybook/react-vite';
import { Card } from '@components/Card/Card';
import { Text } from '@components/Text/Text';
import { myFeatureCard } from './OverrideContract.css';

/**
 * Rationale, not a component demo: the data-component/data-part/data-variant
 * override contract (ADR-0003) — the sanctioned way to extend past a
 * documented variant, never inline styles or internal classes.
 *
 * Agent-facing content lives in OverrideContract.doc.ts, feeding the
 * manifest directly — no StoryDoc human page yet, held off deliberately.
 */
function OverrideDemo() {
  return (
    <div className={myFeatureCard}>
      <Card>
        <Card.Header>
          <Text as="h3" typeScale="headingSm">
            Overridden header
          </Text>
        </Card.Header>
        <Card.Body>
          <Text as="p">
            The uppercase transform above targets{' '}
            <code>[data-component=&quot;card&quot;][data-part=&quot;header&quot;]</code>{' '}
            — Card's own internal class names are never referenced.
          </Text>
        </Card.Body>
      </Card>
    </div>
  );
}

const meta: Meta<typeof OverrideDemo> = {
  title: 'Rationale/Override Contract',
  component: OverrideDemo,
};
export default meta;

type Story = StoryObj<typeof OverrideDemo>;

export const Default: Story = {};
