# Getting started

The SFCC Development MCP Server runs locally and exposes a set of tools that let your AI assistant query SFCC documentation, analyze logs, explore metadata, and scaffold cartridges.

<Callout title="AI instructions required" variant="warn">
Install the instruction files from `ai-instructions/` so your assistant can use the MCP tools correctly.
</Callout>

## What it does

- Provides access to dw.* class docs, SFRA docs, and ISML references
- Summarizes runtime and job logs when credentials are available
- Lets you inspect system objects, custom objects, and site preferences
- Generates cartridge structure and project scaffolding
- Supports sandbox script evaluation via the debugger API

## Modes

### Docs mode (default)

- No credentials required
- Documentation tools, ISML and SFRA references, cartridge generation, and agent instructions

### Full mode

- Requires a valid dw.json
- Adds log and job log tooling, system and custom object introspection, site preferences, and code version tools

<Callout title="Auto-detection" variant="info">
If your MCP client supports workspace roots, the server can auto-detect `dw.json` from your open workspace after initialization. This only runs when CLI and environment credentials are not provided.
</Callout>

## Quick setup

1. Add the MCP server to your AI client.
2. Start in docs mode to validate tool access.
3. Add a dw.json when you need live data access.

See [Configuration](/guide/configuration) for exact flags and credentials.

## Next steps

- [AI interface setup](/guide/ai-interfaces)
- [Configuration](/guide/configuration)
- [Tools catalog](/tools/)
