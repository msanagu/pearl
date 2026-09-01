# The Record

How Pearl is built, in short — the conventions the system commits to, and the
ones still being tested on it. Each was worked out in a dated design note with
the alternatives weighed and the conditions that would reopen it.

**Adopted** conventions would take a concrete reason to reverse, not a mood.
The ones **under evaluation** are approaches taken up on a real system to find
out whether they hold up — a reversal there is the method working, not a failure.

---

## Adopted

### Styling engine — vanilla-extract

**accepted · July 2026**

Chosen over Panda CSS, Tailwind, and runtime CSS-in-JS. Two things drove it.
Pearl's thesis is a TypeScript-enforced, forkable token contract — a theme that
omits a required token must fail to compile — and vanilla-extract's
`createThemeContract` + `createTheme` model that completeness guarantee
natively: the contract is one artifact, each theme is a separate artifact the
compiler checks against it. And it's zero-runtime — plain compiled CSS, nothing
generating or injecting styles in the browser the way CSS-in-JS does; theme
switching is a class swap plus a CSS-variable cascade, so it carries no runtime
style-recalculation cost either.

Panda's completeness guarantee is weaker (one config object, no second artifact
verified against a schema) and its atomic, `@layer`-wrapped output would make the
override contract engine-specific. Tailwind was the most familiar option and the
worst fit — utility-class markup pushes styling back into the markup and
leans on layer and source order for specificity, working against both the markup
philosophy and the override contract. The accepted cost: vanilla-extract doesn't surface
documented, filterable token autocomplete on its own, so there's a wrapper layer
(`src/tokens.ts`) — hand-maintained today, with no generator producing it from
the contract yet.

### Composition over configuration

**accepted · July 2026**

Every prop a component exposes is permanent API surface — something to document,
test, keep stable, and support indefinitely. Configuration-first components
accumulate props without bound (`hasIcon`, `iconPosition`, `showHeader`,
`withDivider`…), one per use case the author happened to foresee, until the API
is a configuration language nobody can hold in their head. Pearl keeps that
surface deliberately small: the first answer is always composition — compound
sub-components or plain `children` — building UI from parts already in the
system rather than new props.

A prop earns its place only when repeated real use shows the component itself
has to make a decision that depends on its content — never on spec. So Button
has no `icon`/`iconPosition` prop (icons compose as children); Alert's `heading`
stays a prop because the icon's position depends on whether a heading is there;
Card's `Header`/`Body` are plain namespaced children with no shared state. Where
a component must hand data to a child (Field injecting `id`/`aria-*`), it uses a
render prop, not `cloneElement` — explicit at the call site. The cost is
judgement, and call sites a little longer than a kit that ships every prop up
front.

### Downstream override contract — a stable styling hook for feature teams

**accepted · July 2026**

A team that installs Pearl as a dependency can't fork it, but still hits cases
where a component needs adjusting from the outside. The sanctioned way is a
stable `data-part` attribute every component renders, targeted from one
consolidated selector block per feature — not inline styles, not `!important` on
a guessed class, and not the library's internal generated class names, which are
an implementation detail that breaks silently on refactor. (`className`
passthrough stays available for genuine one-off, single-instance cases.)

Two things fall out of routing every override through one named hook. It's
greppable: the same override recurring across several independent teams is a
readable signal that the system itself should grow a real variant or token — and
that's cheap to lint for. And composition stays the default — an override is a
costed, visible exception, and the team that writes one owns keeping it correct
when the component's internals move (the contract guarantees the `data-part`
names, nothing around them).

### Dependency stance — prefer headless, build by default

**accepted · July 2026**

Anything without hidden algorithmic or invisible-until-broken complexity (Button,
Card, Alert, Tag, Field, layout primitives) is built in-house. For the hard
problems — focus traps, viewport collision math, virtualization, drag physics,
listbox ARIA — a dependency may be adopted, and the strong preference is
headless: unstyled behaviour/logic/a11y primitives (Radix, Zag.js, TanStack,
Floating UI, dnd-kit) that leave rendering and styling entirely to us. Anything
that assumes Tailwind is out.

