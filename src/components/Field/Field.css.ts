import { style } from '@vanilla-extract/css';
import { color, fontFamily, fontWeight, space, text } from '@tokens';

// Label, hint, error carry no left inset — flush with the control's border
// box, same edge as a Card.Header heading and every other block in a card.
// Matching the control's text padding or corner radius both tried and wrong:
// either breaks from the card's content edge or lands at an offset that
// reads as a bug, not a decision.
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

// Neutral marker — no styling of its own. A theme (e.g. tahitian.css.ts) can
// target `${fieldMeta} ${label}` for theme-specific treatment without others inheriting it.
export const fieldMeta = style({});

// Reads as attention, not error — reuses error's sentiment color, but the
// label carries no role="alert" so it never interrupts assistive tech.
export const requiredMark = style({
  color: color.negative.text,
});

export const hint = style({
  fontFamily: fontFamily.body,
  fontSize: text.bodySm.fontSize,
  lineHeight: text.bodySm.lineHeight,
  color: color.textSubtle,
});

// Error needs its own sentiment color — Text's `prominence` only covers
// default/subtle — so plain spans, not <Text>.
//
// Split in three: errorRow is the role="alert" container (icon + message,
// announced as one description — see aria-describedby in Field.tsx),
// errorIconLayout/errorText style the two children. alignItems: center
// assumes a short single-line message; a wrapping one would want flex-start
// instead so the icon sits at cap-height, not centered on the block.
export const errorRow = style({
  display: 'flex',
  alignItems: 'center',
  gap: space.xs,
});

// Sized to bodySm's cap-height, not Icon's 20px standalone default — matches
// Alert's negative-sentiment icon so field error and Alert share vocabulary.
// aria-hidden in Field.tsx: row's own role="alert" is what gets announced.
//
// Layout only — color is Icon.css's negativeIcon.
export const errorIconLayout = style({
  flexShrink: 0,
});

export const errorText = style({
  fontFamily: fontFamily.body,
  fontSize: text.bodySm.fontSize,
  lineHeight: text.bodySm.lineHeight,
  color: color.negative.text,
});
