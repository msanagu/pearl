import { useId } from 'react';
import type { ReactNode } from 'react';
import type { IconType } from 'react-icons';
import { Icon } from '@components/Icon/Icon';
import { useThemeIconSet } from '@components/Icon/ThemeIconProvider';
import {
  field,
  fieldMeta,
  label as labelClass,
  requiredMark,
  hint as hintClass,
  errorRow,
  errorIcon as errorIconClass,
  errorText,
} from './Field.css';

export interface FieldInjectedProps {
  id: string;
  'aria-describedby': string | undefined;
  'aria-invalid': boolean;
  /**
   * Present (and `true`) only when `Field`'s `required` prop is set — omitted
   * entirely rather than `false`, so an optional field never puts `required`
   * or `aria-required` on the DOM at all instead of writing out `false`.
   */
  required?: true;
  'aria-required'?: true;
}

export interface FieldProps {
  label: string;
  /**
   * Marks the field mandatory: a `*` renders after the label, and `required`
   * plus `aria-required` are injected onto the control so the browser's own
   * constraint validation and assistive tech both pick it up. The mark is
   * `aria-hidden` — the control's own `required`/`aria-required` is what
   * announces it, so the mark stays purely visual and nothing is announced
   * twice.
   */
  required?: boolean;
  hint?: string;
  error?: string;
  /** Overrides the active theme's error icon for this Field only. */
  errorIcon?: IconType;
  children: (injectedProps: FieldInjectedProps) => ReactNode;
}

/**
 * Label/hint/error coordination for an arbitrary input. Hands off a shared
 * `id` / `aria-describedby` / `aria-invalid` via children-as-function rather
 * than `cloneElement`. Field never imports `Input`; any element
 * accepting `FieldInjectedProps` works.
 */
export function Field({
  label,
  required,
  hint,
  error,
  errorIcon,
  children,
}: FieldProps) {
  const inputId = useId();
  const { warn } = useThemeIconSet();
  const ErrorIcon = errorIcon ?? warn;
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div data-component="field" className={`${field} ${fieldMeta}`}>
      <label
        htmlFor={inputId}
        data-component="field"
        data-part="label"
        className={labelClass}
      >
        {label}
        {required && (
          <span className={requiredMark} aria-hidden="true">
            {' '}
            *
          </span>
        )}
      </label>

      {children({
        id: inputId,
        'aria-describedby': describedBy,
        'aria-invalid': Boolean(error),
        ...(required && { required: true, 'aria-required': true }),
      })}

      {hint && (
        <span
          id={hintId}
          data-component="field"
          data-part="hint"
          className={hintClass}
        >
          {hint}
        </span>
      )}
      {error && (
        <span
          id={errorId}
          role="alert"
          data-component="field"
          data-part="error"
          className={errorRow}
        >
          <Icon
            icon={ErrorIcon}
            size={14}
            className={errorIconClass}
            aria-hidden="true"
          />
          <span className={errorText}>{error}</span>
        </span>
      )}
    </div>
  );
}
