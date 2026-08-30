/**
 * Sentiment token sub-field semantics, as real structured data — mirrors the
 * JSDoc on `SentimentTokens` in `src/tokens.ts`, condensed the same way
 * `overrideContract.ts` condenses `docs/foundations/override-patterns.md`.
 *
 * Why this exists at all: `color.<sentiment>.icon`/`.surface`/`.border`/`.text`
 * are four different CSS custom properties with four different intended
 * uses, but nothing in the
 * manifest said so before this file — a consumer had no way to know `icon`
 * is deliberately desaturated for glyph coloring specifically, not a
 * general-purpose "strong version of this color" to reach for on a button
 * background. Cross-cutting the same way the override contract is (every
 * theme, every sentiment), so it ships as its own top-level `tokenSemantics`
 * field rather than a Foundation or Component entity.
 */
export const tokenSemanticsDocumentBlocks = [
  {
    type: 'guidance',
    text: 'Every sentiment color (`color.positive`/`negative`/`warn`/`info`) has exactly four sub-fields, and each is named for *where* it applies, not for how strong/bold it looks: `surface` (tinted background fill), `border` (tinted border), `text` (accessible content color on that surface), `icon` (saturated icon/mark color).',
  },
  {
    type: 'guidance',
    text: '`icon` is deliberately desaturated/blended for small-glyph use — it is not a general "strong version of this sentiment" to reach for elsewhere. Using `color.negative.icon` as a button\'s background or border is a category error: it is the wrong sub-field for that job, not just a stylistic choice.',
  },
  {
    type: 'guidance',
    text: 'For a background fill, the semantically correct sub-field is `surface`; for a border, `border`. Note that both are intentionally *tinted* (pale, alert-style), the same intensity Alert itself renders at — Pearl does not currently expose a bold/solid sentiment fill suitable for a filled CTA-style button. If a solid destructive button is genuinely needed, that gap (no strong sentiment-fill token, not just no destructive Button variant) is real and worth flagging explicitly, the same way a missing variant is flagged under the override contract above.',
  },
] as const;
