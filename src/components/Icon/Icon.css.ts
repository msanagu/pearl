import { style, globalStyle } from '@vanilla-extract/css';
import { color } from '@tokens';

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

// Zero specificity, so any real class (e.g. `negativeIcon`) always wins.
globalStyle(`:where(.${icon})`, {
  color: 'inherit',
});

// Duotone two-layer split: background path fixed to a faint neutral, always;
// foreground path uses `currentColor`, so a tone class (or inherited color)
// recolors only the full-opacity layer. Single-path icons are unaffected —
// `:first-child` and `:last-child` both match their one path, and
// `currentColor` (declared last) wins.
globalStyle(`.${icon} path:first-child`, {
  fill: color.icon,
});
globalStyle(`.${icon} path:last-child`, {
  fill: 'currentColor',
});

// Real classes, not a `color`/`tone` prop — see override-patterns.md.
export const positiveIcon = style({ color: color.positive.icon });
export const negativeIcon = style({ color: color.negative.icon });
export const warnIcon = style({ color: color.warn.icon });
export const infoIcon = style({ color: color.info.icon });

// `accent` isn't a sentiment, but answers the same need.
export const accentIcon = style({ color: color.accent });
