import { keyframes } from '@vanilla-extract/css';
import { recipe } from '@vanilla-extract/recipes';
import { color, radius, text } from '@tokens';

// A highlight travelling left-to-right across the placeholder. Pure CSS, no
// animation library: a Skeleton is present on first paint, before any JS a
// consumer might be waiting on, so its motion can't depend on a runtime.
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
    // An alpha wash, not a solid token: a Skeleton has to read correctly on the
    // page `background` and inside a Card's `surface` alike, and a fixed solid
    // would only be right on one of them. Same reasoning as `overlaySubtle`'s
    // own note in tokens.ts.
    backgroundColor: color.overlaySubtle,
    // The sweep rides as `background-image` over that wash, so suppressing the
    // animation leaves the base tint intact rather than a transparent gap.
    backgroundImage: `linear-gradient(90deg, transparent 25%, ${color.overlaySubtle} 50%, transparent 75%)`,
    backgroundSize: '250% 100%',
    backgroundRepeat: 'no-repeat',
    animation: `${sweep} 1.8s linear infinite`,
    // Placeholders never carry text, so nothing here can be selected or read.
    userSelect: 'none',
    '@media': {
      // The tint alone still says "content is coming" — only the travel goes.
      '(prefers-reduced-motion: reduce)': { animation: 'none' },
    },
  },

  variants: {
    variant: {
      // Stand-in for a line of type. Fills its container's width by default;
      // vary `width` per line so a paragraph doesn't read as a solid slab.
      text: {
        width: '100%',
        borderRadius: radius.control,
        cornerShape: radius.cornerShape,
      },
      // Stand-in for a sized object — an image, a card, a control. The caller
      // owns its dimensions; there is no sensible default height for "a thing".
      block: {
        borderRadius: radius.control,
        cornerShape: radius.cornerShape,
      },
      // Square-aspect, so `radius.full` resolves to a real circle rather than
      // the pill the token's own note warns against.
      circle: {
        aspectRatio: '1',
        borderRadius: radius.full,
      },
    },

    // Only meaningful for `variant="text"` — matches the placeholder to the
    // line box of the scale the real copy will render at, so nothing shifts
    // when it arrives.
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
