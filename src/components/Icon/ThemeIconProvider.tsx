import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import {
  DEFAULT_THEME_ICON_SET,
  THEME_ICON_SETS,
  type ThemeIconSet,
  type ThemeName,
} from './iconSets';

const DEFAULT_THEME_NAME: ThemeName = 'pearl';

const ThemeIconContext = createContext<ThemeIconSet>(DEFAULT_THEME_ICON_SET);
// Separate from `ThemeIconContext` because that one carries only the five
// Alert/Field/XButton keys — anything choosing its own theme-appropriate icon
// outside that vocabulary (e.g. Introduction's "Start here" cards) needs the
// theme name itself, not a resolved set.
const ThemeNameContext = createContext<ThemeName>(DEFAULT_THEME_NAME);

export interface ThemeIconProviderProps {
  /** Which theme's icon set (`iconSets.ts`) internal components should draw from. */
  theme: ThemeName;
  children?: ReactNode;
}

/**
 * Makes the active theme's icon set available to this library's own
 * components (Alert, Field, XButton) via `useThemeIconSet`. Optional: a tree
 * with no provider gets `DEFAULT_THEME_ICON_SET` (Pearl/Phosphor), which is
 * today's behavior — wrapping in this provider is what opts a consumer into
 * per-theme icons, it isn't required to render at all.
 *
 * This only affects icons those components choose on their own; anything
 * passed via an explicit `icon` prop always wins.
 */
export function ThemeIconProvider({ theme, children }: ThemeIconProviderProps) {
  const iconSet = THEME_ICON_SETS[theme] ?? DEFAULT_THEME_ICON_SET;
  return (
    <ThemeNameContext.Provider value={theme}>
      <ThemeIconContext.Provider value={iconSet}>
        {children}
      </ThemeIconContext.Provider>
    </ThemeNameContext.Provider>
  );
}

export function useThemeIconSet(): ThemeIconSet {
  return useContext(ThemeIconContext);
}

/** The theme name itself, for icon choices outside the Alert/Field/XButton vocabulary. */
export function useThemeName(): ThemeName {
  return useContext(ThemeNameContext);
}
