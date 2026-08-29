import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

// Separate from vite.config.ts (the library build) so test concerns don't leak
// into the published bundle. The vanilla-extract plugin is included so that
// components importing `.css.ts` compile inside tests too.
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { playwright } from '@vitest/browser-playwright';
import { alias } from './aliases';
const dirname = typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon
export default defineConfig({
  plugins: [react(), vanillaExtractPlugin()],
  resolve: { alias },
  optimizeDeps: {
    include: ['@vanilla-extract/recipes/createRuntimeFn']
  },
  test: {
    // Coverage is configured at the root, not per-project: Vitest 4's
    // ProjectConfig type no longer accepts it.
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: 'coverage',
    },
    projects: [{
      extends: true,
      test: {
        name: 'unit',
        environment: 'jsdom',
        setupFiles: ['./src/test/setup.ts'],
        css: true,
        include: ['src/**/*.test.{ts,tsx}'],
      }
    }, {
      extends: true,
      plugins: [
      // The plugin will run tests for the stories defined in your Storybook config
      // See options at: https://storybook.js.org/docs/next/writing-tests/integrations/vitest-addon#storybooktest
      // `coverage` is no longer a valid option here (addon-vitest 10 dropped it
      // from UserOptions); coverage is configured on the root test config above.
      storybookTest({ configDir: path.join(dirname, '.storybook') })],
      test: {
        name: 'storybook',
        browser: {
          enabled: true,
          headless: true,
          provider: playwright({}),
          instances: [{
            browser: 'chromium'
          }]
        }
      }
    }]
  }
});