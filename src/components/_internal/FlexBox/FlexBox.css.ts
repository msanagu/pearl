import { recipe } from '@vanilla-extract/recipes';
import { space } from '@tokens';

// Shared flex primitive behind Stack and Row — a safe unification: direction
// is one closed CSS toggle, not an open-ended concern (see
// docs/foundations/component-philosophy.md). `gap` is typed to the space scale,
// so passing a raw number is a compile error, not a lint warning.
export const flex = recipe({
  base: { display: 'flex', minWidth: 0 },
  variants: {
    direction: {
      row: { flexDirection: 'row' },
      column: { flexDirection: 'column' },
    },
    align: {
      start: { alignItems: 'flex-start' },
      center: { alignItems: 'center' },
      end: { alignItems: 'flex-end' },
      stretch: { alignItems: 'stretch' },
    },
    justify: {
      start: { justifyContent: 'flex-start' },
      center: { justifyContent: 'center' },
      end: { justifyContent: 'flex-end' },
      between: { justifyContent: 'space-between' },
    },
    wrap: {
      true: { flexWrap: 'wrap' },
    },
    gap: {
      xs: { gap: space.xs },
      sm: { gap: space.sm },
      md: { gap: space.md },
      lg: { gap: space.lg },
      xl: { gap: space.xl },
      '2xl': { gap: space['2xl'] },
    },
  },
  defaultVariants: {
    direction: 'row',
  },
});
