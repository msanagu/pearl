# Roadmap & Strategic Framing

## Project framing

This design system is built to demonstrate enterprise-grade design system judgment,
including knowing when to build vs. when to adopt a well-suited third-party
dependency. Full-scratch construction is reserved for components where hand-building
teaches the most and where the system's own philosophy (composition, tokens,
override contracts, accessibility) is the actual differentiator. Headless libraries
are evaluated — deliberately, not defaulted into — for components where the
underlying problem is solved, invisible-until-broken math (positioning,
virtualization, drag physics) or an exhaustively-solved accessibility pattern where
a subtle bug is easy to ship unnoticed (focus traps, roving tabindex).

## Open-source value proposition: theme-only reskinning

Because every component references only `vars.*` from the shared theme contract —
never a hardcoded color, spacing, or typography value — the entire visual identity
of this system lives in the theme implementation files (`themes/*.css.ts`),
completely decoupled from component logic, markup, and accessibility behavior.

**What this means for someone cloning the repo:** replacing the theme files with
their own values (against the same `ColorTokens`/`SpaceTokens`/type-scale contract)
re-skins every component instantly, with zero component code touched. Structure,
composition patterns, and accessibility stay proven and unchanged; only appearance
is theirs to define. TypeScript enforces completeness — a theme implementation
missing a required token fails to compile.

**Enforcement requirement:** this promise depends on strict discipline — no raw
color/spacing/typography literals may appear in any component `.css.ts` file
outside the theme layer itself. This must be backed by an actual lint rule (not
just a documented convention), since a hardcoded value silently breaks the
reskinning promise for that property with no compiler error to catch it (unlike a
missing theme token, which does error). **Status: lint rule not yet implemented —
needed before this is a reliable guarantee, not just an intention.**

---

## Component List

### Foundational — shipped
1. **Button** — `variant`, single fixed height, native `<button>`, icon-composition via `children`
2. **Card** — static-property namespacing (`Card.Header`/`Card.Body`)

### Content — shipped
3. **Text** — token-driven typography, `as` prop for semantic element swapping,
   `weight`/`size` props, variant/element decoupling
4. **Tag** — status/label indicator, token-driven

### Feedback & data — shipped
5. **Alert** — info/success/warning/error states, `role="alert"`/`role="status"`
6. **Icon** — typed name/variant registry, explicit per-variant SVGs (no runtime
   shape transform — see foundations/component-philosophy.md's duplication-vs-abstraction test)
7. **Field** — label/hint/error coordination wrapper, children-as-function pattern
8. **Input** — native `<input>` wrapper, single fixed height matching Button

### Feedback & data — planned
9. **Progress Bar** — native `<progress>` vs. custom `role="progressbar"` decision
   deferred to implementation time (see foundations/markup-philosophy.md)
10. **Badge** — status indicator, token-driven, deliberately simple; distinct
    from the already-shipped Tag (split rationale not yet written up as an ADR)

### Layout — shipped
11. **Stack** — vertical layout (shares internal `FlexBox` primitive with Row)
12. **Row** — horizontal layout

### Layout — planned
13. **Grid** — 2D layout, separate model from Stack/Row

### Deferred — not in current MVP scope
- **Tabs** — tabled for now. If revisited, remains the intended justified
  compound-component (Context) showcase.
- **Dialog, Tooltip, Avatar, Select** — not yet confirmed back into scope.

---

## Phase 2+ — Large-Scoped Components (build-vs-adopt evaluation deferred)

Each of these needs a deliberate build-vs-adopt decision at implementation time —
none are pre-committed to a dependency. Rendering, composition, styling, and the
override contract stay fully custom regardless of what's adopted for logic/behavior.

| Component | Complexity driver | Headless candidate(s) | Notes |
|---|---|---|---|
| **Data Grid** | Sort/filter/selection logic; virtualization math | TanStack Table (logic), TanStack Virtual (windowing) | Rendering of every row/cell stays 100% custom regardless — this is the point. Sort/selection algorithmic logic is a reasonable place to still build from scratch if desired; virtualization is the piece most worth adopting. |
| **Dialog** | Focus trap, escape handling, focus restoration | Radix Primitives (unstyled), Zag.js | Radix's unstyled primitives expose state via `data-state`/`data-disabled` attributes — aligns naturally with this system's existing `data-*` override pattern. |
| **Tooltip / Popover** | Viewport collision detection, flip/shift positioning | Floating UI | Positioning math is the single most "not worth reinventing" piece on this list. |
| **Combobox / Select** | Keyboard nav, filtering, listbox ARIA pattern | Zag.js, Radix Primitives | Not yet formally scoped as a component; candidate list captured for when it is. |
| **Drag-and-drop features** | Pointer drag physics, keyboard-accessible DnD | dnd-kit | Only relevant if column reorder or similar features enter scope. |

## Build-from-scratch by default
Tabs (if revisited), Field, Alert, Badge, Progress Bar — no hidden algorithmic or
invisible-until-broken complexity; adopting a dependency here would be
over-engineering relative to the actual problem being solved.
