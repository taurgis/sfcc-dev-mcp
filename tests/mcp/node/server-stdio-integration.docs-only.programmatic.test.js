import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

describe('SFCCDevServer stdio integration (docs-only)', () => {
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

  test('should serve docs-only tools over real stdio transport', async () => {
    const tools = await client.listTools();
    const toolNames = tools.map(tool => tool.name);

    assert.equal(client.connected, true, 'Client should be connected');
    assert.ok(toolNames.includes('get_sfcc_class_info'), 'Expected docs tool should be available');
    assert.ok(toolNames.includes('generate_cartridge_structure'), 'Expected cartridge tool should be available');
    assert.equal(toolNames.includes('search_logs'), false, 'Credentialed log tool should not be listed in docs-only mode');
  });

  test('should return structured validation errors over stdio', async () => {
    const result = await client.callTool('get_sfcc_class_info', {});

    assert.equal(result.isError, true, 'Missing required args should return an error');
    assert.ok(result.content[0].text.includes('Invalid arguments for tool'), 'Error should include validation context');
    assert.equal(result.structuredContent?.error?.code, 'INVALID_TOOL_ARGUMENTS', 'Structured error code should be present');
    assert.equal(result.structuredContent?.error?.toolName, 'get_sfcc_class_info', 'Structured error should include tool name');
  });
});
