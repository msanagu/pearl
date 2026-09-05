/**
 * Type-only augmentation for CSS properties `csstype` (3.2.3) doesn't know yet.
 * No `corner-shape` entry, so vanilla-extract's `StyleRule` rejects it at
 * compile time — runtime is fine, unsupported browsers just paint the plain
 * `border-radius` underneath. Delete once `csstype` ships the property.
 */
// `export {}` makes this a module augmentation, not a shadowing ambient
// declaration. Only resolves because `csstype` is a direct devDependency.
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
