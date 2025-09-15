import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-conductor';

describe('get_latest_debug - Full Mode Programmatic Tests', () => {
  let client;

  before(async () => {
    client = await connect('./conductor.config.with-dw.json');
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

  // Helper functions for common validations
  function assertValidMCPResponse(result) {
    assert.ok(result.content, 'Should have content');
    assert.ok(Array.isArray(result.content), 'Content should be array');
    assert.equal(typeof result.isError, 'boolean', 'isError should be boolean');
  }

  function assertErrorResponse(result, expectedErrorText) {
    assertValidMCPResponse(result);
    assert.equal(result.isError, true, 'Should be an error response');
    assert.equal(result.content[0].type, 'text');
    assert.ok(result.content[0].text.includes(expectedErrorText),
      `Expected error text "${expectedErrorText}" in "${result.content[0].text}"`);
  }

  function assertSuccessResponse(result) {
    assertValidMCPResponse(result);
    assert.equal(result.isError, false, 'Should not be an error response');
    assert.equal(result.content[0].type, 'text');
  }

  function assertDebugLogFormat(result, expectedLimit) {
    assertSuccessResponse(result);
    const text = result.content[0].text;
    
    // Should contain the expected limit message
    assert.ok(text.includes(`Latest ${expectedLimit} debug messages`),
      `Should mention "${expectedLimit}" debug messages`);
    
    // Should contain log file name pattern
    assert.ok(/debug-blade-\d{8}-\d{6}\.log/.test(text),
      'Should contain debug log file name pattern');
    
    // Should contain DEBUG level entries
    assert.ok(text.includes('DEBUG'), 'Should contain DEBUG level entries');
    
    // Should contain GMT timestamps
    assert.ok(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3} GMT/.test(text),
      'Should contain GMT timestamp pattern');
  }

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
    test('should get latest debug entries with default parameters', async () => {
      const result = await client.callTool('get_latest_debug', {});
      
      assertDebugLogFormat(result, 10); // Default limit is 10
      
      // Should contain SFCC-specific debug patterns
      const text = result.content[0].text;
      assert.ok(/PipelineCallServlet|SystemJobThread/.test(text),
        'Should contain SFCC thread patterns');
      assert.ok(text.includes('Sites-'), 'Should contain Sites information');
    });

    test('should validate response structure and content types', async () => {
      const result = await client.callTool('get_latest_debug', {});
      
      assertValidMCPResponse(result);
      assert.equal(typeof result.isError, 'boolean', 'isError should be boolean');
      assert.ok(Array.isArray(result.content), 'content should be array');
      assert.equal(result.content[0].type, 'text', 'content type should be text');
      assert.equal(typeof result.content[0].text, 'string', 'content text should be string');
    });

    test('should contain DEBUG log level in response', async () => {
      const result = await client.callTool('get_latest_debug', {});
      
      assertValidMCPResponse(result);
      assert.ok(result.content[0].text.includes('DEBUG'), 'Should contain DEBUG log level');
    });

    test('should contain log file names in response', async () => {
      const result = await client.callTool('get_latest_debug', {});
      
      assertValidMCPResponse(result);
      const logFilePattern = /debug-blade-[\d-]+\.log/;
      assert.ok(logFilePattern.test(result.content[0].text), 'Should contain debug log file names');
    });

    test('should respect custom limit parameter', async () => {
      const customLimit = 3;
      const result = await client.callTool('get_latest_debug', { limit: customLimit });
      
      assertDebugLogFormat(result, customLimit);
      
      // Should contain separators for multiple entries
      const text = result.content[0].text;
      const separatorCount = (text.match(/---/g) || []).length;
      assert.ok(separatorCount >= 1, 'Should have separators between entries');
    });

    test('should accept date parameter in YYYYMMDD format', async () => {
      const testDate = getCurrentDateString();
      const result = await client.callTool('get_latest_debug', { 
        date: testDate, 
        limit: 2 
      });
      
      assertDebugLogFormat(result, 2);
    });

    test('should handle both date and limit parameters together', async () => {
      const result = await client.callTool('get_latest_debug', { 
        date: getCurrentDateString(), 
        limit: 5 
      });
      
      assertDebugLogFormat(result, 5);
    });

    test('should handle single debug entry limit', async () => {
      const result = await client.callTool('get_latest_debug', { limit: 1 });
      
      assertDebugLogFormat(result, 1);
    });
  });

  // ========================================
  // PARAMETER VALIDATION SCENARIOS
  // ========================================

  describe('Parameter Validation Scenarios', () => {
    test('should handle string limit parameter gracefully', async () => {
      const result = await client.callTool('get_latest_debug', { limit: '5' });
      
      assertErrorResponse(result, 'Invalid limit \'5\' for get_latest_debug. Must be a valid number');
    });

    test('should handle large limit values', async () => {
      const result = await client.callTool('get_latest_debug', { limit: 50 });
      
      assertDebugLogFormat(result, 50);
    });

    test('should reject zero limit parameter with validation error', async () => {
      const result = await client.callTool('get_latest_debug', { limit: 0 });
      
      assertErrorResponse(result, 'Invalid limit \'0\' for get_latest_debug');
      assert.ok(result.content[0].text.includes('Must be between 1 and 1000'),
        'Should contain range validation message');
    });

    test('should reject negative limit parameter', async () => {
      const result = await client.callTool('get_latest_debug', { limit: -5 });
      
      assertErrorResponse(result, 'Invalid limit');
    });

    test('should reject extremely large limit parameter', async () => {
      const result = await client.callTool('get_latest_debug', { limit: 9999 });
      
      assertErrorResponse(result, 'Invalid limit');
    });

    test('should handle valid YYYYMMDD date format', async () => {
      const result = await client.callTool('get_latest_debug', { 
        date: '20240101',
        limit: 1 
      });
      
      assertValidMCPResponse(result);
      // Should not error - may return no results for past dates
    });

    test('should handle future dates gracefully', async () => {
      const result = await client.callTool('get_latest_debug', { 
        date: '20261231',
        limit: 1 
      });
      
      assertValidMCPResponse(result);
      // Future dates should be handled gracefully
    });

    test('should return appropriate message for invalid date format', async () => {
      const result = await client.callTool('get_latest_debug', { 
        date: 'invalid-date', 
        limit: 3 
      });
      
      assertValidMCPResponse(result);
      assert.equal(result.isError, false, 'Should handle invalid date gracefully');
      assert.ok(result.content[0].text.includes('No debug log files found for date invalid-date'), 
        'Should contain no files found message');
    });

    test('should handle extra unknown parameters', async () => {
      const result = await client.callTool('get_latest_debug', { 
        limit: 5,
        unknownParam: 'should-be-ignored'
      });
      
      assertValidMCPResponse(result);
      assert.equal(result.isError, false, 'Should ignore unknown parameters');
      assert.ok(result.content[0].text.includes('Latest 5 debug messages'), 
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
        const result = await client.callTool('get_latest_debug', testCase.params);
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
  // CONTENT VALIDATION TESTS
  // ========================================

  describe('Content Validation Tests', () => {
    test('should include pipeline call information in debug entries', async () => {
      const result = await client.callTool('get_latest_debug', { limit: 3 });
      
      assertValidMCPResponse(result);
      assert.ok(result.content[0].text.includes('PipelineCallServlet'),
        'Should contain PipelineCallServlet information');
    });

    test('should include session and site information', async () => {
      const result = await client.callTool('get_latest_debug', { limit: 2 });
      
      assertValidMCPResponse(result);
      assert.ok(result.content[0].text.includes('Sites-RefArchGlobal-Site'),
        'Should contain site information');
    });

    test('should include separation markers between log entries', async () => {
      const result = await client.callTool('get_latest_debug', { limit: 3 });
      
      assertValidMCPResponse(result);
      assert.ok(result.content[0].text.includes('---'),
        'Should contain separation markers');
    });

    test('should include customer session validation debug messages', async () => {
      const result = await client.callTool('get_latest_debug', { limit: 5 });
      
      assertValidMCPResponse(result);
      assert.ok(/Customer session validated/.test(result.content[0].text),
        'Should contain customer session validation patterns');
    });

    test('should include basket calculation debug information', async () => {
      const result = await client.callTool('get_latest_debug', { limit: 5 });
      
      assertValidMCPResponse(result);
      assert.ok(/Basket calculation/.test(result.content[0].text),
        'Should contain basket calculation patterns');
    });

    test('should include search query execution debug details', async () => {
      const result = await client.callTool('get_latest_debug', { limit: 5 });
      
      assertValidMCPResponse(result);
      assert.ok(/Search query executed/.test(result.content[0].text),
        'Should contain search query execution patterns');
    });

    test('should include product cache hit debug information', async () => {
      const result = await client.callTool('get_latest_debug', { limit: 5 });
      
      assertValidMCPResponse(result);
      assert.ok(/Product cache hit/.test(result.content[0].text),
        'Should contain product cache hit patterns');
    });

    test('should include system job thread debug entries', async () => {
      const result = await client.callTool('get_latest_debug', { limit: 5 });
      
      assertValidMCPResponse(result);
      assert.ok(/SystemJobThread/.test(result.content[0].text),
        'Should contain system job thread patterns');
    });

    test('should include timestamp format validation', async () => {
      const result = await client.callTool('get_latest_debug', { limit: 1 });
      
      assertValidMCPResponse(result);
      const timestampPattern = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3} GMT/;
      assert.ok(timestampPattern.test(result.content[0].text),
        'Should contain properly formatted timestamps');
    });
  });

  // ========================================
  // EDGE CASES AND VALIDATION
  // ========================================

  describe('Edge Case Scenarios', () => {
    test('should handle limit of 1', async () => {
      const result = await client.callTool('get_latest_debug', { limit: 1 });
      
      assertDebugLogFormat(result, 1);
    });

    test('should handle large limit values efficiently', async () => {
      const result = await client.callTool('get_latest_debug', { limit: 100 });
      
      assertValidMCPResponse(result);
      assert.equal(result.isError, false, 'Should handle large limits');
      assert.ok(result.content[0].text.includes('Latest 100 debug messages'), 
        'Should show large limit value');
    });

    test('should handle historical date parameter', async () => {
      const result = await client.callTool('get_latest_debug', { 
        date: '20240101',
        limit: 1 
      });
      
      assertValidMCPResponse(result);
      // Should handle historical dates gracefully
    });

    test('should handle invalid limit types', async () => {
      const result = await client.callTool('get_latest_debug', { limit: 'invalid' });
      
      assertErrorResponse(result, 'Invalid limit \'invalid\' for get_latest_debug. Must be a valid number');
    });
  });

  // ========================================
  // PERFORMANCE AND STRESS TESTS  
  // ========================================

  describe('Performance and Stress Tests', () => {
    test('should respond quickly for small limit requests', async () => {
      const startTime = Date.now();
      const result = await client.callTool('get_latest_debug', { limit: 1 });
      const duration = Date.now() - startTime;
      
      assertValidMCPResponse(result);
      assert.ok(duration < 2000, `Should respond quickly, took ${duration}ms`);
    });

    test('should handle larger debug entry requests efficiently', async () => {
      const startTime = Date.now();
      const result = await client.callTool('get_latest_debug', { limit: 20 });
      const duration = Date.now() - startTime;
      
      assertValidMCPResponse(result);
      assert.ok(result.content[0].text.includes('Latest 20 debug messages'),
        'Should show correct limit value');
      assert.ok(duration < 5000, `Should handle large requests efficiently, took ${duration}ms`);
    });

    test('should maintain performance across multiple sequential requests', async () => {
      const results = [];
      const startTime = Date.now();
      
      for (let i = 0; i < 5; i++) {
        const result = await client.callTool('get_latest_debug', { limit: 3 });
        results.push(result);
        assertValidMCPResponse(result);
      }
      
      const totalDuration = Date.now() - startTime;
      assert.ok(totalDuration < 10000, `Sequential requests should be efficient, took ${totalDuration}ms`);
      
      // All results should be valid
      results.forEach((result, index) => {
        assert.equal(result.isError, false, `Request ${index + 1} should succeed`);
      });
    });

    test('should handle concurrent requests properly', async () => {
      const promises = [];
      
      for (let i = 0; i < 3; i++) {
        promises.push(client.callTool('get_latest_debug', { limit: 2 }));
      }
      
      const results = await Promise.all(promises);
      
      results.forEach((result, index) => {
        assertValidMCPResponse(result);
        assert.equal(result.isError, false, `Concurrent request ${index + 1} should succeed`);
      });
    });

    test('should recover gracefully from stress operations', async () => {
      // Perform some potentially stressful operations
      const stressOperations = [
        { limit: 100 },
        { limit: 'stress-test' },
        { date: 'invalid' },
        { limit: -10 }
      ];
      
      for (const stressOp of stressOperations) {
        await client.callTool('get_latest_debug', stressOp);
        // Note: We don't assert on these results as some may be handled gracefully
      }
      
      // Verify normal operation still works
      const result = await client.callTool('get_latest_debug', { limit: 3 });
      assertValidMCPResponse(result);
      assert.equal(result.isError, false, 'Should work normally after stress operations');
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
        const result = await client.callTool('get_latest_debug', params);
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
      const debugTool = tools.find(tool => tool.name === 'get_latest_debug');
      
      assert.ok(debugTool, 'get_latest_debug tool should be available');
      assert.ok(debugTool.description, 'Tool should have description');
      assert.ok(debugTool.inputSchema, 'Tool should have input schema');
      
      // Verify tool execution works through MCP protocol
      const result = await client.callTool('get_latest_debug', {});
      assertValidMCPResponse(result);
    });

    test('should have consistent behavior with other log tools', async () => {
      // Test that debug tool behaves similarly to other log tools
      const debugResult = await client.callTool('get_latest_debug', { limit: 5 });
      const infoResult = await client.callTool('get_latest_info', { limit: 5 });
      
      assertValidMCPResponse(debugResult);
      assertValidMCPResponse(infoResult);
      
      // Both should have similar structure
      assert.equal(debugResult.content.length, infoResult.content.length,
        'Debug and info tools should have similar response structure');
      assert.equal(typeof debugResult.isError, typeof infoResult.isError,
        'Both tools should handle errors consistently');
    });

    test('should maintain response format consistency', async () => {
      const result = await client.callTool('get_latest_debug', { limit: 2 });
      
      assertValidMCPResponse(result);
      
      // Verify consistent response format
      assert.equal(result.content.length, 1, 'Should have exactly one content item');
      assert.equal(result.content[0].type, 'text', 'Content type should be text');
      assert.ok(typeof result.content[0].text === 'string', 'Content text should be string');
      assert.ok(result.content[0].text.length > 0, 'Content text should not be empty');
    });
  });
});
