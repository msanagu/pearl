import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { color, fontFamily, fontWeight, text } from '@tokens';
import { Text } from '@components/Text/Text';
import type { ThemeRoles } from '@themes/roles';
import {
  pearlBrandWordmark,
  pearlDescription,
  pearlRoles,
} from '@themes/pearl/pearl.roles';
import {
  tahitianDescription,
  tahitianRoles,
} from '@themes/tahitian/tahitian.roles';
import {
  southSeaDescription,
  southSeaRoles,
} from '@themes/south-sea/south-sea.roles';
import {
  FamilySwatch,
  TypeSpecimen,
  WeightSwatch,
  WordMark,
  brandWordmarkByTheme,
  useComputed,
} from './typeSpecimens';
import * as css from '../color/tokens.css';

/**
 * Foundations → Typography: canon type plus the active theme's role treatments
 * — how it assigns type primitives to jobs (emphasis, preheading, data digits).
 * Role assignment is per-theme, so this section reads the toolbar's theme
 * global and switches its role table to match.
 *
 * Each role renders through the real `Text` `role` prop, never by reading a
 * treatment's shape in JS, so the resolved CSS is whatever the active theme's
 * stylesheet declares.
 */

const themesWithRoles: Record<
  string,
  { label: string; description: string; roles: ThemeRoles } | undefined
> = {
  pearl: { label: 'Pearl', description: pearlDescription, roles: pearlRoles },
  tahitian: {
    label: 'Tahitian',
    description: tahitianDescription,
    roles: tahitianRoles,
  },
  southSea: {
    label: 'South Sea',
    description: southSeaDescription,
    roles: southSeaRoles,
  },
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
      <span
        ref={ref}
        style={{
          fontFamily: fontFamily.body,
          fontSize: '22px',
          color: color.text,
        }}
      >
        The world is your{' '}
        <Text as="span" role="inlineEmphasis">
          oyster.
        </Text>
      </span>
      <ResolvedTag>
        {resolved['font-family']}
        {resolved['background-image'] && resolved['background-image'] !== 'none'
          ? ' · gradient'
          : ''}
      </ResolvedTag>
    </div>
  );
}

