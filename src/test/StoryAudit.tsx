import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { runImpeccableAudit, type AuditReport } from './impeccablePlay';

/**
 * Wraps a story so its Impeccable audit is VISIBLE in the Storybook canvas — a
 * live findings panel, not just a pass/fail in the Interactions panel. Renders
 * the content in a scanned container and an overlay panel that is itself marked
 * `data-audit-overlay` so it's excluded from the scan.
 *
 * Same detector as the CI gate (`play` → `runImpeccableAudit`), so what you see
 * here is exactly what the gate asserts.
 */
export function StoryAudit({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [report, setReport] = useState<AuditReport | null>(null);

  useEffect(() => {
    let cancelled = false;
    // Two frames so the themed DOM has painted before the detector reads styles.
    requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        if (cancelled || !ref.current) return;
        runImpeccableAudit(ref.current).then((r) => {
          if (!cancelled) setReport(r);
        });
      }),
    );
    return () => {
      cancelled = true;
    };
  }, []);

  const clean = report?.count === 0;
  return (
    <>
      <div ref={ref}>{children}</div>
      <aside data-audit-overlay style={panel}>
        <header style={panelHead}>
          <strong style={{ fontSize: 13 }}>Impeccable audit</strong>
          <span
            style={{
              ...badge,
              background:
                report == null ? '#9993' : clean ? '#15803d22' : '#c2410c22',
              color: report == null ? '#666' : clean ? '#15803d' : '#c2410c',
            }}
          >
            {report == null
              ? 'scanning…'
              : clean
                ? 'clean'
                : `${report.count} findings`}
          </span>
        </header>
        {report && report.count > 0 && (
          <ul style={list}>
            {report.rows.map((r, i) => (
              <li key={`${r.type}-${i}`} style={item}>
                <code style={rule}>{r.type}</code>
                <span style={{ opacity: 0.7 }}>
                  [{r.component}]{r.detail ? ` — ${r.detail}` : ''}
                </span>
              </li>
            ))}
          </ul>
        )}
        {clean && (
          <p style={{ margin: 0, fontSize: 12, opacity: 0.7 }}>
            No anti-patterns detected.
          </p>
        )}
      </aside>
    </>
  );
}

// Inline styles (the overlay is a dev tool and is excluded from the audit).
const panel: CSSProperties = {
  position: 'fixed',
  right: 16,
  bottom: 16,
  zIndex: 2147483647,
  width: 360,
  maxHeight: '60vh',
  overflowY: 'auto',
  padding: 12,
  borderRadius: 10,
  background: '#fff',
  color: '#111',
  boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
  border: '1px solid #e5e5e5',
  fontFamily: 'ui-sans-serif, system-ui, sans-serif',
};
const panelHead: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 8,
};
const badge: CSSProperties = {
  fontSize: 12,
  fontWeight: 600,
  padding: '2px 8px',
  borderRadius: 999,
};
const list: CSSProperties = {
  listStyle: 'none',
  margin: 0,
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
};
const item: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  fontSize: 12,
  borderTop: '1px solid #eee',
  paddingTop: 6,
};
const rule: CSSProperties = {
  fontFamily: 'ui-monospace, Menlo, monospace',
  fontSize: 12,
  color: '#b91c1c',
};
