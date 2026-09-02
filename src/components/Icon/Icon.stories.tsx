import type { Meta, StoryObj } from '@storybook/react-vite';
import type { IconType } from 'react-icons';
import {
  PiHeart,
  PiHeartThin,
  PiHeartLight,
  PiHeartBold,
  PiHeartFill,
  PiHeartDuotone,
  PiBell,
  PiStar,
  PiUser,
  PiGear,
  PiMagnifyingGlass,
  PiShieldCheck,
  PiWarning,
  PiSparkleDuotone,
  PiShieldCheckDuotone,
  PiBellRingingDuotone,
  PiWarningDuotone,
  PiCompassDuotone,
  PiBellFill,
  PiStarFill,
  PiUserFill,
} from 'react-icons/pi';
import {
  LuHeart,
  LuBell,
  LuStar,
  LuUser,
  LuSettings,
  LuSearch,
  LuShieldCheck,
  LuTriangleAlert,
} from 'react-icons/lu';
import {
  TbHeart,
  TbBell,
  TbStar,
  TbUser,
  TbSettings,
  TbSearch,
  TbShieldCheck,
  TbAlertTriangle,
} from 'react-icons/tb';
import {
  RiHeartLine,
  RiBellLine,
  RiStarLine,
  RiUserLine,
  RiSettingsLine,
  RiSearchLine,
  RiShieldCheckLine,
  RiAlertLine,
  RiHeartFill,
  RiBellFill,
  RiStarFill,
  RiUserFill,
} from 'react-icons/ri';
import {
  RxHeart,
  RxBell,
  RxStar,
  RxPerson,
  RxGear,
  RxMagnifyingGlass,
  RxExclamationTriangle,
} from 'react-icons/rx';
import {
  FiHeart,
  FiBell,
  FiStar,
  FiUser,
  FiSettings,
  FiSearch,
  FiShield,
  FiAlertTriangle,
} from 'react-icons/fi';
import {
  HiHeart,
  HiBell,
  HiStar,
  HiUser,
  HiCog6Tooth,
  HiMagnifyingGlass,
  HiShieldCheck,
  HiExclamationTriangle,
  HiOutlineHeart,
  HiOutlineBell,
  HiOutlineStar,
  HiOutlineUser,
} from 'react-icons/hi2';
import {
  BsHeart,
  BsBell,
  BsStar,
  BsPerson,
  BsGear,
  BsSearch,
  BsShieldCheck,
  BsExclamationTriangle,
} from 'react-icons/bs';
import { Icon } from './Icon';
import { ICON_LIBRARIES_BY_ID } from './iconLibraries';
import { THEME_ICON_SETS } from './iconSets';
import type { ThemeName } from './iconSets';
import { Row } from '@components/Row';
import { Stack } from '@components/Stack';
import { Text } from '@components/Text';

/** An icon paired with its export name — the code panel is generated from it. */
interface Entry {
  name: string;
  Component: IconType;
}
const entry = (name: string, Component: IconType): Entry => ({
  name,
  Component,
});

const iconMapping = {
  Heart: PiHeart,
  Sparkle: PiSparkleDuotone,
  ShieldCheck: PiShieldCheckDuotone,
  BellRinging: PiBellRingingDuotone,
  Warning: PiWarningDuotone,
  Compass: PiCompassDuotone,
};

/**
 * Wraps any `react-icons` icon component and renders `data-component="icon"`
 * for the override contract. Every set shares one `IconType` signature, so
 * swapping sets is an import change and nothing more — the stories below show
 * that. No `weight` prop: `react-icons` encodes weight in the icon name.
 */
const meta: Meta<typeof Icon> = {
  title: 'Components/Icon',
  component: Icon,
  tags: ['autodocs'],
  args: {
    // Stored as the mapping key (see `argTypes.icon` below); cast because
    // `IconProps.icon` is typed as the resolved component, not the key.
    icon: 'Heart' as unknown as IconType,
    size: 32,
  },
  argTypes: {
    // Store the key in args and resolve to a component at render time — an icon
    // component has no readable string form for Controls or the code panel.
    icon: {
      control: 'select',
      options: Object.keys(iconMapping),
      mapping: iconMapping,
    },
  },
};
export default meta;

