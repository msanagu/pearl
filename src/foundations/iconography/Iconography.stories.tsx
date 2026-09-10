import type { Meta, StoryObj } from '@storybook/react-vite';
import type { IconType } from 'react-icons';
import { PiCheck, PiGear } from 'react-icons/pi';
import { RiSettingsLine } from 'react-icons/ri';
import { TbSettings } from 'react-icons/tb';
import { RxGear } from 'react-icons/rx';
import { Icon } from '@components/Icon/Icon';
import type { IconTone } from '@components/Icon/Icon';
import { ICON_LIBRARIES } from '@components/Icon/iconLibraries';
import type { IconTreatment } from '@components/Icon/iconLibraries';
import { THEME_ICON_SETS } from '@components/Icon/iconSets';
import type { ThemeName } from '@components/Icon/iconSets';
import { Row } from '@components/Row/Row';
import { Stack } from '@components/Stack/Stack';
import { Text } from '@components/Text/Text';
import IconMeta, { Tone as IconToneStory } from '@components/Icon/Icon.stories';
import { StoryDoc } from '@/storydoc/StoryDoc';
import { embedStory } from '@/storydoc/embedStory';
import { iconographyDoc } from './Iconography.doc';
import * as css from './Iconography.css';

// Same story Components/Icon renders on its own page — embedded, not
// re-implemented, so the two can't drift the way the old hand-copied version
// already did once (Icon.tone's class-to-prop migration broke it silently).
const EmbeddedTone = embedStory(IconToneStory, IconMeta);

const THEME_LABELS: Record<ThemeName, string> = {
  pearl: 'Pearl',
  tahitian: 'Tahitian',
  freshwater: 'Freshwater',
  southSea: 'South Sea',
};

const VOCAB = ['positive', 'negative', 'warn', 'info', 'close'] as const;

// `close` carries no sentiment, so it stays untoned — matching how Alert/Field
// actually render this vocabulary, not a flat black row that hides the point.
const VOCAB_TONE: Partial<Record<(typeof VOCAB)[number], IconTone>> = {
  positive: 'positive',
  negative: 'negative',
  warn: 'warn',
  info: 'info',
};

// The same concept (settings), drawn from each theme's own pick further down
// this page (see ThemeVocabulary) — one shape, four unrelated glyphs. Picked
// over search/warning/user/heart/star: those five converge to nearly the same
// silhouette across sets: a settings gear is where they actually diverge —
// fine-toothed circle, hex nut, coarse gear, and a sharper-toothed gear.
const SETTINGS_ICON_BY_THEME: Record<ThemeName, IconType> = {
  pearl: PiGear,
  tahitian: RiSettingsLine,
  freshwater: TbSettings,
  southSea: RxGear,
};

const DEMO_SECTIONS = [
  { title: 'Why react-icons', id: 'why-react-icons' },
  { title: 'Library comparison', id: 'library-comparison' },
  { title: 'Theme vocabulary', id: 'theme-vocabulary' },
  { title: 'Tone', id: 'tone' },
];

const COLUMNS = ['Set', 'Treatment', 'Weights', 'Coverage', 'Notes'] as const;

// Spelled out, not "both" — a table cell reads on its own, without the
// reader looking back up at the column header to know what it's both of.
const TREATMENT_LABEL: Record<IconTreatment, string> = {
  outline: 'Outline',
  filled: 'Filled',
  both: 'Outline and Filled',
};

function WhyReactIcons() {
  return (
    <Stack gap="lg" style={{ maxWidth: '100%' }}>
      <Text as="p" typeScale="bodyMd" measure="lg">
        react-icons is a peer dependency, not bundled — chosen because it
        normalizes around 30 popular sets to one IconType shape, so a theme
        can pick its own default vocabulary instead of inheriting one
        system-wide choice. A design system that ships one baked-in set
        forces every consumer through that system's taste. Accepting
        react-icons costs nothing at runtime instead: each set still imports
        from its own subpath (react-icons/pi, react-icons/lu) and
        tree-shakes normally.
      </Text>
      <Row gap="xl" wrap>
        {(Object.keys(THEME_LABELS) as ThemeName[]).map((themeName) => (
          <Stack key={themeName} gap="xs" align="center" style={{ width: 72 }}>
            <Icon
              icon={SETTINGS_ICON_BY_THEME[themeName]}
              size={24}
              aria-hidden="true"
            />
            <Text as="span" typeScale="caption" prominence="subtle">
              {THEME_LABELS[themeName]}
            </Text>
          </Stack>
        ))}
      </Row>
      <Text as="p" typeScale="bodyMd" prominence="subtle" measure="lg">
        None of this is required, though — Icon's icon prop only needs a
        component shaped (props) =&gt; ReactNode. A consumer can hand it
        icons from any library, or swap Icon itself for something built on a
        custom set. A theme's icon language is free to differ as much as its
        type or color does.
      </Text>
    </Stack>
  );
}

