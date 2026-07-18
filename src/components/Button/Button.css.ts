import { recipe } from '@vanilla-extract/recipes';
import { color, controlHeight, radius, space, fontFamily, fontWeight, text } from '../../tokens';

// Height maps to the shared `controlHeight` density lever (ADR-0005) so an
// enterprise theme can tighten every control at once and an agency theme can
// go airy — Button never hardcodes its own height scale.
export const button = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xs, // the named 4px icon-to-label half-step
    border: 'none',
    borderRadius: radius.control,
    fontFamily: fontFamily.body,
    fontWeight: fontWeight.medium,
    cursor: 'pointer',
    whiteSpace: 'nowrap',
    selectors: {
      '&:disabled': {
        cursor: 'not-allowed',
        opacity: 0.5,
      },
      '&:focus-visible': {
        outline: `2px solid ${color.focusRing}`,
        outlineOffset: '2px',
      },
    },
  },

  variants: {
    variant: {
      primary: {
        background: color.accent,
        color: color.onAccent,
        selectors: {
          '&:not(:disabled):hover': { background: color.accentHover },
        },
      },
      secondary: {
        background: color.surface,
        color: color.text,
        border: `1px solid ${color.border}`,
        selectors: {
          '&:not(:disabled):hover': { background: color.border },
        },
      },
    },
    size: {
      sm: {
        height: controlHeight.sm,
        paddingLeft: space.sm,
        paddingRight: space.sm,
        fontSize: text.bodySm.fontSize,
      },
      md: {
        height: controlHeight.md,
        paddingLeft: space.md,
        paddingRight: space.md,
        fontSize: text.bodyMd.fontSize,
      },
      lg: {
        height: controlHeight.lg,
        paddingLeft: space.lg,
        paddingRight: space.lg,
        fontSize: text.bodyLg.fontSize,
      },
    },
  },

  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});
