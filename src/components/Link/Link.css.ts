import { style } from '@vanilla-extract/css';
import { color } from '@tokens';

// Deliberately not a recipe: a Link has one look per
// docs/foundations/control-affordances.md — bare text with an underline —
// no variant axis until a real second case turns up.
export const link = style({
  // accent, not primary — primary is the CTA fill and would make every
  // inline link shout at Button volume.
  color: color.accent,
  // Face/size/weight inherit; fontFamily.body is NOT set — a link is part of
  // its sentence, so a serif or mono theme's prose face carries through.
  fontSize: 'inherit',
  lineHeight: 'inherit',
  fontWeight: 'inherit',
  textDecorationLine: 'underline',
  // Underline is the affordance, drawn at rest and never removed on hover —
  // hover only confirms the pointer is on target.
  textDecorationThickness: '1px',
  // Clears descenders so the rule reads as underline, not strikethrough.
  // from-font not used: most UI faces here ship no metric.
  textUnderlineOffset: '0.15em',
  cursor: 'pointer',
  transition: 'color 200ms ease, text-decoration-thickness 200ms ease',
  selectors: {
    '&:hover': {
      color: color.accentHover,
      textDecorationThickness: '2px',
    },
    '&:focus-visible': {
      outline: `2px solid ${color.focusRing}`,
      outlineOffset: '2px',
      // Rings hug the text box squarely, matching the rest of the system.
      borderRadius: '2px',
    },
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': { transition: 'none' },
  },
});
