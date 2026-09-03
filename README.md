# Pearl

A composition-first React design system with a token contract
that makes the whole system reskinnable, a sanctioned way for downstream teams
to override it, accessibility that leans on the platform, and a structure a
coding agent can read from the start rather than one retrofitted for it. Each
convention was worked out in a dated design note, with the alternatives weighed. Run `pnpm storybook` to browse the components.

> **Status: work in progress.** A small set of primitives and two brand marks,
> across four themes. A 2026 snapshot,
> not a finished product.

## Installing

Published under the `test` dist-tag while the API is still moving — not `latest`:

```sh
npm i @msanagu/pearl@test
```

## Playground

The [Pearl Playground](https://msanagu.github.io/pearl-playground/) goes further:
describe an interface in plain language and watch a coding agent assemble it
from Pearl.

The Playground is a static site with no backend, so its assistant is
bring-your-own-key. You paste an Anthropic API key; it's held only in your
browser's local storage and never reaches a server of mine, requests go
straight from your browser to Anthropic, and usage bills to your own account.
The canvas works without a key — only the assistant is gated.

## The thesis

AI changes what a design system can be when the
foundations are data an agent reads directly and the docs can't drift from the
code. Pearl is a testbed for that: aggressive exploration, conservative
adoption.

- **Composition over configuration.** A prop that only toggles _what renders_ is
  a smell; it should be a compositional slot. A prop is legitimate only when the
  component's root must make a decision that depends on that content.
- **Built to take part in its own evolution.** Composing the primitives produces
  UI the system never explicitly defined but that is still on-system — correct
  tokens, accessibility, and visuals, with nothing reaching past the contract. A
  composition that recurs across features is an evidenced candidate for promotion
  to a first-class component: new design happens by composing what exists, and
  the good patterns get canonized. The architecture is meant to keep surfacing
  those candidates; the exact promotion mechanics are still being validated.
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

The same mechanism covers running more than one theme inside a single company.
Because swapping the theme layer costs no component changes, separate themes can
carry separate jobs against one component set: a white-label palette per
customer, a dedicated high-contrast theme, or a marketing surface tuned apart
from the product UI. The themes Pearl ships are worked examples of one schema
holding several identities.

This holds only as long as no raw color, spacing, or type literal appears in a
component `.css.ts` outside the theme layer. A missing token is a compile error;
a hardcoded value is not, so catching one needs a lint rule. That rule isn't
written yet, so treat the reskinning property as an intent backed by discipline
rather than an enforced contract until it is.

## Components

For what exists today and each component's props and slots, browse Storybook or
the [Pearl Playground](https://msanagu.github.io/pearl-playground/). The manifest
and `llms.txt` are generated from the code, so that list is never hand-maintained
in prose. What's built from scratch versus adopted as a headless dependency
follows the "Dependency stance" section of
**[DECISIONS.md](./DECISIONS.md)**.

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
  radius, markup and component philosophy, override patterns (and who they're
  for), accessibility.

## License

MIT © 2026 Mary San Agustin
