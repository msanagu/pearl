import { style } from '@vanilla-extract/css';
import { space } from '@tokens';

// Matches Introduction.css.ts's / Docs.css.ts's / Hero.css.ts's phone-width
// gutter reduction — `xl` (32px) a side reads fine as a page margin at desktop
// width, but on a narrow phone it eats a real slice of the viewport.
const SMALL = '(max-width: 640px)';

export const form = style({
  padding: `${space['2xl']} ${space.xl}`,
  '@media': {
    [SMALL]: {
      padding: `${space.xl} ${space.md}`,
    },
  },
});
