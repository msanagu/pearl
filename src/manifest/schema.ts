/**
 * The manifest's own type layer. Borrows the `kind` discriminator and the
 * `metadata` / `documentBlocks` split from emerging design-system schema work
 * as a reference; this schema is independently defined. See DECISIONS.md.
 *
 * `metadata` holds short generator-derived facts, `documentBlocks` long-form
 * prose for a human, `agentDocumentBlocks` a parallel agent-only channel
 * (do/don't/verification notes) — kept separate so the two can't interleave.
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
 * Traceability worth keeping in source but not meaningful to a consumer of the
 * published manifest. Generators populate it; the publish step drops it rather
 * than emitting it into `metadata`.
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
 * A role/treatment assignment — this project's `Foundation` entity. `metadata`
 * is a reshape of `RoleSpec` (`src/themes/roles.ts`), not a copy of resolved
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
  kind: 'Component';
  metadata: {
    /** Component name, e.g. `'Card'`. */
    name: string;
    props: ComponentProp[];
    /** Package-relative path to this component's examples file, e.g. `'components/Card/Card.examples.json'` — absent if no examples were extracted. */
    examplesPath?: string;
  };
}

/** Union of every entity kind the manifest can contain. Widen deliberately. */
export type ManifestEntity = FoundationEntity | ComponentEntity;

/**
 * The base manifest's shape (`dist/manifest/base.json`) — theme-agnostic
 * Component entities only. Per-theme Foundation entities ship in their own
 * file instead (`ThemeManifest`, below); a single flat `Manifest` combining
 * both no longer exists as a build output — see generate-manifest.mjs.
 */
export interface BaseManifest {
  manifestVersion: string;
  /** Which source file(s) this was generated from — for provenance, not consumption. */
  generatedFrom: string;
  generatedAt: string;
  entities: ComponentEntity[];
  /**
   * The override contract (see docs/foundations/override-patterns.md) — how
   * to extend a component past its documented API (data-attribute targeting,
   * never inline styles) and the expectation that doing so gets flagged, in
   * a code comment and in prose, as real signal for what the system should
   * grow to cover. Cross-cutting (every component, every theme), so it's a
   * top-level field rather than a Foundation or Component entity.
   */
  overrideContract: { documentBlocks: DocumentBlock[] };
  /**
   * What each sentiment-token sub-field (`surface`/`border`/`text`/`icon`)
   * is actually for (see `SentimentTokens` JSDoc in `src/tokens.ts`) — without
   * this, nothing stops a consumer reaching for `icon` (deliberately
   * desaturated, meant for glyphs) as if it were a general-purpose strong
   * fill color. Cross-cutting for the same reason `overrideContract` is.
   */
  tokenSemantics: { documentBlocks: DocumentBlock[] };
}

/** One theme's manifest shape (`dist/manifest/<theme>.json`) — that theme's Foundation entities only. */
export interface ThemeManifest {
  manifestVersion: string;
  generatedFrom: string;
  generatedAt: string;
  theme: string;
  entities: FoundationEntity[];
}

/** One component's examples file shape (`dist/components/<Name>/<Name>.examples.json`). */
export interface ComponentExamplesFile {
  component: string;
  examples: DocumentBlock[];
}
