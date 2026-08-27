import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import { tag } from './Tag.css';

type TagVariants = NonNullable<RecipeVariants<typeof tag>>;
export type TagVariant = NonNullable<TagVariants['variant']>;

export interface TagProps extends HTMLAttributes<HTMLSpanElement> {
  /**
   * `neutral` for a plain categorical label; the sentiment variants (matching
   * Alert's naming) for a status label.
   * @default 'neutral'
   */
  variant?: TagVariant;
  children?: ReactNode;
}

/**
 * A static, non-interactive label — categorical (skills, topics, filters
 * shown as read-only) or status (state indicators). Not clickable and not
 * dismissable: an interactive or removable pill is a future `Chip`; a small
 * count/indicator appended to another element (avatar online-dot, cart
 * count) is a future `Badge`. All three are visually similar but distinct
 * by interaction model, not by size or shape.
 */
export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  ({ variant = 'neutral', className, children, ...rest }, ref) => {
    return (
      <span
        ref={ref}
        data-component="tag"
        className={clsx(tag({ variant }), className)}
        {...rest}
      >
        {children}
      </span>
    );
  },
);

Tag.displayName = 'Tag';
