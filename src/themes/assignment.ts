/**
 * The assignment layer — what a theme's capabilities MEAN.
 *
 * Capabilities (`src/themes/*.css.ts`) hold values and become CSS custom
 * properties. Assignments hold intent and never become CSS. The split is the
 * point: the assignment is the *spec*, the capability is the *instance*, so a
 * lint rule can check one against the other (e.g. `limits.alpha.max` against
 * the capability's actual stop values).
 *
 * See `docs/decisions/0007-capabilities-and-assignments.md` — rule 5: an
 * extension capability without an assignment is invalid. That rule is enforced
 * structurally by `ThemeAssignments` below, not by convention.
 *
 * Consumers: the planned MCP/RAG corpus (`PROJECT_BRIEF.md`), the planned
 * no-raw-value lint rule, and generated documentation.
 */

/**
 * Closed vocabulary of places a capability may appear. `forbid` is only
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

/** What causes the capability to be visible or in motion. */
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
 * Where and when are coupled — one capability may behave differently per
 * surface. Pearl's `luster` is ambient on the sphere and the hairline rule, but
 * hover-triggered on cards, which a single `trigger` field could not express.
 */
export interface Application {
  on: Surface;
  trigger: Trigger;
}

/** A numeric ceiling/floor the capability's own values must respect. */
export interface Limit {
  max?: number;
  min?: number;
}

export interface CapabilityAssignment {
  /** One line: what this capability is for. Feeds docs and generation. */
  intent: string;
  /** Every place it may appear, each with its own trigger. */
  applications: Application[];
  /** Explicit prohibitions, checkable against the closed `Surface` set. */
  forbid?: Surface[];
  /** Numeric ceilings — machine-checkable against the capability's values. */
  limits?: Record<string, Limit>;
  /**
   * Real constraints that are NOT machine-checkable — model guidance only.
   * Kept structurally separate from `limits` so the two can never be confused
   * for one another by a linter or a generator.
   */
  guidance?: string[];
  /** Which exploration turn canonized this (see docs/theme-revision-decisions.md). */
  source?: string;
}

/**
 * How this theme assigns primitives to jobs. Nested by domain — `typography`
 * today, room for e.g. `iconography` later — so `roles` doesn't become a flat
 * bag of unrelated job assignments.
 */
export interface RoleAssignments {
  typography?: TypographyRoles;
}

/**
 * One role's complete typographic treatment — size *and* face, not a face
 * layered on top of whatever `variant` the caller happened to pick. `size`
 * points into the same canon scale `variant` uses (`TextVariant`, i.e.
 * `keyof TextTokens`), so a role never invents its own raw numbers; it just
 * claims a scale step as its own. Typed as `string` here rather than
 * importing `TextVariant` to keep this infra file independent of the
 * component layer — `Text`'s `role` prop is what enforces the real union.
 */
interface RoleTreatment {
  fontFamily: string;
  /** Canon scale step this role rides on, e.g. `'caption'`. Omit to inherit `bodyMd`. */
  size?: string;
  fontWeight?: 'regular' | 'medium' | 'semibold' | 'bold';
  fontStyle?: 'normal' | 'italic';
}

export interface TypographyRoles {
  /**
   * The face carrying rare emphasis — pull quotes, inline interjections.
   * Named `inlineEmphasis` (not `emphasis`) to keep it distinct from
   * `prominence` on `Text`, which is about text-vs-subtle color weight, not
   * a face/style change — the two are easy to conflate by name alone.
   */
  inlineEmphasis?: RoleTreatment & { scope?: string[] };
  /**
   * The face carrying the short line above a heading (e.g. "A design system
   * for identities that refuse sameness" above the Pearl hero's h1) — kept
   * distinct from `label` because it always pairs with a heading rather than
   * standing alone next to data/IDs, even where the two visually coincide.
   * See `docs/markup-philosophy.md` for the `header`/heading/preheading/
   * subheading vocabulary this belongs to.
   */
  preheading?: RoleTreatment & { case?: 'upper' | 'sentence'; tracking?: string };
  /** The face carrying labels, IDs, metadata. */
  label?: RoleTreatment & { case?: 'upper' | 'sentence'; tracking?: string };
  /**
   * The face carrying tabular data — table cells, counters, form values.
   * Density (how tight the rows/fields sit) comes from the theme's `density`
   * axis, same as everywhere else; this only covers the face and figure style.
   */
  numeric?: RoleTreatment & { tabularFigures?: boolean };
}

/**
 * A theme's complete assignment record.
 *
 * `C` is the theme's capability object. The mapped type over `keyof C` is what
 * enforces rule 5 in both directions: a declared capability with no assignment
 * fails to compile, and an assignment for an undeclared capability fails too.
 */
export type ThemeAssignments<C extends object = Record<never, never>> = {
  /** The theme's disposition, in one line. Not copywriting — how it feels. */
  mood: string;
  /** Closed-enum axes, comparable across themes. */
  axes?: Partial<Record<UsageAxis, string>>;
  roles?: RoleAssignments;
} & { [K in keyof C]: CapabilityAssignment };

export type UsageAxis =
  /** Spacing and line-height posture. Editorial themes run loose, data-dense themes run tight. */
  | 'density'
  /** How far the display step is allowed to jump from body (dramatic hero sizing vs. restrained). */
  | 'displayScale'
  /** How much of the type system is allowed to carry emphasis/color at once (quiet-work-no-fills vs. richer). */
  | 'accentBudget'
  /** What hover does — lift, tracking-stretch, edge-rule, border-signal. */
  | 'hoverBehavior'
  /** How photo-first a theme is, and what treatment imagery gets (soft-neutral, high-contrast, etc.). */
  | 'imagery'
  /** How micro-labels are styled — mono-caps, slash-caps, quiet-mono. */
  | 'labelTreatment'
  /** How content sits on its axis — centered, baseline-drift, grid-locked. */
  | 'alignment';
