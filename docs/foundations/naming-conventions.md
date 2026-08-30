# Naming Conventions

| What                                 | Casing                                | Example                                     |
| ------------------------------------ | ------------------------------------- | ------------------------------------------- |
| Component name                       | PascalCase                            | `Button`, `ProgressBar`                     |
| Prop name                            | camelCase                             | `variant`, `isDisabled`                     |
| Prop _value_ (string literal unions) | camelCase                             | `variant="headingLg"`, `name="chevronDown"` |
| Token object keys                    | camelCase                             | `colorVars.brandPrimary`                    |
| CSS custom property output           | kebab-case (unavoidable — CSS syntax) | `--color-brand-primary`                     |

## Why prop values are camelCase, not kebab-case

Kebab-case is idiomatic in CSS, HTML attributes, and URLs — it's easy to reach for by
association when working near styling code. But inside JS/TS values, everything else in
this system is already camelCase (component names, prop names, token keys). Introducing
kebab-case only for string literal values breaks internal consistency for no benefit —
it becomes an arbitrary exception to remember rather than one consistent rule.

**Rule of thumb:** if it's a JS/TS identifier or string literal consumed by JS/TS code,
it's camelCase. Kebab-case only appears where CSS itself requires it (custom property
names in generated output) — never in component APIs.

## Named exception: `'2xl'`

The spacing scale's top step (`spacing-system.md`) is `'2xl'`, not `twoXl` or `xxl` —
a leading digit can't start a valid JS identifier, so it's the one token key that
must be a quoted string literal rather than a bare camelCase key. This is an
accepted, deliberate exception (matches the near-universal `2xl` convention from
Tailwind and similar scales), not an oversight.
