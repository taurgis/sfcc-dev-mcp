/**
 * Programmatic tests for search_best_practices tool (removed)
 *
 * This tool was part of the best-practices category and has been removed.
 * These tests now validate that the tool is absent and returns an unknown tool
 * error when called.
 */

import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

describe('search_best_practices Programmatic Tests (Removed)', () => {
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

  test('should NOT list search_best_practices tool', async () => {
    const tools = await client.listTools();
    const toolNames = tools.map(t => t.name);

    assert.ok(!toolNames.includes('search_best_practices'), 'search_best_practices should not be registered');
  });

  test('should return unknown tool error when invoked', async () => {
    const result = await client.callTool('search_best_practices', { query: 'security' });

    assert.equal(result.isError, true, 'Call should be an error');
    assert.ok(result.content?.[0]?.text.includes('Unknown tool'), 'Should mention unknown tool');
  });

  test('should fail fast for missing query with unknown tool error', async () => {
    const result = await client.callTool('search_best_practices', {});

    assert.equal(result.isError, true, 'Call should be an error');
    assert.ok(result.content?.[0]?.text.includes('Unknown tool'), 'Should mention unknown tool');
  });
});
