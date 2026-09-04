/**
 * The role layer — which named job/context each of a theme's treatments
 * fulfills. Treatments (`src/themes/*.css.ts`) are the recipes a theme owns;
 * roles (this file) are the jobs that exist, each pointing at which
 * treatment fulfills it. See DECISIONS.md (the manifest).
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
 * Saturation/colorfulness ceiling a role may read at — ranks on one ordered
 * scale, the same axis-pattern `Text`'s `prominence` prop uses for
 * value/contrast-against-background (`theme.css.ts`'s "two ranks ... no
 * third rung in v1" comment). Not a `tier` in the primitive→semantic token
 * sense (two separate collections, one indexing into the other) — chroma
 * and prominence each name one axis's own ranks, not a lookup between two
 * collections. `'moderate'` is reserved headroom, no role uses it yet:
 * every role today is either `'maximum'` (the treatment's own hues at full
 * intensity) or `'low'` (color derived from neutral primitives at a lower
 * ceiling, see `limitsByChroma`).
 */
export type Chroma = 'low' | 'moderate' | 'maximum';

/** A numeric ceiling/floor a treatment's own values must respect. */
export interface Limit {
  max?: number;
  min?: number;
}

/**
 * One role: the job/context a treatment is assigned to. A theme types
 * `treatment` against its own real treatment names, so a typo or a
 * treatment that doesn't exist fails to compile.
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
  /** How saturated this role may read — see `Chroma`. Omit where it doesn't apply. */
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
}

/** A theme's complete role table, keyed by role name. */
export type ThemeRoles<TTreatment extends string = string> = Record<string, RoleSpec<TTreatment>>;

/**
 * The closed set of typography role names — canon, not per-theme: every
 * theme fills these in with its own treatment (or honestly reuses its body
 * face), but the three names themselves are fixed. Kept here, not in a theme's
 * own roles file, because `Text`'s `role` prop enforces this same union
 * regardless of which theme is active.
 */
export type TypographyRole = 'inlineEmphasis' | 'preheading' | 'dataDigits';
