import type { Meta, StoryObj } from '@storybook/react-vite';
import { useGlobals } from 'storybook/preview-api';
import { Introduction } from './Introduction';
import { ThemeControl } from './ThemeControl';
import introductionSource from './Introduction.tsx?raw';
import { templateSource } from '@/templates/templateSource';
import { overtonePlate } from '@themes/tahitian/tahitian.css';
import { washPlate } from '@themes/freshwater/freshwater.css';
import { footerPlateForTheme } from '@/templates/Footer/footerPlate';
import {
  statsPearl,
  statsTahitian,
  statsFreshwater,
} from './statsTreatments.css';

const statsTreatmentByTheme: Record<string, string> = {
  pearl: statsPearl,
  tahitian: statsTahitian,
  freshwater: statsFreshwater,
};

/**
 * The system's front door — what Pearl is, the decisions that shape it, and
 * where to go next. Pinned to the top of the sidebar via the `storySort`
 * order in `.storybook/preview.tsx`.
 *
 * Composed from shipped primitives only, so it doubles as a specimen of the
 * system it introduces. "Show code" is the page's own source.
 */
const meta: Meta<typeof Introduction> = {
  title: 'Introduction',
  component: Introduction,
  parameters: { layout: 'fullscreen', removePreviewPadding: true },
  decorators: [
    // The index plate's treatment is theme-owned, so it is selected here from
    // the toolbar's active theme rather than inside the page — the same shape
    // as `Hero.stories`' per-theme wordmark. Themes with no plate treatment
    // pass nothing and the plate stays a plain inverse surface.
    (Story, context) => {
      const [globals, updateGlobals] = useGlobals();
      const theme = globals.theme as string | undefined;
      const footerPlate = footerPlateForTheme(theme);
      return (
        <Story
          args={{
            themeControl: context.args.themeControl ?? (
              <ThemeControl
                theme={theme ?? 'pearl'}
                mode={(globals.mode as string) ?? 'light'}
                onThemeChange={(t) => updateGlobals({ theme: t })}
                onModeChange={(m) => updateGlobals({ mode: m })}
              />
            ),
            plateTreatment:
              context.args.plateTreatment ??
              (theme === 'tahitian'
                ? overtonePlate
                : theme === 'freshwater'
                  ? washPlate
                  : ''),
            statsTreatment:
              context.args.statsTreatment ??
              statsTreatmentByTheme[theme as string] ??
              '',
            footerPlateSrc: context.args.footerPlateSrc ?? footerPlate.src,
            footerPlateAlt: context.args.footerPlateAlt ?? footerPlate.alt,
          }}
        />
      );
    },
  ],
};
export default meta;

type Story = StoryObj<typeof Introduction>;

export const Overview: Story = {
  // Story level, not meta — see `templateSource`.
  parameters: templateSource(introductionSource),
};
