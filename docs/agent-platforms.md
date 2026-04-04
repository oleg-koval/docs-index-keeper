# Agent platform support

This repository is prepared for the most relevant current skill ecosystems that are publicly documented and actively used.

## Included support

### Open Agent Skills standard

- Root `SKILL.md` follows the Agent Skills format.
- This is the most portable entry point across tools that consume `SKILL.md`.

### Codex / OpenAI

- Root `SKILL.md` is compatible with the Agent Skills format used by Codex-compatible tools.
- Root `AGENTS.md` gives Codex persistent repository guidance.

### Claude / Claude Code

- Root `SKILL.md` follows the open Agent Skills format originally developed by Anthropic.
- Root `AGENTS.md` provides repository-local operating guidance for agents.

### Cursor Marketplace

- `.cursor-plugin/plugin.json` provides a minimal Cursor plugin manifest.
- `skills/docs-index-keeper/SKILL.md` exposes the skill from a Cursor-style plugin layout.

## Not included yet

- marketplace-specific submission metadata for third-party skill directories
- logos, screenshots, and publisher assets for plugin listings
- platform-specific install automation beyond the documented package and plugin layouts

## Why this scope

The public documentation and current ecosystem support strongly point to:

- the open Agent Skills format for cross-tool compatibility
- Codex support for Agent Skills plus `AGENTS.md`
- Cursor Marketplace plugin bundles for marketplace distribution

This keeps the repo aligned with real documented surfaces instead of adding speculative manifests for unsupported targets.
