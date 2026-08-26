import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { PiXBold } from 'react-icons/pi';
import { Icon } from '../Icon/Icon';
import { dismissButton } from './DismissButton.css';

export interface DismissButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Accessible name — override per context (e.g. "Dismiss notification"). @default 'Dismiss' */
  'aria-label'?: string;
}

/**
 * Internal close/dismiss affordance shared by `Alert` and (later) `Toast` —
 * not exported from the package root, same pattern as `layout/FlexBox`.
 */
export const DismissButton = forwardRef<HTMLButtonElement, DismissButtonProps>(
  ({ className, 'aria-label': ariaLabel = 'Dismiss', type = 'button', ...rest }, ref) => {
    return (
      <button
        ref={ref}
        type={type}
        aria-label={ariaLabel}
        className={clsx(dismissButton, className)}
        {...rest}
      >
        <Icon icon={PiXBold} size={16} style={{ color: 'inherit' }} />
      </button>
    );
  },
);

DismissButton.displayName = 'DismissButton';
