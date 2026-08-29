/**
 * Freshwater has no full role table yet (`pearl.roles.ts`/`tahitian.roles.ts`/
 * `south-sea.roles.ts` each also carry `inlineEmphasis`/`preheading`/
 * `dataDigits` treatments — Freshwater's equivalents are still ad hoc
 * `globalStyle` rules in `freshwater.css.ts`, not yet promoted to named,
 * documented treatments here). This file exists early, wordmark-only, so
 * every consumer of `*BrandWordmark` (Hero, Typography/Tokens stories, the
 * Introduction theme specimens) can show the theme's real nav mark instead
 * of falling back to Pearl's.
 */

/**
 * The nav wordmark — sourced from the theme's own 7a/7b exploration turns
 * ("Ice Console"), not fabricated. Plain, no `role`: the underscore's accent
 * color is a rendering choice specific to where this text is shown (see
 * `ThemeSpecimen.tsx`'s `accentUnderscore` flag), not part of the wordmark
 * data itself — `role` here only names one of `Text`'s three typography
 * roles (`inlineEmphasis`/`preheading`/`dataDigits`), and none of them is
 * "recolor one character."
 */
export const freshwaterBrandWordmark = {
  text: 'FRESHWTR_OPS',
  role: undefined,
};
