import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import type { RecipeVariants } from '@vanilla-extract/recipes';
import { input } from './Input.css';

type InputVariants = NonNullable<RecipeVariants<typeof input>>;

// Omit native `size` (a number attribute) — ours is the control-height variant.
export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>,
    InputVariants {}

/**
 * A token-styled native `<input>`. Pairs with `Field`, which supplies the
 * `id` / `aria-describedby` / `aria-invalid` wiring via render-prop.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ size, className, type = 'text', ...rest }, ref) => (
    <input
      ref={ref}
      type={type}
      data-component="input"
      className={clsx(input({ size }), className)}
      {...rest}
    />
  ),
);

Input.displayName = 'Input';
