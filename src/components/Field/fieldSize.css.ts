import { createVar } from '@vanilla-extract/css';

// CSS custom properties, not React props — this is how `Field` cascades its
// `size` down to a control like `Input` without auto-injecting a `size` prop
// into arbitrary children (on a native `<select>`, `size` sets the visible
// row count, not a scale). Anything that doesn't read these vars is
// completely unaffected by them.
export const fieldControlHeight = createVar();
export const fieldPaddingX = createVar();
