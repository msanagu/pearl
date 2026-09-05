import type { Meta, StoryObj } from '@storybook/react-vite';
import { space } from '@tokens';
import { Text } from '@components/Text/Text';
import { Stack } from '@components/Stack/Stack';
import { Row } from '@components/Row/Row';

/**
 * Foundations → Space: the soft sizing-grid mechanic — snap every raw pixel
 * size (spacing, radius, typography, a numeric prop like Icon.size) to the
 * active theme's own scale-token grid. Per-theme increment values live in
 * `spaceByTheme` below, not here — this page is the shared mechanic only.
 */

const STEPS = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

function ScaleBar({ step }: { step: (typeof STEPS)[number] }) {
  return (
    <Row gap="md" align="center">
      <div style={{ width: '4.5rem', flexShrink: 0 }}>
        <Text as="span" typeScale="bodySm">
          space.{step}
        </Text>
      </div>
      <div
        style={{
          height: 12,
          width: space[step],
          background: 'currentColor',
          borderRadius: 2,
        }}
      />
    </Row>
  );
}

function SpaceScale() {
  return (
    <Stack gap="sm">
      {STEPS.map((step) => (
        <ScaleBar key={step} step={step} />
      ))}
    </Stack>
  );
}

const meta: Meta<typeof SpaceScale> = {
  title: 'Foundations/Space',
  component: SpaceScale,
  parameters: {
    manifest: {
      name: 'sizingGrid',
      description:
        "The soft sizing-grid mechanic — snap every raw pixel size to the active theme's own scale-token grid; per-theme increment values live in each theme's own foundations entry.",
      sections: [
        {
          kind: 'definitions',
          for: 'agent',
          title:
            'The space scale (4px-based values — check each theme entry for its own increments)',
          items: [
            {
              term: 'xs',
              definition:
                '0.25rem (4px). Icon-to-label gaps, tight chip/badge padding. The one named half-step — used only for a stated reason, never the default increment.',
            },
            {
              term: 'sm',
              definition:
                '0.5rem (8px). Related inline elements, compact padding.',
            },
            {
              term: 'md',
              definition:
                '1rem (16px). Default component padding, standard rhythm.',
            },
            {
              term: 'lg',
              definition: '1.5rem (24px). Section spacing, card padding.',
            },
            { term: 'xl', definition: '2rem (32px). Major layout gaps.' },
            {
              term: '2xl',
              definition: '3rem (48px). Page-section separation.',
            },
          ],
        },
        {
          kind: 'guidelines',
          for: 'agent',
          title: 'The grid itself',
          items: [
            {
              level: 'must',
              statement:
                "Snap every raw pixel size (spacing, radius, fontSize, line-height, a numeric prop like Icon.size) to the active theme's own scale-token grid — check that theme's foundations entry (sizingGrid) for real increments, not a fixed 8px/4px. Increment values are per-theme (some themes use a larger base unit); the token names and the 'multiples of sm, xs for a named reason' rule are system-wide, the literal px values are not.",
            },
            {
              level: 'must',
              statement:
                'Author every step above xs as a clean multiple of sm — xs is a named escape hatch for cramped cases (icon-to-text gaps, badge padding), not a loophole for arbitrary values.',
            },
            {
              level: 'must',
              statement:
                "gap/padding enforce the grid at the type level (closed scale-token names) — an arbitrary number is a compile-time error, not a lint warning. Icon.size can't use a closed set, so it snaps to the nearest 4px and renders as rem, never raw px.",
            },
            {
              level: 'must',
              statement:
                "A calc() composed entirely from scale tokens (e.g. calc(space.sm + space.xs)) is on-system even with no type gate forcing it — legitimacy comes from every operand being a token. The same literal value (e.g. '12px') is off-system even at identical output: on-grid only in themes where it happens to land, and it drifts off-grid the moment a theme retunes density.",
            },
            {
              level: 'must',
              statement:
                'When composing across scales (e.g. max(space.md, radius.control)), every operand must still be a token — mixing rem and px is fine as long as both are tokens. Prefer a floor (max()) over addition: calc(radius.control + space.sm) stacks space even where padding already clears the radius; a floor only engages the larger term once needed.',
            },
            {
              level: 'must-not',
              statement:
                "Don't derive a value just because the operands are tokens — the test is whether a relationship actually exists. Field's label/hint/error insets were derived twice (from the control's padding, then from radius.control) and both were wrong: the label sits flush at zero, outside the box. A wrong derivation is worse than a literal — it looks principled.",
            },
            {
              level: 'must',
              statement:
                'Where elements stack, make the gap ratio communicate structure — an inner gap must be at least a full scale step smaller than the gap to what surrounds it. A preheading+heading sit at xs, the body after at md — four-to-one reads as grouping with no rule or box; adjacent steps (sm inside md) read as inconsistency.',
            },
          ],
        },
        {
          kind: 'steps',
          for: 'agent',
          title: 'Icon-to-text sizing',
          ordered: false,
          items: [
            {
              title:
                "Size the icon to the paired text's line-height (grid-aligned by the type scale, not font-size) — a bodySm label pairs with a matching-line-height icon. Gap is the theme's space.sm token, not a literal. Align to the line box, not cap-height.",
            },
          ],
        },
        {
          kind: 'section',
          for: 'agent',
          title: 'Units: rem, not px',
          body: "Spacing is rem, not px — it scales with a user's base font-size preference, not just zoom (WCAG SC 1.4.4). Browser zoom scales px/rem identically; they diverge only when someone raises base font size without zooming. px-pinned spacing stays fixed while rem text grows around it — overflowing buttons, cramped padding at larger sizes. rem math assumes a 16px root, set explicitly so it can't drift.",
        },
        {
          kind: 'section',
          for: 'agent',
          title: 'Enforcement, and where this cascades',
          body: "No type gate on internal .css.ts values — the composed-value rule (every operand a token) is what a no-raw-values lint would encode: a calc() of all vars.* references passes, any bare length literal fails.\n\nWhere it shows up: Stack/Row type gap against the scale; Card/Alert/Field default padding to a scale token (md); Button's height is controlHeight.md, the same token Input uses, so the two align in a row regardless of theme; Progress Bar (not yet built) is where xs earns its keep.",
        },
      ],
    },
  },
};
export default meta;

type Story = StoryObj<typeof SpaceScale>;

export const Tokens: Story = {};
