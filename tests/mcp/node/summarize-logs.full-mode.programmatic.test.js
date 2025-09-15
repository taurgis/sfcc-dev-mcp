import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-conductor';

describe('summarize_logs - Full Mode Programmatic Tests', () => {
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

  // Helper function to get current date in YYYYMMDD format
  function getCurrentDateString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }

  // Helper functions for common validations
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

  function assertSummaryFormat(result, expectedDate = null) {
    assertSuccessResponse(result);
    const text = result.content[0].text;
    
    // Should contain log summary header
    if (expectedDate) {
      assert.ok(text.includes(`Log Summary for ${expectedDate}`),
        `Should contain "Log Summary for ${expectedDate}"`);
    } else {
      assert.ok(/Log Summary for \d{8}/.test(text),
        'Should contain "Log Summary for YYYYMMDD" pattern');
    }
    
    // Should contain emoji sections
    assert.ok(text.includes('📊 Counts:'), 'Should contain counts section');
    assert.ok(text.includes('📁 Log Files'), 'Should contain log files section');
    assert.ok(text.includes('🔥 Key Issues:'), 'Should contain key issues section');
    
    // Should contain log level counts
    assert.ok(text.includes('Errors:'), 'Should contain error count');
    assert.ok(text.includes('Warnings:'), 'Should contain warning count');
    assert.ok(text.includes('Info:'), 'Should contain info count');
    assert.ok(text.includes('Debug:'), 'Should contain debug count');
  }

  function assertNoLogsFound(result, expectedDate) {
    assertSuccessResponse(result);
    const text = result.content[0].text;
    assert.ok(text.includes(`No log files found for date ${expectedDate}`),
      `Should indicate no logs found for date ${expectedDate}`);
  }

  function validateLogFileEntries(text) {
    // Should contain log file patterns
    const logFilePatterns = [
      /error-blade-\d{8}-\d{6}\.log/,
      /warn-blade-\d{8}-\d{6}\.log/,
      /info-blade-\d{8}-\d{6}\.log/,
      /debug-blade-\d{8}-\d{6}\.log/
    ];
    
    return logFilePatterns.some(pattern => pattern.test(text));
  }

  function validateLogCounts(text) {
    // Should contain numeric counts
    const countPatterns = [
      /Errors: \d+/,
      /Warnings: \d+/,
      /Info: \d+/,
      /Debug: \d+/
    ];
    
    return countPatterns.every(pattern => pattern.test(text));
  }

  // Basic functionality tests
  describe('Basic Functionality', () => {
    test('should retrieve comprehensive log summary with default parameters', async () => {
      const result = await client.callTool('summarize_logs', {});
      
      assertSummaryFormat(result);
      
      const text = result.content[0].text;
      
      // Validate structure components
      assert.ok(validateLogCounts(text), 'Should contain valid log counts');
      
      // Should contain key issues assessment
      assert.ok(text.includes('No major issues detected') || 
                text.includes('Key issues identified') ||
                text.includes('Critical errors found'),
        'Should contain key issues assessment');
    });

    test('should handle specific date parameter correctly', async () => {
      const testDate = getCurrentDateString();
      const result = await client.callTool('summarize_logs', { date: testDate });
      
      assertSummaryFormat(result, testDate);
      
      const text = result.content[0].text;
      
      // Should either show summary or no logs message
      const hasLogs = text.includes('📊 Counts:');
      const noLogs = text.includes('No log files found');
      
      assert.ok(hasLogs || noLogs, 
        'Should either show log summary or no logs message');
    });

    test('should show detailed structure when logs are available', async () => {
      const result = await client.callTool('summarize_logs', {});
      
      assertSuccessResponse(result);
      const text = result.content[0].text;
      
      if (text.includes('📊 Counts:')) {
        // Has logs - validate full structure
        assert.ok(validateLogCounts(text), 'Should have valid count format');
        assert.ok(text.includes('📁 Log Files'), 'Should list log files');
        
        // Should show log file count
        assert.ok(/Log Files \(\d+\)/.test(text), 'Should show log file count');
        
        // Should contain key issues analysis
        assert.ok(text.includes('🔥 Key Issues:'), 'Should contain key issues section');
      }
    });
  });

  // Date parameter validation tests
  describe('Date Parameter Validation', () => {
    test('should handle valid YYYYMMDD date format', async () => {
      const testDate = '20240315';
      const result = await client.callTool('summarize_logs', { date: testDate });
      
      assertValidMCPResponse(result);
      
      // Should either show summary for that date or no logs message
      const text = result.content[0].text;
      assert.ok(text.includes(`Log Summary for ${testDate}`) || 
                text.includes(`No log files found for date ${testDate}`),
        'Should handle specific date correctly');
    });

    test('should handle date with no available logs gracefully', async () => {
      const futureDate = '20220101'; // Past date unlikely to have logs
      const result = await client.callTool('summarize_logs', { date: futureDate });
      
      assertNoLogsFound(result, futureDate);
    });

    test('should handle future date gracefully', async () => {
      const futureDate = '20301231';
      const result = await client.callTool('summarize_logs', { date: futureDate });
      
      assertNoLogsFound(result, futureDate);
    });

    test('should handle invalid date format gracefully', async () => {
      const invalidDate = 'not-a-date';
      const result = await client.callTool('summarize_logs', { date: invalidDate });
      
      assertNoLogsFound(result, invalidDate);
    });

    test('should handle malformed date format gracefully', async () => {
      const malformedDate = '2024-01-01'; // Wrong format
      const result = await client.callTool('summarize_logs', { date: malformedDate });
      
      assertNoLogsFound(result, malformedDate);
    });

    test('should handle partial date formats gracefully', async () => {
      const partialDate = '202401'; // Incomplete YYYYMMDD
      const result = await client.callTool('summarize_logs', { date: partialDate });
      
      assertNoLogsFound(result, partialDate);
    });
  });

  // Edge cases and error scenarios
  describe('Edge Cases and Error Scenarios', () => {
    test('should handle empty arguments object', async () => {
      const result = await client.callTool('summarize_logs', {});
      
      assertSummaryFormat(result); // Should use today's date
    });

    test('should handle missing arguments parameter', async () => {
      const result = await client.callTool('summarize_logs');
      
      assertSummaryFormat(result); // Should use today's date
    });

    test('should handle null date parameter', async () => {
      const result = await client.callTool('summarize_logs', { date: null });
      
      assertValidMCPResponse(result);
      // Should handle gracefully - may use default or show error
    });

    test('should handle empty string date parameter', async () => {
      const result = await client.callTool('summarize_logs', { date: '' });
      
      assertValidMCPResponse(result);
      // Should handle gracefully
    });

    test('should handle extra parameters gracefully', async () => {
      const result = await client.callTool('summarize_logs', { 
        date: getCurrentDateString(),
        extraParam: 'should-be-ignored'
      });
      
      assertValidMCPResponse(result);
      // Should work normally, ignoring extra parameters
    });
  });

  // Content validation tests
  describe('Content Validation', () => {
    test('should include proper count formatting', async () => {
      const result = await client.callTool('summarize_logs', {});
      
      assertSuccessResponse(result);
      const text = result.content[0].text;
      
      if (text.includes('📊 Counts:')) {
        // Should have proper numeric formatting for counts
        const lines = text.split('\n');
        const countsSection = lines.find(line => line.includes('Errors:'));
        
        if (countsSection) {
          assert.ok(/- Errors: \d+/.test(text), 'Error count should be numeric');
          assert.ok(/- Warnings: \d+/.test(text), 'Warning count should be numeric');
          assert.ok(/- Info: \d+/.test(text), 'Info count should be numeric');
          assert.ok(/- Debug: \d+/.test(text), 'Debug count should be numeric');
        }
      }
    });

    test('should provide actionable key issues assessment', async () => {
      const result = await client.callTool('summarize_logs', {});
      
      assertSuccessResponse(result);
      const text = result.content[0].text;
      
      if (text.includes('🔥 Key Issues:')) {
        // Should provide some form of assessment
        const keyIssuesSection = text.split('🔥 Key Issues:')[1];
        assert.ok(keyIssuesSection && keyIssuesSection.trim().length > 0,
          'Key issues section should not be empty');
        
        // Should contain some form of status message
        assert.ok(keyIssuesSection.includes('No major issues') ||
                  keyIssuesSection.includes('detected') ||
                  keyIssuesSection.includes('found') ||
                  keyIssuesSection.includes('Critical'),
          'Should contain meaningful assessment');
      }
    });

    test('should include log file information when available', async () => {
      const result = await client.callTool('summarize_logs', {});
      
      assertSuccessResponse(result);
      const text = result.content[0].text;
      
      if (text.includes('📁 Log Files')) {
        // Should contain file count in parentheses
        assert.ok(/📁 Log Files \(\d+\)/.test(text), 
          'Should show log file count');
        
        // Should list actual log files if available
        if (validateLogFileEntries(text)) {
          assert.ok(text.includes('.log'), 'Should contain log file extensions');
        }
      }
    });

    test('should maintain consistent date format in header', async () => {
      const testDate = '20250314';
      const result = await client.callTool('summarize_logs', { date: testDate });
      
      assertValidMCPResponse(result);
      const text = result.content[0].text;
      
      // Should use YYYYMMDD format consistently
      if (text.includes('Log Summary for')) {
        assert.ok(text.includes(`Log Summary for ${testDate}`),
          'Should use exact YYYYMMDD format in header');
      } else {
        assert.ok(text.includes(`No log files found for date ${testDate}`),
          'Should use exact YYYYMMDD format in no-logs message');
      }
    });
  });

  // System health assessment tests
  describe('System Health Assessment', () => {
    test('should provide comprehensive system overview', async () => {
      const result = await client.callTool('summarize_logs', {});
      
      assertSuccessResponse(result);
      const text = result.content[0].text;
      
      if (text.includes('📊 Counts:')) {
        // Should provide all log level counts
        assert.ok(text.includes('Errors:'), 'Should report error count');
        assert.ok(text.includes('Warnings:'), 'Should report warning count');
        assert.ok(text.includes('Info:'), 'Should report info count');
        assert.ok(text.includes('Debug:'), 'Should report debug count');
        
        // Should provide log file overview
        assert.ok(text.includes('📁 Log Files'), 'Should provide file overview');
        
        // Should provide health assessment
        assert.ok(text.includes('🔥 Key Issues:'), 'Should provide health assessment');
      }
    });

    test('should use appropriate emoji indicators', async () => {
      const result = await client.callTool('summarize_logs', {});
      
      assertSuccessResponse(result);
      const text = result.content[0].text;
      
      // Should use consistent emoji patterns
      assert.ok(text.includes('📊'), 'Should use chart emoji for counts');
      assert.ok(text.includes('📁'), 'Should use folder emoji for files');
      assert.ok(text.includes('🔥'), 'Should use fire emoji for key issues');
    });

    test('should handle various log scenarios appropriately', async () => {
      const result = await client.callTool('summarize_logs', {});
      
      assertValidMCPResponse(result);
      const text = result.content[0].text;
      
      // Should handle both scenarios: logs available or not
      const hasLogSummary = text.includes('📊 Counts:');
      const noLogsFound = text.includes('No log files found');
      
      assert.ok(hasLogSummary || noLogsFound,
        'Should appropriately handle logs available or not available');
      
      if (hasLogSummary) {
        // Validate complete summary structure
        assertSummaryFormat(result);
      }
    });
  });

  // Response format validation
  describe('Response Format Validation', () => {
    test('should return standard MCP response structure', async () => {
      const result = await client.callTool('summarize_logs', {});
      
      assertValidMCPResponse(result);
      
      // Should have exactly one content element
      assert.equal(result.content.length, 1, 'Should have exactly one content element');
      
      // Content should be text type
      assert.equal(result.content[0].type, 'text', 'Content type should be text');
      
      // Text should be non-empty string
      assert.ok(typeof result.content[0].text === 'string', 'Text should be string');
      assert.ok(result.content[0].text.length > 0, 'Text should not be empty');
    });

    test('should not be marked as error for valid requests', async () => {
      const result = await client.callTool('summarize_logs', {});
      
      assertValidMCPResponse(result);
      assert.equal(result.isError, false, 'Should not be marked as error');
    });

    test('should maintain consistent response format across different dates', async () => {
      const dates = [getCurrentDateString(), '20220101', '20301231'];
      
      for (const date of dates) {
        const result = await client.callTool('summarize_logs', { date });
        
        assertValidMCPResponse(result);
        
        // All responses should have the same basic structure
        assert.equal(result.content.length, 1, 
          `Date ${date} should have exactly one content element`);
        assert.equal(result.content[0].type, 'text',
          `Date ${date} content type should be text`);
        assert.equal(result.isError, false,
          `Date ${date} should not be marked as error`);
      }
    });
  });
});
