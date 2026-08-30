// Generates manifest.json from the theme role tables (src/themes/*/*.roles.ts).
//
// Role tables are pure literal data (treatment names are string literals,
// e.g. `treatment: 'luster'`, never a resolved CSS value) — but each
// .roles.ts imports sibling `.css.ts` (vanilla-extract) modules for typing.
// Bundling with esbuild and stubbing out any `.css`/`.css.ts` import (as a
// Proxy that answers any property access) sidesteps needing the full
// vanilla-extract/Vite pipeline just to read data this script never uses.
//
// TypeScript 7's package no longer exposes the classic compiler API
// (`ts.createSourceFile` et al.) at its root export, so AST-parsing the
// files directly isn't an option here — esbuild's transform (strip types,
// keep runtime literals) plus a stub-import plugin is the smaller surface.

import * as esbuild from 'esbuild';
import { writeFileSync, mkdtempSync, mkdirSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { generateComponentEntities } from './generate-component-entities.mjs';

const THEMES = ['pearl', 'tahitian', 'freshwater', 'south-sea'];
const ROOT = path.resolve(import.meta.dirname, '..');

// esbuild's ESM-interop shim (`__toESM`) copies `Object.getOwnPropertyNames`
// off the required module before any named import can see a property — a
// Proxy answering arbitrary `get`s isn't enough, since nothing was ever
// *enumerated* as an own property. So the stub can't be fully dynamic: it
// greps the importing file's own `import { a, b } from './x.css'` line for
// the exact names it binds, and declares exactly those as real (getter)
// exports, each a self-recursive Proxy so deeper chains (`pearlFonts.serif`)
// still resolve to a stub rather than `undefined`.
const stubCssPlugin = {
  name: 'stub-css-imports',
  setup(build) {
    build.onResolve({ filter: /\.css(\.ts)?$/ }, (args) => {
      const importerSource = readFileSync(args.importer, 'utf8');
      const importRe = new RegExp(`import\\s*\\{([^}]+)\\}\\s*from\\s*['"]${args.path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`);
      const match = importerSource.match(importRe);
      const names = match ? match[1].split(',').map((n) => n.trim()).filter(Boolean) : [];
      return { path: args.path, namespace: 'stub-css', pluginData: { names } };
    });
    build.onLoad({ filter: /.*/, namespace: 'stub-css' }, (args) => ({
      contents: `
        function makeStub(name) {
          return new Proxy({}, { get: (_t, key) => makeStub(name + '.' + String(key)) });
        }
        ${args.pluginData.names.map((n) => `exports.${n} = makeStub(${JSON.stringify(n)});`).join('\n')}
      `,
      loader: 'js',
    }));
  },
};

async function loadRoles(theme) {
  const entryPath = path.join(ROOT, 'src', 'themes', theme, `${theme}.roles.ts`);
  const result = await esbuild.build({
    entryPoints: [entryPath],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    write: false,
    plugins: [stubCssPlugin],
  });
  const code = result.outputFiles[0].text;
  const tmpFile = path.join(mkdtempSync(path.join(tmpdir(), 'pearl-manifest-')), 'bundle.cjs');
  writeFileSync(tmpFile, code);
  const mod = await import(tmpFile);
  const rolesExportName = Object.keys(mod).find((k) => k.endsWith('Roles'));
  if (!rolesExportName) throw new Error(`No "...Roles" export found in ${entryPath}`);
  return mod[rolesExportName];
}

/** Reshapes one `RoleSpec` entry into a `FoundationEntity` — see src/manifest/schema.ts. */
function toFoundationEntity(theme, name, spec) {
  const { treatment, intent, on, trigger, chroma, limits, guidance, source } = spec;
  return {
    kind: 'Foundation',
    id: `role.${theme}.${name}`,
    metadata: {
      name,
      theme,
      treatment,
      ...(intent && { intent }),
      ...(on && { surface: on }),
      ...(trigger && { trigger }),
      ...(chroma && { chroma }),
      ...(limits && { limits }),
    },
    documentBlocks: (guidance ?? []).map((text) => ({ type: 'guidance', text })),
    agentDocumentBlocks: [],
    ...(source && { internal: { source } }),
  };
}

const entities = [];

for (const theme of THEMES) {
  const roles = await loadRoles(theme);
  for (const [name, spec] of Object.entries(roles)) {
    entities.push(toFoundationEntity(theme, name, spec));
  }
}

entities.push(...generateComponentEntities());

const manifest = {
  manifestVersion: '0.1.0',
  generatedFrom: 'src/themes/*/*.roles.ts, src/components/*/*.tsx, src/components/*/*.stories.tsx',
  generatedAt: new Date().toISOString(),
  entities,
};

// Written into dist/, not the repo root — it needs to ship inside the
// published package (package.json's `files: ["dist"]`), not just exist for
// local repo consumers.
const distDir = path.join(ROOT, 'dist');
mkdirSync(distDir, { recursive: true });
const outPath = path.join(distDir, 'manifest.json');
writeFileSync(outPath, JSON.stringify(manifest, null, 2) + '\n');
console.log(`Wrote ${entities.length} entities to ${path.relative(process.cwd(), outPath)}`);
