import type { Preview } from '@storybook/react-vite';
import { useGlobals, useEffect, useRef } from 'storybook/preview-api';
import '@fontsource/anton/400.css';
import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/600.css';
import '@fontsource/space-grotesk/700.css';
// Freshwater's mono, used for data only: ids, values, labels. Zodiak/General
// Sans (South Sea) aren't on @fontsource — loaded via `preview-head.html`.
import '@fontsource/azeret-mono/400.css';
import '@fontsource/azeret-mono/500.css';
import '@fontsource/azeret-mono/600.css';
import { vars } from '../src/theme.css';
import {
  tahitianLightThemeClass,
  tahitianDarkThemeClass,
  tahitianExtensionClass,
} from '../src/themes/tahitian/tahitian.css';
import {
  freshwaterLightThemeClass,
  freshwaterDarkThemeClass,
  freshwaterExtensionClass,
} from '../src/themes/freshwater/freshwater.css';
import {
  southSeaLightThemeClass,
  southSeaDarkThemeClass,
} from '../src/themes/south-sea/south-sea.css';
import {
  pearlLightThemeClass,
  pearlDarkThemeClass,
  pearlExtensionClass,
} from '../src/themes/pearl/pearl.css';
import { ThemeIconProvider } from '../src/components/Icon/ThemeIconProvider';
import type { ThemeName } from '../src/components/Icon/iconSets';

type Mode = 'light' | 'dark';

interface ThemeEntry {
  /** The theme's light/dark pair — both fully authored, never derived from
   *  each other (see theme.css.ts's mode note). */
  light: string;
  dark: string;
  /** The theme's extension class, if it declares one — the CSS vars its
   *  `luster`/`overtone` gradients read. Never pair one theme's extension
   *  class with another's theme class. */
  extension?: string;
  /** The mode this theme wants to be met in — Tahitian reads dark-first,
   *  Pearl light-first. Picking a theme snaps the mode to this; picking a
   *  mode afterwards still overrides freely. */
  defaultMode: Mode;
  /** Fontshare `f[]` requests for this theme's non-@fontsource faces, split
   *  the same way preview-head.html's used to be (one family per request,
   *  ≤3 styles each). Pearl's Gambetta is preloaded in preview-head.html
   *  instead — omitted here since it's already on the page by the time any
   *  theme picker runs. */
  fontshareFamilies?: string[];
}

const loadedFontshareFamilies = new Set<string>();

/** Injects a theme's Fontshare stylesheets on first use, not before —
 *  they're otherwise render-blocking weight for themes nobody's viewing.
 *  Keyed by request URL so switching themes back and forth never re-fetches. */
function loadThemeFonts(entry: ThemeEntry) {
  for (const family of entry.fontshareFamilies ?? []) {
    if (loadedFontshareFamilies.has(family)) continue;
    loadedFontshareFamilies.add(family);
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `https://api.fontshare.com/v2/css?f[]=${family}&display=swap`;
    document.head.appendChild(link);
  }
}

// One registry keyed by theme name, so a theme is added or removed in one
// place. The `pearl*` / `tahitian*` symbol prefixes are load-bearing — the
// shared prefix is what makes a mispairing visible on the className line below.
const themes: Record<string, ThemeEntry> = {
  pearl: {
    light: pearlLightThemeClass,
    dark: pearlDarkThemeClass,
    extension: pearlExtensionClass,
    defaultMode: 'light',
  },
  tahitian: {
    light: tahitianLightThemeClass,
    dark: tahitianDarkThemeClass,
    extension: tahitianExtensionClass,
    defaultMode: 'dark',
    fontshareFamilies: ['switzer@400,500,600', 'switzer@700'],
  },
  freshwater: {
    light: freshwaterLightThemeClass,
    dark: freshwaterDarkThemeClass,
    extension: freshwaterExtensionClass,
    defaultMode: 'light',
    fontshareFamilies: [
      'zodiak@400,401,700,701',
      'general-sans@300,400,500',
      'general-sans@600,700',
    ],
  },
  southSea: {
    light: southSeaLightThemeClass,
    dark: southSeaDarkThemeClass,
    defaultMode: 'dark',
    fontshareFamilies: ['boska@400'],
  },
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
        order: [
          'Introduction',
          'Foundations',
          'Brand',
          'Components',
          'Templates',
          'Audit',
          '*',
        ],
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
  // Pearl is the flagship and the theme the docs site is pinned to.
  initialGlobals: { theme: 'pearl', mode: 'light' },

  decorators: [
    (Story, context) => {
      const [, updateGlobals] = useGlobals();
      const theme = (context.globals.theme as string) ?? 'pearl';
      const mode = (context.globals.mode as Mode) ?? 'light';
      const entry = themes[theme] ?? themes.pearl;

      // Fires on every render, but loadThemeFonts is a no-op past the first
      // call per family (see loadedFontshareFamilies) — cheaper than a
      // useEffect keyed on `theme` and just as correct, since insertion order
      // doesn't matter for stylesheets.
      loadThemeFonts(entry);

      // Snap the mode to the incoming theme's default *on a theme switch only*.
      // The ref seeds on first render so `initialGlobals` and a `?globals=`
      // deep link still win — this reacts to the toolbar, it doesn't preempt it.
      const previousTheme = useRef<string | null>(null);
      useEffect(() => {
        const changed =
          previousTheme.current !== null && previousTheme.current !== theme;
        previousTheme.current = theme;
        const preferred = themes[theme]?.defaultMode;
        if (changed && preferred && preferred !== mode) {
          updateGlobals({ mode: preferred });
        }
      }, [theme]);
      // Both classes come from the SAME registry entry, so a theme class can
      // never be paired with another theme's extension class. A theme that
      // declares no extension treatments contributes nothing here — that's the
      // absent `extension` field, not a special case. Field's own `fieldMeta`
      // marker is applied locally by Field.tsx, not here.
      const themeClass = entry[mode];
      const extensionClass = entry.extension ?? '';

      // Every component reads only `vars.*` — nothing renders correctly without
      // a theme class as an ancestor. Applying it globally means stories never
      // think about theming (the README's "Forking and reskinning" model).
      // Full-height only in the standalone Canvas tab. Inside autodocs, each
      // story is one block among many — forcing 100vh there just adds scroll.
      const minHeight = context.viewMode === 'docs' ? undefined : '100vh';

      // Stories that render full-bleed layouts (heroes, doc pages) opt out of
      // the default gutter with `parameters: { removePreviewPadding: true }`.
      const removePreviewPadding =
        context.parameters.removePreviewPadding === true;

      // `<main>` only in the standalone Canvas tab — an autodocs page
      // renders many stories through this same decorator, and more than one
      // `<main>` landmark on a page is itself an a11y violation.
      const Container = context.viewMode === 'docs' ? 'div' : 'main';

      return (
        <ThemeIconProvider theme={theme as ThemeName}>
          <Container
            className={`${themeClass} ${extensionClass}`.trim()}
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
          </Container>
        </ThemeIconProvider>
      );
    },
  ],
};

export default preview;
