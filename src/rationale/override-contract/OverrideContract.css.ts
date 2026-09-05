import { style, globalStyle } from '@vanilla-extract/css';

// The pattern itself — one consolidated stylesheet per feature, targeting
// stable data attributes, never internal class names or inline styles.
// `style()`'s own `selectors` key can only target the class itself (`&:hover`,
// `${parent} &`) — reaching a *descendant* (a data-part inside this wrapper)
// needs `globalStyle` instead, same rule override-patterns.md's own example
// documents.
export const myFeatureCard = style({});
globalStyle(`${myFeatureCard} [data-component="card"][data-part="header"]`, {
  textTransform: 'uppercase',
});
