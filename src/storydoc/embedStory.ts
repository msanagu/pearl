import type { ComponentType } from 'react';
import { composeStory } from 'storybook/preview-api';
import type { Meta, StoryObj } from '@storybook/react-vite';

/**
 * Renders another component's own story inside a StoryDoc demo, instead of a
 * hand-copied re-implementation that drifts the moment the component's API
 * changes — Icon.tone's class-to-prop migration broke exactly this kind of
 * copy once already. `story`/`meta` are a CSF export pair from that
 * component's own `*.stories.tsx` (the story plus its file's `default`);
 * `composeStory` resolves args/decorators/loaders the same way Storybook's
 * own preview does, so the embedded output matches what that story renders
 * on its own page.
 *
 * Typed loosely (`any` in, a plain `ComponentType` out): most stories in this
 * codebase are written as a bare `StoryObj` rather than `StoryObj<typeof X>`,
 * so `composeStory`'s own generics rarely line up with a real CSF export pair
 * without fighting inference — a purely type-level mismatch, not a runtime one.
 */
export function embedStory(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  story: StoryObj<any>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  meta: Meta<any>,
): ComponentType {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return composeStory(story as any, meta as any);
}
