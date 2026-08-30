---
id: ADR-0007
title: Two system tiers — treatments and roles
status: proposed
date: 2026-07-19
deciders: [Mary San Agustin]
tags: [tokens, theming, architecture, motion, api-design]
supersedes: null
superseded_by: null
---

# ADR-0007 — Two system tiers: treatments and roles

**Terminology update (2026-08-27):** this ADR originally called the second
tier "assignments." Renamed to **roles** — the word was already carrying the
real meaning (`Text`'s `role` prop, `TypographyRoles`) in half the system
while "assignments" carried it in the other half, two words for one concept.
"Roles" also generalizes cleanly to what it always described: not just which
face plays a typographic job, but which *context* a treatment plays a part
in — Luster is one treatment given three roles (`brandSphere`, `hairlineRule`,
`cardHover`), the same relationship as one typeface given the `inlineEmphasis`
role. The word "assignment" is retired from this system's vocabulary
entirely; every mention below is updated to match, except where it describes
history (the Context section, dated examples) rather than the current model.

## Context

The theme-revision handoff (`docs/theme/theme-revision-decisions.md`) proposed adding a
`luster` group to the shared theme contract — an animated iridescent gradient,
with every theme supplying its own angle, speed, size, blend, and stops.

`luster` is Pearl's, for a specific brand object (a nacre sphere) and a specific
material metaphor. Tahitian has `overtone` — alpha teal/violet stops over
grayscale photography at `blend: screen`, imagery only. Freshwater's proposed
`wash` — a stationary near-white tint marking semantic regions — and South
Sea's proposed `glow` were the handoff's placeholders for the same slot; as of
2026-08-28 neither has shipped as an extension treatment (South Sea's role
table states "No effect treatments" outright, and Freshwater has no roles
file yet). **Update 2026-08-29: Freshwater's `wash` has since shipped**, with
a `freshwater.roles.ts` role table assigning it to `cardHover` (see
`docs/theme/theme-revision-decisions.md` §4) — the "as of 2026-08-28" snapshot
below is left as written since it's what motivated the decision at the time.
This is itself evidence for the decision below: two of four themes
having nothing to fill the slot with is the "no effect" case rule 1 exists to
make expressible, not a gap in this ADR's model. These are not four values of
one slot; they differ structurally, not just in value.

The handoff's own code shows what forcing them into one slot costs.
`Pearl Theme Contract.dc.html:508` hardcodes a theme name to escape the contract
it had just defined:

```js
lusterSurface: this.state.theme === 'tahitian' ? m.surface : 'linear-gradient(...)'
```

And two of four themes had an effect **fabricated** for them purely to fill the
hole. Freshwater's own written rules say cyan is `signals-only` — "a signal, not
decoration" — yet it renders as a large saturated decorative gradient card.
South Sea's is labeled `luster: 115deg · ecru.100 · sand.200 · champagne.300`, a
warm gradient nothing in its design language asks for.

**The tooling constraint turned a modeling error into invented content.**
`createTheme` is exact in both directions — verified by typecheck probe against
this repo (2026-07-19):

| Attempt | Result |
|---|---|
| Omit a contract slot | `TS2769` — rejected |
| Add a slot beyond the contract | `TS2769` — rejected |

Totality is the point of the contract (ADR-0005, two-tier tokens). But it means a shared slot
*cannot* express "Pearl has luster, South Sea has none." The only way to satisfy
the compiler is to invent a value. The fabrications weren't carelessness; they
were the schema working as designed against a schema-shaped mistake.

The same pressure applies to the handoff's `usage.*` axes (`density: 'airy'`,
`hoverBehavior: 'lift-and-shadow'`). These are real design constraints, but they are
not CSS values — declaring them in the contract mints custom properties no rule
consumes.

Underneath all of it is one unanswered question: **the system has no vocabulary
for the difference between what it provides and what a theme does with it.**

## Options considered

### Option A — One universal slot per effect (the handoff's approach, and the status-quo default)
Add `luster`, `surfaceFx`, `usage` to the contract; every theme fills them.

- **Pros:** uniform, greppable, type-checked across all themes; components could
  consume effects directly.
- **Cons:** forces invention — demonstrated twice before any real code. Themes
  with no effect are misrepresented as themes with a bad one. Names lie: calling
  Tahitian's `overtone` a "luster" erases the distinction the theme exists to
  express. Grows unboundedly — every new theme's signature becomes a permanent
  slot every other theme must answer.

### Option B — One parameterized mechanic, many configurations
Treat luster/overtone/wash/glow as one shared "animated surface effect" treatment
that each theme configures.

