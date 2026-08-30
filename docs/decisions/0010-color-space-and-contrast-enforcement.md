---
id: ADR-0010
title: Author color in OKLCH, enforce contrast on pairs, declare the fewest steps that survive
status: proposed
date: 2026-08-29
deciders: [Mary San Agustin]
tags: [color, tokens, accessibility, theming, tooling]
supersedes: null
superseded_by: null
---

# ADR-0010 — Author color in OKLCH, enforce contrast on pairs, declare the fewest steps that survive

## Context

Four themes now ship two-to-three hand-authored color scales each (ADR-0005's
primitive tier). Accessibility is currently verified the way it has been since
Phase 1: Storybook's a11y addon, run by eye, on whichever story happens to be
open. Pearl's sentiment scales carry a comment claiming "4.5:1+ text contrast,
3:1+ icon contrast in both modes — **not re-audited for
Tahitian/Freshwater/South Sea**." That parenthetical is the whole problem: the
guarantee exists for one theme, as a snapshot, in a comment.

Two recent consolidations (Freshwater → `ice`/`graphite`/`glacier`, South Sea →
`sand`/`driftwood`/`conch`) leaned each theme's primitives down to the steps a
semantic role actually reads, and verified with real HSL math that each scale is
a single hue. Both passes surfaced the same question: *what makes a step number
mean something?* Today it means "a value someone picked that looked right." The
industry answer is that step numbers should carry a contrast contract — "any
100 under any 700 clears 4.5:1" — enforced mathematically rather than by eye.

There is also a standing pressure specific to this project. Color is the single
easiest place for a design system to metastasize: every hue wants nine steps,
every step wants an alpha variant, every theme wants its own exception, and the
primitive tier becomes a thousand-swatch catalog nobody can hold in their head —
of which a component library this size would genuinely use perhaps forty. The
reductive instinct (declare only what a role consumes) is a first-class
constraint here, not a nice-to-have, and it partly conflicts with the
lock-step-ramps model most of the industry advice assumes.

### The premise was tested, and it is weaker than commonly stated

The widely-repeated claim is that perceptually uniform color spaces make
contrast *guaranteed*: lock lightness per step across every hue and "Blue 100 on
Gray 700" is safe by construction. This was checked numerically rather than
taken on faith, because the decision rests on it.

**It does not hold.** WCAG 2.x contrast derives from sRGB *relative luminance*,
which is a different function from OKLCH's *L*. Holding OKLCH L fixed and
sweeping hue at chroma 0.15, contrast against white measures:

| OKLCH L | Contrast vs white, across in-gamut hues | Spread |
|---|---|---|
| 0.55 | 4.54:1 → 5.27:1 | 0.73 |
| 0.65 | 3.04:1 → 3.49:1 | 0.46 |

At `L=0.55` a green (hue ~150°) lands at **4.54:1** — it clears the 4.5:1 AA
floor by 0.04, which is inside the noise of 8-bit hex rounding. A neighboring
red at identical L sits at 5.27:1. Same "step," materially different safety
margin.

Chroma, contrary to the usual framing, is nearly irrelevant: sweeping chroma
0.00 → 0.15 at fixed L moved contrast by ~0.03. **Hue is the variable that
breaks the guarantee, not saturation.**

The correct reading: perceptual uniformity buys *approximate* cross-hue
consistency — good enough to design against, not good enough to certify. Any
claim of a guarantee has to come from measuring the actual pair, or from
generating the value against a contrast target in the first place.

## Options considered

### Option A — Do nothing; keep hand-authored hexes + the a11y addon
- **Pros:** Zero migration. Preserves total authorial control, which is where a
  meaningful amount of each theme's character actually lives (Pearl's
  `focusRing` breaking the same-hex-both-modes symmetry; South Sea's `taupe`
  darkened specifically to clear 4.5:1).
- **Cons:** The guarantee is a comment, not a property. Already demonstrably
  stale — three of four themes are unaudited. Any future palette edit can
  silently break a pair with nothing to catch it. Does not scale past the fourth
  theme.

