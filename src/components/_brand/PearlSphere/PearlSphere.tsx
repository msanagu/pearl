import * as css from './PearlSphere.css';

/**
 * Pearl's brand object — nacre made literal. The `brandSphere` role in
 * pearl.roles.ts (`{ on: 'brandObject', trigger: 'ambient' }`): the one
 * surface allowed to animate at rest (everything else, e.g. `Card`, only
 * drifts on hover). Reads
 * `pearlTreatments.luster` directly — this is bespoke brand artwork, not a
 * themeable canon component, so unlike `Card` it has no obligation to render
 * meaningfully under any other theme.
 */
export interface PearlSphereProps {
  /**
   * Play the mount reveal — the body blurs into focus instead of appearing
   * painted. For the one place it's a first impression (the hero); everywhere
   * else the sphere renders at rest. @default false
   */
  reveal?: boolean;
}

export function PearlSphere({ reveal = false }: PearlSphereProps = {}) {
  return (
    // `ai-color-palette` is allowlisted here, and only here. The detector reads
    // gradient stops without their alpha, so luster's `seaGreen`
    // (`rgba(158, 214, 196, 0.38)`, hue 160.7deg) scores as a cyan gradient
    // despite never rendering as one over the pale nacre body. Scoped to this
    // subtree and this one rule — every other finding still gates.
    <div className={css.sphereWrap} data-impeccable-allow="ai-color-palette">
      <div className={css.contact} aria-hidden="true" />
      <div className={reveal ? `${css.body} ${css.revealBody}` : css.body} />
    </div>
  );
}
