import { recipe } from '@vanilla-extract/recipes';
import { color, controlHeight, radius, space, fontFamily, fontWeight, text } from '@tokens';

// Height maps to the shared `controlHeight` density lever (ADR-0005) so an
// enterprise theme can tighten every control at once and an agency theme can
// go airy — Button never hardcodes its own height scale.
export const button = recipe({
  base: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
    height: controlHeight.md,
    // `height` (with `box-sizing: border-box`) is what actually sizes the
    // button, so this padding never changes the rendered box — but declaring
    // it is not cosmetic. Left unset, the computed value is the UA's `1px`
    // (which `appearance: none` does not clear), and any audit or theme that
    // reads padding to reason about breathing room sees a cramped control.
    // This states the real inset the flex centering already produces.
    // Invariant: every theme's `controlHeight.md` must stay above
    // `bodyMd`'s line box + 2 × space.sm + 2px border.
    paddingTop: space.sm,
    paddingBottom: space.sm,
    paddingLeft: space.md,
    paddingRight: space.md,
    fontSize: text.bodyMd.fontSize,
    // Without this, `secondary`'s 1px border adds to its content-box height
    // on top of the shared `height` variant value while `primary` (no
    // border) doesn't — the two variants render at different heights and
    // misalign when placed side by side.
    boxSizing: 'border-box',
    // Native `<button>` UA styling (Safari especially) can paint its own
    // default border/padding chrome outside the CSS box model even after
    // `border: none` — `appearance: none` is needed to fully hand sizing
    // back to this recipe.
    appearance: 'none',
    border: 'none',
    borderRadius: radius.control,
    // Theme-owned, never a literal — a squircle button inside a round-cornered
    // card stops being concentric with it. See `radius.cornerShape`.
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
      // signal color (focus borders, underlines) genuinely distinct from its
      // CTA fill; see the comment on `color.primary` in theme.css.ts.
      primary: {
        background: color.primary,
        color: color.onPrimary,
        // Matches `secondary`'s `1px solid` border width, just transparent —
        // so both variants have identical border geometry and render at
        // identical heights regardless of `box-sizing`, rather than relying
        // on `border-box` alone to reconcile a bordered vs. borderless box.
        border: '1px solid transparent',
        // Same technique as Card's shadow: a solid token color diluted by
        // negative spread, not an alpha-faked tint. `accentSubtle` gives the
        // inset top-highlight its intended cool-neutral cast (it's marine in
        // Pearl); `color.shadow` is the dedicated elevation token, not a
        // border color repurposed for elevation.
        boxShadow: `inset 0 1px 0 ${color.accentSubtle}, 0 8px 16px -8px ${color.shadow}`,
        transition: 'transform 200ms cubic-bezier(0.22, 1, 0.36, 1), box-shadow 200ms ease',
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
