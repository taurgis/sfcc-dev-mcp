import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-conductor';

describe('get_latest_error - Full Mode Programmatic Tests', () => {
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

  function assertLogFormat(result, expectedLimit) {
    assertSuccessResponse(result);
    const text = result.content[0].text;
    
    // Should contain the expected limit message
    assert.ok(text.includes(`Latest ${expectedLimit} error messages`),
      `Should mention "${expectedLimit}" error messages`);
    
    // Should contain log file name pattern
    assert.ok(/error-blade-\d{8}-\d{6}\.log/.test(text),
      'Should contain log file name pattern');
    
    // Should contain ERROR level entries
    assert.ok(text.includes('ERROR'), 'Should contain ERROR level entries');
    
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

  // Basic functionality tests
  describe('Basic Functionality', () => {
    test('should retrieve latest error messages with default parameters', async () => {
      const result = await client.callTool('get_latest_error', {});
      
      assertLogFormat(result, 10); // Default limit is 10
      
      // Should contain SFCC-specific patterns
      const text = result.content[0].text;
      assert.ok(/PipelineCallServlet|SystemJobThread/.test(text),
        'Should contain SFCC thread patterns');
      assert.ok(text.includes('Sites-'), 'Should contain Sites information');
    });

    test('should respect limit parameter', async () => {
      const result = await client.callTool('get_latest_error', { limit: 3 });
      
      assertLogFormat(result, 3);
      
      // Should contain separators for multiple entries
      const text = result.content[0].text;
      const separatorCount = (text.match(/---/g) || []).length;
      assert.ok(separatorCount >= 1, 'Should have separators between entries');
    });

    test('should handle specific date parameter', async () => {
      const result = await client.callTool('get_latest_error', { 
        date: getCurrentDateString(),
        limit: 2 
      });
      
      assertLogFormat(result, 2);
    });

    test('should handle both date and limit parameters together', async () => {
      const result = await client.callTool('get_latest_error', {
        date: getCurrentDateString(),
        limit: 1
      });
      
      assertLogFormat(result, 1);
    });
  });

  // Parameter validation tests
  describe('Parameter Validation', () => {
    test('should handle string limit parameter gracefully', async () => {
      const result = await client.callTool('get_latest_error', { limit: '5' });
      
      assertLogFormat(result, '5');
    });

    test('should handle large limit values', async () => {
      const result = await client.callTool('get_latest_error', { limit: 50 });
      
      assertLogFormat(result, 50);
    });

    test('should reject zero limit parameter', async () => {
      const result = await client.callTool('get_latest_error', { limit: 0 });
      
      assertErrorResponse(result, 'Invalid limit \'0\' for get_latest_error');
    });

    test('should reject negative limit parameter', async () => {
      const result = await client.callTool('get_latest_error', { limit: -5 });
      
      assertErrorResponse(result, 'Invalid limit');
    });

    test('should reject extremely large limit parameter', async () => {
      const result = await client.callTool('get_latest_error', { limit: 9999 });
      
      assertErrorResponse(result, 'Invalid limit');
    });

    test('should handle valid YYYYMMDD date format', async () => {
      const result = await client.callTool('get_latest_error', { 
        date: '20240101',
        limit: 1 
      });
      
      assertValidMCPResponse(result);
      // Should not error - may return no results for past dates
    });

    test('should handle future dates gracefully', async () => {
      const result = await client.callTool('get_latest_error', { 
        date: '20251231',
        limit: 1 
      });
      
      assertValidMCPResponse(result);
      // Should not error - may return no results for future dates
    });

    test('should handle invalid date format gracefully', async () => {
      const result = await client.callTool('get_latest_error', { 
        date: '2024-01-01',
        limit: 1 
      });
      
      assertValidMCPResponse(result);
      // Should handle gracefully without erroring
    });

    test('should handle missing arguments object gracefully', async () => {
      const result = await client.callTool('get_latest_error');
      
      assertLogFormat(result, 10); // Should use default limit
    });
  });

  // Content validation tests
  describe('Content Validation', () => {
    test('should include realistic SFCC error scenarios', async () => {
      const result = await client.callTool('get_latest_error', { limit: 5 });
      
      assertSuccessResponse(result);
      const text = result.content[0].text;
      
      // Should contain common SFCC error patterns
      const errorPatterns = [
        'Custom cartridge error',
        'Product import failed',
        'Customer profile creation failed',
        'Payment authorization failed',
        'AWS S3 Configuration Issue'
      ];
      
      const foundPatterns = errorPatterns.filter(pattern => text.includes(pattern));
      assert.ok(foundPatterns.length > 0, 
        `Should contain at least one error pattern. Found: ${foundPatterns.join(', ')}`);
    });

    test('should include proper log structure elements', async () => {
      const result = await client.callTool('get_latest_error', { limit: 3 });
      
      assertSuccessResponse(result);
      const text = result.content[0].text;
      
      // Validate log structure
      assert.ok(text.includes('['), 'Should contain log brackets');
      assert.ok(text.includes(']'), 'Should contain closing brackets');
      assert.ok(/\|\d+\|/.test(text), 'Should contain thread IDs with pipes');
      assert.ok(text.includes('ERROR'), 'Should contain ERROR level');
    });

    test('should separate multiple entries properly', async () => {
      const result = await client.callTool('get_latest_error', { limit: 4 });
      
      assertSuccessResponse(result);
      const text = result.content[0].text;
      
      // Count separators - should have at least 2 for 4 entries (3 separators)
      const separators = text.match(/---/g);
      assert.ok(separators && separators.length >= 2, 
        `Should have multiple separators for multiple entries. Found: ${separators?.length || 0}`);
    });

    test('should contain SFCC Sites and pipeline information', async () => {
      const result = await client.callTool('get_latest_error', { limit: 3 });
      
      assertSuccessResponse(result);
      const text = result.content[0].text;
      
      // SFCC-specific patterns
      assert.ok(text.includes('Sites-'), 'Should contain Sites information');
      assert.ok(/PipelineCall|SystemJob/.test(text), 'Should contain pipeline or job information');
    });
  });

  // Multi-step workflow testing
  describe('Multi-Step Workflows', () => {
    test('should support sequential error analysis workflow', async () => {
      // Step 1: Get recent errors with small limit
      const recentErrors = await client.callTool('get_latest_error', { limit: 2 });
      assertSuccessResponse(recentErrors);
      
      // Step 2: Get more comprehensive error list
      const comprehensiveErrors = await client.callTool('get_latest_error', { limit: 10 });
      assertSuccessResponse(comprehensiveErrors);
      
      // Step 3: Get errors for specific date
      const dateSpecificErrors = await client.callTool('get_latest_error', { 
        date: getCurrentDateString(),
        limit: 5 
      });
      assertSuccessResponse(dateSpecificErrors);
      
      // All should be successful and contain error information
      const recentText = recentErrors.content[0].text;
      const comprehensiveText = comprehensiveErrors.content[0].text;
      const dateText = dateSpecificErrors.content[0].text;
      
      assert.ok(recentText.includes('ERROR'), 'Recent errors should contain ERROR level');
      assert.ok(comprehensiveText.includes('ERROR'), 'Comprehensive errors should contain ERROR level');
      assert.ok(dateText.includes('ERROR'), 'Date-specific errors should contain ERROR level');
    });

    test('should maintain consistent response structure across calls', async () => {
      const calls = [
        { limit: 1 },
        { limit: 5 },
        { date: getCurrentDateString(), limit: 3 },
        {} // default parameters
      ];
      
      const results = [];
      
      // Execute calls sequentially (never use Promise.all with MCP!)
      for (const params of calls) {
        const result = await client.callTool('get_latest_error', params);
        results.push(result);
      }
      
      // All should have consistent structure
      results.forEach((result, index) => {
        assertValidMCPResponse(result);
        assert.equal(result.isError, false, `Call ${index} should not be error`);
        assert.equal(result.content[0].type, 'text', `Call ${index} should have text content`);
        assert.ok(result.content[0].text.includes('Latest'), 
          `Call ${index} should contain 'Latest' in response`);
      });
    });
  });

  // Error recovery and resilience testing
  describe('Error Recovery and Resilience', () => {
    test('should handle invalid parameters and recover', async () => {
      // Test invalid parameter
      const invalidResult = await client.callTool('get_latest_error', { limit: 0 });
      assertErrorResponse(invalidResult, 'Invalid limit');
      
      // Test recovery with valid parameters
      const validResult = await client.callTool('get_latest_error', { limit: 1 });
      assertSuccessResponse(validResult);
      
      // Should work normally after error
      assertLogFormat(validResult, 1);
    });

    test('should handle edge cases without breaking', async () => {
      const edgeCases = [
        { limit: '1' },      // String limit
        { limit: 1000 },     // Large limit (should error)
        { date: '' },        // Empty date
        { invalid: 'param' } // Invalid parameter name
      ];
      
      // Test all edge cases sequentially
      for (const testCase of edgeCases) {
        const result = await client.callTool('get_latest_error', testCase);
        assertValidMCPResponse(result);
        // Some may error, some may succeed - but none should crash
      }
      
      // Verify tool still works after edge cases
      const finalResult = await client.callTool('get_latest_error', { limit: 1 });
      assertSuccessResponse(finalResult);
    });
  });

  // Dynamic validation based on actual responses
  describe('Dynamic Content Validation', () => {
    test('should validate log content patterns dynamically', async () => {
      const result = await client.callTool('get_latest_error', { limit: 5 });
      assertSuccessResponse(result);
      
      const text = result.content[0].text;
      const lines = text.split('\n').filter(line => line.trim().length > 0);
      
      // Dynamic validation based on actual content
      const errorLines = lines.filter(line => line.includes('ERROR'));
      assert.ok(errorLines.length > 0, 'Should have at least one ERROR line');
      
      // Each error line should have timestamp
      errorLines.forEach((line, index) => {
        assert.ok(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(line),
          `Error line ${index} should contain timestamp: ${line}`);
      });
    });

    test('should validate SFCC-specific content patterns', async () => {
      const result = await client.callTool('get_latest_error', { limit: 3 });
      assertSuccessResponse(result);
      
      const text = result.content[0].text;
      
      // SFCC-specific validation patterns
      const sfccPatterns = [
        /Sites-\w+/,                    // Sites names
        /PipelineCallServlet|SystemJobThread/, // Thread types
        /\|\d+\|/,                      // Thread IDs
        /custom \[\]/,                  // Custom category
        /JOB [a-f0-9]+/                // Job IDs
      ];
      
      const matchedPatterns = sfccPatterns.filter(pattern => pattern.test(text));
      assert.ok(matchedPatterns.length >= 2,
        `Should match at least 2 SFCC patterns. Matched: ${matchedPatterns.length}`);
    });
  });

  // Functional monitoring patterns
  describe('Functional Monitoring', () => {
    test('should consistently return structured error log data', async () => {
      const limits = [1, 3, 5, 10];
      const results = [];
      
      // Test various limits sequentially
      for (const limit of limits) {
        const result = await client.callTool('get_latest_error', { limit });
        results.push({ limit, result });
      }
      
      // Analyze consistency across results
      results.forEach(({ limit, result }) => {
        assertSuccessResponse(result);
        
        const text = result.content[0].text;
        assert.ok(text.includes(`Latest ${limit} error messages`),
          `Should mention correct limit: ${limit}`);
        
        // Count actual error entries (rough estimation)
        const errorCount = (text.match(/ERROR/g) || []).length;
        assert.ok(errorCount >= 1, `Should have at least 1 error for limit ${limit}`);
      });
    });

    test('should provide comprehensive error context', async () => {
      const result = await client.callTool('get_latest_error', { limit: 2 });
      assertSuccessResponse(result);
      
      const text = result.content[0].text;
      
      // Check for presence of key context elements
      assert.ok(/error-blade-.*\.log/.test(text), 'Should include log file name');
      assert.ok(/\d{4}-\d{2}-\d{2}/.test(text), 'Should include timestamp');
      assert.ok(/Sites-/.test(text), 'Should include site information');
      assert.ok(/ERROR/.test(text), 'Should include error level');
    });
  });
});
