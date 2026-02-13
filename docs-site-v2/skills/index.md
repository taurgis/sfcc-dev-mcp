---
title: Agent Skills
description: Install and use reusable SFCC instruction packs to keep AI assistants consistent across Copilot, Claude, and Cursor.
---

# Agent skills

Skills are portable instruction packs that help your AI assistant follow consistent SFCC patterns.

## Install with the MCP tool

Prompt:

```
Install bundled agent instructions into my repo.
```

Example call:

```json
{
  "tool": "sync_agent_instructions",
  "params": {
    "destinationType": "project",
    "dryRun": false
  }
}
```

## Manual install

- GitHub Copilot: copy `ai-instructions/github-copilot/copilot-instructions.md` into `.github/copilot-instructions.md`
- Claude Desktop: use `ai-instructions/claude-desktop/claude_custom_instructions.md`
- Cursor: copy `ai-instructions/cursor/.cursor` into your repo

## Browse skills

Repository: https://github.com/taurgis/sfcc-dev-mcp/tree/main/ai-instructions/skills

<SkillsList />
