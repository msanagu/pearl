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
// `rationale`/`foundations` entities are read from `parameters.manifest` on
// `src/rationale/<name>/*.stories.tsx` / `src/foundations/<domain>/*.stories.tsx`
// — Storybook is the authoring surface, not a hand-written src/manifest/*.ts
// file (docs/process/plans/manifest-reshape.md, decision 7 / Phase C). See
// extract-manifest-parameters.mjs for the AST-slice-not-execute extraction.
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
import {
  writeFileSync,
  mkdtempSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  existsSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import {
  generateComponentEntities,
  generateComponentExamples,
} from './generate-component-entities.mjs';
import {
  extractManifestParameters,
  listNamedLiteralExports,
} from './extract-manifest-parameters.mjs';

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

/**
 * Reshapes a `{ type: 'do'|'dont'|'verification', text }[]` array (the
 * hand-authored shape every src/manifest/*.ts file still uses) into DSDS
 * `sections` — do/dont collapse into one `guidelines` section
 * (`must`/`must-not`), verification into one `steps` section (`ordered:
 * false` — these are independent checks, not a sequence). Empty input
 * yields `[]`, not a section with no items.
 */
function toSections(documentBlocks) {
  const sections = [];
  const guidelineItems = documentBlocks
    .filter((b) => b.type === 'do' || b.type === 'dont')
    .map((b) => ({
      level: b.type === 'do' ? 'must' : 'must-not',
      statement: b.text,
    }));
  if (guidelineItems.length) {
    sections.push({ kind: 'guidelines', for: 'agent', items: guidelineItems });
  }
  const verificationItems = documentBlocks
    .filter((b) => b.type === 'verification')
    .map((b) => ({ title: b.text }));
  if (verificationItems.length) {
    sections.push({
      kind: 'steps',
      for: 'agent',
      ordered: false,
      items: verificationItems,
    });
  }
  return sections;
}

/**
 * One entity per subfolder of `baseDir` (`src/foundations` or `src/rationale`),
 * aggregating `parameters.manifest` across every `.stories.tsx` file inside
 * that subfolder — the authoring surface is Storybook, not a hand-written
 * `src/manifest/*.ts` file (decision 7 / Phase C). A domain with no
 * `parameters.manifest` anywhere yet is skipped, not shipped empty.
 *
 * The entity's own `name`/`description` always come from `domainDescriptions`
 * (or a generic fallback) — never from one of the aggregated files' own
 * `name`/`description`. A domain can hold more than one concept (`color`
 * holds both `tokenSemantics` and `inverseConvention`), so no single file's
 * identity is the whole domain's; each file's own `sections[].title` carries
 * that finer distinction instead.
 */
function loadDomainEntities(baseDir, idPrefix, { metadataKey, domainDescriptions } = {}) {
  if (!existsSync(baseDir)) return [];
  const domains = readdirSync(baseDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  const entities = [];
  for (const domain of domains) {
    const domainDir = path.join(baseDir, domain);
    const storyFiles = readdirSync(domainDir).filter((f) =>
      /\.stories\.tsx?$/.test(f),
    );
    const sections = [];
    for (const file of storyFiles) {
      const params = extractManifestParameters(path.join(domainDir, file));
      if (params?.sections?.length) sections.push(...params.sections);
    }
    if (!sections.length) continue;
    const entity = {
      id: `${idPrefix}.${domain}`,
      kind: 'entry',
      name: domain,
      description: domainDescriptions?.[domain] ?? `${domain} ${idPrefix}.`,
      sections,
    };
    if (metadataKey) entity.metadata = { [metadataKey]: domain };
    entities.push(entity);
  }
  return entities;
}

/**
 * Per-theme foundation values — a plain `export const <x>ByTheme = {...}`
 * sibling export (mirrors `loadRoles`'s existing `*Roles` name convention),
 * since theme identity isn't part of DSDS's per-entry shape and doesn't
 * belong forced inside `parameters.manifest`. One `ThemeFoundationEntity`
 * per domain that has such an export, `extends` pointing at its base
 * `foundation.<domain>` counterpart.
 */
function loadThemeFoundationEntities(baseDir, theme) {
  if (!existsSync(baseDir)) return [];
  const domains = readdirSync(baseDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  const entities = [];
  for (const domain of domains) {
    const domainDir = path.join(baseDir, domain);
    const storyFiles = readdirSync(domainDir).filter((f) =>
      /\.stories\.tsx?$/.test(f),
    );
    for (const file of storyFiles) {
      const exportsFound = listNamedLiteralExports(path.join(domainDir, file));
      const byThemeKey = Object.keys(exportsFound).find((k) =>
        k.endsWith('ByTheme'),
      );
      if (!byThemeKey) continue;
      const byTheme = exportsFound[byThemeKey];
      if (!byTheme[theme]) continue;
      entities.push({
        id: `foundation.${theme}.${domain}`,
        kind: 'entry',
        name: domain,
        description: byTheme[theme].description ?? `${theme}'s ${domain} values.`,
        metadata: { concept: domain },
        extends: [{ rel: 'extends', to: `foundation.${domain}` }],
        sections: toSections(byTheme[theme].documentBlocks ?? []),
      });
    }
  }
  return entities;
}

/** Reshapes one `RoleSpec` entry into a `TreatmentEntity` — see src/manifest/schema.ts. */
function toTreatmentEntity(theme, name, spec) {
  const { treatment, intent, on, trigger, chroma, limits, guidance } = spec;
  return {
    id: `treatment.${theme}.${name}`,
    kind: 'pearl.treatment',
    name,
    description: intent ?? `${name} role, fulfilled by the ${treatment} treatment.`,
    metadata: {
      role: name,
      treatment,
      ...(intent && { intent }),
      ...(on && { surface: on }),
      ...(trigger && { trigger }),
      ...(chroma && { chroma }),
      ...(limits && { limits }),
    },
    // Existing guidance prose is doc-only, not yet rewritten into real
    // do/dont/verification framing — carried through as bare `must` items
    // for now (same shortcut Phase A shipped with, just DSDS-shaped).
    sections: toSections((guidance ?? []).map((text) => ({ type: 'do', text }))),
  };
}

const generatedAt = new Date().toISOString();
const manifestVersion = '0.3.0'; // bumped: entities now DSDS (v0.20.0) entry/section-shaped — kind/name/description/sections/extends, not documentBlocks

const treatmentEntitiesByTheme = Object.fromEntries(
  THEMES.map((t) => [t, []]),
);
for (const theme of THEMES) {
  const roles = await loadRoles(theme);
  for (const [name, spec] of Object.entries(roles)) {
    treatmentEntitiesByTheme[theme].push(
      toTreatmentEntity(theme, name, spec),
    );
  }
}

const componentEntities = generateComponentEntities();
const componentExamples = generateComponentExamples();

const distDir = path.join(ROOT, 'dist');
const manifestDir = path.join(distDir, 'manifest');
mkdirSync(manifestDir, { recursive: true });

// Rationale — DS-wide principles, not tied to one component/foundation/theme.
// One entity per src/rationale/<name>/*.stories.tsx folder.
const rationaleEntities = loadDomainEntities(
  path.join(ROOT, 'src', 'rationale'),
  'rationale',
  {
    domainDescriptions: {
      'override-contract':
        'The stable data-component/data-part/data-variant attributes every component renders are the sanctioned way to extend past a documented variant — never inline styles or internal classes.',
      composition:
        "Favor children/slot-based props over prop-explosion — a component's own API stays small, and both its default rendering path and its fully-composed override path are first-class.",
      'semantic-html':
        'Defer to a native HTML element/attribute wherever one already provides the needed semantics/behavior, instead of reimplementing it with ARIA and JavaScript.',
    },
  },
);

// Foundations — the constraint/mechanic itself, common ground across every
// theme. Per-theme instantiations (the actual values) ship in each theme's
// own file instead, as `ThemeFoundationEntity`s — see below. One entity per
// src/foundations/<domain>/*.stories.tsx folder — a domain can aggregate more
// than one concept's sections (e.g. `color` holds tokenSemantics + inverseConvention).
const foundationEntities = loadDomainEntities(
  path.join(ROOT, 'src', 'foundations'),
  'foundation',
  {
    metadataKey: 'concept',
    domainDescriptions: {
      color:
        "Sentiment sub-fields (surface/border/text/icon) each have a distinct intended use, and mode/inverse are orthogonal axes — most tokens auto-flip inside an inverse container, border tokens don't.",
      radius:
        "A padded surface derives its own corner radius from radius.control plus its own padding, instead of authoring one — keeps nested corners concentric. Experimental, not settled: see docs/foundations/radius-system.md.",
      space:
        "The soft sizing-grid mechanic — snap every raw pixel size to the active theme's own scale-token grid; per-theme increment values live in each theme's own foundations entry.",
      typography:
        'One Text component, not split Heading/Text — typeScale (size), role (face), as (element), and weight are four independent axes that combine any of them; heading level is driven by document structure, never by how large something needs to look.',
    },
  },
);

const baseManifest = {
  manifestVersion,
  generatedFrom:
    'src/components/*/*.stories.tsx, src/foundations/*/*.stories.tsx, src/rationale/*/*.stories.tsx',
  generatedAt,
  rationale: rationaleEntities,
  components: componentEntities,
  foundations: foundationEntities,
};
writeFileSync(
  path.join(manifestDir, 'base.json'),
  JSON.stringify(baseManifest, null, 2) + '\n',
);
console.log(
  `Wrote ${componentEntities.length} components to dist/manifest/base.json`,
);

for (const theme of THEMES) {
  const themeFoundations = loadThemeFoundationEntities(
    path.join(ROOT, 'src', 'foundations'),
    theme,
  );
  const themeManifest = {
    manifestVersion,
    generatedFrom: `src/themes/${theme}/${theme}.roles.ts, src/foundations/*/*.stories.tsx`,
    generatedAt,
    theme,
    foundations: themeFoundations,
    treatments: treatmentEntitiesByTheme[theme],
  };
  writeFileSync(
    path.join(manifestDir, `${theme}.json`),
    JSON.stringify(themeManifest, null, 2) + '\n',
  );
  console.log(
    `Wrote ${themeManifest.foundations.length} foundation(s) and ${themeManifest.treatments.length} treatments to dist/manifest/${theme}.json`,
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
