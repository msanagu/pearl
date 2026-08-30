import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';
import type { TextTokens } from '@tokens';
import type { TypographyRole } from '@themes/roles';
import { textRecipe } from './Text.css';

type TypeScale = keyof TextTokens;
type TextRole = TypographyRole;
type FontWeight = 'regular' | 'medium' | 'semibold' | 'bold';
type Measure = 'sm' | 'md' | 'lg';

export interface TextProps extends Omit<HTMLAttributes<HTMLElement>, 'color'> {
  /**
   * Semantic element — chosen independently of `typeScale`/`role`, driven by
   * document structure (don't skip heading levels), never by visual size.
   * @default 'span'
   */
  as?: ElementType;
  /**
   * Size band — fontSize + lineHeight + tracking for this step, and the default
   * face when no `role` is set. Names a size, not a mandate: `headingLg` can
   * pair with a face-overriding `role`, or render as an `h2` via `as`.
   * @default 'bodyMd'
   */
  typeScale?: TypeScale;
  /**
   * A theme-owned face treatment (font family, per-theme case/tracking),
   * independent of `typeScale`. Resolved per-theme via CSS (`[data-role]`),
   * never from the role record at runtime. A role with no `typeScale` passed
   * alongside it inherits the ambient font-size rather than snapping to `bodyMd`.
   */
  role?: TextRole;
  /** Overrides the scale step's default weight. */
  weight?: FontWeight;
  /** Color prominence. `subtle` for secondary/metadata text. @default 'default' */
  prominence?: 'default' | 'subtle';
  /**
   * Caps line length — a `max-width` in `ch` from the 45–75 character band
   * (`sm` ≈ 49, `md` ≈ 63, `lg` ≈ 77). Opt-in and independent of `as`: measure
   * belongs to running prose, not to a `<p>` that's a one-line form hint.
   */
  measure?: Measure;
  className?: string;
  children?: ReactNode;
}

/**
 * Token-driven typography. `typeScale` (size), `role` (face), `as` (element),
 * and `weight` are four independent axes — combine any of them. `measure`
 * (prose line-length cap) is a fifth, opt-in axis.
 */
export function Text({
  typeScale,
  role,
  weight,
  as: Component = 'span',
  prominence = 'default',
  measure,
  className,
  style,
  children,
  ...rest
}: TextProps) {
  // A role with no explicit `typeScale` inherits ambient size; plain `<Text>`
  // with neither still reads as `bodyMd`.
  const resolvedTypeScale = typeScale ?? (role ? undefined : 'bodyMd');

  return (
    <Component
      className={clsx(
        textRecipe({
          typeScale: resolvedTypeScale,
          prominence,
          weight,
          measure,
        }),
        className,
      )}
      data-role={role}
      data-type-scale={resolvedTypeScale}
      data-measure={measure}
      style={style}
      {...rest}
    >
      {children}
    </Component>
  );
}
