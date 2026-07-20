import type { Meta, StoryObj } from '@storybook/react-vite';
import { color, fontFamily, fontWeight, text } from '../tokens';
import { pearlAssignments } from '../themes/pearl.assignment';
import { FamilySwatch, TypeSpecimen, WeightSwatch, useComputed } from './typeSpecimens';
import * as css from './tokens.css';

/**
 * Foundations → Typography: canon type (theme-agnostic, driven by the active
 * Storybook theme) plus each theme's ROLE TREATMENTS — how it assigns type
 * primitives to jobs (emphasis, label). Role assignment is a per-theme
 * distinction, not a canon slot (docs/theme-revision-decisions.md §8) — so
 * unlike the sections above it, "Role treatments" is theme-specific content,
 * not a live reflection of whichever theme the toolbar has selected.
 *
 * Starting with Pearl — the only theme with an assignment record so far. Add
 * a section per theme as each gets one (see docs/decisions/0007).
 */

function RoleEmphasisSpecimen({ role }: { role: { fontFamily: string; style?: string } }) {
  const [ref, resolved] = useComputed<HTMLSpanElement>(['font-family', 'font-style']);
  return (
    <div className={css.cell}>
      <span style={{ fontFamily: fontFamily.body, fontSize: '22px', color: color.text }}>
        The world is your{' '}
        <span ref={ref} style={{ fontFamily: role.fontFamily, fontStyle: role.style }}>
          oyster.
        </span>
      </span>
      <span className={css.resolvedValue}>
        emphasis: {resolved['font-family']} · {resolved['font-style']}
      </span>
    </div>
  );
}

function RoleLabelSpecimen({
  label,
  sample,
  role,
}: {
  label: string;
  sample: string;
  role: { fontFamily: string; case?: 'upper' | 'sentence'; tracking?: string };
}) {
  const [ref, resolved] = useComputed<HTMLSpanElement>([
    'font-family',
    'text-transform',
    'letter-spacing',
  ]);
  return (
    <div className={css.cell}>
      <span
        ref={ref}
        style={{
          fontFamily: role.fontFamily,
          textTransform: role.case === 'upper' ? 'uppercase' : 'none',
          letterSpacing: role.tracking,
          color: color.textSubtle,
          fontSize: '11px',
        }}
      >
        {sample}
      </span>
      <span>{label}</span>
      <span className={css.resolvedValue}>
        {resolved['font-family']} · {resolved['text-transform']} · {resolved['letter-spacing']}
      </span>
    </div>
  );
}

function TypographyPreview() {
  const roles = pearlAssignments.roles?.typography;
  return (
    <div className={css.page}>
      <section className={css.section}>
        <h2 className={css.sectionTitle}>Type scale</h2>

        <h3 className={css.subsectionTitle}>Family</h3>
        <div className={css.row}>
          <FamilySwatch name="display" cssVar={fontFamily.display} />
          <FamilySwatch name="heading" cssVar={fontFamily.heading} />
          <FamilySwatch name="body" cssVar={fontFamily.body} />
        </div>

        <h3 className={css.subsectionTitle}>Weight</h3>
        <div className={css.row}>
          <WeightSwatch name="regular" cssVar={fontWeight.regular} />
          <WeightSwatch name="medium" cssVar={fontWeight.medium} />
          <WeightSwatch name="semibold" cssVar={fontWeight.semibold} />
          <WeightSwatch name="bold" cssVar={fontWeight.bold} />
        </div>

        <h3 className={css.subsectionTitle}>
          Scale — size / line-height · weight · tracking, all resolved live
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {Object.entries(text).map(([name, variant]) => (
            <TypeSpecimen key={name} name={name} variant={variant} />
          ))}
        </div>
      </section>

      <section className={css.section}>
        <h2 className={css.sectionTitle}>Role treatments — Pearl</h2>
        <p style={{ fontFamily: fontFamily.body, fontSize: '13px', color: color.textSubtle, margin: 0 }}>
          Not part of the shared token set — which face plays which job is
          itself a theme distinction (see decisions doc §8). Sans carries
          display/heading/body; the serif is a rare accent, not a default.
        </p>

        {roles?.inlineEmphasis && (
          <>
            <h3 className={css.subsectionTitle}>
              Inline emphasis — {roles.inlineEmphasis.scope?.join(', ')}
            </h3>
            <RoleEmphasisSpecimen role={roles.inlineEmphasis} />
          </>
        )}

        {roles?.preheading && (
          <>
            <h3 className={css.subsectionTitle}>Preheading</h3>
            <div className={css.row}>
              <RoleLabelSpecimen label="nav / index" sample="Index" role={roles.preheading} />
              <RoleLabelSpecimen label="plate caption" sample="Plate 01 / Nacre" role={roles.preheading} />
              <RoleLabelSpecimen label="index row" sample="Selected — 2024/26" role={roles.preheading} />
            </div>
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
};
export default meta;

type Story = StoryObj<typeof TypographyPreview>;

export const Overview: Story = {};
