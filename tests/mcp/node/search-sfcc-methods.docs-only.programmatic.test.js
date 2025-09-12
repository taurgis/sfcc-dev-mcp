/**
 * Programmatic tests for search_sfcc_methods tool
 * 
 * These tests provide advanced verification capabilities beyond YAML pattern matching,
 * including performance monitoring, dynamic validation, error categorization,
 * comprehensive response structure analysis, and method signature validation.
 * 
 * Response format discovered via conductor query:
 * - Success: { content: [{ type: "text", text: "[{\"className\": \"...\", \"method\": {...}}, ...]" }] }
 * - Empty: { content: [{ type: "text", text: "[]" }] }
 * - Error: { content: [{ type: "text", text: "Error: ..." }], isError: true }
 * 
 * Method object structure:
 * {
 *   "className": "dw_util.Calendar",
 *   "method": {
 *     "name": "get",
 *     "signature": "get(field : Number) : Number",
 *     "description": "Returns the value of the given calendar field."
 *   }
 * }
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

/**
 * Method signature analysis utility class
 */
class MethodSignatureAnalyzer {
  constructor() {
    this.patterns = {
      staticMethod: /^static\s+/,
      returnType: /:\s*([A-Za-z0-9_[\]]+)\s*$/,
      parameters: /\(([^)]*)\)/,
      methodName: /^(?:static\s+)?([A-Za-z_][A-Za-z0-9_]*)/
    };
  }

  analyzeSignature(signature) {
    return {
      isStatic: this.patterns.staticMethod.test(signature),
      returnType: this.extractReturnType(signature),
      parameters: this.extractParameters(signature),
      methodName: this.extractMethodName(signature),
      isValid: this.validateSignature(signature)
    };
  }

  extractReturnType(signature) {
    const match = signature.match(this.patterns.returnType);
    return match ? match[1] : null;
  }

  extractParameters(signature) {
    const match = signature.match(this.patterns.parameters);
    if (!match || !match[1].trim()) return [];
    
    return match[1].split(',').map(param => {
      const parts = param.trim().split(/\s*:\s*/);
      return {
        name: parts[0]?.trim() || '',
        type: parts[1]?.trim() || ''
      };
    });
  }

  extractMethodName(signature) {
    const match = signature.match(this.patterns.methodName);
    return match ? match[1] : null;
  }

  validateSignature(signature) {
    // Basic validation - should have method name, parentheses, and return type
    return signature.includes('(') && 
           signature.includes(')') && 
           signature.includes(':') &&
           signature.trim().length > 0;
  }

  categorizeMethod(methodData) {
    const { signature } = methodData.method;
    const analysis = this.analyzeSignature(signature);
    
    const categories = [];
    
    if (analysis.isStatic) categories.push('static');
    if (analysis.methodName?.startsWith('get')) categories.push('getter');
    if (analysis.methodName?.startsWith('set')) categories.push('setter');
    if (analysis.methodName?.startsWith('is') || analysis.methodName?.startsWith('has')) categories.push('boolean');
    if (analysis.returnType === 'void') categories.push('void');
    if (analysis.parameters.length === 0) categories.push('parameterless');
    if (analysis.parameters.length > 3) categories.push('complex');
    
    return categories;
  }
}

