import { style } from '@vanilla-extract/css';
import { color } from '@tokens';

// Always sticky, so the masthead stays reachable while scrolling and its
// flow slot never collapses. The motion.div translateY does summon/dismiss;
// here it only pins and layers.
export const bar = style({
  position: 'sticky',
  top: 0,
  zIndex: 20,
  background: color.background,
  willChange: 'transform',
});
