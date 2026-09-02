import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect } from 'storybook/test';
import { runImpeccableAudit } from './impeccablePlay';
import { StoryAudit } from './StoryAudit';
import { Hero } from '@/templates/Hero/Hero';
import { SiteHeader } from '@/templates/SiteHeader/SiteHeader';
import { Docs } from '@/templates/Docs/Docs';
import { Form } from '@/templates/Form/Form';
import { Dashboard } from '@/templates/Dashboard/Dashboard';
import { Footer } from '@/templates/Footer/Footer';
import { footerPlateForTheme } from '@/templates/Footer/footerPlate';
import { brandWordmarkForTheme } from '@components/_brand/WordMark/brandWordmark';

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
  parameters: {
    layout: 'fullscreen',
    // The `StoryAudit` findings panel is dev chrome — keep axe off it, the
    // same way Impeccable skips it via `data-audit-overlay`.
    a11y: { context: { exclude: ['[data-audit-overlay]'] } },
  },
};
export default meta;

type Story = StoryObj;

// Locked gate: templates must stay clean of Impeccable anti-patterns in every theme.
const gate: NonNullable<Story['play']> = async ({ canvasElement }) => {
  const { count, text } = await runImpeccableAudit(canvasElement);
  expect(count, text).toBe(0);
};

export const SiteHeaderTemplate: Story = {
  name: 'SiteHeader',
  render: (_args, { globals }) => {
    // Same theme → wordmark resolution as Templates/SiteHeader, so the audited
    // masthead is the one the toolbar's theme actually ships (`pearl` vs
    // `TAHITIAN` vs `south sea`), decoration included — a hardcoded wordmark
    // would hide findings that only the decorated marks produce.
    const wordmark = brandWordmarkForTheme(globals.theme as string | undefined);
    return (
      <StoryAudit>
        <SiteHeader
          brandName={wordmark.text}
          brandRole={wordmark.role}
          brandUnderscoreColor={wordmark.underscoreColor}
        />
      </StoryAudit>
    );
  },
  play: gate,
};

export const HeroTemplate: Story = {
  name: 'Hero',
  render: () => (
    <StoryAudit>
      <Hero />
    </StoryAudit>
  ),
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

export const DashboardTemplate: Story = {
  name: 'Dashboard',
  render: () => (
    <StoryAudit>
      <Dashboard />
    </StoryAudit>
  ),
  play: gate,
};

export const FooterTemplate: Story = {
  name: 'Footer',
  render: (_args, { globals }) => {
    const theme = globals.theme as string | undefined;
    const wordmark = brandWordmarkForTheme(theme);
    const plate = footerPlateForTheme(theme);
    return (
      <StoryAudit>
        <Footer
          brandName={wordmark.text}
          brandRole={wordmark.role}
          plateImageSrc={plate.src}
          plateImageAlt={plate.alt}
        />
      </StoryAudit>
    );
  },
  play: gate,
};
