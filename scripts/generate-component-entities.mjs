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
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import path from 'node:path';
import {
  extractManifestParameters,
  extractStoryRelated,
  literalToValue,
  parseStoryFile,
  findDefaultExportObject,
} from './extract-manifest-parameters.mjs';
import { readStoryDoc, toEntitySections } from './read-story-doc.mjs';

// Derived from src/components/ rather than hand-maintained: a directory
// counts as a public component when it has a <Name>.tsx matching its own
// name, which excludes the `_internal`/`_brand` (underscore-prefixed,
// not public API) directories by construction.
const COMPONENTS = readdirSync(
  path.join(path.resolve(import.meta.dirname, '..'), 'src', 'components'),
  { withFileTypes: true },
)
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .filter((name) =>
    existsSync(
      path.join(
        path.resolve(import.meta.dirname, '..'),
        'src',
        'components',
        name,
        `${name}.tsx`,
      ),
    ),
  )
  .sort();
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
      source.startsWith('@themes/') ||
      source === '@tokens'
    )
      // '@tokens' is this repo's own internal alias for the same token
      // exports PUBLIC_EXPORTS already covers via '@msanagu/pearl' below —
      // treating it as third-party double-declares e.g. `space` when a
      // story imports it directly instead of just using it via a component.
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

/**
 * A component's stories split into two files (`<Name>.api.stories.tsx` — bare
 * prop matrix, no hand-authored prose — and `<Name>.usage.stories.tsx` —
 * guideline sections plus composed demos) once migrated, or the legacy single
 * `<Name>.stories.tsx` until then. `usagePath` is `null` when unmigrated, so
 * callers fall back to `apiPath` for both examples and manifest params.
 */
/** De-dupes ManifestRef entries ({rel,to,href}) by their full identity —
 * a story-level ref restating one the component already declares (or two
 * stories agreeing on the same one) should collapse to a single entry. */
