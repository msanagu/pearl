// Public entry point for the design system package.
// Components are re-exported here as they ship (Phase 2 onward).
//
// Naming: "Pearl" names both the system and one of its themes, so exports
// disambiguate by position, not word.
// - DS-level symbols are unprefixed: `vars`, `color`, `radius`, `space`, `Button`, `Text`.
// - Theme-level symbols carry their theme's name: `pearlLightThemeClass`,
//   `pearlExtensionClass`, `tahitianExtensionClass`. `pearl*` always means
//   Pearl-the-theme, never the system.
// Prefixes stay because classes concatenate
// (`${pearlLightThemeClass} ${pearlExtensionClass}`) — a shared stem makes a
// mispaired theme/extension visible on sight, otherwise silent. See tahitian.css.ts.

// --- Theme contract & themes ---
export { vars } from './theme.css';
export {
  pearlLightThemeClass,
  pearlDarkThemeClass,
  pearlExtensionClass,
  pearlTreatments,
  pearlFonts,
} from './themes/pearl/pearl.css';
export { pearlDescription, pearlRoles } from './themes/pearl/pearl.roles';
export {
  tahitianLightThemeClass,
  tahitianDarkThemeClass,
  tahitianExtensionClass,
  tahitianTreatments,
  tahitianFonts,
  tahitianPearlColors,
  overtonePlate,
} from './themes/tahitian/tahitian.css';
export {
  tahitianDescription,
  tahitianRoles,
} from './themes/tahitian/tahitian.roles';
export {
  freshwaterLightThemeClass,
  freshwaterDarkThemeClass,
} from './themes/freshwater/freshwater.css';
export {
  southSeaLightThemeClass,
  southSeaDarkThemeClass,
} from './themes/south-sea/south-sea.css';

// --- Role layer (never becomes CSS) ---
export type {
  ThemeRoles,
  RoleSpec,
  Surface,
  Trigger,
  Chroma,
  TypographyRole,
} from './themes/roles';

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
export type { CardProps, CardPadding } from './components/Card';
export { Input } from './components/Input';
export type { InputProps } from './components/Input';
export { Field } from './components/Field';
export type { FieldProps, FieldInjectedProps } from './components/Field';
export { Icon } from './components/Icon';
export type { IconProps } from './components/Icon';
export { ICON_LIBRARIES, ICON_LIBRARIES_BY_ID } from './components/Icon';
export type { IconLibrary, IconTreatment } from './components/Icon';
export {
  THEME_ICON_SETS,
  DEFAULT_THEME_ICON_SET,
  ThemeIconProvider,
  useThemeIconSet,
  useThemeName,
} from './components/Icon';
export type {
  ThemeIconSet,
  ThemeName,
  ThemeIconProviderProps,
} from './components/Icon';
export { Alert } from './components/Alert';
export type { AlertProps, AlertVariant } from './components/Alert';
export { Tag } from './components/Tag';
export type { TagProps, TagVariant } from './components/Tag';
export { Skeleton } from './components/Skeleton';
export type {
  SkeletonProps,
  SkeletonVariant,
  SkeletonTypeScale,
} from './components/Skeleton';
export { Link } from './components/Link';
export type { LinkProps } from './components/Link';
