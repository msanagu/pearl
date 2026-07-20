import type { Meta, StoryObj } from '@storybook/react-vite';
import { ArrowUpRightIcon } from '@phosphor-icons/react';
import { Text } from '../../components/Text/Text';
import { Button } from '../../components/Button/Button';
import { Row } from '../../components/Row/Row';
import { Stack } from '../../components/Stack/Stack';
import { Icon } from '../../components/Icon/Icon';
import { color, fontWeight, radius, space } from '../../tokens';

/**
 * The Pearl marketing hero (exploration turn 5a), rebuilt from **only**
 * existing system components — `Text`, `Button`, `Row`, `Stack`, `Icon` — to
 * pressure-test how far the current component set actually reaches.
 *
 * This is deliberately NOT a new `Hero` component. It's a composition
 * exercise: what falls out of existing primitives for free (nav, headline,
 * CTAs, stat row) versus what has no home anywhere in the system yet (the
 * luster sphere, film grain, a real nav/header layout primitive). Those gaps
 * are called out inline rather than smoothed over with one-off styles.
 */
const meta: Meta = {
  title: 'Sections/Hero',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', },
};
export default meta;

type Story = StoryObj;

const stats = [
  {
    n: '01',
    label: 'Self-documenting by construction',
    description: 'Every capability ships with its own usage guidance, attached to the code that defines it.',
  },
  {
    n: '02',
    label: "Rules that can't drift",
    description: "The type system rejects a theme whose guidance doesn't match what it actually declares.",
  },
  {
    n: '03',
    label: 'Smart defaults, flexible overrides',
    description: 'Sane behavior out of the box, with an explicit contract for where you’re meant to deviate.',
  },
  {
    n: '04',
    label: 'Infinite themes, one contract',
    description: 'Every theme satisfies the same interface, so nothing custom-built has to reinvent the rules.',
  },
];

/**
 * GAP — no `Sphere`/`Orb` component exists. Pearl's `luster` extension
 * capability (`pearlCapabilities.luster.bodyGradient`/`bodyShadow`) has real
 * tokens for exactly this, but nothing in `src/components` consumes them —
 * this is vanilla CSS reaching directly into theme capability tokens, which
 * only works because we know we're inside Pearl. A real `Sphere` component
 * would need to declare which themes it degrades gracefully on.
 */
function LusterSphere() {
  return (
    <div
      style={{
        width: 160,
        height: 160,
        borderRadius: '50%',
        background:
          'radial-gradient(circle at 34% 30%, #FEFEFC 0%, #F0EFEC 26%, #DEE3DF 50%, #C3CCC6 72%, #A9B4AD 100%)',
        boxShadow:
          '0 18px 40px rgba(70, 80, 76, 0.22), inset 0 -8px 22px rgba(143, 160, 151, 0.30), inset 6px 4px 18px rgba(214, 205, 192, 0.18)',
        flexShrink: 0,
      }}
    />
  );
}

export const Overview: Story = {
  render: () => (
    <Stack gap="2xl" style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* GAP — no eyebrow/callout component. Vanilla flex row + a chip built
          from raw div/padding, since neither Card nor Button fit a pill label. */}
      <Row gap="sm" align="center" wrap>
        <span
          style={{
            fontFamily: 'ui-monospace, monospace',
            fontSize: 12,
            fontWeight: 600,
            background: color.surface,
            border: `1px solid ${color.border}`,
            borderRadius: radius.full,
            padding: `2px ${space.sm}`,
          }}
        >
          5a
        </span>
        <Text role="label" as="span">Pearl — canon, refined.</Text>
        <Text variant="caption" prominence="subtle" as="span">
          Editorial italic wordmark + sentence-case nav, ambient sphere, faint film grain.
        </Text>
      </Row>

      {/* GAP — no Nav/Header layout primitive. Row gets the flex layout for
          free; the wordmark's italic serif and the border-bottom rule are
          vanilla, since there's no `Divider` component either. */}
      <Row
        justify="between"
        align="center"
        style={{ borderBottom: `1px solid ${color.border}`, paddingBottom: space.md }}
      >
        <Text as="span" role="inlineEmphasis" style={{ fontSize: 24 }}>
          pearl
        </Text>
        {/* GAP — `Text`'s `as` prop isn't polymorphically typed: swapping
            `as="a"` doesn't unlock `href` (TextProps only extends
            HTMLAttributes<HTMLElement>, which has no anchor-specific
            attributes). Wrapping a plain `<a>` around `Text` instead, since
            that's the only type-safe way to get a link today. */}
        <Row gap="lg" align="center">
          {['Foundations', 'Components', 'Themes', 'Playground'].map((label) => (
            <a key={label} href="#" style={{ textDecoration: 'none', color: 'inherit' }}>
              <Text variant="bodyMd" as="span">{label}</Text>
            </a>
          ))}
          <a href="#" style={{ textDecoration: 'none', color: 'inherit' }}>
            <Row gap="xs" align="center">
              <Text variant="bodyMd" as="span">GitHub</Text>
              <Icon icon={ArrowUpRightIcon} size={16} />
            </Row>
          </a>
        </Row>
      </Row>

      <Row gap="2xl" align="center" wrap>
        {/*
          GAP — no `<header>` composition primitive. Per docs/markup-
          philosophy.md's header/heading/preheading/subheading vocabulary,
          this preheading + h1 pair belongs inside a real `<header>` element;
          nothing in the system renders one, so it's vanilla here.
        */}
        <Stack as="header" gap="lg" style={{ flex: 1, minWidth: 320 }}>
          <Text role="preheading" as="p">
            Decisive by default. Yours by design.
          </Text>
          {/* `role="inlineEmphasis"` on the trailing word is exactly the
              "the world is your *oyster*" case the role system was built for. */}
          <Text variant="displayLg" as="h1" style={{ margin: 0 }}>
            The world is your{' '}
            <Text as="span" role="inlineEmphasis">oyster.</Text>
          </Text>
          <Text variant="bodyLg" prominence="subtle" as="p">
            Not a doc that goes stale. A type the compiler checks. Every
            theme's rules are data — structured, queryable, and impossible to
            drift from what actually ships.
          </Text>
          <Row gap="sm">
            <Button variant="primary">Read the docs</Button>
            <Button variant="secondary">Open playground</Button>
          </Row>
        </Stack>

        <LusterSphere />
      </Row>

      <Row
        style={{ borderTop: `1px solid ${color.border}` }}
      >
        {/* The index numbers are acting as preheadings here — decorative,
            supporting the label below rather than data — so they get
            `role="preheading"` rather than `numeric` (reserved for real
            tabular/data digits). `weight` no longer exists on Text (removed
            so it can't compete with `role`'s bundled treatment); a genuine
            one-off like this label's semibold uses the `style` escape hatch. */}
        {stats.map((s, i) => (
          <Stack
            key={s.n}
            gap="xs"
            style={{
              flex: '1 1 200px',
              padding: space.xl,
              borderLeft: i > 0 ? `1px solid ${color.border}` : undefined,
            }}
          >
            <Text role="preheading" as="span">{s.n}</Text>
            <Text variant="bodyMd" as="span" style={{ fontWeight: fontWeight.semibold }}>
              {s.label}
            </Text>
            <Text variant="caption" prominence="subtle" as="span">
              {s.description}
            </Text>
          </Stack>
        ))}
      </Row>
    </Stack>
  ),
};
