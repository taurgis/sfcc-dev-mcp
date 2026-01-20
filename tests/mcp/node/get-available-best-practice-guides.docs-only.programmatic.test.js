import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

describe('get_available_best_practice_guides Programmatic Tests (REMOVED)', () => {
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

  describe('Removal Validation', () => {
    test('should be properly connected to MCP server', async () => {
      assert.ok(client.connected, 'Client should be connected');
    });

    test('should not list get_available_best_practice_guides tool', async () => {
      const tools = await client.listTools();
      const guidesTool = tools.find(tool => tool.name === 'get_available_best_practice_guides');

      assert.equal(guidesTool, undefined, 'get_available_best_practice_guides should not be available');
    });

    test('should return unknown tool error when calling removed tool', async () => {
      const result = await client.callTool('get_available_best_practice_guides', {});

      assert.ok(result.isError, 'Should be marked as error');
      assert.ok(Array.isArray(result.content), 'Content should be array');
      assert.ok(result.content[0].text.includes('Unknown tool'), 'Should indicate unknown tool');
    });
  });
});