type Story = StoryObj<typeof Icon>;

// ---- Source generation -----------------------------------------------------

/**
 * Storybook's default "Show code" serializes the rendered tree — for a
 * `render`-function story that's this file's scaffolding, not usage. Every
 * story below overrides `docs.source.code` with the real import + call.
 */
function sourceFor(importPath: string, names: string[], body: string): string {
  return `import { Icon } from '@msanagu/pearl';\nimport { ${names.join(
    ', ',
  )} } from '${importPath}';\n\n${body}`;
}

/** `docs.source` parameters block, for stories whose code doesn't vary by arg. */
function staticSource(code: string) {
  return { docs: { source: { code, language: 'tsx' } } };
}

// ---- Switching sets --------------------------------------------------------

/**
 * The same eight concepts across eight sets. Naming isn't consistent between
 * sets (`PiMagnifyingGlass` vs `LuSearch` vs `RiSearchLine`), which is why the
 * lookup exists. `null` means the set has no icon for that concept.
 */
const CONCEPTS = [
  'search',
  'settings',
  'heart',
  'star',
  'bell',
  'shield',
  'user',
  'warning',
] as const;
type Concept = (typeof CONCEPTS)[number];

const SETS: Record<string, Record<Concept, Entry | null>> = {
  pi: {
    search: entry('PiMagnifyingGlass', PiMagnifyingGlass),
    settings: entry('PiGear', PiGear),
    heart: entry('PiHeart', PiHeart),
    star: entry('PiStar', PiStar),
    bell: entry('PiBell', PiBell),
    shield: entry('PiShieldCheck', PiShieldCheck),
    user: entry('PiUser', PiUser),
    warning: entry('PiWarning', PiWarning),
  },
  lu: {
    search: entry('LuSearch', LuSearch),
    settings: entry('LuSettings', LuSettings),
    heart: entry('LuHeart', LuHeart),
    star: entry('LuStar', LuStar),
    bell: entry('LuBell', LuBell),
    shield: entry('LuShieldCheck', LuShieldCheck),
    user: entry('LuUser', LuUser),
    warning: entry('LuTriangleAlert', LuTriangleAlert),
  },
  tb: {
    search: entry('TbSearch', TbSearch),
    settings: entry('TbSettings', TbSettings),
    heart: entry('TbHeart', TbHeart),
    star: entry('TbStar', TbStar),
    bell: entry('TbBell', TbBell),
    shield: entry('TbShieldCheck', TbShieldCheck),
    user: entry('TbUser', TbUser),
    warning: entry('TbAlertTriangle', TbAlertTriangle),
  },
  ri: {
    search: entry('RiSearchLine', RiSearchLine),
    settings: entry('RiSettingsLine', RiSettingsLine),
    heart: entry('RiHeartLine', RiHeartLine),
    star: entry('RiStarLine', RiStarLine),
    bell: entry('RiBellLine', RiBellLine),
    shield: entry('RiShieldCheckLine', RiShieldCheckLine),
    user: entry('RiUserLine', RiUserLine),
    warning: entry('RiAlertLine', RiAlertLine),
  },
  rx: {
    search: entry('RxMagnifyingGlass', RxMagnifyingGlass),
    settings: entry('RxGear', RxGear),
    heart: entry('RxHeart', RxHeart),
    star: entry('RxStar', RxStar),
    bell: entry('RxBell', RxBell),
    shield: null,
    user: entry('RxPerson', RxPerson),
    warning: entry('RxExclamationTriangle', RxExclamationTriangle),
  },
  fi: {
    search: entry('FiSearch', FiSearch),
    settings: entry('FiSettings', FiSettings),
    heart: entry('FiHeart', FiHeart),
    star: entry('FiStar', FiStar),
    bell: entry('FiBell', FiBell),
    shield: entry('FiShield', FiShield),
    user: entry('FiUser', FiUser),
    warning: entry('FiAlertTriangle', FiAlertTriangle),
  },
  hi2: {
    search: entry('HiMagnifyingGlass', HiMagnifyingGlass),
    settings: entry('HiCog6Tooth', HiCog6Tooth),
    heart: entry('HiHeart', HiHeart),
    star: entry('HiStar', HiStar),
    bell: entry('HiBell', HiBell),
    shield: entry('HiShieldCheck', HiShieldCheck),
    user: entry('HiUser', HiUser),
    warning: entry('HiExclamationTriangle', HiExclamationTriangle),
  },
  bs: {
    search: entry('BsSearch', BsSearch),
    settings: entry('BsGear', BsGear),
    heart: entry('BsHeart', BsHeart),
    star: entry('BsStar', BsStar),
    bell: entry('BsBell', BsBell),
    shield: entry('BsShieldCheck', BsShieldCheck),
    user: entry('BsPerson', BsPerson),
    warning: entry('BsExclamationTriangle', BsExclamationTriangle),
  },
};

