import { createTheme } from '@vanilla-extract/css';
import { vars } from '../theme.css';
import { scales } from './scales';

/**
 * Tahitian — one of Pearl's three named themes (docs/fable5-handoff-three-themes.md).
 * The flagship: dark is the default first render (`.storybook/preview.tsx`).
 *
 * **Both light and dark are still PLACEHOLDER drafts** pending the Fable 5
 * visual exploration — this file gets replaced with real authored values once
 * that comes back; file/export names stay stable.
 *
 * Each mode is authored as a fully independent, complete palette (never
 * derived from the other). The five `*Inverse` fields on each mode instead
 * mirror the OTHER mode's real primary values — the corrected inverse-token
 * model (see `theme.css.ts`'s contract comment): a dark band inside Tahitian
 * Light should look like real Tahitian Dark, and vice versa.
 */
const tahitianFontFamily = {
  display: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  heading: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  body: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

const tahitianText = {
  bodySm: { fontSize: '12px', lineHeight: '16px', fontWeight: '400' },
  bodyMd: { fontSize: '14px', lineHeight: '20px', fontWeight: '400' },
  bodyLg: { fontSize: '16px', lineHeight: '24px', fontWeight: '400' },
  headingSm: { fontSize: '20px', lineHeight: '24px', fontWeight: '600' },
  headingMd: { fontSize: '24px', lineHeight: '30px', fontWeight: '600' },
  headingLg: { fontSize: '36px', lineHeight: '40px', fontWeight: '600' },
  displaySm: { fontSize: '56px', lineHeight: '56px', fontWeight: '600' },
  displayLg: { fontSize: '96px', lineHeight: '88px', fontWeight: '600' },
};

export const tahitianLightThemeClass = createTheme(vars, {
  color: {
    background: '#ECEEEA',
    surface: '#FAFAF7',
    overlay: 'rgba(24, 26, 25, 0.56)',
    // Mirrors tahitianDarkThemeClass's real primaries below.
    backgroundInverse: '#0E0E10',
    surfaceInverse: '#1A1A1D',

    text: '#222422',
    textSubtle: '#6B6E69',
    textInverse: '#F5F5F7',
    textInverseSubtle: '#A0A0A7',

    border: '#C9CDC8',
    borderStrong: '#AEB3AD',
    borderSubtle: '#E1E3DF',
    borderInverse: '#2C2C30',

    accent: '#624C5D',
    accentHover: '#3A3D39',
    accentSubtle: '#E9E1E7',
    onAccent: '#FAFAF7',
    focusRing: '#624C5D',

    positive: { surface: '#E5EEE7', border: '#B7C8B9', text: '#244D35', icon: '#3D704F' },
    negative: { surface: '#F3E9E6', border: '#DDBDB6', text: '#7A3028', icon: '#A8483D' },
    warn: { surface: '#F3EDE0', border: '#D8C49D', text: '#6D531F', icon: '#95742C' },
    info: { surface: '#E7ECEB', border: '#BBC8C5', text: '#38534E', icon: '#52776F' },
  },
  ...scales,
  fontFamily: tahitianFontFamily,
  text: tahitianText,
});

export const tahitianDarkThemeClass = createTheme(vars, {
  color: {
    background: '#0E0E10',
    surface: '#1A1A1D',
    overlay: 'rgba(0, 0, 0, 0.6)',
    // Mirrors tahitianLightThemeClass's real primaries above.
    backgroundInverse: '#ECEEEA',
    surfaceInverse: '#FAFAF7',

    text: '#F5F5F7',
    textSubtle: '#A0A0A7',
    textInverse: '#222422',
    textInverseSubtle: '#6B6E69',

    border: '#2C2C30',
    borderStrong: '#45454B',
    borderSubtle: '#202024',
    borderInverse: '#C9CDC8',

    accent: '#8C6E86',
    accentHover: '#A588A0',
    accentSubtle: '#2A2230',
    onAccent: '#14111A',
    focusRing: '#8C6E86',

    positive: { surface: '#132018', border: '#2E5B3E', text: '#8FDB9E', icon: '#4CAE68' },
    negative: { surface: '#2A1613', border: '#7A362E', text: '#F3A79C', icon: '#E2604F' },
    warn: { surface: '#241D0E', border: '#6B531C', text: '#EFCB7C', icon: '#D6A233' },
    info: { surface: '#131C22', border: '#2C4E5C', text: '#9CC7DA', icon: '#4F93AC' },
  },
  ...scales,
  fontFamily: tahitianFontFamily,
  text: tahitianText,
});
