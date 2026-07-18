import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';
import { fontWeight } from '../../tokens';
import type { FontWeightTokens, TextTokens } from '../../tokens';
import { textRecipe } from './Text.css';

type TextVariant = keyof TextTokens;
type FontWeight = keyof FontWeightTokens;

export interface TextProps extends Omit<HTMLAttributes<HTMLElement>, 'color'> {
  /**
   * Type-scale step (size + line-height + default weight).
   * @default 'bodyMd'
   */
  variant?: TextVariant;
  /**
   * Semantic element — chosen **independently** of `variant`. Drive this by
   * document structure (don't skip heading levels), never by how large the text
   * needs to look (typography.md / markup-philosophy.md).
   * @default 'span'
   */
  as?: ElementType;
  /** Optional weight override on top of the variant's default. */
  weight?: FontWeight;
  /** Color tone. `subtle` for secondary/metadata text. @default 'default' */
  tone?: 'default' | 'subtle';
  className?: string;
  children?: ReactNode;
}

/**
 * Token-driven typography with visual variant and semantic element decoupled.
 *
 * @example
 * <Text variant="headingLg" as="h1">Page Title</Text>
 * <Text variant="bodyMd" as="h2">Structurally an h2, visually restrained</Text>
 */
export function Text({
  variant = 'bodyMd',
  as: Component = 'span',
  weight,
  tone = 'default',
  className,
  style,
  children,
  ...rest
}: TextProps) {
  const weightStyle: CSSProperties | undefined = weight
    ? { fontWeight: fontWeight[weight] }
    : undefined;

  return (
    <Component
      className={clsx(textRecipe({ variant, tone }), className)}
      style={{ ...weightStyle, ...style }}
      {...rest}
    >
      {children}
    </Component>
  );
}
