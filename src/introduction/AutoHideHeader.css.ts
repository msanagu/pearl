import { style } from '@vanilla-extract/css';
import { color } from '@tokens';

// Always sticky, so the masthead's controls stay reachable while scrolling
// through the hero, and its flow slot never collapses (no layout shift when it
// hides). Past the hero, the `motion.div` translateY does the summon / dismiss;
// here it only pins and layers.
export const bar = style({
  position: 'sticky',
  top: 0,
  zIndex: 20,
  background: color.background,
  willChange: 'transform',
});
