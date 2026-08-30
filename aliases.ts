import { fileURLToPath } from 'node:url';

const src = (p: string) =>
  fileURLToPath(new URL(`./src/${p}`, import.meta.url));

/**
 * Single source of truth for the `@`-prefixed path aliases, shared by the
 * library build (vite.config.ts) and the test run (vitest.config.ts).
 * Storybook merges vite.config.ts, so it inherits these too.
 *
 * The same map is declared for the type-checker in tsconfig.json `paths`;
 * keep the two in sync — nothing enforces it automatically.
 *
 * Order matters: Vite matches `find` entries in sequence, so the `@/`
 * catch-all must come last or it would swallow `@components/…` first.
 */
export const alias = [
  { find: /^@components\//, replacement: `${src('components')}/` },
  { find: /^@themes\//, replacement: `${src('themes')}/` },
  { find: /^@tokens$/, replacement: src('tokens.ts') },
  { find: /^@\//, replacement: `${src('')}` },
];
