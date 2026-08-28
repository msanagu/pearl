# Project Brief — for LLM context / portfolio advising

Paste this file into a fresh session to give an LLM full context on this project
without re-deriving it from the full `docs/` set. Written to be dense and
factual, not narrative — optimized for another model to reason over, not for
a human to read as prose. If a claim here conflicts with the repo, the repo
wins; update this file, don't trust it blindly.

## What this is

**A dated, documented experiment testing what a design system looks like when
built to be legible to a coding agent, not just a human — a 2026 snapshot, not
a finished product.** Every architectural call in this repo is timestamped
(commit history, ADR `date` fields) and, where relevant, checked against
external prior art (see ADR-0007's and ADR-0008's "convergent work" sections)
rather than asserted from taste alone. The differentiator from a normal
portfolio component library is that claim being falsifiable: the decisions,
the reasoning, and the dates they were made are all in the repo, so "this
holds up" or "this didn't age well" is a question anyone can actually check
against the commit log, not take on faith.

The concrete hypothesis under test: that a design system whose token layer,
component API, and governance docs are structured for machine legibility from
day one needs *less* retrieval infrastructure to stay accurate for an AI
coding agent than one that bolts a RAG layer onto human-only docs after the
fact (see ADR-0008; the manifest this predicts is not yet built — that's the
next phase of the experiment, not a settled result). A component library is
the testbed, not the deliverable.

**Repo:** `~/Code/design-system` (separate from any other project in this
environment — don't conflate with sibling repos). Docs-first: `docs/` was
populated with philosophy/convention decisions before any component code
existed. `docs/OPEN_QUESTIONS.md` is the live tracker for what's still
undecided — check it before assuming something is settled.

## Tech stack (current, verified working — not aspirational)

- **React 19.2** + **TypeScript 7** (strict: `strict`, `noUncheckedIndexedAccess`,
  `verbatimModuleSyntax`; `exactOptionalPropertyTypes` deliberately **off**, open question)
- **Vite 8** (Rolldown-based) — library build (`dist/index.js` + `index.css` +
  `.d.ts` via a separate `tsc -p tsconfig.build.json` declaration-only pass)
- **Storybook 10** (react-vite framework) + `addon-a11y` (axe, live per-story)
- **Vitest 4** + **React Testing Library** + jsdom + jest-dom matchers
- **pnpm** (via corepack, pinned in `packageManager`) — chosen over npm/Bun;
  Bun rejected as a *runtime* given how bleeding-edge the rest of the stack
  already is (compat risk), fine as an installer-only choice if revisited
- **Styling engine: DECIDED — vanilla-extract (ADR-0001, accepted).** Panda
  CSS was the live alternative during evaluation; VE won on the theme-contract
  completeness guarantee (a theme missing a token fails to compile) that this
  project's whole token architecture (ADR-0005) depends on. `.css.ts` files
  are the real thing, not a placeholder.
- No linter yet (deliberately deferred). CI (`.github/workflows/ci.yml`):
  typecheck → test → build, on pnpm.

## Core philosophy (from `docs/foundations/component-philosophy.md` + related)

1. **Composition over configuration.** A boolean/enum prop that only toggles
   *what renders* (not *how it looks*) is a smell — it should be a
   compositional slot (`children`) instead. Applied concretely: Button has no
   `icon`/`iconPosition` prop; icons compose as `children` alongside text,
   laid out via internal flex + a token gap.
2. **Smart defaults, always escapable.** Every component works with minimal
   props; nothing is a dead end. Default render path and full-override path
   are both first-class.
3. **"Dumb outside its four walls."** No component knows about its context,
   siblings, or global state. Receives props/children, renders. The one
   named exception: compound components (`Tabs.List`, etc.) may coordinate
   *within* their own family via Context — never reach outside it. Most
   components in this system don't need Context at all (e.g. `Card.Header`/
   `Card.Body` are static-property namespacing with zero shared state).
4. **Render-prop over `cloneElement`.** Where a component must hand data to
   an arbitrary child (e.g. `Field` injecting `id`/`aria-*`), it uses
   `children` as a function, not implicit prop injection — explicitness over
   magic, visible at the call site.
5. **Duplication is often safer than the wrong abstraction.** DRY is
   evaluated per-case: unify only *closed, stable* concerns (a `direction`
   toggle). Leave *open-ended, divergent* concerns (icon variants) duplicated
   rather than force a shared abstraction whose assumptions might not hold.

## Governance / audience model (`docs/governance/audience-model.md`)

Three personas, deliberately modeled separately even though one person holds
all three roles on a solo project — this simulates real enterprise DS
structure:
- **DS Designer** — prototypes in a branch/PR, no merge authority. Output is
  a proposal.
- **DS Maintainer** — owns the source outright, customizes by editing theme
  files directly. No override system needed for this persona.