function LibraryComparison() {
  return (
    <Stack gap="md" style={{ maxWidth: '100%' }}>
      <Text as="p" typeScale="bodySm" prominence="subtle" measure="lg">
        Every set here normalizes to the same IconType — what differs is
        coverage (how many distinct icons it actually has), treatment, and
        whether it ships a weight axis.
      </Text>
      <div className={css.scroll}>
        <table className={css.libTable}>
          <caption className={css.srOnly}>
            Icon library comparison: treatment, weight axis, approximate icon
            coverage, and notes for each evaluated react-icons set
          </caption>
          <thead>
            <tr>
              {COLUMNS.map((h) => (
                <th
                  key={h}
                  scope="col"
                  className={
                    h === 'Coverage' ? css.headCellRight : css.headCell
                  }
                >
                  <Text as="span" typeScale="bodySm" weight="semibold">
                    {h}
                  </Text>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ICON_LIBRARIES.map((lib) => (
              <tr key={lib.id} className={css.bodyRow}>
                <td className={css.cell}>
                  <Text as="span" typeScale="bodyMd" weight="semibold">
                    {lib.label}
                  </Text>
                  <Text
                    as="span"
                    typeScale="bodySm"
                    prominence="subtle"
                    className={css.setPath}
                  >
                    react-icons/{lib.id}
                  </Text>
                </td>
                <td className={css.cell}>
                  <Text as="span" typeScale="bodyMd">
                    {TREATMENT_LABEL[lib.treatment]}
                  </Text>
                </td>
                <td className={css.cellCenter}>
                  {lib.weights ? (
                    <Icon
                      icon={PiCheck}
                      size={18}
                      aria-label="ships weights"
                    />
                  ) : (
                    <Text as="span" typeScale="bodyMd" prominence="subtle" aria-hidden="true">
                      —
                    </Text>
                  )}
                  <span className={css.srOnly}>
                    {lib.weights ? 'ships weights' : 'no weight axis'}
                  </span>
                </td>
                <td className={css.cellRight}>
                  <Text as="span" typeScale="bodyMd" role="dataDigits">
                    ~{lib.size.toLocaleString('en-US')}
                  </Text>
                </td>
                <td className={css.notesCell}>
                  <Text as="span" typeScale="bodyMd" prominence="subtle">
                    {lib.notes}
                  </Text>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Stack>
  );
}

function ThemeVocabulary() {
  return (
    <Stack gap="lg" style={{ maxWidth: '100%' }}>
      <Text as="p" typeScale="bodySm" prominence="subtle" measure="lg">
        Alert and Field borrow this five-icon vocabulary from
        whichever set the active theme maps it to via ThemeIconProvider — no
        component hardcodes a set for its own icons.
      </Text>
      <Row gap="xl" wrap align="start">
        {(Object.keys(THEME_LABELS) as ThemeName[]).map((themeName) => {
          const set = THEME_ICON_SETS[themeName];
          return (
            <Stack key={themeName} gap="sm">
              <Text as="span" typeScale="bodyMd" weight="semibold">
                {THEME_LABELS[themeName]}
              </Text>
              <Row gap="lg">
                {VOCAB.map((key) => (
                  <Stack key={key} gap="xs" align="center" style={{ width: 64 }}>
                    <Icon icon={set[key]} tone={VOCAB_TONE[key]} size={24} />
                    <Text as="span" typeScale="caption" prominence="subtle">
                      {key}
                    </Text>
                  </Stack>
                ))}
              </Row>
            </Stack>
          );
        })}
      </Row>
    </Stack>
  );
}

function ToneDemo() {
  return (
    <Stack gap="md" style={{ maxWidth: '100%' }}>
      <Text as="p" typeScale="bodySm" prominence="subtle" measure="lg">
        Icons carry the same sentiment tones as text and surfaces — accent,
        plus the four alert sentiments. Tone flips inside a [data-inverse]
        container like every other color token.
      </Text>
      <EmbeddedTone />
    </Stack>
  );
}

function IconographyDemo() {
  return (
    <Stack gap="2xl">
      <Stack gap="md" id="why-react-icons">
        <Text as="h2" typeScale="headingSm">
          Why react-icons
        </Text>
        <WhyReactIcons />
      </Stack>
      <Stack gap="md" id="library-comparison">
        <Text as="h2" typeScale="headingSm">
          Library comparison
        </Text>
        <LibraryComparison />
      </Stack>
      <Stack gap="md" id="theme-vocabulary">
        <Text as="h2" typeScale="headingSm">
          Theme vocabulary
        </Text>
        <ThemeVocabulary />
      </Stack>
      <Stack gap="md" id="tone">
        <Text as="h2" typeScale="headingSm">
          Tone
        </Text>
        <ToneDemo />
      </Stack>
    </Stack>
  );
}

const meta: Meta<typeof IconographyDemo> = {
  title: 'Foundations/Iconography',
  component: IconographyDemo,
  parameters: {
    layout: 'fullscreen',
    removePreviewPadding: true,
  },
};
export default meta;

type Story = StoryObj<typeof IconographyDemo>;

// Named to match the title's last segment so Storybook collapses the group
// into a single sidebar entry (no Iconography/Default nesting).
export const Iconography: Story = {
  render: () => (
    <StoryDoc doc={iconographyDoc} demoSections={DEMO_SECTIONS} entityId="foundation.iconography">
      <IconographyDemo />
    </StoryDoc>
  ),
};
