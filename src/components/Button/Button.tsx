import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import { button } from './Button.css';

type ButtonVariants = NonNullable<RecipeVariants<typeof button>>;

export interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>,
    ButtonVariants {
  /**
   * Visual style. `primary` for the main call-to-action per surface,
   * `secondary` for supporting actions.
   * @default 'primary'
   */
  variant?: ButtonVariants['variant'];
  /**
   * Height, lands on the 8px grid (32/40/48) to align with Field inputs.
   * @default 'md'
   */
  size?: ButtonVariants['size'];
  /**
   * Button content. Compose an `Icon` alongside text directly as children —
   * Button lays both out via internal flex + a token gap, so icon-before-text
   * and text-before-icon both work with no `icon`/`iconPosition` prop.
   */
  children?: ReactNode;
}

/**
 * A native `<button>` with token-driven variants. Renders `data-component="button"`
 * for the downstream override contract (see docs/override-patterns.md) and merges
 * an optional `className` for single-instance overrides.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, size, className, children, type = 'button', ...rest }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        data-component="button"
        className={clsx(button({ variant, size }), className)}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
