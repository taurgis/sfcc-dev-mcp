/**
 * Programmatic tests for search_sfcc_classes tool
 * 
 * These tests provide advanced verification capabilities beyond YAML pattern matching,
 * including performance monitoring, dynamic validation, error categorization        assertValidMCPResponse(result);
        assert.equal(result.isError || false, false, 'Should not error for valid string');and
 * comprehensive response structure analysis.
 * 
 * Response format discovered via conductor query:
 * - Success: { content: [{ type: "text", text: "[\"class1\", \"class2\", ...]" }] }
 * - Empty: { content: [{ type: "text", text: "[]" }] }
 * - Error: { content: [{ type: "text", text: "Error: ..." }], isError: true }
 */

import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-conductor';

/**
 * Performance monitoring utility class
 */
class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
  }

  async measureTool(client, toolName, params) {
    const startTime = process.hrtime.bigint();
    const result = await client.callTool(toolName, params);
    const endTime = process.hrtime.bigint();
    
    const duration = Number(endTime - startTime) / 1_000_000; // Convert to ms
    
    if (!this.metrics.has(toolName)) {
      this.metrics.set(toolName, []);
    }
    this.metrics.get(toolName).push(duration);
    
    return { result, duration };
  }

  getStats(toolName) {
    const measurements = this.metrics.get(toolName) || [];
    if (measurements.length === 0) return null;
    
    return {
      count: measurements.length,
      avg: measurements.reduce((a, b) => a + b, 0) / measurements.length,
      min: Math.min(...measurements),
      max: Math.max(...measurements),
      p95: this.percentile(measurements, 0.95)
    };
  }

  getSummary() {
    const summary = {};
    for (const [toolName] of this.metrics) {
      summary[toolName] = this.getStats(toolName);
    }
    return summary;
  }

  percentile(arr, p) {
    const sorted = [...arr].sort((a, b) => a - b);
    const index = Math.ceil(sorted.length * p) - 1;
    return sorted[index];
  }
}

