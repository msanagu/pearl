import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';
import { text, type TextTokens } from '../../tokens';
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
        size?: never;
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
        /**
         * Escape hatch to override just the size step a role renders at —
         * the role's face/weight/case/tracking still comes from the theme's
         * `[data-role]` CSS; only font-size/line-height are swapped in. Only
         * canon type-scale steps are valid (never a raw size), so an
         * oversized `dataDigits` moment still rides the same scale as
         * everything else.
         * @default undefined — the role's own declared size, or ambient.
         */
        size?: TextVariant;
      }
  );

/**
 * Token-driven typography with visual variant and semantic element decoupled.
 *
 * @example
 * <Text variant="headingLg" as="h1">Page Title</Text>
 * <Text variant="bodyMd" as="h2">Structurally an h2, visually restrained</Text>
 * <Text role="preheading">Plate 01 / Nacre</Text>
 */
export function Text({
  variant,
  role,
  size,
  as: Component = 'span',
  prominence = 'default',
  className,
  style,
  children,
  ...rest
}: TextProps) {
  // `role` supplies its own sizing via theme CSS (`[data-role]`) only when the
  // theme's assignment declares one (e.g. Pearl's `preheading`). A role with
  // no declared size (Pearl's `inlineEmphasis`) inherits ambient size instead
  // of being forced to `bodyMd` — so no variant class is applied on that path.
  const resolvedVariant = role ? undefined : (variant ?? 'bodyMd');

  // `size` overrides only font-size/line-height via inline style (highest
  // specificity), deliberately not the variant class — a variant class also
  // carries fontFamily/fontWeight/letterSpacing, which would fight the
  // role's own face/weight/case CSS instead of just resizing it.
  const sizeStyle = role && size ? { fontSize: text[size].fontSize, lineHeight: text[size].lineHeight } : undefined;

  return (
    <Component
      className={clsx(textRecipe({ variant: resolvedVariant, prominence }), className)}
      data-role={role}
      style={sizeStyle ? { ...sizeStyle, ...style } : style}
      {...rest}
    >
      {children}
    </Component>
  );
}
