import { Text } from '@components/Text/Text';
import { Alert } from '@components/Alert/Alert';
import { Card } from '@components/Card/Card';
import { Link } from '@components/Link/Link';
import { Row } from '@components/Row/Row';
import { Stack } from '@components/Stack/Stack';
import { Tag } from '@components/Tag/Tag';
import { text } from '@tokens';
import { codeBlock } from './Setup.css';

const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace';

function CodeBlock({ label, children }: { label: string; children: string }) {
  return (
    // tabIndex: overflow-x is a keyboard-reachable scroll region. role+label:
    // several near-identical blocks on one page are otherwise indistinguishable stops.
    <div
      data-inverse
      className={codeBlock}
      tabIndex={0}
      role="group"
      aria-label={label}
    >
      <pre style={{ margin: 0 }}>
        <code
          style={{
            fontFamily: MONO,
            fontSize: text.bodySm.fontSize,
            lineHeight: text.bodySm.lineHeight,
          }}
        >
          {children}
        </code>
      </pre>
    </div>
  );
}

/**
 * Rendered as `<StoryDoc>` `children` (see Setup.stories.tsx) — same shape as
 * Foundations/Iconography and Foundations/Radius, so the page chrome
 * (heading, rail, section anchors) comes from `<StoryDoc>` itself instead of
 * a second hand-rolled copy of it.
 */
