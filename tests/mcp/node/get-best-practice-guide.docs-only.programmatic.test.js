/**
 * Programmatic tests for get_best_practice_guide tool (removed)
 *
 * This tool was part of the best-practices category and has been removed.
 * These tests now validate that the tool is absent and returns an unknown tool
 * error when called.
 */

import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

describe('get_best_practice_guide Programmatic Tests (Removed)', () => {
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

  test('should NOT list get_best_practice_guide tool', async () => {
    const tools = await client.listTools();
    const toolNames = tools.map(t => t.name);

    assert.ok(!toolNames.includes('get_best_practice_guide'),
      'get_best_practice_guide should not be registered');
  });

  test('should return unknown tool error when invoked', async () => {
    const result = await client.callTool('get_best_practice_guide', { guideName: 'security' });

    assert.equal(result.isError, true, 'Call should be an error');
    assert.ok(result.content?.[0]?.text.includes('Unknown tool'), 'Should mention unknown tool');
  });

  test('should fail fast for missing parameters with unknown tool error', async () => {
    const result = await client.callTool('get_best_practice_guide', {});

    assert.equal(result.isError, true, 'Call should be an error');
    assert.ok(result.content?.[0]?.text.includes('Unknown tool'), 'Should mention unknown tool');
  });
});
