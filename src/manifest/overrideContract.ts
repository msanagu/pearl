/**
 * The override contract, as real structured data — not hand-typed into any
 * one consumer's prompt. See docs/foundations/override-patterns.md for the
 * full human-facing writeup this mirrors; this file is the condensed,
 * generator-readable version the manifest actually ships, the same way a
 * theme's `.roles.ts` is the generator-readable version of its own prose.
 *
 * DS-wide principle, not tied to any one component/foundation/theme — ships
 * as a `rationale` entity in `dist/manifest/base.json`.
 */
export const overrideContractDocumentBlocks = [
  {
    type: 'do',
    text: 'Target the stable `data-component`/`data-part`/`data-variant` attributes every component renders — this is the primary, intended extension mechanism, not an implementation detail. Extend past a documented variant (e.g. a destructive/danger action when only `primary`/`secondary` exist) by targeting the closest variant\'s data attributes from a feature-level stylesheet: `[data-component="button"][data-variant="primary"] { ... }`.',
  },
  {
    type: 'dont',
    text: "Never use an inline `style={{...}}` prop to change a component's visual treatment (color, border, background). It is invisible to the rest of the app and to this design system's own maintainers — unfindable, unauditable, and impossible to promote into a real token or variant later.",
  },
  {
    type: 'dont',
    text: 'Never import the library\'s internal class tokens, and never add a bespoke CSS-variable prop per element, as a substitute for targeting data attributes.',
  },
  {
    type: 'do',
    text: 'When an override like that is used, say so in two places: a code comment at the override site explaining what\'s missing and why (e.g. "override: Pearl has no destructive Button variant — styling primary as danger here"), and a plain statement in any prose accompanying the generated code.',
  },
  {
    type: 'verification',
    text: 'Check that an override is flagged in both places before shipping it. This is not optional politeness — an unflagged override is real evidence the variant set is incomplete, lost the moment it ships silently instead of surfacing as a signal for what the design system should grow to cover next.',
  },
  {
    type: 'dont',
    text: 'Never hand-type a literal CSS custom-property name (e.g. `var(--color-negative-icon)`) for a Pearl color value in an override, in any environment — vanilla-extract compiles these names at build time and they are not documented, predictable, or stable across builds. A wrong guess does not error; it silently fails to apply.',
  },
  {
    type: 'do',
    text: 'Always reference the real token object (`color.negative.surface`, imported from `@msanagu/pearl`) as a JS value instead of a hand-typed custom-property name — its resolved value is guaranteed correct by construction.',
  },
] as const;
