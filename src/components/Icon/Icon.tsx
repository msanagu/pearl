import { forwardRef } from 'react';
import type { ComponentType, Ref, SVGAttributes } from 'react';
import { clsx } from 'clsx';
import type { IconBaseProps, IconType } from 'react-icons';
import { icon } from './Icon.css';

/**
 * `IconType` is a plain function component — `react-icons` never calls
 * `forwardRef`, so its props type has no `ref`. Under React 19 `ref` is an
 * ordinary prop, and `IconBase` spreads its rest props onto the `<svg>`, so a
 * ref does reach the element; only the upstream type disagrees. This is that
 * one disagreement, named and contained rather than cast at each use.
 *
 * Note this is React 19 behavior. Under React 18 the ref would be dropped with
 * a warning, which is worth knowing given the `react: >=18` peer range.
 */
type RefableIcon = ComponentType<IconBaseProps & { ref?: Ref<SVGSVGElement> }>;

export interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, 'color'> {
  /**
   * Any `react-icons` icon component, from any of its bundled sets — e.g.
   * `PiHeart` from `react-icons/pi` (Phosphor), `LuHeart` from `react-icons/lu`
   * (Lucide), `RiHeartLine` from `react-icons/ri` (Remix).
   *
   * `react-icons` normalizes every set to the same `IconType` signature, so
   * swapping the icon set a theme draws from is a matter of changing the
   * import — nothing here or in the override contract changes. See
   * `iconLibraries.ts` for which sets suit which aesthetic.
   */
  icon: IconType;
  /** Pixel size, forwarded to the underlying `<svg>`. @default 20 */
  size?: number;
}

/**
 * Renders `data-component="icon"` for the override contract (see
 * docs/override-patterns.md) and merges an optional `className`.
 *
 * There is no `weight` prop: `react-icons` encodes weight in the icon *name*
 * rather than as a prop, so a Phosphor weight that used to be
 * `<Icon icon={Heart} weight="duotone" />` is now `<Icon icon={PiHeartDuotone} />`.
 * That is a set-specific concept, and hoisting it into this component's API
 * would have made every non-Phosphor set carry a prop it cannot honor.
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ icon: iconComponent, size = 20, className, ...rest }, ref) => {
    const IconComponent = iconComponent as RefableIcon;
    return (
      <IconComponent
        ref={ref}
        size={size}
        data-component="icon"
        className={clsx(icon, className)}
        {...rest}
      />
    );
  },
);

Icon.displayName = 'Icon';