- **DS Consumer** — installs as a versioned dependency, can't fork or edit
  source. Customizes *only* via the sanctioned override contract (below).
  Owns the maintenance cost of any override it writes.

Composition is the Consumer's happy path; overrides are a costed, visible
exception, not routine styling. Convergent overrides across teams are a
signal to promote something to a real variant/token — future work: an
MCP server that detects this pattern automatically across repos
(`docs/governance/design-in-code-canonization-loop.md`, concept-stage only).

## Token / theme architecture

- A single `createThemeContract`-equivalent defines the *shape*: color,
  space (`xs,sm,md,lg,xl,'2xl'` — 6-step, the one non-camelCase, quoted
  token key in the system), radius, and the full typography scale
  (fixed font-size/line-height pairs per variant, never a unitless ratio).
- Concrete themes fulfill that shape; the styling engine's type system is
  expected to fail the build if a theme omits a token (this completeness
  guarantee is native to vanilla-extract's `createTheme`, and is one of the
  two live arguments for keeping VE over Panda — see Open Decisions).
- Components consume tokens via a hand-maintained, JSDoc-annotated wrapper
  layer (not the raw contract directly) so hovering a token at a call site
  shows intent/usage guidance, not just its CSS-var type. Structurally
  type-checked against the contract so the docs can't silently drift.
- Spacing is an 8px "soft" grid; the single 4px half-step (`xs`) is a named,
  intentional escape hatch for icon/chip-scale gaps, not a loophole.

## Override contract (for the Consumer persona)

- **Primary mechanism:** every component/subcomponent renders stable
  `data-component`/`data-part` attributes. Feature teams target these from
  one consolidated selectors block per feature — category-wide targeting
  ("any card header"), decoupled from internal (hashed) class names, doubles
  as a stable QA/automation hook.
- **Secondary mechanism:** `className` passthrough (merged via `clsx`), for
  genuine single-instance overrides only, not the default path.
- **Explicitly banned:** importing a component library's internal generated
  class exports; `createVar` as a general-purpose override mechanism.
- **Known caveat:** the "predictable without `@layer`" specificity guarantee
  this contract currently claims is specific to how vanilla-extract compiles
  `selectors`. If the styling engine changes, this section needs rewriting
  around layer order instead of pure specificity.

## Markup / accessibility stance

- Use the platform first: real `<button>`, real `<label htmlFor>`, real
  `h1`–`h6` via `Text`'s `as` prop — never a styled `<div>` reimplementing
  native semantics. `variant` (visual) and `as` (semantic element) are
  chosen independently — heading level follows document structure, never
  desired size.
- Where there's no native equivalent (Alert, Badge), ARIA roles on a `<div>`
  are not a compromise — there's nothing native to defer to.
- One real, deliberately deferred trade-off: Progress Bar (native
  `<progress>`, hard to style consistently, vs. custom
  `role="progressbar"`, full style control, hand-maintained a11y). Decision
  point is at implementation time, not yet made.
- **Conformance target: WCAG 2.2 AA**, with documented awareness of (not
  compliance with) WCAG 3.0's still-draft outcomes-based model.

## Component roadmap and build status

Ten components shipped, typed, tested, and themed across four themes (Pearl,
Tahitian, Freshwater, South Sea) × light/dark. `experiments/` (typechecked, excluded from the library build and
Storybook) holds an earlier multi-tenant-SaaS direction that scope-narrowed
back to the design system itself — kept for what it taught, not shipped.