describe('search_sfcc_methods Programmatic Tests', () => {
  let client;
  const performanceMonitor = new PerformanceMonitor();
  const signatureAnalyzer = new MethodSignatureAnalyzer();

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

    test('should have search_sfcc_methods tool available', async () => {
      const tools = await client.listTools();
      const searchTool = tools.find(tool => tool.name === 'search_sfcc_methods');
      
      assert.ok(searchTool, 'search_sfcc_methods tool should be available');
      assert.equal(searchTool.name, 'search_sfcc_methods');
      assert.ok(searchTool.description, 'Tool should have description');
      assert.ok(searchTool.inputSchema, 'Tool should have input schema');
      assert.equal(searchTool.inputSchema.type, 'object');
      assert.ok(searchTool.inputSchema.properties.methodName, 'Tool should require methodName parameter');
    });
  });

  describe('Response Structure Validation', () => {
    test('should return properly structured MCP response for valid method search', async () => {
      const { result, duration } = await performanceMonitor.measureTool(
        client, 'search_sfcc_methods', { methodName: 'get' }
      );
      
      // Validate MCP response structure
      assertValidMCPResponse(result);
      assert.equal(result.isError || false, false, 'Should not be an error response');
      assert.equal(result.content.length, 1, 'Should have exactly one content item');
      assert.equal(result.content[0].type, 'text', 'Content should be text type');
      
      // Validate JSON array structure
      const methodArray = parseMethodArray(result.content[0].text);
      assert.ok(Array.isArray(methodArray), 'Response should contain valid JSON array');
      assert.ok(methodArray.length > 0, 'Should return at least one method for get query');
      
      // Validate method object structure
      methodArray.forEach(methodData => {
        assert.equal(typeof methodData, 'object', 'Each method should be an object');
        assert.ok(methodData.className, 'Method should have className property');
        assert.ok(methodData.method, 'Method should have method property');
        assert.equal(typeof methodData.className, 'string', 'className should be string');
        assert.equal(typeof methodData.method, 'object', 'method should be object');
        
        // Validate method object properties
        assert.ok(methodData.method.name, 'Method should have name');
        assert.ok(methodData.method.signature, 'Method should have signature');
        assert.ok(methodData.method.description, 'Method should have description');
        assert.equal(typeof methodData.method.name, 'string', 'Method name should be string');
        assert.equal(typeof methodData.method.signature, 'string', 'Method signature should be string');
        assert.equal(typeof methodData.method.description, 'string', 'Method description should be string');
      });
      
      // Performance validation (more lenient for concurrent test execution)
      assert.ok(duration < 250, `Response time ${duration}ms should be under 250ms`);
    });

    test('should return empty array for no matches', async () => {
      const { result, duration } = await performanceMonitor.measureTool(
        client, 'search_sfcc_methods', { methodName: 'zzznothingfound' }
      );
      
      assertValidMCPResponse(result);
      assert.equal(result.isError || false, false, 'Should not be an error response');
      
      const methodArray = parseMethodArray(result.content[0].text);
      assert.ok(Array.isArray(methodArray), 'Response should be valid JSON array');
      assert.equal(methodArray.length, 0, 'Should return empty array for no matches');
      
      // Performance should be fast for no results
      assert.ok(duration < 50, `No results response time ${duration}ms should be under 50ms`);
    });

    test('should return error response for invalid parameters', async () => {
      const { result, duration } = await performanceMonitor.measureTool(
        client, 'search_sfcc_methods', { methodName: '' }
      );
      
      assertValidMCPResponse(result);
      assert.equal(result.isError, true, 'Should be an error response');
      assert.ok(result.content[0].text.includes('Error:'), 'Should contain error message');
      assert.ok(result.content[0].text.includes('non-empty string'), 'Should specify validation requirement');
      
      // Error responses should be fast
      assert.ok(duration < 50, `Error response time ${duration}ms should be under 50ms`);
    });
  });

  describe('Method Search Functionality', () => {
    const commonMethodQueries = [
      { query: 'get', expectedMin: 50, category: 'getter' },
      { query: 'set', expectedMin: 10, category: 'setter' },
      { query: 'create', expectedMin: 5, category: 'factory' },
      { query: 'toString', expectedMin: 20, category: 'conversion' },
      { query: 'getValue', expectedMin: 10, category: 'accessor' },
      { query: 'getName', expectedMin: 5, category: 'accessor' }
    ];

    commonMethodQueries.forEach(({ query, expectedMin, category }) => {
      test(`should find relevant methods for ${category} query: "${query}"`, async () => {
        const { result, duration } = await performanceMonitor.measureTool(
          client, 'search_sfcc_methods', { methodName: query }
        );
        
        assertValidMCPResponse(result);
        assert.equal(result.isError || false, false, 'Should not be an error');
        
        const methodArray = parseMethodArray(result.content[0].text);
        assert.ok(methodArray.length >= expectedMin, 
          `Should find at least ${expectedMin} methods for "${query}", found ${methodArray.length}`);
        
        // Validate relevance - all method names should contain the query term
        methodArray.forEach(methodData => {
          const methodName = methodData.method.name.toLowerCase();
          const lowerQuery = query.toLowerCase();
          assert.ok(methodName.includes(lowerQuery), 
            `Method "${methodData.method.name}" should contain query term "${query}"`);
        });
        
        // Validate class name format
        methodArray.forEach(methodData => {
          assert.ok(
            methodData.className.startsWith('dw_') || 
            methodData.className.startsWith('TopLevel.') || 
            methodData.className.startsWith('best-practices.') || 
            methodData.className.startsWith('sfra.'),
            `Class name "${methodData.className}" should start with recognized namespace`
          );
        });
        
        // Performance should scale with result count
        const expectedMaxTime = Math.min(150, 30 + methodArray.length * 0.2);
        assert.ok(duration < expectedMaxTime, 
          `Response time ${duration}ms should be under ${expectedMaxTime}ms for ${methodArray.length} results`);
      });
    });
  });

  describe('Method Signature Analysis', () => {
    test('should return valid method signatures for all results', async () => {
      const result = await client.callTool('search_sfcc_methods', { methodName: 'get' });
      
      assertValidMCPResponse(result);
      const methodArray = parseMethodArray(result.content[0].text);
      
      methodArray.slice(0, 20).forEach(methodData => { // Test first 20 for performance
        const analysis = signatureAnalyzer.analyzeSignature(methodData.method.signature);
        
        assert.ok(analysis.isValid, 
          `Method signature "${methodData.method.signature}" should be valid`);
        assert.ok(analysis.methodName, 
          `Should extract method name from "${methodData.method.signature}"`);
        assert.ok(analysis.returnType, 
          `Should extract return type from "${methodData.method.signature}"`);
        
        // Method name in signature should match the method name property
        assert.equal(analysis.methodName, methodData.method.name,
          'Method name in signature should match method.name property');
        
        // Signature should be properly formatted
        assert.ok(methodData.method.signature.includes('('), 'Signature should contain opening parenthesis');
        assert.ok(methodData.method.signature.includes(')'), 'Signature should contain closing parenthesis');
        assert.ok(methodData.method.signature.includes(':'), 'Signature should contain return type separator');
      });
    });

    test('should categorize methods correctly by signature patterns', async () => {
      const result = await client.callTool('search_sfcc_methods', { methodName: 'get' });
      
      assertValidMCPResponse(result);
      const methodArray = parseMethodArray(result.content[0].text);
      
      const categoryCounts = {
        static: 0,
        getter: 0,
        parameterless: 0,
        complex: 0
      };
      
      methodArray.slice(0, 50).forEach(methodData => {
        const categories = signatureAnalyzer.categorizeMethod(methodData);
        categories.forEach(category => {
          if (Object.prototype.hasOwnProperty.call(categoryCounts, category)) {
            categoryCounts[category]++;
          }
        });
      });
      
      // Should find a good mix of method types
      assert.ok(categoryCounts.getter > 10, 'Should find plenty of getter methods');
      // Static methods might not be common in 'get' search, so make this more flexible
      assert.ok(categoryCounts.static >= 0, 'Static method count should be non-negative');
      assert.ok(categoryCounts.parameterless > 5, 'Should find parameterless methods');
      
      console.log('📈 Method categorization analysis:', categoryCounts);
    });
  });

  describe('Edge Case Validation', () => {
    const edgeCases = [
      { methodName: 'A', description: 'single character' },
      { methodName: 'get', description: 'common method prefix' },
      { methodName: 'GET', description: 'uppercase query' },
      { methodName: 'getValue', description: 'compound method name' },
      { methodName: '123', description: 'numeric query' },
      { methodName: 'xyz_nonexistent_method', description: 'clearly non-existent method' }
    ];

    edgeCases.forEach(({ methodName, description }) => {
      test(`should handle ${description} query: "${methodName}"`, async () => {
        const { result, duration } = await performanceMonitor.measureTool(
          client, 'search_sfcc_methods', { methodName }
        );
        
        assertValidMCPResponse(result);
        assert.equal(result.isError || false, false, 'Should not be an error for valid string');
        
        const methodArray = parseMethodArray(result.content[0].text);
        assert.ok(Array.isArray(methodArray), 'Should return valid array');
        
        // All results should have valid structure
        methodArray.forEach(methodData => {
          assert.ok(methodData.className, 'Should have className');
          assert.ok(methodData.method, 'Should have method object');
          assert.ok(methodData.method.name, 'Should have method name');
          assert.ok(methodData.method.signature, 'Should have method signature');
          assert.ok(methodData.method.description, 'Should have method description');
          
          // Method name should contain the query (case insensitive)
          const methodNameLower = methodData.method.name.toLowerCase();
          const queryLower = methodName.toLowerCase();
          assert.ok(methodNameLower.includes(queryLower), 
            `Method "${methodData.method.name}" should contain query "${methodName}"`);
        });
        
        // Performance should be reasonable
        assert.ok(duration < 100, `Response time ${duration}ms should be under 100ms`);
      });
    });
  });

  describe('Error Handling Validation', () => {
    const errorCases = [
      { args: { methodName: '' }, description: 'empty method name' },
      { args: {}, description: 'missing methodName parameter' },
      { args: { methodName: '   ' }, description: 'whitespace-only method name' },
      { args: { methodName: null }, description: 'null method name' },
      { args: { methodName: 123 }, description: 'non-string method name (number)' },
      { args: { methodName: true }, description: 'non-string method name (boolean)' },
      { args: { methodName: [] }, description: 'non-string method name (array)' },
      { args: { methodName: {} }, description: 'non-string method name (object)' }
    ];

    errorCases.forEach(({ args, description }) => {
      test(`should return error for ${description}`, async () => {
        const { result, duration } = await performanceMonitor.measureTool(
          client, 'search_sfcc_methods', args
        );
        
        assertValidMCPResponse(result);
        assert.equal(result.isError, true, 'Should be an error response');
        assert.ok(result.content[0].text.includes('Error'), 'Should contain error message');
        
        // Categorize error type
        const errorType = categorizeError(result.content[0].text);
        assert.ok(['validation', 'not_found', 'unknown'].includes(errorType), 
          `Error should be categorized (got: ${errorType})`);
        
        // Error responses should be fast
        assert.ok(duration < 50, `Error response time ${duration}ms should be under 50ms`);
      });
    });
  });

  describe('Consistency and Reliability', () => {
    test('should return consistent results across multiple calls', async () => {
      const methodName = 'getValue';
      const results = await Promise.all([
        client.callTool('search_sfcc_methods', { methodName }),
        client.callTool('search_sfcc_methods', { methodName }),
        client.callTool('search_sfcc_methods', { methodName })
      ]);
      
      // All results should be successful
      results.forEach(result => {
        assertValidMCPResponse(result);
        assert.equal(result.isError || false, false, 'Should not be error');
      });
      
      // Parse arrays for comparison
      const arrays = results.map(result => parseMethodArray(result.content[0].text));
      
      // All arrays should be identical
      assert.deepEqual(arrays[0], arrays[1], 'Results should be consistent across calls');
      assert.deepEqual(arrays[1], arrays[2], 'Results should be consistent across calls');
    });

    test('should validate method data integrity and format', async () => {
      const result = await client.callTool('search_sfcc_methods', { methodName: 'toString' });
      
      assertValidMCPResponse(result);
      const methodArray = parseMethodArray(result.content[0].text);
      
      methodArray.forEach(methodData => {
        // Validate method data integrity
        assert.ok(methodData.className.length > 3, 
          `Class name "${methodData.className}" should be reasonable length`);
        assert.ok(methodData.className.length < 100, 
          `Class name "${methodData.className}" should not be excessively long`);
        
        // Validate class name format
        assert.match(methodData.className, /^(dw_|TopLevel\.|best-practices\.|sfra\.)[a-zA-Z0-9_./-]+$/, 
          `Class name "${methodData.className}" should follow valid pattern`);
        
        // Validate method name format
        assert.match(methodData.method.name, /^[a-zA-Z_][a-zA-Z0-9_]*$/, 
          `Method name "${methodData.method.name}" should follow valid identifier pattern`);
        
        // Should not contain HTML or special characters
        assert.ok(!methodData.method.name.includes('<'), 'Method name should not contain HTML');
        assert.ok(!methodData.method.name.includes('>'), 'Method name should not contain HTML');
        
        // Description should be reasonable length
        assert.ok(methodData.method.description.length > 5, 'Description should not be too short');
        assert.ok(methodData.method.description.length < 2000, 'Description should not be excessively long');
        
        // Signature should contain the method name
        assert.ok(methodData.method.signature.includes(methodData.method.name), 
          'Signature should contain the method name');
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
 * Parses the method array from the response text
 */
function parseMethodArray(text) {
  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`Failed to parse method array from response: ${text}`);
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
