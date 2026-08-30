/**
 * The override contract, as real structured data — not hand-typed into any
 * one consumer's prompt. See docs/foundations/override-patterns.md for the
 * full human-facing writeup this mirrors; this file is the condensed,
 * generator-readable version the manifest actually ships, the same way a
 * theme's `.roles.ts` is the generator-readable version of its own prose.
 *
 * This is cross-cutting — it applies to every component, in every theme —
 * so it doesn't fit the per-theme Foundation or per-component Component
 * shape the rest of the manifest uses. It ships as its own top-level
 * `overrideContract` field in `dist/manifest/base.json` instead.
 */
export const overrideContractDocumentBlocks = [
  {
    type: 'guidance',
    text: 'Every component renders stable `data-component`/`data-part`/`data-variant` attributes specifically so downstream code can target them from a feature-scoped stylesheet — this is the primary, intended extension mechanism, not an implementation detail.',
  },
  {
    type: 'guidance',
    text: "Never use an inline `style={{...}}` prop to change a component's visual treatment (color, border, background). It is invisible to the rest of the app and to this design system's own maintainers — unfindable, unauditable, and impossible to promote into a real token or variant later.",
  },
  {
    type: 'guidance',
    text: 'To extend past what a component\'s documented variants cover (e.g. a destructive/danger action when only `primary`/`secondary` exist), target the closest variant\'s data attributes from a feature-level stylesheet (`[data-component="button"][data-variant="primary"] { ... }`) — never inline styles, never importing the library\'s internal class tokens, never a bespoke CSS-variable prop per element.',
  },
  {
    type: 'guidance',
    text: 'When an override like that is used, say so in two places: a code comment at the override site explaining what\'s missing and why (e.g. "override: Pearl has no destructive Button variant — styling primary as danger here"), and a plain statement in any prose accompanying the generated code. This is not optional politeness — an unflagged override is real evidence the variant set is incomplete, lost the moment it ships silently instead of surfacing as a signal for what the design system should grow to cover next.',
  },
  {
    type: 'guidance',
    text: 'Never hand-type a literal CSS custom-property name (e.g. `var(--color-negative-icon)`) for a Pearl color value in an override, in any environment — vanilla-extract compiles these names at build time and they are not documented, predictable, or stable across builds. A wrong guess does not error; it silently fails to apply. Always reference the real token object (`color.negative.surface`, imported from `@msanagu/pearl`) as a JS value instead — its resolved value is guaranteed correct by construction.',
  },
  {
    type: 'example',
    text: `// Feature.css.ts — extending Button past its documented variants
import { style } from '@vanilla-extract/css';
import { color } from '@msanagu/pearl';

// override: Pearl has no destructive Button variant — styling primary
// as danger here until one exists.
export const dangerButton = style({
  selectors: {
    '& [data-component="button"][data-variant="primary"]': {
      background: color.negative.surface,
      borderColor: color.negative.border,
    },
  },
});`,
  },
] as const;
