# Theme Revision — Working Decisions

**Status: active working document.** This supersedes the handoff bundle's
`Pearl Theme Contract.dc.html` wherever the two disagree. It records what the
handoff got wrong, which exploration turns are the accepted source, and what
the token contract must grow to express them.

Source material lives in [`docs/handoffs/theme-revision/`](./handoffs/theme-revision/):

- `project/Pearl Directions.dc.html` — the exploration log, 14 turns. **The real
  source of truth for theme identity.**
- `project/Pearl Theme Contract.dc.html` — the attempted schema synthesis.
  Useful for its design language; unreliable for its contract shape.

---

## 1. What the Theme Contract doc got wrong

The contract doc was written without visibility into `src/theme.css.ts` — it
says so itself: *"the linked folder is currently unreachable from this doc, so
key names below need a 1:1 sync pass."* The consequences:

| # | Problem | Evidence |
|---|---|---|
| 1 | Wrong vanilla-extract API — `createGlobalThemeContract` vs. our `createThemeContract` | `theme.css.ts:28` |
| 2 | Parallel vocabulary with no mapping (`ground`/`hairline`/`ink`/`muted`/`faint`). `text` means *primary* text in ours, *secondary* in theirs | `theme.css.ts:52` |
| 3 | Sentiment tier absent entirely — ~16 tokens (`positive`/`negative`/`warn`/`info` × 4) | `theme.css.ts:76` |
| 4 | `*Inverse` group absent — a real feature in two-tier tokens (ADR-0005) | `theme.css.ts:48` |
| 5 | `usage.*` enums modeled as CSS custom properties. `density: 'airy'` mints a var nothing consumes | Contract §1 |
| 6 | `space` collision — ours is a scalar ramp, theirs is shorthand padding strings | `theme.css.ts:89` |
| 7 | Internal inconsistency — §1 declares `color.accent` as an object, §3 uses flat keys. `alt2` never used | Contract §1 vs §3 |
| 8 | No contrast data anywhere; several values fail WCAG AA | see §7 |

### 1.1 The `luster` modeling error

The single most consequential mistake. The contract treats `luster` as a
universal group every theme must fill. It isn't — it's **Pearl's** vocabulary.

Two proofs from the doc's own code:

**It hardcodes a theme name to escape its own Law 1.** `Pearl Theme Contract.dc.html:508`:

```js
lusterSurface: this.state.theme === 'tahitian' ? m.surface : 'linear-gradient(...)'
```

Law 1 says any theme must fully reskin any section. Tahitian couldn't, so the
adapter special-cased it rather than concluding the slot was wrong.

**Two of four themes had an effect fabricated for them.** Freshwater's rules say
cyan is `signals-only` — *"a signal, not decoration"* — yet §2 renders it as a
large saturated decorative gradient card. South Sea's card is labeled
`luster: 115deg · ecru.100 · sand.200 · champagne.300 · 4.5s`, a warm gradient
invented purely to fill the hole. Neither theme's design language asks for
either. The shared-markup demo *manufactured* both.

**Rule going forward:** these are theme-specific effects, not shared tokens
(see the theme-effects decision record:
[`docs/decisions/0007-capabilities-and-assignments.md`](./decisions/0007-capabilities-and-assignments.md)).
They are theme-owned, optional, and carry their own names; a theme with none is
normal. Our own four are declared through the same public mechanism a downstream
author has — no privileged internal path.

Note they are *not* one mechanic with four configurations. They differ
structurally, not by value: linear drift on surfaces with hover triggering vs.
alpha stops over grayscale imagery at `blend: screen` vs. a stationary tint.
Unifying them is what produced the `=== 'tahitian'` escape hatch.

| Theme | Effect | Notes |
|---|---|---|
| Pearl | `luster` | The sphere, the hairline rule, card hover. Three surfaces, two motion behaviors — the mechanism's acceptance test |
| Tahitian | `overtone` | Imagery plates only. Name comes straight from turns 3b/4a ("Overtone Plates") |
| Freshwater | `wash` | Different in kind — stationary semantic tint, see §4 |
| South Sea | `glow` | **Placeholder — subtle by definition.** A low-opacity warm halo on hover, dark mode only; no ambient state, no loop. Deliberately restrained pending refinement — South Sea's identity is type, space, and restraint, so `glow` must never compete with that |

---

## 2. Architecture: Pearl is pinned, not toggled

Pearl DS is a *system for design systems*. An instance of a Pearl theme is
effectively its own design system.

