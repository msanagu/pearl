import type { Meta, StoryObj } from '@storybook/react-vite';
import { color, radius, space } from '@tokens';
import { Row } from '@components/Row/Row';
import { Stack } from '@components/Stack/Stack';
import { Text } from '@components/Text/Text';
import { concentricRadius } from './Radius';

const PADDINGS = ['md', 'lg', 'xl'] as const;

/**
 * Foundations → Radius: **experimental — not a settled design-system
 * stance.** A live trial of concentric derivation: Pearl's default card
 * radius grew from an authored 16px to a derived 36px as a direct
 * consequence, a real, debatable identity change, not a neutral refactor.
 * Treat every number and rule here as provisional until it's been judged in
 * Storybook and lived with for a while. One authored corner per theme —
 * everything else is geometry.
 */
function ConcentricDemo() {
  return (
    <Row gap="lg" wrap align="start">
      {PADDINGS.map((padding) => (
        <Stack key={padding} gap="sm" align="center" style={{ width: 160 }}>
          <div
            style={{
              padding: space[padding],
              borderRadius: concentricRadius(space[padding]),
              background: color.surface,
              border: `1px solid ${color.border}`,
            }}
          >
            <div
              style={{
                height: 32,
                borderRadius: radius.control,
                background: color.accent,
              }}
            />
          </div>
          <Text as="p" typeScale="bodySm" prominence="subtle">
            padding=&quot;{padding}&quot;
          </Text>
        </Stack>
      ))}
    </Row>
  );
}

const meta: Meta<typeof ConcentricDemo> = {
  title: 'Foundations/Radius',
  component: ConcentricDemo,
  parameters: {
    manifest: {
      name: 'concentricRadius',
      description:
        "A padded surface derives its own corner radius from radius.control plus its own padding, instead of authoring one — keeps nested corners concentric regardless of that surface's padding. Experimental: see the 'Experimental status' section below.",
      sections: [
        {
          kind: 'definitions',
          for: 'agent',
          title: 'The radius contract',
          items: [
            {
              term: 'radius.control',
              definition:
                "The theme's corner. Buttons, inputs, tags. The only radius a theme authors — a real design token.",
            },
            {
              term: 'radius.full',
              definition:
                'Maximal rounding, for square-aspect elements only — where it produces a true circle. A real design token.',
            },
            {
              term: 'radius.nesting',
              definition:
                "'1' or '0'. Policy, not a value: whether this theme derives surface radii concentrically. Carried as a CSS custom property (so one compiled stylesheet can serve every theme, swapped by class) but it expresses a rule, not a design value — deliberately not shown on the Tokens/Semantic specimen page.",
            },
            {
              term: 'radius.cornerShape',
              definition:
                "How the corner is drawn — round, squircle, bevel, etc. Must be uniform across everything with a radius: a squircle button inside a round-cornered card no longer has arcs parallel to it, which defeats the concentric rule. A theme token, not a per-component choice. Inert at border-radius: 0, so hard-edged themes are unaffected whatever they set.",
            },
            {
              term: 'There is no radius.surface',
              definition:
                'A padded surface does not author its radius, it derives it: outer = control + gap, where gap is that surface\'s own padding. A single authored surface token could only ever have been right for one padding value — Card derives from its own padding, Alert from its own md padding, and any future Modal/Popover/Sheet does the same against theirs.',
            },
          ],
        },
        {
          kind: 'guidelines',
          for: 'agent',
          title: 'Deriving a new nested-surface radius',
          items: [
            {
              level: 'must',
              statement:
                'When a new component nests a rounded surface around padded content (a future Modal, Popover, Sheet — following the same pattern Card and Alert already use), derive its radius as concentricRadius(ownPadding) — outer = radius.control + that padding — rather than authoring a fixed radius value. The inner radius is always radius.control, the same value every nested Button/Input/Tag already uses.',
            },
            {
              level: 'should',
              statement:
                "Treat the concentric-derivation approach itself as still under evaluation system-wide, not settled doctrine — apply it for consistency with Card/Alert today, but don't present it as a permanent design law in generated explanations.",
            },
            {
              level: 'must-not',
              statement:
                'Reach for radius.full on anything that is not a circle by nature (dots, radios, avatars, slider thumbs, status marks) — never on a rectangle: full on a rectangle is a pill, and this system does not use pill shapes. Anything that sits inside something else (Tag, an icon-only close button inside an Alert) is a nested control and takes radius.control, whatever its aspect ratio.',
            },
          ],
        },
        {
          kind: 'section',
          for: 'agent',
          title: 'Why concentric',
          body: "When one rounded box sits inside another with padding between them, the two arcs stay parallel only if the outer radius exceeds the inner one by exactly that gap. Any other pairing makes the curves converge or diverge — subtle at small sizes, obviously wrong at large ones. The inner radius is always radius.control, because that is what every nested Button, Input, and Tag uses.\n\nResolved on Pearl (control: 12px): md padding (16px) derives 28px; lg padding (24px) derives 36px; xl padding (32px) derives 44px.\n\nHow hard-edged themes opt out: radius.nesting is a unitless multiplier applied to the gap term, not a branch — calc(control + nesting * gap). South Sea and Tahitian set control: 0px and nesting: '0', so the gap term zeroes and every surface collapses to 0px. One expression serves both kinds of theme with no conditional at any call site — without it, calc(0px + 24px) would hand a square theme a 24px-rounded card, precisely backwards.",
        },
        {
          kind: 'section',
          for: 'agent',
          title: 'Known limits',
          body: 'Control-in-surface only: additive derivation is correct for a control inside a surface. For a surface inside a surface it over-produces, and one level deeper the arithmetic goes negative — nothing nests padded surfaces today, and the fix if that changes is a subtractive cascade, not a bigger formula.\n\nSmall surfaces degenerate: Card has no sm padding step, since the derivation makes radius-minus-padding a constant, so at an 8px padding the corner would be 2.5x the gap it sits in and the card would read corner-first.\n\nsquircle makes the offset approximate, and that is fine: outer = inner + gap is exact for circular arcs. CSS squircle is superellipse(2) (exponent 4), which reaches further along the 45deg diagonal by a factor of sqrt(2)/2^(1/4) = 1.189, so a 32px gap opens to about 38px through the turn. Do not compensate for it — along the straight runs the gap is set by the padding, not the radius; shrinking the outer radius to match the diagonal would pinch the gap at the tangent points, a visible kink traded for a gradual drift mid-curve that is far less visible. The current formula puts the unavoidable error in the least visible place, and stays exact for round, which is why one expression serves both corner shapes.\n\nSiblings can disagree: two cards at different paddings have different radii, each concentric with its own contents but inconsistent with each other. Accepted — padding is a deliberate choice per call site.',
        },
      ],
    },
  },
};
export default meta;

type Story = StoryObj<typeof ConcentricDemo>;

export const Default: Story = {};
