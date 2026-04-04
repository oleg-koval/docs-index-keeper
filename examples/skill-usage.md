# docs-index-keeper skill usage

This document contains copy-pasteable examples for using `docs-index-keeper` as an agent skill or repo capability.

## Codex

### Install or wire it into a repo

```text
Install docs-index-keeper in this repository, configure it with the default docs/README.md index, add the pre-commit hook, and show me the exact files changed.
```

### Fix an out-of-date docs index

```text
Use docs-index-keeper to update the docs index for the currently staged Markdown files, then run the relevant verification commands.
```

### Add CI enforcement

```text
Add CI enforcement for docs-index-keeper so the build fails when docs/README.md is missing entries for staged docs.
```

## Claude

### Repo maintenance request

```text
This repo uses docs-index-keeper. Please check whether docs/README.md has a valid index table, install or configure docs-index-keeper if needed, and add a pre-commit hook so new docs are indexed automatically.
```

### One-off indexing request

```text
Use the docs-index-keeper workflow in this repository to add docs/runbooks/oncall.md into the docs index and explain any assumptions briefly.
```

## Cursor

### Agent prompt in chat

```text
Set up docs-index-keeper in this repo. Assume docs live under docs/, the index file is docs/README.md, and archive/ should stay excluded. Add or update the hook and verify the setup.
```

### CI hardening request

```text
Add docs-index-keeper to this project and wire a CI check that fails if a new docs Markdown file is not listed in docs/README.md.
```

## Generic skill discovery description

Use this repo when an agent needs to:

- keep a Markdown docs index table in sync
- automate docs index updates in pre-commit
- enforce docs index freshness in CI
- add missing rows for `docs/*.md` files without manual table editing
