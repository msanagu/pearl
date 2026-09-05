import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  // addon-a11y ships axe-core and runs a scan on every story view — useful
  // in dev, but this Storybook build is deployed as the actual GitHub Pages
  // site (see deploy-storybook.yml), so shipping and auto-running axe on
  // every visitor's landing page costs real JS weight and main-thread time
  // for a scan nobody's looking at. `storybook build` sets
  // NODE_ENV=production; `storybook dev` doesn't, so this keeps the addon
  // for local dev only.
  addons: [
    ...(process.env.NODE_ENV === 'production'
      ? []
      : ['@storybook/addon-a11y']),
    '@storybook/addon-docs',
    '@storybook/addon-vitest',
  ],
  // Serves public/ at the site root (e.g. /fonts/boska/...) — Storybook does
  // not do this automatically, unlike a plain Vite app.
  staticDirs: ['../public'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  // Pre-bundles every story's deps at server start instead of discovering
  // them lazily on first visit — avoids Vite's mid-session dep
  // re-optimization full-reload, which the preview iframe often misses,
  // leaving the docs page blank until a manual refresh. `warmup` alone only
  // pre-transforms the story files themselves; it doesn't feed Vite's
  // optimizer scanner, so a first-ever Docs visit (which pulls in
  // addon-docs' own deps, e.g. the MDX renderer) still triggers a runtime
  // re-optimize. `optimizeDeps.entries` makes the scanner crawl the story
  // files' transitive imports at startup instead.
  //
  // `optimizeDeps.include` covers deps the scanner still can't see: the
  // vanilla-extract plugin turns .css.ts into virtual modules, so the
  // recipe runtime (@vanilla-extract/recipes/createRuntimeFn) is invisible
  // to the crawl and first surfaces on a Docs visit, where it re-optimizes
  // and reloads the iframe blank. Only shows up locally — `storybook build`
  // pre-bundles everything.
  async viteFinal(config) {
    config.server ??= {};
    config.server.warmup = {
      clientFiles: ['./src/**/*.stories.@(ts|tsx)'],
    };
    config.optimizeDeps ??= {};
    config.optimizeDeps.entries = [
      ...(Array.isArray(config.optimizeDeps.entries)
        ? config.optimizeDeps.entries
        : config.optimizeDeps.entries
          ? [config.optimizeDeps.entries]
          : []),
      './src/**/*.stories.@(ts|tsx)',
    ];
    config.optimizeDeps.include = [
      ...(config.optimizeDeps.include ?? []),
      '@vanilla-extract/recipes/createRuntimeFn',
    ];
    return config;
  },
};

export default config;