- **Pros:** genuinely shared implementation; one code path to maintain.
- **Cons:** they differ structurally, not by value — linear drift on surfaces
  with hover triggering vs. alpha stops over grayscale imagery at `blend:
  screen` vs. a stationary tint. Unifying them requires parameters so general
  the abstraction stops meaning anything, and reproduces Option A's escape-hatch
  problem one level down. This is what the `=== 'tahitian'` check *is*.

### Option C — Per-theme recipe overrides on shared components
Components expose variant hooks; each theme supplies styling for them.

- **Pros:** effects reach components without composition plumbing.
- **Cons:** pushes theme-specific knowledge into the component layer, which
  the override contract (ADR-0003) deliberately keeps out. Every component gains surface area for
  effects most themes don't have. Still needs shared vocabulary for the hooks —
  reintroduces Option A's naming problem.

### Option D — Full composition tier (the handoff's "Law 1")
Themes own paddings, type sizes, and alignment too, so any layout template fully
reskins under any theme.

- **Pros:** maximal reskinning power; the handoff's live demo is genuinely
  impressive.
- **Cons:** much larger scope than the question at hand. Moves layout authority
  into the token layer — not a direct conflict with composition-over-configuration (ADR-0002, which governs
  component props, not tokens), but a real shift that deserves its own decision.
- **Deferred, not rejected** — see `Revisit if`.

## Decision

**Split the system into two tiers, mirroring the two-tier token architecture
(ADR-0005) one level up.**

**Treatments — what the system provides.** Named by what they *are*.
Theme-agnostic. Two kinds:

- **Canon** — required of every theme: the token contract, components,
  base motion. Deliberately lean; only what every design system needs. Not
  itself a "treatment" — that word is reserved for the theme-owned effects
  below, where it actually fits.
- **Extension treatments** — optional, theme-owned mechanics: Pearl's `luster`,
  Tahitian's `overtone`, Freshwater's `wash`, South Sea's `glow`. They exist only
  where declared. A theme with none is normal, not deficient. The **name belongs
  to the treatment** — naming an effect is part of owning it.

**Roles — what a theme does with treatments.** Named by what they're *for*.
Per-theme, keyed by role name, and every theme has a complete table:

- values for canon slots
- which treatment fulfills each role (a face for `inlineEmphasis`, Luster for
  `cardHover`) — one treatment may fulfill several roles; a role never
  fulfills more than one treatment
- placement and constraint per role (where it applies, where it's forbidden,
  numeric ceilings)
- idioms — behavioral patterns with house defaults, overridable
- a one-line, human-readable description of the theme's disposition (sits
  beside the role table, not inside it — it isn't a role)

The token tiers of two-tier tokens (ADR-0005) nest *inside* the treatments tier; they do not compete
with this split.

The deciding reason: a shared slot makes "no effect" inexpressible, and
inexpressible states get filled with invented ones. That already happened twice.

Four rules follow:

1. **A slot enters canon only if every theme can give it a value that still
   functions** — not merely one that type-checks. This distinguishes honest
   aliasing from fabrication:
   - `fontFamily.accent = sans` — emphasis text renders in sans. Functions. The
     theme is saying "we have no separate emphasis face," which is a real design
     statement, exactly as two-tier tokens (ADR-0005) intends `color.accent` set to a near-neutral
     ink for an ink-primary theme.
   - `luster = none` — nothing renders. The slot is inert for three of four
     themes. Fails.

2. **No privileged internal path.** First-party extension treatments are declared
   through the same public mechanism a downstream author has. If our own themes
   cannot express themselves through the public path, the path is inadequate and
   we find out before users do. Pearl's `luster` is the hardest case — three
   surfaces, two motion behaviors — and is therefore the acceptance test.

3. **Components must render correctly with zero extension treatments.** Effects
   are additive, applied through composition, never a dependency. This keeps a
   no-effect theme first-class and components theme-unaware (the override contract, ADR-0003).

4. **Defaults belong to roles, never to treatments.** Treatments do not
   default — they exist or they don't. A theme's role table may:
   - *Idioms* cascade. A theme that declares no hover idiom inherits the house
     one, because every interactive system needs hover feedback to do
     something. Silence means "the house answer is fine."
   - *Extension treatments* never cascade. South Sea inheriting Pearl's
     silver-marine iridescence would be the original bug wearing a new name.

