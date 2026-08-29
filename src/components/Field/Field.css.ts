import { style } from '@vanilla-extract/css';
import { color, fontFamily, fontWeight, space, text } from '@tokens';

// Label, hint, and error carry NO left inset — they sit flush with the
// control's border box, which is also where a `Card.Header` heading and every
// other block in a card sits. One vertical rule for the whole form.
//
// Two insets were tried and both were wrong. Matching the control's *text*
// padding (16px) aligns the label to the value but breaks it away from the
// card's content edge. Matching the control's corner radius (12px) lands
// between the two, agreeing with neither — a 4px offset from the value reads as
// a bug rather than a decision. The control's own text is unavoidably indented
// because it is inside a box; nothing outside the box should imitate that.
export const field = style({
  display: 'flex',
  flexDirection: 'column',
  gap: space.xs,
});

export const label = style({
  fontFamily: fontFamily.body,
  fontSize: text.bodySm.fontSize,
  lineHeight: text.bodySm.lineHeight,
  fontWeight: fontWeight.medium,
  color: color.text,
});

// Neutral marker — carries no styling of its own. A theme's stylesheet
// (e.g. tahitian.css.ts) can target `${fieldMeta} ${label}` etc. to apply
// theme-specific label/hint/error treatment without other themes inheriting it.
export const fieldMeta = style({});

// A required mark reads as attention, not an error — reuses the same
// sentiment color as `error` but the label carries no `role="alert"`, so
// unlike a live error it never interrupts assistive tech on mount.
export const requiredMark = style({
  color: color.negative.text,
});

export const hint = style({
  fontFamily: fontFamily.body,
  fontSize: text.bodySm.fontSize,
  lineHeight: text.bodySm.lineHeight,
  color: color.textSubtle,
});

// Error needs its own sentiment color — Text's `prominence` prop only covers
// default/subtle — so it's plain spans, not `<Text>`.
//
// Split in three: `errorRow` is the `role="alert"` container (icon + message,
// so both are announced as one description — see aria-describedby wiring in
// Field.tsx), `errorIcon` and `errorText` style the two children. `alignItems:
// center` assumes a short, single-line message, matching every error string
// in this system today; a message that wraps would want `flex-start` instead
// so the icon sits at cap-height of the first line, not centered on the block.
export const errorRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: space.xs,
});

// Sized to bodySm's cap-height, not Icon's 20px default sized for standalone
// use — matches Alert's negative-sentiment icon (PiXCircleFill, color.negative.icon)
// so a field error and an Alert read as the same visual vocabulary. aria-hidden
// in Field.tsx: the icon carries no text a screen reader could read, and the
// row's own role="alert" is what gets announced.
export const errorIcon = style({
  flexShrink: 0,
  color: color.negative.icon,
});

export const errorText = style({
  fontFamily: fontFamily.body,
  fontSize: text.bodySm.fontSize,
  lineHeight: text.bodySm.lineHeight,
  color: color.negative.text,
});
