/**
 * Type-only augmentation for CSS properties that `csstype` does not yet know.
 *
 * `csstype` (3.2.3, the latest published version at the time of writing) has no
 * entry for `corner-shape`, so vanilla-extract's `StyleRule` — which derives its
 * property list from `csstype` — rejects it at compile time. Nothing is wrong at
 * runtime: vanilla-extract emits whatever property it is handed, and browsers
 * that do not support `corner-shape` ignore the declaration and paint the plain
 * `border-radius` underneath it. This file only closes the typing gap.
 *
 * Delete the entry once `csstype` ships the property, rather than leaving a
 * permanent local override of an upstream type.
 */
// `export {}` makes this file a module, which is what turns the block below
// into a module *augmentation* rather than a new ambient module declaration
// that would shadow the real package. (The augmentation also only resolves
// because `csstype` is a direct devDependency — pnpm does not hoist it as a
// transitive one, and an unresolvable specifier fails silently here.)
export {};

declare module 'csstype' {
  interface Properties<TLength = (string & {}) | 0, TTime = string & {}> {
    /**
     * CSS Backgrounds & Borders 4. Reshapes the corners that `border-radius`
     * carves — `squircle`, `bevel`, `scoop`, `notch`, `round`, or a
     * `superellipse()`. Requires a non-zero `border-radius` to have any effect.
     */
    cornerShape?: string;
  }
}
