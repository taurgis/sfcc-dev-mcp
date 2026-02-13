---
title: AI Interface Setup
description: Set up SFCC Dev MCP in Copilot, Claude, and Cursor with docs-only and full-mode configuration examples.
---

# AI interface setup

Use the same MCP server configuration across clients. The differences are mostly where you place the config file or instruction files.

<Callout title="Auto-discovery" variant="success">
If you open a workspace that contains a `dw.json` and your client supports MCP `roots/list`, the server discovers it automatically after initialization. Use docs mode first, then add credentials when you need full mode.
</Callout>

## Environment modes

<ModeTabs />

## Universal MCP configuration

Docs-only mode:

```json
{
  "mcpServers": {
    "sfcc-dev": {
      "command": "npx",
      "args": ["sfcc-dev-mcp"]
    }
  }
}
```

Full mode:

```json
{
  "mcpServers": {
    "sfcc-dev": {
      "command": "npx",
      "args": ["sfcc-dev-mcp", "--dw-json", "/path/to/dw.json", "--debug", "false"]
    }
  }
}
```

## AI assistant setup

<AssistantTabs />

## Instruction files

<InstructionFilesTabs />

## Verification prompts

- "Show methods on dw.catalog.Product for pricing"
- "Summarize the latest error log entries"
- "Generate a cartridge named int_example"
