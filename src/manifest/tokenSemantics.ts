/**
 * Sentiment token sub-field semantics, as real structured data — mirrors the
 * JSDoc on `SentimentTokens` in `src/tokens.ts`, condensed the same way
 * `overrideContract.ts` condenses `docs/foundations/override-patterns.md`.
 *
 * Why this exists at all: `color.<sentiment>.icon`/`.surface`/`.border`/`.text`
 * are four different CSS custom properties with four different intended
 * uses, but nothing in the manifest said so before this file — a consumer
 * had no way to know `icon` is deliberately desaturated for glyph coloring
 * specifically, not a general-purpose "strong version of this color" to
 * reach for on a button background.
 *
 * Universal across every theme (no per-theme values half) — ships as a
 * `base.foundations` entity, concept `'tokenSemantics'`.
 */
export const tokenSemanticsDocumentBlocks = [
  {
    type: 'do',
    text: 'Pick a sentiment sub-field (`color.positive`/`negative`/`warn`/`info`) by *where* it applies, not how strong/bold it looks: `surface` (tinted background fill), `border` (tinted border), `text` (accessible content color on that surface), `icon` (saturated icon/mark color).',
  },
  {
    type: 'dont',
    text: 'Never reach for `icon` as a general "strong version of this sentiment" elsewhere — e.g. using `color.negative.icon` as a button\'s background or border is a category error: it is the wrong sub-field for that job, not just a stylistic choice.',
  },
  {
    type: 'verification',
    text: 'Before shipping a solid/bold sentiment fill (e.g. a filled destructive CTA button), verify no such token exists yet — Pearl currently only exposes tinted, Alert-intensity `surface`/`border` fills, not a bold/solid sentiment fill. Flag that gap explicitly, the same way a missing variant is flagged under the override contract, rather than substituting `icon` or inventing an ad hoc color.',
  },
] as const;
