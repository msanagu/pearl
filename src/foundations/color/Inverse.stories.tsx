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

/**
 * Foundations → Color/Inverse: the global app theme sets light or dark for the
 * whole tree. `[data-inverse]` applies the opposite mode locally to one
 * subtree, without touching the global setting — the two are orthogonal axes.
 * A consumer only adds the attribute; each theme's `.css.ts` wires the flip
 * through `inverseOverride(...)` in `foundations/color/inverse.ts`.
 */

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
            {/* No component consumes fill/onFill yet — a raw solid badge +
                destructive button, to show the pair flips too. */}
            <Row gap="xs" align="center">
              <span
                style={{
                  background: color.positive.fill,
                  color: color.positive.onFill,
                  padding: '2px 8px',
                  borderRadius: 4,
                  fontSize: 12,
                  fontWeight: 600,
                }}
              >
                Passing
              </span>
              <button
                type="button"
                style={{
                  background: color.negative.fill,
                  color: color.negative.onFill,
                  border: 'none',
                  padding: '6px 12px',
                  borderRadius: 6,
                  fontSize: 13,
                  fontWeight: 600,
                }}
              >
                Delete
              </button>
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
        maxWidth: 960,
        margin: '0 auto',
        padding: 24,
        display: 'flex',
        flexDirection: 'column',
        gap: 32,
        fontFamily: 'system-ui, sans-serif',
      }}
    >
      <Text as="p" style={{ margin: 0, fontSize: 13, color: color.textSubtle }}>
        Same token names on both sides. Left is the global app theme; right is
        the same subtree wrapped in <code>[data-inverse]</code> — a local
        application of the opposite mode. Every token in the contract resolves
        to the opposite mode&rsquo;s value; nothing is left fixed.
      </Text>

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
    manifest: {
      name: 'inverseConvention',
      description:
        'The global app theme (light/dark, whole tree) and inverse ([data-inverse], a local application of the opposite mode on one subtree) are orthogonal axes. Inside [data-inverse] every color token flips — the whole contract — so ordinary token names just work.',
      sections: [
        {
          kind: 'guidelines',
          title: 'Inverse convention',
          for: 'agent',
          items: [
            {
              level: 'must',
              statement:
                'Treat the global app theme (light/dark, whole tree) and inverse ([data-inverse], a local application of the opposite mode on one subtree) as orthogonal axes. Call an inverse container "the inverse container," not "the dark version" — which mode it resolves to depends on the global app theme currently active.',
            },
            {
              level: 'must-not',
              statement:
                "Don't conflate the two axes — an inverse container always renders as if the opposite mode were active there, without touching the global app theme.",
            },
            {
              level: 'must',
              statement:
                'Add data-inverse to a container, then use ordinary token names inside it — every color token resolves to the opposite mode automatically. The whole color contract flips: surfaces, text, icon, the full border set (border / borderStrong / borderSubtle / borderInverse), overlay / overlaySubtle, shadow, focusRing, the primary and accent families, and every sentiment field. Nothing is fixed; there is no token you must swap by hand.',
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
                "When adding a theme or a new color-contract key, extend both inverseOverride(...) calls with that key set to the theme's own other-mode value — inverse.ts hands the whole object to assignVars, so every contract key must be present. Never invent a fresh color for the inverse case.",
            },
            {
              title:
                "If a theme restyles a component per mode with its own globalStyle keyed on the mode class (e.g. the primary button in freshwater/tahitian), add a matching [data-inverse]-scoped rule that applies the other mode's treatment — the var flip alone can't move a hardcoded per-mode fill.",
            },
          ],
        },
      ],
    },
  },
};
export default meta;

type Story = StoryObj<typeof InverseDemo>;

// Named to match the title's last segment so Storybook collapses the group
// into a single sidebar entry (no Inverse/Default nesting).
export const Inverse: Story = {};
