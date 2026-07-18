import { createTheme } from '@vanilla-extract/css';
import { vars } from '../theme.css';
import { scales } from './scales';

/**
 * Pearl's authored identity: black shell, silver, and oyster stone.
 *
 * The system reads as monochrome first: black pearl, silver, and near-white.
 * The earth-toned signal only shows through at the seams — focus, selected
 * states, and material emphasis — rather than becoming a conventional brand
 * color. Brighter, silvery values create material separation with almost no
 * perceived elevation.
 * `backgroundInverse` enables the landing-to-documentation transition inside
 * this one theme; it is not a separate dark mode (a real dark *mode* for Pearl
 * is still pending — see docs/visual-language-brief.md).
 *
 * Radius/space/controlHeight (and fontWeight) come from the shared `scales` —
 * only color, fontFamily, and the type scale diverge for Pearl's editorial
 * identity (ADR-0006).
 */
const pearlText = {
  bodySm: { fontSize: '12px', lineHeight: '16px', fontWeight: '400' },
  bodyMd: { fontSize: '14px', lineHeight: '20px', fontWeight: '400' },
  bodyLg: { fontSize: '16px', lineHeight: '24px', fontWeight: '400' },
  headingSm: { fontSize: '20px', lineHeight: '24px', fontWeight: '600' },
  headingMd: { fontSize: '24px', lineHeight: '30px', fontWeight: '600' },
  headingLg: { fontSize: '36px', lineHeight: '40px', fontWeight: '600' },
  displaySm: { fontSize: '56px', lineHeight: '56px', fontWeight: '600' },
  displayLg: { fontSize: '96px', lineHeight: '88px', fontWeight: '600' },
};

const pearlFontFamily = {
  display: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  heading: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  body: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

export const pearlAubergineThemeClass = createTheme(vars, {
  color: {
    background: '#F1F2EF',
    surface: '#FAFAF7',
    overlay: 'rgba(21, 24, 25, 0.58)',
    backgroundInverse: '#151819',
    surfaceInverse: '#202020',

    text: '#202324',
    textSubtle: '#686D6C',
    textInverse: '#F4F3EF',
    textInverseSubtle: '#878985',

    border: '#D7D9D6',
    borderStrong: '#BFC2BF',
    borderSubtle: '#E6E7E3',
    borderInverse: '#393D3B',

    // Primary action is ink — the "quiet system, identity at the seams" idea
    // is expressed through `accent` alone (ADR-0006), not a second brand hue.
    accent: '#202324',
    accentHover: '#393D3B',
    accentSubtle: '#E6E8E5',
    onAccent: '#FAFAF7',
    focusRing: '#624C5D',

    positive: { surface: '#E5EFE9', border: '#AEC7B7', text: '#214D34', icon: '#39704D' },
    negative: { surface: '#F5E9E8', border: '#DDBBB7', text: '#7C2E29', icon: '#A9473E' },
    warn: { surface: '#F4EEE2', border: '#D9C59E', text: '#6B5120', icon: '#9A742B' },
    info: { surface: '#E8EEF0', border: '#B8C8CD', text: '#36535C', icon: '#527681' },
  },
  ...scales,
  fontFamily: pearlFontFamily,
  text: pearlText,
});

export const pearlThemeClass = createTheme(vars, {
  color: {
    background: '#ECEEEA',
    surface: '#FAFAF7',
    overlay: 'rgba(24, 26, 25, 0.56)',
    backgroundInverse: '#181A19',
    surfaceInverse: '#292B29',

    text: '#222422',
    textSubtle: '#6B6E69',
    textInverse: '#F1F2ED',
    textInverseSubtle: '#B7B9B3',

    border: '#C9CDC8',
    borderStrong: '#AEB3AD',
    borderSubtle: '#E1E3DF',
    borderInverse: '#434744',

    // Oyster-stone accent — the identity signal lives in the action color
    // itself here, still a single hue axis (ADR-0006).
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
  fontFamily: pearlFontFamily,
  text: pearlText,
});
