import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { Input } from '../../src/components/Input';
import { Alert } from '../../src/components/Alert';
import { Text } from '../../src/components/Text';
import { Icon } from '../../src/components/Icon/Icon';
import { PiLightning, PiShieldCheck, PiSparkle, PiChartLineUp } from 'react-icons/pi';
import { color } from '../../src/tokens';
import { pearlLightThemeClass } from '../../src/themes/pearl.css';
import '../fonts/boska.css'; // self-hosted display face used by the generated theme
import {
  DEFAULT_INPUT,
  OBJECTIVE_OPTIONS,
  PERSONALITY_OPTIONS,
  brandScale,
  hexToOklch,
  neutralScale,
  oklchToHex,
  toOverrides,
  type BrandColor,
  type ThemeInput,
} from './generateTheme';
import { useImpeccableAudit, type AuditResult } from './impeccableAudit';
import * as css from './create-theme.css';

// POC/CreateTheme — an end-user-facing theme builder. The user steers a brand
// color (an accent is optional, added on demand) and refines a personality and
// an objective; `generateTheme` derives the WHOLE semantic token set from those
// answers, guaranteeing accessible step-pairings by construction.
//
// Personality/objective are chosen upstream (a separate wizard, eventually) —
// this screen only shows REFINEMENTS within the already-chosen category, not
// sibling categories. The category switcher here is a stand-in for that wizard.
//
// Scope of the effect: the generated theme is injected as inline CSS custom
// properties on the PREVIEW panel ONLY. Nothing global is mutated.

const MAX_CHROMA = 0.37; // ~sRGB chroma ceiling across hues

/**
 * Brand color control: a hex field (paste anything and it lands exactly) plus
 * hue / chroma / lightness sliders in OKLCH. The value is kept faithful — the
 * generator places this exact color as one step of the brand ramp.
 */
function BrandControl({ value, onChange }: { value: BrandColor; onChange: (v: BrandColor) => void }) {
  const hex = oklchToHex(value);
  const [draft, setDraft] = useState(hex);
  const [editing, setEditing] = useState(false);
  // When the sliders move the color, resync the text field — unless the user is
  // mid-typing in it (then their in-progress text wins).
  useEffect(() => {
    if (!editing) setDraft(hex);
  }, [hex, editing]);

  function commitHex(text: string) {
    setDraft(text);
    const parsed = hexToOklch(text);
    if (parsed) onChange(parsed);
  }

  return (
    <div className={css.colorField}>
      <div className={css.colorHeader}>
        <div className={css.colorHeaderMain}>
          <span className={css.swatchDot} style={{ background: hex }} aria-hidden="true" />
          <span className={css.colorName}>Brand</span>
        </div>
        <input
          className={css.hexInput}
          aria-label="Brand — hex"
          value={draft}
          spellCheck={false}
          onFocus={() => setEditing(true)}
          onChange={(e) => commitHex(e.target.value)}
          onBlur={() => {
            setEditing(false);
            setDraft(hex);
          }}
        />
      </div>
      <label className={css.sliderLabel}>
        <span className={css.sliderCaption}>Hue</span>
        <input
          className={css.hueSlider}
          type="range"
          min={0}
          max={360}
          value={Math.round(value.h)}
          aria-label="Brand — hue"
          onChange={(e) => onChange({ ...value, h: Number(e.target.value) })}
        />
      </label>
      <label className={css.sliderLabel}>
        <span className={css.sliderCaption}>Muted → Vivid</span>
        <input
          className={css.lightnessSlider}
          type="range"
          min={0}
          max={MAX_CHROMA * 1000}
          value={Math.round(value.c * 1000)}
          aria-label="Brand — chroma"
          style={{
            background: `linear-gradient(to right, oklch(${value.l} 0 ${value.h}), oklch(${value.l} ${MAX_CHROMA} ${value.h}))`,
          }}
          onChange={(e) => onChange({ ...value, c: Number(e.target.value) / 1000 })}
        />
      </label>
      <label className={css.sliderLabel}>
        <span className={css.sliderCaption}>Darker → Lighter</span>
        <input
          className={css.lightnessSlider}
          type="range"
          min={0}
          max={100}
          value={Math.round(value.l * 100)}
          aria-label="Brand — lightness"
          style={{
            background: `linear-gradient(to right, oklch(0.2 ${value.c} ${value.h}), oklch(0.98 ${value.c} ${value.h}))`,
          }}
          onChange={(e) => onChange({ ...value, l: Number(e.target.value) / 100 })}
        />
      </label>
    </div>
  );
}

