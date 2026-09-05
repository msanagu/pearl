// Reads a story file's `parameters.manifest` — the single authoring surface
// for manifest content going forward (see docs/process/plans/manifest-reshape.md,
// decision 7 / Phase C's DSDS pivot). Shared by generate-manifest.mjs
// (foundations/rationale, one entity per src/foundations/<domain>/ or
// src/rationale/<name>/ folder, aggregated across every .stories.tsx inside
// it) and generate-component-entities.mjs (a component's own story, when it
// has one).
//
// AST-slice, never execute — same reason extractExamples() in
// generate-component-entities.mjs doesn't run the story file: a
// `.stories.tsx` imports React, CSS, Storybook's own runtime, and this repo's
// path aliases, none of which need resolving just to read a plain data object
// off `meta.parameters.manifest`. `manifest` must be a literal (object/array/
// string/number/boolean/template-literal-with-no-interpolation) — the same
// "pure literal data" constraint generate-manifest.mjs's header comment
// already states for `.roles.ts` — an imported constant or computed value
// inside it fails loudly (see literalToValue) rather than silently extracting
// nothing.

import { parse as babelParse } from '@babel/parser';
import { readFileSync, existsSync } from 'node:fs';

function literalToValue(node, storiesPath) {
  // Unwrap `... as const` / `... satisfies T` — common on hand-authored
  // literal data, changes nothing about the underlying value.
  if (node.type === 'TSAsExpression' || node.type === 'TSSatisfiesExpression') {
    return literalToValue(node.expression, storiesPath);
  }
  switch (node.type) {
    case 'ObjectExpression':
      return Object.fromEntries(
        node.properties.map((p) => [
          p.key.type === 'Identifier' ? p.key.name : p.key.value,
          literalToValue(p.value, storiesPath),
        ]),
      );
    case 'ArrayExpression':
      return node.elements.map((el) => literalToValue(el, storiesPath));
    case 'StringLiteral':
    case 'BooleanLiteral':
    case 'NumericLiteral':
      return node.value;
    case 'TemplateLiteral':
      if (node.expressions.length) {
        throw new Error(
          `${storiesPath}: parameters.manifest can't hold a template literal with interpolation — write it as a plain string.`,
        );
      }
      return node.quasis.map((q) => q.value.cooked).join('');
    default:
      throw new Error(
        `${storiesPath}: parameters.manifest must be literal data (object/array/string/number/boolean) — found a ${node.type} node instead. Imported constants and computed values aren't extractable without executing the module.`,
      );
  }
}

function parseStoryFile(storiesPath) {
  const src = readFileSync(storiesPath, 'utf8');
  return babelParse(src, { sourceType: 'module', plugins: ['typescript', 'jsx'] });
}

/** Resolves `export default meta;` back to `meta`'s own initializer, or
 * returns the object literal directly for `export default {...};`. */
function findDefaultExportObject(ast) {
  let metaNode = null;
  for (const stmt of ast.program.body) {
    if (
      stmt.type === 'ExportDefaultDeclaration' &&
      stmt.declaration.type === 'ObjectExpression'
    ) {
      metaNode = stmt.declaration;
    }
    if (
      stmt.type === 'ExportDefaultDeclaration' &&
      stmt.declaration.type === 'Identifier'
    ) {
      const name = stmt.declaration.name;
      for (const inner of ast.program.body) {
        if (inner.type !== 'VariableDeclaration') continue;
        for (const decl of inner.declarations) {
          if (
            decl.id.type === 'Identifier' &&
            decl.id.name === name &&
            decl.init?.type === 'ObjectExpression'
          ) {
            metaNode = decl.init;
          }
        }
      }
    }
  }
  return metaNode;
}

/**
 * Finds the story file's default-exported meta object (`const meta = {...};
 * export default meta;` or `export default {...};`, the two shapes Storybook
 * CSF allows) and returns its `parameters.manifest` value, or `null` if the
 * file has none.
 */
export function extractManifestParameters(storiesPath) {
  if (!existsSync(storiesPath)) return null;
  const metaNode = findDefaultExportObject(parseStoryFile(storiesPath));
  if (!metaNode) return null;

  const parametersProp = metaNode.properties.find(
    (p) =>
      p.type === 'ObjectProperty' &&
      p.key.type === 'Identifier' &&
      p.key.name === 'parameters',
  );
  if (!parametersProp || parametersProp.value.type !== 'ObjectExpression')
    return null;

  const manifestProp = parametersProp.value.properties.find(
    (p) =>
      p.type === 'ObjectProperty' &&
      p.key.type === 'Identifier' &&
      p.key.name === 'manifest',
  );
  if (!manifestProp) return null;

  return literalToValue(manifestProp.value, storiesPath);
}

/**
 * Every top-level `export const <name> = <literal>;` in a story file, as
 * `{ name: value }` — for data that doesn't belong inside `parameters.manifest`
 * itself, e.g. a foundation's per-theme values (theme identity isn't part of
 * DSDS's per-entry shape, so it stays a plain sibling export instead of being
 * forced into `manifest`). Non-literal exports (functions, JSX, imported
 * values) are silently skipped, not errored — this scans broadly for whichever
 * export a caller is looking for by name convention (see generate-manifest.mjs's
 * `*ByTheme` lookup, mirroring the existing `*Roles` convention in `loadRoles`).
 */
export function listNamedLiteralExports(storiesPath) {
  if (!existsSync(storiesPath)) return {};
  const ast = parseStoryFile(storiesPath);
  const result = {};
  for (const stmt of ast.program.body) {
    if (
      stmt.type !== 'ExportNamedDeclaration' ||
      stmt.declaration?.type !== 'VariableDeclaration'
    )
      continue;
    for (const decl of stmt.declaration.declarations) {
      if (decl.id.type !== 'Identifier' || !decl.init) continue;
      try {
        result[decl.id.name] = literalToValue(decl.init, storiesPath);
      } catch {
        // not literal data (a component, a function, JSX) — not this helper's concern
      }
    }
  }
  return result;
}
