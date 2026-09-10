// Reads a story file's `parameters.manifest` — the authoring surface for
// component manifest content (see docs/process/plans/manifest-reshape.md,
// decision 7 / Phase C's DSDS pivot). Foundation/rationale/pattern concept
// docs have since moved to `*.doc.ts` sidecars (see src/storydoc/types.ts,
// read-story-doc.mjs) — this file now serves generate-component-entities.mjs
// (a component's own story) and generate-manifest.mjs's legacy fallback for
// any foundation/rationale/pattern folder not yet migrated to a `*.doc.ts`.
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

// Top-level `const <name> = <expr>;` declarations in a file's own AST, by
// name — never a function/import, since ast is just this file's own parse
// tree. Backs literalToValue's Identifier case below: a same-file constant
// (e.g. a description shared between a Story's `parameters.docs.description`
// and its own `parameters.manifest` statement) resolves to its literal value
// without executing anything, so the "never execute" guarantee holds — only
// an import or a computed value still throws.
function findTopLevelConst(name, ast) {
  for (const stmt of ast.program.body) {
    // `export const x = ...` wraps the VariableDeclaration in
    // ExportNamedDeclaration; a plain `const x = ...` is one directly.
    const varDecl =
      stmt.type === 'VariableDeclaration'
        ? stmt
        : stmt.type === 'ExportNamedDeclaration' &&
            stmt.declaration?.type === 'VariableDeclaration'
          ? stmt.declaration
          : null;
    if (!varDecl) continue;
    for (const decl of varDecl.declarations) {
      if (decl.id.type === 'Identifier' && decl.id.name === name) {
        return decl.init;
      }
    }
  }
  return null;
}

export function literalToValue(node, storiesPath, ast) {
  // Unwrap `... as const` / `... satisfies T` — common on hand-authored
  // literal data, changes nothing about the underlying value.
  if (node.type === 'TSAsExpression' || node.type === 'TSSatisfiesExpression') {
    return literalToValue(node.expression, storiesPath, ast);
  }
  switch (node.type) {
    case 'ObjectExpression':
      return Object.fromEntries(
        node.properties.map((p) => [
          p.key.type === 'Identifier' ? p.key.name : p.key.value,
          literalToValue(p.value, storiesPath, ast),
        ]),
      );
    case 'ArrayExpression':
      return node.elements.map((el) => literalToValue(el, storiesPath, ast));
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
    case 'Identifier': {
      const resolved = ast && findTopLevelConst(node.name, ast);
      if (resolved) return literalToValue(resolved, storiesPath, ast);
      throw new Error(
        `${storiesPath}: parameters.manifest references \`${node.name}\`, which isn't a top-level const in this same file — imported constants aren't extractable without executing the module.`,
      );
    }
    default:
      throw new Error(
        `${storiesPath}: parameters.manifest must be literal data (object/array/string/number/boolean) — found a ${node.type} node instead. Imported constants and computed values aren't extractable without executing the module.`,
      );
  }
}

export function parseStoryFile(storiesPath) {
  const src = readFileSync(storiesPath, 'utf8');
  return babelParse(src, { sourceType: 'module', plugins: ['typescript', 'jsx'] });
}

/** Resolves `export default meta;` back to `meta`'s own initializer, or
 * returns the object literal directly for `export default {...};`. */
export function findDefaultExportObject(ast) {
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

/** `<objectNode>.parameters.manifest`'s value node, or `null` if either hop
 * is missing/not a plain object — shared by the meta-level and per-story
 * extractors below, since a CSF story and its file's default-exported meta
 * carry `parameters.manifest` at the same shape. */
function findManifestPropValue(objectNode) {
  const parametersProp = objectNode.properties.find(
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
  return manifestProp?.value ?? null;
}

/**
 * Finds the story file's default-exported meta object (`const meta = {...};
 * export default meta;` or `export default {...};`, the two shapes Storybook
 * CSF allows) and returns its `parameters.manifest` value, or `null` if the
 * file has none.
 */
export function extractManifestParameters(storiesPath) {
  if (!existsSync(storiesPath)) return null;
  const ast = parseStoryFile(storiesPath);
  const metaNode = findDefaultExportObject(ast);
  if (!metaNode) return null;

  const manifestValue = findManifestPropValue(metaNode);
  if (!manifestValue) return null;

  return literalToValue(manifestValue, storiesPath, ast);
}

/**
 * `related`/`refs` declared on individual `export const <Name>: Story = {...}`
 * objects (their own `parameters.manifest`), not the file's shared meta — the
 * granularity a component-wide `related` can't express: one story (Tag's
 * `WithHeading`) relates to `pattern.alignment`, a sibling story in the same
 * file (`CategoricalGroup`) doesn't. Concatenated across every story in the
 * file; a story with no `parameters.manifest` contributes nothing. Read
 * separately from `extractManifestParameters` (the meta-level one) because
 * both can coexist and both are real — a component's own `related` (composes,
 * depends-on) still describes the whole component; this is additional,
 * finer-grained relations scoped to one example.
 */
export function extractStoryRelated(storiesPath) {
  const empty = { related: [], refs: [] };
  if (!existsSync(storiesPath)) return empty;
  const ast = parseStoryFile(storiesPath);
  const related = [];
  const refs = [];
  for (const stmt of ast.program.body) {
    if (
      stmt.type !== 'ExportNamedDeclaration' ||
      stmt.declaration?.type !== 'VariableDeclaration'
    )
      continue;
    for (const decl of stmt.declaration.declarations) {
      if (decl.init?.type !== 'ObjectExpression') continue;
      const manifestValue = findManifestPropValue(decl.init);
      if (!manifestValue) continue;
      const value = literalToValue(manifestValue, storiesPath, ast);
      if (Array.isArray(value.related)) related.push(...value.related);
      if (Array.isArray(value.refs)) refs.push(...value.refs);
    }
  }
  return { related, refs };
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
        result[decl.id.name] = literalToValue(decl.init, storiesPath, ast);
      } catch {
        // not literal data (a component, a function, JSX) — not this helper's concern
      }
    }
  }
  return result;
}
