# Accessibility Standards

## Conformance target: WCAG 2.2 AA

WCAG 2.2 (published as a W3C Recommendation in October 2023) is the current, stable,
legally-referenced standard as of 2026 — this is what current accessibility law and
litigation actually cite, and it is not deprecated or superseded by anything final yet.
This system targets **WCAG 2.2 Level AA** as its baseline conformance goal for every
component.

## Where WCAG 3.0 stands (as of mid-2026) — awareness, not a target

WCAG 3.0 is real and in active development, but still a Working Draft (most recently
updated March 2026) — explicitly not ready for production compliance use. Projected
timeline: Candidate Recommendation around Q4 2027, final Recommendation 2028 or later.
No component or claim in this system should reference "WCAG 3.0 compliance" — that
standard does not yet exist in a citable, testable form.

**What's conceptually different in 3.0** (tracked for awareness, not implemented against):
- Moves from binary pass/fail (A/AA/AAA) to an outcomes/requirements-based model scored
  Bronze/Silver/Gold — Bronze is roughly equivalent to today's 2.2 AA.
- Shifts scope from "pages" to **"views" and "processes"** — a view is whatever content
  is actively in the viewport (a modal dialog counts as a discrete view); a process is a
  sequence of views completed in order. This maps naturally onto component-driven,
  single-page-app architecture — more naturally than the page-based 2.x model does.
- Expands coverage into cognitive and learning disabilities more seriously than 2.x's
  historically sensory/physical focus.

Meeting WCAG 2.2 AA now is explicitly the best preparation for WCAG 3.0 — a 2.2 AA
conformant system is already broadly aligned with 3.0's foundational Bronze tier, so
nothing built against the 2.2 baseline is wasted effort.

## Practical framing for documentation/portfolio use

> "Built to WCAG 2.2 AA, with an eye toward WCAG 3.0's shift from page-level to
> view/process-level conformance."

This signals awareness of where the standard is heading without overclaiming
compliance with something unfinished.

## Applied per-component (examples so far)

- **Alert** — `role="alert"` or `role="status"` with proper `aria-live` semantics so
  screen readers actually announce state changes.
- **Field** — coordinated `id` / `aria-describedby` / `aria-invalid` wiring between
  label, hint, error, and the wrapped input.
- **Icon** — inline SVG, accessible naming (or explicitly hidden from assistive tech when
  purely decorative).
- **Progress Bar** — `role="progressbar"` with `aria-valuenow` / `aria-valuemin` /
  `aria-valuemax` if implemented as a custom element (see markup-philosophy.md —
  decision deferred).
