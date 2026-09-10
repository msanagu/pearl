// Reads a `*.doc.ts` sidecar — the authoring surface for a concept's manifest
// content and its `<StoryDoc>` page (see src/storydoc/types.ts). Replaces the
// old `parameters.manifest` dig in extract-manifest-parameters.mjs: a top-level
// `export const <x>Doc = {...}` is a cleaner slice than walking `export default
// meta` -> parameters -> manifest.
//
// AST-slice, never execute — same "pure literal data" constraint the manifest
// content always had. A type-only import (the `StoryDoc` type) is erased and
// ignored; a computed value inside the object fails loudly via literalToValue.

import { existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { parseStoryFile, literalToValue } from './extract-manifest-parameters.mjs';

/** The `export const <name>Doc = <object literal>` in a `*.doc.ts` file, as a
 *  plain object — or null if the file has no such export. */
export function readStoryDoc(docPath) {
  if (!existsSync(docPath)) return null;
  const ast = parseStoryFile(docPath);
  for (const stmt of ast.program.body) {
    if (
      stmt.type !== 'ExportNamedDeclaration' ||
      stmt.declaration?.type !== 'VariableDeclaration'
    )
      continue;
    for (const decl of stmt.declaration.declarations) {
      if (
        decl.id.type === 'Identifier' &&
        /Doc$/.test(decl.id.name) &&
        decl.init
      ) {
        return literalToValue(decl.init, docPath);
      }
    }
  }
  return null;
}

/** Files under `dir` matching `test`, recursively, in path order. */
export function walkFiles(dir, test) {
  if (!existsSync(dir)) return [];
  const out = [];
  for (const entry of readdirSync(dir, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name),
  )) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...walkFiles(full, test));
    else if (test(entry.name)) out.push(full);
  }
  return out;
}

/** Every `*.doc.ts` under a domain folder (one level of concept subfolders
 *  allowed, e.g. `foundations/color/inverse/`), read, in path order. */
export function readStoryDocsIn(dir) {
  return walkFiles(dir, (f) => f.endsWith('.doc.ts'))
    .map((f) => readStoryDoc(f))
    .filter(Boolean);
}

/**
 * Expands the authored `StoryDoc` shape into the DSDS section shape the manifest
 * ships: re-adds `for: 'agent'`, maps `note` -> `section`, injects
 * `ordered: false` on steps. Returns the fields an entity merges in.
 */
export function toEntitySections(doc) {
  const sections = (doc.sections ?? []).map((s) => {
    // Key order mirrors how the old parameters.manifest literals were authored
    // (kind, title, for, ...) so the generated manifest diff stays minimal.
    const base = {};
    base.kind = s.kind === 'note' ? 'section' : s.kind;
    // caption has no DSDS slot of its own — fold it into title as a prefix
    // so the audience scope still reaches the agent, not just the page.
    if (s.caption && s.title) base.title = `${s.caption} — ${s.title}`;
    else if (s.title) base.title = s.title;
    else if (s.caption) base.title = s.caption;
    base.for = 'agent';
    if (s.id) base.id = s.id;
    if (s.kind === 'note') return { ...base, body: s.body };
    if (s.kind === 'steps') return { ...base, ordered: false, items: s.items };
    if (s.kind === 'guidelines') {
      // The human page splits a rule into a scannable lead + `detail`; the
      // manifest re-joins them so the agent reads one complete statement.
      const items = s.items.map(({ level, statement, detail }) => ({
        level,
        statement: detail ? `${statement} ${detail}` : statement,
      }));
      return { ...base, items };
    }
    return { ...base, items: s.items };
  });
  return {
    description: doc.concept,
    sections,
    related: doc.related ?? [],
    refs: doc.refs ?? [],
  };
}
