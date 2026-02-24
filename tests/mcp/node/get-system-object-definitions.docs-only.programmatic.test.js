/**
 * MCP Aegis - Programmatic Tests for get_system_object_definitions Tool (Docs-Only Mode)
 * 
 * Tests that system object tools are NOT available in docs-only mode.
 * This tool requires SFCC credentials and should not be available without them.
 * 
 * Quick Test Commands:
 * node --test tests/mcp/node/get-system-object-definitions.docs-only.programmatic.test.js
 * npm test -- --grep "get_system_object_definitions.*Docs-Only"
 */

import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

describe('get_system_object_definitions Tool - Docs-Only Mode Programmatic Tests', () => {
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
    // CRITICAL: Clear all buffers to prevent leaking into next tests
    client.clearAllBuffers();
  });

  // ==================================================================================
  // TOOL UNAVAILABILITY TESTS
  // ==================================================================================

  describe('Tool Unavailability in Docs-Only Mode', () => {
    test('should NOT list get_system_object_definitions tool in docs-only mode', async () => {
      const tools = await client.listTools();
      
      assert.ok(Array.isArray(tools), 'Tools should be an array');
      
      const toolNames = tools.map(tool => tool.name);
      assert.ok(!toolNames.includes('get_system_object_definitions'), 
        'Should NOT include get_system_object_definitions tool in docs-only mode');
    });

    test('should NOT list any system object tools in docs-only mode', async () => {
      const tools = await client.listTools();
      const toolNames = tools.map(tool => tool.name);
      
      const systemObjectTools = [
        'get_system_object_definitions',
        'get_system_object_definition',
        'search_system_object_attribute_definitions',
        'search_site_preferences',
        'search_system_object_attribute_groups',
        'search_custom_object_attribute_definitions'
      ];

      systemObjectTools.forEach(toolName => {
        assert.ok(!toolNames.includes(toolName), 
          `Should NOT include ${toolName} tool in docs-only mode`);
      });
    });

    test('should have expected number of tools in docs-only mode', async () => {
      const tools = await client.listTools();
      
      // Should have documentation, SFRA, best practices, and cartridge tools
      // but NOT system object, log, or code version tools
      assert.ok(tools.length >= 10, 'Should have at least 10 tools available');
      assert.ok(tools.length <= 20, 'Should not have too many tools (likely around 15)');
    });
  });



  // ==================================================================================
  // TOOL CALL BEHAVIOR - SHOULD RETURN ERROR
  // ==================================================================================

  describe('Tool Call Behavior - Configuration Error', () => {
    test('should return configuration error when calling unlisted tool', async () => {
      const result = await client.callTool('get_system_object_definitions', {});
      
      assert.equal(result.isError, true, 'Should return error result');
      assert.ok(result.content, 'Should have content');
      assert.ok(Array.isArray(result.content), 'Content should be array');
      assert.equal(result.content[0].type, 'text', 'Content should be text type');
      
      const errorText = result.content[0].text;
        assert.ok(
          errorText.includes('Tool not available in current mode') ||
          errorText.includes('not available'),
          'Error should mention tool availability issue',
        );
    });

    test('should return proper error result structure for unlisted tool', async () => {
      const result = await client.callTool('get_system_object_definitions', {});
      
      assert.equal(result.isError, true, 'Should be error result');
      assert.ok(Array.isArray(result.content), 'Content should be array');
      assert.ok(result.content.length > 0, 'Should have error content');
      assert.equal(result.content[0].type, 'text', 'Error content should be text');
    });

    test('should fail fast when calling unlisted tool with parameters', async () => {
      const startTime = Date.now();
      
      const result = await client.callTool('get_system_object_definitions', {
        start: 0,
        count: 10,
        select: '(**)'
      });
      
      const duration = Date.now() - startTime;
      
      assert.equal(result.isError, true, 'Should return error');
      assert.ok(duration < 1000, 'Should fail quickly (under 1 second)');
      
      const errorText = result.content[0].text;
        assert.ok(
          errorText.includes('Tool not available in current mode') ||
          errorText.includes('not available'),
          'Error should mention tool availability issue',
        );
    });

    test('should handle invalid parameters gracefully even in error mode', async () => {
      const result = await client.callTool('get_system_object_definitions', {
        invalidParam: 'test',
        anotherInvalid: 123
      });
      
      assert.equal(result.isError, true, 'Should return error');
      
      const errorText = result.content[0].text;
        // In docs-only mode, credentialed tools are unavailable before argument validation.
        assert.ok(
          errorText.includes('Tool not available in current mode') ||
          errorText.includes('not available'),
          'Should report tool unavailability in docs-only mode',
        );
    });
  });

  // ==================================================================================
  // OTHER SYSTEM OBJECT TOOLS VERIFICATION
  // ==================================================================================

  describe('Other System Object Tools Unavailability', () => {
    test('should NOT have get_system_object_definition tool', async () => {
      const tools = await client.listTools();
      const toolNames = tools.map(tool => tool.name);
      
      assert.ok(!toolNames.includes('get_system_object_definition'), 
        'Should NOT include get_system_object_definition tool');
      
      // Verify calling it also returns error
      const result = await client.callTool('get_system_object_definition', {
        objectType: 'Product'
      });
      
      assert.equal(result.isError, true, 'Should return configuration error');
    });

    test('should NOT have search_system_object_attribute_definitions tool', async () => {
      const tools = await client.listTools();
      const toolNames = tools.map(tool => tool.name);
      
      assert.ok(!toolNames.includes('search_system_object_attribute_definitions'), 
        'Should NOT include search_system_object_attribute_definitions tool');
      
      // Verify calling it also returns error
      const result = await client.callTool('search_system_object_attribute_definitions', {
        objectType: 'Product',
        searchRequest: {
          query: { match_all_query: {} }
        }
      });
      
      assert.equal(result.isError, true, 'Should return configuration error');
    });

    test('should NOT have site preferences tools', async () => {
      const tools = await client.listTools();
      const toolNames = tools.map(tool => tool.name);
      
      assert.ok(!toolNames.includes('search_site_preferences'), 
        'Should NOT include search_site_preferences tool');
      
      // Verify calling it also returns error
      const result = await client.callTool('search_site_preferences', {
        groupId: 'SitePreferences',
        instanceType: 'sandbox',
        searchRequest: {
          query: { match_all_query: {} }
        }
      });
      
      assert.equal(result.isError, true, 'Should return configuration error');
    });
  });

  // ==================================================================================
  // CONSISTENCY TESTS
  // ==================================================================================

  describe('Consistency Tests', () => {
    test('should consistently exclude system object tools across multiple calls', async () => {
      const tools1 = await client.listTools();
      const tools2 = await client.listTools();
      
      const toolNames1 = tools1.map(tool => tool.name);
      const toolNames2 = tools2.map(tool => tool.name);
      
      assert.ok(!toolNames1.includes('get_system_object_definitions'), 
        'First call should exclude system object tools');
      assert.ok(!toolNames2.includes('get_system_object_definitions'), 
        'Second call should exclude system object tools');
    });

    test('should maintain consistent tool exclusion on second call', async () => {
      const tools = await client.listTools();
      const toolNames = tools.map(tool => tool.name);
      
      assert.ok(!toolNames.includes('get_system_object_definitions'), 
        'Should consistently exclude get_system_object_definitions');
    });

    test('should consistently return configuration error across multiple attempts', async () => {
      const result1 = await client.callTool('get_system_object_definitions', {});
      const result2 = await client.callTool('get_system_object_definitions', {});
      
      assert.equal(result1.isError, true, 'First call should return error');
      assert.equal(result2.isError, true, 'Second call should return error');
      
      const error1 = result1.content[0].text;
      const error2 = result2.content[0].text;
      
        assert.ok(
          error1.includes('Tool not available in current mode') ||
          error1.includes('not available'),
          'First error should mention tool availability',
        );
        assert.ok(
          error2.includes('Tool not available in current mode') ||
          error2.includes('not available'),
          'Second error should mention tool availability',
        );
    });

    test('should have consistent tool count in docs-only mode', async () => {
      const tools1 = await client.listTools();
      const tools2 = await client.listTools();
      
      assert.equal(tools1.length, tools2.length, 
        'Tool count should be consistent between calls');
      
      // Should have around 15 tools in docs-only mode
      assert.ok(tools1.length >= 10, 'Should have reasonable number of tools');
      assert.ok(tools1.length <= 20, 'Should not have excessive tools');
    });
  });



  // ==================================================================================
  // MODE IDENTIFICATION TESTS - FOCUSED ON SYSTEM OBJECT TOOLS
  // ==================================================================================

  describe('System Object Tools Mode Identification', () => {
    test('should clearly identify system object tools unavailability in docs-only mode', async () => {
      const tools = await client.listTools();
      const toolNames = tools.map(tool => tool.name);
      
      const hasSystemObjectTools = toolNames.includes('get_system_object_definitions');
      const hasOtherSystemObjectTools = toolNames.includes('search_site_preferences');
      
      assert.ok(!hasSystemObjectTools, 'Should NOT have get_system_object_definitions tool');
      assert.ok(!hasOtherSystemObjectTools, 'Should NOT have other system object tools');
    });

    test('should exclude all system object tools in docs-only mode', async () => {
      const tools = await client.listTools();
      const toolNames = tools.map(tool => tool.name);
      
      // System object tools that should NOT be available in docs-only mode
      const systemObjectTools = [
        'get_system_object_definitions',
        'get_system_object_definition',
        'search_system_object_attribute_definitions',
        'search_site_preferences',
        'search_system_object_attribute_groups',
        'search_custom_object_attribute_definitions'
      ];
      
      systemObjectTools.forEach(toolName => {
        assert.ok(!toolNames.includes(toolName), 
          `Docs-only mode should NOT include system object tool: ${toolName}`);
      });
    });
  });
});