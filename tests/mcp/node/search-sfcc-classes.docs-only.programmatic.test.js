/**
 * Programmatic tests for search_sfcc_classes tool
 * 
 * These tests provide advanced verification capabilities beyond YAML pattern matching,
 * including dynamic validation, error categorization and
 * comprehensive response structure analysis.
 * 
 * Response format discovered via conductor query:
 * - Success: { content: [{ type: "text", text: "["class1", "class2", ...]" }] }
 * - Empty: { content: [{ type: "text", text: "[]" }] }
 * - Error: { content: [{ type: "text", text: "Error: ..." }], isError: true }
 */

import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-conductor';

describe('search_sfcc_classes Programmatic Tests', () => {
  let client;

  before(async () => {
    client = await connect('./conductor.config.docs-only.json');
  });

  after(async () => {
    if (client?.connected) {
      await client.disconnect();
    }
  });

  beforeEach(() => {
    // CRITICAL: Clear all buffers to prevent test interference
    client.clearAllBuffers(); // Recommended - comprehensive protection
  });

  describe('Protocol Compliance', () => {
    test('should be properly connected to MCP server', async () => {
      assert.ok(client.connected, 'Client should be connected');
    });

    test('should have search_sfcc_classes tool available', async () => {
      const tools = await client.listTools();
      const searchTool = tools.find(tool => tool.name === 'search_sfcc_classes');
      
      assert.ok(searchTool, 'search_sfcc_classes tool should be available');
      assert.equal(searchTool.name, 'search_sfcc_classes');
      assert.ok(searchTool.description, 'Tool should have description');
      assert.ok(searchTool.inputSchema, 'Tool should have input schema');
      assert.equal(searchTool.inputSchema.type, 'object');
      assert.ok(searchTool.inputSchema.properties.query, 'Tool should require query parameter');
    });
  });

  describe('Response Structure Validation', () => {
    test('should return properly structured MCP response for valid query', async () => {
      const result = await client.callTool('search_sfcc_classes', { query: 'catalog' });
      
      // Validate MCP response structure
      assertValidMCPResponse(result);
      assert.equal(result.isError, false, 'Should not be an error response');
      assert.equal(result.content.length, 1, 'Should have exactly one content item');
      assert.equal(result.content[0].type, 'text', 'Content should be text type');
      
      // Validate JSON array structure
      const classArray = parseClassArray(result.content[0].text);
      assert.ok(Array.isArray(classArray), 'Response should contain valid JSON array');
      assert.ok(classArray.length > 0, 'Should return at least one class for catalog query');
      
      // Validate class name format
      classArray.forEach(className => {
        assert.equal(typeof className, 'string', 'Each class name should be a string');
        // SFCC includes multiple namespaces
        assert.ok(
          className.startsWith('dw.') || 
          className.startsWith('TopLevel.') || 
          className.startsWith('best-practices.') || 
          className.startsWith('sfra.'),
          `Class name "${className}" should start with recognized namespace`
        );
        assert.ok(className.includes('catalog'), 'Results should be relevant to query');
      });
    });

    test('should return empty array for no matches', async () => {
      const result = await client.callTool('search_sfcc_classes', { query: 'zzznothingfound' });
      
      assertValidMCPResponse(result);
      assert.equal(result.isError, false, 'Should not be an error response');
      
      const classArray = parseClassArray(result.content[0].text);
      assert.ok(Array.isArray(classArray), 'Response should be valid JSON array');
      assert.equal(classArray.length, 0, 'Should return empty array for no matches');
    });

    test('should return error response for invalid parameters', async () => {
      const result = await client.callTool('search_sfcc_classes', { query: '' });
      
      assertValidMCPResponse(result);
      assert.equal(result.isError, true, 'Should be an error response');
      assert.ok(result.content[0].text.includes('Error:'), 'Should contain error message');
      assert.ok(result.content[0].text.includes('non-empty string'), 'Should specify validation requirement');
    });
  });

  describe('Dynamic Search Testing', () => {
    const testQueries = [
      { query: 'catalog', expectedMin: 10, category: 'namespace' },
      { query: 'product', expectedMin: 5, category: 'common' },
      { query: 'customer', expectedMin: 3, category: 'namespace' },
      { query: 'order', expectedMin: 5, category: 'namespace' },
      { query: 'system', expectedMin: 3, category: 'namespace' },
      { query: 'Campaign', expectedMin: 1, category: 'specific' },
      { query: 'Manager', expectedMin: 0, category: 'pattern' } // "Manager" returns no results - SFCC uses "Mgr"
    ];

    testQueries.forEach(({ query, expectedMin, category }) => {
      test(`should find relevant classes for ${category} query: "${query}"`, async () => {
        const result = await client.callTool('search_sfcc_classes', { query });
        
        assertValidMCPResponse(result);
        assert.equal(result.isError, false, 'Should not be an error');
        
        const classArray = parseClassArray(result.content[0].text);
        assert.ok(classArray.length >= expectedMin, 
          `Should find at least ${expectedMin} classes for "${query}", found ${classArray.length}`);
        
        // Validate relevance - all results should contain the query term (case insensitive)
        classArray.forEach(className => {
          const lowerClassName = className.toLowerCase();
          const lowerQuery = query.toLowerCase();
          assert.ok(lowerClassName.includes(lowerQuery), 
            `Class "${className}" should contain query term "${query}"`);
        });
      });
    });
  });

  describe('Edge Case Validation', () => {
    const edgeCases = [
      { query: 'A', description: 'single character' },
      { query: 'dw', description: 'namespace prefix' },
      { query: 'CATALOG', description: 'uppercase query' },
      { query: 'catalog.Product', description: 'full class path segment' },
      { query: '123', description: 'numeric query' },
      { query: 'xyz_nonexistent_abc', description: 'clearly non-existent term' }
    ];

    edgeCases.forEach(({ query, description }) => {
      test(`should handle ${description} query: "${query}"`, async () => {
        const result = await client.callTool('search_sfcc_classes', { query });
        
        assertValidMCPResponse(result);
        assert.equal(result.isError, false, 'Should not be an error for valid string');
        
        const classArray = parseClassArray(result.content[0].text);
        assert.ok(Array.isArray(classArray), 'Should return valid array');
        
        // All results should be valid class names
        classArray.forEach(className => {
          assert.equal(typeof className, 'string', 'Should be string');
          // SFCC includes dw.*, TopLevel.*, best-practices.*, and sfra.* classes
          assert.ok(
            className.startsWith('dw.') || 
            className.startsWith('TopLevel.') || 
            className.startsWith('best-practices.') || 
            className.startsWith('sfra.'),
            `Class name "${className}" should start with dw., TopLevel., best-practices., or sfra.`
          );
        });
      });
    });
  });

  describe('Error Handling and Validation', () => {
    const errorCases = [
      { params: {}, expectedError: 'non-empty string', description: 'missing query parameter' },
      { params: { query: '' }, expectedError: 'non-empty string', description: 'empty string query' },
      { params: { query: null }, expectedError: 'string', description: 'null query' },
      { params: { query: 123 }, expectedError: 'string', description: 'numeric query parameter' },
      { params: { query: [] }, expectedError: 'string', description: 'array query parameter' },
      { params: { query: {} }, expectedError: 'string', description: 'object query parameter' }
    ];

    errorCases.forEach(({ params, expectedError, description }) => {
      test(`should validate ${description}`, async () => {
        const result = await client.callTool('search_sfcc_classes', params);
        
        assertValidMCPResponse(result);
        assert.equal(result.isError, true, 'Should be an error response');
        
        const errorMessage = result.content[0].text.toLowerCase();
        assert.ok(errorMessage.includes('error'), 'Should contain error indicator');
        assert.ok(errorMessage.includes(expectedError.toLowerCase()), 
          `Error message should mention "${expectedError}"`);
        
        // Error categorization
        const errorType = categorizeError(result.content[0].text);
        assert.equal(errorType, 'validation', 'Should be categorized as validation error');
      });
    });
  });

  describe('Cross-Validation with YAML Tests', () => {
    test('should match YAML test expectations for common queries', async () => {
      // Test cases that mirror the YAML test file
      const yamlTestCases = [
        { query: 'catalog', shouldHave: ['dw.catalog.Catalog', 'dw.catalog.Product'] },
        { query: 'customer', shouldHave: ['dw.customer.Customer'] },
        { query: 'order', shouldHave: ['dw.order.Order'] },
        { query: 'system', shouldHave: ['dw.system.System'] }
      ];

      for (const testCase of yamlTestCases) {
        const result = await client.callTool('search_sfcc_classes', { query: testCase.query });
        
        assertValidMCPResponse(result);
        assert.equal(result.isError, false);
        
        const classArray = parseClassArray(result.content[0].text);
        
        // Verify expected classes are present
        testCase.shouldHave.forEach(expectedClass => {
          assert.ok(classArray.includes(expectedClass), 
            `Results for "${testCase.query}" should include "${expectedClass}"`);
        });
      }
    });

    test('should handle edge cases consistently with YAML tests', async () => {
      // Mirror YAML edge case tests
      const result = await client.callTool('search_sfcc_classes', { query: 'zzznothingfound' });
      
      assertValidMCPResponse(result);
      assert.equal(result.isError, false, 'Should not error for non-matching query');
      
      const classArray = parseClassArray(result.content[0].text);
      assert.equal(classArray.length, 0, 'Should return empty array for no matches');
    });
  });

  describe('Response Data Quality', () => {
    test('should return unique class names without duplicates', async () => {
      const result = await client.callTool('search_sfcc_classes', { query: 'catalog' });
      
      assertValidMCPResponse(result);
      const classArray = parseClassArray(result.content[0].text);
      
      const uniqueClasses = new Set(classArray);
      assert.equal(classArray.length, uniqueClasses.size, 
        'Should not contain duplicate class names');
    });

    test('should return results in consistent order', async () => {
      // Call the same query multiple times sequentially to avoid message interference
      const results = [];
      
      for (let i = 0; i < 3; i++) {
        // Clear buffers before each request to prevent interference
        client.clearAllBuffers();
        
        const result = await client.callTool('search_sfcc_classes', { query: 'catalog' });
        results.push(result);
        
      }
      
      const arrays = results.map(result => parseClassArray(result.content[0].text));
      
      // All arrays should be identical
      assert.deepEqual(arrays[0], arrays[1], 'Results should be consistent across calls');
      assert.deepEqual(arrays[1], arrays[2], 'Results should be consistent across calls');
    });

    test('should validate class name patterns and format', async () => {
      const result = await client.callTool('search_sfcc_classes', { query: 'catalog' });
      
      assertValidMCPResponse(result);
      const classArray = parseClassArray(result.content[0].text);
      
      classArray.forEach(className => {
        // Validate class name format - updated for all SFCC namespaces
        assert.match(className, /^(dw\.|TopLevel\.|best-practices\.|sfra\.)[a-zA-Z0-9_./-]+$/, 
          `Class name "${className}" should follow valid pattern`);
        
        // Should not contain spaces or invalid characters
        assert.ok(!className.includes(' '), `Class name "${className}" should not contain spaces`);
        
        // Should have reasonable length
        assert.ok(className.length > 3, `Class name "${className}" should be reasonable length`);
        assert.ok(className.length < 100, `Class name "${className}" should not be excessively long`);
      });
    });
  });
});

