# Design-in-Code as a Canonization Loop (MCP Phase — Concept Capture)

## The core insight

"Design in code" collapses design and implementation into a single medium: source
control. When design decisions live in Figma and implementation lives in a
separate codebase, the gap between them is invisible and untraceable — nobody can
systematically see how often feature teams are working around the design system,
because that workaround happens in a place (application code) the DS team doesn't
routinely observe.

When everything — the design system itself *and* every feature team's usage and
overrides of it — lives in code, that gap becomes observable. Override usage is
no longer a workaround happening in the dark; it's a Git-trackable signal.

## How this closes the loop from audience-model.md

`audience-model.md` establishes that an override is a costed exception, and that
repeated overrides across teams are a signal the Maintainer should consider
promoting something to the DS proper. As originally written, that promotion
signal depends on a human noticing the pattern — someone has to happen to see
that three different teams independently overrode the same `data-part` for the
same reason.

**The MCP server (see original architecture notes: GitHub-aware, branch-aware,
polls/ingests source across repos) is positioned to detect this automatically,**
not rely on a human noticing:

- Scan consuming repos/branches for `data-component`/`data-part` targeting
  patterns (via the `selectors` blocks in feature-level `.css.ts` files)
- Detect when the same component/part is being overridden for the same property
  across multiple independent teams or repos
- Surface this as a flagged candidate — "3 teams have independently overridden
  `[data-component="card"][data-part="header"]` background color in the last
  quarter" — rather than requiring the Maintainer to have organically noticed it

## "Tip of the spear" framing (the blog thesis)

Feature teams, working under real deadline pressure on real product problems, are
the ones who first encounter the gap between what the DS provides and what a
feature actually needs. Their overrides aren't a governance failure — they're the
earliest, most concrete evidence of where the design system's coverage is
incomplete. In a design-in-code world, that evidence is naturally captured as a
byproduct of normal feature work (nobody has to file a report; they just write
code, as they were always going to), and the MCP server's job is to mine that
byproduct and route it into the DS backlog automatically.

This reframes design system evolution: instead of the DS team guessing what to
build next, or waiting for teams to formally request features, the system
**bubbles up real, evidenced demand from the actual point of contact with product
work** — feature teams are effectively doing continuous, unintentional user
research on the DS's gaps, and design-in-code is what makes that research
legible and aggregable instead of scattered and invisible.

## Status

This is a **concept captured for the future MCP-server phase**, not yet
architected or built — the design system and its override contract need to exist
and be in real use first. Flagging here so the idea isn't lost, and because this
is the intended flagship blog topic tying together the design system, the
override governance model, and the MCP server phases of this project into one
coherent narrative arc:

**Design system → override contract with owned cost → design-in-code makes
override usage observable → MCP server detects convergent override patterns →
automatic, evidence-based DS backlog signal → "tip of the spear" model of DS
evolution.**
