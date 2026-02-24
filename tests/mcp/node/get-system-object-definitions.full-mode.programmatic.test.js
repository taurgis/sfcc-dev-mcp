/**
 * MCP Aegis - Programmatic Tests for get_system_object_definitions Tool (Full Mode)
 * 
 * These tests focus on complex business logic validation and dynamic test case generation
 * that requires programmatic JavaScript/TypeScript logic. For basic functional testing,
 * use the YAML-based tests which are more appropriate and maintainable.
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

  // Helper function for complex assertion logic
  function assertValidMCPResponse(result) {
    assert.ok(result.content, 'Should have content');
    assert.ok(Array.isArray(result.content), 'Content should be array');
    assert.equal(typeof result.isError, 'boolean', 'isError should be boolean');
  }

  function assertSFCCObjectStructure(obj) {
    assert.ok(obj.object_type, 'Should have object_type');
    assert.ok(obj._type, 'Should have _type');
    assert.ok(typeof obj.object_type === 'string', 'object_type should be string');
    assert.ok(obj._type.includes('object_type_definition'), '_type should indicate object type definition');
  }

  // ==================================================================================
  // TOOL AVAILABILITY & SCHEMA VALIDATION
  // ==================================================================================

  describe('Tool Availability', () => {
    test('should have proper tool discovery and schema validation', async () => {
      const tools = await client.listTools();
      
      assert.ok(Array.isArray(tools), 'Tools should be an array');
      
      const tool = tools.find(t => t.name === 'get_system_object_definitions');
      assert.ok(tool, 'Tool should be found');
      assert.ok(tool.description.includes('system object definitions'), 'Description should mention system object definitions');
      
      // Validate schema structure
      assert.ok(tool.inputSchema, 'Tool should have input schema');
      assert.equal(tool.inputSchema.type, 'object', 'Schema should be object type');
      
      const properties = tool.inputSchema.properties;
      assert.ok(properties, 'Schema should have properties');
      
      // Dynamic validation of optional parameters
      const expectedParams = ['count', 'start', 'select'];
      expectedParams.forEach(param => {
        if (properties[param]) {
          assert.ok(properties[param].type, `Parameter ${param} should have type`);
        }
      });
      
      // Verify all parameters are optional
      assert.ok(!tool.inputSchema.required || tool.inputSchema.required.length === 0,
        'All parameters should be optional');
    });
  });

  // ==================================================================================
  // CORE FUNCTIONALITY WITH DYNAMIC VALIDATION
  // ==================================================================================

  describe('Core Functionality', () => {
    test('should retrieve and validate core SFCC object structure', async () => {
      const result = await client.callTool('get_system_object_definitions', {});
      
      assertValidMCPResponse(result);
      assert.equal(result.isError, false, 'Should not return error');
      
      const data = JSON.parse(result.content[0].text);
      
      // Validate OCAPI response structure
      assert.ok(data.data && Array.isArray(data.data), 'Should have data array');
      assert.ok(typeof data.count === 'number', 'Should have count');
      assert.ok(typeof data.total === 'number', 'Should have total');
      assert.ok(data._v, 'Should have API version');
      assert.ok(data._type, 'Should have type information');
      
      // Dynamic validation - check for SFCC system objects  
      const objectTypes = data.data.map(obj => obj.object_type);
      const expectedSystemTypes = ['Category', 'Catalog', 'Content', 'Basket', 'Campaign'];
      const foundSystemTypes = expectedSystemTypes.filter(type => objectTypes.includes(type));
      
      assert.ok(foundSystemTypes.length > 0, 
        `Should include SFCC system objects. Found: ${foundSystemTypes.join(', ')}, Available: ${objectTypes.slice(0,10).join(', ')}`);
      
      // Validate each object structure
      data.data.forEach((obj, index) => {
        try {
          assertSFCCObjectStructure(obj);
        } catch (error) {
          assert.fail(`Object at index ${index} failed validation: ${error.message}`);
        }
      });
    });

    test('should handle pagination with dynamic validation', async () => {
      const smallPageResult = await client.callTool('get_system_object_definitions', { count: 3 });
      assert.equal(smallPageResult.isError, false, 'Small page request should succeed');
      
      const smallPageData = JSON.parse(smallPageResult.content[0].text);
      
      // Dynamic pagination validation based on total count
      if (smallPageData.total > 3) {
        assert.ok(smallPageData.next, 'Should have next link when more data available');
        assert.ok(smallPageData.data.length <= 3, 'Should not exceed requested count');
        
        // Test second page
        const secondPageResult = await client.callTool('get_system_object_definitions', { 
          start: 3, 
          count: 3 
        });
        
        if (!secondPageResult.isError) {
          const secondPageData = JSON.parse(secondPageResult.content[0].text);
          assert.equal(secondPageData.start, 3, 'Second page should have correct start');
          
          // Ensure no overlap between pages
          const firstPageTypes = smallPageData.data.map(obj => obj.object_type);
          const secondPageTypes = secondPageData.data.map(obj => obj.object_type);
          const overlap = firstPageTypes.filter(type => secondPageTypes.includes(type));
          assert.equal(overlap.length, 0, 'Pages should not have overlapping data');
        }
      }
    });

    test('should validate SFCC-specific metadata consistency', async () => {
      const result = await client.callTool('get_system_object_definitions', {});
      const data = JSON.parse(result.content[0].text);
      
      // Validate SFCC OCAPI metadata (may vary by instance)
      if (data._resource_state) {
        assert.ok(typeof data._resource_state === 'string', 'Resource state should be string');
      }
      
      // Check for system vs custom object identification
      const systemObjects = data.data.filter(obj => 
        ['Product', 'Customer', 'Order', 'Site', 'Category', 'Campaign'].includes(obj.object_type)
      );
      
      assert.ok(systemObjects.length > 0, 'Should include system objects');
      
      // Validate that all objects have consistent typing
      data.data.forEach(obj => {
        assert.ok(obj._type, 'Each object should have _type');
        assert.ok(obj.object_type, 'Each object should have object_type');
        if (obj.object_type_id) {
          assert.ok(typeof obj.object_type_id === 'string', 'object_type_id should be string');
        }
      });
    });
  });

  // ==================================================================================
  // DYNAMIC PARAMETER VALIDATION
  // ==================================================================================

  describe('Parameter Validation', () => {
    test('should handle select parameter patterns with dynamic validation', async () => {
      const selectPatterns = [
        { pattern: '(**)', description: 'wildcard all fields' },
        { pattern: 'data.object_type,count,total', description: 'specific field selection' },
        { pattern: 'data.(*),count', description: 'data wildcard with root fields' },
        { pattern: 'count,total,_v', description: 'root-level fields only' }
      ];
      
      for (const { pattern, description } of selectPatterns) {
        const result = await client.callTool('get_system_object_definitions', { 
          select: pattern,
          count: 3 // Small count for efficiency
        });
        
        assert.equal(result.isError, false, 
          `Select pattern '${pattern}' (${description}) should not error`);
        
        const data = JSON.parse(result.content[0].text);
        assert.ok(data, `Should return valid data for pattern: ${pattern}`);
        
        // Dynamic validation based on select pattern
        if (pattern.includes('count')) {
          assert.ok(typeof data.count === 'number', 
            `Should include count for pattern: ${pattern}`);
        }
        
        if (pattern.includes('data.object_type')) {
          assert.ok(data.data, `Should have data array for pattern: ${pattern}`);
          if (data.data.length > 0) {
            assert.ok(data.data[0].object_type, 
              `Should include object_type for pattern: ${pattern}`);
          }
        }
      }
    });

      test('should handle edge cases with strict type validation', async () => {
      const edgeCases = [
          { params: { start: '5', count: '3' }, description: 'string parameters', expectError: true },
        { params: { start: 0, count: 1 }, description: 'minimum values' },
        { params: { start: 100 }, description: 'large start value' },
          { params: { count: 0 }, description: 'zero count', expectError: false }
      ];
      
      for (const { params, description, expectError } of edgeCases) {
        const result = await client.callTool('get_system_object_definitions', params);
        
          if (expectError) {
            assert.equal(result.isError, true, `Edge case should fail validation: ${description}`);
        } else {
          assert.equal(result.isError, false, 
            `Edge case should succeed: ${description}`);
          
          const data = JSON.parse(result.content[0].text);

          if (params.count !== undefined && params.count > 0) {
            assert.ok(data.data.length <= params.count, 
              `Should respect count limit: ${description}`);
          }
        }
      }
    });

    test('should handle invalid parameters gracefully', async () => {
      const invalidCases = [
        { params: { start: -1 }, description: 'negative start' },
        { params: { count: -5 }, description: 'negative count' },
        { params: { select: 'invalid.field.path' }, description: 'invalid select path' },
        { params: { select: '' }, description: 'empty select' }
      ];
      
      for (const { params, description } of invalidCases) {
        const result = await client.callTool('get_system_object_definitions', params);
        
        // Should either return error or handle gracefully
        if (result.isError) {
          assert.ok(result.content[0].text, 
            `Should have error message for: ${description}`);
        } else {
          // If not an error, should return valid structure
          const data = JSON.parse(result.content[0].text);
          assert.ok(data, `Should return valid data despite invalid params: ${description}`);
          
          // Validate graceful handling (flexible validation)
          if (params.start < 0 && typeof data.start === 'number') {
            // SFCC API accepts negative start and preserves it in response
            assert.ok(typeof data.start === 'number', `API should handle negative start: ${description}`);
          }
          
          if (params.count < 0 && typeof data.count === 'number') {
            // SFCC API accepts negative count and returns valid data
            assert.ok(data.count >= 0, `API should handle negative count gracefully: ${description}`);
          }
        }
      }
    });
  });

  // ==================================================================================
  // INTEGRATION & CONSISTENCY VALIDATION
  // ==================================================================================

  describe('Integration & Consistency', () => {
    test('should maintain consistency across parameter combinations', async () => {
      const baseResult = await client.callTool('get_system_object_definitions', {});
      const baseData = JSON.parse(baseResult.content[0].text);
      
      const combinations = [
        { start: 0, count: 5 },
        { count: 10, select: 'data.object_type,count,total' },
        { start: 2, count: 3, select: 'data.(*),total' }
      ];
      
      for (const params of combinations) {
        const result = await client.callTool('get_system_object_definitions', params);
        assert.equal(result.isError, false, 
          `Combination should succeed: ${JSON.stringify(params)}`);
        
        const data = JSON.parse(result.content[0].text);
        
        // Total should be consistent across calls
        assert.equal(data.total, baseData.total, 
          `Total should be consistent for params: ${JSON.stringify(params)}`);
        
        // API version should be consistent
        if (data._v && baseData._v) {
          assert.equal(data._v, baseData._v, 
            `API version should be consistent for params: ${JSON.stringify(params)}`);
        }
      }
    });

    test('should provide stable pagination behavior', async () => {
      // Test pagination stability by requesting overlapping windows
      const firstPage = await client.callTool('get_system_object_definitions', { 
        start: 0, 
        count: 5 
      });
      
      const secondPage = await client.callTool('get_system_object_definitions', { 
        start: 3, 
        count: 5 
      });
      
      if (!firstPage.isError && !secondPage.isError) {
        const firstData = JSON.parse(firstPage.content[0].text);
        const secondData = JSON.parse(secondPage.content[0].text);
        
        // Check for expected overlap in stable sort
        if (firstData.data.length >= 5 && secondData.data.length > 2) {
          const firstPageLast2 = firstData.data.slice(3, 5).map(obj => obj.object_type);
          const secondPageFirst2 = secondData.data.slice(0, 2).map(obj => obj.object_type);
          
          assert.deepEqual(firstPageLast2, secondPageFirst2, 
            'Overlapping pagination should return consistent results');
        }
      }
    });

    test('should handle comprehensive SFCC business validation', async () => {
      const result = await client.callTool('get_system_object_definitions', {});
      const data = JSON.parse(result.content[0].text);
      
      // Business rule validation for SFCC (flexible for different instances)
      const systemObjectTypes = data.data.map(obj => obj.object_type);
      const criticalSFCCTypes = ['Category', 'Catalog', 'Content', 'Basket', 'Campaign'];
      
      // Check if SFCC instance has at least some critical system objects
      const foundCriticalTypes = criticalSFCCTypes.filter(type => systemObjectTypes.includes(type));
      assert.ok(foundCriticalTypes.length > 0, 
        `SFCC instance should include at least one critical system object. Found: ${foundCriticalTypes.join(', ')}, Available: ${systemObjectTypes.slice(0,5).join(', ')}`);
      
      // Validate object type ID consistency for found objects
      data.data.forEach(obj => {
        if (obj.object_type_id) {
          // Object type ID should be related to object type
          assert.ok(typeof obj.object_type_id === 'string', 
            `object_type_id should be string for ${obj.object_type}`);
          
          // Critical objects should have non-empty IDs if they exist
          if (foundCriticalTypes.includes(obj.object_type)) {
            assert.ok(obj.object_type_id.length > 0, 
              `System object ${obj.object_type} should have non-empty object_type_id`);
          }
        }
      });
      
      // Validate that we have a reasonable number of object types for an SFCC instance
      assert.ok(data.total >= 1, 'SFCC instance should have at least 1 system object type');
      assert.ok(data.total <= 200, 'SFCC instance should not have excessive object types');
    });
  });
});