// Helper functions

/**
 * Validates that a response follows proper MCP structure
 */
function assertValidMCPResponse(result) {
  assert.ok(result.content, 'Response should have content property');
  assert.ok(Array.isArray(result.content), 'Content should be an array');
  assert.ok(result.content.length > 0, 'Content array should not be empty');
  assert.equal(result.content[0].type, 'text', 'First content item should be text type');
  assert.equal(typeof result.content[0].text, 'string', 'Text content should be a string');
  
  // isError property should always be present and boolean
  assert.ok(Object.prototype.hasOwnProperty.call(result, 'isError'), 'isError property should always be present');
  assert.equal(typeof result.isError, 'boolean', 'isError should be a boolean');
}

/**
 * Parses the class array from the response text
 */
function parseClassArray(text) {
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Failed to parse class array from response: ${text}`);
  }
}

/**
 * Categorizes error messages by type
 */
function categorizeError(errorText) {
  const errorPatterns = [
    { type: 'validation', keywords: ['required', 'invalid', 'missing', 'non-empty', 'string'] },
    { type: 'not_found', keywords: ['not found', 'does not exist'] },
    { type: 'permission', keywords: ['permission', 'unauthorized', 'forbidden'] },
    { type: 'network', keywords: ['connection', 'timeout', 'unreachable'] }
  ];

  const lowerText = errorText.toLowerCase();
  for (const pattern of errorPatterns) {
    if (pattern.keywords.some(keyword => lowerText.includes(keyword))) {
      return pattern.type;
    }
  }
  return 'unknown';
}