### Option B — OKLCH lightness-locked ramps, uniform steps across all hues
- **Pros:** Cross-hue perceptual consistency; step numbers gain shared meaning;
  matches the dominant industry model (Radix, Material HCT, Tailwind v4).
- **Cons:** Per the measurements above, **the contrast guarantee it is adopted
  for does not actually hold** — it still needs enforcement underneath, so it
  buys consistency, not safety. Worse for this project: it pushes toward full
  9–11 step ramps per hue to make the ladder legible, which is precisely the
  spiral the reductive constraint exists to prevent. Every theme would carry
  ~40 declared swatches where it currently carries 13–20.

### Option C — Contrast-first generation (Leonardo model)
Steps are not defined by lightness at all. A step is *defined* as "this hue,
solved to exactly 7:1 against the declared background." Palettes become
generated build artifacts.
- **Pros:** The only option where the guarantee is true by construction rather
  than by testing. Genuinely elegant. Self-adjusting per hue.
- **Cons:** Palettes stop being authorable. Every hand-tuned deviation this
  system has accumulated — and the deviations *are* the design work here — is
  either lost or reintroduced as an override that defeats the generation. Adds a
  build-time solver dependency, against ADR-0004's default. Also over-fits to
  WCAG 2.x, a standard with known flaws that APCA/WCAG 3 is expected to replace;
  baking its exact curve into generation is a poor long-term bet.

### Option D — Reductive declaration + enforced pairs (chosen)
Keep hand-authored values and the minimum-step discipline. Move the guarantee
out of comments and into tests that check the *pairs that actually occur*.
- **Pros:** Preserves authorial control and the reductive constraint. The
  guarantee becomes real and continuously verified. No new runtime or build
  dependency. Correct by construction about the thing that is actually true:
  contrast is a property of a pair.
- **Cons:** Requires enumerating sanctioned pairs. Catches violations rather
  than preventing them.

## Decision

**Adopt Option D**, with OKLCH as the *authoring* space, plus Option B's shared
rung ladder in the amended form recorded below.

Three rules, in priority order:

1. **Contrast is enforced on pairs, never on colors.** A color has no contrast;
   only a foreground-on-background combination does. The check therefore lives
   where pairs are formed — the semantic tier — and walks every theme × mode ×
   sanctioned pair, asserting real measured ratios. This replaces the audit
   comments entirely.

