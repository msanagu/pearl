import { useId } from 'react';
import type { ReactNode } from 'react';
import { PiWarningCircleFill } from 'react-icons/pi';
import { Icon } from '../Icon/Icon';
import {
  field,
  label as labelClass,
  requiredMark,
  hint as hintClass,
  errorRow,
  errorIcon,
  errorText,
} from './Field.css';

export type FieldSize = 'sm' | 'md' | 'lg';

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
  /** Sizes the label/hint/error indent and cascades matching height/padding
   * to a nested `Input` via CSS custom properties — not a `size` prop
   * injected into children, so it composes safely with elements that have
   * their own native `size` attribute — on a `<select>`, `size` sets the
   * visible row count. An `Input` nested here picks this up automatically
   * regardless of its own `size`. */
  size?: FieldSize;
  children: (injectedProps: FieldInjectedProps) => ReactNode;
}

/**
 * Label/hint/error coordination for an arbitrary input. Hands off a shared
 * `id` / `aria-describedby` / `aria-invalid` via children-as-function rather
 * than `cloneElement` (ADR-0002). Field never imports `Input`; any element
 * accepting `FieldInjectedProps` works. See the `Sizes` story for sizing.
 *
 * All `Field`s in one form must share one `size` — unchecked by the type,
 * checked by `pnpm check:field-sizes`.
 */
export function Field({ label, required, hint, error, size = 'md', children }: FieldProps) {
  const inputId = useId();
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div data-component="field" className={field({ size })}>
      <label htmlFor={inputId} className={labelClass}>
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
        <span id={hintId} className={hintClass}>
          {hint}
        </span>
      )}
      {error && (
        <span id={errorId} role="alert" className={errorRow}>
          <Icon icon={PiWarningCircleFill} size={14} className={errorIcon} aria-hidden="true" />
          <span className={errorText}>{error}</span>
        </span>
      )}
    </div>
  );
}
