/**
 * Shared Impeccable audit for Storybook `play` functions — runs the
 * deterministic browser detector against a rendered story (in headless
 * chromium, via the Storybook vitest addon) and returns a grouped report.
 *
 * This is the "Mode B as a CI gate" mechanism: the same engine that grades the
 * theme-builder preview grades real rendered stories, attributing each finding
 * to the nearest `data-component` (falling back to tag name).
 */

export interface AuditRow {
  component: string;
  type: string;
  name: string;
  selector: string;
  detail: string;
}

export interface AuditReport {
  count: number;
  rows: AuditRow[];
  /** Human-readable grouping by component → rule ×count. */
  text: string;
}

/**
 * Rules suppressed everywhere, not per element — the detector's own blind
 * spots rather than findings we've chosen to live with.
 *
 * `ai-color-palette` reads gradient stops WITHOUT their alpha and flags any
 * stop with channel spread >= 50 whose hue lands in 160-200 (or 260-310).
 * Both themes trip it on hues that never render as cyan: Pearl's luster
 * `seaGreen` (`rgba(158, 214, 196, 0.38)`, hue 160.7) is a 38%-alpha sheen
 * over pale nacre, and Tahitian's overtone `peacock` (`#2F8F78`, hue 165.6)
 * is a mid-saturation blue-green picked for contrast, not a neon accent. The
 * rule's real target is opaque cyan/violet slop; our palettes sit at the edge
 * of its window because they're genuinely green.
 *
 * The trade: an actual cyan-gradient regression would no longer be caught by
 * this gate. Every other rule still runs. To re-enable, drop the entry here
 * and use the per-element `data-impeccable-allow` escape hatch instead.
 */
const SUPPRESSED_RULES = new Set(['ai-color-palette']);

/**
 * Rule exceptions scoped by SELECTOR — for elements styled through
 * `globalStyle`, where there's no JSX to hang `data-impeccable-allow` on and
 * threading one through would push an audit concern into a canon component.
 *
 * `gradient-text` on `inlineEmphasis`: the rule is a bare pattern flag with no
 * contrast input (`bgClip === 'text' && bgImage.includes('gradient')`), so it
 * fires forever on Tahitian's overtone treatment no matter how the stops are
 * tuned. What it really marks is unmeasured territory: the detector SKIPS the
 * contrast check on gradient-clipped text (issue #409 Case A) because painted
 * contrast isn't derivable from `color`. We've since done that measurement by
 * hand — every light stop >= 4.5:1 on platinum[200], every dark stop >= 7.9:1
 * on charcoal[900], with the ratios recorded next to the tokens in
 * `tahitian.css.ts`. The flag has nothing left to warn us about.
 *
 * If the overtone stops are ever re-tuned, re-measure by hand. Nothing in CI
 * will tell you.
 */
const SCOPED_ALLOW: ReadonlyArray<{ selector: string; rules: ReadonlySet<string> }> = [
  { selector: '[data-role="inlineEmphasis"]', rules: new Set(['gradient-text']) },
];

export async function runImpeccableAudit(root: HTMLElement): Promise<AuditReport> {
  window.__IMPECCABLE_CONFIG__ = {
    ...(window.__IMPECCABLE_CONFIG__ ?? {}),
    autoScan: false,
    visualContrast: false,
  };
  await import('impeccable/browser');
  // Let the themed DOM paint before the detector reads computed styles.
  await new Promise<void>((r) => requestAnimationFrame(() => requestAnimationFrame(() => r())));

  const groups = window.impeccableDetect?.({}) ?? [];
  const rows: AuditRow[] = [];
  for (const g of groups) {
    if (g.isPageLevel || !g.selector) continue;
    let node: Element | null = null;
    try {
      node = document.querySelector(g.selector);
    } catch {
      node = null;
    }
    if (!node || !root.contains(node)) continue; // outside this story's canvas
    if (node.closest('[data-audit-overlay]')) continue; // the report UI never audits itself
    const component = node.closest('[data-component]')?.getAttribute('data-component') ?? node.tagName.toLowerCase();
    // Declarative allowlist for deliberate exceptions (e.g. bespoke brand
    // artwork): `data-impeccable-allow="rule-a rule-b"` on the element or an
    // ancestor exempts exactly those rules — nothing broader.
    const allowed = new Set(
      (node.closest('[data-impeccable-allow]')?.getAttribute('data-impeccable-allow') ?? '').split(/\s+/),
    );
    for (const f of g.findings) {
      if (f.advisory) continue; // advisories are surfaced elsewhere, never gated
      if (SUPPRESSED_RULES.has(f.type)) continue; // detector blind spot, see above
      if (allowed.has(f.type)) continue; // explicitly allowlisted exception
      // Selector-scoped exception: matches the node itself or an ancestor,
      // exactly like the attribute hatch above.
      if (SCOPED_ALLOW.some((a) => a.rules.has(f.type) && node.closest(a.selector))) continue;
      rows.push({
        component,
        type: f.type,
        name: f.name,
        selector: g.selector,
        detail: f.detail ?? '',
      });
    }
  }

  const text = rows
    .map((r) => `  [${r.component}] ${r.type}  @ ${r.selector}${r.detail ? `  — ${r.detail}` : ''}`)
    .join('\n');

  return { count: rows.length, rows, text: `Impeccable findings (${rows.length}):\n${text}` };
}
