# docs-index-keeper launch kit

Use this file for launch copy and distribution-ready messaging.

## Launch angle

For teams that keep docs in Markdown, `docs-index-keeper` removes index maintenance from PR reviews by updating `docs/README.md` automatically in pre-commit and CI workflows.

## Tagline options

- Keep your docs index accurate automatically.
- Stop fixing docs index rows by hand.
- Markdown docs index automation for pre-commit and CI.

## Announcement paragraph

`docs-index-keeper` is a lightweight Node CLI that keeps your docs index table in sync with new Markdown files. It works with staged files, supports pre-commit and CI checks, and now supports bulk manual adds with file masks so you can index many docs in one command.

## Social post variants

### X / short

Shipped: `docs-index-keeper add` now supports multiple files + masks.

Example:
`docs-index-keeper add "docs/plans/*.md" docs/runbook.md`

No more adding docs index rows one by one.

### LinkedIn / medium

If your team stores docs in Markdown, you probably have PR comments like "please update docs/README.md index."

I built `docs-index-keeper` to make that automatic in pre-commit and CI. This update adds bulk add support so you can index many files with one command:

`docs-index-keeper add "docs/plans/*.md" docs/runbook.md`

### Product Hunt style

Keep your docs index accurate without manual edits. `docs-index-keeper` updates your Markdown docs index from staged files and now supports bulk add via file masks.

## HN title ideas

- Show HN: docs-index-keeper – automatic Markdown docs index updates
- Show HN: A tiny CLI to keep docs/README.md indexes in sync
- Show HN: Stop manual docs index edits with this pre-commit CLI

## Share loop ideas

- Before/after demo: PR without tool vs PR with auto-index update
- A sample repo template with pre-wired hook + CI check
- A "docs hygiene" checklist linking to this tool

## Proof and metrics

- Activation event: user runs `docs-index-keeper init`
- Share event: user copies launch snippet or links to sample repo
- Conversion event: package install + successful `check` in CI
- Retention proxy: repeated weekly runs in commit history/CI logs