So the docs site **is** Pearl, permanently — light/dark only. The other three
themes are demonstrated inside a **scoped preview region**, because the claim
being made ("re-token it and you get a different design system") only lands if
you can see a non-Pearl system rendered inside a Pearl-themed page.

This changes current behavior. `.storybook/preview.tsx` does a *global* swap
with `initialGlobals: { theme: 'tahitian', mode: 'dark' }`. Needed:

- a `<ThemeScope theme mode>` wrapper applying a theme class to a subtree
- the docs site's own shell pinned to Pearl
- toolbar switches the *scoped* theme, not the page
- audit that no component reaches for `:root`

Naming note: "Pearl" is both the system and its flagship theme. Accepted, given
the framing above — to be documented in [`why-pearl-name.md`](./why-pearl-name.md).

---

## 3. Pearl

**Sources:** turn **4c** ("Canon — 1a layout × 1b vibe"), refined by **5a**
("canon, refined"), with **8a**'s pill controls. (These turn titles are the
exploration log's own names — quoted verbatim, not our vocabulary.)

> 4c: *1a's editorial layout on 1b's porcelain palette; the sphere is now the
> brand object — ambient luster drift, contact shadow, sea-green undertone.*

**Type — the handoff inverted this.** The contract sets `fontDisplay:
"'Gambetta',serif"` with `displayFontStyle: 'italic'`, making italic serif the
default for *all* display type. The accepted direction is the opposite:
**sans-first, italic serif as a rare accent.** In 4c the hero is General Sans
500/84px at `-.04em`,
and only `oyster.` is Gambetta italic. Same in 8a: "Nacre surface" sans,
"*the luster lives here*" italic serif.

| Role | Free (shipped) | Ideal (paid) |
|---|---|---|
| grotesk — display/heading/body | General Sans | Neue Haas Grotesk |
| mono — labels, data | IBM Plex Mono | Söhne Mono |
| accent — rare italic emphasis + wordmark | Gambetta italic | Signifier italic |

**Controls: pills.** Note this is a deliberate deviation — both 4c and 5a use
`border-radius: 3px`. Pills come from 8a and match the contract's
`radiusControl: 999px`.

**Palette (light, from 4c):** background `#F5F3EF` · hairline `#DEDAD2` · ink
`#17161A` · text `#6E6A78` · muted `#77737E` · primary
`linear-gradient(180deg,#26252C,#17161A)` on `#F5F3EF`.

### 3.1 Luster spec

Multi-hued, low-alpha. This **retires** the contract's "highlights, never
rainbow" rule and its near-monochrome stops
(`['#FBFAF7','#F2F1F6','#E9E8F0',…]`). Replacement rule, kept checkable:
**three hues maximum, none above `.42` alpha.**

Three surfaces, two motion behaviors:

**a. The sphere — ambient loop.** The brand object (`4c:1128`):

```css
width: 168px; height: 168px; border-radius: 50%;
background:
  linear-gradient(115deg, transparent 32%,
    rgba(158,214,196,.38) 44%,   /* sea green */
    rgba(214,228,255,.42) 52%,   /* periwinkle */
    rgba(255,214,236,.30) 60%,   /* pink */
    transparent 72%) no-repeat,
  radial-gradient(circle at 34% 30%,
    #FEFEFC 0%, #F0EFEC 26%, #DEE3DF 50%, #C3CCC6 72%, #A9B4AD 100%);
background-size: 260% 260%, 100% 100%;
background-position: 118% 0, center;
box-shadow: 0 18px 40px rgba(70,80,76,.22),
            inset 0 -8px 22px rgba(143,160,151,.30),
            inset 6px 4px 18px rgba(214,205,192,.18);
animation: dvOrb 9s ease-in-out infinite;
```

Plus a *separate* contact-shadow element (`4c:1129`) — 130×16,
`radial-gradient(ellipse at center, rgba(70,80,76,.28), transparent 68%)`.

**b. The hairline rule — ambient loop, 12s** (`4c:1133`):
`linear-gradient(90deg,#D6E4DD,#CFE0EA,#EAE0CC,#E8D2DC 80%,transparent)` at
`background-size: 180% 100%`. Sea-green → blue → sand → pink.

