// Public entry point for the design system package.
// Components are re-exported here as they are built (Phase 2 onward).

// --- Theme contract & themes ---
export { vars } from './theme.css';
export { pearlLightThemeClass, pearlDarkThemeClass, pearlCapabilityClass, pearlCapabilities, pearlFonts } from './themes/pearl.css';
export { pearlAssignments } from './themes/pearl.assignment';
export { tahitianLightThemeClass, tahitianDarkThemeClass } from './themes/tahitian.css';
export { freshwaterLightThemeClass, freshwaterDarkThemeClass } from './themes/freshwater.css';
export { southSeaLightThemeClass, southSeaDarkThemeClass } from './themes/south-sea.css';

// --- Assignment layer (never becomes CSS) ---
export type {
  ThemeAssignments,
  CapabilityAssignment,
  Application,
  Surface,
  Trigger,
  UsageAxis,
  RoleAssignments,
} from './themes/assignment';

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
export { Input } from './components/Input';
export type { InputProps } from './components/Input';
export { Field } from './components/Field';
export type { FieldProps, FieldInjectedProps } from './components/Field';
export { Icon } from './components/Icon';
export type { IconProps } from './components/Icon';
export { ICON_LIBRARIES, ICON_LIBRARIES_BY_ID, findIconLibraries } from './components/Icon';
export type {
  IconLibrary,
  IconLibraryQuery,
  IconAesthetic,
  IconTreatment,
  IconPersonality,
} from './components/Icon';
export { Alert } from './components/Alert';
export type { AlertProps, AlertVariant } from './components/Alert';
