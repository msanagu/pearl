/**
 * The manifest's own type layer — shaped to match DSDS (Design System Doc
 * Spec) v0.20.0's entry/section schema: designsystemdocspec.org/v0.20.0/dsds.bundled.yaml.
 * See docs/process/plans/manifest-reshape.md (decision 7 / Phase C) for why
 * and what's adopted vs. kept Pearl's own (the compile-time completeness
 * check; JSON output instead of DSDS's native YAML).
 *
 * `metadata` holds short generator-derived facts specific to one entity kind.
 * `sections` holds the long-form content — DSDS's `guidelines`/`steps` kinds,
 * every one `for: 'agent'` fixed: the manifest's only real consumer is an
 * agent, not a human reader, so there's no per-section audience split to
 * make. (A human-facing surface exists too — generated separately, from the
 * same upstream stories, into `docs/foundations/*.md`.)
 */

/** RFC 2119 requirement level DSDS's `guidelines` section kind carries. Only
 * `must`/`must-not` are populated today — `should`/`should-not`/`may` are
 * real DSDS values, just unused so far. */
export type GuidelineLevel = 'must' | 'should' | 'should-not' | 'must-not' | 'may';

/** `id`, on every section kind: an optional slug making one facet of an entry
 * addressable as a cross-ref target — `to: 'pattern.forms#validation'` points
 * at the section with `id: 'validation'`. Only needed on sections other
 * entries actually link to. `title` stays the human label. */
export interface GuidelinesSection {
  kind: 'guidelines';
  for: 'agent';
  id?: string;
  title?: string;
  items: { level: GuidelineLevel; statement: string }[];
}

/** DSDS's ordered-procedure/checklist section kind. `ordered: false` here —
 * Pearl's verification content today is independent checks, not a sequence. */
export interface StepsSection {
  kind: 'steps';
  for: 'agent';
  id?: string;
  title?: string;
  ordered: boolean;
  items: { title: string; description?: string }[];
}

/** DSDS's term/definition section kind — a closed glossary or table (e.g. a token scale). */
export interface DefinitionsSection {
  kind: 'definitions';
  for: 'agent';
  id?: string;
  title?: string;
  items: { term: string; definition: string; usage?: string }[];
}

/** DSDS's generic freeform-prose section kind — narrative reasoning that
 * doesn't reduce to a single must/must-not statement or a term/definition
 * pair (the "why," not just the "what"). */
export interface FreeformSection {
  kind: 'section';
  for: 'agent';
  id?: string;
  title?: string;
  body: string;
}

export type ManifestSection =
  | GuidelinesSection
  | StepsSection
  | DefinitionsSection
  | FreeformSection;

/** DSDS's cross-reference object (`related`/`extends`/`refs` all share this
 * shape) — exactly one of `to` (internal entry id, optionally `id#sectionId`)
 * or `href` (external URI). `rel` is a DSDS rel value: `relates-to`,
 * `depends-on`, `part-of`, `composes`, `pairs-with`, `extends`, `same-as`,
 * `alternative-to`, `replaces`, `see-also`, … or a namespaced custom one.
 * `to` never points at a group — a category is only a ref target if it's its
 * own entry (e.g. a PatternEntity). generate-manifest.mjs fails the build on
 * any `to` that doesn't resolve to a real entry or section id. */
export interface ManifestRef {
  rel: string;
  to?: string;
  href?: string;
}

/** One example block, as shipped in a component's own `.examples.json` file
 * (`ComponentExamplesFile`, below) — outside DSDS's shape entirely, since
 * examples are sourced from stories, never hand-authored alongside an entity. */
export interface ExampleBlock {
  type: 'example';
  text: string;
}

interface ManifestEntityBase {
  /** Stable, generator-derived identifier — never hand-assigned. */
  id: string;
  /** Routes an external DSDS-aware consumer to this entity's specific shape. */
  kind: string;
  name: string;
  /** Required by DSDS's entry object — one line, no equivalent field existed pre-Phase-C. */
  description: string;
  sections: ManifestSection[];
  /** Links a per-theme instantiation back to its theme-agnostic counterpart — replaces the old implicit `metadata.concept` string-match convention. */
  extends?: ManifestRef[];
  /** Sibling entries related in purpose/usage — e.g. `foundation.radius` relates-to `foundation.space`. Authored on the specific, stable side (a component/pattern pointing at a foundation), never as a hand-maintained list of everything that touches an entry; the reverse direction is derived by a consumer. */
  related?: ManifestRef[];
  refs?: ManifestRef[];
}

/** One prop of a component's real, extracted API — never hand-typed. The
 * manifest, not prompt text, is the source of truth for a component's props. */
export interface ComponentProp {
  name: string;
  /** As written in the TS source (e.g. `'primary' | 'secondary'`), not resolved further. */
  type: string;
  required: boolean;
  defaultValue?: string;
  /** The prop's own JSDoc comment, verbatim. */
  description?: string;
}

/**
 * A real component's API surface — Pearl's `Component` entity, DSDS kind
 * `'component'`. `metadata.props` comes from `react-docgen` reading the
 * component's actual TS source, never hand-typed. `sections` is always empty
 * here: real usage examples (literal story `render` source, pulled from the
 * component's own `.stories.tsx`) live in a separate per-component file
 * instead (`dist/components/<Name>/<Name>.examples.json`), pointed at by
 * `metadata.examplesPath` when one exists — kept out of the entity itself
 * so a consumer scoped to one component's props doesn't also pay for every
 * component's example bodies.
 */
