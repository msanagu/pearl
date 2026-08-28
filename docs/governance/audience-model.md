# Audience Model: Designer, Maintainer, Consumer

This system is designed for three distinct personas, with different needs, powers,
and mechanisms available to each. Conflating them leads to contradictory guidance
— this doc is the source of truth for which mechanism and responsibility belongs
to which persona.

**The relationship chain:** DS Designer proposes/iterates → DS Maintainer
reviews and canonizes into the single source of truth → DS Consumer receives the
result as a stable, versioned dependency. In a small team (or a solo project like
this one), one person may hold all three roles — but modeling them separately
matters for simulating how this functions at enterprise scale, and it mirrors
real-world design-system org structures, where "the person who iterates on a
component" and "the person with authority to approve what ships" are often
genuinely different people or committees.

**These lines blur, deliberately, in smaller organizations.** A designer
building feature work in code is routinely doing Consumer and Designer work in
the same sitting — composing already-shipped components for the feature at
hand (Consumer), and, where the feature's requirements outrun what exists,
sketching a new component or variant in their own feature-local code as they
work out what's actually needed (Designer). That local sketch isn't a
violation of the persona split; it's the Designer role happening in-place
rather than as a separate, dedicated exercise. The distinction that still
matters even here is *authority*, not *who*: a feature-local prototype stays a
proposal — informal, uncanonized — until whoever holds Maintainer authority
(even if it's the same person, later, in a more deliberate pass) reviews and
promotes it into the shared system.

## DS Designer

**Who:** works in design-in-code — prototypes new components, variants, or token
changes directly in the codebase (not a separate design tool), often in direct
response to real signal: a pattern of overrides converging on the same
`data-part`, user research, or direct feature-team feedback (see
design-in-code-canonization-loop.md for one way that convergence could get
surfaced). This is the "tip of the spear" role — closest to where real product
friction is first felt and translated into a concrete proposal.

**Relationship to the code:** works in a branch/proposal state — has the
technical fluency to write real component code, but does not have unilateral
authority to merge it into the canonical system. Iteration happens in the open
(a real branch, a real PR), not behind a closed design tool disconnected from the
codebase.

**How they operate:** builds working prototypes of new/changed components against
the existing token contract and philosophy docs, informed by the promotion
signals the Maintainer/MCP loop surfaces. Their output is a proposal, not a
release.

**What they're responsible for:** ensuring proposed changes stay consistent with
existing philosophy (composition rules, naming conventions, accessibility
standards) rather than introducing one-off exceptions — since anything they
propose is a candidate the Maintainer will evaluate against those same standards.

## DS Maintainer

**Who:** the org/team that owns the design system itself — forks or clones the
repo, or is the original org building it. Defines tokens, defines components,
defines theme values.

**Relationship to the code:** owns it outright. No "outside" to reach in from —
edits happen directly in the source.

**How they customize:** by directly editing theme implementation files
(`themes/*.css.ts`) against the shared token contract. See roadmap.md's
"theme-only reskinning" section — this is the mechanism that serves this persona.
No override system, no `data-part` targeting, no `className` passthrough needed —
those mechanisms exist for the *other* persona, not this one.

**What they're responsible for:** enforcing that component code never hardcodes a
raw value outside the theme layer (see roadmap.md's lint-rule requirement) — this
is what keeps reskinning possible for every maintainer/fork downstream.

## DS Consumer

**Who:** a feature team downstream in the org, consuming the design system as an
installed, versioned dependency. Does not fork or own the DS source. Cannot (and
should not) edit component or theme files directly.

**Relationship to the code:** external. The DS is "their" (the maintainer's) code,
installed as a package. Any customization has to happen from outside, without
modifying the installed source.

**How they customize:** via the override system —
see `foundations/override-patterns.md`:
- `data-component` / `data-part` attributes + consolidated `selectors` blocks —
  primary mechanism, for category-wide targeting (any card header, any alert icon)
- `className` passthrough — secondary mechanism, for single-instance overrides
- Both mechanisms exist specifically because this persona cannot fork or edit
  source — they need a sanctioned, stable contract to reach in from the outside.

**What they're responsible for:** targeting the documented `data-*` contract
rather than importing internal class name exports (explicitly disallowed in
foundations/override-patterns.md) — internal exports aren't a stable API and can break
silently on refactor.

## The happy path vs. the exception — and who owns the weight

**The happy path for a Consumer is composition, not override.** Most feature work
should be: compose existing components as-is, use `Stack`/`Row`/`Grid` for
feature/page-level layout, and get correct visuals, tokens, and accessibility for
free with zero targeting of component internals. This is the default, expected
workflow — the override system existing does not mean it should be reached for
routinely.

**A single-source-of-truth (SSOT) contract sits underneath this:** the Maintainer
owns visual/behavioral truth for every component. A Consumer overriding a
component via `data-part`/`selectors` is stepping outside that SSOT — deliberately
and visibly, not silently.

**That step is never free, and the Consumer owns the cost.** Reaching for an
override is not a neutral styling choice — it creates a standing maintenance
liability: if the Maintainer restructures a component's internal DOM, renames a
`data-part`, or changes a design token the override assumed, the override can
silently drift out of correctness with no compiler error to catch it (the DS
itself has no visibility into who overrode what downstream). The team that wrote
the override is responsible for noticing and fixing that drift — the DS
Maintainer owes no backward-compatibility guarantee to undocumented override
usage beyond the stability of the `data-*` contract itself.

**Consequence for how this gets used in practice:** overrides should be treated as
an explicit, reviewed exception — something a team can point to and justify
("we needed X, composition/theming couldn't provide it, here's the override and
here's who owns maintaining it") — not a routine styling tool. A one-off override
isn't forbidden; it's a normal, expected release valve for a real use case the DS
doesn't cover yet. The thing worth watching for is *convergence*: because every
override targets a stable, greppable `data-component`/`data-part` selector, a
lint rule or simple repo-scan could flag when the same selector/property gets
overridden across multiple independent teams — not to block it, but to surface
it as a candidate the Maintainer should evaluate for promotion into a real,
first-class variant or token. Treat that signal as a DS-evolution opportunity a
human still decides on, not a queue that gets auto-resolved.

## Why all three personas matter for this project's positioning

The **open-source / fork-and-reskin value proposition** (see roadmap.md) speaks to
the **Maintainer** persona — someone bootstrapping their own design system from
this one as a starting point.

The **override-patterns.md system** (`data-part` + `selectors`) simulates the
**Consumer** persona's real-world need — the enterprise scenario this project is
partly built to demonstrate judgment about: many downstream feature teams, no
shared repo access, needing a sanctioned way to customize without forking or
waiting on the DS team.

The **Designer** persona, and the override-convergence signal it can act on (see
design-in-code-canonization-loop.md for one concept-stage idea of how that
signal gets surfaced), is what makes this system's evolution a demonstrated
*process* rather than a static artifact — showing not just what the design
system is, but how it's meant to keep changing, and who is responsible for
proposing vs. approving that change.

All three are real, all three are documented, and they are not in tension —
they're answers to three different questions ("how do I make this mine," "how do
I adjust this without owning it," and "how does this system responsibly evolve")
asked by three different people.
