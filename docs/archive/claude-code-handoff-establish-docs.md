# Claude Code Handoff — Establish Philosophy Docs

## Context

This is a personal design system project (React + TypeScript + Vite + Storybook,
styled with vanilla-extract). Before any further component work, I need a set of
foundational philosophy/convention docs established in the repo as the binding
source of truth for everything built going forward.

## Task

I'm attaching / providing the following markdown files. Place them at:

```
docs/philosophy/
  component-philosophy.md
  naming-conventions.md
  spacing-system.md
  typography.md
  markup-philosophy.md
  accessibility-standards.md
  composition-patterns-examples.md
  override-patterns.md
```

Steps:

1. Create the `docs/philosophy/` directory structure if it doesn't exist.
2. Add each file exactly as provided — do not summarize, condense, or rewrite the
   content. These represent deliberate decisions already made; treat them as final,
   not draft.
3. Create one additional file, `docs/philosophy/README.md`, that serves as an index:
   a short one-line description of each doc plus a link to it, so there's a single
   entry point for both future Claude Code sessions and human readers.
4. After adding the docs, read through all of them and confirm back to me:
   - Any internal contradictions you notice between docs
   - Any cross-references between docs that point to a file/section that doesn't
     actually exist as described
   - A brief summary (a few sentences) of the core conventions, to confirm you've
     correctly absorbed them before we build anything against them

## Important

- Do not start building or modifying any components in this session — this is
  strictly a documentation-setup step.
- Do not infer, add, or "fill in" any convention not explicitly stated in the
  provided docs. If something feels like a gap (e.g., a convention area not yet
  covered), flag it as a question rather than deciding it yourself.
- These docs are meant to be read by future Claude Code sessions as binding context
  before any component work — treat this session as laying that foundation.

## Files to add (content follows / attached)

- component-philosophy.md
- naming-conventions.md
- spacing-system.md
- typography.md
- markup-philosophy.md
- accessibility-standards.md
- composition-patterns-examples.md
- override-patterns.md
