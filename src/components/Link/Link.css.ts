import { style } from '@vanilla-extract/css';
import { color } from '@tokens';

// Deliberately not a recipe: a Link has one look. The affordance table in
// docs/foundations/control-affordances.md defines a link as bare text carrying
// an underline — that IS the component, so there is no variant axis to open
// until a real second case (quiet nav links, inline-in-prose) turns up.
export const link = style({
  // `accent`, not `primary` — accent is the token reserved for quiet signal
  // (focus borders, underlines, hover); `primary` is the CTA fill and would
  // make every inline link shout at Button volume.
  color: color.accent,
  // Face, size, and weight all inherit. `fontFamily.body` is NOT set here:
  // a link is part of the sentence it sits in, and a theme that sets prose in
  // a serif (South Sea's roman/italic Zodiak) or a mono (Freshwater's Azeret)
  // would otherwise see every inline link drop out of the running text into
  // the UI face mid-line. Only `color` and the underline mark it — those are
  // the affordance; the typeface is the context's to decide.
  fontSize: 'inherit',
  lineHeight: 'inherit',
  fontWeight: 'inherit',
  textDecorationLine: 'underline',
  // The underline is the affordance, so it is drawn at rest and never removed
  // on hover — hover only confirms the pointer is on target (same rule as
  // Button's resting boundary in control-affordances.md).
  textDecorationThickness: '1px',
  // Clears descenders so the rule reads as an underline rather than striking
  // through the g/y/p tails. `from-font` is not used: most UI faces here do
  // not ship a metric, and the browser fallback varies between them.
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
      // The ring is the focus signal; without a radius it hugs the text box
      // squarely, which is what the rest of the system's focus rings do.
      borderRadius: '2px',
    },
  },
  '@media': {
    '(prefers-reduced-motion: reduce)': { transition: 'none' },
  },
});
