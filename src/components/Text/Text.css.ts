import { recipe } from '@vanilla-extract/recipes';
import { color, fontFamily, fontWeight, text } from '@tokens';

// One Text component, not split Heading/Text (typography.md): the type scale is
// a closed, stable set, so unifying under a `typeScale` token is safe DRY.
//
// `typeScale` has NO defaultVariants entry deliberately: `Text.tsx` only passes
// a typeScale class when the caller went the `typeScale` route, or has neither
// `typeScale` nor `role` (plain `<Text>` still reads as bodyMd). A `role` with
// no size of its own (Pearl's `inlineEmphasis`) must inherit the surrounding
// text's size rather than be silently reset to bodyMd — that inheritance is
// the whole point of "role rides whatever scale it's set in."

/**
 * Prose measure — the `max-width` that caps line length for readability.
 *
 * Values are `ch`, which is the advance of the `0` glyph, NOT a character.
 * Measured against Pearl's stacks in Chromium, `1ch` is ~0.607em (sans),
 * ~0.614em (serif), ~0.602em (mono), while the average lowercase advance in
 * the sans is ~0.433em — so a `Nch` box holds roughly `1.4 × N` real
 * characters in body copy. The scale is calibrated from that ratio against
 * the classic 45–75 character band:
 *
 *   sm 35ch ≈ 49 chars — cards, sidebars, form hints, captions
 *   md 45ch ≈ 63 chars — default prose (Bringhurst's ~66 ideal)
 *   lg 55ch ≈ 77 chars — wide/dense layouts, docs body
 *
 * Every step also clears the Impeccable `line-length` gate by construction.
 * That rule scores `width / (fontSize × 0.5)` and fires above 85, i.e. a hard
 * ceiling of 42.5em ≈ 70ch; `lg` sits at 33.4em, so no value on this scale can
 * trip it.
 *
 * Caveat: `ch` is font-relative, which is the point — the cap tracks whatever
 * face is set. But these labels are calibrated for the body sans. A `role` that
 * swaps to mono makes `1ch` equal one real character, so `md` would read as 45
 * characters rather than 63. Pearl's mono roles are labels and figures, not
 * prose, so that does not bite today. If a theme ever needs its own numbers,
 * this map is the single place to lift into the theme contract.
 */
export const measure = {
  sm: '35ch',
  md: '45ch',
  lg: '55ch',
} as const;

export const textRecipe = recipe({
  base: { margin: 0 },
  variants: {
    typeScale: {
      caption: {
        fontFamily: fontFamily.body,
        fontSize: text.caption.fontSize,
        lineHeight: text.caption.lineHeight,
        fontWeight: text.caption.fontWeight,
        letterSpacing: text.caption.letterSpacing,
      },
      bodySm: {
        fontFamily: fontFamily.body,
        fontSize: text.bodySm.fontSize,
        lineHeight: text.bodySm.lineHeight,
        fontWeight: text.bodySm.fontWeight,
        letterSpacing: text.bodySm.letterSpacing,
      },
      bodyMd: {
        fontFamily: fontFamily.body,
        fontSize: text.bodyMd.fontSize,
        lineHeight: text.bodyMd.lineHeight,
        fontWeight: text.bodyMd.fontWeight,
        letterSpacing: text.bodyMd.letterSpacing,
      },
      bodyLg: {
        fontFamily: fontFamily.body,
        fontSize: text.bodyLg.fontSize,
        lineHeight: text.bodyLg.lineHeight,
        fontWeight: text.bodyLg.fontWeight,
        letterSpacing: text.bodyLg.letterSpacing,
      },
      headingSm: {
        fontFamily: fontFamily.heading,
        fontSize: text.headingSm.fontSize,
        lineHeight: text.headingSm.lineHeight,
        fontWeight: text.headingSm.fontWeight,
        letterSpacing: text.headingSm.letterSpacing,
      },
      headingMd: {
        fontFamily: fontFamily.heading,
        fontSize: text.headingMd.fontSize,
        lineHeight: text.headingMd.lineHeight,
        fontWeight: text.headingMd.fontWeight,
        letterSpacing: text.headingMd.letterSpacing,
      },
      headingLg: {
        fontFamily: fontFamily.heading,
        fontSize: text.headingLg.fontSize,
        lineHeight: text.headingLg.lineHeight,
        fontWeight: text.headingLg.fontWeight,
        letterSpacing: text.headingLg.letterSpacing,
      },
      displaySm: {
        fontFamily: fontFamily.display,
        fontSize: text.displaySm.fontSize,
        lineHeight: text.displaySm.lineHeight,
        fontWeight: text.displaySm.fontWeight,
        letterSpacing: text.displaySm.letterSpacing,
      },
      displayLg: {
        fontFamily: fontFamily.display,
        fontSize: text.displayLg.fontSize,
        lineHeight: text.displayLg.lineHeight,
        fontWeight: text.displayLg.fontWeight,
        letterSpacing: text.displayLg.letterSpacing,
      },
      displayXl: {
        fontFamily: fontFamily.display,
        fontSize: text.displayXl.fontSize,
        lineHeight: text.displayXl.lineHeight,
        fontWeight: text.displayXl.fontWeight,
        letterSpacing: text.displayXl.letterSpacing,
      },
    },
    prominence: {
      default: { color: color.text },
      subtle: { color: color.textSubtle },
    },
    // Opt-in only — no `defaultVariants` entry. An unset `measure` leaves the
    // element to fill its container, so capping is always a deliberate call at
    // the call site rather than something every `<p>` silently inherits.
    measure: {
      sm: { maxWidth: measure.sm },
      md: { maxWidth: measure.md },
      lg: { maxWidth: measure.lg },
    },
    // Declared after `typeScale` so its `fontWeight` wins on equal selector
    // specificity. No `defaultVariants` entry — only applies when a caller
    // passes `weight` explicitly, overriding the scale step's own default.
    weight: {
      regular: { fontWeight: fontWeight.regular },
      medium: { fontWeight: fontWeight.medium },
      semibold: { fontWeight: fontWeight.semibold },
      bold: { fontWeight: fontWeight.bold },
    },
  },
  defaultVariants: {
    prominence: 'default',
  },
});
