import { recipe } from '@vanilla-extract/recipes';
import { color, fontFamily, text } from '../../tokens';

// One Text component, not split Heading/Text (typography.md): the type scale is
// a closed, stable set, so unifying under a `variant` token is safe DRY.
//
// `variant` has NO defaultVariants entry deliberately: `Text.tsx` only passes
// a variant class when the caller went the `variant` route, or has neither
// `variant` nor `role` (plain `<Text>` still reads as bodyMd). A `role` with
// no size of its own (Pearl's `inlineEmphasis`) must inherit the surrounding
// text's size rather than be silently reset to bodyMd — that inheritance is
// the whole point of "role rides whatever variant it's set in."
export const textRecipe = recipe({
  base: { margin: 0 },
  variants: {
    variant: {
      caption: { fontFamily: fontFamily.body, fontSize: text.caption.fontSize, lineHeight: text.caption.lineHeight, fontWeight: text.caption.fontWeight, letterSpacing: text.caption.letterSpacing },
      bodySm: { fontFamily: fontFamily.body, fontSize: text.bodySm.fontSize, lineHeight: text.bodySm.lineHeight, fontWeight: text.bodySm.fontWeight, letterSpacing: text.bodySm.letterSpacing },
      bodyMd: { fontFamily: fontFamily.body, fontSize: text.bodyMd.fontSize, lineHeight: text.bodyMd.lineHeight, fontWeight: text.bodyMd.fontWeight, letterSpacing: text.bodyMd.letterSpacing },
      bodyLg: { fontFamily: fontFamily.body, fontSize: text.bodyLg.fontSize, lineHeight: text.bodyLg.lineHeight, fontWeight: text.bodyLg.fontWeight, letterSpacing: text.bodyLg.letterSpacing },
      headingSm: { fontFamily: fontFamily.heading, fontSize: text.headingSm.fontSize, lineHeight: text.headingSm.lineHeight, fontWeight: text.headingSm.fontWeight, letterSpacing: text.headingSm.letterSpacing },
      headingMd: { fontFamily: fontFamily.heading, fontSize: text.headingMd.fontSize, lineHeight: text.headingMd.lineHeight, fontWeight: text.headingMd.fontWeight, letterSpacing: text.headingMd.letterSpacing },
      headingLg: { fontFamily: fontFamily.heading, fontSize: text.headingLg.fontSize, lineHeight: text.headingLg.lineHeight, fontWeight: text.headingLg.fontWeight, letterSpacing: text.headingLg.letterSpacing },
      displaySm: { fontFamily: fontFamily.display, fontSize: text.displaySm.fontSize, lineHeight: text.displaySm.lineHeight, fontWeight: text.displaySm.fontWeight, letterSpacing: text.displaySm.letterSpacing },
      displayLg: { fontFamily: fontFamily.display, fontSize: text.displayLg.fontSize, lineHeight: text.displayLg.lineHeight, fontWeight: text.displayLg.fontWeight, letterSpacing: text.displayLg.letterSpacing },
    },
    prominence: {
      default: { color: color.text },
      subtle: { color: color.textSubtle },
    },
  },
  defaultVariants: {
    prominence: 'default',
  },
});
