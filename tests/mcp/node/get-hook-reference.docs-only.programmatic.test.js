/**
 * Programmatic tests for get_hook_reference tool (docs-only mode)
 *
 * NOTE: This tool is DEPRECATED and now returns deprecation notices
 * pointing users to GitHub Copilot Agent Skills instead of actual hook reference content.
 *
 * Response format:
 * - Success: { content: [{ type: "text", text: JSON with deprecation notice }], isError: false }
 * - Error: { content: [{ type: "text", text: "Error: guideName must be a non-empty string" }], isError: true }
 * - Deprecation notice includes specific skill mapping (ocapi_hooks -> sfcc-ocapi-hooks, scapi_hooks -> sfcc-scapi-hooks)
 */

import { describe, test, before, after, beforeEach } from 'node:test';
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
function assertDeprecationNotice(result, expectedSkill = null) {
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

  // If a specific skill is expected, verify it's mentioned
  if (expectedSkill) {
    assert.ok(deprecationData.message.includes(expectedSkill),
      `Message should mention specific skill: ${expectedSkill}`);
  }

  return deprecationData;
}

/**
 * Helper to validate error response
 */
function assertErrorResponse(result) {
  assertValidMCPResponse(result, true);
  assert.equal(result.content[0].type, 'text');

  const errorText = result.content[0].text;
  assert.ok(errorText.includes('Error:'), 'Should be error message');
  assert.ok(errorText.includes('guideName must be a non-empty string'),
    'Should mention guideName validation');

  return errorText;
}

describe('get_hook_reference Programmatic Tests (DEPRECATED)', () => {
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
    test('tool should be present in listTools', async () => {
      const tools = await client.listTools();
      const hookTool = tools.find(t => t.name === 'get_hook_reference');

      assert.ok(hookTool, 'get_hook_reference should be registered');
      assert.ok(hookTool.description, 'Tool should have description');
      assert.ok(hookTool.description.includes('DEPRECATED'), 'Tool description should mention DEPRECATED');
    });
  });

  describe('OCAPI Hooks Deprecation', () => {
    test('should return deprecation notice for ocapi_hooks', async () => {
      const result = await client.callTool('get_hook_reference', { guideName: 'ocapi_hooks' });

      const deprecationData = assertDeprecationNotice(result, 'sfcc-ocapi-hooks');
      assert.ok(deprecationData.message.includes('sfcc-ocapi-hooks'),
        'Should mention the replacement skill');
    });

    test('should include Agent Skills migration guidance for OCAPI', async () => {
      const result = await client.callTool('get_hook_reference', { guideName: 'ocapi_hooks' });

      const deprecationData = assertDeprecationNotice(result);
      assert.ok(deprecationData.message.includes('Agent Skills'),
        'Should mention Agent Skills');
      assert.ok(deprecationData.skillsUrl.includes('ai-instructions/skills'),
        'Should include skills directory URL');
    });
  });

  describe('SCAPI Hooks Deprecation', () => {
    test('should return deprecation notice for scapi_hooks', async () => {
      const result = await client.callTool('get_hook_reference', { guideName: 'scapi_hooks' });

      const deprecationData = assertDeprecationNotice(result, 'sfcc-scapi-hooks');
      assert.ok(deprecationData.message.includes('sfcc-scapi-hooks'),
        'Should mention the replacement skill');
    });

    test('should include Agent Skills migration guidance for SCAPI', async () => {
      const result = await client.callTool('get_hook_reference', { guideName: 'scapi_hooks' });

      const deprecationData = assertDeprecationNotice(result);
      assert.ok(deprecationData.message.includes('Agent Skills'),
        'Should mention Agent Skills');
    });
  });

  describe('Validation Errors', () => {
    test('missing guideName validation error', async () => {
      const result = await client.callTool('get_hook_reference', {});
      assertErrorResponse(result);
    });

    test('empty guideName validation error', async () => {
      const result = await client.callTool('get_hook_reference', { guideName: '' });
      assertErrorResponse(result);
    });

    test('whitespace guideName validation error', async () => {
      const result = await client.callTool('get_hook_reference', { guideName: '   ' });
      assertErrorResponse(result);
    });
  });

  describe('Edge Cases', () => {
    test('should handle invalid guideName gracefully', async () => {
      const result = await client.callTool('get_hook_reference', { guideName: 'invalid_hooks' });

      // Should still return deprecation notice (generic one without specific skill)
      const deprecationData = assertDeprecationNotice(result);
      assert.ok(deprecationData.deprecated === true);
    });

    test('should ignore extra parameters', async () => {
      const result = await client.callTool('get_hook_reference', {
        guideName: 'ocapi_hooks',
        extraParam: 'ignored'
      });

      const deprecationData = assertDeprecationNotice(result, 'sfcc-ocapi-hooks');
      assert.ok(deprecationData.message.includes('sfcc-ocapi-hooks'));
    });

    test('should respond quickly', async () => {
      const startTime = Date.now();
      await client.callTool('get_hook_reference', { guideName: 'ocapi_hooks' });
      const elapsed = Date.now() - startTime;

      assert.ok(elapsed < 500, `Should respond quickly (took ${elapsed}ms)`);
    });

    test('should return consistent results', async () => {
      const result1 = await client.callTool('get_hook_reference', { guideName: 'scapi_hooks' });
      const result2 = await client.callTool('get_hook_reference', { guideName: 'scapi_hooks' });

      assert.equal(result1.content[0].text, result2.content[0].text,
        'Results should be consistent');
    });
  });

  describe('Available Skills Validation', () => {
    test('should list all available skills in deprecation notice', async () => {
      const result = await client.callTool('get_hook_reference', { guideName: 'ocapi_hooks' });

      const deprecationData = assertDeprecationNotice(result);
      assert.ok(Array.isArray(deprecationData.availableSkills), 'Should have availableSkills array');
      assert.equal(deprecationData.availableSkills.length, 13, 'Should have 13 skills');

      // Verify both hook skills are included
      assert.ok(deprecationData.availableSkills.includes('sfcc-ocapi-hooks'),
        'Should include OCAPI hooks skill');
      assert.ok(deprecationData.availableSkills.includes('sfcc-scapi-hooks'),
        'Should include SCAPI hooks skill');
    });
  });
});
