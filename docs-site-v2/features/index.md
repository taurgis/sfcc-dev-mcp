---
title: Features Overview
description: Explore SFCC Dev MCP capabilities including documentation tools, logs, system objects, cartridge generation, and AI instruction packs.
---

# Features

The server provides a focused set of capabilities for local SFCC development. Use docs mode for reference and scaffolding, and full mode when you need live data.

<Collapsible title="Cartridge generation" :open="true">

- Generate a production-ready cartridge or full project scaffold
- Standard structure: controllers, models, ISML, scripts, configs
- Direct file creation in the target path

Try asking:

- "Generate a cartridge named int_tracking and show the created directories"
- "What files does generate_cartridge_structure create in full project mode?"

</Collapsible>

<Collapsible title="Agent skills (instruction packs)">

- Portable skills for SFRA, ISML, security, and performance
- Install with `sync_agent_instructions`
- Works with Copilot, Claude, and Cursor instruction systems

Try asking:

- "Install bundled agent instructions into my repo"
- "List available SFCC skills and suggest one for OCAPI hooks"

</Collapsible>

<Collapsible title="SFCC API documentation">

- Query the full `dw.*` namespace
- Filter by methods, properties, or search terms
- Retrieve raw docs or class details

Try asking:

- "What methods does dw.catalog.Product have for pricing?"
- "Search SFCC classes related to inventory"

</Collapsible>

<Collapsible title="Enhanced SFRA documentation">

- Core classes (server, request, response, querystring, render)
- Model coverage across product, order, pricing, store, customer
- Search and category filters

Try asking:

- "Search SFRA docs for middleware examples"
- "List order-related SFRA documents and summarize each"

</Collapsible>

<Collapsible title="ISML template reference">

- Full ISML element reference with syntax and attributes
- Category browsing (control-flow, output, includes, scripting, cache)
- Search across ISML elements

Try asking:

- "Show me how to use isloop with paging"
- "What ISML elements are available for caching?"

</Collapsible>

<Collapsible title="Log and job log analysis (full mode)">

- Latest error, warn, info, debug logs
- Pattern search and daily summaries
- Job log discovery and execution summaries

Try asking:

- "Show the latest 10 error log entries containing 'OCAPI'"
- "Get the latest job execution summary for ProductFeedJob"

</Collapsible>

<Collapsible title="System and custom objects (full mode)">

- List system object definitions and attribute groups
- Search attribute definitions with filters
- Search site preferences by group

Try asking:

- "List custom attributes for Product containing 'brand'"
- "Search site preferences in the SEO group for description fields"

</Collapsible>

<Collapsible title="Code version management (full mode)">

- List available code versions
- Activate a version for deployment fixes

Try asking:

- "List code versions and highlight the active one"
- "Activate code version int_release_2025_09"

</Collapsible>

<Collapsible title="Security and performance">

- Credential handling and least-privilege guidance
- Log access and path validation safeguards
- Caching and range reads for efficient log access

</Collapsible>

<Collapsible title="AI integration">

- Stable tool schemas for deterministic responses
- Category grouping to keep prompts small
- Skills and instruction packs to enforce patterns

</Collapsible>

## Modes at a glance

| Capability | Docs mode | Full mode |
| --- | --- | --- |
| SFCC docs, SFRA docs, ISML docs | Yes | Yes |
| Cartridge generation | Yes | Yes |
| Agent instructions | Yes | Yes |
| Logs and job logs | No | Yes |
| System objects and site preferences | No | Yes |
| Code versions | No | Yes |
| Script debugger | No | Yes |

## Next steps

- Browse the [Tools catalog](/tools/)
- Try the [Examples](/examples/)
