# docs-index-keeper

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

## Commands

| Command | Purpose |
|--------|---------|
| `docs-index-keeper init` | Add a pre-commit hook (Husky or `.git/hooks/pre-commit`) that runs `update` and stages the index file |
| `docs-index-keeper update` | Update the index from **staged** `.md` files (used by the hook) |
| `docs-index-keeper check` | Dry run; exit 1 if the index would change (use in CI to require an up-to-date index) |
| `docs-index-keeper add <path>` | Add a single file to the index (e.g. `docs-index-keeper add docs/runbook.md`) |

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

**Publishing is done in CI/CD.** Push to `main` → CI runs tests, then [semantic-release](https://semantic-release.gitbook.io/) bumps the version (SemVer), publishes to npm, and creates a GitHub release when there are releasable commits.

**One-shot: create repo, commit, push** (no local npm publish):

```bash
./publish.sh
```

Run from the package root. Requires `git`, `gh` (logged in), and `npm`. Overrides: `PROJECT_DIR`, `REUSE_REMOTE_REPO=true`, `COMMIT_MSG="..."`. After push, CI performs the npm publish.

- **Versioning:** Use [Conventional Commits](https://www.conventionalcommits.org/): `feat:` → minor, `fix:` → patch, `BREAKING CHANGE:` (or `feat!:` / `fix!:`) → major.
- **Secrets:** In the repo’s GitHub Settings → Secrets and variables → Actions, add **NPM_TOKEN** (npm auth token with “Automation” type). `GITHUB_TOKEN` is provided by Actions.

**Publishing to GitHub Package Registry (instead of npm):** Use a scoped name in `package.json` (e.g. `@oleg-koval/docs-index-keeper`) and add `"publishConfig": { "registry": "https://npm.pkg.github.com" }`. In CI, set the secret to a GitHub PAT with `write:packages` and use it as `NPM_TOKEN` (semantic-release/npm uses `NPM_TOKEN` for any registry). Install from GitHub: `npm install @oleg-koval/docs-index-keeper` with `.npmrc`: `@oleg-koval:registry=https://npm.pkg.github.com`.

---

## License

MIT © [Oleg Koval](https://github.com/oleg-koval)