| # | Component | Status | Notes |
|---|---|---|---|
| — | Token contract + 4 themes × light/dark + JSDoc wrapper | ✅ shipped | `src/theme.css.ts`, `src/themes/*.css.ts`, `src/tokens.ts` |
| — | `FlexBox` (shared layout primitive) | ✅ shipped | `src/components/layout/` — backs Row and Stack |
| 1 | **Button** | ✅ shipped | variant × size (8px-grid heights), native `<button>`, `data-component` contract, icon-composition via `children` |
| 2 | **Card** | ✅ shipped | static-property namespacing (`Card.Header`/`Card.Body`), link-card and static-card variants, Pearl-only hover luster |
| 3 | **Text** | ✅ shipped | one component, not split Heading/Text; `variant`/`as` decoupled; theme-owned `role` prop (`preheading`/`inlineEmphasis`/`dataDigits`) |
| 4 | **Alert** | ✅ shipped | `role="alert"`, 4 sentiment variants, dismissible |
| 5 | **Icon** | ✅ shipped | wraps any `react-icons` set; `iconLibraries.ts` records evaluated-set notes |
| 6 | **Field** | ✅ shipped | label/hint/error coordination via render-prop child injection, `required` support (native + `aria-required`, decorative `*`), error paired with an icon matching Alert's negative sentiment |
| 7 | **Input** | ✅ shipped | native `<input>` wrapper, sized via Field's CSS custom-property cascade |
| 8 | **Stack** / **Row** | ✅ shipped | `FlexBox`-backed, vertical/horizontal |
| — | Brand: `PearlSphere` | ✅ shipped | `src/brand/` — bespoke artwork, not a themeable canon component (see ADR-0007 on why it doesn't force a 5th theme) |
| — | Progress Bar, Badge, Grid | planned | native-vs-custom (Progress Bar) and build-vs-adopt calls deferred to implementation time |

**Deferred, not in MVP scope:** Tabs (would be the intended justified
Context/compound-component showcase, if revisited), Dialog, Tooltip,
Avatar, Select (Field's render-prop contract supports one; none is built —
see the removed unstyled-`<select>` story). **Phase 2+ large-scoped
components** (Data Grid, Dialog, Combobox, Tooltip/Popover, drag-and-drop)
each get a deliberate build-vs-adopt evaluation against named headless
libraries (ADR-0004: TanStack, Radix, Floating UI, Zag.js, dnd-kit) at
implementation time — none pre-committed.

## AI-agent-readiness posture (ADR-0007, ADR-0008)

This is the part of the experiment (see "What this is") with the most direct
external validation, so it's summarized here rather than left to be found in
the full ADRs:

- **Treatments/roles split (ADR-0007).** Theme-owned effects (Pearl's
  `luster`, Tahitian's `overtone`, …) are named data — `intent`, `guidance`,
  `limits`, `forbid` — not free-floating values. A mapped type makes "declared
  treatment with no role" a compile error, not a documentation gap.
  Independently convergent with Sanity's DSDS spec's `Foundation` entity,
  discovered a month after this ADR was written — see its "Convergent
  external work" section for the checkable timeline.
- **DSDS vocabulary, no DSDS dependency (ADR-0008).** The still-unbuilt
  manifest will borrow DSDS's shape — `kind`/`metadata`/`documentBlocks`
  split, tokens as a pointer into a DTCG file rather than a copy, a parallel
  `agentDocumentBlocks` array for agent-only guidance — without importing
  the spec or tracking its version. DSDS is pre-1.0 and single-maintainer;
  the shape is worth borrowing, the dependency isn't worth taking yet.
- **What's still just a plan, not a result:** the manifest itself, any lint
  rule that enforces the no-raw-value convention, and the eventual agent
  eval (spin up an agent, give it a component brief, measure success/
  iteration count with and without the manifest — methodology borrowed from
  Sanity's own eval write-up, not yet run here). Don't describe any of this
  as built; it's the next phase of the experiment.

## Open decisions (do not assume these are settled)

Full detail in `docs/OPEN_QUESTIONS.md` — condensed here:

- **Storybook docs format** — CSF autodocs + rich `argTypes` JSDoc (leaning
  this way: structured, chunkable, doubles as the future RAG corpus) vs.
  hand-authored MDX (better narrative/presentation). Likely resolution:
  autodocs as the backbone, a small number of hand-authored MDX pages for
  overview/narrative content — not mutually exclusive.
- **No-raw-value lint rule.** Roadmap explicitly requires an enforcement
  mechanism (no component `.css.ts` may hardcode a value outside the theme
  layer) but it doesn't exist yet — currently just a documented convention
  with no compiler/lint teeth.
- **Icon↔Button sizing contract** and **icon-only accessible-name
  enforcement** — layout composition is solved (internal flex + token gap,
  no position prop), but ambient icon sizing and enforcing `aria-label` on
  icon-only buttons are unresolved.
- Smaller open items: component folder colocation convention (provisional:
  `src/components/<Name>/{Component.tsx,.css.ts,.stories.tsx,index.ts}`),
  `exactOptionalPropertyTypes`, Icon SVG registry mechanics, Progress Bar
  native-vs-custom.

## How to advise on this project

- **Don't relitigate settled philosophy.** Composition-over-configuration,
  "dumb outside its four walls," the data-part override contract, and the
  three-persona governance model are deliberate decisions, stated with
  reasons in `docs/`. Disagreement with the *approach* isn't useful
  feedback unless it's about a specific documented consequence being wrong.
- **Do flag real risks:** contradictions between docs, a technical claim
  that doesn't hold (e.g. a specificity/build-tool claim that's
  engine-specific but stated as universal), scope creep against the
  documented MVP list, or a portfolio-narrative gap (the story a hiring
  reviewer would need to follow this project's judgment isn't landing).
- **Portfolio framing to keep in mind:** this project's value is *showing
  judgment under real trade-offs* — token-contract completeness vs. DX,
  build-vs-adopt calls, when to use Context vs. plain composition, when an
  override is warranted vs. a smell. Advice should sharpen that narrative,
  not just push toward "more components" or "more trendy tooling."
- **Open decisions above are genuinely open** — weigh in on them with
  reasoning, don't assume either the VE or Panda code currently in the repo
  reflects a final choice.