function PreheadingSpecimen({
  label,
  sample,
  theme,
}: {
  label: string;
  sample: string;
  theme: string;
}) {
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
        {resolved['font-family']} · {resolved['text-transform']} ·{' '}
        {resolved['letter-spacing']}
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
          <FamilySwatch
            name="display"
            cssVar={fontFamily.display}
            theme={theme}
          />
          <FamilySwatch
            name="heading"
            cssVar={fontFamily.heading}
            theme={theme}
          />
          <FamilySwatch name="body" cssVar={fontFamily.body} theme={theme} />
        </div>

        <h3 className={css.subsectionTitle}>Weight</h3>
        <div className={css.row}>
          <WeightSwatch
            name="regular"
            cssVar={fontWeight.regular}
            theme={theme}
          />
          <WeightSwatch
            name="medium"
            cssVar={fontWeight.medium}
            theme={theme}
          />
          <WeightSwatch
            name="semibold"
            cssVar={fontWeight.semibold}
            theme={theme}
          />
          <WeightSwatch name="bold" cssVar={fontWeight.bold} theme={theme} />
        </div>

        <h3 className={css.subsectionTitle}>
          Scale — size / line-height · weight · tracking, all resolved live
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {Object.entries(text).map(([name, variant]) => (
            <TypeSpecimen
              key={name}
              name={name}
              variant={variant}
              theme={theme}
            />
          ))}
        </div>
      </section>

      <section className={css.section}>
        <h2 className={css.sectionTitle}>
          Role treatments — {active?.label ?? theme}
        </h2>
        <p
          style={{
            fontFamily: fontFamily.body,
            fontSize: '13px',
            color: color.textSubtle,
            margin: 0,
          }}
        >
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
              <PreheadingSpecimen
                label="nav / index"
                sample="Index"
                theme={theme}
              />
              <PreheadingSpecimen
                label="caption"
                sample="01 / Nacre"
                theme={theme}
              />
              <PreheadingSpecimen
                label="index row"
                sample="Selected — 2024/26"
                theme={theme}
              />
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
  parameters: {
    layout: 'fullscreen',
    manifest: {
      name: 'typography',
      description:
        "One Text component, not split Heading/Text — typeScale (size), role (face), as (element), and weight are four independent axes that combine any of them; heading level is driven by document structure, never by how large something needs to look.",
      sections: [
        {
          kind: 'guidelines',
          for: 'agent',
          title: 'typeScale, role, as, weight — four independent axes',
          items: [
            {
              level: 'must',
              statement:
                'Choose visual scale and semantic element independently — heading level is driven by document structure (don\'t skip h1 -> h4), never by how large something needs to look. <Text typeScale="bodyMd" as="h2"> (structurally an h2, visually restrained) is valid and intentional, not a mistake.',
            },
            {
              level: 'must',
              statement:
                'typeScale selects the token bundle (size, line-height, tracking, default weight); as selects the actual DOM element; weight optionally overrides the scale step\'s default weight; role overrides face (and, per-theme, case/tracking) independently of scale — pairing a role with a larger or smaller typeScale than its default doesn\'t fight the role\'s meaning, same as rendering headingLg as an h2 doesn\'t fight as. All four combine freely.',
            },
            {
              level: 'must',
              statement:
                'A role passed with no typeScale inherits ambient size from its surrounding context rather than being forced to bodyMd — e.g. Pearl\'s inlineEmphasis has no declared size for exactly this reason. Don\'t add a typeScale to a role-only usage just to give it "a" size.',
            },
          ],
        },
        {
          kind: 'guidelines',
          for: 'agent',
          title: 'Units, per WCAG',
          items: [
            {
              level: 'must',
              statement:
                "fontSize is rem, not px — SC 1.4.4 Resize Text (AA): text must scale up to 200% via the browser's own zoom/text-size setting without loss of content, which rem inherits and px ignores.",
            },
            {
              level: 'must',
              statement:
                "lineHeight is a unitless multiplier, not a fixed px value — SC 1.4.12 Text Spacing (AA): a user-forced line-spacing override (>=1.5x) must not break the layout, which only a unitless ratio (recalculating against whatever font-size results) allows.",
            },
            {
              level: 'must',
              statement:
                'letterSpacing is em, not px — same SC 1.4.12: tracking scales proportionally with font-size instead of staying a fixed px gap that reads as too tight or too loose once size changes.',
            },
            {
              level: 'should',
              statement:
                'Body copy line-height targets >=1.5x — SC 1.4.8 Visual Presentation (AAA), "at least 1.5 within paragraphs." Not a hard AA requirement, but the default authored value meets it anyway rather than needing a user override to get there.',
            },
          ],
        },
        {
          kind: 'definitions',
          for: 'agent',
          title: "Type scale — Pearl's reference values (4px-grid ramp, shared across all four themes)",
          items: [
            {
              term: 'caption',
              definition:
                '11px (0.6875rem) fontSize, 1.4545 lineHeight (resolves to 16px), 0 letterSpacing. The one deliberate 4px-grid exception: true 4px neighbors are 8px (below the 11px legibility floor for functional UI text) and 12px (collides with bodySm), so it holds 11px instead. Only its raw fontSize escapes the grid — resolved lineHeight is still a 4px multiple.',
            },
            {
              term: 'bodySm',
              definition: '12px (0.75rem), 1.667 lineHeight (20px), 0 letterSpacing.',
            },
            {
              term: 'bodyMd',
              definition: '16px (1rem), 1.5 lineHeight (24px), 0 letterSpacing.',
            },
            {
              term: 'bodyLg',
              definition: '24px (1.5rem), 1.5 lineHeight (36px), 0 letterSpacing.',
            },
            {
              term: 'headingSm',
              definition:
                '32px (2rem), 1.25 lineHeight (40px), -0.01em letterSpacing (-0.32px).',
            },
            {
              term: 'headingMd',
              definition:
                '40px (2.5rem), 1.2 lineHeight (48px), -0.015em letterSpacing (-0.6px).',
            },
            {
              term: 'headingLg',
              definition:
                '56px (3.5rem), 1.143 lineHeight (64px), -0.02em letterSpacing (-1.12px).',
            },
            {
              term: 'displaySm',
              definition:
                '72px (4.5rem), 1.056 lineHeight (76px), -0.03em letterSpacing (-2.16px).',
            },
            {
              term: 'displayLg',
              definition:
                '112px (7rem), 1.071 lineHeight (120px), -0.04em letterSpacing (-4.48px). Top of the reading hierarchy — see displayXl below for why it does not go higher for section headings.',
            },
            {
              term: 'displayXl',
              definition:
                '152px (9.5rem), 1.053 lineHeight (160px), -0.045em letterSpacing (-6.84px). Identity type only — a wordmark on a title page, nothing else. Do not reach for it for section headings.',
            },
          ],
        },
        {
          kind: 'definitions',
          for: 'agent',
          title: 'Font-weight scale (values consistent across all four themes; only which name a step defaults to differs)',
          items: [
            {
              term: 'regular (400)',
              definition:
                'Default for bodySm/bodyMd/bodyLg in every theme.',
            },
            {
              term: 'medium (500)',
              definition:
                "Pearl's default for headingSm/headingMd/headingLg/displaySm/displayLg/displayXl — Pearl is the one outlier, one step lighter than the other three themes throughout. Override-only for the other three themes.",
            },
            {
              term: 'semibold (600)',
              definition:
                "Tahitian/Freshwater/South Sea's default for headingSm/headingMd/headingLg, and Tahitian's default for displaySm/displayLg/displayXl too. Override-only for Pearl.",
            },
            {
              term: 'bold (700)',
              definition:
                "Freshwater and South Sea's default for displaySm/displayLg/displayXl. Override-only elsewhere.",
            },
          ],
        },
        {
          kind: 'section',
          for: 'agent',
          title: 'displayXl — the poster step, and why it exists',
          body: 'displayXl was promoted, not designed in advance: the introduction page set its wordmark at displayLg and measured it at 13% of the content width, with the brand object rendering 1.75x the height of the brand name — the scale had no larger step to reach for. That is the promotion test this system uses for canon generally: canon grows by promotion, not accretion — a real consumer needed it, the absence forced a page-local workaround, and a second consumer (Hero) was already queued behind it. Overriding fontSize on the page directly was rejected because it would put a raw type value outside the theme layer, which the reskinning promise forbids. Adding it was a breaking contract change deliberately: all four themes had to author a real value before the build would pass, and the compiler caught two consumers that were easy to forget (Text.css.ts\'s recipe, experiments/theme-generator) — that coordination tax is the contract working, not a cost to route around.',
        },
        {
          kind: 'section',
          for: 'agent',
          title: 'One Text component, not split Heading/Text',
          body: 'Typography properties (size, weight, line-height, letter-spacing) are a closed, stable set of concerns — unifying them under one component with a typeScale token is the safe kind of DRY (a heading and a paragraph aren\'t structurally different things, they\'re the same thing, styled text, at different scale steps). as should generally resolve to genuine semantic HTML5 elements (p, span, h1-h6) — see the semantic-html rationale entity — Text is the polymorphic mechanism that keeps visual styling and semantic markup honest and independently controllable.',
        },
      ],
    },
  },
  decorators: [
    (Story, context) => (
      <Story args={{ theme: (context.globals.theme as string) ?? 'pearl' }} />
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof TypographyPreview>;

export const Overview: Story = {};
