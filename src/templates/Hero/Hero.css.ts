import { style } from '@vanilla-extract/css';

export const main = style({
  minHeight: 520,
  '@media': {
    '(max-width: 720px)': {
      minHeight: 'auto',
      flexDirection: 'column',
      alignItems: 'stretch',
      justifyContent: 'center',
      gap: 24,
      paddingTop: 24,
      paddingBottom: 24,
    },
  },
});

export const header = style({
  '@media': {
    '(max-width: 720px)': {
      minWidth: 0,
      flex: '0 1 auto',
    },
  },
});

export const sphere = style({
  '@media': {
    '(max-width: 720px)': {
      alignSelf: 'center',
      transform: 'scale(0.72)',
      transformOrigin: 'center',
      margin: '-24px 0',
    },
  },
});

export const features = style({
  '@media': {
    '(max-width: 720px)': {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    },
  },
});

export const feature = style({
  '@media': {
    '(max-width: 720px)': {
      minWidth: 0,
      padding: '12px 16px',
    },
  },
});
