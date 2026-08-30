/**
 * The manifest's own type layer — see ADR-0008. Adopts DSDS's `kind`
 * discriminator and `metadata`/`documentBlocks` split as a design reference;
 * this file is this project's own, independently-defined schema, never
 * validated against or imported from DSDS itself.
 *
 * `metadata` holds short, structured, generator-derived facts. `documentBlocks`
 * holds long-form prose meant for a human reader. `agentDocumentBlocks` is a
 * parallel, agent-only channel — do/don't/verification notes that were never
 * meant for a human reader in the first place, kept structurally separate so
 * the two can never be interleaved by accident.
 */

/** A block of human-facing long-form content. */
export interface DocumentBlock {
  type: 'rationale' | 'guidance' | 'example';
  text: string;
}

/** A block meant only for a coding agent consuming this manifest. */
export interface AgentDocumentBlock {
  type: 'do' | 'dont' | 'verification';
  text: string;
}

/**
 * Traceability data real enough to keep in source, but not meaningful to an
 * end consumer of the published manifest — e.g. `RoleSpec.source`, a pointer
 * into `docs/theme/theme-revision-decisions.md`. Generators populate this
 * from source; the publish step drops it (or a future internal-only build
 * target keeps it) rather than emitting it into `metadata`.
 */
export interface InternalProvenance {
  /** Which exploration turn or decision record produced this entity. */
  source?: string;
}

interface ManifestEntityBase {
  /** Stable, generator-derived identifier — never hand-assigned. */
  id: string;
  documentBlocks: DocumentBlock[];
  agentDocumentBlocks: AgentDocumentBlock[];
  internal?: InternalProvenance;
}

/**
 * A role/treatment assignment — this project's `Foundation` entity, per
 * ADR-0007's convergence with DSDS and ADR-0008 item 4. `metadata` is a
 * reshape of `RoleSpec` (`src/themes/roles.ts`), not a copy of resolved
 * values — the manifest points at the same names components/tokens use.
 */
export interface FoundationEntity extends ManifestEntityBase {
  kind: 'Foundation';
  metadata: {
    /** Role name, e.g. `'cardHover'`. */
    name: string;
    /** Which theme this role assignment belongs to, e.g. `'pearl'`. */
    theme: string;
    /** Which treatment (in the theme's own catalog) fulfills this role. */
    treatment: string;
    intent?: string;
    surface?: string;
    trigger?: string;
    chroma?: string;
    limits?: Record<string, { max?: number; min?: number }>;
  };
}

/** One prop of a component's real, extracted API — never hand-typed (see ADR-0008 follow-up: the manifest, not prompt text, is the source of truth for what a component's props are). */
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
 * A real component's API surface plus real usage examples — Pearl's `Component`
 * entity. `metadata.props` comes from `react-docgen` reading the component's
 * actual TS source, never hand-typed. `documentBlocks` (type `'example'`)
 * hold literal story `render` source pulled from the component's own
 * `.stories.tsx` — real, working compositions, not invented ones.
 */
export interface ComponentEntity extends ManifestEntityBase {
  kind: 'Component';
  metadata: {
    /** Component name, e.g. `'Card'`. */
    name: string;
    props: ComponentProp[];
  };
}

/** Union of every entity kind the manifest can contain. Widen deliberately. */
export type ManifestEntity = FoundationEntity | ComponentEntity;

export interface Manifest {
  manifestVersion: string;
  /** Which source file(s) this was generated from — for provenance, not consumption. */
  generatedFrom: string;
  generatedAt: string;
  entities: ManifestEntity[];
}