function dedupeRefs(refs) {
  const seen = new Set();
  return refs.filter((r) => {
    const key = `${r.rel}::${r.to ?? ''}::${r.href ?? ''}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function resolveStoryFiles(dir, name) {
  const apiSplit = path.join(dir, `${name}.api.stories.tsx`);
  const usageSplit = path.join(dir, `${name}.usage.stories.tsx`);
  const legacy = path.join(dir, `${name}.stories.tsx`);
  const apiPath = existsSync(apiSplit) ? apiSplit : legacy;
  const usagePath = existsSync(usageSplit) ? usageSplit : null;
  return { apiPath, usagePath };
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

/** Walks `objectNode.<keys[0]>.<keys[1]>...`, each hop an ObjectExpression
 * property, returning the final value node or `null` if any hop is missing
 * or isn't a plain object. Shared by the `docs.source.code` lookup below and
 * the argTypes-options lookup near generateComponentEntities. */
function findNestedProp(objectNode, ...keys) {
  let current = objectNode;
  for (const key of keys) {
    if (!current || current.type !== 'ObjectExpression') return null;
    const prop = current.properties.find(
      (p) =>
        p.type === 'ObjectProperty' &&
        p.key.type === 'Identifier' &&
        p.key.name === key,
    );
    if (!prop) return null;
    current = prop.value;
  }
  return current;
}

/**
 * Extracts up to MAX_EXAMPLES_PER_COMPONENT stories' displayed source from a
 * .stories.tsx file, via Babel's AST (not the unavailable classic TS compiler
 * API) sliced against the original text — never re-serialized. A story that
 * hand-authors `parameters.docs.source.code` (see Row/Stack's usage stories)
 * does so specifically because its `render` delegates to a same-file
 * `<X>Demo` component — Storybook's own source viewer would otherwise show
 * that bare `<XDemo />` reference instead of real markup, and this manifest
 * example is that same reader, so it gets the same override. Only when a
 * story has no such override does this fall back to the literal `render`
 * body. A synthesized import block (see `synthesizeImports`) is prepended so
 * the example is actually runnable/onboardable on its own, not just a body
 * with no visible dependencies.
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

      // Prefer the hand-authored "Show code" override when a story declares
      // one — it's the real markup a Demo-delegating render hides. Falls
      // through silently (not a thrown error) if it references something
      // other than a same-file literal/const, e.g. an imported value.
      const sourceCodeNode = findNestedProp(
        decl.init,
        'parameters',
        'docs',
        'source',
        'code',
      );
      let rawCode = null;
      if (sourceCodeNode) {
        try {
          rawCode = literalToValue(sourceCodeNode, storiesPath, ast);
        } catch {
          rawCode = null;
        }
      }

      if (rawCode == null) {
        // Only arrow/function-expression renders have a literal body to
        // slice — a story that points `render` at some other reference has
        // nothing here worth extracting, so skip it rather than grabbing the
        // wrong text.
        const body = renderProp?.value?.body;
        if (!body) continue;
        rawCode = src.slice(body.start, body.end);
      }

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
 * A story file's `argTypes.<propName>.options` — the literal choice list a
 * Storybook control already declares for a prop (e.g. Button's
 * `argTypes.variant.options: ['primary', 'secondary']`). This is the
 * resolved enum react-docgen can't produce on its own when a component types
 * a variant prop through a vanilla-extract recipe indirection
 * (`variant?: ButtonVariants['variant']`) rather than an inline literal
 * union — `tsType.raw` then just echoes the unresolved alias name. Only
 * string-literal entries count (an options array mixing in a bare
 * `undefined`, e.g. Row's `align`, only means "the control also allows
 * unset" — already covered by `required`).
 */
function extractArgTypesOptions(storiesPath) {
  if (!existsSync(storiesPath)) return {};
  const ast = parseStoryFile(storiesPath);
  const metaNode = findDefaultExportObject(ast);
  if (!metaNode) return {};
  const argTypesNode = findNestedProp(metaNode, 'argTypes');
  if (!argTypesNode || argTypesNode.type !== 'ObjectExpression') return {};

  const result = {};
  for (const propEntry of argTypesNode.properties) {
    if (propEntry.type !== 'ObjectProperty' || propEntry.key.type !== 'Identifier')
      continue;
    const optionsNode = findNestedProp(propEntry.value, 'options');
    if (!optionsNode || optionsNode.type !== 'ArrayExpression') continue;
    const options = optionsNode.elements
      .filter((el) => el?.type === 'StringLiteral')
      .map((el) => el.value);
    if (options.length) result[propEntry.key.name] = options;
  }
  return result;
}

/**
 * A component's `<Name>.css.ts` recipe's own `variants: { <propName>: {
 * <key>: {...} } }` object keys — the actual, complete, always-present
 * source of a variant prop's legal values (the recipe IS the runtime
 * behavior; a Story's `argTypes.options`, above, is optional hand-authored
 * control metadata that not every component bothers to declare — Alert,
 * Skeleton, and Tag don't, so `extractArgTypesOptions` alone leaves their
 * `variant`/`typeScale` unresolved). AST-sliced, same "never execute" stance
 * as everywhere else here: `recipe({...})`'s first argument is read as a
 * plain object literal, not evaluated.
 */
function extractRecipeVariantKeys(cssFilePath) {
  if (!existsSync(cssFilePath)) return {};
  let ast;
  try {
    ast = babelParse(readFileSync(cssFilePath, 'utf8'), {
      sourceType: 'module',
      plugins: ['typescript'],
    });
  } catch {
    return {};
  }

  let configNode = null;
  for (const stmt of ast.program.body) {
    const varDecl =
      stmt.type === 'VariableDeclaration'
        ? stmt
        : stmt.type === 'ExportNamedDeclaration' &&
            stmt.declaration?.type === 'VariableDeclaration'
          ? stmt.declaration
          : null;
    if (!varDecl) continue;
    for (const decl of varDecl.declarations) {
      if (
        decl.init?.type === 'CallExpression' &&
        decl.init.callee.type === 'Identifier' &&
        decl.init.callee.name === 'recipe' &&
        decl.init.arguments[0]?.type === 'ObjectExpression'
      ) {
        configNode = decl.init.arguments[0];
      }
    }
  }
  if (!configNode) return {};

  const variantsNode = findNestedProp(configNode, 'variants');
  if (!variantsNode || variantsNode.type !== 'ObjectExpression') return {};

  const result = {};
  for (const propEntry of variantsNode.properties) {
    if (propEntry.type !== 'ObjectProperty' || propEntry.value.type !== 'ObjectExpression')
      continue;
    const propName =
      propEntry.key.type === 'Identifier' ? propEntry.key.name : propEntry.key.value;
    const keys = propEntry.value.properties
      .filter((p) => p.type === 'ObjectProperty')
      .map((p) => (p.key.type === 'Identifier' ? p.key.name : p.key.value))
      .filter((k) => typeof k === 'string');
    if (keys.length) result[propName] = keys;
  }
  return result;
}

/** Top-level `type <name> = ...;` declaration in a file's own AST, by name —
 * the type-alias counterpart to extract-manifest-parameters.mjs's
 * `findTopLevelConst`. Backs `extractPropsFromTypeAlias`'s fallback below. */
function findLocalTypeAlias(name, ast) {
  for (const stmt of ast.program.body) {
    const decl =
      stmt.type === 'TSTypeAliasDeclaration'
        ? stmt
        : stmt.type === 'ExportNamedDeclaration' &&
            stmt.declaration?.type === 'TSTypeAliasDeclaration'
          ? stmt.declaration
          : null;
    if (decl && decl.id.name === name) return decl;
  }
  return null;
}

/**
 * Walks a props type's own declared members — a `TSTypeLiteral`'s
 * properties directly, an intersection's members merged, a local type-alias
 * reference resolved and recursed into. A reference to something NOT a
 * local type alias (`HTMLAttributes<HTMLDivElement>`, `Omit<X, 'y'>`) is
 * left opaque and simply not enumerated — those are the native element's own
 * attributes, already implied by "renders a `<div>`/`<a>`", not this
 * component's own API surface. A union merges its branches by key: a branch
 * typing a key as bare `undefined` (Card's `{ href?: undefined }` no-href
 * branch) loses to a sibling branch with a real type for the same key, and
 * the prop is marked optional whenever any branch omits or narrows it to
 * `undefined` — this is what recovers `href` as one flexible prop instead of
 * two contradictory single-branch ones.
 */
function collectTypeMembers(typeNode, ast, seen = new Map()) {
  if (!typeNode) return seen;
  switch (typeNode.type) {
    case 'TSTypeLiteral':
      for (const member of typeNode.members) {
        if (member.type !== 'TSPropertySignature' || member.key.type !== 'Identifier')
          continue;
        if (seen.has(member.key.name)) continue;
        seen.set(member.key.name, member);
      }
      return seen;
    case 'TSIntersectionType':
      for (const t of typeNode.types) collectTypeMembers(t, ast, seen);
      return seen;
    case 'TSUnionType': {
      const perBranch = typeNode.types.map((t) =>
        collectTypeMembers(t, ast, new Map()),
      );
      const isUndefinedOnly = (m) =>
        m.typeAnnotation?.typeAnnotation?.type === 'TSUndefinedKeyword';
      const names = new Set(perBranch.flatMap((m) => [...m.keys()]));
      for (const name of names) {
        if (seen.has(name)) continue;
        const candidates = perBranch.map((m) => m.get(name)).filter(Boolean);
        const best = candidates.find((c) => !isUndefinedOnly(c)) ?? candidates[0];
        const optional =
          candidates.length < perBranch.length ||
          candidates.some((c) => c.optional || isUndefinedOnly(c));
        seen.set(name, { ...best, __unionOptional: optional });
      }
      return seen;
    }
    case 'TSTypeReference': {
      const refName =
        typeNode.typeName?.type === 'Identifier' ? typeNode.typeName.name : null;
      const aliasDecl = refName && findLocalTypeAlias(refName, ast);
      if (aliasDecl) collectTypeMembers(aliasDecl.typeAnnotation, ast, seen);
      return seen;
    }
    default:
      return seen;
  }
}

/** A member's leading `/** ... *\/` JSDoc, joined to one line — mirrors how
 * react-docgen surfaces a prop's own comment as `description`. */
function memberDescription(member) {
  const comment = member.leadingComments?.at(-1);
  if (!comment) return undefined;
  return comment.value
    .split('\n')
    .map((line) => line.replace(/^\s*\*\s?/, '').trim())
    .join(' ')
    .trim();
}

/**
 * Fallback prop extraction for when react-docgen finds none — today, a
 * component whose props type is a top-level union of intersections (Card's
 * `CardProps = ({ href?: undefined } & CardOwnProps & ...) | ({ href:
 * string } & CardOwnProps & ...)`), which react-docgen 8's TS resolution
 * doesn't flatten. Reads `<Name>Props` directly off the component's own
 * source via the same "never execute" AST-slice approach as everywhere else
 * in this file. Returns `null` (not `[]`) when there's no such alias or it
 * has no own members, so the caller can tell "genuinely no extra props"
 * (Row/Stack, which `extends` an internal type via an `interface`, not a
 * `type` alias — this fallback doesn't touch that case at all) apart from
 * "extraction failed, ship nothing."
 */
function extractPropsFromTypeAlias(name, filePath) {
  if (!existsSync(filePath)) return null;
  const src = readFileSync(filePath, 'utf8');
  let ast;
  try {
    ast = babelParse(src, { sourceType: 'module', plugins: ['typescript', 'jsx'] });
  } catch {
    return null;
  }
  const aliasDecl = findLocalTypeAlias(`${name}Props`, ast);
  if (!aliasDecl) return null;
  const members = collectTypeMembers(aliasDecl.typeAnnotation, ast);
  if (!members.size) return null;

  return [...members.entries()].map(([propName, member]) => {
    const description = memberDescription(member);
    return {
      name: propName,
      type: member.typeAnnotation?.typeAnnotation
        ? src.slice(
            member.typeAnnotation.typeAnnotation.start,
            member.typeAnnotation.typeAnnotation.end,
          )
        : 'unknown',
      required: !(member.optional || member.__unionOptional),
      ...(description && { description }),
    };
  });
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
 * `sections` reads a component's own `parameters.manifest` off its
 * `.stories.tsx` file, when it has one — most components don't (their
 * `documentBlocks`/guidance content never existed), so `[]` stays the norm,
 * not the fallback. `iconFlexibility` is the first real case: an API
 * contract (bring-your-own icon set, no `weight` prop) that belongs on
 * `Icon` itself, not invented as a standalone foundation domain.
 */
export function generateComponentEntities() {
  const root = path.resolve(import.meta.dirname, '..');
  const entities = [];

  for (const name of COMPONENTS) {
    const dir = path.join(root, 'src', 'components', name);
    const doc = extractProps(path.join(dir, `${name}.tsx`));
    const { apiPath, usagePath } = resolveStoryFiles(dir, name);
    // Usage examples first — composed, real-world — then API ones fill the
    // remainder up to the cap.
    const examples = [
      ...(usagePath ? extractExamples(usagePath) : []),
      ...extractExamples(apiPath),
    ].slice(0, MAX_EXAMPLES_PER_COMPONENT);
    // A *.doc.ts sidecar (src/storydoc) is the current authoring surface; fall
    // back to the usage file's parameters.manifest, then the legacy
    // single-file parameters.manifest during migration.
    const storyDoc = readStoryDoc(path.join(dir, `${name}.doc.ts`));
    const manifestParams = storyDoc
      ? toEntitySections(storyDoc)
      : extractManifestParameters(usagePath ?? apiPath);
    // related/refs declared on individual stories (one example relates to
    // pattern.alignment, a sibling in the same file doesn't) — additional to,
    // not instead of, the component-wide ones on manifestParams above.
    const storyRelated = [apiPath, usagePath]
      .filter(Boolean)
      .map((p) => extractStoryRelated(p));
    const mergedRelated = dedupeRefs([
      ...(manifestParams?.related ?? []),
      ...storyRelated.flatMap((s) => s.related),
    ]);
    const mergedRefs = dedupeRefs([
      ...(manifestParams?.refs ?? []),
      ...storyRelated.flatMap((s) => s.refs),
    ]);

    const docgenProps = doc?.props
      ? Object.entries(doc.props).map(([propName, p]) => ({
          name: propName,
          type: p.tsType?.raw ?? p.tsType?.name ?? 'unknown',
          required: Boolean(p.required),
          ...(p.defaultValue?.value && { defaultValue: p.defaultValue.value }),
          ...(p.description && { description: p.description }),
        }))
      : [];
    // react-docgen found the component but not its props (a union-of-
    // intersections props type it can't flatten, e.g. Card) — fall back to
    // reading `<Name>Props` straight off the AST rather than silently
    // shipping an empty array indistinguishable from "really has no props."
    const fallbackProps = docgenProps.length
      ? null
      : extractPropsFromTypeAlias(name, path.join(dir, `${name}.tsx`));
    const rawProps = fallbackProps ?? docgenProps;

    // Backfill a prop's `type` with its real legal values when docgen only
    // got an unresolved alias reference (a recipe-typed variant, e.g.
    // `ButtonVariants['variant']`). The recipe's own `variants` keys
    // (authoritative, always present) win; a story's `argTypes.options`
    // fills in for a non-recipe prop that happens to declare one (neither
    // is hand-typed for this purpose — both already exist for other
    // reasons).
    const resolvedOptions = {
      ...extractArgTypesOptions(apiPath),
      ...(usagePath ? extractArgTypesOptions(usagePath) : {}),
      ...extractRecipeVariantKeys(path.join(dir, `${name}.css.ts`)),
    };
    const props = rawProps.map((p) => {
      const options = resolvedOptions[p.name];
      if (!options || /^['"]/.test(p.type.trim())) return p;
      return { ...p, type: options.map((o) => `'${o}'`).join(' | ') };
    });

    // DSDS requires a top-level `description` on every entry. Sourced from
    // the component's own JSDoc (via react-docgen) when present, same
    // source-of-truth stance as `props` above — never hand-typed.
    const description = doc?.description?.trim() || `${name} component.`;

    entities.push({
      id: `component.${name}`,
      kind: 'component',
      name,
      description,
      metadata: {
        props,
        ...(examples.length && {
          examplesPath: `components/${name}/${name}.examples.json`,
        }),
      },
      sections: manifestParams?.sections ?? [],
      ...(mergedRelated.length && { related: mergedRelated }),
      ...(mergedRefs.length && { refs: mergedRefs }),
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
    const { apiPath, usagePath } = resolveStoryFiles(dir, name);
    const examples = [
      ...(usagePath ? extractExamples(usagePath) : []),
      ...extractExamples(apiPath),
    ].slice(0, MAX_EXAMPLES_PER_COMPONENT);
    if (!examples.length) continue;
    examplesByComponent[name] = examples.map((e) => ({
      type: 'example',
      text: `// ${e.name}\n${e.code}`,
    }));
  }

  return examplesByComponent;
}
