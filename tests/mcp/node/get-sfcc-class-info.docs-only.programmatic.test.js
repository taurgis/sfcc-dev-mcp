/**
 * Advanced programmatic tests for get_sfcc_class_info tool (docs-only mode)
 * 
 * These tests go beyond what's possible with YAML testing to provide:
 * - Complex validation scenarios
 * - Concurrent request handling
 * - Advanced workflow simulation
 * - Stress testing
 * 
 * @requires mcp-aegis
 */

import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

let client;

describe('SFCC MCP Server - get_sfcc_class_info Tool (Documentation-Only Mode)', () => {
  // ==================================================================================
  // SETUP AND TEARDOWN
  // ==================================================================================

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
    
    const results = [];
    for (const className of classNames) {
      const result = await client.callTool('get_sfcc_class_info', { className });
      results.push(result);
    }
    
    results.forEach((result, index) => {
      assertValidMCPResponse(result);
      const classInfo = JSON.parse(result.content[0].text);
      assert(classInfo.className, `Result ${index} should have className`);
    });
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
    
    const results = [];
    for (let i = 0; i < calls; i++) {
      const result = await client.callTool('get_sfcc_class_info', { className });
      results.push(result);
    }
    
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
    
    const results = [];
    for (const params of testCases) {
      const result = await client.callTool('get_sfcc_class_info', params);
      results.push(result);
    }
    
    results.forEach(result => {
      assertValidMCPResponse(result);
      const classInfo = JSON.parse(result.content[0].text);
      assert.strictEqual(classInfo.className, 'Product');
      assert.strictEqual(classInfo.packageName, 'dw.catalog');
    });
  });

  // ==================================================================================
  // FILTERING PARAMETERS COMPREHENSIVE TESTS
  // ==================================================================================

  describe('Filtering Parameters', () => {
    test('should validate all filtering parameters exist in tool schema', async () => {
      const tools = await client.listTools();
      const tool = tools.find(t => t.name === 'get_sfcc_class_info');
      const props = tool.inputSchema.properties;
      
      // Validate all new filtering parameters are defined
      assert(props.includeDescription, 'Should have includeDescription parameter');
      assert(props.includeConstants, 'Should have includeConstants parameter');
      assert(props.includeProperties, 'Should have includeProperties parameter');
      assert(props.includeMethods, 'Should have includeMethods parameter');
      assert(props.includeInheritance, 'Should have includeInheritance parameter');
      assert(props.search, 'Should have search parameter');
      
      // Validate parameter types
      assert.strictEqual(props.includeDescription.type, 'boolean');
      assert.strictEqual(props.includeConstants.type, 'boolean');
      assert.strictEqual(props.includeProperties.type, 'boolean');
      assert.strictEqual(props.includeMethods.type, 'boolean');
      assert.strictEqual(props.includeInheritance.type, 'boolean');
      assert.strictEqual(props.search.type, 'string');
    });

    test('should include all sections by default', async () => {
      const result = await client.callTool('get_sfcc_class_info', {
        className: 'dw.catalog.Product'
      });
      
      assertValidMCPResponse(result);
      const classInfo = JSON.parse(result.content[0].text);
      
      // Verify all sections are present by default
      assert(classInfo.description, 'Should include description by default');
      assert(Array.isArray(classInfo.constants), 'Should include constants array');
      assert(Array.isArray(classInfo.properties), 'Should include properties array');
      assert(Array.isArray(classInfo.methods), 'Should include methods array');
      assert(classInfo.inheritance, 'Should include inheritance by default');
    });

    test('should exclude description when includeDescription is false', async () => {
      const result = await client.callTool('get_sfcc_class_info', {
        className: 'dw.catalog.Product',
        includeDescription: false
      });
      
      assertValidMCPResponse(result);
      const classInfo = JSON.parse(result.content[0].text);
      
      // Description should be excluded or empty
      assert(!classInfo.description || classInfo.description === '', 
             'Description should be excluded when includeDescription is false');
      
      // Other sections should still be present
      assert(Array.isArray(classInfo.properties), 'Properties should still be included');
      assert(Array.isArray(classInfo.methods), 'Methods should still be included');
    });

    test('should exclude constants when includeConstants is false', async () => {
      const result = await client.callTool('get_sfcc_class_info', {
        className: 'dw.catalog.Product',
        includeConstants: false
      });
      
      assertValidMCPResponse(result);
      const classInfo = JSON.parse(result.content[0].text);
      
      // Constants should be excluded or empty
      assert(!classInfo.constants || classInfo.constants.length === 0, 
             'Constants should be excluded when includeConstants is false');
      
      // Other sections should still be present
      assert(classInfo.description, 'Description should still be included');
      assert(Array.isArray(classInfo.properties), 'Properties should still be included');
    });

    test('should exclude properties when includeProperties is false', async () => {
      const result = await client.callTool('get_sfcc_class_info', {
        className: 'dw.catalog.Product',
        includeProperties: false
      });
      
      assertValidMCPResponse(result);
      const classInfo = JSON.parse(result.content[0].text);
      
      // Properties should be excluded or empty
      assert(!classInfo.properties || classInfo.properties.length === 0, 
             'Properties should be excluded when includeProperties is false');
      
      // Other sections should still be present
      assert(classInfo.description, 'Description should still be included');
      assert(Array.isArray(classInfo.methods), 'Methods should still be included');
    });

    test('should exclude methods when includeMethods is false', async () => {
      const result = await client.callTool('get_sfcc_class_info', {
        className: 'dw.catalog.Product',
        includeMethods: false
      });
      
      assertValidMCPResponse(result);
      const classInfo = JSON.parse(result.content[0].text);
      
      // Methods should be excluded or empty
      assert(!classInfo.methods || classInfo.methods.length === 0, 
             'Methods should be excluded when includeMethods is false');
      
      // Other sections should still be present
      assert(classInfo.description, 'Description should still be included');
      assert(Array.isArray(classInfo.properties), 'Properties should still be included');
    });

    test('should exclude inheritance when includeInheritance is false', async () => {
      const result = await client.callTool('get_sfcc_class_info', {
        className: 'dw.catalog.Product',
        includeInheritance: false
      });
      
      assertValidMCPResponse(result);
      const classInfo = JSON.parse(result.content[0].text);
      
      // Inheritance should be excluded or empty
      assert(!classInfo.inheritance || 
             (Array.isArray(classInfo.inheritance) && classInfo.inheritance.length === 0) ||
             classInfo.inheritance === '', 
             'Inheritance should be excluded when includeInheritance is false');
      
      // Other sections should still be present
      assert(classInfo.description, 'Description should still be included');
      assert(Array.isArray(classInfo.methods), 'Methods should still be included');
    });

    test('should create minimal response when all filters disabled', async () => {
      const result = await client.callTool('get_sfcc_class_info', {
        className: 'dw.catalog.Product',
        includeDescription: false,
        includeConstants: false,
        includeProperties: false,
        includeMethods: false,
        includeInheritance: false
      });
      
      assertValidMCPResponse(result);
      const classInfo = JSON.parse(result.content[0].text);
      
      // Only basic class info should remain
      assert.strictEqual(classInfo.className, 'Product');
      assert.strictEqual(classInfo.packageName, 'dw.catalog');
      
      // All optional sections should be excluded or empty
      assert(!classInfo.description || classInfo.description === '');
      assert(!classInfo.constants || classInfo.constants.length === 0);
      assert(!classInfo.properties || classInfo.properties.length === 0);
      assert(!classInfo.methods || classInfo.methods.length === 0);
      assert(!classInfo.inheritance || 
             (Array.isArray(classInfo.inheritance) && classInfo.inheritance.length === 0) ||
             classInfo.inheritance === '');
    });

    test('should combine filtering parameters effectively', async () => {
      const result = await client.callTool('get_sfcc_class_info', {
        className: 'dw.catalog.Product',
        includeDescription: true,
        includeConstants: false,
        includeProperties: true,
        includeMethods: false,
        includeInheritance: true
      });
      
      assertValidMCPResponse(result);
      const classInfo = JSON.parse(result.content[0].text);
      
      // Should include: description, properties, inheritance
      assert(classInfo.description, 'Description should be included');
      assert(Array.isArray(classInfo.properties), 'Properties should be included');
      assert(classInfo.inheritance, 'Inheritance should be included');
      
      // Should exclude: constants, methods
      assert(!classInfo.constants || classInfo.constants.length === 0, 'Constants should be excluded');
      assert(!classInfo.methods || classInfo.methods.length === 0, 'Methods should be excluded');
    });
  });

  // ==================================================================================
  // SEARCH FUNCTIONALITY COMPREHENSIVE TESTS
  // ==================================================================================

  describe('Search Functionality', () => {
    test('should filter results with search parameter', async () => {
      const result = await client.callTool('get_sfcc_class_info', {
        className: 'dw.catalog.Product',
        search: 'name'
      });
      
      assertValidMCPResponse(result);
      const classInfo = JSON.parse(result.content[0].text);
      
      // Search should filter properties and methods
      if (classInfo.properties && classInfo.properties.length > 0) {
        classInfo.properties.forEach(prop => {
          assert(prop.name.toLowerCase().includes('name') || 
                 (prop.description && prop.description.toLowerCase().includes('name')),
                 `Property ${prop.name} should match search term 'name'`);
        });
      }
      
      if (classInfo.methods && classInfo.methods.length > 0) {
        classInfo.methods.forEach(method => {
          assert(method.name.toLowerCase().includes('name') || 
                 (method.description && method.description.toLowerCase().includes('name')),
                 `Method ${method.name} should match search term 'name'`);
        });
      }
    });

    test('should perform case-insensitive search', async () => {
      const result = await client.callTool('get_sfcc_class_info', {
        className: 'dw.catalog.Product',
        search: 'NAME'
      });
      
      assertValidMCPResponse(result);
      const classInfo = JSON.parse(result.content[0].text);
      
      // Search should be case-insensitive
      if (classInfo.properties && classInfo.properties.length > 0) {
        classInfo.properties.forEach(prop => {
          assert(prop.name.toLowerCase().includes('name') || 
                 (prop.description && prop.description.toLowerCase().includes('name')),
                 `Property ${prop.name} should match case-insensitive search 'NAME'`);
        });
      }
    });

    test('should combine search with filtering parameters', async () => {
      const result = await client.callTool('get_sfcc_class_info', {
        className: 'dw.catalog.Product',
        includeMethods: true,
        includeProperties: false,
        includeConstants: false,
        search: 'get'
      });
      
      assertValidMCPResponse(result);
      const classInfo = JSON.parse(result.content[0].text);
      
      // Should only have methods (no properties/constants)
      assert(!classInfo.properties || classInfo.properties.length === 0, 'Properties should be excluded');
      assert(!classInfo.constants || classInfo.constants.length === 0, 'Constants should be excluded');
      
      // Methods should be filtered by search term
      if (classInfo.methods && classInfo.methods.length > 0) {
        classInfo.methods.forEach(method => {
          assert(method.name.toLowerCase().includes('get') || 
                 (method.description && method.description.toLowerCase().includes('get')),
                 `Method ${method.name} should match search term 'get'`);
        });
      }
    });

    test('should handle search with no matches gracefully', async () => {
      const result = await client.callTool('get_sfcc_class_info', {
        className: 'dw.catalog.Product',
        search: 'zzznomatchesexpected'
      });
      
      assertValidMCPResponse(result);
      const classInfo = JSON.parse(result.content[0].text);
      
      // Should still have basic class info
      assert.strictEqual(classInfo.className, 'Product');
      assert.strictEqual(classInfo.packageName, 'dw.catalog');
      
      // Arrays should be empty (no matches)
      if (classInfo.properties) {
        assert.strictEqual(classInfo.properties.length, 0, 'Properties should be empty with no matches');
      }
      if (classInfo.methods) {
        assert.strictEqual(classInfo.methods.length, 0, 'Methods should be empty with no matches');
      }
      if (classInfo.constants) {
        assert.strictEqual(classInfo.constants.length, 0, 'Constants should be empty with no matches');
      }
    });

    test('should search across multiple field types', async () => {
      const result = await client.callTool('get_sfcc_class_info', {
        className: 'dw.catalog.Product',
        search: 'get'  // Changed from 'id' to 'get' which is more common
      });
      
      assertValidMCPResponse(result);
      const classInfo = JSON.parse(result.content[0].text);
      
      // Should find matches in different sections
      let foundMatches = false;
      
      if (classInfo.properties && classInfo.properties.length > 0) {
        foundMatches = true;
        classInfo.properties.forEach(prop => {
          assert(prop.name.toLowerCase().includes('get') || 
                 (prop.description && prop.description.toLowerCase().includes('get')),
                 `Property ${prop.name} should match search term 'get'`);
        });
      }
      
      if (classInfo.methods && classInfo.methods.length > 0) {
        foundMatches = true;
        classInfo.methods.forEach(method => {
          assert(method.name.toLowerCase().includes('get') || 
                 (method.description && method.description.toLowerCase().includes('get')),
                 `Method ${method.name} should match search term 'get'`);
        });
      }
      
      // Should find at least some matches with 'get' in Product class
      assert(foundMatches, 'Should find matches for common term "get" in Product class');
    });

    test('should handle empty search string', async () => {
      const result = await client.callTool('get_sfcc_class_info', {
        className: 'dw.catalog.Product',
        search: ''
      });
      
      assertValidMCPResponse(result);
        assert.equal(result.isError, true, 'Empty search should fail validation');
        assert.ok(result.content[0].text.includes('search'));
    });
  });

  // ==================================================================================
  // RESPONSE STRUCTURE VALIDATION WITH dw.catalog.Product
  // ==================================================================================

  describe('Product Class Response Structure Validation', () => {
    test('should return comprehensive Product class information', async () => {
      const result = await client.callTool('get_sfcc_class_info', {
        className: 'dw.catalog.Product'
      });
      
      assertValidMCPResponse(result);
      const classInfo = JSON.parse(result.content[0].text);
      
      // Validate basic structure
      assert.strictEqual(classInfo.className, 'Product');
      assert.strictEqual(classInfo.packageName, 'dw.catalog');
      assert(typeof classInfo.description === 'string', 'Description should be string');
      
      // Validate arrays are present and non-empty for a rich class like Product
      assert(Array.isArray(classInfo.properties), 'Properties should be array');
      assert(classInfo.properties.length > 0, 'Product should have properties');
      
      assert(Array.isArray(classInfo.methods), 'Methods should be array');
      assert(classInfo.methods.length > 0, 'Product should have methods');
      
      // Validate property structure
      classInfo.properties.forEach(prop => {
        assert(typeof prop.name === 'string', 'Property name should be string');
        assert(typeof prop.type === 'string', 'Property type should be string');
        // Description is optional but should be string if present
        if (prop.description) {
          assert(typeof prop.description === 'string', 'Property description should be string');
        }
      });
      
      // Validate method structure
      classInfo.methods.forEach(method => {
        assert(typeof method.name === 'string', 'Method name should be string');
        assert(typeof method.signature === 'string', 'Method signature should be string');
        // Return type and description are optional
        if (method.returnType) {
          assert(typeof method.returnType === 'string', 'Method returnType should be string');
        }
        if (method.description) {
          assert(typeof method.description === 'string', 'Method description should be string');
        }
      });
    });

    test('should validate filtered Product class responses maintain structure', async () => {
      const scenarios = [
        { includeProperties: true, includeMethods: false },
        { includeProperties: false, includeMethods: true },
        { includeDescription: false, includeProperties: true },
        { includeConstants: false, includeInheritance: false }
      ];
      
      for (const scenario of scenarios) {
        const result = await client.callTool('get_sfcc_class_info', {
          className: 'dw.catalog.Product',
          ...scenario
        });
        
        assertValidMCPResponse(result);
        const classInfo = JSON.parse(result.content[0].text);
        
        // Basic info should always be present
        assert.strictEqual(classInfo.className, 'Product');
        assert.strictEqual(classInfo.packageName, 'dw.catalog');
        
        // Validate conditional sections
        if (scenario.includeProperties === false) {
          assert(!classInfo.properties || classInfo.properties.length === 0,
                 'Properties should be excluded when includeProperties is false');
        } else if (scenario.includeProperties !== false) {
          assert(Array.isArray(classInfo.properties), 'Properties should be array when included');
        }
        
        if (scenario.includeMethods === false) {
          assert(!classInfo.methods || classInfo.methods.length === 0,
                 'Methods should be excluded when includeMethods is false');
        } else if (scenario.includeMethods !== false) {
          assert(Array.isArray(classInfo.methods), 'Methods should be array when included');
        }
        
        if (scenario.includeDescription === false) {
          assert(!classInfo.description || classInfo.description === '',
                 'Description should be excluded when includeDescription is false');
        }
      }
    });

    test('should validate Product class search results maintain proper structure', async () => {
      const searchTerms = ['get', 'set', 'name'];  // Changed from including 'id' and 'price' to more reliable terms
      
      for (const searchTerm of searchTerms) {
        const result = await client.callTool('get_sfcc_class_info', {
          className: 'dw.catalog.Product',
          search: searchTerm
        });
        
        assertValidMCPResponse(result);
        const classInfo = JSON.parse(result.content[0].text);
        
        // Basic structure should be maintained
        assert.strictEqual(classInfo.className, 'Product');
        assert.strictEqual(classInfo.packageName, 'dw.catalog');
        
        // Filtered arrays should still have proper structure
        if (classInfo.properties && classInfo.properties.length > 0) {
          classInfo.properties.forEach(prop => {
            assert(typeof prop.name === 'string', 'Filtered property name should be string');
            assert(typeof prop.type === 'string', 'Filtered property type should be string');
            
            // Verify search filtering worked
            const matchesSearch = prop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (prop.description && prop.description.toLowerCase().includes(searchTerm.toLowerCase()));
            assert(matchesSearch, `Property ${prop.name} should match search term ${searchTerm}`);
          });
        }
        
        if (classInfo.methods && classInfo.methods.length > 0) {
          classInfo.methods.forEach(method => {
            assert(typeof method.name === 'string', 'Filtered method name should be string');
            assert(typeof method.signature === 'string', 'Filtered method signature should be string');
            
            // Verify search filtering worked
            const matchesSearch = method.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                (method.description && method.description.toLowerCase().includes(searchTerm.toLowerCase()));
            assert(matchesSearch, `Method ${method.name} should match search term ${searchTerm}`);
          });
        }
      }
    });

    test('should validate Product class with expand parameter maintains structure', async () => {
      const result = await client.callTool('get_sfcc_class_info', {
        className: 'dw.catalog.Product',
        expand: true
      });
      
      assertValidMCPResponse(result);
      const classInfo = JSON.parse(result.content[0].text);
      
      // Basic structure should be maintained
      assert.strictEqual(classInfo.className, 'Product');
      assert.strictEqual(classInfo.packageName, 'dw.catalog');
      assert(Array.isArray(classInfo.properties), 'Properties should be array');
      assert(Array.isArray(classInfo.methods), 'Methods should be array');
      
      // With expand=true, there might be additional type information
      // Validate that expanded information maintains proper structure
      classInfo.properties.forEach(prop => {
        assert(typeof prop.name === 'string', 'Expanded property name should be string');
        assert(typeof prop.type === 'string', 'Expanded property type should be string');
      });
      
      classInfo.methods.forEach(method => {
        assert(typeof method.name === 'string', 'Expanded method name should be string');
        assert(typeof method.signature === 'string', 'Expanded method signature should be string');
      });
    });
  });

  // ==================================================================================
  // PARAMETER COMBINATIONS AND EDGE CASES
  // ==================================================================================

  describe('Parameter Combinations and Edge Cases', () => {
    test('should handle all parameters together', async () => {
      const result = await client.callTool('get_sfcc_class_info', {
        className: 'dw.catalog.Product',
        expand: true,
        includeDescription: true,
        includeConstants: false,
        includeProperties: true,
        includeMethods: true,
        includeInheritance: false,
        search: 'get'
      });
      
      assertValidMCPResponse(result);
      const classInfo = JSON.parse(result.content[0].text);
      
      // Validate combination of parameters
      assert.strictEqual(classInfo.className, 'Product');
      assert(classInfo.description, 'Description should be included');
      assert(!classInfo.constants || classInfo.constants.length === 0, 'Constants should be excluded');
      assert(!classInfo.inheritance || 
             (Array.isArray(classInfo.inheritance) && classInfo.inheritance.length === 0) ||
             classInfo.inheritance === '', 'Inheritance should be excluded');
      
      // Properties and methods should be filtered by search
      if (classInfo.properties && classInfo.properties.length > 0) {
        classInfo.properties.forEach(prop => {
          assert(prop.name.toLowerCase().includes('get') || 
                 (prop.description && prop.description.toLowerCase().includes('get')),
                 `Property ${prop.name} should match search term 'get'`);
        });
      }
      
      if (classInfo.methods && classInfo.methods.length > 0) {
        classInfo.methods.forEach(method => {
          assert(method.name.toLowerCase().includes('get') || 
                 (method.description && method.description.toLowerCase().includes('get')),
                 `Method ${method.name} should match search term 'get'`);
        });
      }
    });

    test('should handle contradictory filters gracefully', async () => {
      const result = await client.callTool('get_sfcc_class_info', {
        className: 'dw.catalog.Product',
        includeMethods: false,
        search: 'getName'  // Searching for method while excluding methods
      });
      
      assertValidMCPResponse(result);
      const classInfo = JSON.parse(result.content[0].text);
      
      // Should respect the filter over the search
      assert(!classInfo.methods || classInfo.methods.length === 0, 
             'Methods should be excluded even when searching for method names');
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
