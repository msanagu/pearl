/**
 * Validates the guidance stated in `Field`'s own JSDoc: every `Field` in one
 * form must share one `size`. That guidance is prose, and prose is a ceiling
 * — a model or a human can read it, agree with it, and still write the
 * violation, because nothing in `Field`'s types can reject a mismatch (see
 * the composition-vs-configuration discussion this check exists to close:
 * `size` is deliberately a per-`Field` prop, so the API itself permits this).
 * This script is the tier that doesn't depend on the guidance being read.
 *
 * Method: walk the AST of every non-story `.tsx` file under `src/`, find
 * `<Field>` elements, group them by direct parent (JSX children of the same
 * container), and flag any group whose *statically resolvable* `size` values
 * disagree. `*.stories.tsx` is excluded on purpose — showing every size side
 * by side for comparison, as `Field.stories.tsx`'s own `Sizes` story does, is
 * the correct use of Storybook, not the violation this check exists to catch.
 *
 * Parser: `@babel/parser`, not TypeScript's own compiler API. TS 7's public
 * npm surface dropped the classic parse-a-string-into-a-tree API this repo
 * would otherwise have reused (`createSourceFile`, `forEachChild`) — what's
 * exported now is a project/client API backed by the native binary, built
 * for a language server talking to a loaded project, not a one-off syntax
 * check. Reaching for that here would mean standing up a client connection
 * to check three JSX attributes. `@babel/parser` is a new devDependency
 * because of that gap, not by default — the honest version of "reuse what's
 * there" when what's there no longer offers a lightweight parse function.
 *
 * Known limitation, stated rather than hidden: a `size` set via a variable or
 * expression (`size={activeSize}`) can't be resolved statically, so a group
 * containing one is skipped with a note, not silently passed. Run:
 * `pnpm check:field-sizes`.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { parse } from '@babel/parser';
import type {
  File,
  JSXAttribute,
  JSXElement,
  JSXOpeningElement,
  Node,
} from '@babel/types';

const ROOT = new URL('..', import.meta.url).pathname;
const SRC = join(ROOT, 'src');

function walk(dir: string): string[] {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) return walk(full);
    if (!entry.endsWith('.tsx')) return [];
    if (entry.endsWith('.stories.tsx') || entry.endsWith('.test.tsx')) return [];
    return [full];
  });
}

interface FieldUsage {
  sizeLiteral: string | null; // resolved literal, e.g. 'sm' | 'md' (default) | 'lg'
  dynamic: boolean; // true if `size` is set but not resolvable to a literal
  line: number;
}

interface Violation {
  line: number;
  sizes: string[];
}

function isFieldOpeningElement(node: Node): node is JSXOpeningElement {
  return (
    node.type === 'JSXOpeningElement' &&
    node.name.type === 'JSXIdentifier' &&
    node.name.name === 'Field'
  );
}

function resolveSize(opening: JSXOpeningElement): { literal: string | null; dynamic: boolean } {
  const sizeAttr = opening.attributes.find(
    (a): a is JSXAttribute => a.type === 'JSXAttribute' && a.name.name === 'size',
  );
  if (!sizeAttr || !sizeAttr.value) return { literal: 'md', dynamic: false }; // Field's own default

  if (sizeAttr.value.type === 'StringLiteral') {
    return { literal: sizeAttr.value.value, dynamic: false };
  }
  if (
    sizeAttr.value.type === 'JSXExpressionContainer' &&
    sizeAttr.value.expression.type === 'StringLiteral'
  ) {
    return { literal: sizeAttr.value.expression.value, dynamic: false };
  }
  return { literal: null, dynamic: true };
}

function checkAst(ast: File): { violations: Violation[]; uncheckableLines: number[] } {
  const groups = new Map<Node, FieldUsage[]>();
  const uncheckableLines: number[] = [];

  function visit(node: Node | null | undefined, parent: Node | null) {
    if (!node || typeof node.type !== 'string') return;

    if (node.type === 'JSXElement') {
      const el = node as JSXElement;
      if (isFieldOpeningElement(el.openingElement)) {
        const { literal, dynamic } = resolveSize(el.openingElement);
        const line = el.openingElement.loc?.start.line ?? 0;
        if (dynamic) uncheckableLines.push(line);
        const list = groups.get(parent!) ?? [];
        list.push({ sizeLiteral: literal, dynamic, line });
        groups.set(parent!, list);
      }
    }

    for (const key of Object.keys(node)) {
      if (key === 'loc' || key === 'start' || key === 'end' || key === 'range') continue;
      const value = (node as unknown as Record<string, unknown>)[key];
      if (Array.isArray(value)) {
        for (const child of value) {
          if (child && typeof (child as Node).type === 'string') visit(child as Node, node);
        }
      } else if (value && typeof (value as Node).type === 'string') {
        visit(value as Node, node);
      }
    }
  }

  visit(ast.program, null);

  const violations: Violation[] = [];
  for (const usages of groups.values()) {
    if (usages.length < 2) continue;
    if (usages.some((u) => u.dynamic)) continue; // reported separately, not silently dropped
    const distinct = new Set(usages.map((u) => u.sizeLiteral));
    if (distinct.size > 1) {
      violations.push({ line: usages[0]!.line, sizes: usages.map((u) => u.sizeLiteral ?? '?') });
    }
  }

  return { violations, uncheckableLines };
}

function main() {
  const files = walk(SRC);
  let violationCount = 0;
  let uncheckableCount = 0;

  for (const file of files) {
    const text = readFileSync(file, 'utf8');
    const rel = relative(ROOT, file);

    let ast: File;
    try {
      ast = parse(text, {
        sourceType: 'module',
        plugins: ['jsx', 'typescript'],
      });
    } catch (e) {
      console.warn(`\x1b[33m⚠\x1b[0m ${rel} — could not parse, skipped (${(e as Error).message})`);
      continue;
    }

    const { violations, uncheckableLines } = checkAst(ast);

    for (const v of violations) {
      violationCount++;
      console.error(
        `\x1b[31m✗\x1b[0m ${rel}:${v.line} — sibling <Field> sizes disagree: [${v.sizes.join(', ')}]`,
      );
    }
    for (const line of uncheckableLines) {
      uncheckableCount++;
      console.warn(
        `\x1b[33m⚠\x1b[0m ${rel}:${line} — <Field size={...}> uses a non-literal value; not statically checkable`,
      );
    }
  }

  if (violationCount > 0) {
    console.error(`\n${violationCount} Field size mismatch(es) found.`);
    process.exit(1);
  }

  console.log(
    `✓ No Field size mismatches (${files.length} files checked${uncheckableCount ? `, ${uncheckableCount} non-literal <Field size> use(s) skipped` : ''}).`,
  );
}

main();
