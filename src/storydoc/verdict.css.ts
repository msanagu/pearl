import { style, globalStyle } from '@vanilla-extract/css';
import { color, fontWeight, space } from '@tokens';

// The sanctioned override mechanism (see rationale/override-contract): reach
// a Card's own parts via data-component/data-part under a scoping class,
// through globalStyle — never a plain className fight with Card's own
// single-class styles. A compound selector like this outranks Card's base
// styles regardless of build order, per that same doc's own note.
//
// No wrapping component: each usage site composes real Card/Card.Header/
// Card.Body directly (see Row.usage.stories.tsx, Stack.usage.stories.tsx) —
// this file only supplies the two marker classes and what they reach into.
export const verdictDo = style({ borderColor: color.positive.border });
export const verdictDont = style({ borderColor: color.negative.border });

globalStyle(`${verdictDo} [data-part="header"]`, {
  display: 'flex',
  alignItems: 'center',
  gap: space.xs,
  fontWeight: fontWeight.semibold,
  background: color.positive.surface,
  color: color.positive.text,
  borderBottomColor: color.positive.border,
});

globalStyle(`${verdictDont} [data-part="header"]`, {
  display: 'flex',
  alignItems: 'center',
  gap: space.xs,
  fontWeight: fontWeight.semibold,
  background: color.negative.surface,
  color: color.negative.text,
  borderBottomColor: color.negative.border,
});
