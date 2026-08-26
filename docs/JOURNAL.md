# Journal

This is where I'm keeping the questions I don't have answers to yet — not
the decisions (those go in `docs/decisions/` as ADRs), the questions. Most of
`docs/` is written to be settled: a philosophy, a contract, a rule. This file
is deliberately the opposite. It's a record of what I'm still turning over,
written as I turn it over, including the parts where I change my mind.

I've spent years building for teams where the artifacts — Figma files, usage
docs, a wiki page explaining when to use which component — existed because
the people who needed them couldn't read code. That's less true now. A
teammate who can query the codebase directly, or an agent scaffolding a page
against it, doesn't need the same intermediary layer a human designer or PM
did. So I'm using Pearl to actually test how far that goes, rather than
assume the old artifact set just carries over unchanged.

## The thread I actually care about: how lean can this get

"Design in code" already did this once — it collapsed the static-mockup
layer. Figma and implementation used to be two separate places, and the gap
between "what was designed" and "what shipped" was invisible because nobody
was looking at both at once. Doing design *in* code closes that gap by
making there only be one place. (Longer version of this argument in
[`design-in-code-canonization-loop.md`](design-in-code-canonization-loop.md)
— that doc is about the override-detection payoff specifically, but the
premise is the same one I'm generalizing here.)

I started this thread asking how much *usage-guidance* prose could move
into stories instead of living as a parallel `.md` file. I want to push it
further than that now: **what's the actual minimum viable set of
human-managed prose artifacts this system needs — full stop — once I stop
assuming "write a doc" is the default response to a decision?**

The test I'm applying to every file in `docs/`: if this document's content
is *derivable from the code* — a prop shape, a composition pattern, a
selector contract, anything TypeScript or a story already states as fact —
then the markdown copy of it isn't documentation, it's a second system I
now have to keep from drifting against the first. It doesn't earn its
keep by being thorough. Thoroughness there is a cost, not a feature — every
one of those files is a place code and prose can quietly disagree, and
nobody notices until someone acts on the stale one. I'd rather have zero
docs on a topic than two answers to the same question that don't agree.

What I don't think collapses, because it isn't derivable from the code no
matter how good the code is:

- **Why**, not what. An ADR records a decision that was made *against*
  rejected alternatives — Panda CSS considered and passed over, Tailwind
  ruled out as hostile to the override philosophy. None of that reasoning
  exists anywhere in the shipped code; the code only shows what won. That's
  the actual test for "does this doc need to keep existing": can you
  reconstruct its content by reading the source? If yes, it's restating. If
  the answer requires knowing what was rejected and why, prose is the only
  place that can live.
- **Constraints from outside the repo.** "Storybook has to double as a
  future RAG corpus" isn't inferable from Storybook config — it's a fact
  about intent that shapes how I write stories, and it has nowhere else to
  live but prose.

What I now think should be actively cut, not just migrated:

- **`composition-patterns-examples.md`.** A well-titled story with real
  argTypes shows the same `<Card><Card.Header/></Card>` pattern, live and
  compiling. The prose version isn't adding information — it's a snapshot
  of the code that goes stale the moment the component changes and nobody
  remembers to update the doc.
- **`override-patterns.md`'s worked examples.** The `data-component`/
  `data-part` *contract* is a decision (why it exists, why not `className`
  alone) — that's ADR-shaped and stays. The hand-written selector examples
  demonstrating how to use it are not decisions, they're usage, and usage
  is exactly what a story can show more honestly, because a story has to
  actually work.
- Anything titled "philosophy" or "guidelines" that's really just a prose
  description of a prop contract already fully expressed in a component's
  types. If the types are the source of truth, the doc restating them isn't
  a second source of truth, it's a liability wearing documentation's
  clothes.

What survives by this test, from a first pass over `docs/`: the ADRs
(rejected-alternative reasoning, non-derivable), `visual-language-brief.md`
and `why-pearl-name.md` (intent/identity, not code-shaped at all),
`OPEN_QUESTIONS.md` and this file (explicitly *not* claiming to state
settled fact). Everything else is a candidate for either deletion or a
migration into stories — I haven't gone file-by-file yet; that's the actual
next step, not a judgment I want to make in the abstract before Card and
Field exist to test it against.

**Graduated (2026-08-26) — the `@example` half of this, specifically:**
ADR-0009. Seven components had a hand-written `@example` duplicating a story
that already demonstrates the same usage, compiled and checked, where the
JSDoc copy was neither. Resolved: stories are the usage reference, JSDoc
states what isn't derivable from the code or a story and stops there. The
broader file-by-file docs migration this section describes is still open —
this is one instance of the pattern settled, not the whole thread.

## Other things I'm watching, lower priority for now

- Whether Storybook-as-corpus (the future MCP/RAG phase) changes *how* I'd
  write a story versus how I'd write it for a human reader only — or
  whether a story good enough for a human is already good enough for that,
  and the abstraction collapses there too.
- Whether the token contract needs anything beyond what TypeScript already
  enforces, or whether that's another instance of the same instinct: don't
  add a machine-readable layer until the code's own types stop being enough.

## Notes to self

- If a thread here gets resolved, it graduates — to an ADR if it's a real
  decision, to `OPEN_QUESTIONS.md` if it's a tracked default. It doesn't
  just sit here marked done.
- The point of this project isn't to arrive at "collapsing docs into code is
  the right call for every design system." It's to actually push on it with
  a real one and be honest in public about where it held up and where it
  didn't.