const SET_IDS = Object.keys(SETS);

function entriesOf(libraryId: string): Entry[] {
  const set = SETS[libraryId];
  if (!set) return [];
  return CONCEPTS.map((concept) => set[concept]).filter(
    (e): e is Entry => e !== null,
  );
}

function ConceptRow({ libraryId, size }: { libraryId: string; size: number }) {
  const set = SETS[libraryId];
  if (!set) return null;
  return (
    <Row gap="xl" wrap>
      {CONCEPTS.map((concept) => {
        const found = set[concept];
        return (
          <Stack key={concept} gap="sm" align="center" style={{ width: 84 }}>
            {found ? (
              <Icon icon={found.Component} size={size} />
            ) : (
              <Text
                typeScale="caption"
                prominence="subtle"
                as="span"
                style={{ lineHeight: `${size}px` }}
              >
                —
              </Text>
            )}
            <Text typeScale="caption" prominence="subtle" as="span">
              {concept}
            </Text>
          </Stack>
        );
      })}
    </Row>
  );
}

function setSource(libraryId: string, size: number): string {
  const entries = entriesOf(libraryId);
  return sourceFor(
    `react-icons/${libraryId}`,
    entries.map((e) => e.name),
    `<Row gap="xl">\n${entries
      .map((e) => `  <Icon icon={${e.name}} size={${size}} />`)
      .join('\n')}\n</Row>`,
  );
}

type SetStory = StoryObj<{ library: string; size: number }>;

/**
 * Pick a set from the control and the whole icon vocabulary swaps — only the
 * import changes. The code panel regenerates with it.
 */
export const SwitchingSets: SetStory = {
  args: { library: 'pi', size: 28 },
  argTypes: {
    library: { control: 'select', options: SET_IDS },
    size: { control: { type: 'range', min: 16, max: 64, step: 4 } },
  },
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        transform: (
          _code: string,
          ctx: { args: { library: string; size: number } },
        ) => setSource(ctx.args.library, ctx.args.size),
      },
    },
  },
  render: ({ library, size }) => {
    const info = ICON_LIBRARIES_BY_ID[library];
    return (
      <Stack gap="lg">
        <Stack gap="xs">
          <Text typeScale="bodyMd" weight="semibold" as="span">
            {info?.label ?? library}
          </Text>
          <Text typeScale="caption" prominence="subtle" as="span">
            react-icons/{library}
          </Text>
        </Stack>
        <ConceptRow libraryId={library} size={size} />
      </Stack>
    );
  },
};

/**
 * Every set stacked, so stroke weight, corner treatment, and optical size are
 * comparable side by side — they vary more than the shared signature suggests.
 */
