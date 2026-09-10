import type { Meta, StoryObj } from '@storybook/react-vite';
import type { CSSProperties, ReactNode } from 'react';
import { PiRocketLaunch } from 'react-icons/pi';
import { color } from '@tokens';
import { Alert } from '@components/Alert/Alert';
import { Button } from '@components/Button/Button';
import { Card } from '@components/Card/Card';
import { Field } from '@components/Field/Field';
import { Icon } from '@components/Icon/Icon';
import { Input } from '@components/Input';
import { Link } from '@components/Link/Link';
import { Row } from '@components/Row/Row';
import { Skeleton } from '@components/Skeleton/Skeleton';
import { Stack } from '@components/Stack/Stack';
import { Tag } from '@components/Tag/Tag';
import { Text } from '@components/Text/Text';
import { StoryDoc } from '@/storydoc/StoryDoc';
import { inverseDoc } from './Inverse.doc';

// The whole color contract. [data-inverse] reassigns every one of these to the
// opposite mode's value — nothing is left fixed. Source of truth: inverse.ts
// passes each theme's other-mode `color` object straight to assignVars.
type Tok = { name: string; value: string };
const T = (name: string, value: string): Tok => ({ name, value });

const groups: { title: string; toks: Tok[] }[] = [
  {
    title: 'Surfaces',
    toks: [
      T('color.background', color.background),
      T('color.surface', color.surface),
      T('color.overlay', color.overlay),
      T('color.overlaySubtle', color.overlaySubtle),
    ],
  },
  {
    title: 'Text & icon',
    toks: [
      T('color.text', color.text),
      T('color.textSubtle', color.textSubtle),
      T('color.icon', color.icon),
    ],
  },
  {
    title: 'Borders',
    toks: [
      T('color.border', color.border),
      T('color.borderStrong', color.borderStrong),
      T('color.borderSubtle', color.borderSubtle),
      T('color.borderInverse', color.borderInverse),
    ],
  },
  { title: 'Elevation', toks: [T('color.shadow', color.shadow)] },
  {
    title: 'Primary — CTA fill',
    toks: [
      T('color.primary', color.primary),
      T('color.onPrimary', color.onPrimary),
    ],
  },
  {
    title: 'Accent',
    toks: [
      T('color.accent', color.accent),
      T('color.accentHover', color.accentHover),
      T('color.accentSubtle', color.accentSubtle),
      T('color.onAccent', color.onAccent),
      T('color.onAccentSubtle', color.onAccentSubtle),
    ],
  },
  { title: 'Focus', toks: [T('color.focusRing', color.focusRing)] },
  ...(['positive', 'negative', 'warn', 'info'] as const).map((s) => ({
    title: `Sentiment · ${s}`,
    toks: (
      ['surface', 'border', 'text', 'icon', 'fill', 'onFill'] as const
    ).map((f) => T(`color.${s}.${f}`, color[s][f])),
  })),
];

// Neutral hairline for the swatch chips — a fixed mid-gray so the chip outline
// itself reads the same on both panels and only the fill differs.
const hairline = '1px solid rgba(128, 128, 128, 0.3)';

function Label({ children }: { children: ReactNode }) {
  return (
    <span
      style={{
        fontSize: 11,
        fontWeight: 600,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        color: color.textSubtle,
      }}
    >
      {children}
    </span>
  );
}

// The full token catalog. Rendered once under the global app theme and once
// inside [data-inverse] — every chip on the right differs from its twin.
function Catalog() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {groups.map((g) => (
        <div
          key={g.title}
          style={{ display: 'flex', flexDirection: 'column', gap: 5 }}
        >
          <Label>{g.title}</Label>
          {g.toks.map((t) => (
            <div
              key={t.name}
              style={{ display: 'flex', alignItems: 'center', gap: 10 }}
            >
              <span
                aria-hidden="true"
                style={{
                  width: 26,
                  height: 26,
                  flexShrink: 0,
                  borderRadius: 6,
                  background: t.value,
                  border: hairline,
                }}
              />
              <code
                style={{
                  fontFamily: 'ui-monospace, Menlo, monospace',
                  fontSize: 12,
                  color: color.text,
                }}
              >
                {t.name}
              </code>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

// Component demo — identical markup rendered under the global theme and inside
// [data-inverse]. Broad on purpose: every component here should read as the
// opposite mode inside the attribute, with no prop changes.
function Sample() {
  return (
    <Stack gap="md">
      <Card>
        <Card.Header>
          <Row justify="between" align="center">
            <Text typeScale="headingSm" as="h3">
              Deployment
            </Text>
            <Tag variant="positive">Live</Tag>
          </Row>
        </Card.Header>
        <Card.Body>
          <Stack gap="sm">
            <Text as="p" style={{ margin: 0 }}>
              Body text with{' '}
              <Text as="span" role="inlineEmphasis">
                inline emphasis
              </Text>{' '}
              and a <Link href="#inverse">link</Link>.
            </Text>
            <Text
              as="p"
              typeScale="caption"
              prominence="subtle"
              style={{ margin: 0 }}
            >
              Caption text — prominence subtle.
            </Text>
            <Row gap="xs" align="center">
              <Icon icon={PiRocketLaunch} />
              <Tag>neutral</Tag>
              <Tag variant="info">info</Tag>
              <Tag variant="warn">warn</Tag>
              <Tag variant="negative">error</Tag>
            </Row>
          </Stack>
        </Card.Body>
      </Card>

      <Alert variant="info" heading="Heads up" onDismiss={() => {}}>
        Sentiment surface, border, and text all flip.
      </Alert>
      <Alert variant="negative" heading="Failed" onDismiss={() => {}}>
        Same component, opposite mode — no props changed.
      </Alert>

      <Field label="Email" hint="We never share it.">
        {(props) => (
          <Input type="email" placeholder="you@example.com" {...props} />
        )}
      </Field>

      <Row gap="xs">
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
      </Row>

      <Stack gap="xs">
        <Skeleton />
        <Skeleton width="70%" />
      </Stack>
    </Stack>
  );
}

function InverseDemo() {
  const panel: CSSProperties = {
    background: color.background,
    color: color.text,
    padding: 20,
    borderRadius: 10,
    border: hairline,
  };
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 20,
        }}
      >
        <div style={panel}>
          <Label>Global app theme</Label>
          <div style={{ marginTop: 12 }}>
            <Catalog />
          </div>
        </div>
        <div style={panel} data-inverse>
          <Label>[data-inverse] — opposite mode, locally</Label>
          <div style={{ marginTop: 12 }}>
            <Catalog />
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Label>Components — identical markup, inside vs outside</Label>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 20,
          }}
        >
          <div style={panel}>
            <Sample />
          </div>
          <div style={panel} data-inverse>
            <Sample />
          </div>
        </div>
      </div>
    </div>
  );
}

const meta: Meta<typeof InverseDemo> = {
  title: 'Foundations/Color/Inverse',
  component: InverseDemo,
  parameters: {
    layout: 'fullscreen',
    removePreviewPadding: true,
  },
};
export default meta;

type Story = StoryObj<typeof InverseDemo>;

// Named to match the title's last segment so Storybook collapses the group
// into a single sidebar entry (no Inverse/Default nesting).
export const Inverse: Story = {
  render: () => (
    <StoryDoc doc={inverseDoc} entityId="foundation.color">
      <InverseDemo />
    </StoryDoc>
  ),
};
