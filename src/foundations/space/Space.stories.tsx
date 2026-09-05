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
      <Text as="span" typeScale="bodySm" style={{ width: '3ch' }}>
        {step}
      </Text>
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
          title: 'The space scale (Pearl/Freshwater/South Sea values)',
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
                "Snap every raw pixel size a component exposes (spacing, radius, fontSize, line-height, a numeric prop like Icon.size) to the active theme's own scale-token grid — check that theme's foundations entry (concept sizingGrid) for its actual increment values rather than assuming a fixed 8px/4px. The scale is per-theme, not global: Tahitian's is 4px-based (xs 8px/sm 12px), the other three are 4px/8px — the token names and the 'multiples of sm, xs for a named reason' rule are what's system-wide, not the literal px values.",
            },
            {
              level: 'must',
              statement:
                'Author every step above xs as a clean multiple of sm — the xs half-step is an intentional, named escape hatch for cases that read cramped at a full sm (icon-to-text gaps, a badge\'s internal padding), not a loophole for arbitrary values.',
            },
            {
              level: 'must',
              statement:
                "gap/padding enforce the grid at the type level (closed scale-token names only, e.g. 'xs'|'sm'|'md'|'lg'|'xl'|'2xl') — passing an arbitrary number is a compile-time error, not a lint warning. Icon.size can't use a closed set — valid sizes span too wide a range — so Icon snaps any numeric size to the nearest 4px and renders it as rem (16px root), never raw px, so it scales with base font-size like the rest of the system.",
            },
            {
              level: 'must',
              statement:
                'A calc() composed entirely from scale tokens (e.g. calc(space.sm + space.xs) for a pill\'s horizontal padding) is on-system, even where internal .css.ts values have no type gate forcing it — legitimacy comes from every operand being a token, not from the number the expression happens to produce. The same literal number written as a bare value (e.g. \'12px\') is off-system even at identical output, because it is on-grid only in the themes whose scale happens to make it land, and silently goes off-grid the moment a theme retunes its density — the token sum rescales with the theme, the literal does not.',
            },
            {
              level: 'must',
              statement:
                "When composing across more than one scale (e.g. Input's control-text inset, max(space.md, radius.control)), every operand must still be a token — mixing rem (space, responds to base font-size) with px (radius, does not) deliberately is fine as long as both sides are tokens. Prefer a floor (max()) over an unconditional addition when composing across scales: an addition like calc(radius.control + space.sm) stacks space even on controls whose base padding already clears the radius, producing off-grid values at every step; a floor only engages the larger term once it's actually needed.",
            },
            {
              level: 'must-not',
              statement:
                "Derive a value just because the operands happen to be tokens — the test is not \"are the operands tokens?\" but \"is there a relationship here at all?\". Field's label/hint/error insets were derived twice (once from the control's text padding, once from radius.control) and both were wrong: the label belongs flush at zero, sharing the card's content edge, because it's outside the box, not inside it. A derived value that tracks the wrong relationship is worse than a literal, because it looks principled.",
            },
            {
              level: 'must',
              statement:
                "Where several elements stack, make the *ratio* between gaps communicate structure, not just the values — an inner gap must be clearly smaller (at least a full scale step apart) than the gap separating that group from what surrounds it. E.g. a preheading and its heading sit at xs (one unit), the body that follows is held off at md (a separate unit) — four-to-one, and the grouping reads with no rule or box. Adjacent steps (sm inside md) read as a rendering inconsistency, not a grouping.",
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
                "Verify the icon is sized to the paired text's line-height (already grid-aligned by the type scale itself, not the font-size) — e.g. a bodySm label pairs with an icon matching that line-height. Gap between icon and text is the theme's own space.sm token, not a literal pixel value. Align the icon to the text's line box, not its cap-height.",
            },
          ],
        },
        {
          kind: 'section',
          for: 'agent',
          title: 'Units: rem, not px',
          body: "Every space value is authored in rem, not px — spacing scales with a user's browser/OS base font-size preference, not just page zoom (WCAG SC 1.4.4). Standard browser zoom (Ctrl/Cmd +) scales px and rem identically, since it zooms the whole rendered page; the two units only diverge when someone raises their base font size as a persistent accessibility setting without zooming. px-pinned spacing stays fixed while rem-based text grows around it, which is how you get overflowing buttons and cramped padding at larger base sizes. rem math assumes a 16px root, set explicitly rather than left to the browser default so it can't drift silently.",
        },
        {
          kind: 'section',
          for: 'agent',
          title: 'Enforcement, and where this cascades',
          body: "Internal .css.ts values have no type gate the way public gap/padding props do — the composed-value rule (every operand a token, never a bare literal) is what a no-raw-values lint rule would have to encode, if one existed: a calc() whose operands are all vars.* references passes, one containing any bare length literal fails. Written that way the rule needs no allowlist of 'blessed' composed values.\n\nWhere this shows up across components: Stack/Row type gap against the scale (a planned Grid would need independent columnGap/rowGap, both still scale-token-typed); Card/Alert/Field default internal padding to a scale token (md by default), not a bespoke value; Button's height is the shared controlHeight.md token, not a value Button picks itself, so it lands at an identical height to Input in the same row regardless of theme; Progress Bar (not yet built) is where the xs escape hatch will earn its keep once small controls exist.",
        },
      ],
    },
  },
};
export default meta;

type Story = StoryObj<typeof SpaceScale>;

export const Default: Story = {};

// Per-theme increment values — a plain sibling export, not part of
// `parameters.manifest` (theme identity isn't part of DSDS's per-entry
// shape). generate-manifest.mjs finds this by its `*ByTheme` name.
export const spaceByTheme = {
  pearl: {
    description:
      "Pearl's sizing-grid increments: sm 8px base unit, xs 4px named half-step.",
    documentBlocks: [
      {
        type: 'do',
        text: "Pearl's scale: sm (8px / 0.5rem) is the base unit; xs (4px / 0.25rem) is the one named half-step, used only for a stated reason.",
      },
    ],
  },
  freshwater: {
    description:
      "Freshwater's sizing-grid increments: sm 8px base unit, xs 4px named half-step — same as Pearl and South Sea.",
    documentBlocks: [
      {
        type: 'do',
        text: "Freshwater's scale: sm (8px / 0.5rem) is the base unit; xs (4px / 0.25rem) is the one named half-step, used only for a stated reason. Same increments as Pearl and South Sea.",
      },
    ],
  },
  'south-sea': {
    description:
      "South Sea's sizing-grid increments: sm 8px base unit, xs 4px named half-step — same as Pearl and Freshwater.",
    documentBlocks: [
      {
        type: 'do',
        text: "South Sea's scale: sm (8px / 0.5rem) is the base unit; xs (4px / 0.25rem) is the one named half-step, used only for a stated reason. Same increments as Pearl and Freshwater.",
      },
    ],
  },
  tahitian: {
    description:
      "Tahitian's sizing-grid increments: sm 12px base unit, xs 8px named half-step — diverges from the other three themes.",
    documentBlocks: [
      {
        type: 'do',
        text: "Tahitian's scale: sm (12px / 0.75rem) is the base unit; xs (8px / 0.5rem) is the one named half-step, used only for a stated reason. Diverges from the 4px/8px the other three themes share.",
      },
    ],
  },
} as const;
