import { style, globalStyle } from '@vanilla-extract/css';
import { color } from '@tokens';

/**
 * No path-level fill/stroke overrides. `react-icons` sets the right
 * attribute per set already — `fill="currentColor"` for filled sets,
 * `fill="none" stroke="currentColor"` for outline sets (Tabler, Lucide,
 * Radix...) — both of which read the inherited CSS `color`. A prior version
 * force-filled every `<path>`, which fought outline sets: CSS `fill` beats
 * the SVG's own `fill="none"`, so each stroke path painted solid and fused
 * with its neighbors into one blob instead of staying open linework.
 */
export const icon = style({});

// Zero specificity, so any real class (e.g. negativeIcon) always wins.
globalStyle(`:where(.${icon})`, {
  color: 'inherit',
});

// Real classes, not a `color`/`tone` prop — see override-patterns.md.
export const positiveIcon = style({ color: color.positive.icon });
export const negativeIcon = style({ color: color.negative.icon });
export const warnIcon = style({ color: color.warn.icon });
export const infoIcon = style({ color: color.info.icon });

// `accent` isn't a sentiment, but answers the same need.
export const accentIcon = style({ color: color.accent });
