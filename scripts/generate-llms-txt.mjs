// Generates dist/llms.txt — the discoverability layer per ADR-0008's "Where
// llms.txt fits" section. A flat, human-authored-shape index pointing at
// what a coding agent should read; the manifest (dist/manifest.json) is the
// structured content behind it, not duplicated here.
//
// Only links to what actually ships in the published package: `files` is
// `["dist"]`, plus whatever npm always includes (package.json, README,
// LICENSE) regardless of that whitelist. Repo-only docs (ADRs, PROJECT_BRIEF)
// aren't installed alongside a consumer's node_modules, so they're pointed
// at by repo URL instead of a relative link that would 404 once installed.

import { writeFileSync, readFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const pkg = JSON.parse(readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
const manifest = JSON.parse(readFileSync(path.join(ROOT, 'dist', 'manifest.json'), 'utf8'));
const repoUrl = pkg.repository.url.replace(/^git\+|\.git$/g, '');

const content = `# ${pkg.name}

> ${pkg.description}

## Machine-readable manifest

- [manifest.json](./manifest.json): ${manifest.entities.length} generated entities (theme roles/treatments — "Foundation" kind). Structured facts in \`metadata\`, human-facing rationale in \`documentBlocks\`, agent-only do/don't/verification notes in \`agentDocumentBlocks\`. See the repo's ADR-0008 for the full schema rationale.

## Reference

- [README.md](./README.md): usage and installation.
- [${repoUrl}](${repoUrl}): source, architecture decision records (\`docs/decisions/\`), and \`docs/PROJECT_BRIEF.md\` — not shipped in this package, read there for design rationale beyond what the manifest states.
`;

const distDir = path.join(ROOT, 'dist');
mkdirSync(distDir, { recursive: true });
const outPath = path.join(distDir, 'llms.txt');
writeFileSync(outPath, content);
console.log(`Wrote ${path.relative(process.cwd(), outPath)}`);