export function SetupDemo() {
  return (
    <Stack gap="2xl">
      <Stack gap="md" id="install">
        <Text as="h2" typeScale="headingSm">
          Install
        </Text>
        <Text as="p" measure="lg">
          Published under the <code>test</code> dist-tag while the API is still
          moving — not <code>latest</code>.
        </Text>
        <CodeBlock label="Install command">
          {'npm i @msanagu/pearl@test'}
        </CodeBlock>
        <Text as="p" typeScale="bodySm" prominence="subtle">
          <Link
            href="https://www.npmjs.com/package/@msanagu/pearl"
            target="_blank"
            rel="noopener noreferrer"
          >
            See it on npm →
          </Link>
        </Text>
      </Stack>

      <Stack gap="md" id="theme">
        <Text as="h2" typeScale="headingSm">
          Applying a theme
        </Text>
        <Text as="p" measure="lg">
          Theming isn't a color context — it's a CSS class on a root element.
          Each theme exports a light and a dark class; pick the theme, then pick
          the mode class for it. Mode is independent of theme.
        </Text>
        <CodeBlock label="Apply a theme class">
          {[
            "import { pearlLightThemeClass } from '@msanagu/pearl';",
            '',
            '<html className={pearlLightThemeClass}>',
          ].join('\n')}
        </CodeBlock>
        <Stack gap="xs">
          <Text as="p" typeScale="bodySm" prominence="subtle">
            Every theme exports the same pair:
          </Text>
          {/* role="list": Safari/VoiceOver drops list semantics from a flex-display ul. */}
          <Stack
            as="ul"
            role="list"
            gap="xs"
            style={{ margin: 0, paddingLeft: '1.25em' }}
          >
            {[
              [
                'pearlLightThemeClass',
                'pearlDarkThemeClass',
                'pearl/pearl.css.ts',
                177,
              ],
              [
                'tahitianLightThemeClass',
                'tahitianDarkThemeClass',
                'tahitian/tahitian.css.ts',
                231,
              ],
              [
                'freshwaterLightThemeClass',
                'freshwaterDarkThemeClass',
                'freshwater/freshwater.css.ts',
                85,
              ],
              [
                'southSeaLightThemeClass',
                'southSeaDarkThemeClass',
                'south-sea/south-sea.css.ts',
                90,
              ],
            ].map(([light, dark, path, line]) => (
              <Text as="li" key={light} typeScale="bodySm" prominence="subtle">
                <Link
                  href={`https://github.com/msanagu/pearl/blob/main/src/themes/${path}#L${line}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <code>{light}</code> / <code>{dark}</code>
                </Link>
              </Text>
            ))}
          </Stack>
          <Text as="p" typeScale="bodySm" prominence="subtle">
            All of it — every theme's classes, ThemeIconProvider, each theme's
            extension class — comes from one export surface:{' '}
            <Link
              href="https://github.com/msanagu/pearl/blob/main/src/index.ts"
              target="_blank"
              rel="noopener noreferrer"
            >
              <code>src/index.ts</code> →
            </Link>
          </Text>
        </Stack>

        <Stack gap="xs">
          <Row gap="sm" align="center">
            <Text as="h3" typeScale="bodyMd" weight="semibold">
              Building your own theme
            </Text>
            <Tag variant="neutral">Optional</Tag>
          </Row>
          <Text as="p" measure="lg">
            A role like <code>primary</code> is free to draw from its own
            primitive scale — nothing requires it to match{' '}
            <code>accent</code>. Freshwater's primary and accent are two
            unrelated scales; Pearl deliberately keeps them separate too —
            reusing its subtle accent for primary would make every subtle
            accent use go loud as well.
          </Text>
          <Text as="p" typeScale="bodySm" prominence="subtle">
            The only thing actually enforced is the contract itself:{' '}
            <code>createTheme(vars, {'{...}'})</code> requires every semantic
            key to resolve to something — TypeScript fails to compile on a
            missing or misnamed token, never on a mismatched relationship
            between two roles. See the full shape at{' '}
            <Link
              href="https://github.com/msanagu/pearl/blob/main/src/theme.css.ts"
              target="_blank"
              rel="noopener noreferrer"
            >
              src/theme.css.ts →
            </Link>
            .
          </Text>
          <Text as="p" typeScale="bodySm" prominence="subtle">
            Look at an existing theme's choice before assuming a role must
            match convention: Tahitian's primary and accent are identical,
            Freshwater's are unrelated, Pearl's are deliberately distinct.
            All three are equally valid — pick based on the brand, not on
            matching what another theme did.
          </Text>
        </Stack>
      </Stack>

      <Stack gap="md" id="icons">
        <Row gap="sm" align="center">
          <Text as="h2" typeScale="headingSm">
            Icon sets
          </Text>
          <Tag variant="neutral">Optional</Tag>
        </Row>
        <Text as="p" measure="lg">
          <Link
            href="https://github.com/msanagu/pearl/blob/main/src/components/Icon/ThemeIconProvider.tsx#L30"
            target="_blank"
            rel="noopener noreferrer"
          >
            <code>ThemeIconProvider</code>
          </Link>{' '}
          is the one real React context in the theming system. It only supplies
          the small internal vocabulary Alert and Field draw on automatically
          (positive/negative/warn/info/close) — optional, and a component's own
          explicit <code>icon</code> prop is never affected by it.
        </Text>
        <CodeBlock label="Wrap the app in ThemeIconProvider">
          {[
            "import { ThemeIconProvider } from '@msanagu/pearl';",
            '',
            '<ThemeIconProvider theme="pearl">',
            '  <App />',
            '</ThemeIconProvider>',
          ].join('\n')}
        </CodeBlock>
        <Text as="p" typeScale="bodySm" prominence="subtle">
          <code>theme: 'pearl' | 'tahitian' | 'freshwater' | 'southSea'</code>.
          Without a provider, those five icons default to Phosphor.
        </Text>

        <Stack gap="xs">
          <Row gap="sm" align="center">
            <Text as="h3" typeScale="bodyMd" weight="semibold">
              Choosing a set for a new theme
            </Text>
            <Tag variant="neutral">Optional</Tag>
          </Row>
          <Text as="p" measure="lg">
            Pick a set by treatment, weight axis, and coverage — not
            familiarity alone. A refined theme at a light type weight wants a
            set with a matching thin/light export (Phosphor); a dataDense
            product wants deep coverage (Tabler) over a small curated set
            (Radix).
          </Text>
          <Text as="p" typeScale="bodySm" prominence="subtle">
            Never hardcode a react-icons import for Alert/Field's internal
            icons directly — that vocabulary reads from the active
            ThemeIconSet via context, so a new theme can swap it without
            touching component code. A per-usage <code>icon</code> prop
            elsewhere is unaffected and stays a direct import.
          </Text>
        </Stack>
      </Stack>

      <Stack gap="md" id="fonts">
        <Text as="h2" typeScale="headingSm">
          Fonts
        </Text>
        <Text as="p" measure="lg">
          Each theme exports its font stack (e.g. <code>pearlFonts</code>), but
          loading the actual font files is left to the consumer — Pearl doesn't
          inject them.
        </Text>
        <Alert variant="info" heading="No font-loading API yet">
          This Storybook loads fonts itself, from Fontshare CDN links and
          self-hosted files depending on the theme — see{' '}
          <Link
            href="https://github.com/msanagu/pearl/blob/main/.storybook/preview-head.html"
            target="_blank"
            rel="noopener noreferrer"
          >
            .storybook/preview-head.html →
          </Link>{' '}
          for a reference, not a documented mechanism.
        </Alert>
      </Stack>

      <Stack gap="md" id="extension">
        <Row gap="sm" align="center">
          <Text as="h2" typeScale="headingSm">
            Extension classes
          </Text>
          <Tag variant="neutral">Optional</Tag>
        </Row>
        <Text as="p" measure="lg">
          Some themes also export an <code>*ExtensionClass</code> for a visual
          effect layer of their own — see{' '}
          <Link
            href="https://github.com/msanagu/pearl/blob/main/src/themes/pearl/pearl.css.ts#L507"
            target="_blank"
            rel="noopener noreferrer"
          >
            <code>pearlExtensionClass</code> →
          </Link>{' '}
          for a real one. Optional — only themes that define one export it.
          Concatenate with the theme class rather than swapping in for it.
        </Text>
        <CodeBlock label="Combine a theme class with its extension class">
          {[
            "import { pearlLightThemeClass, pearlExtensionClass } from '@msanagu/pearl';",
            '',
            '<html className={`${pearlLightThemeClass} ${pearlExtensionClass}`}>',
          ].join('\n')}
        </CodeBlock>
      </Stack>

      <Stack gap="md" id="next">
        <Text as="h2" typeScale="headingSm">
          Next steps
        </Text>
        <Text as="p" measure="lg">
          This page is wiring, not a tour. From here:
        </Text>
        <Row gap="md" wrap>
          <Card
            padding="md"
            style={{ flex: '1 1 200px' }}
            href="./?path=/story/foundations-color-tokens--tokens"
            target="_top"
          >
            <Stack gap="xs">
              <Text as="p" typeScale="bodyMd" weight="semibold">
                Foundations
              </Text>
              <Text as="p" typeScale="bodySm" prominence="subtle">
                The token contract — color, space, radius, typography.
              </Text>
            </Stack>
          </Card>
          <Card
            padding="md"
            style={{ flex: '1 1 200px' }}
            href="./?path=/docs/components-alert--docs"
            target="_top"
          >
            <Stack gap="xs">
              <Text as="p" typeScale="bodyMd" weight="semibold">
                Components
              </Text>
              <Text as="p" typeScale="bodySm" prominence="subtle">
                Every primitive, with props and states.
              </Text>
            </Stack>
          </Card>
        </Row>
      </Stack>
    </Stack>
  );
}
