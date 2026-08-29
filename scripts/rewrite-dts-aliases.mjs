// Resolve `@`-alias specifiers back to relative paths in the emitted .d.ts tree.
//
// Why this exists: `tsc` resolves tsconfig `paths` when type-checking but does
// NOT rewrite them on emit (TypeScript#10866, still wontfix). The JS bundle is
// unaffected — Rollup inlines every internal module — but each .d.ts is emitted
// per-file, so a consumer's type-checker would hit `@components/...` and fail:
// the alias is ours, not theirs. dist/ mirrors src/ 1:1 (rootDir src, outDir
// dist), so the fix is a mechanical path resolve.
//
// Zero extra build dependencies, per the same ethos as tsconfig.build.json.
// Emits extensionless relative specifiers, matching what tsc already writes for
// the entry's own re-exports.

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import path from 'node:path';

const DIST = path.resolve('dist');

// Longest prefix first — `@/` is a catch-all and must be tried last.
const ALIASES = [
  ['@components/', 'components/'],
  ['@themes/', 'themes/'],
  ['@tokens', 'tokens'],
  ['@/', ''],
];

function* walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walk(full);
    else if (entry.name.endsWith('.d.ts')) yield full;
  }
}

let filesChanged = 0;
let specifiersRewritten = 0;

for (const file of walk(DIST)) {
  const before = readFileSync(file, 'utf8');
  const after = before.replace(/(['"])(@[^'"]*)\1/g, (match, quote, spec) => {
    const hit = ALIASES.find(
      ([a]) => (a.endsWith('/') ? spec.startsWith(a) : spec === a),
    );
    if (!hit) return match; // a real npm scoped package (@vanilla-extract/…)
    const [alias, distPrefix] = hit;
    const target = path.join(DIST, distPrefix + spec.slice(alias.length));
    let rel = path.relative(path.dirname(file), target).replaceAll(path.sep, '/');
    if (!rel.startsWith('.')) rel = `./${rel}`;
    specifiersRewritten++;
    return `${quote}${rel}${quote}`;
  });
  if (after !== before) {
    writeFileSync(file, after);
    filesChanged++;
  }
}

console.log(
  `rewrote ${specifiersRewritten} alias specifier(s) across ${filesChanged} .d.ts file(s)`,
);
