import { style } from '@vanilla-extract/css';
import { color } from '../../tokens';

export const navLink = style({
  textDecoration: 'none',
  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${color.focusRing}`,
      outlineOffset: '2px',
    },
  },
});

export const scrollRegion = style({
  selectors: {
    '&:focus-visible': {
      outline: `2px solid ${color.focusRing}`,
      outlineOffset: '2px',
    },
  },
});
