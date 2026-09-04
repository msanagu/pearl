// Generates the manifest — split, not one flat file, since a single
// manifest.json grows linearly with every theme's full role table even
// though any one consumer session only ever cares about one active theme
// (see docs/playground's manifest-splitting note). Output:
//   dist/manifest/base.json          — theme-agnostic Component entities
//   dist/manifest/<theme>.json       — that theme's Foundation entities only
//   dist/components/<Name>/<Name>.examples.json — that component's real
//     usage examples, split out of the entity itself for the same reason.
// llms.txt (generate-llms-txt.mjs) is the router pointing a consumer at
// exactly the files relevant to it, instead of one everything-file.
//
// Role tables come from the theme role tables (src/themes/*/*.roles.ts).
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
import {
  generateComponentEntities,
  generateComponentExamples,
} from './generate-component-entities.mjs';

/** Loads a plain-literal-data .ts file (no .css imports to stub) via esbuild — same reason `loadRoles` below needs esbuild at all: TS7 dropped the classic compiler API this script would otherwise use to strip types. */
async function loadPlainModule(entryPath) {
  const result = await esbuild.build({
    entryPoints: [entryPath],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    write: false,
  });
  const code = result.outputFiles[0].text;
  const tmpFile = path.join(
    mkdtempSync(path.join(tmpdir(), 'pearl-manifest-')),
    'bundle.cjs',
  );
  writeFileSync(tmpFile, code);
  return import(tmpFile);
}

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
      const importRe = new RegExp(
        `import\\s*\\{([^}]+)\\}\\s*from\\s*['"]${args.path.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}['"]`,
      );
      const match = importerSource.match(importRe);
      const names = match
        ? match[1]
            .split(',')
            .map((n) => n.trim())
            .filter(Boolean)
        : [];
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
  const entryPath = path.join(
    ROOT,
    'src',
    'themes',
    theme,
    `${theme}.roles.ts`,
  );
  const result = await esbuild.build({
    entryPoints: [entryPath],
    bundle: true,
    platform: 'node',
    format: 'cjs',
    write: false,
    plugins: [stubCssPlugin],
  });
  const code = result.outputFiles[0].text;
  const tmpFile = path.join(
    mkdtempSync(path.join(tmpdir(), 'pearl-manifest-')),
    'bundle.cjs',
  );
  writeFileSync(tmpFile, code);
  const mod = await import(tmpFile);
  const rolesExportName = Object.keys(mod).find((k) => k.endsWith('Roles'));
  if (!rolesExportName)
    throw new Error(`No "...Roles" export found in ${entryPath}`);
  return mod[rolesExportName];
}

/** Reshapes one `RoleSpec` entry into a `FoundationEntity` — see src/manifest/schema.ts. */
function toFoundationEntity(theme, name, spec) {
  const { treatment, intent, on, trigger, chroma, limits, guidance, source } =
    spec;
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
    documentBlocks: (guidance ?? []).map((text) => ({
      type: 'guidance',
      text,
    })),
    agentDocumentBlocks: [],
    ...(source && { internal: { source } }),
  };
}

const generatedAt = new Date().toISOString();
const manifestVersion = '0.2.0'; // bumped: split manifest shape (base + per-theme), examples moved out of Component entities

const foundationEntitiesByTheme = Object.fromEntries(
  THEMES.map((t) => [t, []]),
);
for (const theme of THEMES) {
  const roles = await loadRoles(theme);
  for (const [name, spec] of Object.entries(roles)) {
    foundationEntitiesByTheme[theme].push(
      toFoundationEntity(theme, name, spec),
    );
  }
}

const componentEntities = generateComponentEntities();
const componentExamples = generateComponentExamples();
const { overrideContractDocumentBlocks } = await loadPlainModule(
  path.join(ROOT, 'src', 'manifest', 'overrideContract.ts'),
);
const { tokenSemanticsDocumentBlocks } = await loadPlainModule(
  path.join(ROOT, 'src', 'manifest', 'tokenSemantics.ts'),
);
const { inverseConventionDocumentBlocks } = await loadPlainModule(
  path.join(ROOT, 'src', 'manifest', 'inverseConvention.ts'),
);
const { iconFlexibilityDocumentBlocks } = await loadPlainModule(
  path.join(ROOT, 'src', 'manifest', 'iconFlexibility.ts'),
);
const { sizingGridDocumentBlocks } = await loadPlainModule(
  path.join(ROOT, 'src', 'manifest', 'sizingGrid.ts'),
);

const distDir = path.join(ROOT, 'dist');
const manifestDir = path.join(distDir, 'manifest');
mkdirSync(manifestDir, { recursive: true });

const baseManifest = {
  manifestVersion,
  generatedFrom:
    'src/components/*/*.tsx, src/manifest/overrideContract.ts, src/manifest/tokenSemantics.ts, src/manifest/inverseConvention.ts, src/manifest/iconFlexibility.ts, src/manifest/sizingGrid.ts',
  generatedAt,
  entities: componentEntities,
  // Cross-cutting — applies to every component in every theme, so neither
  // fits the per-theme Foundation or per-component Component shape; both
  // ship as their own top-level fields instead. See
  // docs/foundations/override-patterns.md and src/tokens.ts's
  // `SentimentTokens` JSDoc for the human-facing versions these mirror.
  overrideContract: { documentBlocks: overrideContractDocumentBlocks },
  tokenSemantics: { documentBlocks: tokenSemanticsDocumentBlocks },
  inverseConvention: { documentBlocks: inverseConventionDocumentBlocks },
  iconFlexibility: { documentBlocks: iconFlexibilityDocumentBlocks },
  sizingGrid: { documentBlocks: sizingGridDocumentBlocks },
};
writeFileSync(
  path.join(manifestDir, 'base.json'),
  JSON.stringify(baseManifest, null, 2) + '\n',
);
console.log(
  `Wrote ${componentEntities.length} entities to dist/manifest/base.json`,
);

for (const theme of THEMES) {
  const themeManifest = {
    manifestVersion,
    generatedFrom: `src/themes/${theme}/${theme}.roles.ts`,
    generatedAt,
    theme,
    entities: foundationEntitiesByTheme[theme],
  };
  writeFileSync(
    path.join(manifestDir, `${theme}.json`),
    JSON.stringify(themeManifest, null, 2) + '\n',
  );
  console.log(
    `Wrote ${foundationEntitiesByTheme[theme].length} entities to dist/manifest/${theme}.json`,
  );
}

for (const [name, examples] of Object.entries(componentExamples)) {
  const componentDir = path.join(distDir, 'components', name);
  mkdirSync(componentDir, { recursive: true });
  const outPath = path.join(componentDir, `${name}.examples.json`);
  writeFileSync(
    outPath,
    JSON.stringify({ component: name, examples }, null, 2) + '\n',
  );
  console.log(
    `Wrote ${examples.length} example(s) to ${path.relative(process.cwd(), outPath)}`,
  );
}