/**
 * Accent control: HUE ONLY. There is no lightness because accent always
 * resolves to a fixed, accessible palette step — it colors focus rings and
 * feature icons, never large fills or text, so it can't be made to fail
 * contrast.
 */
function AccentControl({
  hue,
  onHue,
  onRemove,
}: {
  hue: number;
  onHue: (v: number) => void;
  onRemove: () => void;
}) {
  return (
    <div className={css.colorField}>
      <div className={css.colorHeader}>
        <div className={css.colorHeaderMain}>
          <span className={css.swatchDot} style={{ background: `oklch(0.46 0.15 ${hue})` }} aria-hidden="true" />
          <span className={css.colorName}>Accent</span>
        </div>
        <button type="button" className={css.linkButton} onClick={onRemove}>
          Remove
        </button>
      </div>
      <label className={css.sliderLabel}>
        <span className={css.sliderCaption}>Color — used for focus &amp; icons only</span>
        <input
          className={css.hueSlider}
          type="range"
          min={0}
          max={360}
          value={hue}
          aria-label="Accent — color"
          onChange={(e) => onHue(Number(e.target.value))}
        />
      </label>
    </div>
  );
}

const FEATURES = [
  { icon: PiLightning, title: 'Fast by default', body: 'Ships production-ready without configuration.' },
  { icon: PiShieldCheck, title: 'Accessible', body: 'Every generated palette clears WCAG contrast.' },
  { icon: PiSparkle, title: 'On-brand', body: 'Neutrals and alerts stay harmonious with your hue.' },
  { icon: PiChartLineUp, title: 'Scales', body: 'Density and type adapt to your objective.' },
] as const;

