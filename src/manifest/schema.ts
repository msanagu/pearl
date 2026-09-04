/**
 * The manifest's own type layer. See docs/process/plans/manifest-reshape.md
 * for why this shape replaced the earlier `kind`-discriminated one.
 *
 * `metadata` holds short generator-derived facts, `documentBlocks` the
 * long-form content — do/dont/verification notes for the agent consuming
 * this manifest. There is no separate human-facing channel: the manifest's
 * only real consumer is an agent, not a human reader.
 */

/** A block of do/dont/verification guidance. No 'example' type here —
 * examples are sourced only from `.stories.tsx`, into the per-component
 * `<Name>.examples.json` file, never hand-authored alongside an entity. */
export interface DocumentBlock {
  type: 'do' | 'dont' | 'verification';
  text: string;
}

/** One example block, as shipped in a component's own `.examples.json` file
 * (`ComponentExamplesFile`, below) — kept as a distinct type from
 * `DocumentBlock` since an entity's own `documentBlocks` can never hold one. */
export interface ExampleBlock {
  type: 'example';
  text: string;
}

interface ManifestEntityBase {
  /** Stable, generator-derived identifier — never hand-assigned. */
  id: string;
  documentBlocks: DocumentBlock[];
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
 * A real component's API surface — Pearl's `Component` entity.
 * `metadata.props` comes from `react-docgen` reading the component's actual
 * TS source, never hand-typed. `documentBlocks` is always empty here: real
 * usage examples (literal story `render` source, pulled from the
 * component's own `.stories.tsx`) live in a separate per-component file
 * instead (`dist/components/<Name>/<Name>.examples.json`), pointed at by
 * `metadata.examplesPath` when one exists — kept out of the entity itself
 * so a consumer scoped to one component's props doesn't also pay for every
 * component's example bodies.
 */
export interface ComponentEntity extends ManifestEntityBase {
  metadata: {
    /** Component name, e.g. `'Card'`. */
    name: string;
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
 * concept.
 */
export interface FoundationEntity extends ManifestEntityBase {
  metadata: {
    /** Namespace tying this to its `ThemeFoundationEntity` counterparts, e.g. `'sizingGrid'`. */
    concept: string;
  };
}

/**
 * One theme's instantiation of a `FoundationEntity` concept — the actual
 * values (e.g. tahitian's `xs`:8px/`sm`:12px scale). `<theme>.json` only.
 */
export interface ThemeFoundationEntity extends ManifestEntityBase {
  metadata: {
    /** Same concept namespace as the base `FoundationEntity` this instantiates. */
    concept: string;
  };
}

/**
 * A role/treatment assignment — renamed from the old `kind: 'Foundation'`
 * entity, which conflated this with the foundation concept above. `metadata`
 * is a reshape of `RoleSpec` (`src/themes/roles.ts`), not a copy of resolved
 * values — the manifest points at the same names components/tokens use.
 * `<theme>.json` only.
 */
export interface TreatmentEntity extends ManifestEntityBase {
  metadata: {
    /** Role name, e.g. `'cardHover'`. */
    role: string;
    /** Which treatment (in the theme's own catalog) fulfills this role, e.g. `'wash'`. */
    name: string;
    intent?: string;
    surface?: string;
    trigger?: string;
    chroma?: string;
    limits?: Record<string, { max?: number; min?: number }>;
  };
}

/**
 * A DS-wide principle, not tied to any one component/foundation/theme — e.g.
 * the override contract's composition-over-configuration stance. `base.json`
 * only, one flat array (no per-theme split: a rationale is either true
 * everywhere or it isn't a rationale).
 */
export interface RationaleEntity extends ManifestEntityBase {
  metadata: {
    name: string;
  };
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
