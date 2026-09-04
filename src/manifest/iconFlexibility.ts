/**
 * `Icon`'s bring-your-own-set contract — condensed from `Icon.tsx`'s JSDoc.
 *
 * Universal code contract (`Icon`'s `icon` prop shape doesn't vary by theme)
 * — ships as a `base.foundations` entity, concept `'iconFlexibility'`.
 */
export const iconFlexibilityDocumentBlocks = [
  {
    type: 'do',
    text: "Accept any `react-icons` `IconType` via `Icon`'s `icon` prop — Phosphor, Remix, Heroicons v2, Lucide, Tabler, or whatever set the consumer already uses. Pearl ships no default set; the choice belongs to the consumer.",
  },
  {
    type: 'do',
    text: 'Switch between outline and filled yourself via a matched-pair import (`selected ? PiHeartFill : PiHeart`) — check the actual set imported before assuming a suffix convention: `…`/`…Fill` (Phosphor), `…Line`/`…Fill` (Remix), `HiOutline…`/`Hi…` (Heroicons v2).',
  },
  {
    type: 'dont',
    text: "Don't look for a `weight=\"outline\"` prop on `Icon` — outline vs. filled is a matched-pair import, not a Pearl prop.",
  },
  {
    type: 'dont',
    text: "Don't look for an `Icon` `weight` prop for axes like Phosphor's thin/light/regular/bold/duotone either — `react-icons` already encodes weight in the component name; it's the consumer's own import choice.",
  },
  {
    type: 'do',
    text: "Trust `Icon.css.ts` to auto-recolor two-layer duotone icons (a faint background path plus a full-opacity foreground path) independently.",
  },
  {
    type: 'dont',
    text: "Don't hand-roll duotone recoloring for a set that already gets this for free from `Icon.css.ts`.",
  },
] as const;
