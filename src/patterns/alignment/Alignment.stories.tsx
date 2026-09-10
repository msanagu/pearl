import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '@components/Stack/Stack';
import { Text } from '@components/Text/Text';
import { Link } from '@components/Link/Link';
import { StoryDoc } from '@/storydoc/StoryDoc';
import { embedStory } from '@/storydoc/embedStory';
import RowUsageMeta, {
  WithHeading,
  WithBodyText,
  withHeadingDescription,
  withBodyTextDescription,
} from '@components/Row/Row.usage.stories';
import { alignmentDoc } from './Alignment.doc';

// Same stories Components/Row/Usage renders on its own page — embedded via
// composeStory, not hand-copied, so the two can't drift (see embedStory).
const EmbeddedWithHeading = embedStory(WithHeading, RowUsageMeta);
const EmbeddedWithBodyText = embedStory(WithBodyText, RowUsageMeta);

// Ports in Row's own usage demos (and their descriptions) rather than
// re-deriving the same pairing — Tag is the concrete composed case today;
// see Components/Row's usage guidelines for the full statements and the
// token math behind them.
function AlignmentDemo() {
  return (
    <Stack gap="2xl">
      <Stack gap="md" id="pairing-across-a-size-gap">
        <Text as="h2" typeScale="headingSm">
          Pairing across a size gap
        </Text>
        <Text as="p" typeScale="bodySm" prominence="subtle" measure="lg">
          {withHeadingDescription}
        </Text>
        {/* No outer frame needed — each specimen inside carries its own
            do/dont boundary now, which already separates it from the page's
            own content. */}
        <EmbeddedWithHeading />
        <Link href="./?path=/docs/components-row-usage--docs#with-a-heading" target="_top">
          <Text as="span" typeScale="caption" prominence="subtle">
            See full example in Components/Row/Usage
          </Text>
        </Link>
      </Stack>
      <Stack gap="md" id="pairing-within-one-scale-step">
        <Text as="h2" typeScale="headingSm">
          Pairing within one scale step
        </Text>
        <Text as="p" typeScale="bodySm" prominence="subtle" measure="lg">
          {withBodyTextDescription}
        </Text>
        <EmbeddedWithBodyText />
        <Link href="./?path=/docs/components-row-usage--docs#with-body-text" target="_top">
          <Text as="span" typeScale="caption" prominence="subtle">
            See full example in Components/Row/Usage
          </Text>
        </Link>
      </Stack>
    </Stack>
  );
}

const meta: Meta<typeof AlignmentDemo> = {
  title: 'Patterns/Alignment',
  component: AlignmentDemo,
  // Hidden until Patterns has ≥2 real examples; the guideline lives on
  // Components/Row/Usage for now.
  tags: ['!dev'],
  parameters: {
    layout: 'fullscreen',
    removePreviewPadding: true,
  },
};
export default meta;

type Story = StoryObj<typeof AlignmentDemo>;

// StoryDoc can't read titles/anchors off AlignmentDemo's own markup — it
// declares them here, matching the ids AlignmentDemo sets on its own section
// wrappers, the same way every section StoryDoc renders natively gets one.
const demoSections = [
  { title: 'Pairing across a size gap', id: 'pairing-across-a-size-gap' },
  {
    title: 'Pairing within one scale step',
    id: 'pairing-within-one-scale-step',
  },
];

export const Alignment: Story = {
  render: () => (
    <StoryDoc
      doc={alignmentDoc}
      demoSections={demoSections}
      entityId="pattern.alignment"
    >
      <AlignmentDemo />
    </StoryDoc>
  ),
};
