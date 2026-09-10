import { globalStyle, assignVars } from '@vanilla-extract/css';
import type { MapLeafNodes } from '@vanilla-extract/private';
import { color } from '@tokens';
import { vars } from '@/theme.css';

/** The full `color` contract with string leaves — one mode's concrete values. */
export type InverseColors = MapLeafNodes<typeof vars.color, string>;

/**
 * The global app theme and `inverse` are different, orthogonal axes — don't
 * conflate them. The global app theme is which `*LightThemeClass`/
 * `*DarkThemeClass` is applied to the whole tree; `inverse` is a local
 * application of the opposite mode on one subtree, independent of which
 * global theme is active. An inverse container renders exactly as if the
 * opposite mode were active there, without touching the global app theme —
 * see the `Foundations/Color/Inverse` story for the canonical demo.
 *
 * Every color token flips: pass the theme's *other* mode's own `color` object
 * (`inverseOverride(lightClass, darkColors)` and vice versa) — the same
 * already-contrast-checked values that mode ships, never a fresh color. A
 * sentiment's `icon` formula mixes toward `vars.color.textSubtle`, which
 * resolves through the already-overridden `textSubtle` var inside this same
 * scope, so it lands right regardless of which mode's string is passed in.
 *
 * Nothing is left fixed. Themes that also restyle the primary button per mode
 * with their own `globalStyle` (freshwater, tahitian) ship a matching
 * `[data-inverse]`-scoped rule swapping that treatment — a hardcoded per-mode
 * fill can't move on the var flip alone.
 */
export function inverseOverride(themeClass: string, values: InverseColors) {
  globalStyle(`${themeClass} [data-inverse]`, {
    vars: assignVars(vars.color, values),
    background: color.background,
    color: color.text,
  });
}
