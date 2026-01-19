---
name: mcp-programmatic-testing
description: Guide for writing JavaScript programmatic MCP server tests using Node.js test runner. Use this when asked to create complex multi-step MCP tests or debug programmatic test files (*.programmatic.test.js).
---

# MCP Programmatic Testing Skill

Use this skill when writing or debugging `*.programmatic.test.js` files for Model Context Protocol servers.

## When to Use Programmatic Tests

- Complex business logic requiring code execution
- Multi-step workflows with state management  
- Dynamic test case generation
- Integration with existing JavaScript test suites

For basic functional testing, prefer YAML tests (see `mcp-yaml-testing` skill).

## Basic Test Structure

```javascript
import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

describe('[SERVER_NAME] Programmatic Tests', () => {
  let client;

  before(async () => {
    client = await connect('./aegis.config.docs-only.json');
  });

  after(async () => {
    if (client?.connected) {
      await client.disconnect();
    }
  });

  beforeEach(() => {
    // CRITICAL: Clear buffers to prevent test interference
    client.clearAllBuffers();
  });

  test('should list available tools', async () => {
    const tools = await client.listTools();
    assert.ok(Array.isArray(tools), 'Tools should be array');
    assert.ok(tools.length > 0, 'Should have at least one tool');
  });

  test('should execute tool successfully', async () => {
    const result = await client.callTool('[TOOL_NAME]', { param: 'value' });
    assert.ok(result.content, 'Should return content');
    assert.equal(result.isError, false, 'Should not be error');
  });
});
```

## Critical: Buffer Management

**Always include `beforeEach` with buffer clearing** to prevent test flakiness:

```javascript
beforeEach(() => {
  client.clearAllBuffers();  // Recommended - comprehensive
  // OR: client.clearStderr();  // Minimum - stderr only
});
```

Without this, stderr from one test can leak into subsequent tests, causing random failures.

## Critical: No Concurrent Requests

**Never use `Promise.all()` with MCP requests**. MCP uses single stdio with shared buffers:

```javascript
// ❌ NEVER DO THIS
const results = await Promise.all(tools.map(t => client.callTool(t.name, {})));

// ✅ ALWAYS DO THIS
const results = [];
for (const tool of tools) {
  const result = await client.callTool(tool.name, {});
  results.push(result);
}
```

## Test Execution Commands

```bash
# Run individual MCP programmatic test
node --test tests/mcp/node/specific-test.programmatic.test.js

# Run all MCP programmatic tests
npm run test:mcp:node

# Watch mode for development
node --test --watch tests/mcp/node/*.programmatic.test.js

# ❌ WRONG: Don't use npm test with individual files
# npm test -- tests/mcp/node/specific-test.programmatic.test.js  # Runs Jest!
```

## API Reference

```javascript
// Connection
const client = await connect('./aegis.config.json');
await client.disconnect();

// Tool operations
const tools = await client.listTools();
const result = await client.callTool(name, arguments);

// Debugging
const stderr = client.getStderr();
client.clearStderr();
client.clearAllBuffers();
```

## Performance Testing Guidelines

**Performance testing is discouraged in programmatic tests** due to CI variability.

If timing validation is required, use lenient thresholds:

```javascript
// ❌ Too strict for CI
assert.ok(duration < 50, 'Should be under 50ms');

// ✅ CI-friendly
assert.ok(duration < 500, 'Should be under 500ms');
```

## Discovery Before Testing

Use aegis query to discover response formats before writing tests:

```bash
npx aegis query search_sfcc_classes 'query:catalog' --config ./aegis.config.docs-only.json
```

Then use the discovered format to write assertions.
