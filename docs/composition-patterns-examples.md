# Two Patterns: Dot-Notation Sub-Components vs. Children-as-Function

These look similar at a glance but solve different problems and use different
mechanisms. Card doesn't need Context (per component-philosophy.md — no real
coordination between Header/Body). Field does inject data into its child, so it
uses the render-prop pattern instead of `cloneElement` magic.

---

## 1. `Card.Header` / `Card.Body` — pure namespacing, no Context

This is **not** a compound component in the Tabs sense — there's no shared state,
no coordination. It's just attaching sub-components as static properties on the
main component, purely for a clean, discoverable call-site API.

```tsx
// Card.tsx
import { ReactNode } from 'react';
import { stack } from './Card.css';

function CardRoot({ children }: { children: ReactNode }) {
  return <div className={stack}>{children}</div>;
}

function CardHeader({ children }: { children: ReactNode }) {
  return <div className="card-header">{children}</div>;
}

function CardBody({ children }: { children: ReactNode }) {
  return <div className="card-body">{children}</div>;
}

// The trick: attach sub-components as static properties
export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  Body: CardBody,
});
```

```tsx
// Usage
<Card>
  <Card.Header>Account Settings</Card.Header>
  <Card.Body>Form fields go here</Card.Body>
</Card>
```

**Why this works with zero Context:** `Card.Header` and `Card.Body` are just plain
components. `Card` (the root) doesn't pass them anything, doesn't know they exist,
and doesn't coordinate with them — it just renders whatever `children` it receives.
`Card.Header`/`Card.Body` are independently simple, each renders itself, layout is
handled purely by CSS (flex/grid gap on the root wrapper). This is "dumb outside its
four walls" in its purest form — genuinely no implicit coupling at all, the dot
syntax is organizational sugar, nothing more.

**When you'd upgrade this to real Context:** only if `Card.Header` and `Card.Body`
ever needed to know something about each other or about `Card`'s own state (e.g. a
`Card` with a `collapsed` state that `Card.Body` needs to read to decide whether to
render). Don't add Context preemptively — this plain version is correct until there's
an actual coordination need.

---

## 2. `Field` — children-as-function (render prop)

Field needs to *generate and hand off* data (a shared `id`, `aria-describedby` value,
`aria-invalid` flag) to whatever input is nested inside it — but it doesn't know or
care what that input is. Since injecting props onto an arbitrary child via
`cloneElement` was ruled out as too implicit/magic, `children` is a function instead
of JSX.

```tsx
// Field.tsx
import { useId, ReactNode } from 'react';

interface FieldInjectedProps {
  id: string;
  'aria-describedby': string | undefined;
  'aria-invalid': boolean;
}

interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  children: (injectedProps: FieldInjectedProps) => ReactNode;
}

export function Field({ label, hint, error, children }: FieldProps) {
  const inputId = useId();
  const hintId = hint ? `${inputId}-hint` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;

  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div>
      <label htmlFor={inputId}>{label}</label>

      {children({
        id: inputId,
        'aria-describedby': describedBy,
        'aria-invalid': Boolean(error),
      })}

      {hint && <span id={hintId}>{hint}</span>}
      {error && <span id={errorId} role="alert">{error}</span>}
    </div>
  );
}
```

```tsx
// Usage — the input itself is fully arbitrary, Field never imports it
<Field label="Email" hint="We'll never share this" error={errors.email}>
  {(fieldProps) => <input type="email" {...fieldProps} />}
</Field>

<Field label="Country">
  {(fieldProps) => (
    <select {...fieldProps}>
      <option>USA</option>
      <option>Canada</option>
    </select>
  )}
</Field>
```

**Why this is more explicit than `cloneElement`:** the call site literally spreads
`{...fieldProps}` onto whatever element it wants — nothing is silently mutated or
injected behind the scenes. If you look at the usage code, you can see exactly what
props the input is receiving, because you wrote the spread yourself. This matches
"dumb outside its four walls" at the *call-site* level too — no hidden behavior, no
guessing what `Field` is doing to its child.

**Trade-off, stated honestly:** slightly more ceremony per call site (the function
wrapper) than a bare `<input>` would need. That's the accepted cost for avoiding
implicit prop injection — see component-philosophy.md's stance on preferring
explicit code over "magic."
