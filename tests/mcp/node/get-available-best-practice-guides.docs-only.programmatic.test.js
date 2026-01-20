/**
 * Programmatic tests for get_available_best_practice_guides tool
 *
 * NOTE: This tool is DEPRECATED and now returns deprecation notices
 * pointing users to GitHub Copilot Agent Skills instead of actual guide content.
 *
 * Response format:
 * - Success: { content: [{ type: "text", text: JSON with deprecation notice }], isError: false }
 * - Deprecation notice includes: deprecated flag, message, skillsUrl, availableSkills array
 */

import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

/**
 * Helper function to validate MCP response structure
 */
function assertValidMCPResponse(result) {
  assert.ok(result.content, 'Response should have content');
  assert.ok(Array.isArray(result.content), 'Content should be array');
  assert.equal(typeof result.isError, 'boolean', 'isError should be boolean');
}

/**
 * Helper to parse and validate deprecation notice structure
 */
function assertDeprecationNotice(result) {
  assertValidMCPResponse(result);
  assert.equal(result.isError, false, 'Should not return error');
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
  assert.ok(deprecationData.skillsUrl, 'Should have skillsUrl');
  assert.ok(deprecationData.skillsUrl.includes('ai-instructions/skills'), 'skillsUrl should point to skills directory');
  assert.ok(Array.isArray(deprecationData.availableSkills), 'Should have availableSkills array');

  return deprecationData;
}

describe('get_available_best_practice_guides Programmatic Tests (DEPRECATED)', () => {
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

    test('should have get_available_best_practice_guides tool available', async () => {
      const tools = await client.listTools();
      const guidesTool = tools.find(tool => tool.name === 'get_available_best_practice_guides');

      assert.ok(guidesTool, 'get_available_best_practice_guides tool should be available');
      assert.equal(guidesTool.name, 'get_available_best_practice_guides');
      assert.ok(guidesTool.description, 'Tool should have description');
      assert.ok(guidesTool.description.includes('DEPRECATED'), 'Tool description should mention DEPRECATED');
    });
  });

  describe('Deprecation Notice Functionality', () => {
    test('should return deprecation notice with proper structure', async () => {
      const result = await client.callTool('get_available_best_practice_guides', {});

      const deprecationData = assertDeprecationNotice(result);

      // Verify structure
      assert.ok(deprecationData.deprecated === true);
      assert.ok(deprecationData.message.length > 100, 'Message should be substantial');
    });

    test('should mention GitHub Copilot Agent Skills', async () => {
      const result = await client.callTool('get_available_best_practice_guides', {});
      const deprecationData = assertDeprecationNotice(result);

      assert.ok(deprecationData.message.includes('Agent Skills'), 'Should mention Agent Skills');
      assert.ok(deprecationData.message.includes('GitHub Copilot') || deprecationData.message.includes('Copilot'),
        'Should mention GitHub Copilot');
    });

    test('should include all expected skill mappings', async () => {
      const result = await client.callTool('get_available_best_practice_guides', {});
      const deprecationData = assertDeprecationNotice(result);

      const expectedSkills = [
        'sfcc-cartridge-development',
        'sfcc-isml-development',
        'sfcc-job-development',
        'sfcc-localserviceregistry',
        'sfcc-ocapi-hooks',
        'sfcc-scapi-hooks',
        'sfcc-scapi-custom-endpoints',
        'sfcc-sfra-controllers',
        'sfcc-sfra-models',
        'sfcc-sfra-client-side-js',
        'sfcc-sfra-scss',
        'sfcc-performance',
        'sfcc-security'
      ];

      expectedSkills.forEach(skill => {
        assert.ok(deprecationData.availableSkills.includes(skill),
          `Should include skill: ${skill}`);
      });

      assert.equal(deprecationData.availableSkills.length, 13, 'Should have exactly 13 skills');
    });

    test('should include installation instructions', async () => {
      const result = await client.callTool('get_available_best_practice_guides', {});
      const deprecationData = assertDeprecationNotice(result);

      assert.ok(deprecationData.message.includes('.github/skills') || deprecationData.message.includes('.claude/skills'),
        'Should include installation path');
      assert.ok(deprecationData.message.includes('Copy') || deprecationData.message.includes('copy'),
        'Should include copy instructions');
    });
  });

  describe('Edge Cases', () => {
    test('should ignore additional parameters gracefully', async () => {
      const result = await client.callTool('get_available_best_practice_guides', {
        unexpectedParam: 'should be ignored',
        anotherParam: 123
      });

      const deprecationData = assertDeprecationNotice(result);
      assert.ok(deprecationData.deprecated === true, 'Should still return deprecation notice');
    });

    test('should return consistent results across calls', async () => {
      const result1 = await client.callTool('get_available_best_practice_guides', {});
      const result2 = await client.callTool('get_available_best_practice_guides', {});

      assert.equal(result1.content[0].text, result2.content[0].text,
        'Results should be identical across calls');
    });

    test('should respond quickly', async () => {
      const startTime = Date.now();
      await client.callTool('get_available_best_practice_guides', {});
      const elapsed = Date.now() - startTime;

      assert.ok(elapsed < 500, `Should respond quickly (took ${elapsed}ms)`);
    });
  });
});