5. **An extension treatment without at least one role is invalid.** A role
   pointing at it requires stating, at minimum, where it may apply, where it
   is forbidden, and what triggers it. A treatment nothing points to is a
   mechanic with no meaning — values and no intent — which is exactly the
   state the handoff shipped: Freshwater had luster *values* and a written
   rule that luster shouldn't be decorative, with nothing connecting them.

   Each role's `treatment` field is typed against the theme's own real
   treatment names (`keyof typeof pearlTreatments | keyof typeof
   pearlTypeTreatments` for Pearl) — a role pointing at a treatment that
   doesn't exist, or a misspelled name, fails to compile:

   | Case | Result |
   |---|---|
   | Role points at a real treatment | compiles |
   | Role points at a nonexistent/misspelled treatment name | compile error |

   **Accepted regression from the original mapped-type mechanism:** the
   original version of this rule (`{ [K in keyof C]: TreatmentAssignment }`)
   checked *both* directions — a treatment with no assignment also failed to
   compile. The role-keyed table only checks the direction above; a
   treatment declared in `pearlTreatments` that no role ever points to is a
   silent no-op, not a compile error. Traded deliberately for a flatter,
   role-named structure where `Text`'s `role` prop and the role table's keys
   stay in direct correspondence — see the terminology-update note at the
   top of this ADR. Revisit if an unreferenced treatment actually ships
   unnoticed.

## Canon grows by promotion, not accretion

Extension treatments are the proving ground. A mechanic enters canon only after
multiple themes independently demonstrate they need it with the same semantics —
at which point promotion is evidence-backed rather than speculative. This makes
"lean now, expandable later" a process instead of an intention.

Applied to the additions this revision proposed, canon grew by **zero**:

| Proposed | Verdict |
|---|---|
| `fontFamily.mono` | Not a role — a typeface classification. Belongs to the per-theme font primitives (two-tier tokens, ADR-0005, tier 1), which the contract's own comment at `theme.css.ts:161-163` already anticipated and never built. |
| `fontFamily.accent` | Passes rule 1, but which face plays a role is itself a theme distinction — it lives in the role layer, not canon. |
| `color.chrome.{bg,ink}` | Rejected. Not a new role: "the one loud cell per view" is a usage pattern of the existing inverse group, so adding it gives two ways to express one thing. (Also: do not use the word "chrome" in this system.) |

## Verified mechanism

Spiked end-to-end on 2026-07-19 — typecheck, `vite build`, emitted CSS inspected.

**Optional roles** were spiked against a hypothetical `defineTheme()` factory
that would deep-merge a `DeepPartial` over house defaults and hand
`createTheme` a complete object, keeping the contract total without typing it
out by hand. **Status (2026-08-28): not built.** No such factory exists in
source — each theme currently calls vanilla-extract's `createTheme` directly
in its own `*.css.ts` (e.g. `pearl.css.ts`, `tahitian.css.ts`). The spike below
still describes the verified underlying mechanism (`createTheme`'s inferred,
type-checked contract); `defineTheme()` itself is a proposed convenience
wrapper around it, not a shipped one.

**Extension treatments** use vanilla-extract's single-argument
`createTheme(tokens)` overload, which *infers* a contract from whatever object it
is given and returns `[className, vars]` — no pre-declaration. The spike used a
`defineTheme()` wrapper for illustration:

```ts
export const mistTheme = defineTheme({
  tokens: { color: { accent: '#7A9E8E' }, radius: { control: '999px' } },
  treatments: {
    dissolve: { speed: '400ms', blur: '8px', easing: 'cubic-bezier(.22,1,.36,1)' },
    grain: { opacity: '0.04' },
  },
});

mistTheme.ext.dissolve.speed; // typed; a misspelling is a compile error
```

but the underlying mechanism it wraps is just `createTheme(tokens)` itself —
this is what Pearl's actual `pearlTreatments` export does today (`pearl.css.ts`).

Confirmed in build output: four real custom properties emitted in their own
class, composed with the base theme class. The inferred contract is genuinely
type-checked — it does not degrade to `any`.

### Limit: build time, not runtime

`.css.ts` is evaluated at build time. Extension treatments are available to anyone
authoring themes **in source**. A theme arriving at runtime — JSON from a CMS, a
live theme editor — cannot mint new custom properties; `assignInlineVars` can
only re-value vars that already exist. Runtime theming is limited to canon plus
whatever treatments were compiled in.

### Extensibility for downstream authors

Because extension treatments have no shared shape, there is nothing to expand — a
downstream author declaring `dissolve` needs no fork and no upstream
coordination. Under Option A this would have been *impossible* without forking,
since contract expansion is type-blocked. Extensibility therefore argues for the
same boundary the fabrication evidence does.

Forking to expand canon remains legitimate — cloning is an intended use — but
carries a coordination tax worth naming: **adding a canon slot breaks every
existing theme until each fills it.** That is correct behavior (the compiler
asking "does Freshwater honestly have a dissolve?"), but it makes canon expansion
an all-themes edit rather than a one-file edit.

The rule for extenders: **bespoke to your brand → extension treatment, no fork, no
tax. Genuinely universal → propose canon, pay the tax, let the compiler enforce
that you meant it.**

## Tradeoffs