2. **Declare the fewest steps that a semantic role actually reads.** A step
   earns its existence by being referenced, not by completing a ladder. Scales
   stay single-hue (verified numerically, as Freshwater and South Sea now are)
   and stay per-theme. No global ramp, no filling in 200/300/400 for symmetry,
   no alpha variant until something needs it. When a step stops being
   referenced, it is deleted.

   A step also loses its place when it stops matching its *rung* — see the
   amendment. South Sea's `conch[500]`/`[600]` were deleted 2026-08-29 under
   this rule: `500` measured 1.03:1 against `driftwood[800]` (the same swatch
   under a second name, and a "500" as dark as another palette's "800"), and
   `600` was a near-neutral filed under the accent — see "What a palette may
   be used for" below for the test that catches both.

3. **OKLCH is the authoring and reasoning space; sRGB hex stays the emitted
   value.** Use OKLCH to *derive* and *interrogate* steps (it is what makes
   "same perceived darkness across hues" tractable, and what the single-hue
   verification should key on going forward). Emit hex, because the values are
   hand-tuned artifacts and the contrast check reads sRGB anyway.

**No color-space switch is required at runtime.** vanilla-extract emits strings;
the color space is a build-and-author-time concern with no runtime commitment.
`oklch()` in emitted CSS is deliberately declined for now — it buys nothing the
authoring workflow doesn't already provide, and costs legibility in a file
where every value carries a provenance comment.

## Amendment (2026-08-29) — a shared rung ladder, sparsely populated

This ADR originally rejected Option B's shared ladder outright and left step
numbers theme-local. That went too far, and the project's own data is the
argument against it: measured across all sixteen existing sentiment scales,
`step 500 on step 100` ranges from **2.37:1 to 5.10:1**. A step number
currently means nothing consistent — which is the problem Option B exists to
solve, independent of whether it delivers a contrast guarantee (it does not;
see Context).

The two options reconcile, because they answer different questions:

1. **A canonical ladder defines what a rung *means*** — its OKLCH lightness and
   chroma target. This is shared across every theme and every hue family, so a
   `500` in any palette carries roughly parallel *value* to a `500` in any
   other. Chroma is part of the rung definition, not just lightness: it is what
   lets an icon rung be defined as inherently quieter, which is how the
   `color-mix()` in the sentiment `icon` slots gets retired in favor of a
   static, checkable hex.

2. **A rung's contrast promise is scoped to its own palette.** "Step N clears
   X:1" is a statement about N against another rung *in the same scale*, and
   nothing more. Cross-palette pairings (`driftwood[800]` on `conch[300]`) are
   legal and remain per-theme discretion — but they inherit no guarantee from
   the ladder and must therefore be **explicitly declared and explicitly
   tested**. This is the honest scope: hue variance means a cross-palette pair
   at nominally matching rungs can still land anywhere in a ~0.7-ratio band, so
   promising otherwise would be the same overreach this ADR already rejects.

3. **Each palette populates only the rungs it uses.** The ladder is a
   definition, not a checklist — rule 2 above is unchanged. `conch` legitimately
   has no 4.5:1 text rung against the page, because nothing ever sets body copy
   in conch.

4. **A rung declares what it is measured against.** Usually the palette's own
   surface rung; sometimes another rung in the same palette. South Sea's dark
   `onAccent` was the case that surfaced this: it is text on the accent fill,
   owing 4.5:1 to `conch[300]` and nothing at all to the page background. A
   ladder keyed solely to "contrast against the background" cannot express that
   rung.

The net effect on the three rules above: rule 1 (pairs, not colors) and rule 3
(OKLCH authoring) stand unchanged; rule 2 gains the ladder as the definition of
what a rung number *claims*, while keeping population sparse.

### What a palette may be used for — chroma, not category

An earlier draft of this amendment stated the constraint categorically: an
accent palette is never a text foreground and never a dark-mode background.
**That formulation is wrong**, and Pearl is the counterexample that disproves
it. Measured peak chroma across the four accents:

| accent palette | peak chroma |
|---|---|
| Pearl `urchin` | **0.028** |
| Tahitian `peacock` | 0.094 |
| South Sea `conch` | 0.115 |
| Freshwater `glacier` | 0.137 |

`urchin` serves `accent`/`accentSubtle`/`focusRing` *and*
`textSubtle`/`textInverseSubtle`/`borderStrong`/`shadow` at once — a deliberate
choice recorded in its own comment ("desaturated work only… never a fill"), and
one that only works because at 0.028 chroma it is functionally a tinted
neutral. A categorical rule would flag the flagship theme as broken.

The honest constraint is about coherence, and it is measurable:

- **A palette may serve any role its chroma suits.** Below roughly 0.03 chroma a
  hue reads as a tinted neutral and may carry neutral roles (muted text,
  borders, shadow). Above roughly 0.09 it cannot — `glacier` or `conch` as body
  text would read as a colored smear, not quiet type.
- **A step belongs in a palette only if it carries that palette's chroma.** This
  is what actually caught the deleted steps: `glacier` works at 0.116–0.137
  across its mid range but `glacier[600]` sits at **0.043**, and `conch[600]`
  was similarly a near-neutral wearing an accent name. Both were neutrals filed
  under the accent, which is why a neutral step could replace them at ~1.05:1 —
  indistinguishable.
- **Pale tints are exempt from the second test.** `glacier[100]` measures 0.020
  chroma not because it is a stray neutral but because the gamut allows little
  chroma near white. Judge a tint by its hue and its role, not its chroma.

The mid-tone consequence, recorded because it drove the Freshwater assessment:
Pearl can park mid-tones in `urchin` precisely because that accent is
near-neutral. Themes with a saturated accent (Freshwater, South Sea, Tahitian)
have no such home, so their mid-tones must live in the neutral scales — and must
be filed by **what value they are**, not by which mode consumes them.

## Open questions

Recorded rather than resolved, because each needs a judgment call the ladder
work will force anyway.

### Accent fills that don't clear 3:1 against the page

South Sea's `conch[300]` is the `primary` button fill and measures **1.82:1
against `sand[100]`**. WCAG 1.4.11 asks for 3:1 on "visual information required
to identify" a control — but the button is identified by its label, which
carries 6.43:1 against that fill, and by its own boundary treatment. Whether
1.4.11 binds a *filled* control whose text already passes is a genuinely
contested reading, and a large number of shipped design systems land where
South Sea currently does.

The decision is deferred, not dodged. Three routes: darken the fill (changes the
brand swatch that 11a/11b specified), require a border on accent-filled controls
in themes where the fill is pale (a component rule, not a color one), or record
an explicit exemption stating that filled controls are identified by label
contrast. Whichever is chosen must be written into the sanctioned-pairs table as
either a requirement or a named exemption — the one outcome this ADR rules out
is leaving it unstated.

Freshwater's light-mode primary is the parallel case and should be settled at
the same time: it fills with `graphite[900]` (ink), not the accent, so it is
unaffected — but its dark mode fills with `glacier[300]`, which needs the same
question asked of it.

### Sentiment `icon` slots

Recorded under Tradeoffs below: these are `color-mix()` expressions and are not
statically checkable. The amendment's chroma-carrying rungs are the intended
exit — an icon rung defined as inherently lower-chroma removes the reason the
mix exists — but until that lands they need either a resolver in the test or a
named exemption.

## Tradeoffs

- **Positive:**
  - The accessibility claim becomes a property of the build, not a stale
    comment. CI already runs `typecheck → test → build`; the check is a Vitest
    suite, no new infrastructure.
  - The reductive constraint is protected — this is the only option that does
    not pressure every hue toward a full ramp.
  - Rejects a widely-repeated claim on measured evidence rather than adopting it
    on authority. The measurements are recorded above so the reasoning is
    auditable rather than re-litigated.
  - Theme character (the deliberate deviations) survives intact.
- **Negative / accepted costs:**
  - No universal cross-theme contrast matrix. Per the amendment, a rung number
    conveys parallel *value* across palettes but carries no cross-palette
    contrast promise — `driftwood[800]` on `conch[300]` has to be declared and
    tested, not assumed.
  - Sanctioned pairs must be enumerated and kept current — a real maintenance
    surface, and the place this decision will rot first if neglected.
  - Sentiment `icon` slots are `color-mix()` expressions, not static hexes; they
    cannot be checked without resolving the mix, so they need either a resolver
    in the test or an explicit documented exemption.
  - Violations are caught at test time, not prevented at author time.
- **Neutral:**
  - WCAG 2.x is the target because it is what the a11y addon and legal
    requirements currently use. The pair-based structure is standard-agnostic —
    swapping the ratio function for APCA later touches one module, which is
    much of the point of not generating against WCAG's curve.

## Revisit if

- **APCA / WCAG 3 reaches candidate status.** Pairs stay; the ratio function is
  replaced. This ADR does not need superseding for that — only the module does.
- **Theme count passes roughly six**, or themes begin sharing scales. At that
  point a shared step ladder starts paying for itself and Option B's costs
  invert; supersede with a generated-ramp ADR.
- **Enumerated pairs drift out of sync with real usage** — i.e. the suite passes
  while a genuine violation ships. That is the failure mode this option accepts,
  and observing it once is grounds to reconsider Option C.
- **A theme is authored by someone other than the maintainer.** Hand-tuning
  assumes the author has the judgment the generation would otherwise supply;
  that assumption is load-bearing here and does not survive delegation.

## Related

- ADR-0005 — the primitive/semantic tiering this operates within; pairs form at
  the semantic tier, single-hue scales live in the primitive tier.
- ADR-0006 — token naming; the prominence ladder (`subtle`/base/`strong`) is the
  vocabulary sanctioned pairs are expressed in.
- ADR-0004 — third-party dependency stance; the reason a generation solver
  (Leonardo, Style Dictionary) is rejected rather than adopted by default.
- `src/themes/*/*.css.ts` — the four themes' primitive scales; Freshwater and
  South Sea are the reference implementations of rule 2.
- `docs/theme/theme-revision-decisions.md` — source turns behind the values
  these scales preserve.
