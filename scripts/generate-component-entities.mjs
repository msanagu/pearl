// Generates `Component` manifest entities — real prop APIs (via react-docgen,
// reading each component's actual TS source) plus real usage examples (the
// literal `render` source of up to two of its own Storybook stories).
//
// Not react-docgen-typescript: that package's peer dependency needs the
// classic `ts.*` compiler API, which TypeScript 7's package no longer
// exports at its root (same issue generate-manifest.mjs already documents
// for the Foundation extractor). react-docgen (babel-based, no TS compiler
// dependency at all) is what Storybook's own Vite builder actually uses by
// default in this repo too — nothing in .storybook/main.ts opts into the
// TS-compiler variant, so this mirrors the real, already-working path
// rather than fighting a version conflict to use a path Storybook itself
// doesn't take.

import { parse as docgenParse } from 'react-docgen';
import { parse as babelParse } from '@babel/parser';
import { readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

const COMPONENTS = [
  'Stack',
  'Row',
  'Text',
  'Button',
  'Card',
  'Field',
  'Input',
  'Alert',
  'Tag',
  'Link',
  'Icon',
];
const TOKEN_EXPORTS = [
  'color',
  'radius',
  'space',
  'controlHeight',
  'fontFamily',
  'fontWeight',
  'text',
];
const PUBLIC_EXPORTS = [...COMPONENTS, ...TOKEN_EXPORTS];
const MAX_EXAMPLES_PER_COMPONENT = 2;

/**
 * Real third-party imports a `.stories.tsx` file makes (react-icons, mainly)
 * — everything that ISN'T Storybook's own machinery or this repo's internal
 * `@components`/`@themes` aliases. Returns a map of local name -> source
 * specifier, e.g. `{ PiCaretDown: 'react-icons/pi' }`.
 */
function extractThirdPartyImports(ast) {
  const imports = {};
  for (const stmt of ast.program.body) {
    if (stmt.type !== 'ImportDeclaration') continue;
    const source = stmt.source.value;
    if (
      source.startsWith('.') ||
      source.startsWith('@storybook/') ||
      source.startsWith('@components/') ||
      source.startsWith('@themes/')
    )
      continue;
    for (const spec of stmt.specifiers) {
      if (spec.type === 'ImportSpecifier') imports[spec.local.name] = source;
    }
  }
  return imports;
}

/**
 * Synthesizes a real, correct import block for one example — not a copy of
 * the story file's own imports, which use this repo's internal aliases and
 * relative paths (`./Button`, `@components/Icon`) meaningless outside it.
 * Instead: whichever `@msanagu/pearl` public exports the example's code
 * actually references go on one `@msanagu/pearl` import line, and whichever
 * third-party identifiers (react-icons, etc.) it references keep their real
 * source path. This is what makes a shipped example runnable/onboardable
 * outside this repo, not just readable.
 */
function synthesizeImports(code, thirdPartyImports) {
  const usedPublic = PUBLIC_EXPORTS.filter((name) =>
    new RegExp(`\\b${name}\\b`).test(code),
  );
  const lines = [];
  if (usedPublic.length)
    lines.push(`import { ${usedPublic.join(', ')} } from '@msanagu/pearl';`);

  const bySource = {};
  for (const [local, source] of Object.entries(thirdPartyImports)) {
    if (!new RegExp(`\\b${local}\\b`).test(code)) continue;
    (bySource[source] ??= []).push(local);
  }
  for (const [source, names] of Object.entries(bySource)) {
    lines.push(`import { ${names.join(', ')} } from '${source}';`);
  }
  return lines.join('\n');
}

/** Runs react-docgen against one component's source. Returns `null` (not a thrown error) if extraction fails or finds no props — a component with partial/no extracted data is still worth an entity, just a thinner one. */
function extractProps(filePath) {
  if (!existsSync(filePath)) return null;
  const src = readFileSync(filePath, 'utf8');
  try {
    const [doc] = docgenParse(src, { filename: filePath });
    return doc ?? null;
  } catch {
    return null;
  }
}

/**
 * Extracts up to MAX_EXAMPLES_PER_COMPONENT stories' literal `render` source
 * from a .stories.tsx file, via Babel's AST (not the unavailable classic TS
 * compiler API) sliced against the original text — never re-serialized, so
 * the render body itself ships exactly as written. A synthesized import
 * block (see `synthesizeImports`) is prepended so the example is actually
 * runnable/onboardable on its own, not just a body with no visible
 * dependencies.
 */
function extractExamples(storiesPath) {
  if (!existsSync(storiesPath)) return [];
  const src = readFileSync(storiesPath, 'utf8');
  const ast = babelParse(src, {
    sourceType: 'module',
    plugins: ['typescript', 'jsx'],
  });
  const thirdPartyImports = extractThirdPartyImports(ast);

  const examples = [];
  for (const stmt of ast.program.body) {
    if (examples.length >= MAX_EXAMPLES_PER_COMPONENT) break;
    if (
      stmt.type !== 'ExportNamedDeclaration' ||
      stmt.declaration?.type !== 'VariableDeclaration'
    )
      continue;
    for (const decl of stmt.declaration.declarations) {
      if (
        decl.id.type !== 'Identifier' ||
        decl.init?.type !== 'ObjectExpression'
      )
        continue;
      const renderProp = decl.init.properties.find(
        (p) =>
          p.type === 'ObjectProperty' &&
          p.key.type === 'Identifier' &&
          p.key.name === 'render',
      );
      // Only arrow/function-expression renders have a literal body to slice —
      // a story that points `render` at some other reference has nothing
      // here worth extracting, so skip it rather than grabbing the wrong text.
      const body = renderProp?.value?.body;
      if (!body) continue;
      const rawCode = src.slice(body.start, body.end);
      const imports = synthesizeImports(rawCode, thirdPartyImports);
      examples.push({
        name: decl.id.name,
        code: imports ? `${imports}\n\n${rawCode}` : rawCode,
      });
    }
  }
  return examples;
}

/**
 * One `Component` manifest entity per component — see src/manifest/schema.ts.
 * Props/metadata only. Real usage examples are deliberately NOT embedded
 * here anymore: they're the bulkiest part of each entity and were shipping
 * to every consumer regardless of which component they asked about. They
 * now live in their own per-component file (see `generateComponentExamples`)
 * that `llms.txt` points at, so a consumer/agent fetches only the examples
 * for the component it's actually working with. `metadata.examplesPath` is
 * the pointer from an entity to its own examples file, when one exists.
 */
export function generateComponentEntities() {
  const root = path.resolve(import.meta.dirname, '..');
  const entities = [];

  for (const name of COMPONENTS) {
    const dir = path.join(root, 'src', 'components', name);
    const doc = extractProps(path.join(dir, `${name}.tsx`));
    const examples = extractExamples(path.join(dir, `${name}.stories.tsx`));

    const props = doc?.props
      ? Object.entries(doc.props).map(([propName, p]) => ({
          name: propName,
          type: p.tsType?.raw ?? p.tsType?.name ?? 'unknown',
          required: Boolean(p.required),
          ...(p.defaultValue?.value && { defaultValue: p.defaultValue.value }),
          ...(p.description && { description: p.description }),
        }))
      : [];

    entities.push({
      kind: 'Component',
      id: `component.${name}`,
      metadata: {
        name,
        props,
        ...(examples.length && {
          examplesPath: `components/${name}/${name}.examples.json`,
        }),
      },
      documentBlocks: [],
      agentDocumentBlocks: [],
    });
  }

  return entities;
}

/**
 * Per-component example files — one entry per component that has any
 * (`COMPONENTS` with no `.stories.tsx`, or none with a literal `render`,
 * are simply absent from the returned map). Same `DocumentBlock` shape
 * (`{ type: 'example', text }`) the entity's `documentBlocks` used to hold,
 * so consuming code that already knows that shape barely has to change.
 */
export function generateComponentExamples() {
  const root = path.resolve(import.meta.dirname, '..');
  const examplesByComponent = {};

  for (const name of COMPONENTS) {
    const dir = path.join(root, 'src', 'components', name);
    const examples = extractExamples(path.join(dir, `${name}.stories.tsx`));
    if (!examples.length) continue;
    examplesByComponent[name] = examples.map((e) => ({
      type: 'example',
      text: `// ${e.name}\n${e.code}`,
    }));
  }

  return examplesByComponent;
}
