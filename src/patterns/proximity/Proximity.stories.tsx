import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '@components/Stack/Stack';
import { Text } from '@components/Text/Text';
import { StoryDoc } from '@/storydoc/StoryDoc';
import { embedStory } from '@/storydoc/embedStory';
import StackUsageMeta, {
  GapRatio,
  gapRatioDescription,
} from '@components/Stack/Stack.usage.stories';
import { proximityDoc } from './Proximity.doc';

// Same story Components/Stack/Usage renders on its own page — embedded via
// composeStory, not hand-copied (see embedStory).
const EmbeddedGapRatio = embedStory(GapRatio, StackUsageMeta);

function ProximityDemo() {
  return (
    // id matched by the `demoSections` entry below — StoryDoc can't read a
    // title/anchor off live demo markup the way it does doc.sections, so the
    // page declares this one by hand (see StoryDocProps.demoSections).
    <Stack gap="md" id="gap-ratio">
      <Text as="p" typeScale="bodySm" prominence="subtle" measure="lg">
        {gapRatioDescription}
      </Text>
      <EmbeddedGapRatio />
    </Stack>
  );
}

const meta: Meta<typeof ProximityDemo> = {
  title: 'Patterns/Proximity',
  component: ProximityDemo,
  // Hidden until Patterns has ≥2 real examples; the guideline lives on
  // Components/Stack/Usage for now.
  tags: ['!dev'],
  parameters: {
    layout: 'fullscreen',
    removePreviewPadding: true,
  },
};
export default meta;

type Story = StoryObj<typeof ProximityDemo>;

// Two entries — demo, then the note section — earns Proximity the same
// rail layout every multi-section StoryDoc page gets (see StoryDoc's
// `hasRail`). Without one, this page renders at a different max-width than
// its rail-having siblings (Alignment, etc.), so the reader's content edge
// visibly shifts navigating between them.
const demoSections = [{ title: 'Gap ratio', id: 'gap-ratio' }];

export const Proximity: Story = {
  render: () => (
    <StoryDoc
      doc={proximityDoc}
      demoSections={demoSections}
      entityId="pattern.proximity"
    >
      <ProximityDemo />
    </StoryDoc>
  ),
};
