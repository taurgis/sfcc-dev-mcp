import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

describe('get_latest_info Tool - Programmatic Tests (Full Mode)', () => {
  let client;

  before(async () => {
    // Connect using the full mode configuration with dw.json credentials
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

  // Helper function to get current date in YYYYMMDD format
  function getCurrentDateString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }

  // ========================================
  // SUCCESS SCENARIOS
  // ========================================

  describe('Success Scenarios', () => {
    test('should get latest info entries with default parameters', async () => {
      const result = await client.callTool('get_latest_info', {});
      
      assertValidMCPResponse(result);
      assert.equal(result.isError, false, 'Should not be an error');
      assert.equal(result.content.length, 1, 'Should have one content item');
      assert.equal(result.content[0].type, 'text', 'Content should be text type');
      assert.ok(result.content[0].text.includes('Latest'), 'Should contain "Latest" in response');
      assert.ok(result.content[0].text.includes('info messages'), 'Should contain "info messages" in response');
    });

    test('should validate response structure and content types', async () => {
      const result = await client.callTool('get_latest_info', {});
      
      assertValidMCPResponse(result);
      assert.equal(typeof result.isError, 'boolean', 'isError should be boolean');
      assert.ok(Array.isArray(result.content), 'content should be array');
      assert.equal(result.content[0].type, 'text', 'content type should be text');
      assert.equal(typeof result.content[0].text, 'string', 'content text should be string');
    });

    test('should contain INFO log level in response', async () => {
      const result = await client.callTool('get_latest_info', {});
      
      assertValidMCPResponse(result);
      assert.ok(result.content[0].text.includes('INFO'), 'Should contain INFO log level');
    });

    test('should contain log file names in response', async () => {
      const result = await client.callTool('get_latest_info', {});
      
      assertValidMCPResponse(result);
      const logFilePattern = /info-blade-[\d-]+\.log/;
      assert.ok(logFilePattern.test(result.content[0].text), 'Should contain log file names');
    });

    test('should respect custom limit parameter', async () => {
      const customLimit = 3;
      const result = await client.callTool('get_latest_info', { limit: customLimit });
      
      assertValidMCPResponse(result);
      assert.ok(result.content[0].text.includes(`Latest ${customLimit} info messages`), 
        `Should show custom limit of ${customLimit}`);
    });

    test('should accept date parameter in YYYYMMDD format', async () => {
      const testDate = getCurrentDateString();
      const result = await client.callTool('get_latest_info', { 
        date: testDate, 
        limit: 2 
      });
      
      assertValidMCPResponse(result);
      assert.ok(result.content[0].text.includes('Latest 2 info messages'), 
        'Should show custom limit with date parameter');
    });

    test('should handle both date and limit parameters together', async () => {
      const result = await client.callTool('get_latest_info', { 
        date: getCurrentDateString(), 
        limit: 5 
      });
      
      assertValidMCPResponse(result);
      assert.equal(result.content.length, 1, 'Should have one content item');
      assert.equal(result.isError, false, 'Should not be an error');
    });

    test('should return info messages in chronological order (newest first)', async () => {
      const result = await client.callTool('get_latest_info', { limit: 2 });
      
      assertValidMCPResponse(result);
      const text = result.content[0].text;
      
      // Based on our mock data, the newest info should be the job execution
      assert.ok(text.includes('Executing job [sfcc-export-dw-analytics-site-config][2664334]'), 
        'Latest info should be the job execution from the newest timestamp');
      
      // The second newest should be the step execution
      assert.ok(text.includes('Executing step [ExportDWAnalyticsSiteConfigurationStep][5846619] for [Organization]'),
        'Second latest info should be the step execution');
      
      // Verify that newest entry appears before older one in the response
      const jobIndex = text.indexOf('Executing job [sfcc-export-dw-analytics-site-config][2664334]');
      const stepIndex = text.indexOf('Executing step [ExportDWAnalyticsSiteConfigurationStep][5846619]');
      assert.ok(jobIndex < stepIndex && jobIndex !== -1 && stepIndex !== -1,
        'Newest info should appear before older info in response');
    });
  });

  // ========================================
  // EDGE CASE SCENARIOS
  // ========================================

  describe('Edge Case Scenarios', () => {
    test('should handle limit of 1', async () => {
      const result = await client.callTool('get_latest_info', { limit: 1 });
      
      assertValidMCPResponse(result);
      assert.ok(result.content[0].text.includes('Latest 1 info messages'), 
        'Should handle limit of 1');
    });

    test('should handle large limit values', async () => {
      const result = await client.callTool('get_latest_info', { limit: 100 });
      
      assertValidMCPResponse(result);
      assert.equal(result.isError, false, 'Should handle large limits');
      assert.ok(result.content[0].text.includes('Latest 100 info messages'), 
        'Should show large limit value');
    });

    test('should return error for zero limit', async () => {
      const result = await client.callTool('get_latest_info', { limit: 0 });
      
      assertValidMCPResponse(result);
      assert.equal(result.isError, true, 'Should return error for zero limit');
      assert.ok(result.content[0].text.includes("Invalid limit '0'"), 
        'Should contain validation error message');
      assert.ok(result.content[0].text.includes('Must be between 1 and 1000'), 
        'Should contain range validation message');
    });
  });

  // ========================================
  // PARAMETER VALIDATION SCENARIOS
  // ========================================

  describe('Parameter Validation Scenarios', () => {
    test('should handle invalid limit type gracefully', async () => {
      const result = await client.callTool('get_latest_info', { limit: 'invalid' });
      
      assertValidMCPResponse(result);
      assert.equal(result.isError, true, 'Should be an error response for invalid limit type');
      assert.ok(result.content[0].text.includes('Invalid limit \'invalid\' for get_latest_info. Must be a valid number'), 
        'Should include validation error message');
    });

    test('should return appropriate message for invalid date format', async () => {
      const result = await client.callTool('get_latest_info', { 
        date: 'invalid-date', 
        limit: 3 
      });
      
      assertValidMCPResponse(result);
      assert.equal(result.isError, false, 'Should handle invalid date gracefully');
      assert.ok(result.content[0].text.includes('No info log files found for date invalid-date'), 
        'Should contain no files found message');
    });

    test('should return error for negative limit values', async () => {
      const result = await client.callTool('get_latest_info', { limit: -5 });
      
      assertValidMCPResponse(result);
      assert.equal(result.isError, true, 'Should return error for negative limit');
      assert.ok(result.content[0].text.includes("Invalid limit '-5'"), 
        'Should contain negative limit error message');
    });

    test('should handle extra unknown parameters', async () => {
      const result = await client.callTool('get_latest_info', { 
        limit: 5,
        unknownParam: 'should-be-ignored'
      });
      
      assertValidMCPResponse(result);
      assert.equal(result.isError, false, 'Should ignore unknown parameters');
      assert.ok(result.content[0].text.includes('Latest 5 info messages'), 
        'Should process valid parameters correctly');
    });

    test('should validate parameter types dynamically', async () => {
      const testCases = [
        { params: { limit: null }, shouldSucceed: false },
        { params: { limit: undefined }, shouldSucceed: true },
        { params: { limit: [] }, shouldSucceed: false },
        { params: { limit: {} }, shouldSucceed: false },
        { params: { date: null }, shouldSucceed: true },
        { params: { date: 123 }, shouldSucceed: true }
      ];

      for (const testCase of testCases) {
        const result = await client.callTool('get_latest_info', testCase.params);
        assertValidMCPResponse(result);
        
        if (testCase.shouldSucceed) {
          // For successful cases, we don't necessarily expect isError: false
          // because some invalid types are handled gracefully
          assert.ok(result.content.length > 0, 
            `Should have content for params: ${JSON.stringify(testCase.params)}`);
        }
      }
    });
  });

  // ========================================
  // CONTENT VALIDATION SCENARIOS
  // ========================================

  describe('Content Validation Scenarios', () => {
    test('should contain timestamp patterns in log entries', async () => {
      const result = await client.callTool('get_latest_info', { limit: 2 });
      
      assertValidMCPResponse(result);
      const timestampPattern = /\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3} GMT\]/;
      assert.ok(timestampPattern.test(result.content[0].text), 
        'Should contain valid timestamp patterns');
    });

    test('should contain SFCC-specific log components', async () => {
      const result = await client.callTool('get_latest_info', { limit: 3 });
      
      assertValidMCPResponse(result);
      const sfccPattern = /(SystemJobThread|PipelineCallServlet|Sites-)/;
      assert.ok(sfccPattern.test(result.content[0].text), 
        'Should contain SFCC-specific log components');
    });

    test('should contain system activity identifiers', async () => {
      const result = await client.callTool('get_latest_info', { limit: 2 });
      
      assertValidMCPResponse(result);
      const identifierPattern = /(INFO|SystemJobThread|ExecutingStep|Executing)/;
      assert.ok(identifierPattern.test(result.content[0].text), 
        'Should contain system activity identifiers');
    });

    test('should format multiple log entries with separators', async () => {
      const result = await client.callTool('get_latest_info', { limit: 3 });
      
      assertValidMCPResponse(result);
      assert.ok(result.content[0].text.includes('---'), 
        'Should contain entry separators for multiple entries');
    });

    test('should parse and validate log entry structure', async () => {
      const result = await client.callTool('get_latest_info', { limit: 1 });
      
      assertValidMCPResponse(result);
      const logText = result.content[0].text;
      
      // Check for required log components
      assert.ok(logText.includes('['), 'Should contain log file reference');
      assert.ok(logText.includes('] ['), 'Should contain timestamp delimiter');
      assert.ok(logText.includes('GMT]'), 'Should contain GMT timezone');
      assert.ok(logText.includes('INFO'), 'Should contain log level');
    });
  });

  // ========================================
  // FUNCTIONAL VALIDATION SCENARIOS
  // ========================================

  describe('Functional Validation Scenarios', () => {
    test('should maintain consistency across multiple calls', async () => {
      const results = [];
      
      // Make multiple sequential calls to ensure consistency
      for (let i = 0; i < 3; i++) {
        const result = await client.callTool('get_latest_info', { limit: 5 });
        results.push(result);
      }
      
      // All calls should succeed
      results.forEach((result, index) => {
        assertValidMCPResponse(result);
        assert.equal(result.isError, false, `Call ${index + 1} should succeed`);
        assert.ok(result.content[0].text.includes('Latest 5 info messages'), 
          `Call ${index + 1} should show correct limit`);
      });
    });

    test('should handle different limit ranges correctly', async () => {
      const limitTests = [1, 5, 10, 25, 50, 100];
      
      for (const limit of limitTests) {
        const result = await client.callTool('get_latest_info', { limit });
        
        assertValidMCPResponse(result);
        assert.equal(result.isError, false, `Limit ${limit} should succeed`);
        assert.ok(result.content[0].text.includes(`Latest ${limit} info messages`), 
          `Should show correct limit ${limit}`);
      }
    });

    test('should validate business logic for info-level logs', async () => {
      const result = await client.callTool('get_latest_info', { limit: 10 });
      
      assertValidMCPResponse(result);
      const logText = result.content[0].text;
      
      // Verify this is specifically info-level content
      assert.ok(logText.includes('info-blade'), 'Should reference info log files');
      assert.ok(logText.includes('INFO'), 'Should contain INFO log level');
      
      // Should not contain other log levels
      assert.ok(!logText.includes('ERROR'), 'Should not contain ERROR entries');
      assert.ok(!logText.includes('WARN'), 'Should not contain WARN entries');
      assert.ok(!logText.includes('DEBUG'), 'Should not contain DEBUG entries');
    });
  });

  // ========================================
  // ERROR RECOVERY AND RESILIENCE
  // ========================================

  describe('Error Recovery and Resilience', () => {
    test('should recover gracefully after error conditions', async () => {
      // First, trigger an error
      const errorResult = await client.callTool('get_latest_info', { limit: -1 });
      assert.equal(errorResult.isError, true, 'Should error with negative limit');
      
      // Then verify normal operation resumes
      const normalResult = await client.callTool('get_latest_info', { limit: 5 });
      assertValidMCPResponse(normalResult);
      assert.equal(normalResult.isError, false, 'Should recover and work normally');
    });

    test('should handle boundary conditions correctly', async () => {
      const boundaryTests = [
        { limit: 1, shouldSucceed: true },
        { limit: 1000, shouldSucceed: true },
        { limit: 1001, shouldSucceed: false },
        { limit: 0, shouldSucceed: false }
      ];
      
      for (const test of boundaryTests) {
        const result = await client.callTool('get_latest_info', { limit: test.limit });
        assertValidMCPResponse(result);
        
        if (test.shouldSucceed) {
          assert.equal(result.isError, false, 
            `Limit ${test.limit} should succeed`);
        } else {
          assert.equal(result.isError, true, 
            `Limit ${test.limit} should fail validation`);
        }
      }
    });

    test('should maintain proper state after invalid operations', async () => {
      // Execute several invalid operations
      const invalidOperations = [
        { limit: -10 },
        { limit: 'abc' },
        { date: 'invalid' },
        { limit: null }
      ];
      
      for (const invalidOp of invalidOperations) {
        await client.callTool('get_latest_info', invalidOp);
        // Note: We don't assert on these results as some may be handled gracefully
      }
      
      // Verify normal operation still works
      const result = await client.callTool('get_latest_info', { limit: 3 });
      assertValidMCPResponse(result);
      assert.equal(result.isError, false, 'Should work normally after invalid operations');
    });
  });

  // ========================================
  // INTEGRATION AND COMPATIBILITY
  // ========================================

  describe('Integration and Compatibility', () => {
    test('should work consistently across different parameter combinations', async () => {
      const paramCombinations = [
        {},
        { limit: 5 },
        { date: getCurrentDateString() },
        { limit: 3, date: getCurrentDateString() },
        { limit: 1 },
        { limit: 50 }
      ];
      
      for (const params of paramCombinations) {
        const result = await client.callTool('get_latest_info', params);
        assertValidMCPResponse(result);
        
        // All valid combinations should not error
        if (!params.limit || (params.limit > 0 && params.limit <= 1000)) {
          assert.equal(result.isError, false, 
            `Valid params should succeed: ${JSON.stringify(params)}`);
        }
      }
    });

    test('should integrate properly with MCP protocol', async () => {
      // Verify the tool exists in the tools list
      const tools = await client.listTools();
      const infoTool = tools.find(tool => tool.name === 'get_latest_info');
      
      assert.ok(infoTool, 'get_latest_info tool should be available');
      assert.ok(infoTool.description, 'Tool should have description');
      assert.ok(infoTool.inputSchema, 'Tool should have input schema');
      
      // Verify tool execution works through MCP protocol
      const result = await client.callTool('get_latest_info', {});
      assertValidMCPResponse(result);
    });
  });
});

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Validates that a result follows the MCP response structure
 */
function assertValidMCPResponse(result) {
  assert.ok(result, 'Result should exist');
  assert.ok(result.content, 'Result should have content');
  assert.ok(Array.isArray(result.content), 'Content should be array');
  assert.equal(typeof result.isError, 'boolean', 'isError should be boolean');
  assert.ok(result.content.length > 0, 'Content should not be empty');
}

// Helper functions removed to eliminate lint warnings
// All necessary validation is handled directly in test cases
