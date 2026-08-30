/**
 * Live counts for the Introduction page's stats strip — computed from the
 * real public API surface (`@/index`), not hand-typed numbers. The strip
 * previously hardcoded `'10'` for components; `Link` shipped and nobody
 * updated the number, which is exactly the failure mode this file exists to
 * remove. Every count here can go stale only if the export surface itself
 * changes, never from someone forgetting a second place to update.
 *
 * A separate module, not inline in `Introduction.tsx`, so the counting
 * logic — which has to reach into React internals to recognize a
 * `forwardRef` component — stays out of the page component itself.
 */
import * as PublicApi from '@/index';

/**
 * True for anything a consumer would call a "component": a plain function
 * component, or a `forwardRef` result. `forwardRef` returns an OBJECT
 * (`React.ForwardRefExoticComponent`), not a function — `typeof` alone
 * would silently miss every `forwardRef` component (Button, Icon, Tag,
 * Alert, Input, Link all use it), undercounting without ever throwing.
 * `Symbol.for('react.forward_ref')` is the same well-known symbol React
 * itself stamps onto the object; checking `$$typeof` against it is the
 * standard way to recognize one without importing React just to call
 * `isValidElement`-adjacent internals.
 */
function isComponentLike(value: unknown): boolean {
  if (typeof value === 'function') return true;
  if (typeof value === 'object' && value !== null) {
    return (value as { $$typeof?: symbol }).$$typeof === Symbol.for('react.forward_ref');
  }
  return false;
}

const publicApiEntries = Object.entries(PublicApi);

export const componentCount = publicApiEntries.filter(([, value]) =>
  isComponentLike(value),
).length;

/**
 * Theme names read off the export surface itself, not a second hardcoded
 * list — every theme exports `${name}LightThemeClass`/`${name}DarkThemeClass`
 * (see `src/index.ts`), so the set of themes and whether each one truly
 * ships both modes are both derivable rather than asserted.
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
  // A theme shipping only one mode is a real regression, not a display nit —
  // surfacing it loudly in dev/CI console beats silently rendering a wrong
  // number on the page.
  console.warn(
    '[liveStats] A theme is missing its light or dark export — "2 modes each" may no longer be true. Check src/index.ts against src/themes/*/*.css.ts.',
  );
}

export const modesPerTheme = everyThemeHasBothModes ? 2 : NaN;
