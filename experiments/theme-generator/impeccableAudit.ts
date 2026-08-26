import { useEffect, useState } from 'react';

/**
 * Wraps Impeccable's deterministic browser detector (no LLM, no API key) as a
 * live "taste audit" over a DOM subtree. This is Mode B of the Impeccable
 * integration (see the theme-builder notes): the generator proposes a theme,
 * Impeccable's 58 anti-pattern rules grade the *rendered* result in real time.
 *
 * The same engine is the intended gate for the future template builder — a
 * section×layout×theme combination only ships if it clears these detectors.
 *
 * We import the prebuilt browser bundle (`impeccable/browser`), which registers
 * `window.impeccableDetect`. Auto-scan/overlay injection is turned OFF via
 * `__IMPECCABLE_CONFIG__` *before* the bundle's IIFE runs, so it never paints
 * over our page — we drive scans ourselves and render findings in React.
 */

// One serialized finding (Impeccable groups by element; we flatten).
export interface AuditFinding {
  /** Rule id, e.g. `ai-color-palette`, `icon-tile-stack`. */
  type: string;
  category: 'slop' | 'quality' | string;
  severity?: string;
  advisory?: boolean;
  name: string;
  description: string;
  detail?: string;
  selector?: string;
  tagName?: string;
}

export interface AuditResult {
  status: 'loading' | 'ready' | 'error';
  findings: AuditFinding[];
  slop: number;
  quality: number;
  advisory: number;
  /** 0–100 taste score; slop weighs heaviest. */
  score: number;
}

let loadPromise: Promise<void> | null = null;
function loadDetector(): Promise<void> {
  if (!loadPromise) {
    window.__IMPECCABLE_CONFIG__ = {
      ...(window.__IMPECCABLE_CONFIG__ ?? {}),
      autoScan: false, // never let the bundle scan/overlay on its own
      visualContrast: false, // skip the async pixel pass; static rules only
    };
    loadPromise = import('impeccable/browser').then(() => undefined);
  }
  return loadPromise;
}

// Scan the whole document (the detector has no root param), then keep only
// findings whose element lives inside `root` — so the builder's own form chrome
// and page-level noise don't pollute the audit of the previewed "website".
function scanWithin(root: HTMLElement): AuditFinding[] {
  const groups = window.impeccableDetect?.({}) ?? [];
  const out: AuditFinding[] = [];
  for (const group of groups) {
    if (group.isPageLevel || !group.selector) continue;
    let node: Element | null = null;
    try {
      node = document.querySelector(group.selector);
    } catch {
      node = null;
    }
    if (!node || !root.contains(node)) continue;
    for (const f of group.findings) {
      out.push({ ...f, selector: group.selector, tagName: group.tagName });
    }
  }
  return out;
}

function score(findings: AuditFinding[]): Omit<AuditResult, 'status' | 'findings'> {
  let slop = 0;
  let quality = 0;
  let advisory = 0;
  for (const f of findings) {
    if (f.advisory) advisory += 1;
    else if (f.category === 'slop') slop += 1;
    else quality += 1;
  }
  // Slop (AI tells) is the thing this feature exists to prevent, so it's
  // weighted hardest; correctness issues next; advisories don't score.
  const value = Math.max(0, Math.min(100, 100 - slop * 9 - quality * 5));
  return { slop, quality, advisory, score: value };
}

/**
 * Re-audits `rootRef` whenever `signal` changes (pass a stable string derived
 * from the theme input). Waits two frames so the themed DOM has painted before
 * the detector reads computed styles.
 */
export function useImpeccableAudit(
  rootRef: React.RefObject<HTMLElement | null>,
  signal: string,
): AuditResult {
  const [result, setResult] = useState<AuditResult>({
    status: 'loading',
    findings: [],
    slop: 0,
    quality: 0,
    advisory: 0,
    score: 100,
  });

  useEffect(() => {
    let cancelled = false;
    let raf1 = 0;
    let raf2 = 0;
    loadDetector()
      .then(() => {
        raf1 = requestAnimationFrame(() => {
          raf2 = requestAnimationFrame(() => {
            if (cancelled || !rootRef.current) return;
            try {
              const findings = scanWithin(rootRef.current);
              setResult({ status: 'ready', findings, ...score(findings) });
            } catch {
              setResult((r) => ({ ...r, status: 'error' }));
            }
          });
        });
      })
      .catch(() => {
        if (!cancelled) setResult((r) => ({ ...r, status: 'error' }));
      });
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
    };
  }, [signal, rootRef]);

  return result;
}