**c. Card surfaces — hover drift, not a loop.** Use the mechanic already in
[`doc-site-poc.css.ts:290`](../src/pages/doc-site-poc.css.ts): an `::after`
radial-gradient at opacity 0 drifting `(-16%, 8%) → (14%, -8%)` over 1000ms
`cubic-bezier(.22,1,.36,1)`, opacity ramping 700ms, plus `translateY(-2px)`.
Already honors `prefers-reduced-motion`. Take the sphere's *color stops*, not
its loop — nothing on a card animates until hovered.

---

## 4. Freshwater

**Source:** turn **2a, "Ice Console."**

> 2a: *stark B/W ops console; neon ice-blue only where the system speaks —
> statuses, deltas, selection.*

That sentence states the accent budget better than the Theme Contract does.

**The `wash` is not a luster.** It is a near-white, stationary, low-saturation
tint used to mark *semantic* regions — never decoration:

- attention stat cell (`2a:1310`): `linear-gradient(135deg,#E9FBFF,#F4FDFF 60%,#FFF)`
- selected table row (`2a:1322`): `linear-gradient(90deg,#EAFBFF 0%,#FFFFFF 40%)`

Compare the contract's fabricated Freshwater luster —
`#0089B3 → #5FE1FF → #0089B3`, saturated, animated, decorative. Opposite intent,
same primitive. `wash` is the correct name; "watercolor" implies more pigment
than 2a carries.

**Geometry:** radius 0 throughout. Heavy `2px solid #0E0F10` rule under the
header, `1px #E3E5E7` elsewhere. Solid-ink primary (`#0E0F10`, white text),
outlined secondary. No offset shadows — those belong to 6a, a different flavor.

**Type:** Space Grotesk (ideal: Söhne Breit) + Azeret Mono (ideal: Söhne Mono).
Mono for data only — ids, values, labels, timestamps. UI copy and buttons stay
sentence-case Space Grotesk.

**Lineage for reference:** 1f → 2a / 2b → 3a → 6a → 7a / 7b → 9b. 3a merges 2b's
oversized numerals into 2a's register; 6a adds hard offset shadows; 7a softens to
8px radius; 7b deletes the shadows again. **2a is the pick.**

---

## 5. South Sea

**Sources:** **1g** ("Golden Hour Maison", flagship) → **3c** ("Atelier Detail")
→ **11a/11b** (conch/chocolate light + dark) → **13a** (footer).

Flat warm ecru background, chocolate ink, roman + italic serif mixing with a hairline
rule in the gap, radius 0 throughout, slash-wrapped labels (`/ LABEL /` at
`.2em`), conch `#E8A184` doing exactly one small loud thing per view.

**No named effect.** Its identity is type, space, and restraint. The contract's
champagne "luster" is fabricated — discard it.

Note the source render leaks a `lusterShim` debug label, further evidence of the
slot being patched around.

---

## 6. Tahitian

**Sources:** **3b** / **4a** ("Overtone Plates") → **12a/12b** → **14a–14c**.

Anton uppercase at poster scale, exposed 1px grid where the background shows through
the gaps, radius 0, no shadows on cells, teal accent, one loud cell per view.

**`overtone`** — the name is already established, not new. Alpha teal/violet/periwinkle stops
over `grayscale(1)` photography at `mix-blend-mode: screen`. **Imagery plates
only** — never type, buttons, or flat surfaces.

This wholly replaces the current [`tahitian.css.ts`](../src/themes/tahitian.css.ts)
(aubergine/orchid, 6px radius, Druk/Neue Montreal), which was explicitly a
placeholder pending this pass.

---

## 7. Accessibility

Decision: **implement as-specified, audit after.** But the failures split into
two kinds and only one is a token problem:

**Palette failures** — fixable by adjusting values.

Pearl's first real audit ran against the Tokens Overview story (Storybook's a11y
addon + direct WCAG calc), surfacing one genuine fail: `accent` (pewter) on
`onAccent` — the pair the primary Button and the docs-site pill both use — was
4.18:1 against 4.5 required. **Fixed**: darkened pewter `#77737E → #6A6672`
(same neutral family, luminance-only correction) to 5.05:1. Sentiment 700-on-100
and 500-on-surface pairs were checked and pass. See the comment on
`pearlLightPrimitives.pewter` in `pearl.css.ts` for the numbers.

Still suspected, not yet audited — Tahitian/Freshwater/South Sea are unchanged
since this section was written:

- Freshwater `accent #00B8E6` as text on `#FFFFFF` — ~2.4:1
- Tahitian light `faint #8B938F` on `#EDF0EE` — ~2.6:1
- compounded by 9.5–10px mono labels throughout

