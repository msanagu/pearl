import type { Preview } from '@storybook/react-vite';
import { vars } from '../src/theme.css';
import { lightThemeClass } from '../src/themes/light.css';
import { darkThemeClass } from '../src/themes/dark.css';
import { pearlThemeClass, pearlAubergineThemeClass } from '../src/themes/pearl.css';

// Theme × mode matrix. Each theme is meant to ship a real light AND dark pair
// (that's the whole point — see docs/visual-language-brief.md's 3-theme
// validation). Pearl's dark pair doesn't exist yet (pending the Fable 5 visual
// exploration), so it falls back to its light values rather than fake them —
// marked explicitly so nobody mistakes the fallback for a real dark theme.
const themeMatrix: Record<string, Record<'light' | 'dark', string>> = {
  default: { light: lightThemeClass, dark: darkThemeClass },
  pearl: { light: pearlThemeClass, dark: pearlThemeClass /* TODO: real Pearl dark pair */ },
  pearlAubergine: {
    light: pearlAubergineThemeClass,
    dark: pearlAubergineThemeClass /* TODO: real Pearl Aubergine dark pair */,
  },
};

const preview: Preview = {
  parameters: {
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
          { value: 'default', title: 'Default' },
          { value: 'pearl', title: 'Pearl (oyster stone)' },
          { value: 'pearlAubergine', title: 'Pearl (ink)' },
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
  initialGlobals: { theme: 'pearl', mode: 'light' },

  decorators: [
    (Story, context) => {
      const theme = (context.globals.theme as string) ?? 'pearl';
      const mode = (context.globals.mode as 'light' | 'dark') ?? 'light';
      const themeClass = themeMatrix[theme]?.[mode] ?? pearlThemeClass;

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
