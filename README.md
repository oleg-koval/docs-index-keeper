<div align="center">
  <h1>docs-index-keeper</h1>
  <p><strong>Keep your docs index in sync automatically.</strong></p>
  <p>
    <a href="https://www.npmjs.com/package/docs-index-keeper"><img src="https://img.shields.io/npm/v/docs-index-keeper.svg" alt="npm version"></a>
    <a href="https://www.npmjs.com/package/docs-index-keeper"><img src="https://img.shields.io/npm/dm/docs-index-keeper.svg" alt="npm downloads"></a>
    <a href="https://github.com/oleg-koval/docs-index-keeper/actions/workflows/ci.yml"><img src="https://github.com/oleg-koval/docs-index-keeper/actions/workflows/ci.yml/badge.svg" alt="CI"></a>
    <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License MIT"></a>
    <a href="https://nodejs.org"><img src="https://img.shields.io/node/v/docs-index-keeper.svg" alt="Node version"></a>
  </p>
  <p>
    <img src="https://img.shields.io/badge/skill-ready-0f766e" alt="Skill ready">
    <img src="https://img.shields.io/badge/runtime-zero%20deps-1f2937" alt="Zero deps">
    <img src="https://img.shields.io/badge/docs-index-automated-2563eb" alt="Docs index automated">
    <img src="https://img.shields.io/badge/agent%20skills-open%20standard-059669" alt="Agent Skills open standard">
    <img src="https://img.shields.io/badge/cursor-plugin%20ready-111827" alt="Cursor plugin ready">
  </p>
</div>

**Keep your docs index in sync automatically.** When you add or change Markdown files under `docs/`, a pre-commit hook (or CI step) updates the index table—no manual edits, no forgotten entries.

