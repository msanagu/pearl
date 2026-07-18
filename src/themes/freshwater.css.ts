import { createTheme } from '@vanilla-extract/css';
import { vars } from '../theme.css';
import { scales } from './scales';

/**
 * Freshwater — one of Pearl's three named themes
 * (docs/fable5-handoff-three-themes.md). **No authored identity yet** — both
 * modes currently hold the same neutral placeholder palette (formerly the
 * system's generic light/dark) so the theme×mode toolbar has real, complete
 * token sets to show. Replace with real authored values once the Fable 5
 * visual exploration comes back — file/export names stay stable.
 *
 * Each mode is a fully independent, complete palette; each mode's `*Inverse`
 * fields mirror the OTHER mode's real primary values (see `theme.css.ts`'s
 * contract comment for the model).
 */
export const freshwaterLightThemeClass = createTheme(vars, {
  color: {
    background: '#ffffff',
    surface: '#f4f4f5',
    overlay: 'rgba(17, 17, 19, 0.5)',
    backgroundInverse: '#0e0e10',
    surfaceInverse: '#1a1a1d',

    text: '#111113',
    textSubtle: '#5b5b60',
    textInverse: '#f5f5f7',
    textInverseSubtle: '#a0a0a7',

    border: '#e4e4e7',
    borderStrong: '#c8c8cd',
    borderSubtle: '#f0f0f2',
    borderInverse: '#2c2c30',

    accent: '#3b5bfd',
    accentHover: '#2f49d6',
    accentSubtle: '#eef1ff',
    onAccent: '#ffffff',
    focusRing: '#3b5bfd',

    positive: { surface: '#e8f5ec', border: '#b7dfc4', text: '#1b5e2b', icon: '#2e9e4f' },
    negative: { surface: '#fdeceb', border: '#f4b9b4', text: '#8f1d17', icon: '#d64036' },
    warn: { surface: '#fdf3e2', border: '#f2d59b', text: '#7a4d09', icon: '#d9920b' },
    info: { surface: '#ebf1fe', border: '#b9ccf7', text: '#1c3a80', icon: '#3b6fe0' },
  },
  ...scales,
});

export const freshwaterDarkThemeClass = createTheme(vars, {
  color: {
    background: '#0e0e10',
    surface: '#1a1a1d',
    overlay: 'rgba(0, 0, 0, 0.6)',
    backgroundInverse: '#ffffff',
    surfaceInverse: '#f4f4f5',

    text: '#f5f5f7',
    textSubtle: '#a0a0a7',
    textInverse: '#111113',
    textInverseSubtle: '#5b5b60',

    border: '#2c2c30',
    borderStrong: '#45454b',
    borderSubtle: '#202024',
    borderInverse: '#e4e4e7',

    accent: '#6d84ff',
    accentHover: '#8598ff',
    accentSubtle: '#1b2140',
    onAccent: '#0b0d1f',
    focusRing: '#6d84ff',

    positive: { surface: '#12251a', border: '#2f6b41', text: '#7ee2a0', icon: '#3fbf6a' },
    negative: { surface: '#2a1513', border: '#7a2f28', text: '#f5a8a0', icon: '#e8574a' },
    warn: { surface: '#28200f', border: '#6e5316', text: '#f0cd7a', icon: '#e0a52a' },
    info: { surface: '#131d2e', border: '#2c4a80', text: '#9fc0f5', icon: '#5a8cf0' },
  },
  ...scales,
});
