# Downstream Override Patterns

## Composition first — override is the exception

This contract exists for one situation: a feature team consumes Pearl as an
installed dependency, can't fork or edit its source, and hits a case where a
component needs adjusting from the outside. It is not the default way to build a
feature. The default is:

- Compose shipped components as-is, and use the layout primitives (`Stack`,
  `Row`) for feature- and page-level layout. Correct tokens, visuals, and
  accessibility come with them — nothing targets component internals.
- When a feature needs something the library doesn't ship, build it by composing
  primitives in feature-local code first. That stays fully on-system, and a
  shape that recurs across features is a candidate for promotion to a real
  component (see `component-philosophy.md`).

An override sits on top of that as a costed, visible exception. Whoever writes
one owns keeping it correct when the component's internals move: the contract
guarantees the `data-*` names and nothing around them, and the system has no
visibility into what got overridden downstream, so a renamed part or a retuned
token can drift an override out of correctness with no compiler error. Treat
each one as something a team can point to and justify — "we needed X,
composition and theming couldn't provide it" — not a routine styling tool.

## Primary mechanism: `data-component` / `data-part` + consolidated `selectors`

Every component and subcomponent renders with stable, deliberate data attributes —
independent of internal (hashed, unstable) class names:

```tsx
function CardHeader({ children, className }: CardHeaderProps) {
  return (
    <div
      data-component="card"
      data-part="header"
      className={clsx(cardHeader, className)}
    >
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
    <Card.Body>...</Card.Body> {/* no className needed */}
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

So a page cannot render two themes side by side by nesting. The introduction
page's theme specimens render each theme in its own frame instead. Real
isolation is the only reliable answer today.

**Possible fix, not adopted:** CSS `@scope` with a scope limit
(`@scope (.themeClass) to ([data-theme-root])`) expresses exactly this boundary
with one shared marker and no cross-theme coupling. It would need every theme's
`globalStyle` rewritten and vanilla-extract has no `@scope` API, so it is an
ADR-sized change rather than a patch. Revisit if nesting is ever needed in
product code rather than only in this system's own documentation.

---

## Secondary mechanism: `className` — for single-instance overrides only

Data attributes target _categories_ ("any card header"). When two instances of the
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
- When an override into a specific component/part _is_ warranted, prefer the
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
[data-component='card'] [data-part='header'] {
  background-color: var(--my-brand-bg);
  padding: 1.5rem;
}
```

## Flagging a gap — when a variant/pattern doesn't exist yet

A consumer will sometimes need something the system doesn't document yet —
a destructive/danger button treatment is the common case: Pearl only ships
`primary`/`secondary`, and a delete-account action legitimately needs a third
visual register the component API has no name for.

That's expected, not a failure to work around quietly. Two rules:

- **Extend through the real override contract, never inline `style={{...}}`.**
  A one-off `style` prop on a single element is invisible to the rest of the
  app and to the design system's own maintainers — it can't be found, audited,
  or promoted later. Target `[data-component="button"][data-variant="primary"]`
  (or whichever variant is closest) from a feature-scoped `style()` call, per
  the `data-part` contract above, the same way any other override would be
  written.
- **Say so, out loud, in two places.** A code comment at the override site
  (`// override: Pearl has no destructive Button variant — styling primary
as danger here until one exists`) and a plain statement in whatever prose
  accompanies the generated code. Both exist for the same reason: an override
  like this is real, on-the-ground evidence that the system's variant set is
  incomplete. If it's silent, that evidence is lost the moment the feature
  ships instead of becoming a signal design-system maintainers can act on.

This is the mechanism by which real usage — not speculative planning — is
what's supposed to grow the token/variant surface over time.