describe('search_sfcc_classes Programmatic Tests', () => {
  let client;
  const performanceMonitor = new PerformanceMonitor();

  before(async () => {
    client = await connect('./conductor.config.docs-only.json');
  });

  after(async () => {
    if (client?.connected) {
      await client.disconnect();
    }
    
    // Log performance summary
    console.log('\n📊 Performance Summary:');
    console.log(performanceMonitor.getSummary());
  });

  beforeEach(() => {
    // CRITICAL: Clear stderr buffer to prevent test interference
    client.clearStderr();
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
      const { result, duration } = await performanceMonitor.measureTool(
        client, 'search_sfcc_classes', { query: 'catalog' }
      );
      
      // Validate MCP response structure
      assertValidMCPResponse(result);
      assert.equal(result.isError || false, false, 'Should not be an error response');
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
      
      // Performance validation (more lenient for concurrent test execution)
      assert.ok(duration < 200, `Response time ${duration}ms should be under 200ms`);
    });

    test('should return empty array for no matches', async () => {
      const { result, duration } = await performanceMonitor.measureTool(
        client, 'search_sfcc_classes', { query: 'zzznothingfound' }
      );
      
      assertValidMCPResponse(result);
      assert.equal(result.isError || false, false, 'Should not be an error response');
      
      const classArray = parseClassArray(result.content[0].text);
      assert.ok(Array.isArray(classArray), 'Response should be valid JSON array');
      assert.equal(classArray.length, 0, 'Should return empty array for no matches');
      
      // Performance should be reasonable for no results (CI-friendly)
      assert.ok(duration < 500, `No results response time ${duration}ms should be under 500ms`);
    });

    test('should return error response for invalid parameters', async () => {
      const { result, duration } = await performanceMonitor.measureTool(
        client, 'search_sfcc_classes', { query: '' }
      );
      
      assertValidMCPResponse(result);
      assert.equal(result.isError, true, 'Should be an error response');
      assert.ok(result.content[0].text.includes('Error:'), 'Should contain error message');
      assert.ok(result.content[0].text.includes('non-empty string'), 'Should specify validation requirement');
      
      // Error responses should be reasonably fast (CI-friendly)
      assert.ok(duration < 500, `Error response time ${duration}ms should be under 500ms`);
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
        const { result, duration } = await performanceMonitor.measureTool(
          client, 'search_sfcc_classes', { query }
        );
        
        assertValidMCPResponse(result);
        assert.equal(result.isError || false, false, 'Should not be an error');
        
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
        
        // Performance should scale with result count
        const expectedMaxTime = Math.min(100, 20 + classArray.length * 0.5);
        assert.ok(duration < expectedMaxTime, 
          `Response time ${duration}ms should be under ${expectedMaxTime}ms for ${classArray.length} results`);
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
        const { result, duration } = await performanceMonitor.measureTool(
          client, 'search_sfcc_classes', { query }
        );
        
        assertValidMCPResponse(result);
        assert.equal(result.isError || false, false, 'Should not be an error for valid string');
        
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
        
        assert.ok(duration < 100, `Edge case response time ${duration}ms should be reasonable`);
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
        const { result, duration } = await performanceMonitor.measureTool(
          client, 'search_sfcc_classes', params
        );
        
        assertValidMCPResponse(result);
        assert.equal(result.isError, true, 'Should be an error response');
        
        const errorMessage = result.content[0].text.toLowerCase();
        assert.ok(errorMessage.includes('error'), 'Should contain error indicator');
        assert.ok(errorMessage.includes(expectedError.toLowerCase()), 
          `Error message should mention "${expectedError}"`);
        
        // Error categorization
        const errorType = categorizeError(result.content[0].text);
        assert.equal(errorType, 'validation', 'Should be categorized as validation error');
        
        assert.ok(duration < 500, `Error response time ${duration}ms should be fast`);
      });
    });
  });

  describe('Performance and Load Testing', () => {
    test('should handle concurrent requests efficiently', async () => {
      const queries = ['catalog', 'product', 'customer', 'order', 'system'];
      const startTime = Date.now();
      
      const promises = queries.map(query => 
        client.callTool('search_sfcc_classes', { query })
      );
      
      const results = await Promise.all(promises);
      const totalTime = Date.now() - startTime;
      
      // Validate all results
      results.forEach((result, index) => {
        assertValidMCPResponse(result);
        assert.equal(result.isError || false, false, `Request ${index} should succeed`);
        
        const classArray = parseClassArray(result.content[0].text);
        assert.ok(classArray.length > 0, `Query "${queries[index]}" should return results`);
      });
      
      // Performance validation
      assert.ok(totalTime < 1000, `Concurrent requests should complete under 1000ms, took ${totalTime}ms`);
      const avgTime = totalTime / queries.length;
      assert.ok(avgTime < 200, `Average response time ${avgTime}ms should be under 200ms`);
    });

    test('should maintain consistent performance across multiple calls', async () => {
      const iterations = 10;
      const durations = [];
      
      for (let i = 0; i < iterations; i++) {
        const { duration } = await performanceMonitor.measureTool(
          client, 'search_sfcc_classes', { query: 'catalog' }
        );
        durations.push(duration);
      }
      
      const avgDuration = durations.reduce((a, b) => a + b, 0) / durations.length;
      const maxDuration = Math.max(...durations);
      const minDuration = Math.min(...durations);
      
      assert.ok(avgDuration < 500, `Average duration ${avgDuration}ms should be under 500ms`);
      assert.ok(maxDuration < 1000, `Max duration ${maxDuration}ms should be under 1000ms`);
      
      // Consistency check - max should not be more than 15x the minimum (reasonable for network calls)
      const variationRatio = maxDuration / minDuration;
      assert.ok(variationRatio < 15, 
        `Performance variation ratio ${variationRatio} should be under 15 (min: ${minDuration}ms, max: ${maxDuration}ms)`);
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
        assert.equal(result.isError || false, false);
        
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
      assert.equal(result.isError || false, false, 'Should not error for non-matching query');
      
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
      // Call the same query multiple times
      const results = await Promise.all([
        client.callTool('search_sfcc_classes', { query: 'catalog' }),
        client.callTool('search_sfcc_classes', { query: 'catalog' }),
        client.callTool('search_sfcc_classes', { query: 'catalog' })
      ]);
      
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
  
  // isError property only exists on error responses, is undefined on success
  if ('isError' in result) {
    assert.equal(typeof result.isError, 'boolean', 'isError should be a boolean when present');
  }
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
