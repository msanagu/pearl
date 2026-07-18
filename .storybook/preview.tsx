import type { Preview } from '@storybook/react-vite';
import { vars } from '../src/theme.css';
import { tahitianLightThemeClass, tahitianDarkThemeClass } from '../src/themes/tahitian.css';
import { freshwaterLightThemeClass, freshwaterDarkThemeClass } from '../src/themes/freshwater.css';
import { southSeaLightThemeClass, southSeaDarkThemeClass } from '../src/themes/south-sea.css';

// Theme × mode matrix. Each of Pearl's three named themes ships a real light
// AND dark pair (docs/fable5-handoff-three-themes.md) — Tahitian/Freshwater/
// South Sea currently alias generic/placeholder values pending that visual
// exploration; only the *shape* (theme × mode, all six slots real) is final.
const themeMatrix: Record<string, Record<'light' | 'dark', string>> = {
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
    // Accessibility is a first-class concern (docs/accessibility-standards.md).
    a11y: { test: 'todo' },
  },

  globalTypes: {
    theme: {
      description: 'Active theme',
      toolbar: {
        title: 'Theme',
        icon: 'paintbrush',
        items: [
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
  initialGlobals: { theme: 'tahitian', mode: 'dark' },

  decorators: [
    (Story, context) => {
      const theme = (context.globals.theme as string) ?? 'tahitian';
      const mode = (context.globals.mode as 'light' | 'dark') ?? 'dark';
      const themeClass = themeMatrix[theme]?.[mode] ?? tahitianDarkThemeClass;

      // Every component reads only `vars.*` — nothing renders correctly without
      // a theme class as an ancestor. Applying it globally means stories never
      // think about theming (roadmap.md's reskinning model).
      return (
        <div
          className={themeClass}
          style={{
            background: vars.color.background,
            color: vars.color.text,
            fontFamily: vars.fontFamily.body,
            minHeight: '100vh',
            padding: '2rem',
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
