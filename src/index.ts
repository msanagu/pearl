// Public entry point for the design system package.
// Components are re-exported here as they are built (Phase 2 onward).

// --- Theme contract & themes ---
export { vars } from './theme.css';
export { tahitianLightThemeClass, tahitianDarkThemeClass } from './themes/tahitian.css';
export { freshwaterLightThemeClass, freshwaterDarkThemeClass } from './themes/freshwater.css';
export { southSeaLightThemeClass, southSeaDarkThemeClass } from './themes/south-sea.css';

// --- Documented token layer (JSDoc wrapper) ---
export {
  color,
  radius,
  space,
  controlHeight,
  fontFamily,
  fontWeight,
  text,
} from './tokens';
export type {
  ColorTokens,
  SentimentTokens,
  RadiusTokens,
  SpaceTokens,
  ControlHeightTokens,
  FontFamilyTokens,
  FontWeightTokens,
  TextTokens,
  TextVariantTokens,
} from './tokens';

// --- Components ---
export { Button } from './components/Button';
export type { ButtonProps } from './components/Button';
export { Text } from './components/Text';
export type { TextProps } from './components/Text';
export { Stack } from './components/Stack';
export type { StackProps } from './components/Stack';
export { Row } from './components/Row';
export type { RowProps } from './components/Row';
export { Card } from './components/Card';
export type { CardProps } from './components/Card';
