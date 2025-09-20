import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

describe('search_logs - Full Mode Programmatic Tests', () => {
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

  function parseResponseText(text) {
    // The response may come wrapped in quotes, so parse if needed
    return text.startsWith('"') && text.endsWith('"') 
      ? JSON.parse(text) 
      : text;
  }

  function assertTextContent(result, expectedSubstring) {
    assertValidMCPResponse(result);
    assert.equal(result.content[0].type, 'text');
    const actualText = parseResponseText(result.content[0].text);
    assert.ok(actualText.includes(expectedSubstring),
      `Expected "${expectedSubstring}" in "${actualText}"`);
  }

  function assertSuccessResponse(result) {
    assertValidMCPResponse(result);
    assert.equal(result.isError, false, 'Should not be an error response');
    assert.equal(result.content[0].type, 'text');
  }

  function assertErrorResponse(result, expectedErrorText) {
    assertValidMCPResponse(result);
    assert.equal(result.isError, true, 'Should be an error response');
    assert.equal(result.content[0].type, 'text');
    if (expectedErrorText) {
      assertTextContent(result, expectedErrorText);
    }
  }

  function assertSearchLogFormat(result, pattern, expectedLimit = null) {
    assertSuccessResponse(result);
    const text = parseResponseText(result.content[0].text);
    
    if (text.includes('No matches found')) {
      // Valid case - no matching entries
      assert.ok(text.includes(`No matches found for "${pattern}"`),
        `Should mention pattern "${pattern}" in no matches message`);
      return 0;
    }
    
    // Should contain the found matches message
    const foundMatch = text.match(/Found (\d+) matches for "([^"]+)"/);
    assert.ok(foundMatch, 'Should contain "Found X matches for" message');
    
    const actualCount = parseInt(foundMatch[1]);
    const searchPattern = foundMatch[2];
    
    assert.equal(searchPattern, pattern, 'Pattern should match what was searched');
    
    if (expectedLimit !== null) {
      assert.ok(actualCount <= expectedLimit, 
        `Actual count ${actualCount} should not exceed limit ${expectedLimit}`);
    }
    
    // Should contain log entries with proper formatting if any matches found
    if (actualCount > 0) {
      // Should contain log file name pattern (using current date dynamically)
      const currentDate = getCurrentDateString();
      const logFilePattern = new RegExp(`\\[(error|warn|info|debug)-blade-${currentDate}-\\d{6}\\.log\\]`);
      assert.ok(logFilePattern.test(text),
        `Should contain log file name pattern for current date ${currentDate}`);
      
      // Should contain GMT timestamps
      assert.ok(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3} GMT/.test(text),
        'Should contain GMT timestamp pattern');
      
      // Should contain SFCC-specific patterns (threads, sites, etc.)
      assert.ok(/PipelineCallServlet|SystemJobThread/.test(text),
        'Should contain SFCC thread patterns');
    }
    
    return actualCount;
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
    test('should search for patterns with default parameters', async () => {
      const result = await client.callTool('search_logs', {
        pattern: 'INFO'
      });
      
      const matchCount = assertSearchLogFormat(result, 'INFO');
      
      if (matchCount > 0) {
        // Should contain INFO level entries
        assertTextContent(result, 'INFO');
        
        // Should contain SFCC-specific patterns
        const text = parseResponseText(result.content[0].text);
        assert.ok(text.includes('Sites-'), 'Should contain Sites information');
      }
    });

    test('should respect limit parameter', async () => {
      const result = await client.callTool('search_logs', {
        pattern: 'ERROR',
        limit: 3
      });
      
      const matchCount = assertSearchLogFormat(result, 'ERROR', 3);
      
      if (matchCount > 0) {
        assertTextContent(result, 'ERROR');
        
        // Should not exceed the requested limit
        const text = parseResponseText(result.content[0].text);
        const foundMatch = text.match(/Found (\d+) matches/);
        if (foundMatch) {
          const actualCount = parseInt(foundMatch[1]);
          assert.ok(actualCount <= 3, `Should return at most 3 matches, got ${actualCount}`);
        }
      }
    });

    test('should filter by log level', async () => {
      const result = await client.callTool('search_logs', {
        pattern: 'ERROR',
        logLevel: 'error'
      });
      
      assertSearchLogFormat(result, 'ERROR');
      
      const text = parseResponseText(result.content[0].text);
      if (!text.includes('No matches found')) {
        // When filtering by error level, should only contain error log entries
        assert.ok(text.includes('error-blade'),
          'Should contain error log file references when filtering by error level');
        
        // Should not contain other log levels in file names
        assert.ok(!text.includes('info-blade') && !text.includes('warn-blade') && !text.includes('debug-blade'),
          'Should not contain non-error log file references when filtering by error level');
      }
    });

    test('should handle specific date parameter', async () => {
      const result = await client.callTool('search_logs', {
        pattern: 'INFO',
        date: getCurrentDateString()
      });
      
      assertSearchLogFormat(result, 'INFO');
    });

    test('should combine all parameters (pattern, logLevel, date, limit)', async () => {
      const result = await client.callTool('search_logs', {
        pattern: 'Job',
        logLevel: 'info',
        date: getCurrentDateString(),
        limit: 5
      });
      
      const matchCount = assertSearchLogFormat(result, 'Job', 5);
      
      if (matchCount > 0) {
        const text = parseResponseText(result.content[0].text);
        
        // Should contain info level entries
        assert.ok(text.includes('info-blade'),
          'Should contain info log file references');
        
        // Should contain Job-related content
        assertTextContent(result, 'Job');
      }
    });
  });

  // Search pattern specificity tests
  describe('Search Pattern Specificity', () => {
    test('should search for specific error patterns', async () => {
      const result = await client.callTool('search_logs', {
        pattern: 'Custom cartridge error',
        logLevel: 'error'
      });
      
      assertSearchLogFormat(result, 'Custom cartridge error');
      
      const text = parseResponseText(result.content[0].text);
      if (!text.includes('No matches found')) {
        assertTextContent(result, 'Custom cartridge error');
        assertTextContent(result, 'ERROR');
      }
    });

    test('should search for job-related entries', async () => {
      const result = await client.callTool('search_logs', {
        pattern: 'SystemJobThread',
        limit: 3
      });
      
      assertSearchLogFormat(result, 'SystemJobThread', 3);
      
      const text = parseResponseText(result.content[0].text);
      if (!text.includes('No matches found')) {
        assertTextContent(result, 'SystemJobThread');
      }
    });

    test('should search for customer-related entries', async () => {
      const result = await client.callTool('search_logs', {
        pattern: 'Customer',
        logLevel: 'info',
        limit: 2
      });
      
      assertSearchLogFormat(result, 'Customer', 2);
      
      const text = parseResponseText(result.content[0].text);
      if (!text.includes('No matches found')) {
        assertTextContent(result, 'Customer');
        assert.ok(text.includes('info-blade'),
          'Should contain info log file references');
      }
    });

    test('should search for pipeline-related entries', async () => {
      const result = await client.callTool('search_logs', {
        pattern: 'PipelineCallServlet',
        limit: 5
      });
      
      assertSearchLogFormat(result, 'PipelineCallServlet', 5);
      
      const text = parseResponseText(result.content[0].text);
      if (!text.includes('No matches found')) {
        assertTextContent(result, 'PipelineCallServlet');
        
        // Should contain Sites information
        assert.ok(text.includes('Sites-'),
          'Pipeline entries should contain Sites information');
      }
    });

    test('should handle complex pattern searches (regex-like)', async () => {
      const result = await client.callTool('search_logs', {
        pattern: 'Order.*confirm',
        limit: 10
      });
      
      assertSearchLogFormat(result, 'Order.*confirm', 10);
    });
  });

  // Edge cases and error handling tests
  describe('Edge Cases and Error Handling', () => {
    test('should handle pattern with no matches gracefully', async () => {
      const result = await client.callTool('search_logs', {
        pattern: 'nonexistentpattern123456789'
      });
      
      assertSuccessResponse(result);
      const text = parseResponseText(result.content[0].text);
      assert.ok(text.includes('No matches found for "nonexistentpattern123456789"'),
        'Should return no matches message for non-existent pattern');
    });

    test('should handle empty pattern with error', async () => {
      const result = await client.callTool('search_logs', {
        pattern: ''
      });
      
      assertErrorResponse(result, 'pattern must be a non-empty string');
    });

    test('should handle missing pattern parameter with error', async () => {
      const result = await client.callTool('search_logs', {});
      
      assertErrorResponse(result, 'pattern must be a non-empty string');
    });

    test('should handle invalid logLevel parameter', async () => {
      const result = await client.callTool('search_logs', {
        pattern: 'INFO',
        logLevel: 'invalid_level'
      });
      
      assertErrorResponse(result, 'Invalid log level');
    });

    test('should handle zero limit parameter', async () => {
      const result = await client.callTool('search_logs', {
        pattern: 'INFO',
        limit: 0
      });
      
      assertErrorResponse(result, 'Invalid limit');
    });

    test('should handle negative limit parameter', async () => {
      const result = await client.callTool('search_logs', {
        pattern: 'INFO',
        limit: -5
      });
      
      assertErrorResponse(result, 'Invalid limit');
    });

    test('should handle very large limit parameter', async () => {
      const result = await client.callTool('search_logs', {
        pattern: 'INFO',
        limit: 2000
      });
      
      assertErrorResponse(result, 'Invalid limit');
    });

    test('should handle string limit parameter gracefully', async () => {
      const result = await client.callTool('search_logs', {
        pattern: 'INFO',
        limit: '5'
      });
      
      assertErrorResponse(result, 'Invalid limit');
    });

    test('should handle invalid date format gracefully', async () => {
      const result = await client.callTool('search_logs', {
        pattern: 'INFO',
        date: 'invalid-date'
      });
      
      // This should not error, but return no matches for the invalid date
      assertSuccessResponse(result);
      assertTextContent(result, 'No matches found');
    });

    test('should handle date from the past (no logs)', async () => {
      const result = await client.callTool('search_logs', {
        pattern: 'INFO',
        date: '20200101'  // Old date that should have no logs
      });
      
      assertSuccessResponse(result);
      assertTextContent(result, 'No matches found');
    });
  });

  // Log level validation tests
  describe('Log Level Validation', () => {
    const validLogLevels = ['error', 'warn', 'info', 'debug'];
    
    validLogLevels.forEach(level => {
      test(`should accept valid log level: ${level}`, async () => {
        const result = await client.callTool('search_logs', {
          pattern: 'test',
          logLevel: level,
          limit: 1
        });
        
        // Should not error, may or may not find matches
        assertSuccessResponse(result);
      });
    });

    test('should validate log level case sensitivity', async () => {
      const result = await client.callTool('search_logs', {
        pattern: 'INFO',
        logLevel: 'ERROR'  // Uppercase should be invalid
      });
      
      assertErrorResponse(result, 'Invalid log level');
    });
  });

  // Content validation tests
  describe('Content Validation', () => {
    test('should return search results with proper log entry format', async () => {
      const result = await client.callTool('search_logs', {
        pattern: 'ERROR',
        limit: 2
      });
      
      const matchCount = assertSearchLogFormat(result, 'ERROR', 2);
      
      if (matchCount > 0) {
        const text = parseResponseText(result.content[0].text);
        
        // Should contain the current date in log file names
        const currentDate = getCurrentDateString();
        assert.ok(text.includes(currentDate),
          `Should contain current date ${currentDate} in log file names`);
        
        // Should contain thread IDs
        assert.ok(/\|\d+\|/.test(text),
          'Should contain thread ID patterns');
        
        // Should contain site information
        assert.ok(text.includes('Sites-'),
          'Should contain Sites information');
      }
    });

    test('should return log entries with timestamp and log file information', async () => {
      const result = await client.callTool('search_logs', {
        pattern: 'Job',
        limit: 1
      });
      
      const matchCount = assertSearchLogFormat(result, 'Job', 1);
      
      if (matchCount > 0) {
        const text = parseResponseText(result.content[0].text);
        
        // Should contain proper timestamp format
        assert.ok(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3} GMT/.test(text),
          'Should contain proper GMT timestamp format');
        
        // Should contain log file bracket notation
        assert.ok(/\[.*blade.*\.log\]/.test(text),
          'Should contain log file name in brackets');
      }
    });
  });

  // Performance-related functional tests
  describe('Performance and Scale', () => {
    test('should handle large result sets efficiently', async () => {
      const result = await client.callTool('search_logs', {
        pattern: 'Sites',
        limit: 50
      });
      
      // Should complete successfully regardless of result count
      assertSuccessResponse(result);
      
      const text = parseResponseText(result.content[0].text);
      if (!text.includes('No matches found')) {
        // If matches found, verify format
        assertSearchLogFormat(result, 'Sites', 50);
      }
    });

    test('should handle searches with no matches efficiently', async () => {
      const result = await client.callTool('search_logs', {
        pattern: 'definitely_nonexistent_pattern_12345',
        limit: 100
      });
      
      assertSuccessResponse(result);
      assertTextContent(result, 'No matches found');
    });

    test('should handle very specific searches', async () => {
      const result = await client.callTool('search_logs', {
        pattern: 'Custom cartridge error: Unable to connect',
        logLevel: 'error',
        limit: 1
      });
      
      // Should handle specific searches without issues
      assertSuccessResponse(result);
    });
  });

  // Integration tests with other log parameters
  describe('Integration Testing', () => {
    test('should work consistently across multiple calls', async () => {
      // First call
      const result1 = await client.callTool('search_logs', {
        pattern: 'ERROR',
        limit: 3
      });
      assertSuccessResponse(result1);
      
      // Second call with same parameters should be consistent
      const result2 = await client.callTool('search_logs', {
        pattern: 'ERROR',
        limit: 3
      });
      assertSuccessResponse(result2);
      
      // Results should be consistent (same count and similar content)
      const text1 = parseResponseText(result1.content[0].text);
      const text2 = parseResponseText(result2.content[0].text);
      
      if (!text1.includes('No matches found') && !text2.includes('No matches found')) {
        const count1 = text1.match(/Found (\d+) matches/)?.[1];
        const count2 = text2.match(/Found (\d+) matches/)?.[1];
        assert.equal(count1, count2, 'Search results should be consistent across calls');
      }
    });

    test('should maintain search accuracy with different log levels', async () => {
      const errorResult = await client.callTool('search_logs', {
        pattern: 'Payment',
        logLevel: 'error',
        limit: 5
      });
      
      const infoResult = await client.callTool('search_logs', {
        pattern: 'Payment',
        logLevel: 'info',
        limit: 5
      });
      
      assertSuccessResponse(errorResult);
      assertSuccessResponse(infoResult);
      
      // Both should be valid responses, may have different content
      const errorText = parseResponseText(errorResult.content[0].text);
      const infoText = parseResponseText(infoResult.content[0].text);
      
      if (!errorText.includes('No matches found')) {
        assert.ok(errorText.includes('error-blade'),
          'Error level search should reference error log files');
      }
      
      if (!infoText.includes('No matches found')) {
        assert.ok(infoText.includes('info-blade'),
          'Info level search should reference info log files');
      }
    });

    test('should handle date boundaries correctly', async () => {
      const currentDate = getCurrentDateString();
      
      const result = await client.callTool('search_logs', {
        pattern: 'Sites',
        date: currentDate,
        limit: 5
      });
      
      assertSuccessResponse(result);
      
      const text = parseResponseText(result.content[0].text);
      if (!text.includes('No matches found')) {
        // Should contain the specified date in log file names
        assert.ok(text.includes(currentDate),
          `Should contain specified date ${currentDate} in results`);
      }
    });
  });
});