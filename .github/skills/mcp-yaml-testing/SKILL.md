---
name: mcp-yaml-testing
description: Guide for writing and debugging YAML-based declarative MCP server tests using Aegis. Use this when asked to create, fix, or debug MCP YAML tests (*.test.mcp.yml files).
---

# MCP YAML Testing Skill

Use this skill when writing or debugging `*.test.mcp.yml` files for Model Context Protocol servers.

## Golden Rule: Discovery First

**CRITICAL**: Before writing ANY YAML test, discover actual response formats:

```bash
# Test successful execution
npx aegis query [tool_name] '[valid_params]' --config "./aegis.config.docs-only.json"

# Test failure scenarios  
npx aegis query [tool_name] '[invalid_params]' --config "./aegis.config.docs-only.json"
npx aegis query [tool_name] '' --config "./aegis.config.docs-only.json"  # Empty params
```

## Parameter Formats

### Pipe Format (Recommended)
```bash
npx aegis query read_file 'path:test.txt' --config "./aegis.config.docs-only.json"
npx aegis query calculator 'operation:add|a:5|b:3' --config "./aegis.config.docs-only.json"

# Nested via dot notation
npx aegis query api_client 'config.host:localhost|config.port:8080' --config "./aegis.config.docs-only.json"
```

### JSON Format (Complex Structures)
```bash
npx aegis query complex_tool '{"config": {"host": "localhost"}, "data": [1,2,3]}' --config "./aegis.config.docs-only.json"
```

## Basic Test Structure

```yaml
description: "Test suite description"
tests:
  - it: "Test description"
    request:
      jsonrpc: "2.0"
      id: "unique-id"
      method: "tools/list"  # or "tools/call"
      params: {}
    expect:
      response:
        jsonrpc: "2.0"
        id: "unique-id"
        result: {}
      stderr: "toBeEmpty"
```

## Common Pattern Reference

```yaml
# TYPE VALIDATION
result:
  tools: "match:type:array"
  count: "match:type:number"

# STRING PATTERNS
result:
  text: "match:contains:substring"
  name: "match:startsWith:prefix"
  pattern: "match:regex:\\d{4}-\\d{2}-\\d{2}"  # Double-escape backslashes!

# ARRAY PATTERNS
result:
  tools: "match:arrayLength:3"
  tools:
    match:arrayElements:
      match:partial:  # Flexible - only validate specified fields
        name: "match:regex:^[a-z_]+$"
        description: "match:contains:tool"

# NEGATION
result:
  tools: "match:not:arrayLength:0"
  text: "match:not:contains:error"
```

## Common Mistakes to Avoid

```yaml
# ❌ WRONG - Duplicate YAML keys
result:
  tools: "match:arrayLength:1"
  tools: ["read_file"]  # OVERWRITES above!

# ❌ WRONG - Missing double backslash
result:
  text: "match:regex:\d+"  # Wrong
  text: "match:regex:\\d+"  # Correct

# ❌ WRONG - Assuming structure without discovery
result:
  tools: "match:arrayLength:3"  # Did you verify this exists?
```

## Test Execution Commands

```bash
# Run YAML tests (docs-only mode)
npm run test:mcp:yaml

# Run YAML tests (full mode with credentials)
npm run test:mcp:yaml:full

# Run specific test file
npx aegis "tests/mcp/yaml/specific.test.mcp.yml" --config "./aegis.config.docs-only.json"

# Debug mode
npx aegis "tests/**/*.test.mcp.yml" --config "./aegis.config.docs-only.json" --verbose --debug
```

## Discovery Examples for This Project

```bash
# List available tools
npx aegis query --config ./aegis.config.docs-only.json

# Documentation tools
npx aegis query search_sfcc_classes 'query:catalog' --config ./aegis.config.docs-only.json
npx aegis query get_sfcc_class_info 'className:dw.catalog.Product' --config ./aegis.config.docs-only.json

# Agent instructions / skills bootstrap
npx aegis query sync_agent_instructions 'destinationType:temp|dryRun:true' --config ./aegis.config.docs-only.json

# Full mode tools (requires credentials)
npx aegis query get_system_object_definitions --config ./aegis.config.with-dw.json
```
