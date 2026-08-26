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
import { ICON_LIBRARIES_BY_ID, findIconLibraries } from './iconLibraries';
import type { IconAesthetic, IconPersonality } from './iconLibraries';
import { Row } from '../Row';
import { Stack } from '../Stack';
import { Text } from '../Text';

/**
 * An icon paired with the name it is exported under. The name is not
 * cosmetic — the "Show code" panel below every story is generated from it, so
 * what the panel prints is the real import and the real `<Icon />` call rather
 * than a serialization of this file's own scaffolding.
 */
interface Entry {
  name: string;
  Component: IconType;
}
const entry = (name: string, Component: IconType): Entry => ({ name, Component });

const iconMapping = {
  Heart: PiHeart,
  Sparkle: PiSparkleDuotone,
  ShieldCheck: PiShieldCheckDuotone,
  BellRinging: PiBellRingingDuotone,
  Warning: PiWarningDuotone,
  Compass: PiCompassDuotone,
};

/**
 * Wraps any `react-icons` icon component. Renders `data-component="icon"` for
 * the override contract (see docs/override-patterns.md).
 *
 * `react-icons` normalizes ~30 icon sets to one `IconType` signature, so the
 * set an icon comes from is an import detail — nothing about this component or
 * the override contract changes when it swaps. `iconLibraries.ts` tags those
 * sets by aesthetic so a set can be chosen to match a theme rather than by
 * name. The "Switching sets" and "Switching styles" stories below are the
 * demonstration of both halves.
 *
 * There is no `weight` prop. `react-icons` encodes weight in the icon *name*,
 * so Phosphor's six weights are six exports (`PiHeartThin` … `PiHeartDuotone`)
 * rather than one component and a prop. Sets that ship a single weight — most
 * of them — simply have nothing to express there.
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
    // `icon` takes an icon *component*, which has no readable string form —
    // without `mapping`, both the Controls addon and the "Show code" panel
    // dump the raw function. Storing the key in args and resolving it only at
    // render time keeps both readable.
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
 * Storybook's default "Show code" serializes the rendered element tree, which
 * for a `render`-function story means this file's helper components and lookup
 * tables — implementation detail, not usage. Every story below overrides it
 * with `docs.source.code`, built from real export names, so the panel answers
 * "how do I call this?" instead of "how is this story built?".
 */
function sourceFor(importPath: string, names: string[], body: string): string {
  return `import { Icon } from '@msanagu/design-system';\nimport { ${names.join(
    ', ',
  )} } from '${importPath}';\n\n${body}`;
}

/** `docs.source` parameters block, for stories whose code doesn't vary by arg. */
function staticSource(code: string) {
  return { docs: { source: { code, language: 'tsx' } } };
}

// ---- Switching sets --------------------------------------------------------

/**
 * The same eight concepts drawn by eight sets. Keys are semantic, values are
 * whatever each set happens to name that concept — the naming is *not*
 * consistent across sets (`PiMagnifyingGlass` vs `LuSearch` vs `RiSearchLine`),
 * which is precisely why a lookup like this is needed to swap sets as a unit.
 *
 * `null` means the set has no icon for that concept. Radix genuinely lacks a
 * shield, which is the concrete form of its registry note: a small set that
 * expects to be supplemented.
 */
const CONCEPTS = ['search', 'settings', 'heart', 'star', 'bell', 'shield', 'user', 'warning'] as const;
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
  return CONCEPTS.map((concept) => set[concept]).filter((e): e is Entry => e !== null);
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
 * Pick a set from the control and the whole icon vocabulary swaps at once.
 * Nothing about `Icon`, the `data-component` contract, or the surrounding
 * layout changes — only the import does. That's the property that makes icon
 * set a *theme decision* rather than a code decision.
 *
 * The code panel regenerates with the control, so it always shows the exact
 * import for the set currently on screen.
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
        transform: (_code: string, ctx: { args: { library: string; size: number } }) =>
          setSource(ctx.args.library, ctx.args.size),
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
 * Every set at once, stacked, so the differences are comparable rather than
 * remembered. Stroke weight, corner treatment, and optical size vary far more
 * than the shared `IconType` signature suggests — which is the whole argument
 * for tagging them by aesthetic instead of picking by familiarity.
 */
