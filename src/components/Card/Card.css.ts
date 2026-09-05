import { createVar, fallbackVar, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { color, radius, space } from '@tokens';
import { concentricRadius } from '@/foundations/concentricRadius';

/**
 * Root's padding, published as a custom property so Card.Header / Card.Body
 * follow the root's `padding` variant without Context. Fallback covers a
 * subcomponent rendered outside a Card root.
 */
const cardPadding = createVar();

// Base styles stay single-selector (0,1,0) so downstream [data-part]
// overrides win on source order without @layer.
//
// Elevation shadow is a tight contact shadow (blur < 16px), not wide/diffuse
// — a hairline border under a wide soft shadow is a generated-UI tell.
export const card = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    background: color.surface,
    border: `1px solid ${color.border}`,
    boxShadow: `inset 0 1px 0 ${color.surface}, 0 6px 12px -10px ${color.shadow}`,
    overflow: 'hidden',
    // Root pads itself — no Card.Body wrapper needed for a plain card.
    padding: fallbackVar(cardPadding, space.lg),
    selectors: {
      // Unless the card composes parts, which own padding so Card.Header's
      // divider spans full width. Scoped to a direct card child so an
      // unrelated data-part user (Alert) can't strip a card's padding.
      '&:has(> [data-component="card"][data-part])': {
        padding: 0,
      },
    },
    // Radius varies per padding variant; corner shape is the theme's, fixed.
    cornerShape: radius.cornerShape,
  },

  variants: {
    /**
     * Interior padding, and — since radius derives from it — the card's shape.
     * No `sm` step: radius - padding is constant, so small padding leaves the
     * corner intruding across the content. Compact needs a different shape.
     */
    padding: {
      md: {
        vars: { [cardPadding]: space.md },
        borderRadius: concentricRadius(space.md),
      },
      lg: {
        vars: { [cardPadding]: space.lg },
        borderRadius: concentricRadius(space.lg),
      },
      xl: {
        vars: { [cardPadding]: space.xl },
        borderRadius: concentricRadius(space.xl),
      },
    },
  },

  defaultVariants: {
    padding: 'lg',
  },
});

// House hover idiom for a link-card. position/overflow live here, not on
// `card`, so a theme's ::after glow has an anchor without forcing a stacking
// context on every non-interactive card.
export const cardInteractive = style({
  position: 'relative',
  overflow: 'hidden',
  textDecoration: 'none',
  color: 'inherit',
  cursor: 'pointer',
  transition: 'transform 200ms ease, border-color 200ms ease',
  selectors: {
    '&:hover': {
      borderColor: color.borderStrong,
      transform: 'translateY(-2px)',
    },
    '&:focus-visible': {
      outline: `2px solid ${color.focusRing}`,
      outlineOffset: '2px',
    },
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': { transition: 'none' },
  },
});

export const cardHeader = style({
  padding: fallbackVar(cardPadding, space.lg),
  borderBottom: `1px solid ${color.border}`,
});

export const cardBody = style({
  padding: fallbackVar(cardPadding, space.lg),
});
