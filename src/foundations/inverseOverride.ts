import { globalStyle, assignVars } from '@vanilla-extract/css';
import { color } from '@tokens';

const slice = {
  background: color.background,
  surface: color.surface,
  text: color.text,
  textSubtle: color.textSubtle,
  icon: color.icon,
};

type InverseValues = {
  background: string;
  surface: string;
  text: string;
  textSubtle: string;
  icon: string;
};

/**
 * Scopes `background`/`surface`/`text`/`textSubtle`/`icon` to their inverse
 * values under `[data-inverse]` — including the element carrying the
 * attribute itself (attribute selectors match self, not just descendants).
 * Everything inside, and the boundary itself, just uses the normal token
 * names and gets the right value for free.
 */
export function inverseOverride(themeClass: string, values: InverseValues) {
  globalStyle(`${themeClass} [data-inverse]`, {
    vars: assignVars(slice, values),
    background: color.background,
    color: color.text,
  });
}
