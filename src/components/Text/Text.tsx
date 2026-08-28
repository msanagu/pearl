import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';
import type { TextTokens } from '../../tokens';
import type { TypographyRole } from '../../themes/roles';
import { textRecipe } from './Text.css';

type TypeScale = keyof TextTokens;
type TextRole = TypographyRole;
type FontWeight = 'regular' | 'medium' | 'semibold' | 'bold';

export interface TextProps extends Omit<HTMLAttributes<HTMLElement>, 'color'> {
  /**
   * Semantic element — chosen **independently** of `typeScale`/`role`. Drive
   * this by document structure (don't skip heading levels), never by how
   * large the text needs to look (typography.md / markup-philosophy.md).
   * @default 'span'
   */
  as?: ElementType;
  /**
   * Size band — fontSize + lineHeight + tracking for this scale step, and
   * the *default* face when no `role` is set. Names a size, not a mandate:
   * pairing `typeScale="headingLg"` with a `role` that overrides face isn't
   * a contradiction, the same way rendering `headingLg` as an `h2` via `as`
   * isn't (typography.md, "Decoupling").
   * @default 'bodyMd'
   */
  typeScale?: TypeScale;
  /**
   * A theme-owned face treatment (font family, and per-theme case/tracking) —
   * independent of `typeScale`. Resolved per-theme via CSS (`[data-role]`),
   * never read from the role record at runtime — roles hold intent, not
   * style (see `themes/roles.ts`). A role with no size of
   * its own opinion — i.e. no `typeScale` passed alongside it — inherits the
   * ambient font-size from its surrounding context rather than being forced
   * to `bodyMd`.
   */
  role?: TextRole;
  /** Overrides the scale step's default weight. */
  weight?: FontWeight;
  /** Color prominence. `subtle` for secondary/metadata text. @default 'default' */
  prominence?: 'default' | 'subtle';
  className?: string;
  children?: ReactNode;
}

/**
 * Token-driven typography. `typeScale` (size), `role` (face), `as` (element),
 * and `weight` are four independent axes — combine any of them.
 */
export function Text({
  typeScale,
  role,
  weight,
  as: Component = 'span',
  prominence = 'default',
  className,
  style,
  children,
  ...rest
}: TextProps) {
  // A role with no explicit `typeScale` inherits ambient size (Pearl's
  // `inlineEmphasis` rides whatever scale it's set in) rather than being
  // forced to `bodyMd`. Plain `<Text>` with neither still reads as bodyMd.
  const resolvedTypeScale = typeScale ?? (role ? undefined : 'bodyMd');

  return (
    <Component
      className={clsx(textRecipe({ typeScale: resolvedTypeScale, prominence, weight }), className)}
      data-role={role}
      data-type-scale={resolvedTypeScale}
      style={style}
      {...rest}
    >
      {children}
    </Component>
  );
}
