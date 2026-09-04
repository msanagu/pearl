// Generates dist/llms.txt — the discoverability layer per ADR-0008's "Where
// llms.txt fits" section. This is the ROUTER: a consumer (human or agent)
// should read only this file plus whichever specific manifest/example files
// it names, never the whole dist/ tree. The manifest is now split precisely
// so this router can point at a small, relevant slice instead of one
// everything-file — see generate-manifest.mjs's header for the shape.
//
// Only links to what actually ships in the published package: `files` is
// `["dist"]`, plus whatever npm always includes (package.json, README,
// LICENSE) regardless of that whitelist. Repo-only docs (ADRs, PROJECT_BRIEF)
// aren't installed alongside a consumer's node_modules, so they're pointed
// at by repo URL instead of a relative link that would 404 once installed.

import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const THEMES = ['pearl', 'tahitian', 'freshwater', 'south-sea'];
const pkg = JSON.parse(readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
const distDir = path.join(ROOT, 'dist');
const repoUrl = pkg.repository.url.replace(/^git\+|\.git$/g, '');

const baseManifest = JSON.parse(
  readFileSync(path.join(distDir, 'manifest', 'base.json'), 'utf8'),
);

const themeLines = THEMES.map((theme) => {
  const m = JSON.parse(
    readFileSync(path.join(distDir, 'manifest', `${theme}.json`), 'utf8'),
  );
  return `- [manifest/${theme}.json](./manifest/${theme}.json): ${m.entities.length} role/treatment entities for the **${theme}** theme only. Read this ONE theme file — not the others — for whichever theme is actually active in the consuming app; the other three themes' role tables are irrelevant to a single generation and deliberately not bundled in with it.`;
}).join('\n');

const componentLines = baseManifest.entities
  .map((e) => {
    const examplesPath = e.metadata.examplesPath;
    const exampleNote = examplesPath
      ? ` Real usage examples: [${examplesPath}](./${examplesPath}) — fetch this file too, but only when generating with **${e.metadata.name}** specifically.`
      : ' No usage examples extracted for this component.';
    return `- **${e.metadata.name}** (${e.metadata.props.length} prop${e.metadata.props.length === 1 ? '' : 's'} in \`manifest/base.json\`).${exampleNote}`;
  })
  .join('\n');

const content = `# ${pkg.name}

> ${pkg.description}

## Machine-readable manifest — read only what's relevant, not everything

The manifest is split by scope so a single generation task never has to load
data for a theme it isn't using or a component it isn't touching:

- [manifest/base.json](./manifest/base.json): ${baseManifest.entities.length} theme-agnostic Component entities (props/types only — real usage examples live in each component's own file below, not embedded here). Also carries five cross-cutting fields, all worth reading before generating anything: \`overrideContract\` — the real mechanism for extending past a component's documented variants (data-attribute targeting, never inline styles), and the expectation that doing so gets flagged, not shipped silently. \`tokenSemantics\` — what each sentiment-color sub-field (\`surface\`/\`border\`/\`text\`/\`icon\`) is actually for; \`icon\` in particular is deliberately desaturated for glyph use, not a general-purpose strong fill color. \`inverseConvention\` — \`mode\` (light/dark) and \`inverse\` (\`[data-inverse]\`) are different, orthogonal axes: an inverse container always renders as if the theme's *other* mode were active there, without flipping the global mode, and most tokens auto-flip inside it except \`border\`/\`borderStrong\`/\`borderSubtle\` (use \`color.borderInverse\` explicitly for those). \`iconFlexibility\` — \`Icon\`'s \`icon\` prop accepts any \`react-icons\` \`IconType\`; Pearl ships no default set and enforces no weight/style convention, so check the actual set imported before assuming an outline/filled suffix pattern. \`sizingGrid\` — Pearl's 8px soft grid (4px named half-step) governs spacing, radius, typography, and any raw pixel size a component exposes (e.g. \`Icon.size\`); where a prop can't be type-restricted to a closed token set, always pick a multiple of 4, preferring a multiple of 8 without a specific named reason not to.
${themeLines}

### Component examples — fetch only the ones you're using

${componentLines}

### Schema

Structured facts in \`metadata\`, human-facing rationale in \`documentBlocks\`, agent-only do/don't/verification notes in \`agentDocumentBlocks\`. See the repo's ADR-0008 for the full schema rationale.

## \`dist/components/_internal/\` and \`dist/components/_brand/\` — present in \`dist\`, not public API

Both ship as compiled \`.d.ts\`/\`.js\` (the underscore prefix is this package's own "not public" convention, not a build artifact), but neither is re-exported from the package root — don't import from them directly, and don't offer them to a user as a component.

- **\`_internal/\`**: shared primitives a few public components build on (\`FlexBox\` underlies \`Row\`/\`Stack\`; \`XButton\` underlies \`Alert\`'s dismiss affordance). Relevant when a public component's own \`.d.ts\` extends or omits from one of these — e.g. \`Row\`'s \`RowProps extends Omit<FlexBoxProps, 'direction'>\` only fully resolves once you also read \`components/_internal/FlexBox/FlexBox.d.ts\`. Worth opening on demand, not up front.
- **\`_brand/\`**: Pearl's own brand assets (wordmark, the animated brand sphere). Unrelated to generating UI — skip unless a task specifically concerns Pearl's own branding.

## Reference

- [README.md](./README.md): usage and installation.
- [${repoUrl}](${repoUrl}): source, architecture decision records (\`docs/decisions/\`), and \`docs/PROJECT_BRIEF.md\` — not shipped in this package, read there for design rationale beyond what the manifest states.
`;

mkdirSync(distDir, { recursive: true });
const outPath = path.join(distDir, 'llms.txt');
writeFileSync(outPath, content);
console.log(`Wrote ${path.relative(process.cwd(), outPath)}`);
