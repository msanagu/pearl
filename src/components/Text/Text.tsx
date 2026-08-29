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
  /**
   * Caps line length for readability — a `max-width` in `ch`, sized from the
   * 45–75 character band (`sm` ≈ 49 chars, `md` ≈ 63, `lg` ≈ 77; see the
   * derivation on `measure` in `Text.css.ts`).
   *
   * Deliberately **opt-in and independent of `as`**. Measure is a property of
   * running prose, not of the element: a `<p>` is just as often a one-line form
   * hint or a table cell, where a cap is wrong. Reach for it when the text is a
   * paragraph someone reads, and leave it off otherwise.
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
  // A role with no explicit `typeScale` inherits ambient size (Pearl's
  // `inlineEmphasis` rides whatever scale it's set in) rather than being
  // forced to `bodyMd`. Plain `<Text>` with neither still reads as bodyMd.
  const resolvedTypeScale = typeScale ?? (role ? undefined : 'bodyMd');

  return (
    <Component
      className={clsx(textRecipe({ typeScale: resolvedTypeScale, prominence, weight, measure }), className)}
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
