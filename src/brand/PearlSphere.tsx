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
    <div className={css.sphereWrap}>
      <div className={css.contact} aria-hidden="true" />
      <div className={css.body} />
    </div>
  );
}