function CreateThemePoc() {
  const [input, setInput] = useState<ThemeInput>(DEFAULT_INPUT);

  const overrides = useMemo<CSSProperties>(() => toOverrides(input) as CSSProperties, [input]);
  const neutral = useMemo(() => neutralScale(input), [input]);
  const brand = useMemo(() => brandScale(input.brand), [input.brand]);

  // Mode B: Impeccable's deterministic detectors grade the rendered preview
  // live. `siteRef` scopes the audit to the fake "website" (not the form/panel).
  const siteRef = useRef<HTMLDivElement>(null);
  const audit = useImpeccableAudit(siteRef, JSON.stringify(input));

  function set<K extends keyof ThemeInput>(key: K, val: ThemeInput[K]) {
    setInput((prev) => ({ ...prev, [key]: val }));
  }

  const activePersonality = PERSONALITY_OPTIONS.find((p) => p.id === input.personality)!;
  const activeObjective = OBJECTIVE_OPTIONS.find((o) => o.id === input.objective)!;

  return (
    <div className={css.page}>
      <form className={css.form} aria-label="Theme builder">
        <div>
          <h1 className={css.formTitle}>Make it yours</h1>
          <p className={css.formIntro}>
            Steer your brand color, then refine. We generate an accessible palette, spacing, and
            type — no token editing.
          </p>
        </div>

        <fieldset className={css.group} style={{ border: 'none', padding: 0, margin: 0 }}>
          <legend className={css.legend}>Colors</legend>
          <BrandControl value={input.brand} onChange={(v) => set('brand', v)} />
          {input.accentHue !== null ? (
            <AccentControl
              hue={input.accentHue}
              onHue={(hue) => set('accentHue', hue)}
              onRemove={() => set('accentHue', null)}
            />
          ) : (
            <button
              type="button"
              className={css.addAccent}
              onClick={() => set('accentHue', Math.round((input.brand.h + 180) % 360))}
            >
              + Add accent color
            </button>
          )}
          <label className={css.sliderLabel}>
            <span className={css.sliderCaption}>Neutral tint — Grey → Branded</span>
            <input
              className={css.lightnessSlider}
              type="range"
              min={0}
              max={100}
              value={Math.round(input.neutralTint * 100)}
              aria-label="Neutral tint"
              style={{
                background: `linear-gradient(to right, oklch(0.7 0 0), oklch(0.7 0.03 ${input.brand.h}))`,
              }}
              onChange={(e) => set('neutralTint', Number(e.target.value) / 100)}
            />
          </label>
        </fieldset>

        {/* Refinements within the already-chosen personality (not other personalities). */}
        <div className={css.group}>
          <div className={css.categoryHeader}>
            <span className={css.legend}>Personality</span>
          </div>
          <CategorySwitcher
            options={PERSONALITY_OPTIONS.map((p) => ({ id: p.id, label: p.label }))}
            active={input.personality}
            onChange={(id) => {
              const next = PERSONALITY_OPTIONS.find((p) => p.id === id)!;
              setInput((prev) => ({
                ...prev,
                personality: id as ThemeInput['personality'],
                personalityVariant: next.variants[0]!.id,
              }));
            }}
          />
          <div className={css.variantList} role="radiogroup" aria-label={`${activePersonality.label} refinements`}>
            {activePersonality.variants.map((v) => (
              <RefineChip
                key={v.id}
                label={v.label}
                blurb={v.blurb}
                active={input.personalityVariant === v.id}
                onClick={() => set('personalityVariant', v.id)}
              />
            ))}
          </div>
        </div>

        <div className={css.group}>
          <span className={css.legend}>Objective</span>
          <CategorySwitcher
            options={OBJECTIVE_OPTIONS.map((o) => ({ id: o.id, label: o.label }))}
            active={input.objective}
            onChange={(id) => {
              const next = OBJECTIVE_OPTIONS.find((o) => o.id === id)!;
              setInput((prev) => ({
                ...prev,
                objective: id as ThemeInput['objective'],
                objectiveVariant: next.variants[0]!.id,
              }));
            }}
          />
          <div className={css.variantList} role="radiogroup" aria-label={`${activeObjective.label} refinements`}>
            {activeObjective.variants.map((v) => (
              <RefineChip
                key={v.id}
                label={v.label}
                blurb={v.blurb}
                active={input.objectiveVariant === v.id}
                onClick={() => set('objectiveVariant', v.id)}
              />
            ))}
          </div>
        </div>
      </form>

      {/* The ONLY themed surface: generated vars scoped here, over a real base theme. */}
      <div className={`${pearlLightThemeClass} ${css.preview}`} style={overrides}>
        <div ref={siteRef} className={css.site}>
        <section className={css.previewHero}>
          {/* Preheading uses a quiet neutral, NOT accent. */}
          <p className={css.kicker}>Live preview</p>
          <h2 className={css.display}>The world is your oyster.</h2>
          <p className={css.lead}>
            Every surface, control, and alert below is driven entirely by your choices — generated
            from one brand hue, guaranteed to meet contrast.
          </p>
          <div className={css.actionRow}>
            <Button>Get started</Button>
            <Button variant="secondary">Learn more</Button>
          </div>
        </section>

        <section>
          <h3 className={css.sectionTitle}>Neutral scale — generated from your brand hue</h3>
          <div className={css.neutralWrap}>
            <div className={css.neutralRow}>
              {neutral.map(({ step, value, role }) => {
                // Legible caption color: dark steps take light text, light steps take dark.
                const captionOnDark = step >= 500;
                const captionColor = captionOnDark ? neutral[0]!.value : neutral[neutral.length - 1]!.value;
                return (
                  <div key={step} className={css.neutralStep} style={{ background: value, color: captionColor }}>
                    <span className={css.neutralStepNumber}>{step}</span>
                    {role && <span className={css.neutralRole}>{role}</span>}
                  </div>
                );
              })}
            </div>
            {/* The same neutrals in context: page/surface/border/text working together. */}
            <div className={css.appliedDemo}>
              <div className={css.appliedCard}>
                <Text typeScale="bodyMd" as="p" style={{ fontWeight: 600 }}>
                  Applied
                </Text>
                <span className={css.appliedMuted}>
                  surface on background, hairline border, text + textSubtle — all pulled from the
                  steps above.
                </span>
              </div>
              <div className={css.appliedCard}>
                <Text typeScale="bodyMd" as="p" style={{ fontWeight: 600 }}>
                  Density
                </Text>
                <span className={css.densityNote}>controlHeight.sm — set by objective</span>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h3 className={css.sectionTitle}>Brand ramp — one step is exactly your color</h3>
          <div className={css.brandRamp}>
            {brand.map(({ step, hex, exact }) => {
              const onDark = step >= 500;
              return (
                <div
                  key={step}
                  className={css.brandStep}
                  data-exact={exact}
                  style={{ background: hex, color: onDark ? '#fff' : '#000' }}
                >
                  <span className={css.brandStepNumber}>{step}</span>
                  <span className={css.brandStepHex}>{hex}</span>
                  {exact && <span className={css.brandStepTag}>yours</span>}
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <h3 className={css.sectionTitle}>Features — accent lives only on the icons</h3>
          <div className={css.featureGrid}>
            {FEATURES.map((f) => (
              <div key={f.title} className={css.feature}>
                <span className={css.featureIcon}>
                  {/* Accent color, at a fixed accessible palette step. */}
                  <Icon icon={f.icon} size={24} style={{ color: color.accent }} />
                </span>
                <Text typeScale="bodyMd" as="p" style={{ fontWeight: 600 }}>
                  {f.title}
                </Text>
                <span className={css.appliedMuted}>{f.body}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h3 className={css.sectionTitle}>Cards</h3>
          <div className={css.grid}>
            {[1, 2, 3].map((n) => (
              <Card key={n}>
                <Card.Header>
                  <Text typeScale="headingSm" as="h4">
                    Plan {n}
                  </Text>
                </Card.Header>
                <Card.Body>
                  <Text typeScale="bodyMd">A short description of what this option includes.</Text>
                  <div style={{ marginTop: 12 }}>
                    <Input aria-label={`Email for plan ${n}`} placeholder="you@company.com" />
                  </div>
                </Card.Body>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h3 className={css.sectionTitle}>Feedback</h3>
          <div className={css.alertStack}>
            <Alert variant="positive" heading="Saved">
              Your changes have been published.
            </Alert>
            <Alert variant="warn" heading="Heads up">
              Your trial ends in three days.
            </Alert>
            <Alert variant="negative" heading="Payment failed">
              We couldn't process your card.
            </Alert>
            <Alert variant="info" heading="New feature">
              Team workspaces are now available.
            </Alert>
          </div>
        </section>
        </div>

        {/* Impeccable audit sits OUTSIDE siteRef so it doesn't grade itself. */}
        <AuditPanel audit={audit} />
      </div>
    </div>
  );
}

// Impeccable's live taste audit of the previewed site: a score plus each
// deterministic anti-pattern finding (slop = AI tells, quality = correctness).
function AuditPanel({ audit }: { audit: AuditResult }) {
  const slopColor = '#c2410c';
  const qualityColor = '#b45309';
  const cleanColor = '#15803d';
  return (
    <div className={css.auditPanel}>
      <div className={css.auditHead}>
        <p className={css.auditTitle}>Impeccable audit</p>
        <div className={css.auditCounts}>
          <span className={css.auditBadge} style={{ color: slopColor }}>
            {audit.slop} slop
          </span>
          <span className={css.auditBadge} style={{ color: qualityColor }}>
            {audit.quality} quality
          </span>
          {audit.advisory > 0 && (
            <span className={css.auditBadge} style={{ color: color.textSubtle }}>
              {audit.advisory} advisory
            </span>
          )}
        </div>
        <span
          className={css.auditScore}
          style={{ color: audit.score >= 85 ? cleanColor : audit.score >= 60 ? qualityColor : slopColor }}
        >
          {audit.status === 'loading' ? '…' : audit.score}
          <span className={css.auditScoreUnit}>/100</span>
        </span>
      </div>

      {audit.status === 'ready' && audit.findings.length === 0 ? (
        <span className={css.auditClean}>No anti-patterns detected — nothing reads as generated.</span>
      ) : (
        <ul className={css.auditList}>
          {audit.findings.map((f, i) => (
            <li key={`${f.type}-${i}`} className={css.auditItem}>
              <span
                className={css.auditDot}
                style={{ background: f.advisory ? color.textSubtle : f.category === 'slop' ? slopColor : qualityColor }}
              />
              <span>
                {f.name} <span className={css.auditRule}>{f.type}</span>
                <br />
                <span className={css.appliedMuted}>{f.description}</span>
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// Stand-in for the upstream personality/objective wizard: a compact, secondary
// switcher for the top-level category. The prominent controls are the
// refinements below it.
function CategorySwitcher({
  options,
  active,
  onChange,
}: {
  options: { id: string; label: string }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className={css.categoryHeader}>
      <select
        value={active}
        aria-label="Category"
        onChange={(e) => onChange(e.target.value)}
        style={{ font: 'inherit', padding: '4px 8px', borderRadius: 6 }}
      >
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.label}
          </option>
        ))}
      </select>
      <span className={css.categoryHint}>refine below</span>
    </div>
  );
}

function RefineChip({
  label,
  blurb,
  active,
  onClick,
}: {
  label: string;
  blurb: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      data-active={active}
      className={css.variantChip}
      onClick={onClick}
    >
      <span className={css.variantRadio} aria-hidden="true" />
      <span className={css.variantText}>
        <span className={css.variantLabel}>{label}</span>
        <span className={css.variantBlurb}>{blurb}</span>
      </span>
    </button>
  );
}

const meta: Meta<typeof CreateThemePoc> = {
  title: 'POC/CreateTheme',
  component: CreateThemePoc,
  parameters: { layout: 'fullscreen', removePreviewPadding: true },
};

export default meta;

type Story = StoryObj<typeof CreateThemePoc>;

export const Builder: Story = {};
