# Marketplace submissions

This project is prepared for listing in Cursor, Claude, and Codex skill ecosystems.

## Quick submit order

Use this order to minimize rework:

1. **Cursor first**
   - [ ] verify `.cursor-plugin/plugin.json` and `.cursor-plugin/marketplace.json`
   - [ ] submit repo and resolve plugin metadata feedback
2. **Claude second**
   - [ ] submit `SKILL.md` + examples from `examples/skill-usage.md`
   - [ ] complete publisher/contact and trust/safety review items
3. **Codex third**
   - [ ] confirm `SKILL.md` + `AGENTS.md` packaging and npm package metadata
   - [ ] submit to target Codex-compatible listing entry point

Before each submission, run:

```bash
npm run build
npm test
```

## What is already in this repo

- `SKILL.md` in open Agent Skills format (portable across ecosystems)
- `AGENTS.md` for Codex/agent operational behavior
- `.cursor-plugin/plugin.json` for Cursor plugin discovery
- `.cursor-plugin/marketplace.json` for Cursor marketplace packaging metadata
- `skills/docs-index-keeper/SKILL.md` for Cursor-style skill layout

## Cursor marketplace

### Submission package

- repo URL: `https://github.com/oleg-koval/docs-index-keeper`
- plugin manifest: `.cursor-plugin/plugin.json`
- marketplace metadata: `.cursor-plugin/marketplace.json`
- skill path: `skills/docs-index-keeper/SKILL.md`
- logo: `docs/icon.svg`

### Manual steps

1. Ensure the repository is public and up to date.
2. Confirm plugin name uniqueness (`docs-index-keeper`) in marketplace.
3. Submit repository to Cursor marketplace intake/review flow.
4. Address review comments (metadata, naming, docs clarity) if requested.

## Claude skill ecosystem

### Submission package

- repo URL: `https://github.com/oleg-koval/docs-index-keeper`
- primary skill file: `SKILL.md`
- concise skill summary:
  - "Automates Markdown docs index maintenance for repositories by updating index tables from staged docs, with pre-commit and CI workflows."
- example prompts: `examples/skill-usage.md`

### Manual steps

1. Submit the repo through the current Claude skill/plugin listing intake flow.
2. Provide contact + publisher metadata required by the intake form.
3. Include at least 3 concrete use cases from `examples/skill-usage.md`.
4. Complete any trust/safety or policy review requested by the marketplace team.

## Codex skill ecosystem

### Submission package

- `SKILL.md` (portable agent skill metadata + instructions)
- `AGENTS.md` (repository guidance for Codex)
- npm package: `docs-index-keeper`
- repository URL: `https://github.com/oleg-koval/docs-index-keeper`

### Manual steps

1. Publish and validate package metadata on npm.
2. Submit/list the skill in the target Codex-compatible directory/market entry point.
3. Verify install and invocation paths:
   - skill discovery via `SKILL.md`
   - operational guidance via `AGENTS.md`

## Pre-submit checklist

- [ ] `npm run build` passes
- [ ] `npm test` passes
- [ ] `README.md` documents `add <path|mask...>` behavior
- [ ] `SKILL.md` and `skills/docs-index-keeper/SKILL.md` are aligned
- [ ] `examples/skill-usage.md` includes realistic prompts
- [ ] logo and preview assets are committed
- [ ] repository URL and contact metadata are current

## Suggested submission note (copy/paste)

`docs-index-keeper` is a lightweight skill + CLI for keeping Markdown docs indexes synchronized automatically. It supports pre-commit workflows, CI enforcement, and manual bulk indexing via file masks. The repository includes portable `SKILL.md`, Codex-oriented `AGENTS.md`, and Cursor plugin metadata for direct marketplace integration.

## Copy/paste submission templates

### Cursor marketplace

**Plugin name**
`docs-index-keeper`

**Repository URL**
`https://github.com/oleg-koval/docs-index-keeper`

**Homepage**
`https://github.com/oleg-koval/docs-index-keeper`

**Short description**
Keep Markdown docs indexes in sync with staged docs changes using a portable agent skill and npm CLI.

**What it does**
`docs-index-keeper` automates index maintenance for Markdown docs repositories. It updates `docs/README.md` table entries from staged docs files, supports pre-commit and CI enforcement, and includes manual bulk add with masks (`add <path|mask...>`).

**Included plugin metadata**

- `.cursor-plugin/plugin.json`
- `.cursor-plugin/marketplace.json`
- `skills/docs-index-keeper/SKILL.md`
- logo asset: `docs/icon.svg`

**Primary use cases**

1. Auto-index newly added docs files during pre-commit.
2. Fail CI when docs index is out of date.
3. Bulk index multiple docs in one command with path masks.

**Maintainer contact**
Name: Oleg Koval
Email: `oleg-koval@users.noreply.github.com`

### Claude skill ecosystem

**Skill name**
`docs-index-keeper`

**Repository URL**
`https://github.com/oleg-koval/docs-index-keeper`

**Primary skill file**
`SKILL.md`

**50-100 word listing description**
`docs-index-keeper` is a lightweight skill and CLI for keeping Markdown documentation indexes accurate automatically. It updates index tables from staged docs files, integrates with pre-commit hooks and CI checks, and supports manual bulk indexing with file masks. It is designed for repositories that keep docs under `docs/` and want predictable, low-maintenance documentation discoverability without manual table edits in every PR.

**Example prompts / use cases**

1. "Set up docs-index-keeper in this repo, initialize pre-commit, and verify it updates docs/README.md."
2. "Run docs-index-keeper check and tell me which staged docs are missing index entries."
3. "Add docs to index using a quoted mask: `docs-index-keeper add \"docs/plans/*.md\"` and report added/skipped files."

**Maintainer contact**
Name: Oleg Koval
Email: `oleg-koval@users.noreply.github.com`
Company/URL (optional): [YOUR SITE OR ORG URL]

### Codex skill ecosystem

**Skill/package name**
`docs-index-keeper`

**Repository URL**
`https://github.com/oleg-koval/docs-index-keeper`

**npm package**
`docs-index-keeper`

**Compatibility statement**
Compatible with Codex-style agent workflows using `SKILL.md` (portable skill format) and `AGENTS.md` (repo-level guidance). Requires shell access and Node.js 18+.

**Submission description**
`docs-index-keeper` provides an agent-friendly workflow for automatic Markdown docs index maintenance. It supports pre-commit automation (`update`), CI validation (`check`), and targeted manual indexing (`add <path|mask...>`). The repository includes portable skill metadata in `SKILL.md`, operational guidance in `AGENTS.md`, and practical prompts/examples for immediate agent usage.

**Key files**

- `SKILL.md`
- `AGENTS.md`
- `examples/skill-usage.md`
- `README.md`

**Maintainer contact**
Name: Oleg Koval
Email: `oleg-koval@users.noreply.github.com`
