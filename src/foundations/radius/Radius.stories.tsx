import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { color, radius, space } from '@tokens';
import { Row } from '@components/Row/Row';
import { Stack } from '@components/Stack/Stack';
import { Text } from '@components/Text/Text';
import { concentricRadius } from './Radius';

const PADDINGS = ['md', 'lg', 'xl'] as const;

/**
 * Foundations → Radius: the corner system. A theme authors exactly one radius
 * — radius.control — plus two policy tokens (nesting, cornerShape); every
 * other rounded corner is derived. The Default story shows the authored
 * tokens; Concentric derivation covers the experimental surface-radius rule.
 */

// Radius values are per-theme calc()s / custom props — JS can't derive them,
// so measure a rendered node. Keyed on `theme` because the toolbar swaps a
// class on an ancestor, not on the node itself.
function useMeasured<T extends HTMLElement>(prop: string, theme: string) {
  const ref = useRef<T | null>(null);
  const [value, setValue] = useState('');
  const read = useCallback(() => {
    if (ref.current)
      setValue(getComputedStyle(ref.current).getPropertyValue(prop).trim());
  }, [prop]);
  const setRef = useCallback(
    (node: T | null) => {
      ref.current = node;
      read();
    },
    [read],
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps -- `theme` is the real re-read trigger; `read` is stable per `prop`.
  useLayoutEffect(read, [read, theme]);
  return [setRef, value] as const;
}

function ShapeSpec({
  name,
  note,
  theme,
  circle = false,
}: {
  name: string;
  note: string;
  theme: string;
  circle?: boolean;
}) {
  const [ref, value] = useMeasured<HTMLDivElement>('border-radius', theme);
  return (
    <Stack gap="sm" align="start" style={{ flex: '1 1 160px', minWidth: 0 }}>
      <div
        ref={ref}
        style={{
          width: circle ? 72 : '100%',
          height: 72,
          maxWidth: 220,
          borderRadius: circle ? radius.full : radius.control,
          background: color.accentSubtle,
          border: `1px solid ${color.accent}`,
        }}
      />
      <Text as="p" typeScale="bodySm">
        {name}
      </Text>
      <Text as="p" typeScale="caption" prominence="subtle">
        {value || '—'} · {note}
      </Text>
    </Stack>
  );
}

function RadiusPrinciples({ theme = 'pearl' }: { theme?: string }) {
  const [shapeRef, cornerShape] = useMeasured<HTMLSpanElement>('--cs', theme);
  const [nestingRef, nesting] = useMeasured<HTMLSpanElement>('--rn', theme);
  return (
    <Stack gap="lg" style={{ maxWidth: '100%' }}>
      <span
        ref={shapeRef}
        aria-hidden
        style={{ display: 'none', '--cs': radius.cornerShape } as CSSProperties}
      />
      <span
        ref={nestingRef}
        aria-hidden
        style={{ display: 'none', '--rn': radius.nesting } as CSSProperties}
      />
      <Text as="p" typeScale="bodySm" prominence="subtle" measure="lg">
        A theme authors one corner — radius.control, used by every button,
        input, and tag. radius.full is maximal rounding, valid only on
        square-aspect elements where it renders a true circle. cornerShape and
        nesting are policy, not lengths.
      </Text>
      <Row gap="lg" wrap align="start" style={{ maxWidth: '100%' }}>
        <ShapeSpec
          name="radius.control"
          note="buttons, inputs, tags"
          theme={theme}
        />
        <ShapeSpec
          name="radius.full"
          note="circles only — never a rectangle"
          theme={theme}
          circle
        />
      </Row>
      <Text as="p" typeScale="caption" prominence="subtle">
        radius.cornerShape = {cornerShape || '—'} · radius.nesting ={' '}
        {nesting || '—'}
        {nesting === '0' ? ' (nesting 0 — flat surface radius)' : ''}
      </Text>
    </Stack>
  );
}

// Concentric derivation — the experimental surface-radius rule. Not a settled
// stance: Pearl's default card radius grew from an authored 16px to a derived
// 36px as a direct consequence, a real identity change. See the manifest's
// experimental-status section.
function ConcentricSpecimen({
  padding,
  theme,
}: {
  padding: string;
  theme: string;
}) {
  const [outerRef, outer] = useMeasured<HTMLDivElement>('border-radius', theme);
  const [innerRef, inner] = useMeasured<HTMLDivElement>('border-radius', theme);
  const step = space[padding as keyof typeof space];
  return (
    <Stack
      gap="sm"
      align="start"
      style={{ flex: '1 1 160px', maxWidth: 260, minWidth: 0 }}
    >
      <div
        ref={outerRef}
        style={{
          alignSelf: 'stretch',
          padding: step,
          borderRadius: concentricRadius(step),
          background: color.accentSubtle,
          border: `1px solid ${color.border}`,
        }}
      >
        <div
          ref={innerRef}
          style={{
            height: 40,
            borderRadius: radius.control,
            background: color.accent,
          }}
        />
      </div>
      <Text as="p" typeScale="bodySm">
        padding=&quot;{padding}&quot;
      </Text>
      <Text as="p" typeScale="caption" prominence="subtle">
        outer {outer || '—'} · inner {inner || '—'}
      </Text>
    </Stack>
  );
}

function ConcentricDemo({ theme = 'pearl' }: { theme?: string }) {
  const [nestingRef, nesting] = useMeasured<HTMLSpanElement>('--rn', theme);
  return (
    <Stack gap="lg" style={{ maxWidth: '100%' }}>
      <span
        ref={nestingRef}
        aria-hidden
        style={{ display: 'none', '--rn': radius.nesting } as CSSProperties}
      />
      <Text as="p" typeScale="bodySm" prominence="subtle" measure="lg">
        Experimental. Each surface derives its own corner from radius.control
        plus its own padding, so the gap between the outer arc and the inner
        control stays constant across paddings. A theme with radius.nesting 0
        zeroes the padding term — every surface collapses to radius.control.
      </Text>
      <Text as="p" typeScale="caption" prominence="subtle">
        {theme} · radius.nesting = {nesting || '—'}
        {nesting === '0'
          ? ' — outer stays at radius.control, no padding-driven growth'
          : ''}
      </Text>
      <Row gap="lg" wrap align="start" style={{ maxWidth: '100%' }}>
        {PADDINGS.map((padding) => (
          <ConcentricSpecimen key={padding} padding={padding} theme={theme} />
        ))}
      </Row>
    </Stack>
  );
}

const meta: Meta<typeof RadiusPrinciples> = {
  title: 'Foundations/Radius',
  component: RadiusPrinciples,
  decorators: [
    (Story, context) => (
      <Story args={{ theme: (context.globals.theme as string) ?? 'pearl' }} />
    ),
  ],
  parameters: {
    manifest: {
      name: 'concentricRadius',
      description:
        "A padded surface derives its own corner radius from radius.control plus its own padding, instead of authoring one — keeps nested corners concentric regardless of that surface's padding. Experimental: see the 'Experimental status' section below.",
      // The derivation is `radius.control + own padding`, and padding is a
      // space scale token — the two foundations move together.
      related: [{ rel: 'relates-to', to: 'foundation.space' }],
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
                "'1' or '0' — the coefficient on the padding term when a surface derives its radius: calc(control + nesting * padding). '1' grows the corner with padding; '0' holds every surface at radius.control. A CSS custom property, but a policy rule not a design value — not shown on the Tokens/Semantic specimen page.",
            },
            {
              term: 'radius.cornerShape',
              definition:
                'How the corner is drawn — round, squircle, bevel. Must be uniform across everything with a radius: a squircle button in a round-cornered card breaks the concentric rule. A theme token, not per-component. Inert at border-radius: 0.',
            },
            {
              term: 'There is no radius.surface',
              definition:
                'A padded surface derives its radius (outer = control + gap, gap = its own padding) rather than authoring one — a single token could only fit one padding value. Card/Alert derive from their own padding; a future Modal/Popover/Sheet does the same.',
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
                'When nesting a rounded surface around padded content (a future Modal, Popover, Sheet — same pattern as Card/Alert), derive radius as concentricRadius(ownPadding) — outer = radius.control + that padding — rather than authoring a fixed value. Inner radius is always radius.control, same as every nested Button/Input/Tag.',
            },
            {
              level: 'should',
              statement:
                "Treat concentric derivation as still under system-wide evaluation, not settled doctrine — apply it for consistency with Card/Alert, don't present it as permanent law in generated explanations.",
            },
            {
              level: 'must-not',
              statement:
                "Reach for radius.full only on true circles (dots, radios, avatars, slider thumbs) — never a rectangle (that's a pill, unused here). Anything nested inside something else (Tag, an Alert's close button) takes radius.control regardless of aspect ratio.",
            },
          ],
        },
        {
          kind: 'section',
          for: 'agent',
          title: 'Why concentric',
          body: "Two nested rounded boxes keep parallel arcs only when outer radius exceeds inner by exactly the padding gap — any other pairing converges or diverges, worse at large sizes. Inner radius is always radius.control.\n\nWith nesting '1' and control 8px: a surface at md/lg/xl padding (16/24/32px) renders 24/32/40px.\n\nEvery theme runs the same expression — calc(control + nesting * padding). nesting is a coefficient, not a branch: '0' zeroes the padding term, so every surface renders at radius.control regardless of padding. A 0px-control theme goes fully square; a small-control theme keeps that small corner flat across paddings. One expression, every theme, no per-call-site conditional.",
        },
        {
          kind: 'section',
          for: 'agent',
          title: 'Known limits',
          body: "Control-in-surface only — a surface inside a surface over-produces, one level deeper goes negative. Nothing nests padded surfaces today; the fix if that changes is a subtractive cascade, not a bigger formula.\n\nSmall surfaces degenerate: Card has no sm padding step, since radius-minus-padding is constant — at 8px padding the corner would be 2.5x the gap.\n\nsquircle offset is approximate by design: outer = inner + gap is exact only for circular arcs; squircle reaches ~1.189x further on the diagonal (a 32px gap opens to ~38px). Don't compensate — padding sets the gap on straight runs; shrinking the outer radius to match the diagonal would pinch the gap at the tangent points, worse than the mid-curve drift it trades away.\n\nSiblings can disagree: two cards at different paddings get different, individually-correct radii. Accepted — padding is a per-call-site choice.",
        },
      ],
    },
  },
};
export default meta;

type Story = StoryObj<typeof RadiusPrinciples>;

export const Tokens: Story = {};

export const ConcentricDerivation: Story = {
  render: (args) => <ConcentricDemo {...args} />,
};
