// Theme-invariant scales shared by this brand's light and dark themes. Color is
// the only axis that changes between light and dark — radius, spacing, control
// height, weight, and type are identical, so they live here rather than being
// duplicated in every theme.
//
// A different *product* theme (e.g. a denser enterprise skin) may still override
// any of these; this is just the shared default for the default brand's pair.
// Primitive font stack (by classification). Only `sans` exists so far because
// it's all any role uses today; `serif` / `mono` stacks get added when a role
// or theme actually references them (build-what-you-need).
const sans =
  "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif";

export const scales = {
  // Semantic font roles → primitive stacks. Default: everything is `sans`; a
  // different theme can point display/heading at a serif stack for a
  // serif-headline, sans-body pairing.
  fontFamily: {
    display: sans,
    heading: sans,
    body: sans,
  },
  radius: {
    control: '6px',
    surface: '10px',
    full: '9999px',
  },
  space: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
  },
  controlHeight: {
    sm: '32px',
    md: '40px',
    lg: '48px',
    xl: '56px',
  },
  fontWeight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  text: {
    bodySm: { fontSize: '12px', lineHeight: '16px', fontWeight: '400' },
    bodyMd: { fontSize: '14px', lineHeight: '20px', fontWeight: '400' },
    bodyLg: { fontSize: '16px', lineHeight: '24px', fontWeight: '400' },
    headingSm: { fontSize: '20px', lineHeight: '24px', fontWeight: '600' },
    headingMd: { fontSize: '24px', lineHeight: '32px', fontWeight: '600' },
    headingLg: { fontSize: '32px', lineHeight: '40px', fontWeight: '600' },
    displaySm: { fontSize: '40px', lineHeight: '48px', fontWeight: '700' },
    displayLg: { fontSize: '56px', lineHeight: '64px', fontWeight: '700' },
  },
};
