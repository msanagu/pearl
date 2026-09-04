/**
 * Pearl's soft sizing grid — condensed from docs/foundations/spacing-system.md.
 *
 * Split in two, per docs/process/plans/manifest-reshape.md: the mechanic
 * (`sizingGridDocumentBlocks`, theme-agnostic — governs spacing, radius,
 * typography, and any raw pixel size a component exposes) ships as a
 * `base.foundations` entity, concept `'sizingGrid'`. The actual per-theme
 * increment values (`sizingGridByTheme`) ship as that theme's own
 * `theme.foundations` entity, same concept — the values genuinely differ
 * (tahitian's `xs`:8px/`sm`:12px vs. the other three themes' `xs`:4px/`sm`:8px)
 * so they don't belong in the shared mechanic description.
 */
export const sizingGridDocumentBlocks = [
  {
    type: 'do',
    text: "Snap every raw pixel size a component exposes (spacing, radius, fontSize, line-height, a numeric prop like `Icon.size`) to the active theme's own scale-token grid — check that theme's `theme.foundations` entry (concept `'sizingGrid'`) for its actual increment values rather than assuming a fixed 8px/4px.",
  },
  {
    type: 'do',
    text: "`gap`/`padding` enforce the grid at the type level (closed scale-token names only). `Icon.size` can't — valid sizes span too wide a range for a closed set — so `Icon` snaps any numeric `size` to the nearest 4px and renders it as rem (16px root), never raw px, so it scales with base font-size like the rest of the system.",
  },
  {
    type: 'verification',
    text: "Icon-to-text sizing: verify the icon is sized to the paired text's line-height (already grid-aligned by the type scale itself, not the font-size) — e.g. a `bodySm` label pairs with an icon matching that line-height. Gap between icon and text is the theme's own `space.sm` token, not a literal pixel value. Align the icon to the text's line box, not its cap-height.",
  },
] as const;

export const sizingGridByTheme = {
  pearl: [
    {
      type: 'do',
      text: "Pearl's scale: `sm` (8px / 0.5rem) is the base unit; `xs` (4px / 0.25rem) is the one named half-step, used only for a stated reason.",
    },
  ],
  freshwater: [
    {
      type: 'do',
      text: "Freshwater's scale: `sm` (8px / 0.5rem) is the base unit; `xs` (4px / 0.25rem) is the one named half-step, used only for a stated reason. Same increments as Pearl and South Sea.",
    },
  ],
  'south-sea': [
    {
      type: 'do',
      text: "South Sea's scale: `sm` (8px / 0.5rem) is the base unit; `xs` (4px / 0.25rem) is the one named half-step, used only for a stated reason. Same increments as Pearl and Freshwater.",
    },
  ],
  tahitian: [
    {
      type: 'do',
      text: "Tahitian's scale: `sm` (12px / 0.75rem) is the base unit; `xs` (8px / 0.5rem) is the one named half-step, used only for a stated reason. Diverges from the 4px/8px the other three themes share.",
    },
  ],
} as const;
