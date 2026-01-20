/**
 * Programmatic tests for get_hook_reference tool (removed)
 *
 * This tool was part of the best-practices category and has been removed.
 * These tests now validate that the tool is absent and returns an unknown tool
 * error when called.
 */

import { describe, test, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

describe('get_hook_reference Programmatic Tests (Removed)', () => {
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
    client.clearAllBuffers();
  });

  test('should NOT list get_hook_reference tool', async () => {
    const tools = await client.listTools();
    const toolNames = tools.map(t => t.name);

    assert.ok(!toolNames.includes('get_hook_reference'), 'get_hook_reference should not be registered');
  });

  test('should return unknown tool error when invoked (ocapi_hooks)', async () => {
    const result = await client.callTool('get_hook_reference', { guideName: 'ocapi_hooks' });

    assert.equal(result.isError, true, 'Call should be an error');
    assert.ok(result.content?.[0]?.text.includes('Unknown tool'), 'Should mention unknown tool');
  });

  test('should return unknown tool error when invoked (scapi_hooks)', async () => {
    const result = await client.callTool('get_hook_reference', { guideName: 'scapi_hooks' });

    assert.equal(result.isError, true, 'Call should be an error');
    assert.ok(result.content?.[0]?.text.includes('Unknown tool'), 'Should mention unknown tool');
  });

  test('should fail fast for missing guideName with unknown tool error', async () => {
    const result = await client.callTool('get_hook_reference', {});

    assert.equal(result.isError, true, 'Call should be an error');
    assert.ok(result.content?.[0]?.text.includes('Unknown tool'), 'Should mention unknown tool');
  });
});
