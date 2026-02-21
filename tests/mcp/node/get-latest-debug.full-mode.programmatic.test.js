import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

// Optimized programmatic tests focusing on complex business logic, dynamic validation, and integration scenarios
// Basic functional testing is handled by the YAML tests for better CI reliability
describe('get_latest_debug - Full Mode Programmatic Tests (Optimized)', () => {
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
    client.clearAllBuffers(); // Recommended - comprehensive protection
  });

  // Enhanced helper functions for complex validations
  function assertValidMCPResponse(result) {
    assert.ok(result.content, 'Should have content');
    assert.ok(Array.isArray(result.content), 'Content should be array');
    assert.equal(typeof result.isError, 'boolean', 'isError should be boolean');
  }



  function assertSuccessResponse(result) {
    assertValidMCPResponse(result);
    assert.equal(result.isError, false, 'Should not be an error response');
    assert.equal(result.content[0].type, 'text');
  }

  function validateDebugLogStructure(result, expectedLimit) {
    assertSuccessResponse(result);
    const text = result.content[0].text;
    
    // Validate essential debug log components
    assert.ok(text.includes(`Latest ${expectedLimit} debug messages`),
      `Should mention "${expectedLimit}" debug messages`);
    assert.ok(/debug-blade-\d{8}-\d{6}\.log/.test(text),
      'Should contain debug log file name pattern');
    assert.ok(text.includes('DEBUG'), 'Should contain DEBUG level entries');
    assert.ok(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3} GMT/.test(text),
      'Should contain GMT timestamp pattern');
  }

  function getCurrentDateString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }

  // ========================================
  // COMPLEX BUSINESS LOGIC VALIDATION
  // ========================================

  describe('Business Logic and Content Analysis', () => {
    test('should parse and validate SFCC debug log structure comprehensively', async () => {
      const result = await client.callTool('get_latest_debug', { limit: 5 });
      
      validateDebugLogStructure(result, 5);
      
      const text = result.content[0].text;
      
      // Validate SFCC-specific patterns that require complex logic
      const sfccPatterns = [
        /PipelineCallServlet|SystemJobThread/,
        /Sites-RefArchGlobal-Site/,
        /PipelineCall|custom \[\]/,
        /---/ // Entry separators
      ];
      
      sfccPatterns.forEach((pattern, index) => {
        assert.ok(pattern.test(text), 
          `Should contain SFCC pattern ${index}: ${pattern.toString()}`);
      });
      
      // Validate chronological ordering (newest first) - complex logic
      const entries = text.split('---').filter(entry => entry.trim());
      if (entries.length > 1) {
        const timestamps = entries.map(entry => {
          const match = entry.match(/\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3} GMT)\]/);
          return match ? new Date(match[1]) : null;
        }).filter(Boolean);
        
        for (let i = 1; i < timestamps.length; i++) {
          assert.ok(timestamps[i-1] >= timestamps[i], 
            'Debug entries should be in chronological order (newest first)');
        }
      }
    });

    test('should validate complex parameter combinations with business rules', async () => {
      const testScenarios = [
        { 
          params: { limit: 1 }, 
          validator: (result) => {
            assert.ok(result.content[0].text.includes('Latest 1 debug messages'));
            assert.ok(!result.content[0].text.includes('---'), 
              'Single entry should not have separators');
          }
        },
        { 
          params: { limit: 3, date: getCurrentDateString() }, 
          validator: (result) => {
            assert.ok(result.content[0].text.includes('Latest 3 debug messages'));
            const separatorCount = (result.content[0].text.match(/---/g) || []).length;
            assert.ok(separatorCount >= 1, 'Multiple entries should have separators');
          }
        },
        { 
          params: { limit: 20 }, 
          validator: (result) => {
            assert.ok(result.content[0].text.includes('Latest 20 debug messages'));
            // Should handle larger limits gracefully
            assert.ok(result.content[0].text.length > 1000, 
              'Large limit should return substantial content');
          }
        }
      ];

      for (const scenario of testScenarios) {
        const result = await client.callTool('get_latest_debug', scenario.params);
        assertSuccessResponse(result);
        scenario.validator(result);
      }
    });
  });

  // ========================================
  // DYNAMIC PARAMETER VALIDATION
  // ========================================

  describe('Dynamic Parameter Validation', () => {
    test('should validate parameter types with complex edge case matrix', async () => {
      const testMatrix = [
        // Valid scenarios
        { params: { limit: 5 }, expectSuccess: true, description: 'valid number limit' },
        { params: { date: '20240101' }, expectSuccess: true, description: 'valid date format' },
        { params: { limit: 1, date: getCurrentDateString() }, expectSuccess: true, description: 'valid combination' },
        
        // Invalid scenarios requiring dynamic validation
          { params: { limit: '5' }, expectSuccess: false, expectedError: 'limit must be a number', description: 'string limit' },
          { params: { limit: 0 }, expectSuccess: false, expectedError: 'limit must be >= 1', description: 'zero limit' },
          { params: { limit: -1 }, expectSuccess: false, expectedError: 'limit must be >= 1', description: 'negative limit' },
          { params: { limit: 9999 }, expectSuccess: false, expectedError: 'limit must be <= 1000', description: 'excessive limit' },
        
        // Complex type scenarios
          { params: { limit: null }, expectSuccess: false, expectedError: 'limit must be a number', description: 'null limit' },
        { params: { limit: [] }, expectSuccess: false, description: 'array limit' },
        { params: { limit: {} }, expectSuccess: false, description: 'object limit' },
      ];

      for (const testCase of testMatrix) {
        const result = await client.callTool('get_latest_debug', testCase.params);
        assertValidMCPResponse(result);
        
        if (testCase.expectSuccess) {
          assert.equal(result.isError, false, 
            `Should succeed for ${testCase.description}: ${JSON.stringify(testCase.params)}`);
        } else {
          assert.equal(result.isError, true, 
            `Should fail for ${testCase.description}: ${JSON.stringify(testCase.params)}`);
          
          if (testCase.expectedError) {
            assert.ok(result.content[0].text.includes(testCase.expectedError),
              `Should contain expected error for ${testCase.description}`);
          }
        }
      }
    });

    test('should handle date parameter edge cases with business logic', async () => {
      const dateScenarios = [
          { date: 'invalid-date', expectError: true, expectedText: 'date must match pattern' },
        { date: '20261231', expectSuccess: true }, // Future date
        { date: '20240101', expectSuccess: true }, // Past date
          { date: 123, expectError: true, expectedText: 'date must be a non-empty string' },
          { date: '2024-01-01', expectError: true, expectedText: 'date must match pattern' },
      ];

      for (const scenario of dateScenarios) {
        const result = await client.callTool('get_latest_debug', { 
          date: scenario.date, 
          limit: 1 
        });
        
        assertValidMCPResponse(result);
        
          if (scenario.expectSuccess) {
          assert.equal(result.isError, false, 
            `Date ${scenario.date} should be handled gracefully`);
        }

          if (scenario.expectError) {
            assert.equal(result.isError, true, `Date ${scenario.date} should fail validation`);
          }
        
          if (scenario.expectedText) {
            assert.ok(result.content[0].text.includes(scenario.expectedText),
            `Should contain expected message for date ${scenario.date}`);
        }
      }
    });
  });

  // ========================================
  // INTEGRATION AND WORKFLOW TESTING
  // ========================================

  describe('Integration and Multi-Step Workflows', () => {
    test('should integrate with MCP protocol and tool ecosystem', async () => {
      // Step 1: Verify tool discovery
      const tools = await client.listTools();
      const debugTool = tools.find(tool => tool.name === 'get_latest_debug');
      
      assert.ok(debugTool, 'get_latest_debug tool should be available');
      assert.ok(debugTool.description, 'Tool should have description');
      assert.ok(debugTool.inputSchema, 'Tool should have input schema');
      assert.equal(debugTool.inputSchema.type, 'object');
      
      // Step 2: Validate schema properties
      const properties = debugTool.inputSchema.properties;
      assert.ok(properties.limit, 'Should have limit parameter in schema');
      assert.ok(properties.date, 'Should have date parameter in schema');
      
      // Step 3: Verify execution matches schema
      const result = await client.callTool('get_latest_debug', {});
      assertValidMCPResponse(result);
    });

    test('should maintain consistency with related log tools', async () => {
      // Get results from multiple log tools for comparison
      const debugResult = await client.callTool('get_latest_debug', { limit: 3 });
      const infoResult = await client.callTool('get_latest_info', { limit: 3 });
      
      assertValidMCPResponse(debugResult);
      assertValidMCPResponse(infoResult);
      
      // Validate structural consistency
      assert.equal(debugResult.content.length, infoResult.content.length,
        'Debug and info tools should have similar response structure');
      assert.equal(typeof debugResult.isError, typeof infoResult.isError,
        'Both tools should handle errors consistently');
      assert.equal(debugResult.content[0].type, infoResult.content[0].type,
        'Content types should be consistent across log tools');
    });

    test('should support progressive parameter refinement workflow', async () => {
      // Workflow: Start broad, then narrow down
      
      // Step 1: Get initial debug overview
      const broadResult = await client.callTool('get_latest_debug', { limit: 10 });
      assertSuccessResponse(broadResult);
      
      // Step 2: Narrow down to specific recent entries
      const recentResult = await client.callTool('get_latest_debug', { 
        limit: 3, 
        date: getCurrentDateString() 
      });
      assertSuccessResponse(recentResult);
      
      // Step 3: Focus on single most recent entry
      const focusedResult = await client.callTool('get_latest_debug', { limit: 1 });
      assertSuccessResponse(focusedResult);
      
      // Validate progressive refinement logic
      assert.ok(broadResult.content[0].text.length >= recentResult.content[0].text.length,
        'Broader search should return more content');
      assert.ok(recentResult.content[0].text.length >= focusedResult.content[0].text.length,
        'More focused search should return less content');
    });
  });

  // ========================================
  // ERROR RECOVERY AND RESILIENCE
  // ========================================

  describe('Error Recovery and Resilience', () => {
    test('should recover gracefully from various error conditions', async () => {
      // Test sequence of various error conditions followed by recovery
      const errorSequence = [
        { limit: 'invalid-string' },
        { limit: -50 },
        { limit: null },
        { date: null, limit: 'bad' },
        { unknownParam: 'test', limit: [] }
      ];
      
      // Execute error sequence - should not break the server
      for (const errorParams of errorSequence) {
        const result = await client.callTool('get_latest_debug', errorParams);
        assertValidMCPResponse(result);
        // Don't assert success/failure as some may be handled gracefully
      }
      
      // Verify server recovers and works normally
      const recoveryResult = await client.callTool('get_latest_debug', { limit: 2 });
      assertSuccessResponse(recoveryResult);
      validateDebugLogStructure(recoveryResult, 2);
    });

    test('should maintain state consistency across sequential operations', async () => {
      // Test that multiple operations don't interfere with each other
      const operations = [
        { limit: 1 },
        { limit: 5 },
        { date: getCurrentDateString(), limit: 2 },
        { limit: 10 },
        { date: '20240101', limit: 1 }
      ];
      
      const results = [];
      
      // Execute operations sequentially (no concurrent requests per AGENTS.md)
      for (const params of operations) {
        const result = await client.callTool('get_latest_debug', params);
        results.push({ params, result });
      }
      
      // Validate each operation succeeded independently
      results.forEach(({ params, result }, index) => {
        assertValidMCPResponse(result);
        assert.equal(result.isError, false, 
          `Operation ${index + 1} should succeed: ${JSON.stringify(params)}`);
        
        // Validate response format consistency
        assert.equal(result.content.length, 1, 'Should have exactly one content item');
        assert.equal(result.content[0].type, 'text', 'Content type should be text');
        assert.ok(result.content[0].text.length > 0, 'Content should not be empty');
      });
    });
  });
});
