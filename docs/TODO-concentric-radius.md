---
id: TODO-concentric-radius
title: Concentric radius — outer = inner + gap
status: proposed
date: 2026-08-28
deciders: [Mary San Agustin]
tags: [radius, tokens, theming, Button, Card, Input, Field]
supersedes: null
superseded_by: null
---

# TODO — Concentric radius (`outer = inner + gap`)

**Steps 2-4 partly done (2026-08-28). The rule is live on Card.**

Shipped:
- Pearl's `control` is `12px` (was the `999px` pill).
- `Field`/`Input` insets derive from `radius.control` (see the Field entry under
  Component work).
- **`radius.nesting` is a real contract token** — Decision 7 resolved, see below.
- **`Card` takes a `padding` prop (`sm`/`md`/`lg`) and derives its own radius**
  from `calc(radius.control + radius.nesting * padding)`. `Card.Header`/`Body`
  read the root's padding from a custom property, so they follow the variant
  without Context.

Still open, and they matter:
- **`Alert` and the Docs template still read the static `radius.surface`.** They
  now visibly disagree with Card on any rounded theme. This is the top of the
  remaining work — see Component work.
- **Card's default padding stayed `lg`**, not `md` as Decision 1 leaned. Pearl's
  default card is therefore **36px**, up from its authored 16px. Decision 1 is
  still a live design call, now with something real to look at
  (`Card` → *Padding Spectrum* in Storybook).

## The rule

When one rounded box sits inside another with padding between them, the two arcs
stay parallel only if:

```
outer radius = inner radius + gap
```

Where `gap` is the padding between the inner element's edge and the outer
element's edge. Any other pairing makes the curves converge or diverge, which
reads as sloppy at small sizes and as a mistake at large ones.

Themes whose identity is hard-edged (South Sea, Tahitian — `control: 0px`,
`surface: 0px`) are **exempt**: 0 stays 0 at every nesting level. The rule is
opt-in per theme, not universal. It applies to Pearl and to Freshwater.

## Where the system stands today

Radius tokens and the boxes that consume them:

