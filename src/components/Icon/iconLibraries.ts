/**
 * Reference notes on the `react-icons` sets this system has evaluated.
 *
 * `react-icons` normalizes ~30 icon sets to one `IconType` signature, so they
 * are interchangeable at the code level. What that signature does not tell you
 * is what each set costs you in character, coverage, or association — which is
 * what `notes` records.
 *
 * Deliberately metadata-only — it imports no icon components, so referencing
 * it costs nothing at runtime and cannot defeat tree-shaking. Consumers still
 * import icons directly from their set (`react-icons/pi`, `react-icons/lu`),
 * which is the only import shape `react-icons` can tree-shake.
 *
 * The notes are authored judgments, not measured facts. `react-icons` itself
 * is a choice, not a requirement — see README.md's "Icons aren't locked in
 * either".
 */

export type IconTreatment = 'outline' | 'filled' | 'both';

export interface IconLibrary {
  /** The `react-icons` subpath: `react-icons/${id}`. */
  id: string;
  label: string;
  /** Export prefix every icon in the set carries, e.g. `Pi` for Phosphor. */
  prefix: string;
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
    treatment: 'both',
    weights: true,
    size: 9000,
    notes:
      'Six weights (thin/light/regular/bold/fill/duotone) as separate exports, so icon weight can follow the theme. Icon styles render everything flat, single-tone — duotone weight renders but loses its second layer. The default pick, and the widest range here.',
  },
  {
    id: 'lu',
    label: 'Lucide',
    prefix: 'Lu',
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
    treatment: 'both',
    weights: false,
    size: 2000,
    notes: 'Broad and utilitarian. Carries visible Bootstrap-era associations.',
  },
  {
    id: 'vsc',
    label: 'VS Code (Codicons)',
    prefix: 'Vsc',
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
    treatment: 'outline',
    weights: false,
    size: 600,
    notes:
      "GitHub's set. Same developer-facing read as Codicons, slightly warmer.",
  },
  {
    id: 'si',
    label: 'Simple Icons',
    prefix: 'Si',
    treatment: 'filled',
    weights: false,
    size: 3200,
    notes:
      'Brand logos only, not a UI set — pair it with a real UI set rather than choosing between them.',
  },
] as const;

/** Every set above, keyed by its `react-icons` subpath. */
export const ICON_LIBRARIES_BY_ID: Readonly<Record<string, IconLibrary>> =
  Object.fromEntries(ICON_LIBRARIES.map((library) => [library.id, library]));
