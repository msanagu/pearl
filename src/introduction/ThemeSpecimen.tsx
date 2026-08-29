import { Text } from '@components/Text/Text';
import { Button } from '@components/Button/Button';
import { Card } from '@components/Card/Card';
import { Field } from '@components/Field/Field';
import { Input } from '@components/Input/Input';
import { Row } from '@components/Row/Row';
import { Stack } from '@components/Stack/Stack';
import { Tag } from '@components/Tag/Tag';
import { color, space } from '@tokens';
import { brandWordmarkByTheme } from '@/foundations/typeSpecimens';
import { WordMark } from '@components/_brand/WordMark';

/**
 * One theme's specimen — deliberately carries NO theme class of its own. It
 * renders under whatever theme its host applies, which is what lets the
 * introduction page show four of these side by side in isolated frames.
 *
 * Why frames rather than four nested `<div>`s: a theme styles its components
 * through `globalStyle` descendant selectors keyed on the theme class
 * (`.tahitianDark [data-component="button"]`). Nesting a second theme inside
 * the first does NOT stop those rules — both selectors match the inner
 * button at identical specificity, and CSS resolves that tie by source
 * order, not by which ancestor is nearer. The inner theme therefore loses to
 * whichever stylesheet happens to load last. Custom properties nest
 * correctly; `globalStyle` rules do not, so real isolation is the only
 * honest way to render two themes on one page.
 */
type SpecimenWordmark = { text: string; role?: 'inlineEmphasis' };

export const themeSpecimens = {
  // `brandWordmarkByTheme` is keyed by `string` (it's shared with call sites
  // that index it off an arbitrary Storybook toolbar value), so these
  // lookups are non-null asserted — the keys are the map's own literal
  // entries, not runtime input.
  pearl: { name: 'Pearl', authored: true, mode: 'light', wordmark: brandWordmarkByTheme.pearl! },
  tahitian: { name: 'Tahitian', authored: true, mode: 'dark', wordmark: brandWordmarkByTheme.tahitian! },
  freshwater: { name: 'Freshwater', authored: true, mode: 'light', wordmark: brandWordmarkByTheme.freshwater! },
  southSea: { name: 'South Sea', authored: true, mode: 'dark', wordmark: brandWordmarkByTheme.southSea! },
} as const satisfies Record<
  string,
  { name: string; authored: boolean; mode: 'light' | 'dark'; wordmark: SpecimenWordmark }
>;

export type ThemeKey = keyof typeof themeSpecimens;

/** Narrows an arbitrary toolbar global to a known specimen, defaulting to Pearl. */
export function specimenFor(theme: unknown) {
  return themeSpecimens[theme as ThemeKey] ?? themeSpecimens.pearl;
}

export interface ThemeSpecimenProps {
  name: string;
  /** `false` marks a palette that is still a rough draft, not a finished theme. */
  authored?: boolean;
  wordmark: SpecimenWordmark;
}

export function ThemeSpecimen({ name, authored = true, wordmark }: ThemeSpecimenProps) {
  return (
    <Stack
      gap="lg"
      style={{ padding: space.lg, background: color.background, boxSizing: 'border-box' }}
    >
      <Stack gap="xs">
        <Row justify="between" align="center" gap="sm">
          <Text as="h3" typeScale="headingSm" style={{ margin: 0 }}>
            {name}
          </Text>
          {!authored && <Tag variant="warn">WIP</Tag>}
        </Row>
        <Text as="p" typeScale="bodySm" prominence="subtle" style={{ margin: 0 }}>
          Same markup, same token contract, extended as needed.
        </Text>
      </Stack>

      {/* A denser sample than the old bare button row — the theme's own
          brand wordmark (same source every other specimen in the system
          reads), a Card's own surface/border/radius, display type, a
          sentiment Tag, and a Field + Input pair all land in one glance,
          still built from nothing but shipped primitives. */}
      <Card padding="lg">
        <Stack gap="lg">
          {/* Every theme sets `borderStrong` — this rule isn't a Freshwater
              one-off, even though it happens to also BE Freshwater's own
              documented "heavy 2px rule under the header" geometry
              (docs/theme/theme-revision-decisions.md §4). */}
          <div style={{ paddingBottom: space.sm, borderBottom: `2px solid ${color.borderStrong}` }}>
            <WordMark text={wordmark.text} role={wordmark.role} scale={0.4} />
          </div>
          <Row justify="between" align="center" gap="sm">
            <Stack gap="sm">
              <Text role="preheading" as="p" typeScale="caption" prominence="subtle" style={{ margin: 0 }}>
                Active sessions
              </Text>
            </Stack>
            <Tag variant="positive">▲ +4.8%</Tag>
          </Row>
          <Text as="p" typeScale="displaySm" style={{ margin: 0 }}>
            1,284
          </Text>
          <Text as="p" measure="md">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nunc nisl aliquam nisl, eget ultricies nunc nisl eget nunc.</Text>
          <Field label="Email">
            {(injected) => <Input {...injected} placeholder="you@studio.co" />}
          </Field>
          <Row gap="sm" wrap>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
          </Row>
        </Stack>
      </Card>
    </Stack>
  );
}
