import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { input } from './Input.css';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

/**
 * A token-styled native `<input>`. Pairs with `Field`, which supplies the
 * `id` / `aria-describedby` / `aria-invalid` wiring via render-prop.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = 'text', ...rest }, ref) => (
    <input
      ref={ref}
      type={type}
      data-component="input"
      className={clsx(input, className)}
      {...rest}
    />
  ),
);

Input.displayName = 'Input';
