import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

describe('evaluate_script - Full Mode Programmatic Tests', () => {
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

  // Helper functions for common validations
  function assertValidMCPResponse(result) {
    assert.ok(result.content, 'Should have content');
    assert.ok(Array.isArray(result.content), 'Content should be array');
    assert.equal(typeof result.isError, 'boolean', 'isError should be boolean');
    assert.equal(result.content[0].type, 'text', 'Content should be text type');
  }

  function parseResultJSON(result) {
    const text = result.content[0].text;
    return JSON.parse(text);
  }

  function assertSuccessResponse(result) {
    assertValidMCPResponse(result);
    assert.equal(result.isError, false, 'Should not be an MCP error response');

    const data = parseResultJSON(result);
    assert.equal(data.success, true, 'Script execution should be successful');
    assert.ok(typeof data.executionTimeMs === 'number', 'Should include execution time');
    assert.ok(data.result !== undefined, 'Should include result');
  }

  // Core functionality tests
  describe('Core Functionality', () => {
    test('should evaluate simple arithmetic expression', async () => {
      const result = await client.callTool('evaluate_script', {
        script: '1 + 1'
      });
      
      assertSuccessResponse(result);
      
      const data = parseResultJSON(result);
      assert.equal(data.result, '2', 'Should return correct arithmetic result');
    });

    test('should evaluate expression with return statement', async () => {
      const result = await client.callTool('evaluate_script', {
        script: 'return 1 + 1;'
      });
      
      assertSuccessResponse(result);
      
      const data = parseResultJSON(result);
      assert.equal(data.result, '2', 'Should handle return statement');
    });

    test('should include execution time in response', async () => {
      const result = await client.callTool('evaluate_script', {
        script: '1 + 1'
      });
      
      assertSuccessResponse(result);
      
      const data = parseResultJSON(result);
      assert.ok(data.executionTimeMs >= 0, 'Execution time should be non-negative');
      assert.ok(data.executionTimeMs < 30000, 'Execution time should be reasonable');
    });

    test('should evaluate SFCC Site API expression', async () => {
      const result = await client.callTool('evaluate_script', {
        script: 'var Site = require("dw/system/Site"); return Site.current.ID;'
      });
      
      assertSuccessResponse(result);
      
      const data = parseResultJSON(result);
      assert.equal(data.result, 'MockSiteID', 'Should return mocked Site ID');
    });

    test('should evaluate ProductMgr expression', async () => {
      const result = await client.callTool('evaluate_script', {
        script: 'var ProductMgr = require("dw/catalog/ProductMgr"); return ProductMgr.getProduct("12345");'
      });
      
      assertSuccessResponse(result);
      
      const data = parseResultJSON(result);
      assert.equal(data.result, 'MockProduct', 'Should return mocked product');
    });

    test('should evaluate JSON.stringify expression', async () => {
      const result = await client.callTool('evaluate_script', {
        script: 'return JSON.stringify({test: "hello"});'
      });
      
      assertSuccessResponse(result);
      
      const data = parseResultJSON(result);
      assert.equal(data.result, '{"test":"hello"}', 'Should return JSON string');
    });
  });

  // Parameter handling tests
  describe('Parameter Handling', () => {
    test('should accept siteId parameter', async () => {
      const result = await client.callTool('evaluate_script', {
        script: '1 + 1',
        siteId: 'RefArch'
      });
      
      assertSuccessResponse(result);
    });

    test('should accept different siteId values', async () => {
      const result = await client.callTool('evaluate_script', {
        script: '1 + 1',
        siteId: 'RefArchGlobal'
      });
      
      assertSuccessResponse(result);
    });

    test('should accept siteId in Sites-{id}-Site format', async () => {
      const result = await client.callTool('evaluate_script', {
        script: '1 + 1',
        siteId: 'Sites-RefArchGlobal-Site'
      });

      assertSuccessResponse(result);
    });

    test('should accept locale parameter', async () => {
      const result = await client.callTool('evaluate_script', {
        script: '1 + 1',
        locale: 'default'
      });

      assertSuccessResponse(result);
    });

    test('should accept timeout parameter', async () => {
      const result = await client.callTool('evaluate_script', {
        script: '1 + 1',
        timeout: 15000
      });
      
      assertSuccessResponse(result);
    });

    test('should accept custom breakpoint parameters', async () => {
      const result = await client.callTool('evaluate_script', {
        script: '1 + 1',
        breakpointFile: '/app_storefront_base/cartridge/controllers/Default.js',
        breakpointLine: 26
      });
      
      assertSuccessResponse(result);
    });

    test('should accept custom breakpoint file without line (defaults to lines 1-50)', async () => {
      const result = await client.callTool('evaluate_script', {
        script: '1 + 1',
        breakpointFile: '/app_storefront_base/cartridge/controllers/Default.js'
      });

      assertSuccessResponse(result);
    });

    test('should use default siteId when not provided', async () => {
      const result = await client.callTool('evaluate_script', {
        script: '1 + 1'
      });
      
      assertSuccessResponse(result);
      // Default siteId is RefArch - script should still execute successfully
    });
  });

  // Error handling tests
  describe('Error Handling', () => {
    test('should fail when script parameter is missing', async () => {
      const result = await client.callTool('evaluate_script', {});
      
      assertValidMCPResponse(result);
      assert.equal(result.isError, true, 'Should be an error when script is missing');
      assert.ok(result.content[0].text.toLowerCase().includes('script') || 
                result.content[0].text.toLowerCase().includes('required'),
        'Error should mention script or required');
    });

    test('should fail when script parameter is empty string', async () => {
      const result = await client.callTool('evaluate_script', {
        script: ''
      });
      
      assertValidMCPResponse(result);
      assert.equal(result.isError, true, 'Should be an error when script is empty');
    });

    test('should handle null script parameter', async () => {
      const result = await client.callTool('evaluate_script', {
        script: null
      });
      
      assertValidMCPResponse(result);
      assert.equal(result.isError, true, 'Should be an error when script is null');
    });
  });

  // Response structure tests
  describe('Response Structure', () => {
    test('should return properly structured success response', async () => {
      const result = await client.callTool('evaluate_script', {
        script: '1 + 1'
      });
      
      assertValidMCPResponse(result);
      assert.equal(result.isError, false, 'Should not be an MCP error');
      
      const data = parseResultJSON(result);
      
      // Verify all expected fields
      assert.ok('success' in data, 'Should have success field');
      assert.ok('result' in data, 'Should have result field');
      assert.ok('executionTimeMs' in data, 'Should have executionTimeMs field');
      
      assert.equal(typeof data.success, 'boolean', 'success should be boolean');
      assert.equal(typeof data.executionTimeMs, 'number', 'executionTimeMs should be number');
    });

    test('should return properly structured error response', async () => {
      const result = await client.callTool('evaluate_script', {});
      
      assertValidMCPResponse(result);
      // Validation errors should have isError true
      assert.equal(result.isError, true, 'Validation error should have isError=true');
    });

    test('should return JSON-formatted text content', async () => {
      const result = await client.callTool('evaluate_script', {
        script: '1 + 1'
      });
      
      assertValidMCPResponse(result);
      
      // Verify content is valid JSON
      const text = result.content[0].text;
      let parsed;
      assert.doesNotThrow(() => {
        parsed = JSON.parse(text);
      }, 'Content should be valid JSON');
      
      assert.ok(typeof parsed === 'object', 'Parsed content should be an object');
    });
  });

  // Tool metadata tests
  describe('Tool Metadata', () => {
    test('should be listed in available tools', async () => {
      const tools = await client.listTools();
      const toolNames = tools.map(t => t.name);
      
      assert.ok(toolNames.includes('evaluate_script'), 'evaluate_script should be in tool list');
    });

    test('should have correct input schema', async () => {
      const tools = await client.listTools();
      const evalTool = tools.find(t => t.name === 'evaluate_script');
      
      assert.ok(evalTool, 'Tool should exist');
      assert.ok(evalTool.inputSchema, 'Tool should have inputSchema');
      assert.equal(evalTool.inputSchema.type, 'object', 'Schema type should be object');
      
      // Check required fields
      assert.ok(evalTool.inputSchema.required.includes('script'), 'script should be required');
      
      // Check properties
      const props = evalTool.inputSchema.properties;
      assert.ok(props.script, 'Should have script property');
      assert.ok(props.siteId, 'Should have siteId property');
      assert.ok(props.locale, 'Should have locale property');
      assert.ok(props.timeout, 'Should have timeout property');
    });

    test('should have description', async () => {
      const tools = await client.listTools();
      const evalTool = tools.find(t => t.name === 'evaluate_script');
      
      assert.ok(evalTool.description, 'Tool should have description');
      assert.ok(evalTool.description.length > 20, 'Description should be meaningful');
    });
  });

  // Performance tests
  describe('Performance', () => {
    test('should complete simple evaluation within timeout', async () => {
      const startTime = Date.now();
      
      const result = await client.callTool('evaluate_script', {
        script: '1 + 1',
        timeout: 10000
      });
      
      const elapsed = Date.now() - startTime;
      
      assertSuccessResponse(result);
      assert.ok(elapsed < 10000, `Should complete within timeout (took ${elapsed}ms)`);
    });

    test('should report accurate execution time', async () => {
      const result = await client.callTool('evaluate_script', {
        script: '1 + 1'
      });
      
      assertSuccessResponse(result);
      
      const data = parseResultJSON(result);
      // Execution time should be positive and reasonable
      assert.ok(data.executionTimeMs > 0, 'Execution time should be positive');
      assert.ok(data.executionTimeMs < 15000, 'Execution time should be less than 15 seconds');
    });
  });

  // Multi-step workflow tests
  describe('Multi-step Workflows', () => {
    test('should execute multiple scripts sequentially', async () => {
      // First evaluation
      const result1 = await client.callTool('evaluate_script', {
        script: '1 + 1'
      });
      assertSuccessResponse(result1);
      
      // Clear buffers between calls
      client.clearAllBuffers();
      
      // Second evaluation
      const result2 = await client.callTool('evaluate_script', {
        script: '2 + 2'
      });
      assertSuccessResponse(result2);
      
      // Both should have succeeded independently
      const data1 = parseResultJSON(result1);
      const data2 = parseResultJSON(result2);
      
      assert.equal(data1.result, '2', 'First result should be 2');
      // Note: Mock server returns 'MockResult' for unrecognized expressions
      assert.ok(data2.result, 'Second result should exist');
    });

    test('should handle alternating success and error scenarios', async () => {
      // Success case
      const successResult = await client.callTool('evaluate_script', {
        script: '1 + 1'
      });
      assertSuccessResponse(successResult);
      
      client.clearAllBuffers();
      
      // Error case (missing script)
      const errorResult = await client.callTool('evaluate_script', {});
      assertValidMCPResponse(errorResult);
      assert.equal(errorResult.isError, true, 'Should be an error');
      
      client.clearAllBuffers();
      
      // Success case again (should still work after error)
      const successResult2 = await client.callTool('evaluate_script', {
        script: '1 + 1'
      });
      assertSuccessResponse(successResult2);
    });
  });
});
