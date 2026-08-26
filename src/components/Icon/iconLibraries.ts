/**
 * Aesthetic tagging for the `react-icons` sets.
 *
 * `react-icons` normalizes ~30 icon sets to one `IconType` signature, which
 * makes them interchangeable at the code level but says nothing about whether
 * they *look* like they belong to a given theme. This registry is that missing
 * half: it describes each set along the same dimensions the theme generator
 * uses, so an icon set can be selected by aesthetic rather than by name.
 *
 * Deliberately metadata-only — it imports no icon components, so referencing
 * it costs nothing at runtime and cannot defeat tree-shaking. Consumers still
 * import icons directly from their set (`react-icons/pi`, `react-icons/lu`),
 * which is the only import shape `react-icons` can tree-shake.
 *
 * The tags are authored judgments, not measured facts. They are the icon-side
 * equivalent of the section tags, and want the same treatment: validated by
 * rendering across divergent themes, not trusted because they're written down.
 */

/**
 * Mirrors `PersonalityId` in the theme generator. Declared locally rather than
 * imported so a component doesn't depend on a page module; the two unions must
 * be kept in step by hand.
 */
export type IconPersonality = 'friendly' | 'confident' | 'refined' | 'calm';

export type IconAesthetic =
  /** Built from circles and straight lines; drafted, not drawn. */
  | 'geometric'
  /** Slightly irregular, hand-drawn warmth. */
  | 'humanist'
  /** Generous corner radii, soft terminals. */
  | 'rounded'
  /** Square corners, hard terminals, high angularity. */
  | 'sharp'
  /** Reads as tooling/developer-facing rather than consumer. */
  | 'technical';

export type IconTreatment = 'outline' | 'filled' | 'both';

export interface IconLibrary {
  /** The `react-icons` subpath: `react-icons/${id}`. */
  id: string;
  label: string;
  /** Export prefix every icon in the set carries, e.g. `Pi` for Phosphor. */
  prefix: string;
  aesthetic: IconAesthetic[];
  /** Personalities this set sits comfortably under. */
  personalities: IconPersonality[];
  treatment: IconTreatment;
  /**
   * Whether the set ships multiple weights as separately named exports
   * (Phosphor's `PiHeartBold`/`PiHeartThin`), which is what lets icon weight
   * track a theme's type weight instead of sitting at a fixed value.
   */
  weights: boolean;
  /** Approximate count, for judging whether a set can cover a whole product. */
  size: number;
  notes: string;
}

