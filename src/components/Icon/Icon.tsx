import { forwardRef } from 'react';
import type { SVGAttributes } from 'react';
import { clsx } from 'clsx';
import type { Icon as PhosphorIcon, IconWeight } from '@phosphor-icons/react';
import { icon } from './Icon.css';

export interface IconProps extends Omit<SVGAttributes<SVGSVGElement>, 'color'> {
  /** A Phosphor icon component, e.g. `Heart` from `@phosphor-icons/react`. */
  icon: PhosphorIcon;
  /**
   * Stroke/fill treatment. `duotone` recolors the icon's two layers with
   * `color.accent` (foreground) and `color.negative.icon` (faint background)
   * instead of Phosphor's default single-color-at-two-opacities rendering —
   * every theme supplies both tokens, so this isn't Pearl-specific, just
   * demonstrated there first.
   * @default 'regular'
   */
  weight?: IconWeight;
  /** Pixel size, forwarded to the underlying `<svg>`. @default 20 */
  size?: number;
}

/**
 * Renders `data-component="icon"` for the override contract (see
 * docs/override-patterns.md) and merges an optional `className`.
 */
export const Icon = forwardRef<SVGSVGElement, IconProps>(
  ({ icon: IconComponent, weight = 'regular', size = 20, className, ...rest }, ref) => {
    return (
      <IconComponent
        ref={ref}
        weight={weight}
        size={size}
        data-component="icon"
        className={clsx(icon, className)}
        {...rest}
      />
    );
  },
);

Icon.displayName = 'Icon';
