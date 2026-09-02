import { style } from '@vanilla-extract/css';
import { color } from '@tokens';

export const dash = style({
  width: '100%',
});

export const head = style({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  gap: '16px',
});

export const headActions = style({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
});

export const kpiGrid = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr)',
  gap: '16px',
  '@media': {
    '(min-width: 640px)': {
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
    '(min-width: 1024px)': {
      gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
    },
  },
});

export const panels = style({
  display: 'grid',
  gridTemplateColumns: 'minmax(0, 1fr)',
  gap: '16px',
  '@media': {
    '(min-width: 1024px)': {
      gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1fr)',
    },
  },
});

export const chartCardBody = style({
  flex: '1',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-end',
});

export const chart = style({
  display: 'flex',
  alignItems: 'flex-end',
  gap: '6px',
  height: '148px',
  marginTop: '32px',
});

export const chartCol = style({
  flex: '1 1 0',
  minWidth: '0',
  display: 'flex',
  alignItems: 'flex-end',
  height: '100%',
});

// override: no chart component or saturated data-viz fill exists yet, so the
// bars use `surface`/`border` sub-fields and render at alert-strength tint.
export const bar = style({
  width: '100%',
  borderRadius: '3px 3px 0 0',
  background: color.info.surface,
  border: `1px solid ${color.info.border}`,
  borderBottom: 'none',
  selectors: {
    '&[data-peak="true"]': {
      background: color.positive.surface,
      borderColor: color.positive.border,
    },
  },
});

export const planRow = style({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '12px',
});
