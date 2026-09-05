import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { color, fontFamily, fontWeight, text } from '@tokens';
import { Text } from '@components/Text/Text';
import type { ThemeRoles } from '@themes/roles';
import { pearlDescription, pearlRoles } from '@themes/pearl/pearl.roles';
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
  useComputed,
} from './typeSpecimens';
import * as css from '../color/tokens.css';

/**
 * Foundations → Typography: the flat token list — fontFamily.*, fontWeight.*,
 * text.*, dotted like every other foundation — plus the active theme's role
 * treatments (how it assigns type primitives to jobs: emphasis, context
 * label, data digits). Role assignment is per-theme, so that section reads the
 * toolbar's theme global and switches its role table to match.
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

function ContextLabelSpecimen({
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
    '[data-role="contextLabel"]',
    [theme],
  );
  return (
    <div ref={ref} className={css.cell}>
      <Text
        as="span"
        role="contextLabel"
        typeScale="caption"
        prominence="subtle"
      >
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

/**
 * The flat token list — every fontFamily, fontWeight, and text step, labelled
 * with its dotted accessor and its live-resolved value under the active theme
 * — plus that theme's role treatments (per-theme, so it reads the toolbar).
 */
function TypographyTokens({ theme = 'pearl' }: { theme?: string }) {
  const active = themesWithRoles[theme];
  return (
    <div className={css.page}>
      <section className={css.section}>
        <h2 className={css.sectionTitle}>Typography tokens</h2>

        <h3 className={css.subsectionTitle}>fontFamily</h3>
        <div className={css.row}>
          <FamilySwatch
            name="fontFamily.display"
            cssVar={fontFamily.display}
            theme={theme}
          />
          <FamilySwatch
            name="fontFamily.heading"
            cssVar={fontFamily.heading}
            theme={theme}
          />
          <FamilySwatch
            name="fontFamily.body"
            cssVar={fontFamily.body}
            theme={theme}
          />
          <FamilySwatch
            name="fontFamily.mono"
            cssVar={fontFamily.mono}
            theme={theme}
          />
        </div>

        <h3 className={css.subsectionTitle}>fontWeight</h3>
        <div className={css.row}>
          <WeightSwatch
            name="fontWeight.regular"
            cssVar={fontWeight.regular}
            theme={theme}
          />
          <WeightSwatch
            name="fontWeight.medium"
            cssVar={fontWeight.medium}
            theme={theme}
          />
          <WeightSwatch
            name="fontWeight.semibold"
            cssVar={fontWeight.semibold}
            theme={theme}
          />
          <WeightSwatch
            name="fontWeight.bold"
            cssVar={fontWeight.bold}
            theme={theme}
          />
        </div>

        <h3 className={css.subsectionTitle}>
          text — size / line-height · weight · tracking, all resolved live
        </h3>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 16,
            overflowX: 'auto',
            overflowWrap: 'anywhere',
          }}
        >
          {Object.entries(text).map(([name, variant]) => (
            <TypeSpecimen
              key={name}
              name={`text.${name}`}
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

        {active?.roles.contextLabel && (
          <>
            <h3 className={css.subsectionTitle}>Context label</h3>
            <div className={css.row}>
              <ContextLabelSpecimen
                label="nav / index"
                sample="Index"
                theme={theme}
              />
              <ContextLabelSpecimen
                label="caption"
                sample="01 / Nacre"
                theme={theme}
              />
              <ContextLabelSpecimen
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

const meta: Meta<typeof TypographyTokens> = {
  title: 'Foundations/Typography',
  component: TypographyTokens,
  parameters: {
    layout: 'fullscreen',
    manifest: {
      name: 'typography',
      description:
        'One Text component, not split Heading/Text — typeScale (size), role (face), as (element), and weight are four independent axes that combine any of them; heading level is driven by document structure, never by how large something needs to look.',
      sections: [
        {
          kind: 'guidelines',
          for: 'agent',
          title: 'typeScale, role, as, weight — four independent axes',
          items: [
            {
              level: 'must',
              statement:
                'Choose visual scale and semantic element independently — heading level follows document structure (don\'t skip h1 -> h4), never visual size. <Text typeScale="bodyMd" as="h2"> (structurally h2, visually restrained) is valid, not a mistake.',
            },
            {
              level: 'must',
              statement:
                "typeScale selects the token bundle (size, line-height, tracking, default weight); as selects the DOM element; weight overrides the step's default weight; role overrides face (and per-theme case/tracking) independently of scale. All four combine freely — pairing a role with a different typeScale than its default doesn't fight the role's meaning.",
            },
            {
              level: 'must',
              statement:
                "A role with no typeScale inherits ambient size rather than being forced to bodyMd — an inlineEmphasis treatment may carry no declared size for exactly this reason. Don't add a typeScale to a role-only usage just to give it a size.",
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
                'fontSize is rem, not px — SC 1.4.4: text must scale to 200% via browser zoom without loss of content, which rem inherits and px ignores.',
            },
            {
              level: 'must',
              statement:
                'lineHeight is a unitless multiplier, not px — SC 1.4.12: a user-forced line-spacing override (>=1.5x) must not break the layout, which only a unitless ratio allows.',
            },
            {
              level: 'must',
              statement:
                'letterSpacing is em, not px — same SC 1.4.12: tracking scales with font-size instead of a fixed gap that reads wrong once size changes.',
            },
            {
              level: 'should',
              statement:
                'Body line-height targets >=1.5x — SC 1.4.8 (AAA), not a hard AA requirement, but the default value meets it anyway.',
            },
          ],
        },
        {
          kind: 'definitions',
          for: 'agent',
          title:
            'Type scale — reference values (4px-grid ramp, shared across every theme)',
          items: [
            {
              term: 'caption',
              definition:
                '11px (0.6875rem), 1.4545 lineHeight (16px), 0 letterSpacing. The one 4px-grid exception — true neighbors are 8px (below the 11px legibility floor) and 12px (collides with bodySm). Only fontSize escapes the grid; resolved lineHeight is still a 4px multiple.',
            },
            {
              term: 'bodySm',
              definition:
                '12px (0.75rem), 1.667 lineHeight (20px), 0 letterSpacing.',
            },
            {
              term: 'bodyMd',
              definition:
                '16px (1rem), 1.5 lineHeight (24px), 0 letterSpacing.',
            },
            {
              term: 'bodyLg',
              definition:
                '24px (1.5rem), 1.5 lineHeight (36px), 0 letterSpacing.',
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
                '112px (7rem), 1.071 lineHeight (120px), -0.04em letterSpacing (-4.48px). Top of the reading hierarchy — see displayXl.',
            },
            {
              term: 'displayXl',
              definition:
                '152px (9.5rem), 1.053 lineHeight (160px), -0.045em letterSpacing (-6.84px). Identity type only — a wordmark on a title page. Not for section headings.',
            },
          ],
        },
        {
          kind: 'definitions',
          for: 'agent',
          title:
            'Font-weight scale (values identical across themes; which step is a role default varies by theme — check the active theme entry)',
          items: [
            {
              term: 'regular (400)',
              definition: 'Default for bodySm/bodyMd/bodyLg in every theme.',
            },
            {
              term: 'medium (500)',
              definition:
                'One step up from body. A heading and display default in the lighter-weight themes; override-only in the others.',
            },
            {
              term: 'semibold (600)',
              definition:
                'A heading default in most themes, and a display default in some; override-only where a theme sets its headings lighter.',
            },
            {
              term: 'bold (700)',
              definition:
                'Heaviest step. A display default in some themes; override-only elsewhere.',
            },
          ],
        },
        {
          kind: 'section',
          for: 'agent',
          title: 'displayXl — the poster step, and why it exists',
          body: "Promoted, not designed in advance: the introduction page's wordmark at displayLg measured 13% of content width, brand object 1.75x the brand name's height, with no larger step to reach for. Canon grows by promotion, not accretion — a real consumer needed it, forcing a page-local workaround, with a second consumer (Hero) already queued. Overriding fontSize directly was rejected — it would put a raw type value outside the theme layer. Adding it was a deliberate breaking change: all four themes had to author a value, and the compiler caught two easy-to-forget consumers (Text.css.ts's recipe, experiments/theme-generator) — that coordination tax is the contract working.",
        },
        {
          kind: 'section',
          for: 'agent',
          title: 'One Text component, not split Heading/Text',
          body: 'Typography properties (size, weight, line-height, letter-spacing) are a closed, stable set — unifying them under one typeScale token is safe DRY: a heading and a paragraph are the same thing, styled text, at different scale steps. as should resolve to genuine semantic HTML5 elements — see the semantic-html rationale entity.',
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

type Story = StoryObj<typeof TypographyTokens>;

export const Tokens: Story = {};
