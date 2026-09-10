import type { ManifestRef } from '@/manifest/schema';

/**
 * The authored shape of a `*.doc.ts` sidecar — one concept's documentation,
 * written once. `<StoryDoc>` renders it in Storybook; `scripts/read-story-doc.mjs`
 * compiles it to the DSDS `sections[]` the manifest ships (see
 * `toEntitySections` in generate-manifest.mjs).
 *
 * Near-passthrough of the manifest's own section shape, minus the boilerplate:
 * no `for: 'agent'` (always agent, re-added by the generator), `note` instead
 * of DSDS's `section`, no `ordered` on steps.
 */

/** RFC 2119 level, as the manifest carries it. */
export type GuidelineLevel = 'must' | 'must-not' | 'should' | 'should-not' | 'may';

/** A small, deemphasized label above a section's title — scopes the section
 *  to an audience (e.g. "theme authors") without making that scope part of
 *  the headline itself. Folded into the manifest's `title` as a prefix; kept
 *  visually separate on the page (see `<StoryDoc>`'s `sectionCaption`). */
type Captioned = { caption?: string };

export interface GuidelinesBlock extends Captioned {
  kind: 'guidelines';
  title?: string;
  /** Only when another entry cross-refs this section (`related.to: 'id#thisId'`). */
  id?: string;
  /**
   * `statement` is the rule — one imperative sentence, human-scannable.
   * `detail` carries the precision (token lists, file refs, the exact API).
   * The page shows the lead prominent and the detail quiet; the manifest
   * re-joins them into one `statement` string, so the agent gets everything.
   */
  items: { level: GuidelineLevel; statement: string; detail?: string }[];
}

export interface StepsBlock extends Captioned {
  kind: 'steps';
  title?: string;
  id?: string;
  items: { title: string; description?: string }[];
}

export interface DefinitionsBlock extends Captioned {
  kind: 'definitions';
  title?: string;
  id?: string;
  items: { term: string; definition: string; usage?: string }[];
}

/** DSDS's freeform `section` kind — narrative that isn't a rule or a term. */
export interface NoteBlock extends Captioned {
  kind: 'note';
  title?: string;
  id?: string;
  body: string;
}

export type DocSection =
  | GuidelinesBlock
  | StepsBlock
  | DefinitionsBlock
  | NoteBlock;

export interface StoryDoc {
  /** Canonical concept identifier, e.g. `inverseConvention`. Surfaced as the
   *  section-group title in the aggregated manifest entity; not the entity name
   *  (that stays the folder). */
  name: string;
  /** Human page title. Falls back to a humanized `name`. Storybook-only. */
  heading?: string;
  /**
   * One-line agent locator → the manifest entity's `description`. Required for
   * foundation / rationale / pattern docs (they have no other description
   * source). Omit for a component doc — its description comes from the
   * component's own JSDoc via react-docgen.
   */
  concept?: string;
  /**
   * Human overview paragraph → the `<StoryDoc>` lede. Not emitted to the
   * manifest. Foundation / rationale / pattern docs only; component docs carry
   * manifest content but don't render a `<StoryDoc>` page.
   */
  overview?: string;
  sections: DocSection[];
  /** Cross-refs, authored on the stable side — same as the old `parameters.manifest`. */
  related?: ManifestRef[];
  refs?: ManifestRef[];
}
