# Pearl

A composition-first React design system, built in the open. A token contract
that makes the whole system reskinnable, a sanctioned way for downstream teams
to override it, accessibility that leans on the platform, and a structure a
coding agent can read from the start rather than one retrofitted for it. Each
convention was worked out in a dated design note, with the alternatives weighed.

> **Status: work in progress.** A small set of primitives and two brand marks,
> across four themes × light/dark. Pearl and Tahitian are the fully authored
> themes; Freshwater and South Sea are still being finalized. A 2026 snapshot,
> not a finished product.

Run `pnpm storybook` to browse the components, or open the
[Pearl Playground](https://msanagu.github.io/pearl-playground/) to describe an
interface in plain language and watch a coding agent build it from Pearl.

One premise runs through it: AI changes what a design system can be when the
foundations are data an agent reads directly and the docs can't drift from the
code. Pearl is a testbed for that — exploration runs wide, adoption stays slow.

## The thesis

- **Composition over configuration.** A prop that only toggles _what renders_ is
  a smell; it should be a compositional slot. A prop is legitimate only when the
  component's root must make a decision that depends on that content.
- **A token/theme contract that actually enforces itself.** Every component
  references only theme tokens, never a raw value. Themes are separate artifacts
  the compiler checks against the contract — a theme missing a token fails to
  build. Swapping the theme layer reskins the entire system with zero component
  changes.
- **A real override contract for downstream teams.** Components render stable
  `data-component` / `data-part` attributes. A team consuming Pearl as a
  versioned dependency customizes through those, from one consolidated selector
  block — not by importing internal class names.
- **Platform-first accessibility.** Real `<button>`, real `<label htmlFor>`,
  real headings via an `as` prop. ARIA only where there's no native element to
  defer to. Conformance target: WCAG 2.2 AA.
- **Machine-legible from day one.** Generated manifest JSON and an `llms.txt`
  let a coding agent build on-system code without a retrieval layer between it
  and the truth. Storybook stories are the compiled usage reference the manifest
  points at.

## Posture

Every convention here is held with a loose fist. The design engineering
landscape moves; what's written down is what looked right given what was known
at the time. Some conventions are adopted and would take a real reason to
reverse; others are still being worked out. An approach that gets tried,
documented, and then reversed is the method working — see
**[DECISIONS.md](./DECISIONS.md)** for the short version.

## Forking and reskinning

Every component references only `vars.*` from the theme contract, never a raw
color, spacing, or type value. The visual identity lives entirely in the theme
files (`src/themes/*.css.ts`), separate from component logic, markup, and
accessibility behavior.

To bootstrap your own system from Pearl, replace the theme files with your own
values against the same `ColorTokens` / `SpaceTokens` / type-scale contract.
Every component reskins with no component code touched; structure, composition
patterns, and accessibility behavior stay as they are. TypeScript enforces
completeness: a theme missing a required token fails to compile.

This holds only as long as no raw color, spacing, or type literal appears in a
component `.css.ts` outside the theme layer. A missing token is a compile error;
a hardcoded value is not, so catching one needs a lint rule. That rule isn't
written yet, so treat the reskinning property as an intent backed by discipline
rather than an enforced contract until it is.

## Build vs. adopt

Building from scratch is reserved for components where hand-building teaches the
most and where Pearl's own concerns (composition, tokens, override contracts,
accessibility) are the actual differentiator. Where the hard part is a solved,
invisible-until-broken problem — positioning, virtualization, drag physics, or an
exhaustively-worked accessibility pattern like focus traps and roving tabindex —
a headless library is evaluated on its merits rather than ruled out.

Nothing below is pre-committed to a dependency. Rendering, composition, styling,
and the override contract stay custom regardless of what gets adopted for logic
and behavior.

| Component         | Complexity driver                                    | Headless candidate(s)            |
| ----------------- | ---------------------------------------------------- | -------------------------------- |
| Data grid         | sort/filter/selection logic; virtualization math     | TanStack Table, TanStack Virtual |
| Dialog            | focus trap, escape handling, focus restoration       | Radix Primitives, Zag.js         |
| Tooltip / Popover | viewport collision detection, flip/shift positioning | Floating UI                      |
| Combobox / Select | keyboard nav, filtering, listbox ARIA                | Zag.js, Radix Primitives         |
| Drag and drop     | pointer drag physics, keyboard-accessible DnD        | dnd-kit                          |

Everything outside that list (layout primitives, Field, Alert, and the like) is
built from scratch by default; adopting a dependency there would be
over-engineering relative to the problem.

For what exists today and each component's props and slots, browse Storybook or
the [Pearl Playground](https://msanagu.github.io/pearl-playground/). The manifest
and `llms.txt` are generated from the code, so that list is never hand-maintained
in prose.

## Stack

- **React 19** + **TypeScript 7** — `strict`, plus `noUncheckedIndexedAccess`,
  `noUnusedLocals`/`Parameters`, `verbatimModuleSyntax`
- **Vite 8** — library build to `dist/`, aliases resolved back to relative
  paths in the emitted `.d.ts`
- **vanilla-extract** — zero-runtime, theme-contract-driven styling
- **Storybook 10** — the component workbench and docs surface; a11y addon, and
  the Vitest addon that runs every story as a test
- **Vitest 4** — two projects: `unit` in jsdom, `storybook` in a real browser
  (Playwright / Chromium); React Testing Library, `jest-axe` for a11y assertions

## Scripts

Uses **pnpm**.

| Script                   | What it does                                                   |
| ------------------------ | -------------------------------------------------------------- |
| `pnpm storybook`         | Storybook on port 6006 — the workbench                         |
| `pnpm build`             | Library build + type declarations + manifest / `llms.txt`      |
| `pnpm typecheck`         | `tsc --noEmit`                                                 |
| `pnpm test`              | Vitest run                                                     |
| `pnpm format`            | Prettier write                                                 |
| `pnpm generate:manifest` | Regenerate the manifest JSON + `llms.txt` without a full build |

## Docs

- **[DECISIONS.md](./DECISIONS.md)** — the reasoning layer: the conventions
  Pearl is built on, adopted and under evaluation.
- **[docs/foundations/](./docs/foundations)** — conventions: spacing, typography,
  radius, markup and component philosophy, override patterns, accessibility.
- **[docs/theme/](./docs/theme)** — the visual language brief and the name.
- **[docs/governance/](./docs/governance)** — the three-persona audience model
  (Designer / Maintainer / Consumer).

## License

MIT © 2026 Mary San Agustin
