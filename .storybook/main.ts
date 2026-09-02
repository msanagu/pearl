import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  addons: [
    '@storybook/addon-a11y',
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
    return config;
  },
};

export default config;
