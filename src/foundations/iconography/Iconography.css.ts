import { style, globalStyle } from '@vanilla-extract/css';
import { color, space } from '@tokens';

// Visually hidden but still announced — the table's real accessible name,
// kept off the page since the section heading above it already reads fine
// on its own.
export const srOnly = style({
  position: 'absolute',
  width: '1px',
  height: '1px',
  padding: 0,
  margin: '-1px',
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
});

export const scroll = style({
  overflowX: 'auto',
});

export const libTable = style({
  width: '100%',
  borderCollapse: 'collapse',
  textAlign: 'left',
});

export const headCell = style({
  padding: `0 ${space.lg} ${space.md} 0`,
  borderBottom: `1px solid ${color.border}`,
});

export const headCellRight = style([headCell, { textAlign: 'right' }]);

// Same hairline-only convention as StoryDoc's own definitions table — no
// zebra, no hover (these rows aren't interactive, so no state to signal).
export const bodyRow = style({
  borderTop: `1px solid ${color.borderSubtle}`,
});

export const cell = style({
  padding: `${space.md} ${space.lg} ${space.md} 0`,
  verticalAlign: 'top',
});

export const cellRight = style([cell, { textAlign: 'right' }]);

export const cellCenter = style([cell, { textAlign: 'center' }]);

export const setPath = style({
  display: 'block',
});

// 45ch mirrors Text's own `measure="md"` step — default prose width, not a
// bespoke number for this one table.
export const notesCell = style([cell, { maxWidth: '45ch' }]);

globalStyle(`${bodyRow}:first-of-type`, {
  borderTop: 'none',
});
