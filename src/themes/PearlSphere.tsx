import * as css from './PearlSphere.css';

/**
 * Pearl's brand object — nacre made literal. `{ on: 'brandObject', trigger:
 * 'ambient' }` in pearl.assignment.ts: the one surface allowed to animate at
 * rest (everything else, e.g. `Card`, only drifts on hover). Reads
 * `pearlCapabilities.luster` directly — this is bespoke brand artwork, not a
 * themeable canon component, so unlike `Card` it has no obligation to render
 * meaningfully under any other theme.
 */
export function PearlSphere() {
  return (
    // Bespoke brand artwork: the nacre sheen is a deliberate soft-light gradient
    // and the body clips it to stay spherical. Impeccable reads those as a
    // "cyan gradient" (`ai-color-palette`) and a clipped positioned child
    // (`clipped-overflow-container`) — false positives on decorative art, so
    // this element carries an explicit, narrowly-scoped allowlist for exactly
    // those two rules (see src/test/impeccablePlay.ts). Nothing else is exempt.
    <div
      className={css.sphereWrap}
      data-impeccable-allow="ai-color-palette clipped-overflow-container"
    >
      <div className={css.contact} aria-hidden="true" />
      <div className={css.body}>
        <div className={css.sheen} />
      </div>
    </div>
  );
}
