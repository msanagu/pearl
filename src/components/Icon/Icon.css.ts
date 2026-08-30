import { style, globalStyle } from '@vanilla-extract/css';

/**
 * Duotone icons (Phosphor's duotone set, `PiHeartDuotone` and friends from
 * `react-icons/pi`) render as two stacked `<path>` elements: a faint
 * background shape first (`opacity="0.2"` in the SVG source), then the
 * full-opacity foreground shape. Both inherit a single `fill` from the `<svg>`
 * by default — this class overrides each path individually so the two layers
 * can carry different token colors instead of one color at two opacities.
 *
 * This applies to any set that uses the same two-layer convention, not just
 * Phosphor; single-layer sets are unaffected because they have no
 * `path:first-child`/`path:last-child` split to recolor.
 *
 * `path` presentation attributes lose to CSS rules regardless of source
 * order, so targeting `path:first-child` / `path:last-child` here is enough
 * to beat the inline `opacity="0.2"` and shared `fill` set by IconBase.
 */
export const icon = style({});

// `color: inherit` lives in a `:where()` globalStyle, not directly on `icon`
// itself, so it carries ZERO specificity. A plain single-class rule (e.g.
// Field's `errorIcon`, which sets `color: color.negative.icon`) has real
// specificity and so always wins regardless of which rule the bundler
// happens to emit later — without `:where()`, two equal-specificity single-
// class rules are decided by CSS source order, which is bundler output
// order, not consumption order; that silently let this base rule win over
// callers meaning to override it (see the fix that added this comment).
globalStyle(`:where(.${icon})`, {
  color: 'inherit',
});
