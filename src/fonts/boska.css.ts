import { globalFontFace } from '@vanilla-extract/css';

/**
 * Boska — real font files, not an aspirational stack. Sourced from Fontshare
 * (Indian Type Foundry's free-font platform); license at
 * `public/fonts/boska/LICENSE.txt`. Used by South Sea's display/heading roles
 * (see south-sea.css.ts) for the luxury-register serif.
 *
 * Side-effect only module — import for its `globalFontFace` registration, no
 * exports. `public/` is served at the site root by Vite, so paths are `/fonts/...`.
 */
globalFontFace('Boska', {
  src: 'url("/fonts/boska/Boska-Regular.woff2") format("woff2")',
  fontWeight: 400,
  fontStyle: 'normal',
  fontDisplay: 'swap',
});
globalFontFace('Boska', {
  src: 'url("/fonts/boska/Boska-Medium.woff2") format("woff2")',
  fontWeight: 500,
  fontStyle: 'normal',
  fontDisplay: 'swap',
});
globalFontFace('Boska', {
  src: 'url("/fonts/boska/Boska-Bold.woff2") format("woff2")',
  fontWeight: 700,
  fontStyle: 'normal',
  fontDisplay: 'swap',
});
globalFontFace('Boska', {
  src: 'url("/fonts/boska/Boska-Black.woff2") format("woff2")',
  fontWeight: 900,
  fontStyle: 'normal',
  fontDisplay: 'swap',
});