export const AllSetsCompared: StoryObj = {
  parameters: staticSource(
    `import { Icon } from '@msanagu/pearl';\n` +
      SET_IDS.map(
        (id) =>
          `import { ${entriesOf(id)[0]?.name ?? ''} } from 'react-icons/${id}';`,
      ).join('\n') +
      `\n\n// One component, one contract, eight sets.\n` +
      SET_IDS.map(
        (id) => `<Icon icon={${entriesOf(id)[0]?.name ?? ''}} size={26} />`,
      ).join('\n'),
  ),
  render: () => (
    <Stack gap="2xl">
      {SET_IDS.map((id) => (
        <Stack key={id} gap="sm">
          <Text typeScale="caption" weight="semibold" as="span">
            {ICON_LIBRARIES_BY_ID[id]?.label ?? id} · react-icons/{id}
          </Text>
          <ConceptRow libraryId={id} size={26} />
        </Stack>
      ))}
    </Stack>
  ),
};

// ---- Theme-level defaults ---------------------------------------------------

const THEME_SET_LIBRARY: Record<ThemeName, string> = {
  pearl: 'pi',
  southSea: 'rx',
  freshwater: 'tb',
  tahitian: 'ri',
};

const THEME_LABELS: Record<ThemeName, string> = {
  pearl: 'Pearl',
  southSea: 'South Sea',
  freshwater: 'Freshwater',
  tahitian: 'Tahitian',
};

/**
 * The icon *set* is a theme-level decision, not a per-component or per-usage
 * one. Alert, Field, and XButton never hardcode a `react-icons` set for their
 * own icons (error/warning/close, etc.) — they read the active theme's set
 * via `useThemeIconSet()`, which `ThemeIconProvider` puts into context.
 *
 * The smart default is Phosphor (Pearl's set): a consumer who never renders
 * `ThemeIconProvider` at all still gets exactly today's behavior, unchanged.
 * Wrapping the app in `ThemeIconProvider` is what opts a theme into its own
 * set — nothing breaks, and nothing is required, if it's left out.
 *
 * This only governs the small vocabulary those three components need
 * (`positive`/`negative`/`warn`/`info`/`close`). Everything else stays a
 * plain `icon` prop, chosen per usage, unaffected by theme — and each of
 * these three still takes its own override for that one case that needs to
 * diverge from the theme (`Alert`'s `icon`, `Field`'s `errorIcon`, `XButton`'s
 * `icon`), without switching the whole theme's set.
 */
export const ThemeDefaults: StoryObj = {
  parameters: staticSource(
    `import { ThemeIconProvider } from '@msanagu/pearl';\n\n` +
      `// Wrap the app once — Alert/Field/XButton pick up the right set from here.\n` +
      `<ThemeIconProvider theme="tahitian">\n  <App />\n</ThemeIconProvider>`,
  ),
  render: () => (
    <Stack gap="2xl">
      <Text typeScale="bodySm" prominence="subtle" as="p" style={{ maxWidth: 560 }}>
        Set choice lives at the theme level. No provider → Phosphor (Pearl's
        set), which is today's behavior. Wrapping in{' '}
        <code>ThemeIconProvider</code> opts a theme into its own set for
        Alert/Field/XButton's internal icons only.
      </Text>
      {(Object.keys(THEME_SET_LIBRARY) as ThemeName[]).map((themeName) => {
        const libraryId = THEME_SET_LIBRARY[themeName];
        const set = THEME_ICON_SETS[themeName];
        return (
          <Stack key={themeName} gap="sm">
            <Text typeScale="bodyMd" weight="semibold" as="span">
              {THEME_LABELS[themeName]}
            </Text>
            <Text typeScale="caption" prominence="subtle" as="span">
              {ICON_LIBRARIES_BY_ID[libraryId]?.label ?? libraryId} ·
              react-icons/{libraryId}
            </Text>
            <Row gap="xl">
              {(['positive', 'negative', 'warn', 'info', 'close'] as const).map(
                (key) => (
                  <Stack key={key} gap="xs" align="center" style={{ width: 72 }}>
                    <Icon icon={set[key]} size={24} />
                    <Text typeScale="caption" prominence="subtle" as="span">
                      {key}
                    </Text>
                  </Stack>
                ),
              )}
            </Row>
          </Stack>
        );
      })}
    </Stack>
  ),
};

