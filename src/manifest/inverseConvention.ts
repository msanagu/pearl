/**
 * `mode` vs. `inverse` — condensed from `inverseOverride` in
 * src/foundations/inverseOverride.ts.
 *
 * Universal mechanic (the mode/inverse orthogonality itself is the same rule
 * in every theme) — ships as a `base.foundations` entity, concept
 * `'inverseConvention'`.
 */
export const inverseConventionDocumentBlocks = [
  {
    type: 'do',
    text: 'Treat `mode` (light/dark, global — which `*LightThemeClass`/`*DarkThemeClass` is applied to the whole tree) and `inverse` (`[data-inverse]`, a local, bounded polarity flip on one subtree) as orthogonal axes. Describe an inverse container as "the inverse container," not "the dark version" — which mode it resolves to depends on whichever mode is currently active.',
  },
  {
    type: 'dont',
    text: "Don't conflate the two axes — an inverse container always renders as if the theme's *other* mode were active there, without touching the global mode.",
  },
  {
    type: 'do',
    text: 'Add `data-inverse` to a container, then use ordinary token names inside it (`color.background`, `color.text`, `color.icon`, `color.accent`, `color.positive.icon`, etc.) — they resolve to the other mode\'s values automatically, including on the element carrying the attribute itself.',
  },
  {
    type: 'dont',
    text: "Don't rely on auto-flip for `border`/`borderStrong`/`borderSubtle` — they do NOT flip inside `[data-inverse]`, unlike the other tokens. Reach for `color.borderInverse` explicitly when drawing a border against or inside an inverse surface.",
  },
  {
    type: 'verification',
    text: "When adding a theme or a new color-contract key, extend `inverseOverride(...)`'s two calls with that key. Verify the value sources from the theme's own *other*-mode already-defined value — never a fresh color invented for the inverse case.",
  },
] as const;
