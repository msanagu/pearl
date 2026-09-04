/**
 * `Icon`'s bring-your-own-set contract — condensed from `Icon.tsx`'s JSDoc.
 */
export const iconFlexibilityDocumentBlocks = [
  {
    type: 'guidance',
    text: "`Icon`'s `icon` prop accepts any `react-icons` `IconType` — Phosphor, Remix, Heroicons v2, Lucide, Tabler, or any other set. Pearl ships no default set; the choice belongs to the consumer.",
  },
  {
    type: 'guidance',
    text: 'Outline vs. filled is a matched-pair import, not a Pearl prop — no `weight="outline"` API. Switch between the two yourself (`selected ? PiHeartFill : PiHeart`). The suffix convention differs per set: `…`/`…Fill` (Phosphor), `…Line`/`…Fill` (Remix), `HiOutline…`/`Hi…` (Heroicons v2) — check the actual set imported.',
  },
  {
    type: 'guidance',
    text: "Weight axes (e.g. Phosphor's thin/light/regular/bold/duotone) are the consumer's own import choice — `Icon` has no `weight` prop; `react-icons` already encodes weight in the component name.",
  },
  {
    type: 'guidance',
    text: "Two-layer duotone icons (a faint background path + a full-opacity foreground path) get recolored independently by `Icon.css.ts` automatically — don't hand-roll duotone recoloring for a set that already gets this for free.",
  },
  {
    type: 'example',
    text: `import { Icon } from '@msanagu/pearl';
import { PiHeart, PiHeartFill } from 'react-icons/pi';

<Icon icon={liked ? PiHeartFill : PiHeart} size={24} />`,
  },
] as const;
