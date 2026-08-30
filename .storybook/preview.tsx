import type { Preview } from '@storybook/react-vite';
import { useGlobals, useEffect, useRef } from 'storybook/preview-api';
import '@fontsource/anton/400.css';
import '@fontsource/space-grotesk/400.css';
import '@fontsource/space-grotesk/500.css';
import '@fontsource/space-grotesk/600.css';
import '@fontsource/space-grotesk/700.css';
// Freshwater's mono (docs/theme/theme-revision-decisions.md §4) — data only:
// ids, values, labels, timestamps. Zodiak/General Sans (South Sea) aren't on
// @fontsource — loaded by CDN link in `preview-head.html` instead.
import '@fontsource/azeret-mono/400.css';
import '@fontsource/azeret-mono/500.css';
import '@fontsource/azeret-mono/600.css';
import { vars } from '../src/theme.css';
import { tahitianLightThemeClass, tahitianDarkThemeClass, tahitianExtensionClass } from '../src/themes/tahitian/tahitian.css';
import { freshwaterLightThemeClass, freshwaterDarkThemeClass } from '../src/themes/freshwater/freshwater.css';
import { southSeaLightThemeClass, southSeaDarkThemeClass } from '../src/themes/south-sea/south-sea.css';
import { pearlLightThemeClass, pearlDarkThemeClass, pearlExtensionClass } from '../src/themes/pearl/pearl.css';

type Mode = 'light' | 'dark';

interface ThemeEntry {
  /** The theme's own light/dark pair. Both are real, fully authored token
   *  sets — never derived from each other (see theme.css.ts's mode note). */
  light: string;
  dark: string;
  /** The theme's extension class, if it declares one — the CSS vars its
   *  `luster`/`overtone` gradients read (ADR-0007). Absent is the normal
   *  case: a theme with no extension treatments simply omits it, rather
   *  than being special-cased at the point of use. NEVER pair one theme's
   *  extension class with another's theme class — Tahitian deliberately
   *  does not apply Pearl's (see tahitian.css.ts's PearlSphere note). */
  extension?: string;
  /** The mode this theme wants to be met in. Tahitian's palette is built
   *  around black-lip nacre — its dark pair is the canonical read, and light
   *  is the variant. Pearl is the inverse. Picking a theme in the toolbar
   *  snaps the mode to this default; picking a mode afterwards still
   *  overrides it freely. */
  defaultMode: Mode;
}

// One registry keyed by theme name — classes and mode default together, so a
// theme is added or removed in exactly one place. Each of Pearl's named themes
// ships a real light AND dark pair (docs/fable5-handoff-three-themes.md);
// Tahitian/Freshwater/South Sea currently alias generic/placeholder values
// pending that visual exploration, so only the *shape* here is final.
//
// Prefixed symbol names are load-bearing, not noise: `pearl*` always means
// Pearl-the-theme (see src/index.ts's naming note), and the shared prefix is
// what makes a mispairing visible on the line that builds the className below.
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
  },
  freshwater: {
    light: freshwaterLightThemeClass,
    dark: freshwaterDarkThemeClass,
    defaultMode: 'light',
  },
  southSea: {
    light: southSeaLightThemeClass,
    dark: southSeaDarkThemeClass,
    defaultMode: 'dark',
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
        order: ['Introduction', 'Foundations', 'Brand', 'Components', 'Templates', 'Audit', "*"],
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

      // Snap the mode to the incoming theme's default *on a theme switch only*.
      // The ref seeds on first render so `initialGlobals` and a `?globals=`
      // deep link still win — this reacts to the toolbar, it doesn't preempt it.
      const previousTheme = useRef<string | null>(null);
      useEffect(() => {
        const changed = previousTheme.current !== null && previousTheme.current !== theme;
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
      // think about theming (roadmap.md's reskinning model).
      // Full-height only in the standalone Canvas tab. Inside autodocs, each
      // story is one block among many — forcing 100vh there just adds scroll.
      const minHeight = context.viewMode === 'docs' ? undefined : '100vh';

      // Stories that render full-bleed layouts (heroes, doc pages) opt out of
      // the default gutter with `parameters: { removePreviewPadding: true }`.
      const removePreviewPadding = context.parameters.removePreviewPadding === true;

      return (
        <div
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
        </div>
      );
    },
  ],
};

export default preview;
