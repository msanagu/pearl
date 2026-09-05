import type { CSSProperties, ReactNode } from 'react';
import { Text } from '@components/Text/Text';
import { Button } from '@components/Button/Button';
import { Row } from '@components/Row/Row';
import { Stack } from '@components/Stack/Stack';
import { color, radius, space, text } from '@tokens';
import { Card } from '@components/Card/Card';
import { main, navLink, onThisPageRail, scrollRegion, sidebar } from './Docs.css';

const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace';
const HEADER_H = 61;
const foundations = ['Color', 'Space', 'Typography'];
const components = [
  'Alert',
  'Button',
  'Card',
  'Field',
  'Icon',
  'Input',
  'Row',
  'Stack',
  'Tag',
  'Text',
];
const onThisPage = ['Variants', 'Props', 'States', 'Accessiblity'];
const props = [
  { name: 'variant', type: 'primary | secondary', default: 'primary' },
  { name: 'disabled', type: 'boolean', default: 'false' },
];

function NavGroup({
  heading,
  items,
  current,
}: {
  heading: string;
  items: string[];
  current?: string;
}) {
  return (
    <Stack gap="xs" style={{ marginBottom: space.xl }}>
      <Text role="preheading" as="p" prominence="subtle">
        {heading}
      </Text>
      {items.map((item) => {
        const isCurrent = item === current;
        return (
          <a
            key={item}
            href="#"
            className={navLink}
            style={{
              padding: `${space.xs} ${space.sm}`,
              borderLeft: `2px solid ${isCurrent ? color.accent : 'transparent'}`,
              background: isCurrent ? color.accentSubtle : 'transparent',
            }}
          >
            <Text
              typeScale="bodyMd"
              as="span"
              prominence={isCurrent ? 'default' : 'subtle'}
              style={isCurrent ? { color: color.onAccentSubtle } : undefined}
            >
              {item}
            </Text>
          </a>
        );
      })}
    </Stack>
  );
}

function PropsTable() {
  const cell: CSSProperties = {
    padding: `${space.md} ${space.md} ${space.md} 0`,
    borderBottom: `1px solid ${color.border}`,
  };
  const mono: CSSProperties = {
    fontFamily: MONO,
    fontSize: 14,
    color: color.textSubtle,
  };
  return (
    <div style={{ overflowX: 'auto' }}>
      <table
        style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}
      >
        <thead>
          <tr>
            {['Prop', 'Type', 'Default'].map((heading) => (
              <th
                key={heading}
                style={{
                  ...cell,
                  borderBottom: `1px solid ${color.borderStrong}`,
                }}
              >
                <Text role="preheading" as="span" prominence="subtle">
                  {heading}
                </Text>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr key={prop.name}>
              <td style={cell}>
                <span style={{ ...mono, color: color.text, fontWeight: 600 }}>
                  {prop.name}
                </span>
              </td>
              <td style={cell}>
                <span style={mono}>{prop.type}</span>
              </td>
              <td style={cell}>
                <span style={mono}>{prop.default}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ButtonDocs(): ReactNode {
  return (
    <Stack gap="xl">
      <Stack gap="sm">
        <Text role="preheading" as="p" prominence="subtle">
          Components / Button
        </Text>
        <Text typeScale="headingLg" as="h1" style={{ margin: 0 }}>
          Button
        </Text>
        <Text typeScale="bodyLg" as="p" prominence="subtle" measure="lg">
          One component, two emphases. Primary fills solid for the page's main
          action; secondary stays{' '}
          <Text as="span" role="inlineEmphasis" prominence="subtle">
            outlined
          </Text>{' '}
          until it's needed.
        </Text>
      </Stack>

      {/* A real Card, not a div reimplementing one inline — it was duplicating and drifting from it. */}
      <div id="emphases">
        <Card padding="lg">
          <Stack gap="md">
            <Text
              role="preheading"
              typeScale="caption"
              prominence="subtle"
              as="p"
            >
              Variants
            </Text>
            <Row gap="md" align="center" wrap>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
            </Row>
          </Stack>
        </Card>
      </div>

      {/* radius.control, not a concentric derivation — nothing is nested here, this just holds text. */}
      <div
        data-inverse
        className={scrollRegion}
        style={{
          borderRadius: radius.control,
          cornerShape: radius.cornerShape,
          padding: space.lg,
          overflowX: 'auto',
        }}
      >
        <pre style={{ margin: 0 }}>
          <code
            style={{
              fontFamily: MONO,
              fontSize: text.bodySm.fontSize,
              lineHeight: text.bodySm.lineHeight,
            }}
          >
            {'<Button variant="secondary">Inspect tokens</Button>'}
          </code>
        </pre>
      </div>

      <div id="props">
        <PropsTable />
      </div>
    </Stack>
  );
}

// Three-column docs page — sidebar nav, article, on-this-page rail — composed from existing primitives.
export function Docs() {
  const stickyTop = HEADER_H;
  return (
    <Stack
      style={{
        minHeight: '100vh',
        background: color.background,
        color: color.text,
      }}
    >
      <main
        className={main}
        style={{
          display: 'grid',
          gap: space['2xl'],
          maxWidth: 1200,
          width: '100%',
          margin: '0 auto',
          alignItems: 'start',
        }}
      >
        <aside
          className={sidebar}
          style={{ top: stickyTop, alignSelf: 'start' }}
          aria-label="Documentation"
        >
          <NavGroup heading="Foundations" items={foundations} />
          <NavGroup heading="Components" items={components} current="Button" />
        </aside>

        <article style={{ minWidth: 0 }}>
          <ButtonDocs />
        </article>

        <nav
          className={onThisPageRail}
          style={{ top: stickyTop, alignSelf: 'start' }}
          aria-label="On this page"
        >
          <Stack gap="sm">
            <Text role="preheading" as="p" prominence="subtle">
              On this page
            </Text>
            {onThisPage.map((item, index) => (
              <a key={item} href="#" className={navLink}>
                <Text
                  typeScale="bodySm"
                  as="span"
                  prominence={index === 0 ? 'default' : 'subtle'}
                >
                  {item}
                </Text>
              </a>
            ))}
          </Stack>
        </nav>
      </main>
    </Stack>
  );
}