// ---- Switching styles ------------------------------------------------------

const DEFAULT_WEIGHT = entry('PiHeart', PiHeart);

const PHOSPHOR_WEIGHTS: Entry[] = [
  entry('PiHeartThin', PiHeartThin),
  entry('PiHeartLight', PiHeartLight),
  DEFAULT_WEIGHT,
  entry('PiHeartBold', PiHeartBold),
  entry('PiHeartFill', PiHeartFill),
  entry('PiHeartDuotone', PiHeartDuotone),
];

type WeightStory = StoryObj<{ weight: string; size: number }>;

/**
 * Style *within* a set. Phosphor is the one set here with a weight axis wide
 * enough to track a theme's type weight — a `refined` theme at 380 regular
 * wants `Thin`/`Light`, a `confident` theme at 450/800 wants `Bold`/`Fill`.
 *
 * Note the control changes which *export* renders, not the value of a prop.
 * The code panel is the honest version of that swap.
 */
export const SwitchingStyles: WeightStory = {
  args: { weight: 'PiHeart', size: 40 },
  argTypes: {
    weight: { control: 'radio', options: PHOSPHOR_WEIGHTS.map((e) => e.name) },
    size: { control: { type: 'range', min: 16, max: 64, step: 4 } },
  },
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        transform: (
          _code: string,
          ctx: { args: { weight: string; size: number } },
        ) => {
          const found =
            PHOSPHOR_WEIGHTS.find((e) => e.name === ctx.args.weight) ??
            DEFAULT_WEIGHT;
          return sourceFor(
            'react-icons/pi',
            [found.name],
            `<Icon icon={${found.name}} size={${ctx.args.size}} />`,
          );
        },
      },
    },
  },
  render: ({ weight, size }) => {
    const found =
      PHOSPHOR_WEIGHTS.find((e) => e.name === weight) ?? DEFAULT_WEIGHT;
    return <Icon icon={found.Component} size={size} />;
  },
};

/** All six Phosphor weights side by side, for judging the axis as a whole. */
export const AllStyles: StoryObj = {
  parameters: staticSource(
    sourceFor(
      'react-icons/pi',
      PHOSPHOR_WEIGHTS.map((e) => e.name),
      PHOSPHOR_WEIGHTS.map((e) => `<Icon icon={${e.name}} size={28} />`).join(
        '\n',
      ),
    ),
  ),
  render: () => (
    <Stack gap="lg">
      {PHOSPHOR_WEIGHTS.map((e) => (
        <Row key={e.name} gap="lg" align="center">
          <Text typeScale="caption" style={{ width: 140 }}>
            {e.name}
          </Text>
          <Icon icon={e.Component} size={28} />
        </Row>
      ))}
    </Stack>
  ),
};

const OUTLINE_FILLED: {
  label: string;
  path: string;
  outline: Entry[];
  filled: Entry[];
}[] = [
  {
    label: 'Phosphor',
    path: 'react-icons/pi',
    outline: [
      entry('PiHeart', PiHeart),
      entry('PiBell', PiBell),
      entry('PiStar', PiStar),
      entry('PiUser', PiUser),
    ],
    filled: [
      entry('PiHeartFill', PiHeartFill),
      entry('PiBellFill', PiBellFill),
      entry('PiStarFill', PiStarFill),
      entry('PiUserFill', PiUserFill),
    ],
  },
  {
    label: 'Remix',
    path: 'react-icons/ri',
    outline: [
      entry('RiHeartLine', RiHeartLine),
      entry('RiBellLine', RiBellLine),
      entry('RiStarLine', RiStarLine),
      entry('RiUserLine', RiUserLine),
    ],
    filled: [
      entry('RiHeartFill', RiHeartFill),
      entry('RiBellFill', RiBellFill),
      entry('RiStarFill', RiStarFill),
      entry('RiUserFill', RiUserFill),
    ],
  },
  {
    label: 'Heroicons v2',
    path: 'react-icons/hi2',
    outline: [
      entry('HiOutlineHeart', HiOutlineHeart),
      entry('HiOutlineBell', HiOutlineBell),
      entry('HiOutlineStar', HiOutlineStar),
      entry('HiOutlineUser', HiOutlineUser),
    ],
    filled: [
      entry('HiHeart', HiHeart),
      entry('HiBell', HiBell),
      entry('HiStar', HiStar),
      entry('HiUser', HiUser),
    ],
  },
];

