import type { CSSProperties, ReactNode } from 'react';
import { Text } from '@components/Text/Text';
import { Button } from '@components/Button/Button';
import { Row } from '@components/Row/Row';
import { Stack } from '@components/Stack/Stack';
import { color, radius, space, text } from '@tokens';
import { Card } from '@components/Card/Card';
import { navLink, scrollRegion } from './Docs.css';

const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace';
const HEADER_H = 61;
const foundations = ['Color', 'Space', 'Typography'];
const components = ['Alert', 'Button', 'Card', 'Field', 'Icon', 'Input', 'Row', 'Stack', 'Tag', 'Text'];
const onThisPage = ['Variants', 'Props', 'States', 'Accessiblity'];
const props = [
  { name: 'variant', type: 'primary | secondary', default: 'primary' },
  { name: 'disabled', type: 'boolean', default: 'false' },
];

function NavGroup({ heading, items, current }: { heading: string; items: string[]; current?: string }) {
  return (
    <Stack gap="xs" style={{ marginBottom: space.xl }}>
      <Text role="preheading" as="p" prominence="subtle">{heading}</Text>
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
  const cell: CSSProperties = { padding: `${space.md} ${space.md} ${space.md} 0`, borderBottom: `1px solid ${color.border}` };
  const mono: CSSProperties = { fontFamily: MONO, fontSize: 14, color: color.textSubtle };
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
        <thead>
          <tr>
            {['Prop', 'Type', 'Default'].map((heading) => (
              <th key={heading} style={{ ...cell, borderBottom: `1px solid ${color.borderStrong}` }}>
                <Text role="preheading" as="span" prominence="subtle">{heading}</Text>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr key={prop.name}>
              <td style={cell}><span style={{ ...mono, color: color.text, fontWeight: 600 }}>{prop.name}</span></td>
              <td style={cell}><span style={mono}>{prop.type}</span></td>
              <td style={cell}><span style={mono}>{prop.default}</span></td>
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
        <Text role="preheading" as="p" prominence="subtle">Components / Button</Text>
        <Text typeScale="displaySm" as="h1" style={{ margin: 0 }}>Button</Text>
        <Text typeScale="bodyLg" as="p" prominence="subtle" measure="lg">
          One component, two emphases. The primary carries a 1px inner
          highlight and a paired shadow for{' '}
          <Text as="span" role="inlineEmphasis">quiet depth</Text>.
        </Text>
      </Stack>

      {/* A real Card, not a div reimplementing one inline — it was duplicating
          Card's surface/border/radius by hand and drifting from it. `lg` rather
          than `xl`: the derived radius is correct at any padding, but a specimen
          this short has little straight edge left to show for it. */}
      <div id="emphases">
        <Card padding="lg">
          <Stack gap="md">
            <Text role="preheading" typeScale="caption" prominence="subtle" as="p">Variants</Text>
            <Row gap="md" align="center" wrap>
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
            </Row>
          </Stack>
        </Card>
      </div>

      {/* `radius.control`, NOT a concentric derivation: nothing is nested here.
          The rule applies to a control inside a surface, and this holds text —
          deriving `control + padding` on a single-line block just makes a
          lozenge. `pre` (not a bare `code`) is what stops the snippet wrapping
          mid-attribute; long lines scroll rather than reflow. */}
      <div
        className={scrollRegion}
        style={{
          background: color.backgroundInverse,
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
              color: color.textInverse,
            }}
          >
            {'<Button variant="secondary">Inspect tokens</Button>'}
          </code>
        </pre>
      </div>

      <div id="props"><PropsTable /></div>
    </Stack>
  );
}

/**
 * A three-column documentation page — sidebar nav, article, on-this-page rail —
 * composed entirely from existing primitives (`Text`, `Button`, `Row`,
 * `Stack`) plus tokens. The layout grid and table are vanilla markup: the
 * system has no page-layout or `Table` primitive yet.
 */
export function Docs() {
  const stickyTop = HEADER_H;
  return (
    <Stack style={{ minHeight: '100vh', background: color.background, color: color.text }}>
      <main
        style={{
          display: 'grid',
          gridTemplateColumns: '240px minmax(0, 1fr) 200px',
          gap: space['2xl'],
          maxWidth: 1200,
          width: '100%',
          margin: '0 auto',
          padding: `${space['2xl']} ${space.xl}`,
          alignItems: 'start',
        }}
      >
        <aside style={{ position: 'sticky', top: stickyTop, alignSelf: 'start' }} aria-label="Documentation">
          <NavGroup heading="Foundations" items={foundations} />
          <NavGroup heading="Components" items={components} current="Button" />
        </aside>

        <article style={{ minWidth: 0 }}>
          <ButtonDocs />
        </article>

        <nav style={{ position: 'sticky', top: stickyTop, alignSelf: 'start' }} aria-label="On this page">
          <Stack gap="sm">
            <Text role="preheading" as="p" prominence="subtle">On this page</Text>
            {onThisPage.map((item, index) => (
              <a key={item} href="#" className={navLink}>
                <Text typeScale="bodySm" as="span" prominence={index === 0 ? 'default' : 'subtle'}>{item}</Text>
              </a>
            ))}
          </Stack>
        </nav>
      </main>
    </Stack>
  );
}
