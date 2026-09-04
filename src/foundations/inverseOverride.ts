import { globalStyle, assignVars } from '@vanilla-extract/css';
import { color } from '@tokens';
import { vars } from '@/theme.css';

const slice = {
  background: color.background,
  surface: color.surface,
  text: color.text,
  textSubtle: color.textSubtle,
  icon: color.icon,
  accent: color.accent,
  accentHover: color.accentHover,
  accentSubtle: color.accentSubtle,
  onAccent: color.onAccent,
  onAccentSubtle: color.onAccentSubtle,
  positive: vars.color.positive,
  negative: vars.color.negative,
  warn: vars.color.warn,
  info: vars.color.info,
};

type Sentiment = {
  surface: string;
  border: string;
  text: string;
  icon: string;
};

type InverseValues = {
  background: string;
  surface: string;
  text: string;
  textSubtle: string;
  icon: string;
  accent: string;
  accentHover: string;
  accentSubtle: string;
  onAccent: string;
  onAccentSubtle: string;
  positive: Sentiment;
  negative: Sentiment;
  warn: Sentiment;
  info: Sentiment;
};

/**
 * `mode` (light/dark) and `inverse` are different, orthogonal axes — don't
 * conflate them. `mode` is which `*LightThemeClass`/`*DarkThemeClass` is
 * applied to the whole tree; `inverse` is a local, bounded polarity flip on
 * one subtree, independent of which mode is currently active. An inverse
 * container always renders as if the *other* mode were active, without
 * flipping the global mode — see `Tokens.Semantic.stories.tsx`'s "Inverse"
 * section for the canonical demo of this sentence.
 *
 * Mechanically: scopes `background`/`surface`/`text`/`textSubtle`/`icon`/the
 * `accent` family/the sentiment families (`positive`/`negative`/`warn`/
 * `info`) to their inverse values under `[data-inverse]` — including the
 * element carrying the attribute itself (attribute selectors match self, not
 * just descendants). Everything inside, and the boundary itself, just uses
 * the normal token names and gets the right value for free.
 *
 * Every value passed in here is the theme's *other* mode's own already
 * contrast-checked value for that same key (see the per-theme comments) —
 * never a fresh color invented for the inverse case. A sentiment's `icon`
 * formula mixes toward `vars.color.textSubtle`, which resolves through the
 * already-overridden `textSubtle` var inside this same scope, so it lands on
 * the right value regardless of which mode's formula string is passed in.
 *
 * Not everything swaps here: `border`/`borderStrong`/`borderSubtle` do NOT
 * auto-flip inside `[data-inverse]`, unlike the keys above. Reach for the
 * dedicated `color.borderInverse` token when drawing a border against or
 * inside an inverse surface — it is a manual per-use substitute, not
 * something this function provides automatically.
 */
export function inverseOverride(themeClass: string, values: InverseValues) {
  globalStyle(`${themeClass} [data-inverse]`, {
    vars: assignVars(slice, values),
    background: color.background,
    color: color.text,
  });
}
