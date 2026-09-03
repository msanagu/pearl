// The library build skips public/ entirely (copyPublicDir: false in
// vite.config.ts) so Storybook-only assets like public/images don't ship in
// dist/. Font files are the exception: src/fonts/*.css.ts registers
// @font-face rules with absolute `/fonts/...` src paths, so consumers need
// the actual files alongside the package.
import { cp } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));

await cp(`${root}/public/fonts`, `${root}/dist/fonts`, { recursive: true });
