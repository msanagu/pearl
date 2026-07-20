import { style } from '@vanilla-extract/css';
import { color } from '../../tokens';

/**
 * Duotone icons (`@phosphor-icons/react`, `weight="duotone"`) render as two
 * stacked `<path>` elements: a faint background shape first (`opacity="0.2"`
 * in the SVG source), then the full-opacity foreground shape. Both inherit a
 * single `fill` from the `<svg>` by default — this class overrides each path
 * individually so the two layers can carry different token colors instead of
 * one color at two opacities.
 *
 * `path` presentation attributes lose to CSS rules regardless of source
 * order, so targeting `path:first-child` / `path:last-child` here is enough
 * to beat the inline `opacity="0.2"` and shared `fill` set by IconBase.
 */
export const icon = style({
  color: color.accent,
});