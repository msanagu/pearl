import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { color, radius, space } from '@tokens';
import { Row } from '@components/Row/Row';
import { Stack } from '@components/Stack/Stack';
import { Text } from '@components/Text/Text';
import { StoryDoc } from '@/storydoc/StoryDoc';
import { concentricRadius } from './Radius';
import { radiusDoc } from './Radius.doc';

const PADDINGS = ['md', 'lg', 'xl'] as const;

// radius.nesting is authored as a boolean; its CSS value stays a 0/1
// multiplier for calc() (see tokens.ts). Display the boolean, not the wire value.
const NESTING_LABEL: Record<string, string> = { '0': 'false', '1': 'true' };

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
        {NESTING_LABEL[nesting] ?? '—'}
        {nesting === '0' ? ' (nesting false — flat surface radius)' : ''}
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
  nestingOn,
}: {
  padding: string;
  theme: string;
  nestingOn: boolean;
}) {
  const [outerRef, outer] = useMeasured<HTMLDivElement>('border-radius', theme);
  const [innerRef, inner] = useMeasured<HTMLDivElement>('border-radius', theme);
  const [paddingRef, paddingValue] = useMeasured<HTMLDivElement>(
    'padding-left',
    theme,
  );
  const step = space[padding as keyof typeof space];
  // Two refs, one node: border-radius and padding-left both need measuring
  // off the same outer div (tokens are CSS vars, unreadable from JS).
  const setOuterNode = useCallback(
    (node: HTMLDivElement | null) => {
      outerRef(node);
      paddingRef(node);
    },
    [outerRef, paddingRef],
  );
  return (
    <Stack
      gap="sm"
      align="start"
      style={{ flex: '1 1 160px', maxWidth: 260, minWidth: 0 }}
    >
      <div
        ref={setOuterNode}
        style={{
          alignSelf: 'stretch',
          padding: step,
          borderRadius: concentricRadius(step),
          background: color.accentSubtle,
          border: `1px solid ${color.accent}`,
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
      <Text as="p" typeScale="caption" prominence="subtle">
        {nestingOn
          ? `${inner || '—'} + ${paddingValue || '—'} = ${outer || '—'}`
          : `${inner || '—'} = ${outer || '—'} (nesting off)`}
      </Text>
    </Stack>
  );
}

function ConcentricDemo({ theme = 'pearl' }: { theme?: string }) {
  const [nestingRef, nesting] = useMeasured<HTMLSpanElement>('--rn', theme);
  const nestingOn = nesting !== '0';
  return (
    <Stack gap="lg" style={{ maxWidth: '100%' }}>
      <span
        ref={nestingRef}
        aria-hidden
        style={{ display: 'none', '--rn': radius.nesting } as CSSProperties}
      />
      <Text as="p" typeScale="bodySm" prominence="subtle" measure="lg">
        Experimental — each specimen below derives its outer radius from its
        padding prop value calculated from the theme's form control radius.
      </Text>
      <Text as="p" typeScale="caption" prominence="subtle">
        {theme} · radius.nesting = {NESTING_LABEL[nesting] ?? '—'}
        {nesting === '0'
          ? ' — outer stays at radius.control, no padding-driven growth'
          : ''}
      </Text>
      <Text as="p" typeScale="caption" prominence="subtle">
        {nestingOn
          ? 'formula: inner (form control) + padding = outer'
          : 'formula: outer = inner — nesting off, padding ignored'}
      </Text>
      <Row gap="lg" wrap align="start" style={{ maxWidth: '100%' }}>
        {PADDINGS.map((padding) => (
          <ConcentricSpecimen
            key={padding}
            padding={padding}
            theme={theme}
            nestingOn={nestingOn}
          />
        ))}
      </Row>
    </Stack>
  );
}

// Both halves — authored tokens, then the derived-radius rule built on top —
// on one StoryDoc page. Kept as one story so Storybook collapses the group
// (see Inverse for the naming convention).
function RadiusDemo({ theme = 'pearl' }: { theme?: string }) {
  return (
    <Stack gap="2xl">
      <Stack gap="md">
        <Text as="h2" typeScale="headingSm">
          Authored tokens
        </Text>
        <RadiusPrinciples theme={theme} />
      </Stack>
      <Stack gap="md">
        <Text as="h2" typeScale="headingSm">
          Concentric derivation
        </Text>
        <ConcentricDemo theme={theme} />
      </Stack>
    </Stack>
  );
}

const meta: Meta<typeof RadiusDemo> = {
  title: 'Foundations/Radius',
  component: RadiusDemo,
  parameters: {
    layout: 'fullscreen',
    removePreviewPadding: true,
  },
  decorators: [
    (Story, context) => (
      <Story args={{ theme: (context.globals.theme as string) ?? 'pearl' }} />
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof RadiusDemo>;

// Named to match the title's last segment so Storybook collapses the group
// into a single sidebar entry (no Radius/Default nesting).
export const Radius: Story = {
  render: (args) => (
    <StoryDoc doc={radiusDoc} entityId="foundation.radius">
      <RadiusDemo {...args} />
    </StoryDoc>
  ),
};
