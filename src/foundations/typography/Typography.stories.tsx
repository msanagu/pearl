import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { color, fontFamily, fontWeight, space, text } from '@tokens';
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
import * as css from '../color/tokens/tokens.css';
import { StoryDoc } from '@/storydoc/StoryDoc';
import { typographyDoc } from './Typography.doc';

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
      <section className={css.section} id="typography-tokens">
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
            gap: space.xl,
            overflowX: 'auto',
            overflowY: 'clip',
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

      <section className={css.section} id="role-treatments">
        <h2 className={css.sectionTitle}>
          Role treatments — {active?.label ?? theme}
        </h2>
        <Text as="p" typeScale="bodyMd" prominence="subtle" measure="md">
          {active
            ? active.description
            : `${theme} has no role table yet — switch the toolbar's Theme to Pearl, Tahitian, or South Sea to see one.`}
        </Text>

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
            <ContextLabelSpecimen
              label="nav / index"
              sample="Index"
              theme={theme}
            />
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
    removePreviewPadding: true,
  },
  decorators: [
    (Story, context) => (
      <Story args={{ theme: (context.globals.theme as string) ?? 'pearl' }} />
    ),
  ],
};
export default meta;

type Story = StoryObj<typeof TypographyTokens>;

// Named to match the title's last segment so Storybook collapses the group
// into a single sidebar entry (no Typography/Default nesting).
export const Typography: Story = {
  render: (args) => (
    <StoryDoc
      doc={typographyDoc}
      demoSections={[
        { title: 'Typography tokens', id: 'typography-tokens' },
        { title: 'Role treatments', id: 'role-treatments' },
      ]}
      entityId="foundation.typography"
    >
      <TypographyTokens {...args} />
    </StoryDoc>
  ),
};