| Token | Consumers |
|---|---|
| `radius.control` | [Button](../src/components/Button/Button.css.ts#L28), [Input](../src/components/Input/Input.css.ts#L11) |
| `radius.surface` | [Card](../src/components/Card/Card.css.ts#L19), [Alert](../src/components/Alert/Alert.css.ts#L15), [Docs template](../src/templates/Docs/Docs.tsx#L92) |
| `radius.full` | [Tag](../src/components/Tag/Tag.css.ts#L11), [XButton](../src/components/internal/XButton.css.ts#L18) |

Padding on the outer boxes: `Card.Header` / `Card.Body` are both `space.lg`;
`Alert` is `space.md`. Neither is configurable — both are hardcoded in the
`.css.ts`.

Control height is a single fixed value per theme (`controlHeight.md`) — Button
and Input have no `size` prop — so a theme's *effective* control radius is one
number, not a per-size family. That is what makes this tractable.

### What the numbers say

`min(control, controlHeight.md / 2)` is the effective inner radius — the `min()`
matters only for a pill, where a `999px` token paints at `height / 2`.

Current state (Pearl updated 2026-08-28; its pre-pivot row kept for the
reasoning it carries):

| Theme | `control` | `controlHeight.md` | Effective inner | Card padding (`lg`) | **Concentric outer** | Current `surface` |
|---|---|---|---|---|---|---|
| Pearl | `12px` | 2.625rem (42px) | **12px** | 24px | **36px** | 16px |
| Pearl *(was)* | `999px` | 2.625rem (42px) | *21px* | 24px | *45px* | 16px |
| Freshwater | `6px` | 2.5rem (40px) | **6px** | 24px | **30px** | 10px |
| South Sea | `0px` | 2.5rem | 0px | 24px | 0px (exempt) | 0px |
| Tahitian | `0px` | 2.5rem | 0px | 28px | 0px (exempt) | 0px |

**This is a theme-value change, not just a refactor.** Every rounded theme's card
radius grows substantially. The refactor is worthless without accepting that
(or moving the other lever — see Decision 1).

The rule cannot run inward for Pearl as authored: `16px − 24px` is negative.
Once card padding exceeds the surface radius, concentricity is only reachable by
growing the radius or shrinking the padding.

### Padding, not control radius, is what dominates the outer number

**Noted 2026-08-28: Pearl's controls are likely pivoting off the true pill
(`999px`) to a real rounded-rect radius.** That removes the ugliest number from
the table above, but it moves the outer radius far less than it looks like it
should — because `gap` is the larger of the two addends:

| Pearl `control` (post-pivot) | + `lg` padding (24px) | + `md` padding (16px) |
|---|---|---|
| `8px` | 32px | 24px |
| `10px` | 34px | 26px |
| `12px` | 36px | 28px |
| `16px` | 40px | 32px |

The floor is set by the padding alone: with `Card`'s current `space.lg`, **no
concentric card can be tighter than 24px**, whatever the control does. Pearl's
current 16px card is only reachable by dropping card padding to `md` *and*
control radius to ~0 — which is a different theme.

So the pivot simplifies the mechanism (see the note on `controlEffective` below)
but does **not** resolve Decision 1. The live question is now "which card
padding, and is a >=24px card acceptable for Pearl?", not "how do we cope with a
pill?"

## Proposed mechanism

Two contract additions, then one formula everywhere. No runtime JS, no
measurement — all of it resolves in CSS.

### 1. `radius.controlEffective` (new contract token)

The pill-resolved inner radius. Each theme authors it next to `control`:

```ts
// pearl.css.ts
const pearlControlHeight = { sm: '2.125rem', md: '2.625rem', lg: '3rem', xl: '3.5rem' };
const pearlRadius = {
  control: '999px',
  controlEffective: `min(999px, calc(${pearlControlHeight.md} / 2))`, // → 21px
  surface: /* derived, see below */,
  full: '9999px',
  nesting: '1',
};
```

`min()` inside `calc()` handles the pill case without any theme having to
hand-compute a px value, and it keeps tracking `controlHeight.md` if a theme
retunes its density.

**If Pearl drops the pill, this token gets cheap rather than unnecessary.** With
no theme setting `control` above `controlHeight.md / 2`, `controlEffective`
always equals `control` and the `min()` is inert — at which point the honest
options are (a) keep it as one-line insurance against a future pill theme, or
(b) drop it and let components read `radius.control` directly, accepting that a
theme which later pills its controls silently breaks the rule. Recommend (a);
it costs one contract slot and removes a whole class of "why is my card 1023px
round" bug. Revisit under Decision 5.

**Footgun:** `controlEffective` must stay in sync with `control`. Mitigate by
deriving both from one local const in the theme file, and by a guard script in
the shape of the old `scripts/check-field-sizes.ts`.

### 2. `radius.nesting` (new contract token — the opt-out)

A unitless `'1'` or `'0'`. Every derived radius is:

```
calc(var(radius.controlEffective) + var(radius.nesting) * <this box's padding>)
```

- Pearl / Freshwater set `nesting: '1'` → the rule applies.
- South Sea / Tahitian set `nesting: '0'` and `controlEffective: '0px'` →
  `calc(0px + 0 * 1.5rem)` = `0px`. Square stays square through one formula, with
  no per-theme branching in any component.

### 3. `Card` gets a `padding` recipe variant — radius derives from it

The whole point: **padding and radius move together, so they cannot drift.**
Card becomes a `recipe()` (same pattern Button/Alert/Tag already use) with a
`padding` variant typed to the space scale:

```ts
padding: {
  md: {
    vars: { [cardPadding]: space.md },
    borderRadius: `calc(${radius.control} + ${radius.nesting} * ${space.md})`,
  },
  lg: { /* … space.lg … */ },   // default
  xl: { /* … space.xl … */ },
}
```

`Card.Header` / `Card.Body` read `padding: var(--ds-card-padding)` from the root
rather than hardcoding `space.lg`, so both subcomponents follow the root's
variant without Context (consistent with ADR-0002 — this stays static-property
namespacing, no shared state).

**`radius.surface` stops being an authored number and becomes a derived
function.** Keep the token for compatibility (author it as the `md` case), but
the real value is per-instance.

#### What it resolves to

Taking Pearl's control radius off the pill to `12px`:

| Theme | `control` | `padding="md"` (16px) | `padding="lg"` (24px, default) | `padding="xl"` (32px) |
|---|---|---|---|---|
| Pearl | 12px | **28px** | **36px** | **44px** |
| Freshwater | 6px | 22px | 30px | 38px |
| South Sea | 0px | 0px | 0px | 0px |
| Tahitian | 0px | 0px | 0px | 0px |

**There is no `sm` step, by decision.** The derivation makes `radius - padding` a
constant (`radius.control`), so the corner always intrudes that far past the
content edge. Larger paddings absorb it; `space.sm` does not — an 8px padding
under a 20px corner is a corner 2.5x the size of the gap it sits in, and the
card reads corner-first with the arc eating most of a header's height. The rule
holds arithmetically at `sm` and still looks wrong. Padding as a fraction of
radius runs 0.57 / 0.67 / 0.73 across `md` / `lg` / `xl`, which is why the
spectrum was extended upward rather than downward.

Note the default moves from today's `space.lg` to `md`. That is not a side
effect — **it is the answer to Decision 1**, and it tightens Pearl's card
interior system-wide, which is its own identity call to make deliberately.

#### The cost: siblings can disagree

Two cards side by side with different `padding` get visibly different radii —
28px next to 44px is a 16px difference, and it reads. Each card is concentric
with its own contents while being inconsistent with its neighbour. That is the
genuine trade this mechanism makes, and it is a design call, not a bug to fix.

Today it never bites: `Form.tsx` stacks three Cards at the same (default)
padding. It would bite the first time a dashboard puts a compact tile next to a
roomy panel. If that consistency matters more than concentricity, the honest
answer is to not ship the `padding` prop and keep one static `radius.surface`.

#### Where additive derivation is actually wrong: depth 2

Computing each box's radius from `control + own padding` is only correct when a
**control** is the direct child. It breaks for surface-inside-surface:

```
Card (padding lg)  >  Alert (padding md)  >  Button
```

- Additive says Alert = `12 + 16` = **28px**.
- Concentricity says Alert = `cardRadius − Card.Body padding` = `36 − 24` = **12px**.

Wrong by 16px. And carrying it one level further, a Button inside that Alert
wants `12 − 16` = **−4px** — the chain is arithmetically impossible. A nested
Alert simply cannot host a concentric rounded control at these paddings.

**This is latent, not live:** in `Form.tsx` the `Alert`s are siblings of the
Cards, not nested inside them, and nothing else in the system nests a padded
surface in a padded surface. So:

- **Now:** accept depth-1-only, and document that the rule covers a control
  inside a surface, not a surface inside a surface.
- **Only if real nesting appears:** switch to a *subtractive* cascade — the
  outermost surface publishes `--ds-radius-here`, each nested box computes
  `calc(var(--ds-radius-here) - var(--own-padding))` and republishes it. Correct
  at every depth, but it inverts which value is authored and is materially more
  machinery. Not worth it before there is a second level to fix.

#### Scope note

`radius.surface` is not Card-only. [Alert](../src/components/Alert/Alert.css.ts#L15)
(padding `md`) and the [Docs template](../src/templates/Docs/Docs.tsx#L92)
(padding `xl`) read the same token. If Card goes dynamic and they stay static,
they will visibly disagree with it. The refactor is **every padded surface**,
not just Card.

## Component work

- **Card** — ✅ **done 2026-08-28.** `style()` → `recipe()` with a `padding`
  variant (`sm`/`md`/`lg`, default `lg`); root publishes its padding as a custom
  property that `Card.Header`/`Card.Body` consume; `borderRadius` derived via
  `calc(radius.control + radius.nesting * padding)`. Resolved: Pearl 20/28/36px,
  Freshwater 14/22/30px, South Sea and Tahitian 0px at every padding.

  Still to check by eye: `overflow: hidden` on the root clips children to the
  new, much larger radius — look at full-bleed media in the `Docs`/`Hero`
  templates at 36px.
- **Alert** — ⚠️ **now the top of the remaining work.** It still reads the static
  `radius.surface`, so on Pearl an Alert sits at 16px next to a Card at 36px —
  they visibly disagree, where before the refactor they matched. Needs the same
  derivation at its own `space.md` padding (Pearl: 28px). Alert was always the
  counterexample proving one static token can't serve two paddings; deriving Card
  first has made that concrete rather than theoretical.
- **Button** — no structural change; it keeps reading the control radius token.
  But it is where the Pearl pill pivot actually lands, so re-check that
  `space.lg` (24px) horizontal padding still reads right against a much smaller
  arc, and that the `:focus-visible` `outlineOffset: 2px` ring stays concentric.
- **Input** — same as Button; also confirm the `0 0 0 3px` focus `box-shadow`
  ring, which inherits the radius, still sits parallel.
- **Field** — ✅ **done 2026-08-28**, though not the way this plan first
  proposed. The original entry said to delete `label`/`hint`/`errorRow`'s
  `paddingLeft: space.md` outright, on the reasoning that the inset existed only
  to cope with a pill. **That was wrong.** Deleting it left the label flush at 0
  while the control's own text sat 16px in — the label, the value, the hint, and
  the error stopped sharing a left axis, which reads as mis-set regardless of
  the radius. The inset was never about the pill; the pill only made it more
  visible.

  What shipped, after two wrong turns: **`Input` pads its own text, `Field`
  insets nothing.**

  ```ts
  // Input.css.ts — the control's own text padding
  max(space.md, radius.control)
  ```

  `Field`'s label, hint, and error sit flush at zero, sharing one vertical rule
  with the card's content edge, the `Card.Header` heading, and the control's
  border box.

  The two rejected attempts are the useful part:

  | Attempt | Label lands at | Why it failed |
  |---|---|---|
  | Match the control's text padding | 16px | Aligns to the value, but breaks away from the card's content edge |
  | Match `radius.control` | 12px | Agrees with *neither* — 12px off the box edge, 4px short of the value |

  The second is the instructive one. Inside a Card at `lg` padding it produced
  three competing left edges — heading and input border at 24px, label at 36px,
  input text at 41px — and a 4px offset between a label and the value it
  describes reads as a bug, not a decision. The reasoning ("align the label to
  the control's optical left edge") was sound for a Field in isolation and wrong
  the moment the Field sat in a card, where the content edge is the stronger
  rule.

  The shared `fieldInsets.ts` module was removed with it: once `Field` stopped
  consuming a derived inset, `controlInset` had a single consumer and the
  anti-drift rationale for a shared module evaporated. It is inlined in
  `Input.css.ts`.

  This also closes the drift problem the original entry identified — the number
  now exists in exactly one place instead of being copied between `Input.css.ts`
  and three declarations in `Field.css.ts`.

- **Docs template** ([Docs.tsx:92](../src/templates/Docs/Docs.tsx#L92)) — inline
  `radius.surface` with `padding: space.xl`. Wrong pair under the new rule; move
  to a real `Card` with the matching padding variant.

## Open decisions

1. **Which lever moves — card padding, or the card radius?** **Still open.** The
   `padding` prop shipped, but its default was left at **`lg`**, not moved to
   `md` as this decision leaned. Reason: moving the default changes the interior
   spacing of every existing card — a rhythm change nobody asked for — while
   leaving it moves only the radius, which *is* what was asked for. So the
   radius change ships isolated and reviewable.

   The consequence is on the table now: **Pearl's default card is 36px**, up
   from its authored 16px. The alternatives, one line each in
   `Card.css.ts`'s `defaultVariants`:

   | Default | Pearl card radius | Interior change |
   |---|---|---|
   | `lg` (shipped) | 36px | none |
   | `md` | 28px | every card tightens 24px → 16px |
   | `xl` | 44px | every card loosens 24px → 32px |

   Judge it in Storybook: **Card → Padding Spectrum**.

2. ~~**Is per-instance radius worth siblings disagreeing?**~~ **Resolved by
   shipping:** yes. A compact card at 28px next to a roomy one at 44px is
   concentric with its own contents but inconsistent with its neighbour. That
   trade is accepted. It costs nothing today — nothing in the system mixes card
   paddings in one row — and the `padding` prop is a deliberate choice at each
   call site, not something that varies by accident. Revisit if a real layout
   ever needs two paddings side by side.

3. **Depth-1 only, or a subtractive cascade?** Additive derivation is wrong for
   surface-in-surface by 16px, and arithmetically impossible one level deeper
   (see "Where additive derivation is actually wrong"). Nothing in the system
   nests padded surfaces today, so the proposal is to **scope the rule to a
   control inside a surface** and say so plainly in the docs. Revisit only when a
   real nested-surface case shows up.

4. **Small cards degenerate.** Even at the tighter 28px, a card shorter than
   ~56px paints as a lozenge. Either accept it, set a floor, or accept that Pearl
   has no compact card. Not expressible in the formula — a design call.

5. **Two different inners in one card.** A Button (at the control radius) and a
   Tag (`radius.full`) inside the same card cannot both be concentric with it.
   The pill pivot *widens* this: Tag stays a pill while Button stops being one.
   Proposal: **anchor on the canonical control** (Button/Input at
   `controlHeight.md`) and treat `radius.full` elements as exempt — they are
   pills by identity and rarely sit flush against a card's inner edge. Confirm.

6. ~~**Should `control` be authored as a space-scale sum?**~~ **Resolved:
   no.** Pearl authors `control: '12px'` as a plain value, matching how all four
   themes already author radius. `calc(space.xs + space.sm)` reads nicely but
   **couples roundness to density** — a theme wanting tight spacing and soft
   corners could not have both, and Tahitian's larger scale would compute 20px
   rather than 12px. Radius is a shape property, not a spacing one; it stays
   independent of the space scale (and stays `px`, so corners do not drift toward
   pills as `rem`-based control height grows).

7. ~~**Does `radius.nesting` earn a contract slot?**~~ **Resolved: yes,
   shipped.** It is in the contract, `tokens.ts`, and all four themes (`'1'` on
   Pearl and Freshwater, `'0'` on South Sea and Tahitian). It earned the slot the
   moment Card's radius became derived: without it, `calc(0px + 24px)` hands a
   hard-edged theme a 24px-rounded card. The multiplier form keeps one formula in
   `Card.css.ts` with no per-theme branching, and TypeScript forces every theme
   to answer.

   `radius.controlEffective` (mechanism 1 above) was **not** added — with the
   pill gone, no theme's `control` exceeds `controlHeight.md / 2`, so the `min()`
   would be inert. Revisit only if a theme goes back to pill controls.

## Order of work

1. **Settle Decision 2 first** — per-instance radius or one static value. Then
   confirm Decision 1 in Storybook: Pearl at a 12px control, cards at 20/28/36px,
   real content, three cards stacked *and* two cards of different padding side by
   side (the case that shows the cost).
2. ~~Drop Pearl's `control` from `999px`, and rework Field's three
   `paddingLeft: space.md` insets.~~ **Done 2026-08-28.** `control: '12px'`;
   `Input` and `Field` now share a derived `controlInset` that scales with the
   control radius (see the Field entry above). Tahitian's `paddingLeft: '0'`
   reset block was deleted as dead code along with its two now-unused imports —
   it existed to undo a hardcoded inset that no longer exists, and the derived
   value already resolves correctly for Tahitian's own scale. `tsc` clean,
   `npm run build` clean, 122/122 tests pass.
3. ~~Add `controlEffective` + `nesting` to the contract, `tokens.ts`, and all
   four themes.~~ **Done 2026-08-28** — `nesting` only; `controlEffective` was
   dropped as inert (see Decision 7).
4. ~~Refactor Card to the `recipe()` + padding-variant shape.~~ **Done
   2026-08-28.** Two Storybook stories added (*Padding Spectrum*, *Padding With
   Header*). `tsc` clean, `npm run build` clean, 124/124 tests pass.
5. **Next: Alert.** Same derivation at its own `space.md` padding — it now
   disagrees with Card on every rounded theme. Then repoint or retire
   `radius.surface`, and visual-diff every story.
6. Fix the Docs template's inline radius/padding pair.
7. Add the sync guard for `control` ↔ `controlEffective`.
8. Write `foundations/radius-system.md` + the ADR — including the explicit
   depth-1 scope statement from Decision 3. Add a Storybook page showing the rule
   holding at all three paddings (and, on South Sea, correctly not applying).
