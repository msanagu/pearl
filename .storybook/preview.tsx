import type { Preview } from '@storybook/react-vite';
import { vars } from '../src/theme.css';
import { tahitianLightThemeClass, tahitianDarkThemeClass } from '../src/themes/tahitian.css';
import { freshwaterLightThemeClass, freshwaterDarkThemeClass } from '../src/themes/freshwater.css';
import { southSeaLightThemeClass, southSeaDarkThemeClass } from '../src/themes/south-sea.css';
import { pearlLightThemeClass, pearlDarkThemeClass, pearlTreatmentClass } from '../src/themes/pearl.css';

// Theme × mode matrix. Each of Pearl's three named themes ships a real light
// AND dark pair (docs/fable5-handoff-three-themes.md) — Tahitian/Freshwater/
// South Sea currently alias generic/placeholder values pending that visual
// exploration; only the *shape* (theme × mode, all six slots real) is final.
const themeMatrix: Record<string, Record<'light' | 'dark', string>> = {
  pearl: { light: pearlLightThemeClass, dark: pearlDarkThemeClass },
  tahitian: { light: tahitianLightThemeClass, dark: tahitianDarkThemeClass },
  freshwater: { light: freshwaterLightThemeClass, dark: freshwaterDarkThemeClass },
  southSea: { light: southSeaLightThemeClass, dark: southSeaDarkThemeClass },
};

const preview: Preview = {
  parameters: {
      layout: 'fullscreen',
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    // Accessibility is a first-class concern (docs/foundations/accessibility-standards.md).
    a11y: { test: 'todo' },
    options: {
      storySort: {
        method: 'alphabetical', // Optional: sorts remaining items alphabetically
        order: ['Foundations', 'Brand', 'Components', 'Templates', 'POC', '*'],
      },
    },
  },

  globalTypes: {
    theme: {
      description: 'Active theme',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
          { value: 'pearl', title: 'Pearl' },
          { value: 'tahitian', title: 'Tahitian' },
          { value: 'freshwater', title: 'Freshwater' },
          { value: 'southSea', title: 'South Sea' },
        ],
        dynamicTitle: true,
      },
    },
    mode: {
      description: 'Light / dark mode',
      toolbar: {
        title: 'Mode',
        icon: 'contrast',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
        ],
        dynamicTitle: true,
      },
    },
  },
  // Tahitian dark is the flagship first-render (per product direction).
  // Pearl is the flagship and the theme the docs site is pinned to.
  initialGlobals: { theme: 'pearl', mode: 'light' },

  decorators: [
    (Story, context) => {
      const theme = (context.globals.theme as string) ?? 'pearl';
      const mode = (context.globals.mode as 'light' | 'dark') ?? 'light';
      const themeClass = themeMatrix[theme]?.[mode] ?? pearlLightThemeClass;
      // Pearl's extension treatments ride alongside its canon class. Themes
      // without treatments simply contribute nothing here.
      const treatmentClass = theme === 'pearl' ? pearlTreatmentClass : '';

      // Every component reads only `vars.*` — nothing renders correctly without
      // a theme class as an ancestor. Applying it globally means stories never
      // think about theming (roadmap.md's reskinning model).
      // Full-height only in the standalone Canvas tab. Inside autodocs, each
      // story is one block among many — forcing 100vh there just adds scroll.
      const minHeight = context.viewMode === 'docs' ? undefined : '100vh';

      // Stories that render full-bleed layouts (heroes, doc pages) opt out of
      // the default gutter with `parameters: { removePreviewPadding: true }`.
      const removePreviewPadding = context.parameters.removePreviewPadding === true;

      return (
        <div
          className={`${themeClass} ${treatmentClass}`.trim()}
          style={{
            background: vars.color.background,
            color: vars.color.text,
            fontFamily: vars.fontFamily.body,
            minHeight,
            padding: removePreviewPadding ? undefined : '2rem',
            boxSizing: 'border-box',
          }}
        >
          <Story />
        </div>
      );
    },
  ],
};

export default preview;
