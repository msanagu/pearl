---
id: ADR-0007
title: Two system tiers — capabilities and assignments
status: proposed
date: 2026-07-19
deciders: [Mary San Agustin]
tags: [tokens, theming, architecture, motion, api-design]
supersedes: null
superseded_by: null
---

# ADR-0007 — Two system tiers: capabilities and assignments

## Context

The theme-revision handoff (`docs/theme-revision-decisions.md`) proposed adding a
`luster` group to the shared theme contract — an animated iridescent gradient,
with every theme supplying its own angle, speed, size, blend, and stops.

`luster` is Pearl's, for a specific brand object (a nacre sphere) and a specific
material metaphor. Tahitian has `overtone` — alpha teal/violet stops over
grayscale photography at `blend: screen`, imagery only. Freshwater has `wash` —
a stationary near-white tint marking semantic regions. South Sea has `glow` (placeholder).
These are not four values of one slot; they differ structurally, not just in
value.

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
Treat luster/overtone/wash/glow as one shared "animated surface effect" capability
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

**Capabilities — what the system provides.** Named by what they *are*.
Theme-agnostic. Two kinds:

- **Canon capabilities** — required of every theme: the token contract, components,
  base motion. Deliberately lean; only what every design system needs.
- **Extension capabilities** — optional, theme-owned mechanics: Pearl's `luster`,
  Tahitian's `overtone`, Freshwater's `wash`, South Sea's `glow`. They exist only
  where declared. A theme with none is normal, not deficient. The **name belongs
  to the capability** — naming an effect is part of owning it.

**Assignments — what a theme does with capabilities.** Named by what they're *for*.
Per-theme, and every theme has a complete one:

- values for canon slots
- role assignments (which face plays `emphasis`)
- application rules (luster on surfaces and imagery, never type)
- idioms — behavioral patterns with house defaults, overridable
- axes and mood — the structured, machine-readable layer

The token tiers of two-tier tokens (ADR-0005) nest *inside* the capabilities tier; they do not compete
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

2. **No privileged internal path.** First-party extension capabilities are declared
   through the same public mechanism a downstream author has. If our own themes
   cannot express themselves through the public path, the path is inadequate and
   we find out before users do. Pearl's `luster` is the hardest case — three
   surfaces, two motion behaviors — and is therefore the acceptance test.

3. **Components must render correctly with zero extension capabilities.** Effects
   are additive, applied through composition, never a dependency. This keeps a
   no-effect theme first-class and components theme-unaware (the override contract, ADR-0003).

4. **Defaults belong to assignments, never to capabilities.** Capabilities do not
   default — they exist or they don't. Assignments may:
   - *Idioms* cascade. A theme that declares no hover idiom inherits the house
     assignment, because every interactive system needs hover feedback to do
     something. Silence means "the house answer is fine."
   - *Extension capabilities* never cascade. South Sea inheriting Pearl's
     silver-marine iridescence would be the original bug wearing a new name.

5. **An extension capability without an assignment is invalid.** Declaring one
   requires stating, at minimum, where it may apply, where it is forbidden, and
   what triggers it. A capability with no assignment is a mechanic with no
   meaning — values and no intent — which is exactly the state the handoff
   shipped: Freshwater had luster *values* and a written rule that luster
   shouldn't be decorative, with nothing connecting them.

   This is enforced by the type system, not convention. Verified by spike
   (2026-07-19) — a mapped type over `keyof C` checks coverage in both
   directions:

   | Case | Result |
   |---|---|
   | Every capability assigned | compiles |
   | Capability declared, never assigned | `TS2322` |
   | Assignment for an undeclared capability | `TS2353` |

   Note the asymmetry that makes this safe: requiring an assignment cannot cause
   fabrication, because "forbidden everywhere except imagery" is always an honest
   answer. There is no equivalent of `luster: none` — you are stating scope, not
   inventing content. This points the same totality mechanism that produced the
   original problem somewhere useful: canon tokens must be filled with *values*;
   extension capabilities must be filled with *meaning*.

## Canon grows by promotion, not accretion

Extension capabilities are the proving ground. A mechanic enters canon only after
multiple themes independently demonstrate they need it with the same semantics —
at which point promotion is evidence-backed rather than speculative. This makes
"lean now, expandable later" a process instead of an intention.

Applied to the additions this revision proposed, canon grew by **zero**:

| Proposed | Verdict |
|---|---|
| `fontFamily.mono` | Not a role — a typeface classification. Belongs to the per-theme font primitives (two-tier tokens, ADR-0005, tier 1), which the contract's own comment at `theme.css.ts:107` already anticipated and never built. |
| `fontFamily.accent` | Passes rule 1, but role *assignment* is itself a theme distinction — it lives in the assignment layer, not canon. |
| `color.chrome.{bg,ink}` | Rejected. Not a new role: "the one loud cell per view" is a usage pattern of the existing inverse group, so adding it gives two ways to express one thing. (Also: do not use the word "chrome" in this system.) |

