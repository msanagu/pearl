import { createVar, fallbackVar, style } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { color, radius, space } from '../../tokens';
import { concentricRadius } from '../../foundations/concentricRadius';

/**
 * The root's padding, published as a custom property so `Card.Header` and
 * `Card.Body` follow the root's `padding` variant without Context — they are
 * static-property namespacing, not a compound component (ADR-0002).
 *
 * The fallback covers a subcomponent rendered outside a `Card` root, where the
 * variant never sets the var.
 */
const cardPadding = createVar();

// Base styles stay SINGLE-selector so downstream `[data-part]` overrides win on
// specificity without needing @layer (override-patterns.md / ADR-0003). The
// recipe puts two classes on the root (base + variant), but each is still its
// own `.hash {}` rule at 0,1,0 — the same specificity a consumer's
// `[data-component="card"]` carries — so source order decides, and consumer CSS
// still wins exactly as before.
//
// A restrained inset highlight and tight silver-toned shadow distinguish the
// material plane without generic elevation. The elevation shadow is a genuine
// CONTACT shadow (blur < 16px) rather than a wide diffuse one: a hairline
// border paired with a wide, soft shadow is a generated-UI tell, and it also
// contradicted this file's own "tight" intent.
export const card = recipe({
  base: {
    display: 'flex',
    flexDirection: 'column',
    background: color.surface,
    border: `1px solid ${color.border}`,
    boxShadow: `inset 0 1px 0 ${color.surface}, 0 6px 12px -10px ${color.shadow}`,
    overflow: 'hidden',
    // The root pads itself, so the simple case is just `<Card>content</Card>` —
    // no `Card.Body` wrapper for a card that has nothing to divide.
    padding: fallbackVar(cardPadding, space.lg),
    selectors: {
      // ...unless the card actually composes parts, in which case THEY own the
      // padding — `Card.Header` needs its own padded region for the divider to
      // span the full width, which a padded root would inset.
      //
      // Scoped to a DIRECT child carrying BOTH card attributes, so an unrelated
      // component that happens to use `data-part` (Alert does) can never
      // accidentally strip a card's padding.
      '&:has(> [data-component="card"][data-part])': {
        padding: 0,
      },
    },
    // The radius varies per `padding` variant; the corner SHAPE does not — it
    // is the theme's corner language and must match every control nested here,
    // or the arcs stop being parallel.
    cornerShape: radius.cornerShape,
  },

  variants: {
    /**
     * Interior padding — and, because the radius derives from it, the card's
     * shape. The two move together by construction.
     *
     * **No `sm` step.** The derivation makes `radius - padding` a constant
     * (`radius.control`, 12px on Pearl), so the corner always intrudes that far
     * past the content edge. Larger paddings absorb it; `space.sm` does not —
     * an 8px padding under a 20px corner is a corner 2.5x the size of the gap
     * it sits in, and the card reads corner-first, with the arc consuming most
     * of a header's height. The rule holds arithmetically at `sm` and still
     * looks wrong, which is the useful kind of limit to write down rather than
     * rediscover. A genuinely compact card needs a different shape, not a
     * smaller step on this one.
     *
     * The trend runs the other way too: the larger the padding, the more
     * comfortably it carries its own corner (padding as a fraction of radius
     * goes 0.57 at `md`, 0.67 at `lg`, 0.73 at `xl`). `xl` is the roomy end of
     * the spectrum, not an outlier.
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

// House hover idiom for a link-card (rule 4 of ADR-0007: idioms cascade —
// every interactive surface gets feedback even where no theme adds more).
// `position: relative` + `overflow: hidden` here (not on `card`) is what
// gives a theme's `::after` glow somewhere to anchor, without paying for a
// stacking context on the far more common non-interactive card.
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