The one place that softens is a few genuinely heavy components — a data grid,
charting — where the feature surface is large enough that a more opinionated,
less-than-headless dependency can be the right call: the cost of overriding its
styling is real, but sometimes clearly worth the robust, proven functionality it
brings out of the box. That's a per-component decision made at implementation
time against a specific library, not a blanket rule — and even then, the markup
semantics and the override contract stay ours.

### Token conventions — a semantic tier components build against

**accepted · July 2026**

Two tiers. **Primitives** are the raw values — a hue ramp, a step on a spacing
scale — named for what they are. **Semantic tokens** sit on their own tier
above them, named for the job they do (`surface`, `border`, `text`, `accent`),
and components read _only_ these. Keeping the two apart is the point: the
mapping from a semantic token down to a raw value can be re-tuned, swapped, or
re-pointed per theme without editing a component.

Each semantic token is also scoped to a job — a text color, a border color, a
surface — so the combinations that reach the screen are ones designed to go
together, which is where accessible contrast comes from rather than being bolted
on afterward. Sentiment tokens follow the same logic: keyed by meaning
(`positive` / `negative`, not `success` / `danger`), with the meaning→color
mapping living in the theme, so a market that reads red as "up" re-points one
mapping and every metric in the product follows. Naming stays deliberately
small — one word per step of prominence, no synonyms — so learning one group
teaches the rest.

---

## Under evaluation

### Per-theme visual extensions

**proposed · July 2026**

Each theme should be able to bring visual character the shared system doesn't
define — Pearl's iridescent sheen on its brand mark and card hovers, Tahitian's
tinted overlay on photography. The first attempt gave the shared contract a
single slot for "the theme's effect", which forced every theme to fill it:
themes with no such effect got one invented just to satisfy the structure, and
the handoff code had to hard-code a theme name to wriggle out of the contract it
had just written.

The fix is to treat these as opt-in extensions. A theme declares only the
effects it actually wants and names where each one is allowed to apply; a theme
with no signature effect is a valid, expressible state rather than a gap. (This
independently landed on the same structure an emerging design-system spec
formalized a month later — a small signal the shape is sound.) Still proposed —
the open question is whether it holds up as more themes are authored or
collapses into something simpler.

### Machine-readable manifest — and stories as the usage context

**proposed · August 2026**

The bet: a system built for machine legibility from the start keeps a coding
agent accurate with less retrieval scaffolding than one that bolts RAG onto
human-only docs after the fact. So the build generates manifest JSON and an
`llms.txt` from the same source that drives the components and themes — the
component contracts, token roles, and usage rules as structured data an agent
reads directly. Its shape borrows from the conventions taking hold in emerging
standards for machine-readable design systems (Sanity's
[Design System Doc Spec](https://designsystemdocspec.org) is the closest) rather
than being invented — the structure without the dependency or a version to
track, the same adopt-the-idea logic as the dependency stance. And for usage:
the Storybook stories are written once for the docs a person reads, then
surfaced through the manifest for an agent — one set of real, compiled,
type-checked examples, with no hand-written `@example` blocks to recreate or
keep in sync.

A first generator ships today. Whether it actually makes an agent more accurate
is being measured, not assumed — the
[playground](https://msanagu.github.io/pearl-playground/) runs generation against
a real package install, and those runs are logged in the open (`docs/playground/`)
as they happen. It's early, and no single run is a formal benchmark, but the
evidence is accumulating in public. The standards the shape's structure leans on
could also still move.

### Color — authored for consistency, contrast enforced by measurement

**proposed · August 2026**

Color is authored in OKLCH for perceptual consistency: across four themes, steps
and hues that look evenly related need to actually be evenly related, and a
perceptual color space is what makes that hold without hand-tuning every value.
What OKLCH doesn't do is _guarantee_ contrast — numeric testing showed that
holding lightness fixed and sweeping hue still moves WCAG contrast enough to
cross the AA line. So contrast is enforced on its own terms: zero-dependency
math, run on the actual foreground/background pair rather than a single token,
in Vitest or a Storybook panel or a CLI. And each theme declares only the color
steps a real role consumes — color is the easiest place for a design system to
sprawl into a thousand-swatch catalog nobody can hold in their head, so the
reductive instinct is a first-class constraint.
