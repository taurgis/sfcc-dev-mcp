/**
 * Advanced programmatic tests for get_sfcc_class_info tool (docs-only mode)
 * 
 * These tests go beyond what's possible with YAML testing to provide:
 * - Complex validation scenarios
 * - Performance testing
 * - Concurrent request handling
 * - Advanced workflow simulation
 * - Stress testing
 * 
 * @requires mcp-conductor
 */

import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-conductor';

let client;

describe('SFCC MCP Server - get_sfcc_class_info Tool (Documentation-Only Mode)', () => {
  // ==================================================================================
  // SETUP AND TEARDOWN
  // ==================================================================================

  before(async () => {
    client = await connect('./conductor.config.docs-only.json');
  });

  after(async () => {
    if (client?.connected) {
      await client.disconnect();
    }
  });

  beforeEach(() => {
    // CRITICAL: Clear all buffers to prevent leaking into next tests
    client.clearAllBuffers(); // Recommended - comprehensive protection
  });

  // ==================================================================================
  // TOOL DISCOVERY AND METADATA TESTS
  // ==================================================================================

  test('should successfully connect and discover get_sfcc_class_info tool', async () => {
    const tools = await client.listTools();
    const targetTool = tools.find(tool => tool.name === 'get_sfcc_class_info');
    
    assert(targetTool, 'get_sfcc_class_info tool should be available');
    assert.strictEqual(targetTool.name, 'get_sfcc_class_info');
    assert(targetTool.description, 'Tool should have description');
  });

  test('should have properly structured tool metadata', async () => {
    const tools = await client.listTools();
    const tool = tools.find(t => t.name === 'get_sfcc_class_info');
    
    assert(tool.inputSchema, 'Tool should have input schema');
    assert(tool.inputSchema.properties, 'Schema should have properties');
    assert(tool.inputSchema.properties.className, 'Should have className parameter');
    assert(tool.inputSchema.properties.expand, 'Should have expand parameter');
  });

  test('should validate className parameter schema', async () => {
    const tools = await client.listTools();
    const tool = tools.find(t => t.name === 'get_sfcc_class_info');
    const classNameParam = tool.inputSchema.properties.className;
    
    assert.strictEqual(classNameParam.type, 'string');
    assert(classNameParam.description);
  });

  test('should validate expand parameter schema', async () => {
    const tools = await client.listTools();
    const tool = tools.find(t => t.name === 'get_sfcc_class_info');
    const expandParam = tool.inputSchema.properties.expand;
    
    assert.strictEqual(expandParam.type, 'boolean');
    assert(expandParam.description);
  });

  // ==================================================================================
  // BASIC FUNCTIONALITY TESTS
  // ==================================================================================

  test('should execute with basic SFCC class successfully', async () => {
    const result = await client.callTool('get_sfcc_class_info', {
      className: 'dw.catalog.Product'
    });
    
    assertValidMCPResponse(result);
    const classInfo = JSON.parse(result.content[0].text);
    
    assert.strictEqual(classInfo.className, 'Product');
    assert.strictEqual(classInfo.packageName, 'dw.catalog');
    assert(classInfo.description);
    assert(Array.isArray(classInfo.properties));
    assert(Array.isArray(classInfo.methods));
  });

  test('should work with short class names', async () => {
    const result = await client.callTool('get_sfcc_class_info', {
      className: 'Product'
    });
    
    assertValidMCPResponse(result);
    const classInfo = JSON.parse(result.content[0].text);
    
    assert.strictEqual(classInfo.className, 'Product');
    assert.strictEqual(classInfo.packageName, 'dw.catalog');
    assert(classInfo.description);
  });

  test('should work with TopLevel classes', async () => {
    const result = await client.callTool('get_sfcc_class_info', {
      className: 'Customer'
    });
    
    assertValidMCPResponse(result);
    const classInfo = JSON.parse(result.content[0].text);
    
    assert.strictEqual(classInfo.className, 'Customer');
    assert(classInfo.packageName === 'dw.customer' || classInfo.packageName === 'TopLevel');
    assert(classInfo.description);
  });

  // ==================================================================================
  // EXPAND PARAMETER TESTS
  // ==================================================================================

  test('should handle expand parameter set to false', async () => {
    const result = await client.callTool('get_sfcc_class_info', {
      className: 'dw.catalog.Product',
      expand: false
    });
    
    assertValidMCPResponse(result);
    const classInfo = JSON.parse(result.content[0].text);
    
    assert.strictEqual(classInfo.className, 'Product');
    assert(classInfo.properties);
    assert(classInfo.methods);
  });

  test('should handle expand parameter set to true', async () => {
    const result = await client.callTool('get_sfcc_class_info', {
      className: 'dw.catalog.Product',
      expand: true
    });
    
    assertValidMCPResponse(result);
    const classInfo = JSON.parse(result.content[0].text);
    
    assert.strictEqual(classInfo.className, 'Product');
    assert(classInfo.properties);
    assert(classInfo.methods);
    // When expand is true, we might get additional referenced type information
  });

  // ==================================================================================
  // COMPLEX CLASS TESTS
  // ==================================================================================

  test('should handle complex classes with many methods', async () => {
    const result = await client.callTool('get_sfcc_class_info', {
      className: 'dw.catalog.Product'
    });
    
    assertValidMCPResponse(result);
    const classInfo = JSON.parse(result.content[0].text);
    
    assert(classInfo.methods.length > 10, 'Product should have many methods');
    assert(classInfo.properties.length > 5, 'Product should have many properties');
    
    // Validate method structure
    const sampleMethod = classInfo.methods[0];
    assert(sampleMethod.name, 'Method should have name');
    assert(sampleMethod.signature, 'Method should have signature');
    assert(sampleMethod.description, 'Method should have description');
  });

  test('should handle variation model classes', async () => {
    const testClasses = [
      'dw.catalog.ProductVariationModel',
      'dw.catalog.ProductVariationAttribute',
      'dw.catalog.ProductVariationAttributeValue'
    ];
    
    for (const className of testClasses) {
      const result = await client.callTool('get_sfcc_class_info', { className });
      assertValidMCPResponse(result);
      
      const classInfo = JSON.parse(result.content[0].text);
      assert(classInfo.className, `${className} should have className`);
      assert(classInfo.description, `${className} should have description`);
    }
  });

  test('should handle inventory-related classes', async () => {
    const result = await client.callTool('get_sfcc_class_info', {
      className: 'dw.catalog.ProductInventoryList'
    });
    
    assertValidMCPResponse(result);
    const classInfo = JSON.parse(result.content[0].text);
    
    assert.strictEqual(classInfo.className, 'ProductInventoryList');
    assert.strictEqual(classInfo.packageName, 'dw.catalog');
  });

  // ==================================================================================
  // ERROR HANDLING TESTS
  // ==================================================================================

  test('should handle invalid class names gracefully', async () => {
    const result = await client.callTool('get_sfcc_class_info', {
      className: 'NonExistentClass'
    });
    
    // Should either return an error or empty results
    assert(result.content || result.error, 'Should have some response');
  });

  test('should handle empty class name', async () => {
    const result = await client.callTool('get_sfcc_class_info', {
      className: ''
    });
    
    // Should handle empty input gracefully
    assert(result.content || result.error, 'Should handle empty className');
  });

  test('should handle missing className parameter', async () => {
    try {
      await client.callTool('get_sfcc_class_info', {});
      assert.fail('Should have thrown an error for missing className');
    } catch (error) {
      assert(error.message.includes('className') || error.message.includes('required'), 
             'Error should mention className requirement');
    }
  });

  test('should handle malformed class names', async () => {
    const malformedNames = [
      'dw.catalog..Product',
      '.Product',
      'dw.',
      'dw catalog Product',
      'dw/catalog/Product'
    ];
    
    for (const className of malformedNames) {
      const result = await client.callTool('get_sfcc_class_info', { className });
      // Should handle malformed names without crashing
      assert(result, `Should handle malformed name: ${className}`);
    }
  });

  test('should handle case sensitivity properly', async () => {
    const variations = [
      'dw.catalog.product',
      'DW.CATALOG.PRODUCT',
      'dw.Catalog.Product'
    ];
    
    for (const className of variations) {
      const result = await client.callTool('get_sfcc_class_info', { className });
      // Should either work or fail gracefully
      assert(result, `Should handle case variation: ${className}`);
    }
  });

  // ==================================================================================
  // CONSISTENCY AND RELIABILITY TESTS
  // ==================================================================================

  test('should return consistent results for repeated calls', async () => {
    const className = 'dw.catalog.Catalog';
    
    const result1 = await client.callTool('get_sfcc_class_info', { className });
    const result2 = await client.callTool('get_sfcc_class_info', { className });
    
    assertValidMCPResponse(result1);
    assertValidMCPResponse(result2);
    
    const class1 = JSON.parse(result1.content[0].text);
    const class2 = JSON.parse(result2.content[0].text);
    
    assert.deepStrictEqual(class1, class2, 'Results should be identical');
  });

  test('should handle concurrent requests properly', async () => {
    const classNames = [
      'dw.catalog.Product',
      'dw.catalog.Category', 
      'dw.catalog.Catalog',
      'dw.system.Site',
      'dw.customer.Customer'
    ];
    
    const promises = classNames.map(className => 
      client.callTool('get_sfcc_class_info', { className })
    );
    
    const results = await Promise.all(promises);
    
    results.forEach((result, index) => {
      assertValidMCPResponse(result);
      const classInfo = JSON.parse(result.content[0].text);
      assert(classInfo.className, `Result ${index} should have className`);
    });
  });

  // ==================================================================================
  // PERFORMANCE TESTS
  // ==================================================================================

  test('should meet response time requirements for simple classes', async () => {
    const startTime = Date.now();
    
    const result = await client.callTool('get_sfcc_class_info', {
      className: 'dw.system.Site'
    });
    
    const duration = Date.now() - startTime;
    assertValidMCPResponse(result);
    
    // Should respond within reasonable time (adjust as needed)
    assert(duration < 5000, `Response time ${duration}ms should be under 5 seconds`);
  });

  test('should handle complex classes within reasonable time', async () => {
    const startTime = Date.now();
    
    const result = await client.callTool('get_sfcc_class_info', {
      className: 'dw.catalog.Product',
      expand: true
    });
    
    const duration = Date.now() - startTime;
    assertValidMCPResponse(result);
    
    assert(duration < 10000, `Complex class response time ${duration}ms should be under 10 seconds`);
  });

  // ==================================================================================
  // ADVANCED VALIDATION TESTS
  // ==================================================================================

  test('should validate complete JSON structure for various classes', async () => {
    const testClasses = [
      'dw.catalog.Product',
      'dw.catalog.Category',
      'dw.system.Site'
    ];
    
    for (const className of testClasses) {
      const result = await client.callTool('get_sfcc_class_info', { className });
      assertValidMCPResponse(result);
      
      const classInfo = JSON.parse(result.content[0].text);
      
      // Validate required fields
      assert(classInfo.className, `${className} should have className`);
      assert(classInfo.packageName, `${className} should have packageName`);
      assert(classInfo.description, `${className} should have description`);
      assert(Array.isArray(classInfo.properties), `${className} should have properties array`);
      assert(Array.isArray(classInfo.methods), `${className} should have methods array`);
      assert(Array.isArray(classInfo.constants), `${className} should have constants array`);
    }
  });

  test('should validate method signatures and descriptions', async () => {
    const result = await client.callTool('get_sfcc_class_info', {
      className: 'dw.catalog.Product'
    });
    
    assertValidMCPResponse(result);
    const classInfo = JSON.parse(result.content[0].text);
    
    // Validate method structure
    classInfo.methods.slice(0, 5).forEach((method, index) => {
      assert(method.name, `Method ${index} should have name`);
      assert(method.signature, `Method ${index} should have signature`);
      assert(method.description, `Method ${index} should have description`);
      assert(method.signature.includes(method.name), 
             `Method ${index} signature should contain method name`);
    });
  });

  test('should validate property structure', async () => {
    const result = await client.callTool('get_sfcc_class_info', {
      className: 'dw.catalog.Product'
    });
    
    assertValidMCPResponse(result);
    const classInfo = JSON.parse(result.content[0].text);
    
    // Validate property structure
    classInfo.properties.slice(0, 5).forEach((property, index) => {
      assert(property.name, `Property ${index} should have name`);
      assert(property.type, `Property ${index} should have type`);
      assert(property.description, `Property ${index} should have description`);
    });
  });

  // ==================================================================================
  // INTEGRATION AND WORKFLOW TESTS
  // ==================================================================================

  test('should support class discovery workflow', async () => {
    // In docs-only mode, we test the main functionality directly
    const classResult = await client.callTool('get_sfcc_class_info', { 
      className: 'dw.catalog.Catalog'
    });
    
    assertValidMCPResponse(classResult);
    const classInfo = JSON.parse(classResult.content[0].text);
    
    assert.strictEqual(classInfo.className, 'Catalog');
    assert.strictEqual(classInfo.packageName, 'dw.catalog');
    assert(classInfo.description);
  });

  test('should support development workflow simulation', async () => {
    // Simulate a developer exploring the Product class
    const result = await client.callTool('get_sfcc_class_info', {
      className: 'dw.catalog.Product'
    });
    
    assertValidMCPResponse(result);
    const classInfo = JSON.parse(result.content[0].text);
    
    // Check for commonly used methods
    const methodNames = classInfo.methods.map(m => m.name);
    const importantMethods = ['getID', 'getName', 'isOnline', 'isAvailable'];
    
    importantMethods.forEach(methodName => {
      assert(methodNames.includes(methodName), 
             `Product class should have ${methodName} method`);
    });
  });

  // ==================================================================================
  // STRESS AND EDGE CASE TESTS
  // ==================================================================================

  test('should handle rapid successive calls without issues', async () => {
    const calls = 10;
    const className = 'dw.catalog.Category';
    
    const promises = Array(calls).fill().map(() => 
      client.callTool('get_sfcc_class_info', { className })
    );
    
    const results = await Promise.all(promises);
    
    results.forEach(result => {
      assertValidMCPResponse(result);
      const classInfo = JSON.parse(result.content[0].text);
      assert.strictEqual(classInfo.className, 'Category');
    });
  });

  test('should maintain accuracy across different parameter combinations', async () => {
    const testCases = [
      { className: 'dw.catalog.Product', expand: false },
      { className: 'dw.catalog.Product', expand: true },
      { className: 'Product', expand: false },
      { className: 'Product', expand: true }
    ];
    
    const results = await Promise.all(
      testCases.map(params => client.callTool('get_sfcc_class_info', params))
    );
    
    results.forEach(result => {
      assertValidMCPResponse(result);
      const classInfo = JSON.parse(result.content[0].text);
      assert.strictEqual(classInfo.className, 'Product');
      assert.strictEqual(classInfo.packageName, 'dw.catalog');
    });
  });
});

// ==================================================================================
// HELPER FUNCTIONS
// ==================================================================================

/**
 * Validates that a response follows the MCP protocol structure
 */
function assertValidMCPResponse(result) {
  assert.ok(result, 'Result should exist');
  assert.ok(result.content, 'Result should have content');
  assert.ok(Array.isArray(result.content), 'Content should be an array');
  assert.ok(result.content.length > 0, 'Content should not be empty');
  assert.equal(result.content[0].type, 'text', 'Content type should be text');
  assert.ok(typeof result.content[0].text === 'string', 'Content text should be string');
}
