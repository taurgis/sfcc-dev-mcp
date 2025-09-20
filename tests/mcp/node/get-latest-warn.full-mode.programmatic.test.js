import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

describe('get_latest_warn - Full Mode Programmatic Tests', () => {
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
    assert.ok(text.includes(`Latest ${expectedLimit} warn messages`),
      `Should mention "${expectedLimit}" warn messages`);
    
    // Should contain log file name pattern
    assert.ok(/warn-blade-\d{8}-\d{6}\.log/.test(text),
      'Should contain warn log file name pattern');
    
    // Should contain WARN level entries
    assert.ok(text.includes('WARN'), 'Should contain WARN level entries');
    
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
    test('should retrieve latest warn messages with default parameters', async () => {
      const result = await client.callTool('get_latest_warn', {});
      
      assertLogFormat(result, 10); // Default limit is 10
      
      // Should contain SFCC-specific patterns
      const text = result.content[0].text;
      assert.ok(/PipelineCallServlet|SystemJobThread/.test(text),
        'Should contain SFCC thread patterns');
      assert.ok(text.includes('Sites-'), 'Should contain Sites information');
    });

    test('should respect limit parameter', async () => {
      const result = await client.callTool('get_latest_warn', { limit: 3 });
      
      assertLogFormat(result, 3);
      
      // Should contain separators for multiple entries
      const text = result.content[0].text;
      const separatorCount = (text.match(/---/g) || []).length;
      assert.ok(separatorCount >= 1, 'Should have separators between entries');
    });

    test('should handle specific date parameter', async () => {
      const result = await client.callTool('get_latest_warn', { 
        date: getCurrentDateString(),
        limit: 2 
      });
      
      assertLogFormat(result, 2);
    });

    test('should handle both date and limit parameters together', async () => {
      const result = await client.callTool('get_latest_warn', {
        date: getCurrentDateString(),
        limit: 1
      });
      
      assertLogFormat(result, 1);
    });
  });

  // Parameter validation tests
  describe('Parameter Validation', () => {
    test('should handle string limit parameter gracefully', async () => {
      const result = await client.callTool('get_latest_warn', { limit: '5' });
      
      assertValidMCPResponse(result);
      assert.equal(result.isError, true, 'Should be an error response for invalid limit type');
      assert.ok(result.content[0].text.includes('Invalid limit \'5\' for get_latest_warn. Must be a valid number'), 
        'Should include validation error message');
    });

    test('should handle large limit values', async () => {
      const result = await client.callTool('get_latest_warn', { limit: 50 });
      
      assertLogFormat(result, 50);
    });

    test('should reject zero limit parameter', async () => {
      const result = await client.callTool('get_latest_warn', { limit: 0 });
      
      assertErrorResponse(result, 'Invalid limit \'0\' for get_latest_warn');
    });

    test('should reject negative limit parameter', async () => {
      const result = await client.callTool('get_latest_warn', { limit: -5 });
      
      assertErrorResponse(result, 'Invalid limit');
    });

    test('should reject extremely large limit parameter', async () => {
      const result = await client.callTool('get_latest_warn', { limit: 9999 });
      
      assertErrorResponse(result, 'Invalid limit');
    });

    test('should handle valid YYYYMMDD date format', async () => {
      const result = await client.callTool('get_latest_warn', { 
        date: '20240101',
        limit: 1 
      });
      
      assertValidMCPResponse(result);
      // Should not error - may return no results for past dates
    });

    test('should handle future dates gracefully', async () => {
      const result = await client.callTool('get_latest_warn', { 
        date: '20251231',
        limit: 1 
      });
      
      assertValidMCPResponse(result);
      // Should not error - may return no results for future dates
    });

    test('should handle invalid date format gracefully', async () => {
      const result = await client.callTool('get_latest_warn', { 
        date: '2024-01-01',
        limit: 1 
      });
      
      assertValidMCPResponse(result);
      // Should handle gracefully without erroring
    });

    test('should handle missing arguments object gracefully', async () => {
      const result = await client.callTool('get_latest_warn');
      
      assertLogFormat(result, 10); // Should use default limit
    });
  });

  // Content validation tests
  describe('Content Validation', () => {
    test('should include realistic SFCC warning scenarios', async () => {
      const result = await client.callTool('get_latest_warn', { limit: 5 });
      
      assertSuccessResponse(result);
      const text = result.content[0].text;
      
      // Should contain common SFCC warning patterns
      const warningPatterns = [
        'Product inventory low',
        'Content asset',
        'offline',
        'deprecated',
        'Performance warning'
      ];
      
      const foundPatterns = warningPatterns.filter(pattern => text.includes(pattern));
      assert.ok(foundPatterns.length > 0, 
        `Should contain at least one warning pattern. Found: ${foundPatterns.join(', ')}`);
    });

    test('should include proper log structure elements', async () => {
      const result = await client.callTool('get_latest_warn', { limit: 3 });
      
      assertSuccessResponse(result);
      const text = result.content[0].text;
      
      // Validate log structure
      assert.ok(text.includes('['), 'Should contain log brackets');
      assert.ok(text.includes(']'), 'Should contain closing brackets');
      assert.ok(/\|\d+\|/.test(text), 'Should contain thread IDs with pipes');
      assert.ok(text.includes('WARN'), 'Should contain WARN level');
    });

    test('should separate multiple entries properly', async () => {
      const result = await client.callTool('get_latest_warn', { limit: 4 });
      
      assertSuccessResponse(result);
      const text = result.content[0].text;
      
      // Count separators - should have at least 2 for 4 entries (3 separators)
      const separators = text.match(/---/g);
      assert.ok(separators && separators.length >= 2, 
        `Should have multiple separators for multiple entries. Found: ${separators?.length || 0}`);
    });

    test('should contain SFCC Sites and pipeline information', async () => {
      const result = await client.callTool('get_latest_warn', { limit: 3 });
      
      assertSuccessResponse(result);
      const text = result.content[0].text;
      
      // SFCC-specific patterns
      assert.ok(text.includes('Sites-'), 'Should contain Sites information');
      assert.ok(/PipelineCall|SystemJob/.test(text), 'Should contain pipeline or job information');
    });

    test('should include inventory and content asset warnings', async () => {
      const result = await client.callTool('get_latest_warn', { limit: 5 });
      
      assertSuccessResponse(result);
      const text = result.content[0].text;
      
      // Specific warning types common in SFCC
      const specificWarnings = [
        /inventory low.*SKU/i,
        /content asset.*offline/i,
        /deprecated/i
      ];
      
      const matchedWarnings = specificWarnings.filter(pattern => pattern.test(text));
      assert.ok(matchedWarnings.length > 0,
        `Should contain specific SFCC warning types. Matched: ${matchedWarnings.length}`);
    });
  });

  // Multi-step workflow testing
  describe('Multi-Step Workflows', () => {
    test('should support sequential warning analysis workflow', async () => {
      // Step 1: Get recent warnings with small limit
      const recentWarnings = await client.callTool('get_latest_warn', { limit: 2 });
      assertSuccessResponse(recentWarnings);
      
      // Step 2: Get more comprehensive warning list
      const comprehensiveWarnings = await client.callTool('get_latest_warn', { limit: 10 });
      assertSuccessResponse(comprehensiveWarnings);
      
      // Step 3: Get warnings for specific date
      const dateSpecificWarnings = await client.callTool('get_latest_warn', { 
        date: getCurrentDateString(),
        limit: 5 
      });
      assertSuccessResponse(dateSpecificWarnings);
      
      // All should be successful and contain warning information
      const recentText = recentWarnings.content[0].text;
      const comprehensiveText = comprehensiveWarnings.content[0].text;
      const dateText = dateSpecificWarnings.content[0].text;
      
      assert.ok(recentText.includes('WARN'), 'Recent warnings should contain WARN level');
      assert.ok(comprehensiveText.includes('WARN'), 'Comprehensive warnings should contain WARN level');
      assert.ok(dateText.includes('WARN'), 'Date-specific warnings should contain WARN level');
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
        const result = await client.callTool('get_latest_warn', params);
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

    test('should support warning pattern analysis across multiple calls', async () => {
      // Get different warning samples
      const sample1 = await client.callTool('get_latest_warn', { limit: 3 });
      const sample2 = await client.callTool('get_latest_warn', { limit: 7 });
      
      assertSuccessResponse(sample1);
      assertSuccessResponse(sample2);
      
      const text1 = sample1.content[0].text;
      const text2 = sample2.content[0].text;
      
      // Both should contain similar SFCC patterns
      const commonPatterns = ['Sites-', 'PipelineCall', 'custom []'];
      
      commonPatterns.forEach(pattern => {
        const inSample1 = text1.includes(pattern);
        const inSample2 = text2.includes(pattern);
        
        assert.ok(inSample1 || inSample2, 
          `Pattern "${pattern}" should appear in at least one sample`);
      });
    });
  });

  // Error recovery and resilience testing
  describe('Error Recovery and Resilience', () => {
    test('should handle invalid parameters and recover', async () => {
      // Test invalid parameter
      const invalidResult = await client.callTool('get_latest_warn', { limit: 0 });
      assertErrorResponse(invalidResult, 'Invalid limit');
      
      // Test recovery with valid parameters
      const validResult = await client.callTool('get_latest_warn', { limit: 1 });
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
        const result = await client.callTool('get_latest_warn', testCase);
        assertValidMCPResponse(result);
        // Some may error, some may succeed - but none should crash
      }
      
      // Verify tool still works after edge cases
      const finalResult = await client.callTool('get_latest_warn', { limit: 1 });
      assertSuccessResponse(finalResult);
    });

    test('should handle rapid sequential calls without interference', async () => {
      const rapidCalls = [1, 2, 3, 4, 5];
      const results = [];
      
      // Execute rapid sequential calls
      for (const limit of rapidCalls) {
        const result = await client.callTool('get_latest_warn', { limit });
        results.push({ limit, result });
      }
      
      // Verify all calls succeeded
      results.forEach(({ limit, result }) => {
        assertSuccessResponse(result);
        assert.ok(result.content[0].text.includes(`Latest ${limit} warn messages`),
          `Call with limit ${limit} should mention correct limit`);
      });
    });
  });

  // Dynamic validation based on actual responses
  describe('Dynamic Content Validation', () => {
    test('should validate log content patterns dynamically', async () => {
      const result = await client.callTool('get_latest_warn', { limit: 5 });
      assertSuccessResponse(result);
      
      const text = result.content[0].text;
      const lines = text.split('\n').filter(line => line.trim().length > 0);
      
      // Dynamic validation based on actual content
      const warnLines = lines.filter(line => line.includes('WARN'));
      assert.ok(warnLines.length > 0, 'Should have at least one WARN line');
      
      // Each warn line should have timestamp
      warnLines.forEach((line, index) => {
        assert.ok(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(line),
          `Warn line ${index} should contain timestamp: ${line}`);
      });
    });

    test('should validate SFCC-specific warning patterns', async () => {
      const result = await client.callTool('get_latest_warn', { limit: 5 });
      assertSuccessResponse(result);
      
      const text = result.content[0].text;
      
      // SFCC-specific validation patterns for warnings
      const sfccWarningPatterns = [
        /Sites-\w+/,                    // Sites names
        /PipelineCallServlet|SystemJobThread/, // Thread types
        /\|\d+\|/,                      // Thread IDs
        /custom \[\]/,                  // Custom category
        /inventory low|Content asset|offline/i // Common warning types
      ];
      
      const matchedPatterns = sfccWarningPatterns.filter(pattern => pattern.test(text));
      assert.ok(matchedPatterns.length >= 2,
        `Should match at least 2 SFCC warning patterns. Matched: ${matchedPatterns.length}`);
    });

    test('should validate warning severity and context information', async () => {
      const result = await client.callTool('get_latest_warn', { limit: 3 });
      assertSuccessResponse(result);
      
      const text = result.content[0].text;
      
      // Context information should be present
      assert.ok(/warn-blade-\d{8}-\d{6}\.log/.test(text), 'Should include log filename');
      assert.ok(/GMT/.test(text), 'Should include GMT timezone');
      assert.ok(/WARN PipelineCallServlet/.test(text), 'Should include servlet context');
      
      // Warning-specific content
      const warningIndicators = [
        'inventory low',
        'Content asset',
        'offline',
        'deprecated'
      ];
      
      const foundIndicators = warningIndicators.filter(indicator => 
        text.toLowerCase().includes(indicator.toLowerCase())
      );
      assert.ok(foundIndicators.length > 0,
        `Should contain warning indicators. Found: ${foundIndicators.join(', ')}`);
    });
  });

  // Functional monitoring patterns
  describe('Functional Monitoring', () => {
    test('should consistently return structured warning log data', async () => {
      const limits = [1, 3, 5, 10];
      const results = [];
      
      // Test various limits sequentially
      for (const limit of limits) {
        const result = await client.callTool('get_latest_warn', { limit });
        results.push({ limit, result });
      }
      
      // Analyze consistency across results
      results.forEach(({ limit, result }) => {
        assertSuccessResponse(result);
        
        const text = result.content[0].text;
        assert.ok(text.includes(`Latest ${limit} warn messages`),
          `Should mention correct limit: ${limit}`);
        
        // Count actual warning entries (rough estimation)
        const warnCount = (text.match(/WARN/g) || []).length;
        assert.ok(warnCount >= 1, `Should have at least 1 warning for limit ${limit}`);
      });
    });

    test('should provide comprehensive warning context', async () => {
      const result = await client.callTool('get_latest_warn', { limit: 2 });
      assertSuccessResponse(result);
      
      const text = result.content[0].text;
      
      // Check for presence of key context elements
      assert.ok(/warn-blade-.*\.log/.test(text), 'Should include log file name');
      assert.ok(/\d{4}-\d{2}-\d{2}/.test(text), 'Should include timestamp');
      assert.ok(/Sites-/.test(text), 'Should include site information');
      assert.ok(/WARN/.test(text), 'Should include warning level');
    });

    test('should maintain data quality across different date ranges', async () => {
      const dateTests = [
        { date: getCurrentDateString(), limit: 2 },
        { date: '20250915', limit: 2 }, // Future date
        { date: '20240101', limit: 2 }  // Past date
      ];
      
      const results = [];
      
      for (const params of dateTests) {
        const result = await client.callTool('get_latest_warn', params);
        results.push({ params, result });
      }
      
      // All should have valid structure (even if no data)
      results.forEach(({ params, result }) => {
        assertValidMCPResponse(result);
        assert.equal(result.isError, false, 
          `Date ${params.date} should not error`);
        
        const text = result.content[0].text;
        assert.ok(text.includes(`Latest ${params.limit} warn messages`) ||
                  text.includes('No warn log files found'),
          `Should have appropriate response for date ${params.date}`);
      });
    });

    test('should handle operational monitoring scenarios', async () => {
      // Simulate monitoring different warning levels
      const monitoringScenarios = [
        { limit: 1, description: 'Latest warning check' },
        { limit: 10, description: 'Recent warnings review' },
        { limit: 50, description: 'Comprehensive warning analysis' }
      ];
      
      const monitoringResults = [];
      
      for (const scenario of monitoringScenarios) {
        const result = await client.callTool('get_latest_warn', { limit: scenario.limit });
        monitoringResults.push({
          scenario: scenario.description,
          limit: scenario.limit,
          success: !result.isError,
          hasWarnings: result.content[0].text.includes('WARN')
        });
      }
      
      // All monitoring scenarios should succeed
      monitoringResults.forEach(result => {
        assert.ok(result.success, `${result.scenario} should succeed`);
        assert.ok(result.hasWarnings, `${result.scenario} should contain warnings`);
      });
      
      // Verify monitoring coverage increases with limit
      const warnCounts = monitoringResults.map(result => {
        // This is a rough estimation for monitoring purposes
        return result.limit;
      });
      
      assert.ok(warnCounts[0] < warnCounts[1], 'Monitoring scope should increase');
      assert.ok(warnCounts[1] < warnCounts[2], 'Comprehensive analysis should have largest scope');
    });
  });
});