export const ICON_LIBRARIES: readonly IconLibrary[] = [
  {
    id: 'pi',
    label: 'Phosphor',
    prefix: 'Pi',
    aesthetic: ['geometric', 'rounded'],
    personalities: ['friendly', 'calm', 'confident'],
    treatment: 'both',
    weights: true,
    size: 9000,
    notes:
      'Six weights (thin/light/regular/bold/fill/duotone) as separate exports, so icon weight can follow the theme. Duotone is the only common set with a two-layer structure the Icon styles can recolor per layer. The default pick, and the widest range here.',
  },
  {
    id: 'lu',
    label: 'Lucide',
    prefix: 'Lu',
    aesthetic: ['geometric'],
    personalities: ['calm', 'refined', 'confident'],
    treatment: 'outline',
    weights: false,
    size: 1500,
    notes:
      'Even 2px stroke, tight geometry, no fill variants. Neutral to the point of being hard to make distinctive — safe under any theme, which is also the risk.',
  },
  {
    id: 'tb',
    label: 'Tabler',
    prefix: 'Tb',
    aesthetic: ['geometric', 'technical'],
    personalities: ['confident', 'calm'],
    treatment: 'outline',
    weights: false,
    size: 5800,
    notes:
      'Lucide-adjacent but far larger, with deep coverage of developer and data concepts. Best fit for the dataDense objective.',
  },
  {
    id: 'rx',
    label: 'Radix',
    prefix: 'Rx',
    aesthetic: ['geometric', 'sharp'],
    personalities: ['refined'],
    treatment: 'outline',
    weights: false,
    size: 300,
    notes:
      'Drawn on a 15px grid and intended to be used at exactly that size — it will look soft if scaled up. Small set; expect to supplement it.',
  },
  {
    id: 'ri',
    label: 'Remix',
    prefix: 'Ri',
    aesthetic: ['rounded', 'geometric'],
    personalities: ['friendly', 'calm'],
    treatment: 'both',
    weights: false,
    size: 2800,
    notes:
      'Matched outline and filled pairs (`RiHeartLine` / `RiHeartFill`), which makes selected-state toggling straightforward without switching sets.',
  },
  {
    id: 'fi',
    label: 'Feather',
    prefix: 'Fi',
    aesthetic: ['geometric', 'humanist'],
    personalities: ['calm', 'refined'],
    treatment: 'outline',
    weights: false,
    size: 290,
    notes:
      'The set Lucide forked from, and no longer actively developed. Light stroke reads well under low-chroma themes. Small; treat as an accent set.',
  },
  {
    id: 'hi2',
    label: 'Heroicons v2',
    prefix: 'Hi',
    aesthetic: ['rounded', 'geometric'],
    personalities: ['friendly', 'confident'],
    treatment: 'both',
    weights: false,
    size: 900,
    notes:
      'Strongly associated with Tailwind-built marketing sites — the most likely set here to read as generic. Use where familiarity is the goal, avoid where distinctiveness is.',
  },
  {
    id: 'bs',
    label: 'Bootstrap',
    prefix: 'Bs',
    aesthetic: ['rounded'],
    personalities: ['friendly'],
    treatment: 'both',
    weights: false,
    size: 2000,
    notes: 'Broad and utilitarian. Carries visible Bootstrap-era associations.',
  },
  {
    id: 'vsc',
    label: 'VS Code (Codicons)',
    prefix: 'Vsc',
    aesthetic: ['technical', 'sharp'],
    personalities: ['confident'],
    treatment: 'outline',
    weights: false,
    size: 400,
    notes:
      'Editor and source-control vocabulary specifically. Reads as an IDE, which is right for developer tooling and wrong for nearly everything else.',
  },
  {
    id: 'go',
    label: 'Octicons',
    prefix: 'Go',
    aesthetic: ['technical', 'geometric'],
    personalities: ['confident', 'calm'],
    treatment: 'outline',
    weights: false,
    size: 600,
    notes: "GitHub's set. Same developer-facing read as Codicons, slightly warmer.",
  },
  {
    id: 'si',
    label: 'Simple Icons',
    prefix: 'Si',
    aesthetic: ['geometric'],
    personalities: ['friendly', 'confident', 'refined', 'calm'],
    treatment: 'filled',
    weights: false,
    size: 3200,
    notes:
      'Brand logos only, not a UI set — pair it with a real UI set rather than choosing between them. Aesthetic-neutral because each mark carries its own brand, so it is tagged for every personality.',
  },
] as const;

/** Every set above, keyed by its `react-icons` subpath. */
export const ICON_LIBRARIES_BY_ID: Readonly<Record<string, IconLibrary>> = Object.fromEntries(
  ICON_LIBRARIES.map((library) => [library.id, library]),
);

export interface IconLibraryQuery {
  personality?: IconPersonality;
  aesthetic?: IconAesthetic;
  treatment?: IconTreatment;
  /** Only sets shipping multiple weights as separate exports. */
  weights?: boolean;
  /** Drop sets smaller than this, when coverage matters more than character. */
  minSize?: number;
}

/**
 * Filters the registry. Every field is optional and ANDed together; an empty
 * query returns everything. A set tagged `both` satisfies a query for either
 * `outline` or `filled`, since it ships both.
 */
export function findIconLibraries(query: IconLibraryQuery = {}): IconLibrary[] {
  const { personality, aesthetic, treatment, weights, minSize } = query;
  return ICON_LIBRARIES.filter((library) => {
    if (personality && !library.personalities.includes(personality)) return false;
    if (aesthetic && !library.aesthetic.includes(aesthetic)) return false;
    if (treatment && library.treatment !== treatment && library.treatment !== 'both') return false;
    if (weights !== undefined && library.weights !== weights) return false;
    if (minSize !== undefined && library.size < minSize) return false;
    return true;
  });
}
