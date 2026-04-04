---
name: docs-index-keeper
description: Keep a repository's Markdown docs index in sync by installing and running docs-index-keeper in pre-commit hooks, CI, or one-off maintenance flows.
license: MIT
compatibility: Codex, Claude Code, Cursor, and other Agent Skills compatible tools. Requires shell access and Node.js 18+ when installing from npm.
metadata:
  author: Oleg Koval
  package: docs-index-keeper
  tags:
    - docs
    - markdown
    - documentation
    - pre-commit
    - ci
    - index
    - codex
    - claude
    - cursor
---

# docs-index-keeper

Use this skill when a repository keeps documentation under `docs/` and needs `docs/README.md` or another Markdown index table updated automatically as docs are added or changed.

## When to use

Trigger this skill when the user asks for any of the following:

- keep a docs index or docs table of contents up to date
- auto-update `docs/README.md` when new Markdown files are added
- add a pre-commit hook for docs indexing
- enforce in CI that documentation index entries are current
- add a specific `docs/*.md` file into an index table

## What this tool does

`docs-index-keeper` scans staged Markdown files, filters to a configured docs directory, and inserts missing rows into a Markdown table.

Default behavior:

- index file: `docs/README.md`
- docs directory: `docs`
- excludes: `README.md`, `archive/`
- optional warnings for root-level Markdown files

Commands:

- `docs-index-keeper init`
- `docs-index-keeper update`
- `docs-index-keeper check`
- `docs-index-keeper add <path>`

## Preferred workflow

1. Confirm the repo has a docs directory and an index table such as `| Doc | Purpose |`.
2. Install the package if it is not already present:

```bash
npm install -D docs-index-keeper
```

3. Initialize the hook:

```bash
npx docs-index-keeper init
```

4. For CI enforcement, run:

```bash
npx docs-index-keeper check
```

5. For a one-off fix or scripted maintenance, use:

```bash
npx docs-index-keeper update
```

6. To add one doc manually:

```bash
npx docs-index-keeper add docs/my-doc.md
```

## Config

Prefer `package.json`:

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

You can also use `.docs-index-keeper.json` at the repo root.

## Operational notes

- `update` works from staged files, not every file in the repo.
- `check` exits non-zero when staged docs would require index changes.
- The purpose column is taken from the first Markdown heading in the file when available.
- New rows are inserted before an archive sentinel row when present, otherwise at the end of the table.
- If the repo does not already have a compatible Markdown table in the configured index file, create or repair that table first.

## Validation

After installing or changing config, verify with:

```bash
npx docs-index-keeper check
```

If you are changing the package itself, verify with:

```bash
npm run build
npm test
```
