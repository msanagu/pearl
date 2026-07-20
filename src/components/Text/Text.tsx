import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';
import type { TextTokens } from '../../tokens';
import type { TypographyRoles } from '../../themes/assignment';
import { textRecipe } from './Text.css';

type TextVariant = keyof TextTokens;
type TextRole = keyof TypographyRoles;

interface TextBaseProps extends Omit<HTMLAttributes<HTMLElement>, 'color'> {
  /**
   * Semantic element — chosen **independently** of `variant`/`role`. Drive
   * this by document structure (don't skip heading levels), never by how
   * large the text needs to look (typography.md / markup-philosophy.md).
   * @default 'span'
   */
  as?: ElementType;
  /** Color prominence. `subtle` for secondary/metadata text. @default 'default' */
  prominence?: 'default' | 'subtle';
  className?: string;
  children?: ReactNode;
}

export type TextProps = TextBaseProps &
  (
    | {
        /**
         * Type-scale step (size + line-height + default weight). Canon,
         * theme-agnostic — the same `headingLg` looks the same size/rhythm in
         * every theme.
         * @default 'bodyMd'
         */
        variant?: TextVariant;
        role?: never;
      }
    | {
        /**
         * A theme-owned typographic job — the whole treatment (size, weight,
         * face, style, case, tracking) as one bundle, not a modifier layered
         * on top of `variant`. Mutually exclusive with `variant`: a role
         * *is* a complete scale-step + face pairing, not a face swapped onto
         * whichever step the caller picked.
         *
         * Resolved per-theme via CSS (`[data-role]`), never read from the
         * assignment record at runtime — assignments are intent, not style
         * (see `themes/assignment.ts`). A theme with no assignment for this
         * role — or a role with no declared `size` — inherits the ambient
         * font-size/family from its surrounding context rather than being
         * forced to a default variant.
         */
        role: TextRole;
        variant?: never;
      }
  );

/**
 * Token-driven typography with visual variant and semantic element decoupled.
 *
 * @example
 * <Text variant="headingLg" as="h1">Page Title</Text>
 * <Text variant="bodyMd" as="h2">Structurally an h2, visually restrained</Text>
 * <Text role="label">Plate 01 / Nacre</Text>
 */
export function Text({
  variant,
  role,
  as: Component = 'span',
  prominence = 'default',
  className,
  style,
  children,
  ...rest
}: TextProps) {
  // `role` supplies its own sizing via theme CSS (`[data-role]`) only when the
  // theme's assignment declares one (e.g. Pearl's `label`). A role with no
  // declared size (Pearl's `inlineEmphasis`) inherits ambient size instead of
  // being forced to `bodyMd` — so no variant class is applied on that path.
  const resolvedVariant = role ? undefined : (variant ?? 'bodyMd');

  return (
    <Component
      className={clsx(textRecipe({ variant: resolvedVariant, prominence }), className)}
      data-role={role}
      style={style}
      {...rest}
    >
      {children}
    </Component>
  );
}