export interface ComponentEntity extends ManifestEntityBase {
  kind: 'component';
  metadata: {
    props: ComponentProp[];
    /** Package-relative path to this component's examples file, e.g. `'components/Card/Card.examples.json'` — absent if no examples were extracted. */
    examplesPath?: string;
  };
}

/**
 * The constraint/mechanic itself, common ground across every theme — e.g.
 * the 8px soft grid's rules (which sizes get snapped, why `xs` is a named
 * half-step), not any one theme's actual increment values. `base.json` only;
 * see `ThemeFoundationEntity` for the per-theme values half of the same
 * concept. DSDS kind `'entry'` — the spec's own generic kind, whose docs
 * name "a foundation, a pattern, a guide" as exactly this use.
 */
export interface FoundationEntity extends ManifestEntityBase {
  kind: 'entry';
  metadata: {
    /** Namespace tying this to its `ThemeFoundationEntity` counterparts, e.g. `'sizingGrid'`. */
    concept: string;
  };
}

/**
 * A multi-part usage pattern spanning several components/foundations — e.g.
 * a "forms" pattern whose facets are layout, form controls, validation. One
 * entry, facets as `sections` (give a facet a section `id` when another
 * entry links to it — `related.to: 'pattern.forms#validation'`). `base.json`
 * only. DSDS kind `'entry'` — the spec has no dedicated pattern kind; its
 * generic `'entry'` names "a foundation, a pattern, a guide" as this use.
 * `metadata.pattern` namespaces it, mirroring `FoundationEntity.concept`.
 */
export interface PatternEntity extends ManifestEntityBase {
  kind: 'entry';
  metadata: {
    pattern: string;
  };
}

/**
 * One theme's instantiation of a `FoundationEntity` concept — the actual
 * values (e.g. tahitian's `xs`:8px/`sm`:12px scale). `<theme>.json` only.
 * DSDS kind `'entry'` too, not `'theme'` — DSDS's `'theme'` kind is
 * token-override shaped ("dark mode, high-contrast, a brand variant"), the
 * wrong fit for per-theme constants. Linked to its base counterpart via
 * `extends`, not a `'theme'`-kind relationship.
 */
export interface ThemeFoundationEntity extends ManifestEntityBase {
  kind: 'entry';
  metadata: {
    /** Same concept namespace as the base `FoundationEntity` this instantiates. */
    concept: string;
  };
  extends: ManifestRef[];
}

/**
 * A role/treatment assignment — renamed from the old `kind: 'Foundation'`
 * entity, which conflated this with the foundation concept above. `metadata`
 * is a reshape of `RoleSpec` (`src/themes/roles.ts`), not a copy of resolved
 * values — the manifest points at the same names components/tokens use.
 * `<theme>.json` only. DSDS has no native kind for a role→treatment
 * assignment (`'theme'` describes the theme itself, not one assignment
 * within it), so this uses DSDS's custom-kind extension point instead of
 * forcing a bad fit.
 */
export interface TreatmentEntity extends ManifestEntityBase {
  kind: 'pearl.treatment';
  metadata: {
    /** Role name, e.g. `'cardHover'`. */
    role: string;
    /** Which treatment (in the theme's own catalog) fulfills this role, e.g. `'wash'`. */
    treatment: string;
    intent?: string;
    surface?: string;
    trigger?: string;
    chroma?: string;
    limits?: Record<string, { max?: number; min?: number }>;
  };
}

/**
 * A DS-wide principle, not tied to any one component/foundation/theme — e.g.
 * the override contract's data-attribute-targeting stance (ADR-0003 —
 * distinct from ADR-0002's composition-over-configuration, which governs a
 * component's own props/children, not how a consumer overrides its output).
 * `base.json` only, one flat array (no per-theme split: a rationale is
 * either true everywhere or it isn't a rationale). DSDS kind `'entry'`.
 */
export interface RationaleEntity extends ManifestEntityBase {
  kind: 'entry';
}

/**
 * The base manifest's shape (`dist/manifest/base.json`) — theme-agnostic
 * content only. Per-theme content ships in its own file instead
 * (`ThemeManifest`, below); a single flat `Manifest` combining both no
 * longer exists as a build output — see generate-manifest.mjs.
 */
export interface BaseManifest {
  manifestVersion: string;
  /** Which source file(s) this was generated from — for provenance, not consumption. */
  generatedFrom: string;
  generatedAt: string;
  rationale: RationaleEntity[];
  components: ComponentEntity[];
  foundations: FoundationEntity[];
  /** Multi-part usage patterns — one per `src/patterns/<name>/` folder; empty until any exist. */
  patterns: PatternEntity[];
}

/** One theme's manifest shape (`dist/manifest/<theme>.json`). */
export interface ThemeManifest {
  manifestVersion: string;
  generatedFrom: string;
  generatedAt: string;
  theme: string;
  foundations: ThemeFoundationEntity[];
  treatments: TreatmentEntity[];
}

/** One component's examples file shape (`dist/components/<Name>/<Name>.examples.json`). */
export interface ComponentExamplesFile {
  component: string;
  examples: ExampleBlock[];
}
