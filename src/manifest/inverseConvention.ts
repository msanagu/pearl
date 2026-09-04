/**
 * `mode` vs. `inverse` — condensed from `inverseOverride` in
 * src/foundations/inverseOverride.ts.
 */
export const inverseConventionDocumentBlocks = [
  {
    type: 'guidance',
    text: '`mode` (light/dark, global) and `inverse` (`[data-inverse]`, a local polarity flip on one subtree) are orthogonal — never conflate them. An inverse container always renders as if the *other* mode were active there, without touching the global mode. Describe it as "the inverse container," not "the dark version" — which mode it resolves to depends on whichever mode is currently active.',
  },
  {
    type: 'guidance',
    text: 'Usage: add `data-inverse` to a container, then use ordinary token names inside it (`color.background`, `color.text`, `color.icon`, `color.accent`, `color.positive.icon`, etc.) — they resolve to the other mode\'s values automatically. Not total coverage: `border`/`borderStrong`/`borderSubtle` do NOT auto-flip — use `color.borderInverse` explicitly for those.',
  },
  {
    type: 'guidance',
    text: "Extending it: when adding a theme or a new color-contract key, extend `inverseOverride(...)`'s two calls with that key, sourcing the value from the theme's *other* mode's own already-defined value — never invent a fresh color for the inverse case.",
  },
  {
    type: 'example',
    text: `import { color } from '@msanagu/pearl';
import { style } from '@vanilla-extract/css';

// Ordinary token names — no special "inverse" variants to import
export const invertedCallout = style({
  background: color.surface,
  color: color.text,
});

// <div data-inverse className={invertedCallout}>...</div>`,
  },
] as const;