export const AllSetsCompared: StoryObj = {
  parameters: staticSource(
    `import { Icon } from '@msanagu/design-system';\n` +
      SET_IDS.map((id) => `import { ${entriesOf(id)[0]?.name ?? ''} } from 'react-icons/${id}';`).join(
        '\n',
      ) +
      `\n\n// One component, one contract, eight sets.\n` +
      SET_IDS.map((id) => `<Icon icon={${entriesOf(id)[0]?.name ?? ''}} size={26} />`).join('\n'),
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
        transform: (_code: string, ctx: { args: { weight: string; size: number } }) => {
          const found = PHOSPHOR_WEIGHTS.find((e) => e.name === ctx.args.weight) ?? DEFAULT_WEIGHT;
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
    const found = PHOSPHOR_WEIGHTS.find((e) => e.name === weight) ?? DEFAULT_WEIGHT;
    return <Icon icon={found.Component} size={size} />;
  },
};

/** All six Phosphor weights side by side, for judging the axis as a whole. */
export const AllStyles: StoryObj = {
  parameters: staticSource(
    sourceFor(
      'react-icons/pi',
      PHOSPHOR_WEIGHTS.map((e) => e.name),
      PHOSPHOR_WEIGHTS.map((e) => `<Icon icon={${e.name}} size={28} />`).join('\n'),
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

const OUTLINE_FILLED: { label: string; path: string; outline: Entry[]; filled: Entry[] }[] = [
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
    `import { Icon } from '@msanagu/design-system';\n` +
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

// ---- Choosing a set from the registry --------------------------------------

type RegistryStory = StoryObj<{
  personality: IconPersonality;
  aesthetic: IconAesthetic | 'any';
  weights: boolean;
}>;

/**
 * The intended selection path: query `iconLibraries.ts` by the same dimensions
 * the theme generator uses, then render whatever comes back. A wizard picking
 * an icon set for a generated theme runs exactly this query — the control
 * panel here stands in for the questionnaire.
 *
 * Sets that survive the filter are shown rendering the same concepts, so the
 * tags can be checked against what they actually look like. The tags are
 * authored judgments; this story is where they get argued with.
 */
export const SelectingFromTheRegistry: RegistryStory = {
  args: { personality: 'refined', aesthetic: 'any', weights: false },
  argTypes: {
    personality: { control: 'radio', options: ['friendly', 'confident', 'refined', 'calm'] },
    aesthetic: {
      control: 'select',
      options: ['any', 'geometric', 'humanist', 'rounded', 'sharp', 'technical'],
    },
    weights: { control: 'boolean', name: 'multi-weight only' },
  },
  parameters: {
    docs: {
      source: {
        language: 'tsx',
        transform: (
          _code: string,
          ctx: { args: { personality: string; aesthetic: string; weights: boolean } },
        ) => {
          const parts = [`personality: '${ctx.args.personality}'`];
          if (ctx.args.aesthetic !== 'any') parts.push(`aesthetic: '${ctx.args.aesthetic}'`);
          if (ctx.args.weights) parts.push('weights: true');
          return (
            `import { Icon, findIconLibraries } from '@msanagu/design-system';\n\n` +
            `// Same query the wizard runs once the questionnaire is answered.\n` +
            `const matches = findIconLibraries({ ${parts.join(', ')} });\n\n` +
            `// \`matches[0].id\` is a react-icons subpath — 'pi', 'lu', 'rx' …\n` +
            `// Resolve it to a set of imports in your own concept map, then:\n` +
            `<Icon icon={PiHeart} size={26} />`
          );
        },
      },
    },
  },
  render: ({ personality, aesthetic, weights }) => {
    const matches = findIconLibraries({
      personality,
      aesthetic: aesthetic === 'any' ? undefined : aesthetic,
      weights: weights ? true : undefined,
    }).filter((library) => library.id in SETS);

    return (
      <Stack gap="2xl">
        <Text typeScale="caption" prominence="subtle" as="p" style={{ margin: 0, maxWidth: '64ch' }}>
          {matches.length} of the sets rendered here match. Sets in the registry without a demo
          mapping above (Simple Icons, Octicons, VS Code) are excluded — they are real entries,
          just not comparable on this concept vocabulary.
        </Text>
        {matches.length === 0 && (
          <Text typeScale="bodyMd" as="p" style={{ margin: 0 }}>
            No set carries every one of those tags. Loosen the aesthetic, or accept a set that only
            matches on personality.
          </Text>
        )}
        {matches.map((library) => (
          <Stack key={library.id} gap="sm">
            <Row gap="sm" align="center">
              <Text typeScale="bodyMd" weight="semibold" as="span">
                {library.label}
              </Text>
              <Text typeScale="caption" prominence="subtle" as="span">
                {library.aesthetic.join(', ')} · {library.treatment}
                {library.weights ? ' · multi-weight' : ''}
              </Text>
            </Row>
            <ConceptRow libraryId={library.id} size={26} />
          </Stack>
        ))}
      </Stack>
    );
  },
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
