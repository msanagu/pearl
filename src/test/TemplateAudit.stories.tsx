import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { runImpeccableAudit } from './impeccablePlay';
import { StoryAudit } from './StoryAudit';
import { Hero } from '../templates/Hero/Hero';
import { Docs } from '../templates/Docs/Docs';
import { Form } from '../templates/Form/Form';
import { brandWordmarkForTheme } from '../themes/brandWordmark';

/**
 * Template audit — the composition-level counterpart to the component audit
 * ([ComponentAudit.stories.tsx]). Components can each be clean on their own and
 * still produce anti-patterns once assembled at page scale (rhythm, contrast
 * over full-bleed surfaces, shadow stacking), so every template gets its own
 * scanned story and its own gate, keeping findings attributable to one template.
 *
 * Theme-agnostic by design — each story renders under whatever the Theme/Mode
 * toolbar globals select, so the same gates cover every theme × mode pair.
 *
 * Each `play` fails with a grouped report if any non-advisory anti-pattern is
 * found, so `vitest --project=storybook` surfaces exactly what needs fixing.
 */
const meta: Meta = {
  title: 'Audit/Templates',
  parameters: { layout: 'fullscreen' },
};
export default meta;

type Story = StoryObj;

// Locked gate: templates must stay clean of Impeccable anti-patterns in every theme.
const gate: NonNullable<Story['play']> = async ({ canvasElement }) => {
  const { count, text } = await runImpeccableAudit(canvasElement);
  expect(count, text).toBe(0);
};

export const HeroTemplate: Story = {
  name: 'Hero',
  render: (_args, { globals }) => {
    // Same theme → wordmark resolution as Templates/Hero, so the audited hero
    // is the one the toolbar's theme actually ships (`pearl` vs `TAHITIAN`
    // vs `south sea`), decoration included — a hardcoded wordmark would hide
    // findings that only the decorated marks produce.
    const wordmark = brandWordmarkForTheme(globals.theme as string | undefined);
    return (
      <StoryAudit>
        <Hero brandName={wordmark.text} brandRole={wordmark.role} />
      </StoryAudit>
    );
  },
  play: gate,
};

export const DocsTemplate: Story = {
  name: 'Docs',
  // Full-bleed doc page: no preview gutter, same as Templates/Docs.
  parameters: { removePreviewPadding: true },
  render: () => (
    <StoryAudit>
      <Docs />
    </StoryAudit>
  ),
  play: gate,
};

export const FormTemplate: Story = {
  name: 'Form',
  render: () => (
    <StoryAudit>
      <Form />
    </StoryAudit>
  ),
  play: gate,
};
