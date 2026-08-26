import { useId } from 'react';
import type { ReactNode } from 'react';
import { field, label as labelClass, hint as hintClass, error as errorClass } from './Field.css';

export type FieldSize = 'sm' | 'md' | 'lg';

export interface FieldInjectedProps {
  id: string;
  'aria-describedby': string | undefined;
  'aria-invalid': boolean;
}

export interface FieldProps {
  label: string;
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
 * than `cloneElement` (ADR-0002). Field never
 * imports `Input`; any element that accepts `FieldInjectedProps` works.
 *
 * @example
 * ```tsx
 * <Field label="Email" hint="We'll never share it" error={errors.email}>
 *   {(props) => <Input type="email" {...props} />}
 * </Field>
 * ```
 */
export function Field({ label, hint, error, size = 'md', children }: FieldProps) {
  const inputId = useId();
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div data-component="field" className={field({ size })}>
      <label htmlFor={inputId} className={labelClass}>
        {label}
      </label>

      {children({
        id: inputId,
        'aria-describedby': describedBy,
        'aria-invalid': Boolean(error),
      })}

      {hint && (
        <span id={hintId} className={hintClass}>
          {hint}
        </span>
      )}
      {error && (
        <span id={errorId} role="alert" className={errorClass}>
          {error}
        </span>
      )}
    </div>
  );
}