/**
 * The other style axis: outline vs filled. Sets tagged `treatment: 'both'` ship
 * matched pairs, which is what makes selected/unselected states possible
 * without switching sets mid-interface. The suffix convention differs per set
 * (`…Fill`, `…Line`/`…Fill`, `HiOutline…`/`Hi…`) — another reason set choice
 * wants to be centralized rather than spread across call sites.
 */
export const OutlineVersusFilled: StoryObj = {
  parameters: staticSource(
    `import { Icon } from '@msanagu/pearl';\n` +
      OUTLINE_FILLED.map(
        (group) =>
          `import { ${group.outline[0]?.name}, ${group.filled[0]?.name} } from '${group.path}';`,
      ).join('\n') +
      `\n\n// The pair convention differs per set, so a "selected" state is\n` +
      `// a per-set lookup rather than one shared suffix rule.\n` +
      OUTLINE_FILLED.map(
        (group) =>
          `<Icon icon={selected ? ${group.filled[0]?.name} : ${group.outline[0]?.name}} size={26} />`,
      ).join('\n'),
  ),
  render: () => (
    <Stack gap="2xl">
      {OUTLINE_FILLED.map((group) => (
        <Stack key={group.label} gap="sm">
          <Text typeScale="caption" weight="semibold" as="span">
            {group.label}
          </Text>
          <Row gap="xl" align="center">
            <Stack gap="xs" align="center">
              <Row gap="md">
                {group.outline.map((e) => (
                  <Icon key={e.name} icon={e.Component} size={26} />
                ))}
              </Row>
              <Text typeScale="caption" prominence="subtle" as="span">
                outline
              </Text>
            </Stack>
            <Stack gap="xs" align="center">
              <Row gap="md">
                {group.filled.map((e) => (
                  <Icon key={e.name} icon={e.Component} size={26} />
                ))}
              </Row>
              <Text typeScale="caption" prominence="subtle" as="span">
                filled
              </Text>
            </Stack>
          </Row>
        </Stack>
      ))}
    </Stack>
  ),
};

// ---- Duotone ---------------------------------------------------------------

const DUOTONE: Entry[] = [
  entry('PiHeartDuotone', PiHeartDuotone),
  entry('PiSparkleDuotone', PiSparkleDuotone),
  entry('PiShieldCheckDuotone', PiShieldCheckDuotone),
  entry('PiBellRingingDuotone', PiBellRingingDuotone),
  entry('PiWarningDuotone', PiWarningDuotone),
  entry('PiCompassDuotone', PiCompassDuotone),
];

export const Duotone: Story = {
  args: { icon: 'Sparkle' as unknown as IconType },
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        transform: (_code: string, ctx: { args: Record<string, unknown> }) =>
          sourceFor(
            'react-icons/pi',
            [`Pi${String(ctx.args.icon)}Duotone`],
            `<Icon icon={Pi${String(ctx.args.icon)}Duotone} size={${String(ctx.args.size)}} />`,
          ),
      },
    },
  },
};

/** Accent (foreground) + alert (background) recolor, across a small set of icons. */
export const DuotoneGallery: StoryObj = {
  parameters: staticSource(
    sourceFor(
      'react-icons/pi',
      DUOTONE.map((e) => e.name),
      DUOTONE.map((e) => `<Icon icon={${e.name}} size={40} />`).join('\n'),
    ),
  ),
  render: () => (
    <Row gap="lg">
      {DUOTONE.map((e) => (
        <Icon key={e.name} icon={e.Component} size={40} />
      ))}
    </Row>
  ),
};
