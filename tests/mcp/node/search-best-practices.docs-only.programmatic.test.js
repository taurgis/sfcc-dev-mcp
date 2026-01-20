/**
 * Programmatic tests for search_best_practices tool
 *
 * NOTE: This tool is DEPRECATED and now returns deprecation notices
 * pointing users to GitHub Copilot Agent Skills instead of actual search results.
 *
 * Response format:
 * - Success: { content: [{ type: "text", text: JSON with deprecation notice }], isError: false }
 * - Error: { content: [{ type: "text", text: "Error: query must be a non-empty string" }], isError: true }
 */

import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

/**
 * Helper function to validate MCP response structure
 */
function assertValidMCPResponse(result, expectError = false) {
  assert.ok(result.content, 'Response should have content');
  assert.ok(Array.isArray(result.content), 'Content should be array');
  assert.equal(typeof result.isError, 'boolean', 'isError should be boolean');
  assert.equal(result.isError, expectError, `isError should be ${expectError}`);
}

/**
 * Helper to parse and validate deprecation notice structure
 */
function assertDeprecationNotice(result) {
  assertValidMCPResponse(result, false);
  assert.equal(result.content[0].type, 'text', 'Content type should be text');

  const responseText = result.content[0].text;

  // Should be valid JSON
  let deprecationData;
  assert.doesNotThrow(() => {
    deprecationData = JSON.parse(responseText);
  }, 'Response should be valid JSON');

  // Validate deprecation notice structure
  assert.equal(deprecationData.deprecated, true, 'Should have deprecated: true');
  assert.ok(deprecationData.message, 'Should have message');
  assert.ok(deprecationData.message.includes('DEPRECATION NOTICE'), 'Message should contain DEPRECATION NOTICE');
  assert.ok(deprecationData.message.includes('Agent Skills'), 'Message should mention Agent Skills');
  assert.ok(deprecationData.skillsUrl, 'Should have skillsUrl');
  assert.ok(Array.isArray(deprecationData.availableSkills), 'Should have availableSkills array');

  return deprecationData;
}

/**
 * Helper to validate error response
 */
function assertErrorResponse(result, expectedErrorType) {
  assertValidMCPResponse(result, true);
  assert.equal(result.content[0].type, 'text');

  const errorText = result.content[0].text;
  assert.ok(errorText.includes('Error:'), 'Should be error message');

  if (expectedErrorType === 'validation') {
    assert.ok(errorText.includes('query must be a non-empty string'),
      'Should mention query validation');
  }

  return errorText;
}

describe('search_best_practices Programmatic Tests (DEPRECATED)', () => {
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

  describe('Protocol Compliance', () => {
    test('should be properly connected to MCP server', async () => {
      assert.ok(client.connected, 'Client should be connected');
    });

    test('should have search_best_practices tool available', async () => {
      const tools = await client.listTools();
      const searchTool = tools.find(tool => tool.name === 'search_best_practices');

      assert.ok(searchTool, 'search_best_practices tool should be available');
      assert.ok(searchTool.description, 'Tool should have description');
      assert.ok(searchTool.description.includes('DEPRECATED'), 'Tool description should mention DEPRECATED');
    });
  });

  describe('Deprecation Notice Functionality', () => {
    test('should return deprecation notice for any search query', async () => {
      const result = await client.callTool('search_best_practices', {
        query: 'validation'
      });

      const deprecationData = assertDeprecationNotice(result);
      assert.ok(deprecationData.deprecated === true);
    });

    test('should return same deprecation notice regardless of query', async () => {
      const queries = ['validation', 'security', 'performance', 'caching', 'authentication'];

      for (const query of queries) {
        const result = await client.callTool('search_best_practices', { query });
        const deprecationData = assertDeprecationNotice(result);

        assert.ok(deprecationData.message.includes('DEPRECATION NOTICE'),
          `Query "${query}" should return deprecation notice`);
      }
    });

    test('should include skills directory path', async () => {
      const result = await client.callTool('search_best_practices', {
        query: 'security'
      });

      const deprecationData = assertDeprecationNotice(result);
      assert.ok(deprecationData.skillsUrl.includes('ai-instructions/skills'),
        'Should include skills directory URL');
    });

    test('should list available skills', async () => {
      const result = await client.callTool('search_best_practices', {
        query: 'test'
      });

      const deprecationData = assertDeprecationNotice(result);
      assert.ok(deprecationData.availableSkills.length === 13, 'Should have 13 skills');
      assert.ok(deprecationData.availableSkills.includes('sfcc-security'),
        'Should include security skill');
      assert.ok(deprecationData.availableSkills.includes('sfcc-performance'),
        'Should include performance skill');
    });
  });

  describe('Validation Errors', () => {
    test('should return error when query is missing', async () => {
      const result = await client.callTool('search_best_practices', {});
      assertErrorResponse(result, 'validation');
    });

    test('should return error when query is empty string', async () => {
      const result = await client.callTool('search_best_practices', { query: '' });
      assertErrorResponse(result, 'validation');
    });

    test('should return error when query is whitespace only', async () => {
      const result = await client.callTool('search_best_practices', { query: '   ' });
      assertErrorResponse(result, 'validation');
    });
  });

  describe('Edge Cases', () => {
    test('should ignore extra parameters', async () => {
      const result = await client.callTool('search_best_practices', {
        query: 'validation',
        extraParam: 'ignored',
        anotherParam: 123
      });

      const deprecationData = assertDeprecationNotice(result);
      assert.ok(deprecationData.deprecated === true);
    });

    test('should handle special characters in query', async () => {
      const result = await client.callTool('search_best_practices', {
        query: 'dw.crypto.Cipher'
      });

      const deprecationData = assertDeprecationNotice(result);
      assert.ok(deprecationData.deprecated === true);
    });

    test('should handle very long queries', async () => {
      const result = await client.callTool('search_best_practices', {
        query: 'a'.repeat(1000)
      });

      const deprecationData = assertDeprecationNotice(result);
      assert.ok(deprecationData.deprecated === true);
    });

    test('should respond quickly', async () => {
      const startTime = Date.now();
      await client.callTool('search_best_practices', { query: 'validation' });
      const elapsed = Date.now() - startTime;

      assert.ok(elapsed < 500, `Should respond quickly (took ${elapsed}ms)`);
    });

    test('should return consistent results', async () => {
      const result1 = await client.callTool('search_best_practices', { query: 'test' });
      const result2 = await client.callTool('search_best_practices', { query: 'test' });

      assert.equal(result1.content[0].text, result2.content[0].text,
        'Results should be consistent');
    });
  });
});
