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

const COMPONENTS = ['Stack', 'Row', 'Text', 'Button', 'Card', 'Field', 'Input', 'Alert', 'Tag', 'Link', 'Icon'];
const MAX_EXAMPLES_PER_COMPONENT = 2;

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

/** Extracts up to MAX_EXAMPLES_PER_COMPONENT stories' literal `render` source from a .stories.tsx file, via Babel's AST (not the unavailable classic TS compiler API) sliced against the original text — never re-serialized, so what ships is exactly what's in source. */
function extractExamples(storiesPath) {
  if (!existsSync(storiesPath)) return [];
  const src = readFileSync(storiesPath, 'utf8');
  const ast = babelParse(src, { sourceType: 'module', plugins: ['typescript', 'jsx'] });

  const examples = [];
  for (const stmt of ast.program.body) {
    if (examples.length >= MAX_EXAMPLES_PER_COMPONENT) break;
    if (stmt.type !== 'ExportNamedDeclaration' || stmt.declaration?.type !== 'VariableDeclaration') continue;
    for (const decl of stmt.declaration.declarations) {
      if (decl.id.type !== 'Identifier' || decl.init?.type !== 'ObjectExpression') continue;
      const renderProp = decl.init.properties.find((p) => p.type === 'ObjectProperty' && p.key.type === 'Identifier' && p.key.name === 'render');
      // Only arrow/function-expression renders have a literal body to slice —
      // a story that points `render` at some other reference has nothing
      // here worth extracting, so skip it rather than grabbing the wrong text.
      const body = renderProp?.value?.body;
      if (!body) continue;
      examples.push({ name: decl.id.name, code: src.slice(body.start, body.end) });
    }
  }
  return examples;
}

/** One `Component` manifest entity — see src/manifest/schema.ts. */
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
      metadata: { name, props },
      documentBlocks: examples.map((e) => ({ type: 'example', text: `// ${e.name}\n${e.code}` })),
      agentDocumentBlocks: [],
    });
  }

  return entities;
}
