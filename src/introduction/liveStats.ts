/**
 * Live counts for the Introduction page's stats strip — computed from the real
 * public API surface (`@/index`), so a number can only go stale if the export
 * surface itself changes. Kept out of `Introduction.tsx` because the counting
 * has to reach into React internals to recognize a `forwardRef` component.
 */
import * as PublicApi from '@/index';

/**
 * True for a plain function component or a `forwardRef` result. `forwardRef`
 * returns an object, not a function, so `typeof` alone would silently miss
 * every `forwardRef` component (Button, Icon, Tag, Alert, Input, Link).
 * `$$typeof === Symbol.for('react.forward_ref')` is how React stamps them.
 */
function isComponentLike(value: unknown): boolean {
  if (typeof value === 'function') return true;
  if (typeof value === 'object' && value !== null) {
    return (
      (value as { $$typeof?: symbol }).$$typeof ===
      Symbol.for('react.forward_ref')
    );
  }
  return false;
}

const publicApiEntries = Object.entries(PublicApi);

export const componentCount = publicApiEntries.filter(([, value]) =>
  isComponentLike(value),
).length;

/**
 * Theme names read off the export surface — every theme exports
 * `${name}LightThemeClass` / `${name}DarkThemeClass`, so the theme set and
 * whether each ships both modes are derivable rather than asserted.
 */
const lightThemeNames = publicApiEntries
  .map(([key]) => key.match(/^(.+)LightThemeClass$/)?.[1])
  .filter((name): name is string => name !== undefined);

const darkThemeNames = new Set(
  publicApiEntries
    .map(([key]) => key.match(/^(.+)DarkThemeClass$/)?.[1])
    .filter((name): name is string => name !== undefined),
);

export const themeCount = lightThemeNames.length;

const everyThemeHasBothModes =
  lightThemeNames.length > 0 &&
  lightThemeNames.every((name) => darkThemeNames.has(name));

if (!everyThemeHasBothModes) {
  // A theme shipping only one mode is a regression — warn loudly rather than
  // render a wrong number on the page.
  console.warn(
    '[liveStats] A theme is missing its light or dark export — "2 modes each" may no longer be true. Check src/index.ts against src/themes/*/*.css.ts.',
  );
}

export const modesPerTheme = everyThemeHasBothModes ? 2 : NaN;
