# Downstream Override Patterns

## Primary mechanism: `data-component` / `data-part` + consolidated `selectors`

Every component and subcomponent renders with stable, deliberate data attributes —
independent of internal (hashed, unstable) class names:

```tsx
function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div data-component="card" data-part="header" className={clsx(cardHeader, className)}>
      {children}
    </div>
  );
}
```

Feature teams target these attributes from a single consolidated `style()` call per
feature, using vanilla-extract's `selectors` key — one exported class handles every
override that feature needs, no per-element hook classes required:

```ts
// Feature.css.ts
import { style } from '@vanilla-extract/css';

export const myFeature = style({
  selectors: {
    // Note the space after `&` — this is a *descendant* combinator. `myFeature`
    // is the className on the wrapper `<div>`, not on `Card` itself, so the
    // selector must read "a `[data-part="header"]` somewhere inside a
    // `[data-component="card"]` somewhere inside this wrapper." Omitting the
    // space (`&[data-component="card"]`) instead asserts the wrapper *itself*
    // carries `data-component="card"`, which is never true here — that
    // variant silently matches nothing.
    '& [data-component="card"] [data-part="header"]': { background: 'red' },
    '& [data-component="card"] [data-part="body"]': { padding: '20px' },
    '& [data-component="alert"] [data-part="icon"]': { color: 'orange' },
  },
});
```

```tsx
<div className={myFeature}>
  <Card>
    <Card.Header>...</Card.Header> {/* no className needed */}
    <Card.Body>...</Card.Body>     {/* no className needed */}
  </Card>
</div>
```

### Why this is the default

- **Zero per-element setup cost.** Attributes cost nothing extra beyond what the
  component already renders — no exported empty style token, no `className` prop
  needed at each element just to make it targetable.
- **Specificity resolves predictably, without `@layer`.** A compound/descendant
  selector (`[data-component="card"] [data-part="header"]`) always outranks the
  base component's single-class style, regardless of file/import/bundle order —
  this is a CSS specificity guarantee, not something dependent on build behavior.
- **Decoupled from implementation.** Data attributes are a deliberate, versioned
  contract the design system controls — unlike importing the library's actual
  generated class tokens, which exposes internals and can break silently if the
  internal DOM structure ever shifts.
- **Doubles as a stable QA/automation selector**, independent of styling entirely.
- **Category-wide targeting.** One rule styles every instance of "a card header,"
  anywhere in the feature — which is the common case.

### Constraint this depends on

Base component styles (`Card.css.ts` etc.) must stay **single-selector** wherever
possible. If a component's own internal styles ever became two-part compound
selectors, feature overrides would need to match or exceed that specificity, and
the "just works" guarantee above would need `@layer` to restore. Component authors
should keep this in mind — it's what keeps overrides predictable as the library grows.

### Limit: themes do not nest

A theme styles components through `globalStyle` **descendant** selectors keyed
on its theme class:

```
.tahitianDarkThemeClass [data-component="button"][data-variant="primary"] { ... }
.pearlLightThemeClass   [data-component="button"][data-variant="primary"] { ... }
```

Put a Pearl-classed subtree inside a Tahitian-classed page and **both**
selectors match the inner button, at identical specificity (0,3,0). CSS breaks
that tie by **source order, not proximity** — there is no "nearest ancestor
wins" rule for descendant selectors — so the inner theme loses to whichever
stylesheet happens to load last, at any nesting depth.

The practical rule:

- **Custom properties nest correctly.** A nested theme class does re-resolve
  `vars.*`, so colors, spacing, and radii follow the inner theme.
- **`globalStyle` rules do not.** Anything a theme expresses that way — font
  family, casing, tracking, per-variant borders — leaks into nested subtrees.

So a page cannot render two themes side by side by nesting. Verified 2026-08-28
against the introduction page's theme specimens, which now render each theme in
its own frame instead. Real isolation is the only reliable answer today.

**Possible fix, not adopted:** CSS `@scope` with a scope limit
(`@scope (.themeClass) to ([data-theme-root])`) expresses exactly this boundary
with one shared marker and no cross-theme coupling. It would need every theme's
`globalStyle` rewritten and vanilla-extract has no `@scope` API, so it is an
ADR-sized change rather than a patch. Revisit if nesting is ever needed in
product code rather than only in this system's own documentation.

---

## Secondary mechanism: `className` — for single-instance overrides only

Data attributes target *categories* ("any card header"). When two instances of the
same component exist and only one needs a tweak, attributes can't disambiguate —
that's what `className` is for:

```tsx
<Card><Card.Header>Header A</Card.Header></Card>
<Card><Card.Header className={secondHeaderOverride}>Header B</Card.Header></Card>
```

Every component/subcomponent should still accept an optional `className`, merged
via `clsx`, as this narrow-purpose escape hatch — not as the primary override path.

## Guidance for feature-level authors

- Use feature-level parent-scoped CSS mostly for **layout and spacing** between
  elements (gaps, alignment) — not for reaching into component internals.
- When an override into a specific component/part *is* warranted, prefer the
  `data-component`/`data-part` + `selectors` pattern above.
- Reach for `className` only for genuine single-instance, one-off cases.

## Explicitly not used

### Banned — importing internal class tokens

Reaching into the library's source or compiled output to import and reuse its
internal, hashed style tokens:

```tsx
// ❌ BANNED — importing internal implementation details
import { baseButton, labelStyle } from '@my-ds/core/button.css.ts';

const MyCustomButton = () => (
  <button className={`${baseButton} my-override-hack`}>
    <span className={labelStyle}>Click me</span>
  </button>
);
```

**Why it fails:** this tightly couples consumer code to internal refactors. If
the design system renames or splits `baseButton`, the consumer's app breaks
silently — no type error, no compile error, just wrong CSS in production.

### Banned — `createVar` as a general override mechanism

Turning every sub-element style into a bespoke custom-property injection prop:

```tsx
// ❌ BANNED — prop-explosion via custom CSS variables
<Card
  headerBgVar={myCustomBg}
  headerPaddingVar={myCustomPadding}
  footerBorderVar={myCustomBorder}
/>
```

**Why it fails:** it turns every design token into an endless stream of
bespoke props, defeating the simplicity of the component API and duplicating
what a CSS selector already does natively.

### The correct way — `data-part` contract

Consumers target stable attribute selectors from their own stylesheet instead:

```css
/* ✅ ALLOWED — clean, versioned attribute targeting */
[data-component="card"] [data-part="header"] {
  background-color: var(--my-brand-bg);
  padding: 1.5rem;
}
```
