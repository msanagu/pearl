import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { runImpeccableAudit } from './impeccablePlay';
import { StoryAudit } from './StoryAudit';
import { Introduction } from '@/introduction/Introduction';
import { overtonePlate } from '@themes/tahitian/tahitian.css';
import { washPlate } from '@themes/freshwater/freshwater.css';
import { statsPearl, statsTahitian, statsFreshwater } from '@/introduction/statsTreatments.css';

const statsTreatmentByTheme: Record<string, string> = {
  pearl: statsPearl,
  tahitian: statsTahitian,
  freshwater: statsFreshwater,
};

/**
 * Page audit — the whole-page counterpart to the component and template
 * audits ([ComponentAudit.stories.tsx], [TemplateAudit.stories.tsx]). A
 * template can be clean composed alone and still produce anti-patterns once
 * it's one section among several on a real page (rhythm across sections,
 * cumulative contrast, repeated treatments stacking), so a full page gets
 * its own scanned story too.
 *
 * Theme-agnostic by design — renders under whatever the Theme/Mode toolbar
 * globals select, so the same gate covers every theme × mode pair.
 *
 * `play` fails with a grouped report if any non-advisory anti-pattern is
 * found, so `vitest --project=storybook` surfaces exactly what needs fixing.
 */
const meta: Meta = {
  title: 'Audit/Pages',
  parameters: { layout: 'fullscreen', removePreviewPadding: true },
};
export default meta;

type Story = StoryObj;

// Locked gate: pages must stay clean of Impeccable anti-patterns in every theme.
const gate: NonNullable<Story['play']> = async ({ canvasElement }) => {
  const { count, text } = await runImpeccableAudit(canvasElement);
  expect(count, text).toBe(0);
};

export const IntroductionPage: Story = {
  name: 'Introduction',
  render: (_args, { globals }) => {
    // Same theme → treatment resolution as Introduction.stories.tsx's own
    // decorator, so the audited page is the one the toolbar's theme actually
    // ships (Tahitian's overtone plate, Freshwater's wash plate and stats
    // treatment) — a bare, untreated render would hide findings that only
    // the decorated surfaces produce.
    const theme = globals.theme as string | undefined;
    const plateTreatment =
      theme === 'tahitian' ? overtonePlate : theme === 'freshwater' ? washPlate : '';
    const statsTreatment = statsTreatmentByTheme[theme as string] ?? '';
    return (
      <StoryAudit>
        <Introduction plateTreatment={plateTreatment} statsTreatment={statsTreatment} />
      </StoryAudit>
    );
  },
  play: gate,
};
