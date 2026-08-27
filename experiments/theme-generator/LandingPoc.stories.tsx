import type { CSSProperties, ReactNode } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { runImpeccableAudit } from '../../src/test/impeccablePlay';
import { StoryAudit } from '../../src/test/StoryAudit';
import { Hero, HeroNav } from '../sections/Hero/Hero';
import { Text } from '../../src/components/Text/Text';
import { Button } from '../../src/components/Button/Button';
import { Row } from '../../src/components/Row/Row';
import { Stack } from '../../src/components/Stack/Stack';
import { color, space, radius } from '../../src/tokens';

// One-shot POC of the real landing/docs site, consuming the extracted <Hero>.
// Behavior we landed on (Porsche v4 reference):
//   • On load: NO left nav — attention is on the hero alone.
//   • The docs shell (left rail + right on-this-page TOC) lives BELOW the hero,
//     so it only appears once you scroll in or hit "Read the docs".
//   • One persistent, minimal utility bar (search/sandbox/GitHub) spans both —
//     it is NOT the docs nav pulled up early, so it carries no section links.
//
// GAP — this is hand-composed with inline styles. A real build wants layout
// primitives (AppShell/Sidebar/DocsGrid) + a non-caps mono `Text` role, both
// flagged inline below. Everything visual still flows through tokens.

// GAP — no canon non-caps monospace type role (the `preheading`/`dataDigits`
// roles force caps / tabular). Code and type cells fall back to a raw stack.
const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace';

const HEADER_H = 61; // px — utility bar height; sticky offsets key off this.

const foundations = ['Color & nacre', 'Type registers', 'Motion'];
const components = ['Button', 'Input', 'Select', 'Table', 'Dialog'];
const onThisPage = ['Emphases', 'Sizes', 'Tokens used', 'Accessibility'];

const props = [
  { name: 'variant', type: 'primary | secondary | tertiary', default: 'primary' },
  { name: 'size', type: 'sm | md | lg', default: 'md' },
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
            style={{
              textDecoration: 'none',
              padding: `${space.xs} ${space.sm}`,
              // active row: tinted accent background + an accent edge, matching
              // the "current page" treatment (color.accentSubtle is defined for
              // exactly this — selected rows / active nav).
              borderLeft: `2px solid ${isCurrent ? color.accent : 'transparent'}`,
              background: isCurrent ? color.accentSubtle : 'transparent',
            }}
          >
            <Text typeScale="bodyMd" as="span" prominence={isCurrent ? 'default' : 'subtle'}>
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
            {['Prop', 'Type', 'Default'].map((h) => (
              <th key={h} style={{ ...cell, borderBottom: `1px solid ${color.borderStrong}` }}>
                <Text role="preheading" as="span" prominence="subtle">{h}</Text>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {props.map((p) => (
            <tr key={p.name}>
              <td style={cell}><span style={{ ...mono, color: color.text, fontWeight: 600 }}>{p.name}</span></td>
              <td style={cell}><span style={mono}>{p.type}</span></td>
              <td style={cell}><span style={mono}>{p.default}</span></td>
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
        <Text typeScale="bodyLg" as="p" prominence="subtle" style={{ maxWidth: '60ch' }}>
          One component, three emphases. The primary carries a 1px inner
          highlight and a paired shadow —{' '}
          <Text as="span" role="inlineEmphasis">quiet depth,</Text> never glow.
        </Text>
      </Stack>

      {/* Live demo surface */}
      <div id="emphases" style={{ background: color.surface, border: `1px solid ${color.border}`, borderRadius: radius.surface, padding: space.xl }}>
        <Row justify="between" align="center" wrap style={{ gap: space.lg }}>
          <Row gap="md" align="center" wrap>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="tertiary">Tertiary</Button>
          </Row>
        </Row>
      </div>

      {/* Code block — omits default props per the "defaults are implicit" rule,
          so a plain primary/md button is just <Button>. */}
      <div style={{ background: color.backgroundInverse, borderRadius: radius.surface, padding: space.lg }}>
        <code style={{ fontFamily: MONO, fontSize: 14, color: color.textInverse }}>
          {'<Button variant="secondary" size="lg">Inspect tokens</Button>'}
        </code>
      </div>

      <div id="sizes"><PropsTable /></div>
    </Stack>
  );
}

function LandingPoc() {
  const stickyTop = HEADER_H;
  return (
    <Stack style={{ minHeight: '100vh', background: color.background, color: color.text }}>
      {/* One persistent, minimal utility bar spanning landing + docs. */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: color.background,
          borderBottom: `1px solid ${color.border}`,
          padding: `${space.md} ${space.xl}`,
        }}
      >
        <HeroNav />
      </div>

      {/* Landing: hero owns no nav here — the shell's bar above does. */}
      <Hero showNav={false} readDocsHref="#docs" playgroundHref="#docs" />

      {/* Docs shell — appears only once scrolled past the hero. */}
      <main
        id="docs"
        style={{
          // GAP — no DocsGrid primitive. Three tracks: rail / content / TOC.
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
            {onThisPage.map((item, i) => (
              <a key={item} href="#" style={{ textDecoration: 'none' }}>
                <Text typeScale="bodySm" as="span" prominence={i === 0 ? 'default' : 'subtle'}>{item}</Text>
              </a>
            ))}
          </Stack>
        </nav>
      </main>
    </Stack>
  );
}

const meta: Meta<typeof LandingPoc> = {
  title: 'POC/Landing + Docs',
  component: LandingPoc,
  parameters: { layout: 'fullscreen', removePreviewPadding: true },
};
export default meta;

type Story = StoryObj<typeof LandingPoc>;

export const Experience: Story = {};

// Impeccable audit of the full landing/docs page under Pearl. Unlike
// `Experience`, this renders a VISIBLE findings panel (bottom-right) via
// `StoryAudit`, so you can see the audit result in the canvas — and the `play`
// still asserts zero findings as the CI gate (the overlay is excluded from the
// scan, so it never audits itself).
export const Audit: Story = {
  render: () => (
    <StoryAudit>
      <LandingPoc />
    </StoryAudit>
  ),
  play: async ({ canvasElement }) => {
    const { count, text } = await runImpeccableAudit(canvasElement);
    expect(count, text).toBe(0);
  },
};
