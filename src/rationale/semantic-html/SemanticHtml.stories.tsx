import type { Meta, StoryObj } from '@storybook/react-vite';
import { Text } from '@components/Text/Text';

/**
 * Rationale, not a component demo: defer to a native HTML element/attribute
 * wherever one already provides the needed semantics/behavior, instead of
 * reimplementing it with ARIA and JavaScript.
 *
 * Agent-facing content lives in SemanticHtml.doc.ts, feeding the manifest
 * directly — no StoryDoc human page yet, held off deliberately.
 */
function SemanticHeaderDemo() {
  return (
    <header>
      <Text role="contextLabel" as="p">
        A design system for identities that refuse sameness
      </Text>
      <Text as="h1" typeScale="displayMd">
        Pearl
      </Text>
    </header>
  );
}

const meta: Meta<typeof SemanticHeaderDemo> = {
  title: 'Rationale/Semantic HTML',
  component: SemanticHeaderDemo,
};
export default meta;

type Story = StoryObj<typeof SemanticHeaderDemo>;

export const Default: Story = {};
