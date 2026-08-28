/**
 * The role layer — which named job/context each of a theme's treatments
 * fulfills.
 *
 * Two catalogs, not one nested structure:
 * - **Treatments** (`src/themes/*.css.ts`, plus a theme's own small
 *   type-treatment catalog) are the *recipes* a theme owns — named,
 *   self-contained, no inherent notion of where they're used. Luster (a
 *   gradient-animation mechanism) is one; so is a specific fontFamily +
 *   fontStyle combination like "Serif Italic" — naming the latter is what
 *   makes it statable as a peer to Luster, not a claim that anything reuses
 *   it yet.
 * - **Roles** (this file) are the *jobs* that exist — `inlineEmphasis`,
 *   `cardHover`, `brandSphere` — each pointing at which treatment fulfills
 *   it. `Text`'s `role` prop only ever accepts the typography role names;
 *   `luster` and friends are never role keys, only values roles point at —
 *   that's what keeps `Roles.ts`'s membership honest against the real prop.
 *
 * Consumers: the planned MCP/RAG corpus (`project-brief.md`), the planned
 * no-raw-value lint rule, and generated documentation.
 */

/**
 * Closed vocabulary of places a treatment may appear. `forbid` is only
 * enforceable because this set is fixed — widen it deliberately, not casually.
 */
export type Surface =
  /** The page plane behind everything. */
  | 'background'
  /** Panels, cards, sheets. */
  | 'surface'
  /** Photographic plates. */
  | 'imagery'
  /** Text of any size. */
  | 'type'
  /** Buttons, inputs, interactive controls. */
  | 'control'
  /** Rules, dividers, hairlines. */
  | 'border'
  /** Brand marks — the Pearl sphere, wordmark ornaments. */
  | 'brandObject';

/** What causes the role to be visible or in motion. */
export type Trigger =
  /** Always present, no motion. */
  | 'static'
  /** Always present, looping motion. */
  | 'ambient'
  /** Appears or animates on pointer hover. */
  | 'hover'
  /** Appears on keyboard focus. */
  | 'focus';

/**
 * Brand speaking vs. UI staying low-chroma — two tiers, not a spectrum.
 * `desaturated` names the actual visual property (see a role's guidance for
 * "already-desaturated stops"); not "chrome" (ADR-0007 already banned the
 * term) and not "quiet"/"subtle" — those describe prominence, a different
 * axis, and reusing either word here would blur the two.
 */
export type Chroma = 'brand' | 'desaturated';

/** A numeric ceiling/floor a treatment's own values must respect. */
export interface Limit {
  max?: number;
  min?: number;
}

/**
 * One role: the job/context a treatment is assigned to. `treatment` names
 * which entry in this theme's treatment catalog fulfills it — a theme types
 * this against its own real treatment names (see `pearl.roles.ts`), so a
 * typo or a treatment that doesn't exist fails to compile.
 *
 * Fields below are grouped by which kind of role uses them; nothing here
 * forces every role to fill every field, but a typography role has no
 * business setting `trigger`, and an effect role has no business setting
 * `tabularFigures`.
 */
export interface RoleSpec<TTreatment extends string = string> {
  /** Which treatment (in this theme's own catalog) fulfills this role. */
  treatment: TTreatment;
  /** One line: what this role is for. Feeds docs and generation. */
  intent?: string;

  // --- Typography-role fields ---
  /** Canon scale step this role rides on, e.g. `'caption'`. Omit to inherit `bodyMd`. */
  size?: string;
  fontWeight?: 'regular' | 'medium' | 'semibold' | 'bold';
  case?: 'upper' | 'sentence';
  tracking?: string;
  tabularFigures?: boolean;
  /** Where this role applies, in prose terms (e.g. `['inline', 'wordmark']`). */
  scope?: string[];

  // --- Effect-role fields ---
  on?: Surface;
  trigger?: Trigger;
  /**
   * How saturated this role may read — `brand` uses the treatment's own
   * hues at full intensity; `desaturated` derives color from existing
   * neutral primitives at a lower ceiling (`limitsByChroma`). Omit where it
   * doesn't apply.
   */
  chroma?: Chroma;
  /** Explicit prohibitions, checkable against the closed `Surface` set. */
  forbid?: Surface[];
  /** Numeric ceilings — machine-checkable against the treatment's values.
   * For a ceiling that should differ between `chroma` tiers, use
   * `limitsByChroma` instead — a key present there overrides this one. */
  limits?: Record<string, Limit>;
  /** Per-`Chroma` overrides of `limits` — a tier with no entry falls back
   * to `limits`. */
  limitsByChroma?: Partial<Record<Chroma, Record<string, Limit>>>;
  /**
   * Real constraints that are NOT machine-checkable — model guidance only.
   * Kept structurally separate from `limits` so the two can never be
   * confused for one another by a linter or a generator.
   */
  guidance?: string[];
  /** Which exploration turn canonized this (see docs/theme/theme-revision-decisions.md). */
  source?: string;
}

/** A theme's complete role table, keyed by role name. */
export type ThemeRoles<TTreatment extends string = string> = Record<string, RoleSpec<TTreatment>>;

/**
 * The closed set of typography role names — canon, not per-theme: every
 * theme fills these in with its own treatment (or reuses its body face,
 * an honest answer per ADR-0007 rule 1), but the three names themselves are
 * fixed. Kept here, not in a theme's own roles file, because `Text`'s `role`
 * prop enforces this same union regardless of which theme is active.
 */
export type TypographyRole = 'inlineEmphasis' | 'preheading' | 'dataDigits';
