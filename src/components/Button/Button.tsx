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
   * Button content. Compose an `Icon` alongside text directly as children —
   * Button lays both out via internal flex + a token gap, so icon-before-text
   * and text-before-icon both work with no `icon`/`iconPosition` prop.
   */
  children?: ReactNode;
}

/**
 * A native `<button>` with token-driven variants. Renders `data-component="button"`
 * and `data-variant` for the downstream override contract (see
 * docs/foundations/override-patterns.md) and merges an optional `className`
 * for single-instance overrides.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant, className, children, type = 'button', ...rest }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        data-component="button"
        data-variant={variant ?? 'primary'}
        className={clsx(button({ variant }), className)}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
