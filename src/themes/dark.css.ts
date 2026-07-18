import { createTheme } from '@vanilla-extract/css';
import { vars } from '../theme.css';
import { scales } from './scales';

/**
 * The dark theme — same contract, same `scales`, only `color` inverted. This is
 * the reskin thesis in its clearest form: one file, color-only, no component
 * change. It also exercises the role-based token model — sentiment `text` flips
 * to *light* here (it sits on a dark tinted `surface`), which a component never
 * has to know about.
 *
 * **Color values are PLACEHOLDERS** pending the visual-language exploration.
 */
export const darkThemeClass = createTheme(vars, {
  color: {
    // Surfaces
    background: '#0e0e10',
    surface: '#1a1a1d',
    overlay: 'rgba(0, 0, 0, 0.6)',
    backgroundInverse: '#f5f5f7',
    surfaceInverse: '#ffffff',
    // Text
    text: '#f5f5f7',
    textSubtle: '#a0a0a7',
    textInverse: '#111113',
    textInverseSubtle: '#5b5b60',
    // Borders
    border: '#2c2c30',
    borderStrong: '#45454b',
    borderSubtle: '#202024',
    borderInverse: '#d6d6dc',
    // Accent — lifted so it reads against the dark background
    accent: '#6d84ff',
    accentHover: '#8598ff',
    accentSubtle: '#1b2140',
    onAccent: '#0b0d1f',
    // Focus
    focusRing: '#6d84ff',
    // Sentiment — text is light (sits on the dark tinted surface); the role
    // names are identical to light, only the values invert.
    positive: { surface: '#12251a', border: '#2f6b41', text: '#7ee2a0', icon: '#3fbf6a' },
    negative: { surface: '#2a1513', border: '#7a2f28', text: '#f5a8a0', icon: '#e8574a' },
    warn: { surface: '#28200f', border: '#6e5316', text: '#f0cd7a', icon: '#e0a52a' },
    info: { surface: '#131d2e', border: '#2c4a80', text: '#9fc0f5', icon: '#5a8cf0' },
  },
  ...scales,
});
