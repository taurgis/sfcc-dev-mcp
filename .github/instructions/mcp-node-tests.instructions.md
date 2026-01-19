---
applyTo: "**/*.programmatic.test.js"
---
# MCP Programmatic Testing Instructions

For detailed guidance on writing programmatic tests, use the `mcp-programmatic-testing` skill located at `.github/skills/mcp-programmatic-testing/SKILL.md`.

## Quick Reference

**File naming**: `*.programmatic.test.js`

**Critical Setup**:
```javascript
beforeEach(() => {
  client.clearAllBuffers();  // REQUIRED - prevents test interference
});
```

**Test Execution**:
```bash
node --test tests/mcp/node/specific-test.programmatic.test.js
npm run test:mcp:node
```

**Critical Rules**:
1. Never use `Promise.all()` with MCP requests
2. Always include `beforeEach` with buffer clearing
3. Use `node --test`, NOT `npm test` for individual MCP tests

For complete API reference and patterns, see the skill file.