- **Zero config for common setups:** `docs/README.md` index, exclude `archive/`, optional warning for root-level `.md`
- **Composable:** Use with [Husky](https://typicode.github.io/husky/) or plain `.git/hooks/pre-commit`
- **CI-friendly:** `docs-index-keeper check` exits 1 if the index would change (enforce “index must be up to date”)
- **Portable:** Node 18+, no runtime dependencies, works with npm / pnpm / yarn / bun

---

## Why use it?

| Problem | What docs-index-keeper does |
|--------|-----------------------------|
| New runbooks or guides get added under `docs/` but nobody updates the index | Pre-commit (or CI) adds a row to `docs/README.md` automatically |
| Contributors forget to touch the index | Hook runs on staged `.md` files; index is updated and re-staged in the same commit |
| “Is this doc listed?” is a recurring review comment | Index stays in sync by construction |
| Onboarding: “Where do I find X?” | Single table in `docs/README.md` is always up to date |

**ROI:** A few minutes to run `npx docs-index-keeper init` once. After that, you avoid repeated manual index edits and review back-and-forth every time someone adds a doc. The index becomes a reliable map of your docs without extra process.

---

## Quick start

```bash
# In your repo root (with a docs/ folder and docs/README.md index table)
npm install -D docs-index-keeper
npx docs-index-keeper init
```

Then, when you `git add docs/my-new-guide.md` and commit, the hook will run `docs-index-keeper update` and add the new row to `docs/README.md` (and stage it).

---

## AI skill / marketplace readiness

This repository now includes a root [SKILL.md](./SKILL.md), which makes the project usable as an agent skill definition for skill-aware tools and registries that scan repository contents.

What is included here:

- `SKILL.md` with trigger phrases, workflow, config, and validation
- richer Agent Skills metadata (`license`, `compatibility`, `metadata`)
- a minimal Cursor plugin wrapper in [`.cursor-plugin/plugin.json`](./.cursor-plugin/plugin.json)
- a Cursor skill layout in [`skills/docs-index-keeper/SKILL.md`](./skills/docs-index-keeper/SKILL.md)
- npm package metadata that ships `SKILL.md` and usage examples
- copy-pasteable prompts for agent tools in [examples/skill-usage.md](./examples/skill-usage.md)
- a platform support note in [docs/agent-platforms.md](./docs/agent-platforms.md)

What may still be needed:

- some marketplaces require their own registry entry, plugin manifest, or catalog submission flow in addition to a repo-level `SKILL.md`
- Cursor Marketplace publication still requires an actual plugin submission flow
- if a directory or marketplace expects a different metadata schema, add that schema on top of this repo rather than replacing `SKILL.md`

---

## AI usage examples

### Codex

```text
Install docs-index-keeper in this repository, configure it for docs/README.md, add the pre-commit hook, and verify the setup.
```

```text
Use docs-index-keeper to update the docs index for the currently staged Markdown files and show me which rows were added.
```

### Claude

```text
Set up docs-index-keeper in this repo so new docs under docs/ are automatically added to docs/README.md during pre-commit. Keep the default archive exclusion.
```

```text
Use the docs-index-keeper workflow in this repository to add docs/runbooks/oncall.md into the docs index and explain any assumptions briefly.
```

### Cursor

```text
Add docs-index-keeper to this project, wire the hook, and make CI fail if docs/README.md is missing entries for docs Markdown files.
```

### Platform support

- Codex: `SKILL.md` plus `AGENTS.md`
- Claude / Claude Code: `SKILL.md` plus repo-local guidance
- Cursor: `SKILL.md` plus a minimal plugin manifest in `.cursor-plugin/plugin.json`

Details: [docs/agent-platforms.md](./docs/agent-platforms.md)

More examples: [examples/skill-usage.md](./examples/skill-usage.md)

Marketplace submission checklist: [docs/marketplace-submissions.md](./docs/marketplace-submissions.md)

---

## Commands

| Command | Purpose |
|--------|---------|
| `docs-index-keeper init` | Add a pre-commit hook (Husky or `.git/hooks/pre-commit`) that runs `update` and stages the index file |
| `docs-index-keeper update` | Update the index from **staged** `.md` files (used by the hook) |
| `docs-index-keeper check` | Dry run; exit 1 if the index would change (use in CI to require an up-to-date index) |
| `docs-index-keeper add <path|mask...>` | Add one or many files to the index (e.g. `docs-index-keeper add docs/runbook.md docs/plans/*.md`) |

---

## Add One, Many, or by Mask

`add` supports direct file paths and glob-like masks in one command.

```bash
# one file
docs-index-keeper add docs/runbook.md

# many files
docs-index-keeper add docs/runbook.md docs/guides/oncall.md

# mask (quote masks so your shell does not expand unexpectedly)
docs-index-keeper add "docs/plans/*.md"

# mixed
docs-index-keeper add docs/README.md "docs/plans/*.md"
```

Notes:

- only Markdown files are added
- excluded paths are skipped based on config
- already-indexed files are skipped
- the command prints both added and skipped entries

---

## Config

Put config in `package.json` or in `.docs-index-keeper.json` at the repo root.

**Example (package.json):**

```json
{
  "docsIndexKeeper": {
    "indexFile": "docs/README.md",
    "docsDir": "docs",
    "exclude": ["README.md", "archive/"],
    "allowedRootMd": ["README.md", "AGENTS.md", "CONTRIBUTING.md"],
    "warnRootMd": true
  }
}
```

- **indexFile** — Path to the Markdown file that contains the index table (default: `docs/README.md`).
- **docsDir** — Directory treated as “docs” (default: `docs`).
- **exclude** — Paths under `docsDir` that are not added (e.g. `README.md`, `archive/`).
- **allowedRootMd** — Root-level `.md` files that do not trigger a warning when changed.
- **warnRootMd** — If `true`, warn when new/changed `.md` in repo root (or `.github/`) are staged; suggests moving them to `docs/`.

---

## Index format

The index file should contain a Markdown table with a header like `| Doc | Purpose |`. New rows are inserted before a “sentinel” row (e.g. `| [archive/](archive/) | … |`) or at the end of the table. The **title** for the link is taken from the filename; the **purpose** column uses the first `#` heading in the file, or a slugified filename.

---

## CI: require index up to date

```yaml
# .github/workflows/docs-index-check.yml
- run: npm ci
- run: npx docs-index-keeper check
```

Use `DOCS_INDEX_KEEPER_STAGED` to simulate staged files (e.g. in tests or CI):

```bash
DOCS_INDEX_KEEPER_STAGED="docs/foo.md" npx docs-index-keeper check
```

---

## Releases (maintainers)

**Publishing is fully automated in GitHub Actions.**

- Push a Conventional Commit to `main` for a stable release.
- Push a Conventional Commit to `beta` for an installable npm pre-release published on the `beta` dist-tag.
- Every push to `main` or `beta` first runs a release-readiness job that validates `NPM_TOKEN` and dry-runs `semantic-release` before the actual publish step runs.

**One-shot: create repo, commit, push** (no local npm publish):

```bash
./publish.sh
```

Run from the package root. Requires `git`, `gh` (logged in), and `npm`. Overrides: `PROJECT_DIR`, `REUSE_REMOTE_REPO=true`, `COMMIT_MSG="..."`. After push, CI performs the npm publish.

- **Versioning:** Use [Conventional Commits](https://www.conventionalcommits.org/): `feat:` → minor, `fix:` → patch, `BREAKING CHANGE:` (or `feat!:` / `fix!:`) → major.
- **Pre-releases:** The `beta` branch publishes versions like `1.2.0-beta.1`. Install with `npm install docs-index-keeper@beta`.
- **Changelog:** `CHANGELOG.md` is generated and maintained by the release workflow. Do not edit it manually.
- **Secrets:** In the repo’s GitHub Settings → Secrets and variables → Actions, add **NPM_TOKEN** (npm token with **Read and write** for your packages). Paste the token with **no trailing newline or space**. Use `scripts/set-npm-token-secret.sh --from-browser` after creating a token at https://www.npmjs.com/settings/~/tokens (Granular). `GITHUB_TOKEN` is provided by Actions.
- **Local verification:** Run `npm run release:dry-run` to validate the semantic-release setup locally without publishing.

**Publishing to GitHub Package Registry (instead of npm):** Use a scoped name in `package.json` (e.g. `@oleg-koval/docs-index-keeper`) and add `"publishConfig": { "registry": "https://npm.pkg.github.com" }`. In CI, set the secret to a GitHub PAT with `write:packages` and use it as `NPM_TOKEN` (semantic-release/npm uses `NPM_TOKEN` for any registry). Install from GitHub: `npm install @oleg-koval/docs-index-keeper` with `.npmrc`: `@oleg-koval:registry=https://npm.pkg.github.com`.

---

## License

MIT © [Oleg Koval](https://github.com/oleg-koval)
