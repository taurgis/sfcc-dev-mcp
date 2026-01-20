/**
 * Programmatic tests for get_best_practice_guide tool
 *
 * NOTE: This tool is DEPRECATED and now returns deprecation notices
 * pointing users to GitHub Copilot Agent Skills instead of actual guide content.
 *
 * Response format:
 * - Success: { content: [{ type: "text", text: JSON with deprecation notice }], isError: false }
 * - Error: { content: [{ type: "text", text: "Error: guideName must be a non-empty string" }], isError: true }
 * - Deprecation notice includes specific skill mapping for the requested guide
 */

import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

/**
 * Guide name to skill name mapping
 */
const GUIDE_TO_SKILL_MAP = {
  cartridge_creation: 'sfcc-cartridge-development',
  isml_templates: 'sfcc-isml-development',
  job_framework: 'sfcc-job-development',
  localserviceregistry: 'sfcc-localserviceregistry',
  ocapi_hooks: 'sfcc-ocapi-hooks',
  scapi_hooks: 'sfcc-scapi-hooks',
  scapi_custom_endpoint: 'sfcc-scapi-custom-endpoints',
  sfra_controllers: 'sfcc-sfra-controllers',
  sfra_models: 'sfcc-sfra-models',
  sfra_client_side_js: 'sfcc-sfra-client-side-js',
  sfra_scss: 'sfcc-sfra-scss',
  performance: 'sfcc-performance',
  security: 'sfcc-security'
};

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
function assertDeprecationNotice(result, expectedGuideName = null) {
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

  // If a specific guide was requested, verify the specific skill is mentioned
  if (expectedGuideName && GUIDE_TO_SKILL_MAP[expectedGuideName]) {
    const expectedSkill = GUIDE_TO_SKILL_MAP[expectedGuideName];
    assert.ok(deprecationData.message.includes(expectedSkill),
      `Message should mention specific skill: ${expectedSkill}`);
  }

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
    assert.ok(errorText.includes('guideName must be a non-empty string'),
      'Should mention guideName validation');
  }

  return errorText;
}

describe('get_best_practice_guide Programmatic Tests (DEPRECATED)', () => {
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

    test('should have get_best_practice_guide tool available', async () => {
      const tools = await client.listTools();
      const guideTool = tools.find(tool => tool.name === 'get_best_practice_guide');

      assert.ok(guideTool, 'get_best_practice_guide tool should be available');
      assert.ok(guideTool.description, 'Tool should have description');
      assert.ok(guideTool.description.includes('DEPRECATED'), 'Tool description should mention DEPRECATED');
    });
  });

  describe('Deprecation Notice for Specific Guides', () => {
    test('should return deprecation notice for cartridge_creation', async () => {
      const result = await client.callTool('get_best_practice_guide', {
        guideName: 'cartridge_creation'
      });

      const deprecationData = assertDeprecationNotice(result, 'cartridge_creation');
      assert.ok(deprecationData.message.includes('sfcc-cartridge-development'),
        'Should mention the replacement skill');
    });

    test('should return deprecation notice for security', async () => {
      const result = await client.callTool('get_best_practice_guide', {
        guideName: 'security'
      });

      const deprecationData = assertDeprecationNotice(result, 'security');
      assert.ok(deprecationData.message.includes('sfcc-security'),
        'Should mention the replacement skill');
    });

    test('should return deprecation notice for performance', async () => {
      const result = await client.callTool('get_best_practice_guide', {
        guideName: 'performance'
      });

      const deprecationData = assertDeprecationNotice(result, 'performance');
      assert.ok(deprecationData.message.includes('sfcc-performance'),
        'Should mention the replacement skill');
    });

    test('should return deprecation notice for sfra_controllers', async () => {
      const result = await client.callTool('get_best_practice_guide', {
        guideName: 'sfra_controllers'
      });

      const deprecationData = assertDeprecationNotice(result, 'sfra_controllers');
      assert.ok(deprecationData.message.includes('sfcc-sfra-controllers'),
        'Should mention the replacement skill');
    });

    test('should return deprecation notice for sfra_scss', async () => {
      const result = await client.callTool('get_best_practice_guide', {
        guideName: 'sfra_scss'
      });

      const deprecationData = assertDeprecationNotice(result, 'sfra_scss');
      assert.ok(deprecationData.message.includes('sfcc-sfra-scss'),
        'Should mention the replacement skill');
    });

    test('should return deprecation notice for all known guides', async () => {
      for (const [guideName, expectedSkill] of Object.entries(GUIDE_TO_SKILL_MAP)) {
        const result = await client.callTool('get_best_practice_guide', { guideName });

        const deprecationData = assertDeprecationNotice(result, guideName);
        assert.ok(deprecationData.message.includes(expectedSkill),
          `Guide ${guideName} should mention skill ${expectedSkill}`);
      }
    });
  });

  describe('Validation Errors', () => {
    test('should return error when guideName is missing', async () => {
      const result = await client.callTool('get_best_practice_guide', {});
      assertErrorResponse(result, 'validation');
    });

    test('should return error when guideName is empty string', async () => {
      const result = await client.callTool('get_best_practice_guide', { guideName: '' });
      assertErrorResponse(result, 'validation');
    });

    test('should return error when guideName is whitespace', async () => {
      const result = await client.callTool('get_best_practice_guide', { guideName: '   ' });
      assertErrorResponse(result, 'validation');
    });
  });

  describe('Edge Cases', () => {
    test('should handle unknown guide names gracefully', async () => {
      const result = await client.callTool('get_best_practice_guide', {
        guideName: 'unknown_guide'
      });

      // Should still return deprecation notice (not an error)
      const deprecationData = assertDeprecationNotice(result);
      assert.ok(deprecationData.deprecated === true);
    });

    test('should ignore extra parameters', async () => {
      const result = await client.callTool('get_best_practice_guide', {
        guideName: 'security',
        extraParam: 'ignored'
      });

      const deprecationData = assertDeprecationNotice(result, 'security');
      assert.ok(deprecationData.message.includes('sfcc-security'));
    });

    test('should respond quickly', async () => {
      const startTime = Date.now();
      await client.callTool('get_best_practice_guide', { guideName: 'security' });
      const elapsed = Date.now() - startTime;

      assert.ok(elapsed < 500, `Should respond quickly (took ${elapsed}ms)`);
    });
  });
});
