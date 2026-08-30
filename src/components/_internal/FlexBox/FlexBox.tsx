import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import { flex } from './FlexBox.css';

type FlexVariants = NonNullable<RecipeVariants<typeof flex>>;

export interface FlexBoxProps
  extends HTMLAttributes<HTMLElement>, FlexVariants {
  /** The rendered element. Defaults to `div`. */
  as?: ElementType;
  noValidate?: boolean;
  className?: string;
  children?: ReactNode;
}

/**
 * Internal flex primitive shared by `Stack` and `Row`. Not exported from the
 * package root — consumers use `Stack`/`Row`, which fix `direction`.
 */
export function FlexBox({
  as: Component = 'div',
  direction,
  align,
  justify,
  wrap,
  gap,
  className,
  children,
  ...rest
}: FlexBoxProps) {
  return (
    <Component
      className={clsx(
        flex({ direction, align, justify, wrap, gap }),
        className,
      )}
      {...rest}
    >
      {children}
    </Component>
  );
}
