import type { Parameters } from '@storybook/react-vite';

/**
 * Template stories document *composition*, so "Show code" has to show the
 * template's own source — how the system's components fit together to make
 * the whole UI — not the one-line `<Form />` invocation Storybook infers
 * from the story itself.
 *
 * Pair with a `?raw` import of the template's `.tsx` (Vite serves the file
 * verbatim) so the panel can never drift from what actually renders.
 *
 * Apply this to the STORY, never to `meta`. When a stories file has a JSDoc
 * block above `const meta`, Storybook's CSF plugin appends
 * `docs: { description: { component } }` to the compiled meta parameters,
 * which replaces the whole `docs` key and silently drops `docs.source`. The
 * equivalent story-level injection spreads `parameters.docs.source` last, so
 * the code set here survives.
 */
export function templateSource(code: string): Parameters {
  return { docs: { source: { code, language: 'tsx', type: 'code' } } };
}
