/**
 * Shared Impeccable audit for Storybook `play` functions — runs the
 * deterministic browser detector against a rendered story (headless chromium,
 * via the Storybook vitest addon) and returns a report grouped by the nearest
 * `data-component`.
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
 * Rules suppressed everywhere — the detector's own blind spots, not findings
 * we've chosen to live with. `ai-color-palette` reads gradient stops without
 * their alpha and flags blue-green hues as cyan slop; Pearl's luster and
 * Tahitian's overtone are genuinely green and sit at the edge of its window.
 */
const SUPPRESSED_RULES = new Set(['ai-color-palette']);

/**
 * Rule exceptions scoped by selector — for elements styled through
 * `globalStyle`, where there's no JSX to hang `data-impeccable-allow` on.
 *
 * `gradient-text` on `inlineEmphasis`: a bare pattern flag with no contrast
 * input, so it fires forever on Tahitian's overtone treatment. The stop
 * contrast has been measured by hand, with ratios recorded in `tahitian.css.ts`
 * — re-measure there if the stops are re-tuned.
 */
const SCOPED_ALLOW: ReadonlyArray<{
  selector: string;
  rules: ReadonlySet<string>;
}> = [
  {
    selector: '[data-role="inlineEmphasis"]',
    rules: new Set(['gradient-text']),
  },
];

export async function runImpeccableAudit(
  root: HTMLElement,
): Promise<AuditReport> {
  window.__IMPECCABLE_CONFIG__ = {
    ...(window.__IMPECCABLE_CONFIG__ ?? {}),
    autoScan: false,
    visualContrast: false,
  };
  await import('impeccable/browser');
  // Let the themed DOM paint before the detector reads computed styles.
  await new Promise<void>((r) =>
    requestAnimationFrame(() => requestAnimationFrame(() => r())),
  );

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
    const component =
      node.closest('[data-component]')?.getAttribute('data-component') ??
      node.tagName.toLowerCase();
    // Declarative allowlist for deliberate exceptions (e.g. bespoke brand
    // artwork): `data-impeccable-allow="rule-a rule-b"` on the element or an
    // ancestor exempts exactly those rules — nothing broader.
    const allowed = new Set(
      (
        node
          .closest('[data-impeccable-allow]')
          ?.getAttribute('data-impeccable-allow') ?? ''
      ).split(/\s+/),
    );
    for (const f of g.findings) {
      if (f.advisory) continue; // advisories are surfaced elsewhere, never gated
      if (SUPPRESSED_RULES.has(f.type)) continue; // detector blind spot, see above
      if (allowed.has(f.type)) continue; // explicitly allowlisted exception
      // Selector-scoped exception: matches the node itself or an ancestor,
      // exactly like the attribute hatch above.
      if (
        SCOPED_ALLOW.some(
          (a) => a.rules.has(f.type) && node.closest(a.selector),
        )
      )
        continue;
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
    .map(
      (r) =>
        `  [${r.component}] ${r.type}  @ ${r.selector}${r.detail ? `  — ${r.detail}` : ''}`,
    )
    .join('\n');

  return {
    count: rows.length,
    rows,
    text: `Impeccable findings (${rows.length}):\n${text}`,
  };
}
