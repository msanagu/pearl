import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { color, fontFamily, fontWeight, text } from '@tokens';
import { Text } from '@components/Text/Text';
import type { ThemeRoles } from '@themes/roles';
import { pearlBrandWordmark, pearlDescription, pearlRoles } from '@themes/pearl/pearl.roles';
import { tahitianDescription, tahitianRoles } from '@themes/tahitian/tahitian.roles';
import { southSeaDescription, southSeaRoles } from '@themes/south-sea/south-sea.roles';
import { FamilySwatch, TypeSpecimen, WeightSwatch, WordMark, brandWordmarkByTheme, useComputed } from './typeSpecimens';
import * as css from './tokens.css';

/**
 * Foundations → Typography: canon type (theme-agnostic, driven by the active
 * Storybook theme) plus the active theme's ROLE TREATMENTS — how it assigns
 * type primitives to jobs (emphasis, preheading, data digits). Role
 * assignment is a per-theme distinction, not a canon slot (docs/theme/
 * theme-revision-decisions.md §8), so this section reads the Storybook
 * toolbar's theme global and switches its role table to match, rather than
 * describing one theme regardless of what's selected.
 *
 * Each role is rendered through the real `Text` `role` prop — never by
 * reading a treatment's shape in JS (a gradient like Tahitian's `overtone`
 * has nothing in common with a `fontFamily`/`fontStyle` pair like Pearl's
 * `serifItalic`) — so the resolved CSS is whatever the active theme's own
 * stylesheet actually declares, not a JS-side guess at it.
 */

const themesWithRoles: Record<
  string,
  { label: string; description: string; roles: ThemeRoles } | undefined
> = {
  pearl: { label: 'Pearl', description: pearlDescription, roles: pearlRoles },
  tahitian: { label: 'Tahitian', description: tahitianDescription, roles: tahitianRoles },
  southSea: { label: 'South Sea', description: southSeaDescription, roles: southSeaRoles },
};

function ResolvedTag({ children }: { children: ReactNode }) {
  return <span className={css.resolvedValue}>{children}</span>;
}

function InlineEmphasisSpecimen({ theme }: { theme: string }) {
  const [ref, resolved] = useComputed<HTMLSpanElement>(
    ['font-family', 'background-image', 'color'],
    '[data-role="inlineEmphasis"]',
    [theme],
  );
  return (
    <div className={css.cell}>
      <span ref={ref} style={{ fontFamily: fontFamily.body, fontSize: '22px', color: color.text }}>
        The world is your <Text as="span" role="inlineEmphasis">oyster.</Text>
      </span>
      <ResolvedTag>
        {resolved['font-family']}
        {resolved['background-image'] && resolved['background-image'] !== 'none' ? ' · gradient' : ''}
      </ResolvedTag>
    </div>
  );
}

function PreheadingSpecimen({ label, sample, theme }: { label: string; sample: string; theme: string }) {
  const [ref, resolved] = useComputed<HTMLSpanElement>(
    ['font-family', 'text-transform', 'letter-spacing'],
    '[data-role="preheading"]',
    [theme],
  );
  return (
    <div ref={ref} className={css.cell}>
      <Text as="span" role="preheading" typeScale="caption" prominence="subtle">
        {sample}
      </Text>
      <span>{label}</span>
      <ResolvedTag>
        {resolved['font-family']} · {resolved['text-transform']} · {resolved['letter-spacing']}
      </ResolvedTag>
    </div>
  );
}

function DataDigitsSpecimen({ theme }: { theme: string }) {
  const [ref, resolved] = useComputed<HTMLDivElement>(
    ['font-family', 'font-variant-numeric'],
    '[data-role="dataDigits"]',
    [theme],
  );
  return (
    <div ref={ref} className={css.cell}>
      <Text as="span" role="dataDigits" typeScale="bodyMd">
        1,204.50
      </Text>
      <ResolvedTag>{resolved['font-family']}</ResolvedTag>
    </div>
  );
}

function TypographyPreview({ theme = 'pearl' }: { theme?: string }) {
  const active = themesWithRoles[theme];
  return (
    <div className={css.page}>
      <section className={css.section}>
        {/* `scale={2.8}` — see the re-export's own comment in
            `typeSpecimens.tsx` for why: reproduces the size this page used
            to render at (`displayLg`, `7rem`) against `WordMark`'s
            `headingMd`-relative base (`2.5rem`). */}
        <WordMark
          {...(brandWordmarkByTheme[theme] ?? pearlBrandWordmark)}
          scale={2.8}
          className={css.wordmarkTitle}
        />

        <h2 className={css.sectionTitle}>Type scale</h2>

        <h3 className={css.subsectionTitle}>Family</h3>
        <div className={css.row}>
          <FamilySwatch name="display" cssVar={fontFamily.display} theme={theme} />
          <FamilySwatch name="heading" cssVar={fontFamily.heading} theme={theme} />
          <FamilySwatch name="body" cssVar={fontFamily.body} theme={theme} />
        </div>

        <h3 className={css.subsectionTitle}>Weight</h3>
        <div className={css.row}>
          <WeightSwatch name="regular" cssVar={fontWeight.regular} theme={theme} />
          <WeightSwatch name="medium" cssVar={fontWeight.medium} theme={theme} />
          <WeightSwatch name="semibold" cssVar={fontWeight.semibold} theme={theme} />
          <WeightSwatch name="bold" cssVar={fontWeight.bold} theme={theme} />
        </div>

        <h3 className={css.subsectionTitle}>
          Scale — size / line-height · weight · tracking, all resolved live
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {Object.entries(text).map(([name, variant]) => (
            <TypeSpecimen key={name} name={name} variant={variant} theme={theme} />
          ))}
        </div>
      </section>

      <section className={css.section}>
        <h2 className={css.sectionTitle}>
          Role treatments — {active?.label ?? theme}
        </h2>
        <p style={{ fontFamily: fontFamily.body, fontSize: '13px', color: color.textSubtle, margin: 0 }}>
          {active
            ? active.description
            : `${theme} has no role table yet — switch the toolbar's Theme to Pearl, Tahitian, or South Sea to see one.`}
        </p>

        {active?.roles.inlineEmphasis && (
          <>
            <h3 className={css.subsectionTitle}>
              Inline emphasis — {active.roles.inlineEmphasis.scope?.join(', ')}
            </h3>
            <InlineEmphasisSpecimen theme={theme} />
          </>
        )}

        {active?.roles.preheading && (
          <>
            <h3 className={css.subsectionTitle}>Preheading</h3>
            <div className={css.row}>
              <PreheadingSpecimen label="nav / index" sample="Index" theme={theme} />
              <PreheadingSpecimen label="caption" sample="01 / Nacre" theme={theme} />
              <PreheadingSpecimen label="index row" sample="Selected — 2024/26" theme={theme} />
            </div>
          </>
        )}

        {active?.roles.dataDigits && (
          <>
            <h3 className={css.subsectionTitle}>Data digits</h3>
            <DataDigitsSpecimen theme={theme} />
          </>
        )}
      </section>
    </div>
  );
}

const meta: Meta<typeof TypographyPreview> = {
  title: 'Foundations/Typography',
  component: TypographyPreview,
  parameters: { layout: 'fullscreen' },
  decorators: [
    (Story, context) => <Story args={{ theme: (context.globals.theme as string) ?? 'pearl' }} />,
  ],
};
export default meta;

type Story = StoryObj<typeof TypographyPreview>;

export const Overview: Story = {};
