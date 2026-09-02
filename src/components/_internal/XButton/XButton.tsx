import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import type { IconType } from 'react-icons';
import { clsx } from 'clsx';
import { Icon } from '@components/Icon/Icon';
import { useThemeIconSet } from '@components/Icon/ThemeIconProvider';
import { xButton } from './XButton.css';

export interface XButtonProps extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'children'
> {
  /** Accessible name — always override per context (e.g. "Dismiss notification",
   * "Close", "Remove Storybook"). @default 'Close' */
  'aria-label'?: string;
  /** Overrides the active theme's close icon for this XButton only. */
  icon?: IconType;
}

/**
 * Internal X-icon affordance shared by `Alert` and (later) `Toast`/`Modal`/
 * `Chip` — not exported from the package root, same pattern as
 * `_internal/FlexBox`. Named for the glyph it renders, not for any one
 * consumer's meaning: this button doesn't know whether clicking it dismisses,
 * closes, or removes something — that's entirely the caller's `aria-label`
 * and `onClick` handler (dismiss/close/remove are real, different actions,
 * not synonyms — coupling test for the reasoning).
 */
export const XButton = forwardRef<HTMLButtonElement, XButtonProps>(
  (
    { className, 'aria-label': ariaLabel = 'Close', icon, type = 'button', ...rest },
    ref,
  ) => {
    const { close } = useThemeIconSet();
    return (
      <button
        ref={ref}
        type={type}
        aria-label={ariaLabel}
        className={clsx(xButton, className)}
        {...rest}
      >
        <Icon icon={icon ?? close} size={16} style={{ color: 'inherit' }} />
      </button>
    );
  },
);

XButton.displayName = 'XButton';
