---
name: docs-index-keeper
description: Keep a repository's Markdown docs index in sync by installing and running docs-index-keeper in pre-commit hooks, CI, or one-off maintenance flows.
license: MIT
compatibility: Cursor plugin skill. Requires shell access and Node.js 18+ when installing from npm.
metadata:
  author: Oleg Koval
  source: https://github.com/oleg-koval/docs-index-keeper
---

# docs-index-keeper

Use this skill when a repository keeps documentation under `docs/` and needs `docs/README.md` or another Markdown index table updated automatically as docs are added or changed.

## Trigger phrases

- keep a docs index up to date
- auto-update `docs/README.md`
- add a pre-commit hook for docs indexing
- enforce docs index freshness in CI
- add a specific `docs/*.md` file into a Markdown index table

## Workflow

1. Confirm the repo has a docs directory and a Markdown table index such as `| Doc | Purpose |`.
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

5. For a one-off fix or staged maintenance, run:

```bash
npx docs-index-keeper update
```

6. To add files manually, run:

```bash
npx docs-index-keeper add docs/my-doc.md docs/plans/*.md
```

## Notes

- `update` operates on staged Markdown files.
- `check` exits non-zero when the index is missing entries for staged docs.
- Purpose text comes from the first Markdown heading when available.
- New rows are inserted before an archive sentinel row when present, otherwise at the end of the table.

More usage examples live in `examples/skill-usage.md`.
