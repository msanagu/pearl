# Component Philosophy

## Core principle: composition over configuration

Favor `children` and slot-based props over prop-explosion. If a component needs many
boolean or enum props whose only job is to toggle rendered structure or content, that's
a signal it should be composed instead of configured.

**The test: does the root need to make a decision that depends on this content's
presence, or its relationship to another part?** If not, default to compound
sub-components or plain `children` — the root shouldn't need to know a part exists
(Card's `Header`/`Body`). A prop is legitimate exactly when the root does need to
broker that — Alert's `heading` shifts where its icon sits, Field's `required` renders
a static, visible `*` but marks it `aria-hidden` because the control's own
`aria-required` already announces it — the mark stays purely visual, never suppressed.
A bare boolean/enum with no such coupling is always compositional —
that's the common case, not the whole test. See the composition-over-configuration
entry in [DECISIONS.md](../../DECISIONS.md) for the worked examples.

## Composition is also how new design happens

Composition keeps a component's own API small — and it's also how work the
library doesn't cover yet gets built without leaving the system. A feature that
needs something unshipped composes it from primitives in its own code: still
correct tokens, accessibility, and visuals, no override contract involved. That
local composition is a proposal. If the same shape recurs across features, it's a
concrete candidate for promotion to a first-class component — one that was fully
on-system before anyone proposed canonizing it.

How candidates get detected and promoted is still being worked out. That they
should come from real, recurring composition rather than speculative planning is
the settled part — and the reason the primitives are designed to combine cleanly
in the first place.

## Smart defaults, always escapable

Every component should work with minimal props out of the box, but nothing should be a
dead end. The default rendering path and the override path are both first-class:

```tsx
<Card /> {/* renders a sensible default layout */}

<Card>
  <Card.Header>Custom</Card.Header>
  <Card.Body>...</Card.Body>
</Card> {/* fully overridden via composition */}
```

Preferred escape hatch: `children` as the primary slot. Render-prop patterns
(`children={(injectedProps) => ...}`) are used specifically where a component needs to
hand data/behavior back to an arbitrary child (see `Field`), since implicit prop-cloning
onto children is considered too "magic" for this system.

## "Dumb outside its four walls"

A component should not know or care about its context, siblings, or where it's rendered.
No implicit coupling to global state, layout assumptions, or components outside its own
family. It receives what it needs via props/children and renders — that's the whole
contract.

## The compound-component exception (stated explicitly, not accidental)

A compound component (root + sub-components sharing React Context so siblings can
coordinate — e.g. a future `Tabs`/`Tabs.List`/`Tabs.Trigger` needing to agree on which
tab is active) is a deliberate, bounded exception to "dumb outside its four walls," not
a violation of it. The rule: **siblings within a component family may coordinate; a
component must never reach outside its own family.** No component in this system uses
Context today — `Card.Header`/`Card.Body` are static-property namespacing with no shared
state — so this exception is documented ahead of its first real use, not
retrofitted to one.

**When to use compound components:** only when sub-parts need to genuinely coordinate
state or behavior (which tab is active, matching `id`s for ARIA relationships). If
sub-parts are just visually adjacent with no shared logic, use plain `children`
composition — no Context needed. Most components in this system fall into the second
category; compound components are the exception, used sparingly and only where justified.

## Trade-off: duplication vs. the wrong abstraction

DRY (avoiding repeated _data_) is not free — it often trades data duplication for logic
complexity. Before unifying two things into one abstraction, ask: **is the thing being
unified structurally guaranteed to stay simple, or just simple today?**

- Safe to unify: closed, stable properties (e.g. the shared `FlexBox` primitive's
  `direction: 'row' | 'column'` is exactly one CSS property toggle, not going to grow
  surprise cases — `Stack` and `Row` each fix it to one value rather than exposing it).
- Risky to unify: open-ended, divergent concerns (e.g. icon "variants" like outline vs.
  filled vs. duotone aren't guaranteed to be a clean transform of one shape into another).

When in doubt, prefer duplicated data (multiple files, explicit registrations) over a
shared abstraction whose assumptions might not hold — duplication is cheap to undo; a
wrong abstraction is expensive to unwind once code has grown around it.

## The invariant themes may not override: controls look like controls at rest

"Smart defaults, always escapable" is about _composition_ — it does not license a
theme to remove a control's affordance. Every interactive control that occupies a
box renders a visible boundary in its resting state, in every theme and every
mode. A theme chooses how quiet that boundary is; it does not choose whether
there is one.

A control that is bare text until `:hover` breaks two things at once: its padding
is invisible, so nothing on the page can be reliably aligned to it, and it reads
as a link, which degrades the meaning of the page's actual links.

Full reasoning, the hover-state corollary, and the worked fix:
[`control-affordances.md`](./control-affordances.md).
