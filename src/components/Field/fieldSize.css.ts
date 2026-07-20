import { createVar } from '@vanilla-extract/css';

// CSS custom properties, not React props — this is how `Field` cascades its
// `size` down to a control like `Input` without auto-injecting a `size` prop
// into arbitrary children (a raw `<select size>` means something else
// entirely; see the `Select` story in Field.stories.tsx). Anything that
// doesn't read these vars is completely unaffected by them.
export const fieldControlHeight = createVar();
export const fieldPaddingX = createVar();