**Structural failures** — no palette value fixes these. White text over
variable-luminance imagery (`SELECTED — 2024/26`, `The index`) needs a scrim
floor or text-protection treatment. Note `Pearl Theme Contract.dc.html:166`
hardcodes `color:#F4F2F6` directly in markup — not a token at all, another Law 1
break, and precisely the failing text.

---

## 8. Contract changes required

Filtered through the theme-effects decision record's
([`docs/decisions/0007-capabilities-and-assignments.md`](./decisions/0007-capabilities-and-assignments.md))
leanness test — a slot enters `vars` only if every theme answers it honestly
*and* a design system that isn't one of ours would need it too.

Confirmed additions to [`theme.css.ts`](../src/theme.css.ts):

- **`fontFamily.mono`** — passes. Every theme sets a mono; three of four use it
  as their label idiom.
- **free/ideal font pairing** as a structured per-theme field rather than prose.

Moved to each theme's own configuration, not the shared contract:

- **`fontFamily.accent`** — which face plays a role is itself a theme
  distinction. Which face plays `emphasis` (Pearl: italic serif; Freshwater:
  its sans) is something a theme declares, not a shared slot. Note this
  corrects an earlier reading here: aliasing to `body` is **not** fabrication
  — it is the honest answer "we have no separate emphasis face," and the text
  still renders.
  [`tahitian.css.ts:80`](../src/themes/tahitian.css.ts) already does this
  informally; making it data means the licensing story is legible and swapping
  in paid faces later is a value change.

Rejected — the handoff's `color.chrome.{bg,ink}`:

- Not a new role. It named "the one loud cell per view" (CONTACT, primary CTA) —
  but that is a *usage pattern* of the existing inverse group
  (`backgroundInverse` / `surfaceInverse` / `textInverse`), not a missing token.
  Adding it would give two ways to express one thing.
- And "exactly one loud cell per view" is our design language, not a universal
  need. It belongs in each theme's own `usage` settings as a constraint, where
  it stays machine-checkable, and draws its colors from the inverse tokens.
- Terminology note: **do not use "chrome"** for this or anything else in this
  system — neither as a token name nor in prose.

Under evaluation, each justified individually rather than adopted wholesale:

- `surfaceAlt`, `surfaceHover`
- gradient-valued tokens (`primaryBg`, `accentBar`) — the first non-flat-color
  values in the contract; needs an ADR line

Explicitly **deferred**: `usage.*` metadata shape, the `space`-as-shorthand-
padding ramp.

---

## 9. Open questions

- ~~**Effect namespacing mechanism.**~~ Resolved by the theme-effects decision
  record ([`docs/decisions/0007-capabilities-and-assignments.md`](./decisions/0007-capabilities-and-assignments.md),
  `proposed`) — theme-owned, theme-named effects, each requiring a written
  description of where/how it applies. Pending acceptance.
- **South Sea's `glow`** ⚠️ — recorded in §1.1 but reverses an earlier "South Sea
  has no effect." Needs confirmation or strike.
- **Per-theme configuration schema** — the axis vocabulary, the path-addressing
  scheme, and the machine-checkable vs. advisory split. The theme-effects
  decision record names this layer but does not specify it. Candidate: a
  follow-up decision record.
- ~~**Prose field name**~~ — resolved: `mood`.
- **Font licensing.** Six new families, all currently CDN-loaded in the
  prototypes; we self-host. Needs license verification and `.woff2` sourcing.
- **Does `wash` belong to Freshwater alone,** or is a semantic-region tint
  general enough to be a shared role?

---

## 10. Phase plan

| Phase | Work | Status |
|---|---|---|
| 0 | Read exploration log, identify the accepted turns per theme | ✅ done — this doc |
| 1 | Theme-effects decision record | ✅ drafted — [`docs/decisions/0007-capabilities-and-assignments.md`](./decisions/0007-capabilities-and-assignments.md), status `proposed` |
| 2 | **Write Pearl as a real theme file** | ✅ done — `pearl.css.ts`, `pearl.assignment.ts`, `assignment.ts`. Builds; the required-configuration rule verified enforced. **Review gate** |
| 3 | Per-theme configuration decision record, written from what phase 2 reveals | |
| 4 | Type primitive tier (two-tier tokens tier 1 for fonts — never built; see `theme.css.ts:107`) | |
| 5 | `ThemeScope` + docs site pinned to Pearl | |
| 6 | Tahitian, South Sea, Freshwater | |
| 7 | Contrast audit across all eight palettes | |
