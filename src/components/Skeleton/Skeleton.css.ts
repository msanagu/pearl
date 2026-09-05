import { keyframes } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { color, radius, text } from '@tokens';

// Highlight travelling left-to-right across the placeholder. Pure CSS, no
// animation library — Skeleton is present on first paint, before any JS.
const sweep = keyframes({
  from: { backgroundPosition: '150% 0' },
  to: { backgroundPosition: '-150% 0' },
});

/** `height: calc(fontSize × lineHeight)` — line-height tokens are unitless. */
const lineBox = (scale: keyof typeof text) =>
  `calc(${text[scale].fontSize} * ${text[scale].lineHeight})`;

export const skeleton = recipe({
  base: {
    display: 'block',
    // Alpha wash, not a solid token — has to read correctly on page background
    // and inside a Card's surface alike. Same reasoning as overlaySubtle in tokens.ts.
    backgroundColor: color.overlaySubtle,
    // Sweep rides as background-image over that wash, so suppressing the
    // animation leaves the base tint intact rather than a transparent gap.
    backgroundImage: `linear-gradient(90deg, transparent 25%, ${color.overlaySubtle} 50%, transparent 75%)`,
    backgroundSize: '250% 100%',
    backgroundRepeat: 'no-repeat',
    animation: `${sweep} 1.8s linear infinite`,
    // Placeholders never carry text, so nothing here can be selected or read.
    userSelect: 'none',
    '@media': {
      // Tint alone still says "content is coming" — only the travel goes.
      '(prefers-reduced-motion: reduce)': { animation: 'none' },
    },
  },

  variants: {
    variant: {
      // Line of type — fills container width by default; vary width per line
      // so a paragraph doesn't read as a solid slab.
      text: {
        width: '100%',
        borderRadius: radius.control,
        cornerShape: radius.cornerShape,
      },
      // Sized object — image, card, control. Caller owns dimensions; no
      // sensible default height for "a thing".
      block: {
        borderRadius: radius.control,
        cornerShape: radius.cornerShape,
      },
      // Square-aspect, so radius.full resolves to a real circle, not a pill.
      circle: {
        aspectRatio: '1',
        borderRadius: radius.full,
      },
    },

    // Only meaningful for variant="text" — matches placeholder to the line
    // box of the scale the real copy will render at, so nothing shifts on arrival.
    typeScale: {
      caption: { height: lineBox('caption') },
      bodySm: { height: lineBox('bodySm') },
      bodyMd: { height: lineBox('bodyMd') },
      bodyLg: { height: lineBox('bodyLg') },
      headingSm: { height: lineBox('headingSm') },
      headingMd: { height: lineBox('headingMd') },
      headingLg: { height: lineBox('headingLg') },
      displaySm: { height: lineBox('displaySm') },
      displayLg: { height: lineBox('displayLg') },
      displayXl: { height: lineBox('displayXl') },
    },
  },

  defaultVariants: {
    variant: 'text',
  },
});
