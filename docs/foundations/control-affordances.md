# Control Affordances

How a control announces that it *is* a control — before anyone touches it.

## The rule: a control carries its own boundary at rest

Every interactive control that occupies a box — every `Button` variant, in every
theme, in every mode — must render a visible boundary in its **resting** state.
Fill it, border it, or both; but do not ship a control whose box only appears on
`:hover`.

This is a system-wide invariant, not a per-theme aesthetic call. A theme is free
to decide *how* quiet that boundary is (Tahitian's secondary is a bare 1px
neutral hairline on a transparent fill — about as quiet as it gets). It is not
free to decide the boundary is absent.

The failure mode this exists to prevent is a control that is visually nothing but
its label until the pointer arrives — what the rest of this doc calls a
**text-only-until-hover** control.

## Why: two separate failures, one cause

### 1. Invisible box, invisible padding — alignment becomes guesswork

A button's box is wider than its label by its horizontal padding (`space.lg` on
both sides, in most themes). When the box is invisible at rest, so is the
padding — and the only thing a designer or a downstream engineer can see to align
against is the glyphs.

So they align the glyphs. They line the button's text up flush with the body copy
beneath it, or with the label of a field above it, and everything looks correct
until the button is hovered — at which point the real edge appears `space.lg`
outside the column everything else is aligned to. The layout was never wrong; it
was aligned to a proxy for the box instead of the box.

The complaint this arrives as is *"I can't align this button"*, and it is
accurate. There is genuinely nothing on screen to align to. A resting border
fixes it outright: the padding is now legible, the optical edge and the layout
edge are the same edge, and the decision "flush the box, or flush the text?"
becomes a decision instead of an accident.

This matters most where controls sit in a column with non-controls — a form's
submit under its fields, a CTA under a paragraph, an action under a card's body.
That is most places.

### 2. Text-only reads as a link — and the ambiguity spreads

A control rendered as bare text on a surface is, to a reader, a link. That is
what bare interactive text has meant on the web for thirty years, and no amount
of `<button>` in the markup changes what the pixels say.

The cost isn't only that the button is mistaken for a link once. It's that the
two affordances stop meaning anything **on the page as a whole**: once bare text
is sometimes a button, the reader can no longer trust that the *actual* links are
links, and starts hover-probing text to find out what is interactive. Both
signals degrade together — this is why "just this one variant" is not a contained
exception.

Keep the split clean:

| Affordance | Reads as | Signals |
|---|---|---|
| Bordered / filled box, at rest | Button | An action happens here, on this page |
| Bare text (underline / accent color) | Link | Navigation — you will end up somewhere else |

If a design genuinely wants a text-only action — a tertiary "Cancel", an inline
"Learn more" — that is a request for a **link-styled** element, not a button
variant with its edges removed. Give it link affordances (underline or accent
color at rest) and, if it performs an action rather than navigating, keep it a
`<button>` in the markup for keyboard and AT semantics while it wears link
clothing deliberately. `Link` — not `Button` — owns the text-only look: it is
always an `<a>`, so a text-only action borrows its class onto a `<button>`
rather than becoming a link in the markup.

## Hover is a state change, not the arrival of the control

The corollary. Since the box is already visible at rest, `:hover` no longer has
to introduce it — it only has to confirm the pointer is on target. That frees
hover to be a genuinely small move, and it means the control does not "pop" into
existence under the cursor:

- **Light modes** can usually step the border one rung up the neutral ramp
  (`color.border` → `color.borderStrong`).
- **Dark modes** often can't, because a border faint enough to be quiet at rest
  is already near the top of the usable ramp. Lift a low-alpha neutral wash
  instead, and bring the label from `color.textSubtle` up to `color.text` — the
  label's value shift reads at a glance even where a 1px border's contrast
  doesn't.

Either way, the resting boundary must be *visible*, not merely present.
`color.border` over a near-black background can be under 1.4:1 — technically a
border, functionally no edge at all, and it fails this rule exactly the way
`transparent` does. Check the resting boundary against the surface it will
actually sit on and aim for something a person can see; `color.borderStrong` is
the usual answer in dark modes.

## Where this is enforced

- [`src/components/Button/Button.css.ts`](../../src/components/Button/Button.css.ts) —
  the base recipe gives `secondary` a `1px solid ${color.border}` at rest, and
  `primary` a matching `1px solid transparent` so both variants share one border
  geometry and one height.
- [`src/themes/tahitian.css.ts`](../../src/themes/tahitian.css.ts) — the theme
  that got this wrong first, and the worked example of fixing it. Its dark-mode
  `secondary` drops the base fill (a `color.surface` fill vanishes when the
  button sits on a `color.surface` panel) but keeps — and strengthens — the
  border, rather than dropping both.

A theme override that sets a control's resting `border` to `transparent` without
supplying a fill in the same rule is the shape of this bug. Look for it there.

## Related

- [`component-philosophy.md`](./component-philosophy.md) — "Smart defaults, always
  escapable"; a theme override is an escape hatch, and this is one of the few
  invariants it may not escape.
- [`override-patterns.md`](./override-patterns.md) — the `data-component` /
  `data-variant` contract these theme overrides are written against.
- [`accessibility-standards.md`](./accessibility-standards.md) — WCAG 2.2 AA is
  the conformance target; 1.4.11 Non-text Contrast covers control boundaries that
  are load-bearing for identifying the control.
