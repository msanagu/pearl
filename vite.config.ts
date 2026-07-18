import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

// Library build: the design system is consumed as a package, not run as an app.
// react / react-dom stay external so consumers dedupe on their own copy.
// Storybook (react-vite) merges this config, so the vanilla-extract plugin
// applies there too — no separate viteFinal wiring needed.
export default defineConfig({
  plugins: [react(), vanillaExtractPlugin()],
  build: {
    lib: {
      entry: new URL('./src/index.ts', import.meta.url).pathname,
      formats: ['es'],
      fileName: 'index',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
    },
  },
});