## Verified mechanism

Spiked end-to-end on 2026-07-19 — typecheck, `vite build`, emitted CSS inspected.

**Optional assignments** come from a `defineTheme()` factory, not from the
contract. The consumer supplies a `DeepPartial`; the factory deep-merges over
house defaults and hands `createTheme` a complete object. The contract stays
total, so the compile-time guarantee survives — it just doesn't have to be typed
out.

**Extension capabilities** use vanilla-extract's single-argument
`createTheme(tokens)` overload, which *infers* a contract from whatever object it
is given and returns `[className, vars]` — no pre-declaration:

```ts
export const mistTheme = defineTheme({
  tokens: { color: { accent: '#7A9E8E' }, radius: { control: '999px' } },
  capabilities: {
    dissolve: { speed: '400ms', blur: '8px', easing: 'cubic-bezier(.22,1,.36,1)' },
    grain: { opacity: '0.04' },
  },
});

mistTheme.ext.dissolve.speed; // typed; a misspelling is a compile error
```

Confirmed in build output: four real custom properties emitted in their own
class, composed with the base theme class. The inferred contract is genuinely
type-checked — it does not degrade to `any`.

### Limit: build time, not runtime

`.css.ts` is evaluated at build time. Extension capabilities are available to anyone
authoring themes **in source**. A theme arriving at runtime — JSON from a CMS, a
live theme editor — cannot mint new custom properties; `assignInlineVars` can
only re-value vars that already exist. Runtime theming is limited to canon plus
whatever capabilities were compiled in.

### Extensibility for downstream authors

Because extension capabilities have no shared shape, there is nothing to expand — a
downstream author declaring `dissolve` needs no fork and no upstream
coordination. Under Option A this would have been *impossible* without forking,
since contract expansion is type-blocked. Extensibility therefore argues for the
same boundary the fabrication evidence does.

Forking to expand canon remains legitimate — cloning is an intended use — but
carries a coordination tax worth naming: **adding a canon slot breaks every
existing theme until each fills it.** That is correct behavior (the compiler
asking "does Freshwater honestly have a dissolve?"), but it makes canon expansion
an all-themes edit rather than a one-file edit.

The rule for extenders: **bespoke to your brand → extension capability, no fork, no
tax. Genuinely universal → propose canon, pay the tax, let the compiler enforce
that you meant it.**

## Consequences

- **Positive:**
  - Downstream authors add bespoke capabilities without forking.
  - "No effect" becomes expressible, which is what stops invention.
  - Names stay honest: `luster`, `overtone`, `wash`, `glow` — not four spellings
    of one word.
  - Canon stops growing every time a theme has an idea.
  - The assignment layer gives the planned MCP/RAG corpus
    (`PROJECT_BRIEF.md:16`) something structured to read, and the planned
    no-raw-value lint rule (`PROJECT_BRIEF.md:184`) something to enforce.
- **Negative / accepted costs:**
  - No single type enumerates every theme's capabilities; discovering them means
    reading theme modules. Accepted — they are deliberately not interchangeable.
  - Effects reach the UI only via composition, so a showcase must opt in.
  - Theme authors write in two places: canon assignment, and their own capabilities.
  - Two tiers at the system level *and* two tiers within tokens is real
    conceptual load. Mitigated by the tiers being the same idea at two scales.
- **Neutral:**
  - Existing themes are unaffected — none currently declare capabilities.
  - Whether a capability is CSS-var-backed or compiled to static rules is left to
    each theme; only the boundary is fixed here, not the technique.

## Revisit if

- Three or more themes independently converge on the same mechanic with the same
  semantics — the promotion trigger. `wash` is the near-term candidate: a
  semantic-region tint may prove general beyond Freshwater.
- **The canon audit finds existing slots that fail rule 1.** Canon was authored
  before this ADR and has not been re-examined against it. Candidates for
  demotion: the five `*Inverse` tokens (a specific section-inversion technique),
  the sixteen sentiment tokens (a product-UI assumption an editorial system would
  not share), and the upper `text` variants. Demotion is breaking and wants its
  own ADR.
- Composition-only application proves too limiting — e.g. a capability that must
  live inside a component's internals to work at all.
- The Option D composition tier is taken up deliberately; it would likely subsume
  this boundary.

## Related

- ADR-0001 (styling engine) — vanilla-extract. `createTheme`'s totality is the
  constraint that makes this decision necessary.
- ADR-0005 (two-tier tokens) — this is the same idea one level up: capabilities are
  named by what they are, assignments by what they're for. The token tiers nest
  inside capabilities rather than competing.
- ADR-0003 (override contract) — rule 3 preserves component theme-unawareness.
- ADR-0002 (composition over configuration) — governs component props, not
  tokens; Option D would test its edge.
- `docs/theme-revision-decisions.md` — evidence base, the four themes' canonical
  sources, and the fabrication analysis.
