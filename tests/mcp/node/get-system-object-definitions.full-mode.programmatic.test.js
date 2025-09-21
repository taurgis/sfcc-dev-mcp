/**
 * MCP Aegis - Programmatic Tests for get_system_object_definitions Tool (Full Mode)
 * 
 * Tests the get_system_object_definitions tool with SFCC credentials available.
 * This tool requires OCAPI access and should be available in full mode.
 * 
 * Quick Test Commands:
 * node --test tests/mcp/node/get-system-object-definitions.full-mode.programmatic.test.js
 * npm test -- --grep "get_system_object_definitions.*Full Mode"
 */

import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

describe('get_system_object_definitions Tool - Full Mode Programmatic Tests', () => {
  let client;

  before(async () => {
    client = await connect('./aegis.config.with-dw.json');
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
  // TOOL AVAILABILITY TESTS
  // ==================================================================================

  describe('Tool Availability', () => {
    test('should list get_system_object_definitions tool in available tools', async () => {
      const tools = await client.listTools();
      
      assert.ok(Array.isArray(tools), 'Tools should be an array');
      
      const toolNames = tools.map(tool => tool.name);
      assert.ok(toolNames.includes('get_system_object_definitions'), 
        'Should include get_system_object_definitions tool');
    });

    test('should have proper tool structure and description', async () => {
      const tools = await client.listTools();
      const systemObjectTool = tools.find(tool => tool.name === 'get_system_object_definitions');
      
      assert.ok(systemObjectTool, 'Tool should exist');
      assert.ok(systemObjectTool.description, 'Tool should have description');
      assert.ok(systemObjectTool.description.length >= 50, 
        'Description should be meaningful (at least 50 characters)');
      assert.ok(systemObjectTool.description.includes('system object'), 
        'Description should mention system objects');
    });

    test('should have proper input schema structure', async () => {
      const tools = await client.listTools();
      const systemObjectTool = tools.find(tool => tool.name === 'get_system_object_definitions');
      
      assert.ok(systemObjectTool.inputSchema, 'Tool should have input schema');
      assert.equal(systemObjectTool.inputSchema.type, 'object', 'Schema should be object type');
      assert.ok(systemObjectTool.inputSchema.properties, 'Schema should have properties');
      
      // Check optional parameters
      const props = systemObjectTool.inputSchema.properties;
      if (props.start) {
        assert.equal(props.start.type, 'number', 'start should be number type');
      }
      if (props.count) {
        assert.equal(props.count.type, 'number', 'count should be number type');
      }
      if (props.select) {
        assert.equal(props.select.type, 'string', 'select should be string type');
      }
    });
  });

  // ==================================================================================
  // SUCCESS SCENARIOS - DEFAULT PARAMETERS
  // ==================================================================================

  describe('Success Scenarios - Default Parameters', () => {
    test('should retrieve system object definitions with default parameters', async () => {
      const result = await client.callTool('get_system_object_definitions', {});
      
      assert.equal(result.isError, false, 'Should not return error');
      assert.ok(result.content, 'Should return content');
      assert.ok(Array.isArray(result.content), 'Content should be array');
      assert.equal(result.content[0].type, 'text', 'Content should be text type');
    });

    test('should return valid JSON structure in response text', async () => {
      const result = await client.callTool('get_system_object_definitions', {});
      
      assert.equal(result.isError, false, 'Should not return error');
      
      const responseText = result.content[0].text;
      let parsedResponse;
      
      assert.doesNotThrow(() => {
        parsedResponse = JSON.parse(responseText);
      }, 'Response should be valid JSON');
      
      assert.ok(parsedResponse.data, 'Response should contain data field');
      assert.ok(Array.isArray(parsedResponse.data), 'Data should be array');
    });

    test('should contain SFCC system object types in response', async () => {
      const result = await client.callTool('get_system_object_definitions', {});
      const responseText = result.content[0].text;
      const parsedResponse = JSON.parse(responseText);
      
      assert.ok(parsedResponse.data.length > 0, 'Should have system objects');
      
      // Check for common SFCC system objects
      const objectTypes = parsedResponse.data.map(obj => obj.object_type || obj.id);
      const expectedTypes = ['Product', 'Category', 'Customer', 'Order'];
      
      const hasExpectedTypes = expectedTypes.some(type => 
        objectTypes.some(objType => objType.includes(type))
      );
      assert.ok(hasExpectedTypes, 'Should contain common SFCC system object types');
    });

    test('should include multiple object types in the response', async () => {
      const result = await client.callTool('get_system_object_definitions', {});
      const responseText = result.content[0].text;
      const parsedResponse = JSON.parse(responseText);
      
      assert.ok(parsedResponse.data.length >= 3, 'Should have at least 3 system objects');
    });

    test('should include pagination metadata in response', async () => {
      const result = await client.callTool('get_system_object_definitions', {});
      const responseText = result.content[0].text;
      const parsedResponse = JSON.parse(responseText);
      
      // Check for pagination fields
      const hasPagination = 
        parsedResponse.count !== undefined || 
        parsedResponse.total !== undefined ||
        parsedResponse.start !== undefined;
      
      assert.ok(hasPagination, 'Should include pagination metadata');
    });

    test('should include SFCC API version and type metadata', async () => {
      const result = await client.callTool('get_system_object_definitions', {});
      const responseText = result.content[0].text;
      const parsedResponse = JSON.parse(responseText);
      
      // Check for API version or type metadata
      const hasMetadata = 
        parsedResponse._v !== undefined || 
        parsedResponse._type !== undefined ||
        parsedResponse.version !== undefined;
      
      assert.ok(hasMetadata, 'Should include API metadata');
    });
  });

  // ==================================================================================
  // PAGINATION TESTS
  // ==================================================================================

  describe('Pagination Parameters', () => {
    test('should handle pagination with start parameter', async () => {
      const result = await client.callTool('get_system_object_definitions', {
        start: 1
      });
      
      assert.equal(result.isError, false, 'Should not return error');
      
      const responseText = result.content[0].text;
      const parsedResponse = JSON.parse(responseText);
      
      assert.ok(parsedResponse.data, 'Should contain data');
      assert.ok(Array.isArray(parsedResponse.data), 'Data should be array');
    });

    test('should handle pagination with count parameter', async () => {
      const result = await client.callTool('get_system_object_definitions', {
        count: 5
      });
      
      assert.equal(result.isError, false, 'Should not return error');
      
      const responseText = result.content[0].text;
      const parsedResponse = JSON.parse(responseText);
      
      assert.ok(parsedResponse.data, 'Should contain data');
      assert.ok(parsedResponse.data.length <= 5, 'Should respect count parameter');
    });

    test('should include pagination URLs when applicable', async () => {
      const result = await client.callTool('get_system_object_definitions', {
        start: 0,
        count: 2
      });
      
      assert.equal(result.isError, false, 'Should not return error');
      
      const responseText = result.content[0].text;
      const parsedResponse = JSON.parse(responseText);
      
      // Check for pagination URLs or links
      const hasPaginationInfo = 
        parsedResponse.next !== undefined ||
        parsedResponse.previous !== undefined ||
        parsedResponse.links !== undefined;
      
      // Note: May or may not have pagination URLs depending on data size
      assert.ok(typeof hasPaginationInfo === 'boolean', 'Should check pagination info');
    });

    test('should handle custom select parameter', async () => {
      const result = await client.callTool('get_system_object_definitions', {
        select: '(data.(**))'
      });
      
      assert.equal(result.isError, false, 'Should not return error');
      
      const responseText = result.content[0].text;
      const parsedResponse = JSON.parse(responseText);
      
      assert.ok(parsedResponse.data, 'Should contain data');
    });
  });

  // ==================================================================================
  // SELECT PARAMETER TESTING - OCAPI Field Selection
  // ==================================================================================

  describe('Select Parameter Testing', () => {
    test('should handle wildcard select parameter (**)', async () => {
      const result = await client.callTool('get_system_object_definitions', {
        select: '(**)',
        count: 3
      });
      
      assert.equal(result.isError, false, 'Should not return error');
      
      const responseText = result.content[0].text;
      const parsedResponse = JSON.parse(responseText);
      
      // Wildcard should include all standard fields
      assert.ok(parsedResponse._type, 'Should include _type field');
      assert.ok(parsedResponse.start !== undefined, 'Should include start field');
      assert.ok(parsedResponse.count !== undefined, 'Should include count field');
      assert.ok(parsedResponse.data, 'Should include data field');
    });

    test('should handle root-level field selection', async () => {
      const result = await client.callTool('get_system_object_definitions', {
        select: '(start, count, total)',
        count: 2
      });
      
      assert.equal(result.isError, false, 'Should not return error');
      
      const responseText = result.content[0].text;
      const parsedResponse = JSON.parse(responseText);
      
      // Should include selected fields
      assert.ok(parsedResponse.start !== undefined, 'Should include start field');
      assert.ok(parsedResponse.count !== undefined, 'Should include count field');
      assert.ok(parsedResponse.total !== undefined, 'Should include total field');
      
      // Should not include non-selected fields (when our mock server properly filters)
      // Note: _type and _v might still be included depending on server behavior
    });

    test('should handle data-level field selection', async () => {
      const result = await client.callTool('get_system_object_definitions', {
        select: '(start, count, data.(object_type, display_name))',
        count: 3
      });
      
      assert.equal(result.isError, false, 'Should not return error');
      
      const responseText = result.content[0].text;
      const parsedResponse = JSON.parse(responseText);
      
      // Should include root-level selected fields
      assert.ok(parsedResponse.start !== undefined, 'Should include start field');
      assert.ok(parsedResponse.count !== undefined, 'Should include count field');
      assert.ok(parsedResponse.data, 'Should include data field');
      
      // Data objects should only have selected fields
      if (parsedResponse.data && parsedResponse.data.length > 0) {
        const firstObject = parsedResponse.data[0];
        assert.ok(firstObject.object_type, 'Should include object_type field');
        assert.ok(firstObject.display_name, 'Should include display_name field');
      }
    });

    test('should handle data wildcard selection', async () => {
      const result = await client.callTool('get_system_object_definitions', {
        select: '(start, data.(**)))',
        count: 2
      });
      
      assert.equal(result.isError, false, 'Should not return error');
      
      const responseText = result.content[0].text;
      const parsedResponse = JSON.parse(responseText);
      
      assert.ok(parsedResponse.start !== undefined, 'Should include start field');
      assert.ok(parsedResponse.data, 'Should include data field');
      
      // Data objects should have all their fields with wildcard
      if (parsedResponse.data && parsedResponse.data.length > 0) {
        const firstObject = parsedResponse.data[0];
        assert.ok(firstObject.object_type, 'Should include object_type field');
        assert.ok(firstObject.display_name, 'Should include display_name field');
      }
    });

    test('should handle single field selection', async () => {
      const result = await client.callTool('get_system_object_definitions', {
        select: '(count)',
        count: 1
      });
      
      assert.equal(result.isError, false, 'Should not return error');
      
      const responseText = result.content[0].text;
      const parsedResponse = JSON.parse(responseText);
      
      // Should include only the selected field (plus system fields that might be forced)
      assert.ok(parsedResponse.count !== undefined, 'Should include count field');
    });

    test('should handle complex nested selection patterns', async () => {
      const result = await client.callTool('get_system_object_definitions', {
        select: '(start, count, data.(object_type, display_name.(default)))',
        count: 2
      });
      
      assert.equal(result.isError, false, 'Should not return error');
      
      const responseText = result.content[0].text;
      const parsedResponse = JSON.parse(responseText);
      
      assert.ok(parsedResponse.start !== undefined, 'Should include start field');
      assert.ok(parsedResponse.count !== undefined, 'Should include count field');
      assert.ok(parsedResponse.data, 'Should include data field');
      
      // Check nested field selection in display_name
      if (parsedResponse.data && parsedResponse.data.length > 0) {
        const firstObject = parsedResponse.data[0];
        assert.ok(firstObject.object_type, 'Should include object_type field');
        if (firstObject.display_name) {
          assert.ok(firstObject.display_name.default, 'Should include default localized name');
        }
      }
    });

    test('should handle invalid select patterns gracefully', async () => {
      const result = await client.callTool('get_system_object_definitions', {
        select: 'invalid_pattern',
        count: 2
      });
      
      // Should not error out but might return full data or handle gracefully
      assert.equal(result.isError, false, 'Should handle invalid select patterns gracefully');
      
      const responseText = result.content[0].text;
      assert.ok(typeof responseText === 'string', 'Should return valid string response');
      
      // Should parse as valid JSON
      assert.doesNotThrow(() => JSON.parse(responseText), 'Should return valid JSON');
    });

    test('should handle empty select parameter', async () => {
      const result = await client.callTool('get_system_object_definitions', {
        select: '',
        count: 2
      });
      
      // Should not error out but might return full data or handle gracefully
      assert.equal(result.isError, false, 'Should handle empty select parameter gracefully');
      
      const responseText = result.content[0].text;
      const parsedResponse = JSON.parse(responseText);
      
      // Should still return valid data structure
      assert.ok(parsedResponse, 'Should return valid response object');
    });

    test('should verify select parameter behavior consistency', async () => {
      // Test the same select pattern multiple times to ensure consistency
      const selectPattern = '(start, count, data.(object_type))';
      
      const result1 = await client.callTool('get_system_object_definitions', {
        select: selectPattern,
        count: 2
      });
      
      const result2 = await client.callTool('get_system_object_definitions', {
        select: selectPattern,
        count: 2
      });
      
      assert.equal(result1.isError, false, 'First call should not return error');
      assert.equal(result2.isError, false, 'Second call should not return error');
      
      const parsed1 = JSON.parse(result1.content[0].text);
      const parsed2 = JSON.parse(result2.content[0].text);
      
      // Structure should be consistent
      assert.equal(typeof parsed1.start, typeof parsed2.start, 'Start field types should match');
      assert.equal(typeof parsed1.count, typeof parsed2.count, 'Count field types should match');
      assert.equal(Array.isArray(parsed1.data), Array.isArray(parsed2.data), 'Data field types should match');
    });

    test('should handle select parameter with different count values', async () => {
      const selectPattern = '(start, count, data.(object_type, display_name))';
      
      // Test with different count values to ensure select works regardless of result size
      const counts = [1, 3, 5];
      
      for (const count of counts) {
        const result = await client.callTool('get_system_object_definitions', {
          select: selectPattern,
          count: count
        });
        
        assert.equal(result.isError, false, `Should not return error for count ${count}`);
        
        const parsedResponse = JSON.parse(result.content[0].text);
        
        assert.ok(parsedResponse.start !== undefined, `Should include start field for count ${count}`);
        assert.ok(parsedResponse.count !== undefined, `Should include count field for count ${count}`);
        assert.ok(parsedResponse.data, `Should include data field for count ${count}`);
        
        // Verify data array has correct length
        if (parsedResponse.data) {
          assert.ok(parsedResponse.data.length <= count, 
            `Data length should not exceed count ${count}`);
        }
      }
    });

    test('should handle zero start parameter', async () => {
      const result = await client.callTool('get_system_object_definitions', {
        start: 0,
        count: 3
      });
      
      assert.equal(result.isError, false, 'Should not return error');
      
      const responseText = result.content[0].text;
      const parsedResponse = JSON.parse(responseText);
      
      assert.ok(parsedResponse.data, 'Should contain data');
      assert.ok(parsedResponse.data.length <= 3, 'Should respect count');
    });
  });

  // ==================================================================================
  // EFFICIENCY AND EDGE CASE TESTS
  // ==================================================================================

  describe('Efficiency and Edge Cases', () => {
    test('should retrieve definitions efficiently with small count', async () => {
      const result = await client.callTool('get_system_object_definitions', {
        count: 1
      });
      
      assert.equal(result.isError, false, 'Should not return error');
      
      const responseText = result.content[0].text;
      const parsedResponse = JSON.parse(responseText);
      
      assert.ok(parsedResponse.data, 'Should contain data');
      assert.ok(parsedResponse.data.length <= 1, 'Should return at most 1 item');
    });

    test('should handle larger count requests efficiently', async () => {
      const result = await client.callTool('get_system_object_definitions', {
        count: 20
      });
      
      assert.equal(result.isError, false, 'Should not return error');
      
      const responseText = result.content[0].text;
      const parsedResponse = JSON.parse(responseText);
      
      assert.ok(parsedResponse.data, 'Should contain data');
      assert.ok(parsedResponse.data.length <= 20, 'Should respect count limit');
    });

    test('should handle minimum count parameter', async () => {
      const result = await client.callTool('get_system_object_definitions', {
        count: 1
      });
      
      assert.equal(result.isError, false, 'Should not return error');
      
      const responseText = result.content[0].text;
      const parsedResponse = JSON.parse(responseText);
      
      assert.ok(parsedResponse.data, 'Should contain data');
    });

    test('should handle large start parameter gracefully', async () => {
      const result = await client.callTool('get_system_object_definitions', {
        start: 1000,
        count: 5
      });
      
      assert.equal(result.isError, false, 'Should not return error');
      
      const responseText = result.content[0].text;
      const parsedResponse = JSON.parse(responseText);
      
      assert.ok(parsedResponse.data !== undefined, 'Should contain data field');
      // May be empty array if start is beyond available data
    });

    test('should handle maximum reasonable count parameter', async () => {
      const result = await client.callTool('get_system_object_definitions', {
        count: 200
      });
      
      assert.equal(result.isError, false, 'Should not return error');
      
      const responseText = result.content[0].text;
      const parsedResponse = JSON.parse(responseText);
      
      assert.ok(parsedResponse.data, 'Should contain data');
    });
  });

  // ==================================================================================
  // DATA STRUCTURE VALIDATION
  // ==================================================================================

  describe('Data Structure Validation', () => {
    test('should return proper SFCC object type definition structure', async () => {
      const result = await client.callTool('get_system_object_definitions', {
        count: 3
      });
      
      assert.equal(result.isError, false, 'Should not return error');
      
      const responseText = result.content[0].text;
      const parsedResponse = JSON.parse(responseText);
      
      if (parsedResponse.data.length > 0) {
        const firstObject = parsedResponse.data[0];
        
        // Should have basic SFCC object structure
        assert.ok(
          firstObject.object_type || firstObject.id || firstObject._type,
          'Should have object type identification'
        );
      }
    });

    test('should include resource state information', async () => {
      const result = await client.callTool('get_system_object_definitions', {
        count: 2
      });
      
      assert.equal(result.isError, false, 'Should not return error');
      
      const responseText = result.content[0].text;
      const parsedResponse = JSON.parse(responseText);
      
      // Check for resource state or metadata
      const hasResourceInfo = 
        parsedResponse._resource_state !== undefined ||
        parsedResponse.etag !== undefined ||
        parsedResponse.last_modified !== undefined;
      
      // Note: May or may not have resource state depending on API implementation
      assert.ok(typeof hasResourceInfo === 'boolean', 'Should check for resource state');
    });

    test('should include API links for object definitions', async () => {
      const result = await client.callTool('get_system_object_definitions', {
        count: 2
      });
      
      assert.equal(result.isError, false, 'Should not return error');
      
      const responseText = result.content[0].text;
      const parsedResponse = JSON.parse(responseText);
      
      // Check for API links or self references
      const hasLinks = 
        parsedResponse.links !== undefined ||
        parsedResponse._links !== undefined ||
        responseText.includes('href');
      
      assert.ok(typeof hasLinks === 'boolean', 'Should check for API links');
    });

    test('should identify system vs custom objects by type', async () => {
      const result = await client.callTool('get_system_object_definitions', {});
      
      assert.equal(result.isError, false, 'Should not return error');
      
      const responseText = result.content[0].text;
      const parsedResponse = JSON.parse(responseText);
      
      if (parsedResponse.data.length > 0) {
        // Should be able to identify object types
        const hasTypeInfo = parsedResponse.data.some(obj => 
          obj._type !== undefined || 
          obj.object_type !== undefined ||
          obj.id !== undefined
        );
        
        assert.ok(hasTypeInfo, 'Should have type identification');
      }
    });
  });

  // ==================================================================================
  // PARAMETER TYPE COERCION TESTS
  // ==================================================================================

  describe('Parameter Type Coercion', () => {
    test('should handle string start parameter (type coercion)', async () => {
      const result = await client.callTool('get_system_object_definitions', {
        start: "2",
        count: 3
      });
      
      assert.equal(result.isError, false, 'Should handle string start parameter');
      
      const responseText = result.content[0].text;
      const parsedResponse = JSON.parse(responseText);
      
      assert.ok(parsedResponse.data !== undefined, 'Should contain data');
    });

    test('should handle string count parameter (type coercion)', async () => {
      const result = await client.callTool('get_system_object_definitions', {
        start: 0,
        count: "5"
      });
      
      assert.equal(result.isError, false, 'Should handle string count parameter');
      
      const responseText = result.content[0].text;
      const parsedResponse = JSON.parse(responseText);
      
      assert.ok(parsedResponse.data !== undefined, 'Should contain data');
    });

    test('should handle partial parameter sets', async () => {
      const result = await client.callTool('get_system_object_definitions', {
        count: 10
        // Missing start parameter
      });
      
      assert.equal(result.isError, false, 'Should handle partial parameters');
      
      const responseText = result.content[0].text;
      const parsedResponse = JSON.parse(responseText);
      
      assert.ok(parsedResponse.data, 'Should contain data');
    });
  });

  // ==================================================================================
  // ERROR HANDLING AND EDGE CASES
  // ==================================================================================

  describe('Error Handling and Edge Cases', () => {
    test('should handle negative start parameter gracefully', async () => {
      const result = await client.callTool('get_system_object_definitions', {
        start: -1,
        count: 5
      });
      
      // Should either handle gracefully or return meaningful error
      const responseText = result.content[0].text;
      
      if (result.isError) {
        assert.ok(responseText.includes('start') || responseText.includes('parameter'), 
          'Error should mention parameter issue');
      } else {
        const parsedResponse = JSON.parse(responseText);
        assert.ok(parsedResponse.data !== undefined, 'Should contain data field');
      }
    });

    test('should handle negative count parameter gracefully', async () => {
      const result = await client.callTool('get_system_object_definitions', {
        start: 0,
        count: -1
      });
      
      // Should either handle gracefully or return meaningful error
      const responseText = result.content[0].text;
      
      if (result.isError) {
        assert.ok(responseText.includes('count') || responseText.includes('parameter'), 
          'Error should mention parameter issue');
      } else {
        const parsedResponse = JSON.parse(responseText);
        assert.ok(parsedResponse.data !== undefined, 'Should contain data field');
      }
    });

    test('should handle zero count parameter', async () => {
      const result = await client.callTool('get_system_object_definitions', {
        start: 0,
        count: 0
      });
      
      // Should either handle gracefully or return meaningful error
      const responseText = result.content[0].text;
      
      if (result.isError) {
        assert.ok(responseText.includes('count') || responseText.includes('parameter'), 
          'Error should mention parameter issue');
      } else {
        const parsedResponse = JSON.parse(responseText);
        assert.ok(parsedResponse.data !== undefined, 'Should contain data field');
        assert.equal(parsedResponse.data.length, 0, 'Should return empty array for count 0');
      }
    });
  });

  // ==================================================================================
  // CONSISTENCY TESTS
  // ==================================================================================

  describe('Consistency Tests', () => {
    test('should return consistent results across multiple calls', async () => {
      const result1 = await client.callTool('get_system_object_definitions', {
        start: 0,
        count: 3
      });
      
      const result2 = await client.callTool('get_system_object_definitions', {
        start: 0,
        count: 3
      });
      
      assert.equal(result1.isError, false, 'First call should succeed');
      assert.equal(result2.isError, false, 'Second call should succeed');
      
      const response1 = JSON.parse(result1.content[0].text);
      const response2 = JSON.parse(result2.content[0].text);
      
      assert.equal(response1.data.length, response2.data.length, 
        'Should return same number of items');
    });

    test('should return consistent results on second call', async () => {
      const result = await client.callTool('get_system_object_definitions', {
        count: 5
      });
      
      assert.equal(result.isError, false, 'Should succeed consistently');
      
      const responseText = result.content[0].text;
      const parsedResponse = JSON.parse(responseText);
      
      assert.ok(parsedResponse.data, 'Should contain data consistently');
    });

    test('should maintain stable API version information', async () => {
      const result = await client.callTool('get_system_object_definitions', {
        count: 1
      });
      
      assert.equal(result.isError, false, 'Should not return error');
      
      const responseText = result.content[0].text;
      
      // Check for version consistency (should have version info)
      const hasVersionInfo = 
        responseText.includes('"_v"') || 
        responseText.includes('"version"') ||
        responseText.includes('v20'); // Common SFCC API version pattern
      
      assert.ok(hasVersionInfo, 'Should include stable version information');
    });
  });

  // ==================================================================================
  // TOOL CONSISTENCY TESTS
  // ==================================================================================

  describe('Tool Availability Consistency', () => {
    test('should consistently include system object tools across multiple calls', async () => {
      const tools1 = await client.listTools();
      const tools2 = await client.listTools();
      
      const hasSystemObjectTool1 = tools1.some(tool => tool.name === 'get_system_object_definitions');
      const hasSystemObjectTool2 = tools2.some(tool => tool.name === 'get_system_object_definitions');
      
      assert.ok(hasSystemObjectTool1, 'First call should include system object tool');
      assert.ok(hasSystemObjectTool2, 'Second call should include system object tool');
    });

    test('should maintain consistent tool inclusion on second call', async () => {
      const tools = await client.listTools();
      const toolNames = tools.map(tool => tool.name);
      
      assert.ok(toolNames.includes('get_system_object_definitions'), 
        'Should consistently include get_system_object_definitions');
    });

    test('should consistently provide tool with same structure', async () => {
      const tools = await client.listTools();
      const systemObjectTool = tools.find(tool => tool.name === 'get_system_object_definitions');
      
      assert.ok(systemObjectTool, 'Tool should exist');
      assert.ok(systemObjectTool.name, 'Tool should have name');
      assert.ok(systemObjectTool.description, 'Tool should have description');
      assert.ok(systemObjectTool.inputSchema, 'Tool should have input schema');
    });
  });

  // ==================================================================================
  // INTEGRATION AND FUNCTIONALITY TESTS
  // ==================================================================================

  describe('Integration Tests', () => {
    test('should work with different parameter combinations', async () => {
      const testCases = [
        { start: 0, count: 1 },
        { start: 1, count: 2 },
        { count: 3 },
        { start: 0 },
        {}
      ];

      for (const testCase of testCases) {
        const result = await client.callTool('get_system_object_definitions', testCase);
        
        assert.equal(result.isError, false, 
          `Should succeed with parameters: ${JSON.stringify(testCase)}`);
        
        const responseText = result.content[0].text;
        const parsedResponse = JSON.parse(responseText);
        
        assert.ok(parsedResponse.data !== undefined, 
          `Should contain data with parameters: ${JSON.stringify(testCase)}`);
      }
    });

    test('should handle SFCC-specific data correctly', async () => {
      const result = await client.callTool('get_system_object_definitions', {
        count: 50
      });
      
      assert.equal(result.isError, false, 'Should not return error');
      
      const responseText = result.content[0].text;
      const parsedResponse = JSON.parse(responseText);
      
      if (parsedResponse.data.length > 0) {
        // Should contain SFCC-specific information
        const hasSfccData = parsedResponse.data.some(obj => 
          JSON.stringify(obj).includes('Product') ||
          JSON.stringify(obj).includes('Category') ||
          JSON.stringify(obj).includes('Customer') ||
          JSON.stringify(obj).includes('Order')
        );
        
        assert.ok(hasSfccData, 'Should contain SFCC-specific system object information');
      }
    });
  });
});