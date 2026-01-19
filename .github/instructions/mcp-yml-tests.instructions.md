---
applyTo: "**/*.test.mcp.yml"
---
# MCP YAML Testing Instructions

For detailed guidance on writing YAML tests, use the `mcp-yaml-testing` skill located at `.github/skills/mcp-yaml-testing/SKILL.md`.

## Quick Reference

**Golden Rule**: Always discover response formats first:
```bash
npx aegis query [tool_name] '[params]' --config ./aegis.config.docs-only.json
```

**Test Execution**:
```bash
npm run test:mcp:yaml        # docs-only mode
npm run test:mcp:yaml:full   # full mode with credentials
```

**Common Patterns**:
- `"match:contains:substring"` - Contains text
- `"match:regex:\\d+"` - Regex (double-escape backslashes)
- `"match:type:array"` - Type validation
- `"match:arrayElements:"` with `"match:partial:"` - Flexible array validation

For complete pattern reference and troubleshooting, see the skill file.