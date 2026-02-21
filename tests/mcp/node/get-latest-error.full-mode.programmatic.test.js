import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

describe('get_latest_error - Full Mode Programmatic Tests (Optimized)', () => {
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

  // Simplified helper functions for common validations
  function assertValidMCPResponse(result) {
    assert.ok(result.content, 'Should have content');
    assert.ok(Array.isArray(result.content), 'Content should be array');
    assert.equal(typeof result.isError, 'boolean', 'isError should be boolean');
    assert.equal(result.content[0].type, 'text', 'Content should be text type');
  }

  function assertErrorResponse(result, expectedErrorText) {
    assertValidMCPResponse(result);
    assert.equal(result.isError, true, 'Should be an error response');
    assert.ok(result.content[0].text.includes(expectedErrorText),
      `Expected error text "${expectedErrorText}" in "${result.content[0].text}"`);
  }

  function assertSuccessWithLimit(result, expectedLimit) {
    assertValidMCPResponse(result);
    assert.equal(result.isError, false, 'Should not be an error response');
    const text = result.content[0].text;
    assert.ok(text.includes(`Latest ${expectedLimit} error messages`),
      `Should mention "${expectedLimit}" error messages`);
    assert.ok(/error-blade-\d{8}-\d{6}\.log/.test(text), 'Should contain log file pattern');
    assert.ok(text.includes('ERROR'), 'Should contain ERROR level entries');
  }

  // Helper function to get current date in YYYYMMDD format
  function getCurrentDateString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }

  // Core functionality tests (essential scenarios)
  describe('Core Functionality', () => {
    test('should retrieve error messages with default parameters', async () => {
      const result = await client.callTool('get_latest_error', {});
      
      assertSuccessWithLimit(result, 10); // Default limit is 10
      
      // Verify SFCC-specific content is present
      const text = result.content[0].text;
      assert.ok(/PipelineCallServlet|SystemJobThread/.test(text), 'Should contain SFCC thread patterns');
      assert.ok(text.includes('Sites-'), 'Should contain Sites information');
      assert.ok(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3} GMT/.test(text), 'Should contain GMT timestamps');
    });

    test('should respect limit parameter and return ordered results', async () => {
      const result = await client.callTool('get_latest_error', { limit: 3 });
      
      assertSuccessWithLimit(result, 3);
      
      const text = result.content[0].text;
      // Should contain separators for multiple entries
      const separatorCount = (text.match(/---/g) || []).length;
      assert.ok(separatorCount >= 1, 'Should have separators between entries');
      
      // Verify chronological order (newest first) with known mock data
      assert.ok(text.includes('CQ - AWS S3 Configuration Issue'), 'Should contain latest error');
      assert.ok(text.includes('Payment authorization failed'), 'Should contain second latest error');
    });

    test('should handle date parameter correctly', async () => {
      const result = await client.callTool('get_latest_error', { 
        date: getCurrentDateString(),
        limit: 2 
      });
      
      assertSuccessWithLimit(result, 2);
    });
  });

  // Parameter validation tests (core error handling)
  describe('Parameter Validation', () => {
      test('should reject invalid limit types and values', async () => {
      // Test string limit
      const stringResult = await client.callTool('get_latest_error', { limit: '5' });
        assertErrorResponse(stringResult, 'limit must be a number');
      
      // Test zero limit
      const zeroResult = await client.callTool('get_latest_error', { limit: 0 });
        assertErrorResponse(zeroResult, 'limit must be >= 1');
      
      // Test negative limit
      const negativeResult = await client.callTool('get_latest_error', { limit: -5 });
        assertErrorResponse(negativeResult, 'limit must be >= 1');
    });

    test('should handle large limits appropriately', async () => {
      const largeResult = await client.callTool('get_latest_error', { limit: 50 });
      assertSuccessWithLimit(largeResult, 50);
      
      // Test extremely large limit (should error)
      const hugeResult = await client.callTool('get_latest_error', { limit: 9999 });
        assertErrorResponse(hugeResult, 'limit must be <= 1000');
    });

    test('should handle date parameters gracefully', async () => {
      // Valid YYYYMMDD date
      const validResult = await client.callTool('get_latest_error', { 
        date: '20240101',
        limit: 1 
      });
      assertValidMCPResponse(validResult);
      assert.equal(validResult.isError, false, 'Valid date should not error');
      
      // Invalid date format (should handle gracefully)
      const invalidResult = await client.callTool('get_latest_error', { 
        date: '2024-01-01',
        limit: 1 
      });
      assertValidMCPResponse(invalidResult);
      // Should not crash, may succeed or fail gracefully
    });

    test('should handle missing arguments gracefully', async () => {
      const result = await client.callTool('get_latest_error');
      assertSuccessWithLimit(result, 10); // Should use default limit
    });
  });

  // Content validation tests (SFCC-specific patterns)
  describe('Content Validation', () => {
    test('should include realistic SFCC error scenarios and structure', async () => {
      const result = await client.callTool('get_latest_error', { limit: 5 });
      
      assertValidMCPResponse(result);
      assert.equal(result.isError, false, 'Should not be an error');
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
      
      // Validate basic log structure elements
      assert.ok(text.includes('[') && text.includes(']'), 'Should contain log brackets');
      assert.ok(/\|\d+\|/.test(text), 'Should contain thread IDs with pipes');
    });

    test('should contain comprehensive SFCC-specific patterns', async () => {
      const result = await client.callTool('get_latest_error', { limit: 3 });
      
      assertValidMCPResponse(result);
      assert.equal(result.isError, false, 'Should not be an error');
      const text = result.content[0].text;
      
      // SFCC-specific validation patterns
      const sfccPatterns = [
        { pattern: /Sites-\w+/, name: 'Sites names' },
        { pattern: /PipelineCallServlet|SystemJobThread/, name: 'Thread types' },
        { pattern: /\|\d+\|/, name: 'Thread IDs' },
        { pattern: /custom \[\]/, name: 'Custom category' }
      ];
      
      const matchedPatterns = sfccPatterns.filter(({ pattern }) => pattern.test(text));
      assert.ok(matchedPatterns.length >= 2,
        `Should match at least 2 SFCC patterns. Matched: ${matchedPatterns.map(p => p.name).join(', ')}`);
    });
  });

  // Error recovery and resilience testing
  describe('Error Recovery and Resilience', () => {
    test('should handle error scenarios and recover properly', async () => {
      // Test invalid parameter
      const invalidResult = await client.callTool('get_latest_error', { limit: 0 });
        assertErrorResponse(invalidResult, 'limit must be >= 1');
      
      // Test recovery with valid parameters
      const validResult = await client.callTool('get_latest_error', { limit: 1 });
      assertValidMCPResponse(validResult);
      assert.equal(validResult.isError, false, 'Should work normally after error');
      assertSuccessWithLimit(validResult, 1);
      
      // Test edge cases without breaking
      const edgeCases = [
        { limit: '1' },      // String limit (should error)
        { limit: 1000 },     // Large limit (should error)  
        { date: '' },        // Empty date (should handle gracefully)
        { invalid: 'param' } // Invalid parameter name (should handle gracefully)
      ];
      
      // Test all edge cases sequentially
      for (const testCase of edgeCases) {
        const result = await client.callTool('get_latest_error', testCase);
        assertValidMCPResponse(result);
        // Some may error, some may succeed - but none should crash
      }
      
      // Verify tool still works after edge cases
      const finalResult = await client.callTool('get_latest_error', { limit: 1 });
      assertValidMCPResponse(finalResult);
      assert.equal(finalResult.isError, false, 'Should work after edge cases');
    });
  });

  // Advanced scenarios (simplified multi-step workflow)
  describe('Advanced Scenarios', () => {
    test('should support typical error analysis workflow', async () => {
      // Simulate a typical workflow: recent errors -> specific investigation -> recovery validation
      
      // Step 1: Get recent errors for overview
      const recentErrors = await client.callTool('get_latest_error', { limit: 2 });
      assertValidMCPResponse(recentErrors);
      assert.equal(recentErrors.isError, false, 'Recent errors should succeed');
      
      // Step 2: Get more detailed view for specific analysis
      const detailedErrors = await client.callTool('get_latest_error', { 
        date: getCurrentDateString(),
        limit: 5 
      });
      assertValidMCPResponse(detailedErrors);
      assert.equal(detailedErrors.isError, false, 'Detailed errors should succeed');
      
      // Step 3: Verify both contain expected error content
      [recentErrors, detailedErrors].forEach((result, index) => {
        const text = result.content[0].text;
        assert.ok(text.includes('ERROR'), `Result ${index} should contain ERROR level`);
        assert.ok(text.includes('Latest'), `Result ${index} should contain 'Latest' message`);
        assert.ok(/error-blade-.*\.log/.test(text), `Result ${index} should contain log filename`);
      });
    });
  });
});
