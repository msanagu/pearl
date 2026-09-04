import { forwardRef } from 'react';
import type { ComponentType, Ref, SVGAttributes } from 'react';
import { clsx } from 'clsx';
import type { IconBaseProps, IconType } from 'react-icons';
import {
  icon,
  positiveIcon,
  negativeIcon,
  warnIcon,
  infoIcon,
  accentIcon,
} from './Icon.css';

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
   * Every set shares the same `IconType` signature, so swapping sets is a
   * matter of changing the import. `iconLibraries.ts` has notes on the sets
   * evaluated here. `react-icons` isn't required, either — any component
   * shaped `(props) => ReactNode` works; see README.md's "Icons aren't
   * locked in either".
   */
  icon: IconType;
  /**
   * Icon size. A `number` is px, snapped to the nearest 4px grid step and
   * rendered as its rem equivalent (16px root) — never raw px, so it scales
   * with the user's base font-size like the rest of the system's type and
   * spacing (see docs/foundations/spacing-system.md). A `string` is a raw
   * CSS length, passed through unchanged.
   * @default 20
   */
  size?: number | string;
}

const GRID_STEP = 4;
const REM_ROOT = 16;

/** Snaps px to the 4px grid, returns its rem string at a 16px root. */
function toGridRem(px: number): string {
  return `${(Math.round(px / GRID_STEP) * GRID_STEP) / REM_ROOT}rem`;
}

/**
 * Renders `data-component="icon"` for the override contract (see
 * docs/foundations/override-patterns.md) and merges an optional `className`.
 *
 * There is no `weight` prop: `react-icons` encodes weight in the icon name
 * (`PiHeartDuotone`, not `weight="duotone"`). That's set-specific, so hoisting
 * it into this API would make every non-Phosphor set carry a prop it can't honor.
 */
const IconImpl = forwardRef<SVGSVGElement, IconProps>(
  ({ icon: iconComponent, size = 20, className, ...rest }, ref) => {
    const IconComponent = iconComponent as RefableIcon;
    return (
      <IconComponent
        ref={ref}
        size={typeof size === 'number' ? toGridRem(size) : size}
        data-component="icon"
        className={clsx(icon, className)}
        {...rest}
      />
    );
  },
);

IconImpl.displayName = 'Icon';

// Static-property namespacing, like `Card.Header`/`Card.Body`.
export const Icon = Object.assign(IconImpl, {
  tone: {
    positive: positiveIcon,
    negative: negativeIcon,
    warn: warnIcon,
    info: infoIcon,
    accent: accentIcon,
  },
});
