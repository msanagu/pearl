import { createTheme } from '@vanilla-extract/css';
import { vars } from '../theme.css';
import { scales } from './scales';

/**
 * The light theme. Only `color` is defined here — everything else (radius,
 * spacing, control height, type) comes from the shared `scales`, since a light
 * and dark pair differ in color alone.
 *
 * **Color values are PLACEHOLDERS** pending the visual-language exploration
 * (docs/visual-language-brief.md). Swapping them re-skins the system with zero
 * component change.
 */
export const lightThemeClass = createTheme(vars, {
  color: {
    // Surfaces
    background: '#ffffff',
    surface: '#f4f4f5',
    overlay: 'rgba(17, 17, 19, 0.5)',
    backgroundInverse: '#111113',
    surfaceInverse: '#202024',
    // Text
    text: '#111113',
    textSubtle: '#5b5b60',
    textInverse: '#f5f5f7',
    textInverseSubtle: '#a0a0a7',
    // Borders
    border: '#e4e4e7',
    borderStrong: '#c8c8cd',
    borderSubtle: '#f0f0f2',
    borderInverse: '#3a3a40',
    // Accent
    accent: '#3b5bfd',
    accentHover: '#2f49d6',
    accentSubtle: '#eef1ff',
    onAccent: '#ffffff',
    // Focus
    focusRing: '#3b5bfd',
    // Sentiment — text is dark (sits on the light tinted surface)
    positive: { surface: '#e8f5ec', border: '#b7dfc4', text: '#1b5e2b', icon: '#2e9e4f' },
    negative: { surface: '#fdeceb', border: '#f4b9b4', text: '#8f1d17', icon: '#d64036' },
    warn: { surface: '#fdf3e2', border: '#f2d59b', text: '#7a4d09', icon: '#d9920b' },
    info: { surface: '#ebf1fe', border: '#b9ccf7', text: '#1c3a80', icon: '#3b6fe0' },
  },
  ...scales,
});
