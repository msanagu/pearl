/**
 * Pearl's 8px soft grid — condensed from docs/foundations/spacing-system.md.
 */
export const sizingGridDocumentBlocks = [
  {
    type: 'guidance',
    text: "8px soft grid: `sm` (8px) is the base unit; `xs` (4px) is the one named half-step, used only for a stated reason. Applies to spacing, radius, fontSize, line-height, and any raw pixel size a component exposes (e.g. `Icon.size`). Per-theme, not universal — Tahitian's scale differs (`xs`:8, `sm`:12).",
  },
  {
    type: 'guidance',
    text: '`gap`/`padding` enforce this at the type level (scale-token names only). `Icon.size` cannot — valid sizes span too wide a range for a closed set — so `Icon` snaps any numeric `size` to the nearest 4px and renders it as rem (16px root), never raw px, so it scales with base font-size like the rest of the system.',
  },
  {
    type: 'guidance',
    text: "Icon-to-text sizing, one rule: size the icon to the paired text's line-height (already grid-aligned by the type scale itself, not the font-size) — a `bodySm` label (line-height 20) pairs with a 20×20 icon. Gap between icon and text is `space.sm` (8px). Align the icon to the text's line box, not its cap-height.",
  },
  {
    type: 'example',
    text: `import { Icon, Row, Text } from '@msanagu/pearl';
import { PiBell } from 'react-icons/pi';

// bodySm line-height is 20 — icon matches it, gap is 'sm' (8px)
<Row gap="sm" align="center">
  <Icon icon={PiBell} size={20} />
  <Text typeScale="bodySm" as="span">label</Text>
</Row>`,
  },
] as const;
