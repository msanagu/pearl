import { radius } from '@tokens';

/**
 * The radius a padded surface should carry to stay concentric with whatever
 * sits inside it: **outer = inner + gap**.
 *
 * A control inside a surface is held off the surface's edge by that surface's
 * padding. The two arcs stay parallel only if the outer radius exceeds the
 * inner one by exactly that gap — any other pairing makes the curves converge
 * or diverge, which reads as sloppy at small sizes and as a mistake at large
 * ones.
 *
 * The inner radius is always `radius.control`, because that is what every
 * nested Button, Input, and Tag uses. The gap is the surface's **own** padding,
 * so it is passed in rather than assumed: a Card at `padding="md"` and a Card at
 * `padding="xl"` are different shapes, and correctly so.
 *
 * `radius.nesting` is the per-theme opt-out (`'1'` / `'0'`). A hard-edged theme
 * sets `'0'`, the gap term zeroes out, and every surface collapses to its
 * `control` (`0px`) — square through the same expression, with no branching at
 * any call site. Without it, `calc(0px + 24px)` would hand a square theme a
 * 24px-rounded card, which is precisely backwards.
 *
 * ## Scope
 *
 * This is correct for a **control inside a surface**, which is the case the
 * system actually has. It is NOT correct for a surface inside a surface:
 * additive derivation over-produces, and one level deeper goes negative.
 * Nothing nests padded surfaces today; if that changes, the fix is a
 * subtractive cascade, not a bigger formula.
 *
 * ## Why this is not a token
 *
 * There is no `radius.surface`. A surface's radius is not authored — it is a
 * function of the theme's one corner and that surface's own padding, so a token
 * could only ever be right for a single padding value. The contract holds the
 * inputs (`control`) and the policy (`nesting`, `cornerShape`); the arithmetic
 * belongs to whoever knows the padding, which is the component.
 */
export function concentricRadius(padding: string): string {
  return `calc(${radius.control} + ${radius.nesting} * ${padding})`;
}