- **Positive:**
  - Downstream authors add bespoke treatments without forking.
  - "No effect" becomes expressible, which is what stops invention.
  - Names stay honest: `luster`, `overtone`, `wash`, `glow` — not four spellings
    of one word.
  - Canon stops growing every time a theme has an idea.
  - **DRY angle:** a treatment (`luster`) is declared once and given roles —
    with per-role tweaks — pointing at any number of `data-*` selectors (a
    brand sphere, a card's hover state, a secondary button), reusing
    ADR-0003's stable attributes as the addressing scheme. One declaration,
    many roles, instead of re-authoring the effect per component.
  - The role layer gives the planned MCP/RAG corpus
    (`project-brief.md:16`) something structured to read, and the planned
    no-raw-value lint rule (`project-brief.md:184`) something to enforce.
- **Negative / accepted costs:**
  - No single type enumerates every theme's treatments; discovering them means
    reading theme modules. Accepted — they are deliberately not interchangeable.
  - Effects reach the UI only via composition, so a showcase must opt in.
  - Theme authors write in two places: canon roles, and their own treatments.
  - Two tiers at the system level *and* two tiers within tokens is real
    conceptual load. Mitigated by the tiers being the same idea at two scales.
- **Neutral:**
  - Existing themes are unaffected — none currently declare treatments.
  - Whether a treatment is CSS-var-backed or compiled to static rules is left to
    each theme; only the boundary is fixed here, not the technique.

## Revisit if

- Three or more themes independently converge on the same mechanic with the same
  semantics — the promotion trigger. `wash` was the near-term candidate for this;
  it shipped 2026-08-29 as Freshwater's own extension treatment rather than a
  shared role (see `theme-revision-decisions.md` §4's "Update"), so the
  question is open again for whatever comes next.
- **The canon audit finds existing slots that fail rule 1.** Canon was authored
  before this ADR and has not been re-examined against it. Candidates for
  demotion: the five `*Inverse` tokens (a specific section-inversion technique),
  the sixteen sentiment tokens (a product-UI assumption an editorial system would
  not share), and the upper `text` variants. Demotion is breaking and wants its
  own ADR.
- Composition-only application proves too limiting — e.g. a treatment that must
  live inside a component's internals to work at all.
- The Option D composition tier is taken up deliberately; it would likely subsume
  this boundary.

## Convergent external work (2026-08-26)

Sanity's Design System Doc Spec (DSDS, `designsystemdocspec.org`, a draft
schema for machine-readable design system documentation) names a `Foundation`
entity kind: "domain governance through principles, scales, and motion
definitions." That is this ADR's role layer — `intent`, `guidance`,
`limits`, `forbid` on a role is domain governance through
principles, under a different name.

This is convergence, not inspiration, and the claim is checkable rather than
asserted: this project's role layer (named `pearl.assignment.ts` at the time,
renamed `pearl.roles.ts` on 2026-08-27 — see this ADR's terminology-update
note) and this ADR date to 2026-07-19/07-20 (commit history), a full month
before DSDS was surfaced to this project. The honest version isn't "arrived
first" — DSDS's own draft predates that date — it's that the two were
authored with zero awareness of each other and landed on the same shape. Two
people solving the same problem (structured, machine-readable context for a
design system an LLM must generate against, without hallucinating) reaching
for the same vocabulary is mild evidence the shape is load-bearing rather
than arbitrary.

**Not adopted.** DSDS is pre-1.0 (`0.15.2`), unendorsed by any standards body,
and young enough that its shape may still change under it. Swapping this ADR's
compiler-verified mechanism (rule 5's typed-`treatment`-pointer check — see
that rule's accepted-regression note for how this narrowed on 2026-08-27) for
compliance with a less stable spec would be a downgrade, not a maturation.

One piece is worth carrying forward regardless of DSDS's own trajectory:
`agentDocumentBlocks` — a parallel array of agent-only documentation blocks
living alongside human-facing ones on the *same* entity, rather than embedding
machine content inside human prose (or the reverse). That's a cleaner answer
than this project's own working assumption in `journal.md`'s "how lean can the
prose layer get" thread, and it's adoptable independent of whether the
manifest this ADR anticipates (`project-brief.md:16`) ever speaks DSDS itself.

**Revisit if:** DSDS reaches 1.0 with real multi-implementer adoption, at which
point emitting DSDS-shaped output from the role layer becomes a
migration question rather than a dependency question.

## Related

- ADR-0001 (styling engine) — vanilla-extract. `createTheme`'s totality is the
  constraint that makes this decision necessary.
- ADR-0005 (two-tier tokens) — this is the same idea one level up: treatments are
  named by what they are, roles by what they're for. The token tiers nest
  inside treatments rather than competing.
- ADR-0003 (override contract) — rule 3 preserves component theme-unawareness.
- ADR-0002 (composition over configuration) — governs component props, not
  tokens; Option D would test its edge.
- `docs/theme/theme-revision-decisions.md` — evidence base, the four themes' canonical
  sources, and the fabrication analysis.
