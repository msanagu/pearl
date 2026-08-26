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
    gap: space.sm,
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
      // Fills with `primary`, not `accent` — a theme's accent can be a quiet
      // signal color (focus borders, underlines) genuinely distinct from its
      // CTA fill; see the comment on `color.primary` in theme.css.ts.
      primary: {
        background: color.primary,
        color: color.onPrimary,
        // Same technique as Card's shadow: a solid token color diluted by
        // negative spread, not an alpha-faked tint — no shadow-tint token
        // exists in canon yet. `accentSubtle` gives the inset top-highlight
        // its intended cool-neutral cast (it's marine in Pearl).
        boxShadow: `inset 0 1px 0 ${color.accentSubtle}, 0 8px 16px -8px ${color.borderStrong}`,
        transition: 'transform 200ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 200ms ease',
        selectors: {
          '&:not(:disabled):hover': {
            transform: 'translateY(-1px)',
            boxShadow: `inset 0 1px 0 ${color.accentSubtle}, 0 12px 24px -8px ${color.borderStrong}`,
          },
          '&:not(:disabled):active': { transform: 'translateY(0)' },
        },
        '@media': {
          '(prefers-reduced-motion: reduce)': { transition: 'none' },
        },
      },
      secondary: {
        background: color.surface,
        color: color.text,
        border: `1px solid ${color.border}`,
        transition: 'border-color 200ms ease, box-shadow 200ms ease',
        selectors: {
          '&:not(:disabled):hover': {
            borderColor: color.accent,
            boxShadow: `0 0 0 3px ${color.accentSubtle}`,
          },
          '&:not(:disabled):active': {
            borderColor: color.accent,
            boxShadow: `inset 0 1px 2px ${color.borderStrong}`,
          },
        },
        '@media': {
          '(prefers-reduced-motion: reduce)': { transition: 'none' },
        },
      },
      // Text-only, no fill or border — the accent underline carries the
      // affordance, but only appears on hover so the resting state stays
      // truly quiet. Padding/height stay the same as primary/secondary
      // (not reduced to fit the text) so the click target doesn't shrink.
      // A transparent border (not `border: none`) keeps the box model
      // identical at rest and on hover, so nothing shifts when it animates in.
      tertiary: {
        background: 'transparent',
        color: color.text,
        borderBottom: '1px solid transparent',
        borderRadius: 0,
        transition: 'color 200ms ease, border-color 200ms ease',
        selectors: {
          '&:not(:disabled):hover': { color: color.accent, borderColor: color.accent },
          '&:not(:disabled):active': { color: color.text, borderColor: color.text },
        },
        '@media': {
          '(prefers-reduced-motion: reduce)': { transition: 'none' },
        },
      },
    },
    size: {
      sm: {
        height: controlHeight.sm,
        paddingLeft: space.md,
        paddingRight: space.md,
        fontSize: text.bodySm.fontSize,
      },
      md: {
        height: controlHeight.md,
        paddingLeft: space.lg,
        paddingRight: space.lg,
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
