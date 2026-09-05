import { recipe } from '@vanilla-extract/recipes';
import {
  color,
  controlHeight,
  radius,
  space,
  fontFamily,
  fontWeight,
  text,
} from '@tokens';

// Height maps to the shared `controlHeight` density lever — Button never
// hardcodes its own height scale.
export const button = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
    height: controlHeight.md,
    // `height` sizes the button; this padding states the real inset flex
    // centering already produces, so it doesn't fall back to UA default `1px`.
    // Invariant: `controlHeight.md` must exceed bodyMd's line box + 2×space.sm + 2px border.
    paddingTop: space.sm,
    paddingBottom: space.sm,
    paddingLeft: space.md,
    paddingRight: space.md,
    fontSize: text.bodyMd.fontSize,
    // Without this, secondary's 1px border adds to content-box height while
    // primary (no border) doesn't — variants would render at different heights.
    boxSizing: 'border-box',
    // Safari can paint its own border/padding chrome outside the box model
    // even after `border: none` — appearance: none hands sizing back to us.
    appearance: 'none',
    border: 'none',
    borderRadius: radius.control,
    // Theme-owned, never a literal — keeps concentric with round-cornered cards.
    cornerShape: radius.cornerShape,
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
      // Fills with `primary`, not `accent` — a theme's accent can be a subtle
      // signal color distinct from its CTA fill; see `color.primary` in theme.css.ts.
      primary: {
        background: color.primary,
        color: color.onPrimary,
        // Matches secondary's 1px border width, just transparent — identical
        // border geometry so both render at the same height.
        border: '1px solid transparent',
        // Solid token color diluted by negative spread, not an alpha-faked
        // tint — same technique as Card's shadow.
        boxShadow: `inset 0 1px 0 ${color.accentSubtle}, 0 8px 16px -8px ${color.shadow}`,
        transition:
          'transform 200ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 200ms ease',
        selectors: {
          '&:not(:disabled):hover': {
            transform: 'translateY(-1px)',
            boxShadow: `inset 0 1px 0 ${color.accentSubtle}, 0 12px 24px -8px ${color.shadow}`,
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
            boxShadow: `inset 0 1px 2px ${color.shadow}`,
          },
        },
        '@media': {
          '(prefers-reduced-motion: reduce)': { transition: 'none' },
        },
      },
    },
  },

  defaultVariants: {
    variant: 'primary',
  },
});
