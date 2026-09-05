import type { Meta, StoryObj } from '@storybook/react-vite';
import { color } from '@tokens';
import { Stack } from '@components/Stack/Stack';
import { Text } from '@components/Text/Text';

/**
 * Foundations → Color/Inverse: `[data-inverse]` is a local, bounded polarity
 * flip on one subtree — orthogonal to `mode` (light/dark, global). Adding the
 * attribute is all a consumer does; every theme's own `.css.ts` wires the
 * actual flip globally via `inverse.ts`'s `inverseOverride(...)`.
 */
function InverseDemo() {
  return (
    <Stack gap="lg">
      <div style={{ background: color.background, padding: 24 }}>
        <Text as="p" style={{ color: color.text }}>
          Ambient mode — ordinary token names.
        </Text>
      </div>
      <div data-inverse style={{ background: color.background, padding: 24 }}>
        <Text as="p" style={{ color: color.text }}>
          Same token names, inside <code>[data-inverse]</code> — every value
          above resolves to the other mode automatically.
        </Text>
      </div>
    </Stack>
  );
}

const meta: Meta<typeof InverseDemo> = {
  title: 'Foundations/Color/Inverse',
  component: InverseDemo,
  parameters: {
    manifest: {
      name: 'inverseConvention',
      description:
        "mode (light/dark) and inverse ([data-inverse]) are orthogonal axes — most tokens auto-flip inside an inverse container, border tokens don't.",
      sections: [
        {
          kind: 'guidelines',
          title: 'Inverse convention',
          for: 'agent',
          items: [
            {
              level: 'must',
              statement:
                'Treat mode (light/dark, global — which *LightThemeClass/*DarkThemeClass is applied to the whole tree) and inverse ([data-inverse], a local, bounded polarity flip on one subtree) as orthogonal axes. Describe an inverse container as "the inverse container," not "the dark version" — which mode it resolves to depends on whichever mode is currently active.',
            },
            {
              level: 'must-not',
              statement:
                "Don't conflate the two axes — an inverse container always renders as if the theme's other mode were active there, without touching the global mode.",
            },
            {
              level: 'must',
              statement:
                "Add data-inverse to a container, then use ordinary token names inside it (color.background, color.text, color.icon, color.accent, color.positive.icon, etc.) — they resolve to the other mode's values automatically, including on the element carrying the attribute itself.",
            },
            {
              level: 'must-not',
              statement:
                "Don't rely on auto-flip for border/borderStrong/borderSubtle — they do NOT flip inside [data-inverse], unlike the other tokens. Reach for color.borderInverse explicitly when drawing a border against or inside an inverse surface.",
            },
          ],
        },
        {
          kind: 'steps',
          title: 'Inverse convention verification',
          for: 'agent',
          ordered: false,
          items: [
            {
              title:
                "When adding a theme or a new color-contract key, extend inverseOverride(...)'s two calls with that key. Verify the value sources from the theme's own other-mode already-defined value — never a fresh color invented for the inverse case.",
            },
          ],
        },
      ],
    },
  },
};
export default meta;

type Story = StoryObj<typeof InverseDemo>;

export const Default: Story = {};
