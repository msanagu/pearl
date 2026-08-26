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
      if (allowed.has(f.type)) continue; // explicitly allowlisted exception
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
