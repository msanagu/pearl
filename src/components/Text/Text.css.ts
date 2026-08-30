import { recipe } from '@vanilla-extract/recipes';
import { color, fontFamily, fontWeight, text } from '@tokens';

// One Text component, not split Heading/Text: the type scale is a closed set,
// so a single `typeScale` variant is safe. `typeScale` has no `defaultVariants`
// entry so a `role` with no size of its own inherits the surrounding text's
// size rather than snapping to `bodyMd`.

/**
 * Prose measure — the `max-width` that caps line length for readability.
 *
 * Values are `ch` (the advance of the `0` glyph, not a character). In Pearl's
 * body sans `1ch` ≈ 0.6em against a ~0.43em average lowercase advance, so a
 * `Nch` box holds roughly `1.4 × N` characters:
 *
 *   sm 35ch ≈ 49 chars — cards, sidebars, form hints
 *   md 45ch ≈ 63 chars — default prose
 *   lg 55ch ≈ 77 chars — wide layouts, docs body
 *
 * `ch` is font-relative on purpose. These labels assume the body sans; a mono
 * `role` would make `1ch` one real character, but Pearl's mono roles are labels
 * and figures, not prose.
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
        textWrap: 'pretty',
      },
      bodySm: {
        fontFamily: fontFamily.body,
        fontSize: text.bodySm.fontSize,
        lineHeight: text.bodySm.lineHeight,
        fontWeight: text.bodySm.fontWeight,
        letterSpacing: text.bodySm.letterSpacing,
        textWrap: 'pretty',
      },
      bodyMd: {
        fontFamily: fontFamily.body,
        fontSize: text.bodyMd.fontSize,
        lineHeight: text.bodyMd.lineHeight,
        fontWeight: text.bodyMd.fontWeight,
        letterSpacing: text.bodyMd.letterSpacing,
        textWrap: 'pretty',
      },
      bodyLg: {
        fontFamily: fontFamily.body,
        fontSize: text.bodyLg.fontSize,
        lineHeight: text.bodyLg.lineHeight,
        fontWeight: text.bodyLg.fontWeight,
        letterSpacing: text.bodyLg.letterSpacing,
        textWrap: 'pretty',
      },
      headingSm: {
        fontFamily: fontFamily.heading,
        fontSize: text.headingSm.fontSize,
        lineHeight: text.headingSm.lineHeight,
        fontWeight: text.headingSm.fontWeight,
        letterSpacing: text.headingSm.letterSpacing,
        textWrap: 'balance',
      },
      headingMd: {
        fontFamily: fontFamily.heading,
        fontSize: text.headingMd.fontSize,
        lineHeight: text.headingMd.lineHeight,
        fontWeight: text.headingMd.fontWeight,
        letterSpacing: text.headingMd.letterSpacing,
        textWrap: 'balance',
      },
      headingLg: {
        fontFamily: fontFamily.heading,
        fontSize: text.headingLg.fontSize,
        lineHeight: text.headingLg.lineHeight,
        fontWeight: text.headingLg.fontWeight,
        letterSpacing: text.headingLg.letterSpacing,
        textWrap: 'balance',
      },
      displaySm: {
        fontFamily: fontFamily.display,
        fontSize: text.displaySm.fontSize,
        lineHeight: text.displaySm.lineHeight,
        fontWeight: text.displaySm.fontWeight,
        letterSpacing: text.displaySm.letterSpacing,
        textWrap: 'balance',
      },
      displayLg: {
        fontFamily: fontFamily.display,
        fontSize: text.displayLg.fontSize,
        lineHeight: text.displayLg.lineHeight,
        fontWeight: text.displayLg.fontWeight,
        letterSpacing: text.displayLg.letterSpacing,
        textWrap: 'balance',
      },
      displayXl: {
        fontFamily: fontFamily.display,
        fontSize: text.displayXl.fontSize,
        lineHeight: text.displayXl.lineHeight,
        fontWeight: text.displayXl.fontWeight,
        letterSpacing: text.displayXl.letterSpacing,
        textWrap: 'balance',
      },
    },
    prominence: {
      default: { color: color.text },
      subtle: { color: color.textSubtle },
    },
    // Opt-in only — an unset `measure` fills the container.
    measure: {
      sm: { maxWidth: measure.sm },
      md: { maxWidth: measure.md },
      lg: { maxWidth: measure.lg },
    },
    // Declared after `typeScale` so its `fontWeight` wins on equal specificity.
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
