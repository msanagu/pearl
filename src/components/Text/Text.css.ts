import { recipe } from '@vanilla-extract/recipes';
import { color, fontFamily, text } from '../../tokens';

// One Text component, not split Heading/Text (typography.md): the type scale is
// a closed, stable set, so unifying under a `variant` token is safe DRY. Each
// variant carries its own default weight; the `weight` prop overrides it (via
// inline style in Text.tsx so the override always wins).
export const textRecipe = recipe({
  base: { margin: 0 },
  variants: {
    variant: {
      bodySm: { fontFamily: fontFamily.body, fontSize: text.bodySm.fontSize, lineHeight: text.bodySm.lineHeight, fontWeight: text.bodySm.fontWeight },
      bodyMd: { fontFamily: fontFamily.body, fontSize: text.bodyMd.fontSize, lineHeight: text.bodyMd.lineHeight, fontWeight: text.bodyMd.fontWeight },
      bodyLg: { fontFamily: fontFamily.body, fontSize: text.bodyLg.fontSize, lineHeight: text.bodyLg.lineHeight, fontWeight: text.bodyLg.fontWeight },
      headingSm: { fontFamily: fontFamily.heading, fontSize: text.headingSm.fontSize, lineHeight: text.headingSm.lineHeight, fontWeight: text.headingSm.fontWeight },
      headingMd: { fontFamily: fontFamily.heading, fontSize: text.headingMd.fontSize, lineHeight: text.headingMd.lineHeight, fontWeight: text.headingMd.fontWeight },
      headingLg: { fontFamily: fontFamily.heading, fontSize: text.headingLg.fontSize, lineHeight: text.headingLg.lineHeight, fontWeight: text.headingLg.fontWeight },
      displaySm: { fontFamily: fontFamily.display, fontSize: text.displaySm.fontSize, lineHeight: text.displaySm.lineHeight, fontWeight: text.displaySm.fontWeight },
      displayLg: { fontFamily: fontFamily.display, fontSize: text.displayLg.fontSize, lineHeight: text.displayLg.lineHeight, fontWeight: text.displayLg.fontWeight },
    },
    tone: {
      default: { color: color.text },
      subtle: { color: color.textSubtle },
    },
  },
  defaultVariants: {
    variant: 'bodyMd',
    tone: 'default',
  },
});
