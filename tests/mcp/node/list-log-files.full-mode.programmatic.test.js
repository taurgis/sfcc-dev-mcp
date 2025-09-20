import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

describe('list_log_files - Full Mode Programmatic Tests', () => {
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

  function assertLogFileListFormat(result) {
    assertSuccessResponse(result);
    const text = parseResponseText(result.content[0].text);
    
    // Should start with the expected header
    assert.ok(text.includes('Available log files:'),
      'Should contain "Available log files:" header');
    
    // Should contain emoji file icons
    assert.ok(text.includes('📄'), 'Should contain file emoji icons');
    
    // Should contain log file patterns for all levels
    assert.ok(/debug-blade-\d{8}-\d{6}\.log/.test(text),
      'Should contain debug log file pattern');
    assert.ok(/error-blade-\d{8}-\d{6}\.log/.test(text),
      'Should contain error log file pattern');
    assert.ok(/info-blade-\d{8}-\d{6}\.log/.test(text),
      'Should contain info log file pattern');
    assert.ok(/warn-blade-\d{8}-\d{6}\.log/.test(text),
      'Should contain warn log file pattern');
    
    // Should contain file metadata
    assert.ok(text.includes('Size:'), 'Should contain file size information');
    assert.ok(text.includes('Modified:'), 'Should contain modification date information');
    
    // Should contain proper size format (Bytes, KB, MB)
    assert.ok(/Size: [\d.,]+ (Bytes|KB|MB)/.test(text),
      'Should contain properly formatted file sizes');
    
    // Should contain GMT timestamp format
    assert.ok(/Modified: [A-Za-z]{3}, \d{1,2} [A-Za-z]{3} \d{4} \d{2}:\d{2}:\d{2} GMT/.test(text),
      'Should contain GMT timestamp format');
  }

  function validateLogFileEntry(text, logLevel) {
    // Each log file entry should have the expected structure
    const actualText = parseResponseText(text);
    const pattern = new RegExp(`📄 \\/${logLevel}-blade-\\d{8}-\\d{6}\\.log[\\s\\S]*?Size: [\\d.,]+ (Bytes|KB|MB)[\\s\\S]*?Modified: [A-Za-z]{3}, \\d{1,2} [A-Za-z]{3} \\d{4} \\d{2}:\\d{2}:\\d{2} GMT`);
    assert.ok(pattern.test(actualText),
      `Should contain properly formatted ${logLevel} log file entry`);
  }

  // Basic functionality tests
  describe('Basic Functionality', () => {
    test('should list available log files with metadata', async () => {
      const result = await client.callTool('list_log_files', {});
      
      assertLogFileListFormat(result);
    });

    test('should handle empty parameters object', async () => {
      const result = await client.callTool('list_log_files', {});
      
      assertSuccessResponse(result);
      assertTextContent(result, 'Available log files:');
    });

    test('should not require any parameters', async () => {
      const result = await client.callTool('list_log_files', {});
      
      assertValidMCPResponse(result);
      assert.equal(result.isError, false, 'Should succeed without parameters');
    });
  });

  // Content validation tests
  describe('Content Validation', () => {
    test('should include all log file types', async () => {
      const result = await client.callTool('list_log_files', {});
      
      assertSuccessResponse(result);
      
      // Validate each log file type has proper formatting
      validateLogFileEntry(result.content[0].text, 'debug');
      validateLogFileEntry(result.content[0].text, 'error');
      validateLogFileEntry(result.content[0].text, 'info');
      validateLogFileEntry(result.content[0].text, 'warn');
    });

    test('should include file paths with forward slashes', async () => {
      const result = await client.callTool('list_log_files', {});
      
      assertSuccessResponse(result);
      const text = parseResponseText(result.content[0].text);
      
      // Should include file paths starting with forward slash
      assert.ok(text.includes('/debug-blade-'), 'Should include debug file path with forward slash');
      assert.ok(text.includes('/error-blade-'), 'Should include error file path with forward slash');
      assert.ok(text.includes('/info-blade-'), 'Should include info file path with forward slash');
      assert.ok(text.includes('/warn-blade-'), 'Should include warn file path with forward slash');
    });

    test('should format file sizes with proper units', async () => {
      const result = await client.callTool('list_log_files', {});
      
      assertSuccessResponse(result);
      const text = parseResponseText(result.content[0].text);
      
      // Should contain various size formats
      const sizeMatches = text.match(/Size: ([\d.,]+) (Bytes|KB|MB)/g);
      assert.ok(sizeMatches && sizeMatches.length >= 4, 
        'Should have at least 4 file size entries');
      
      // Each size should have valid format
      sizeMatches.forEach(sizeMatch => {
        assert.ok(/Size: [\d.,]+ (Bytes|KB|MB)/.test(sizeMatch),
          `Size format should be valid: ${sizeMatch}`);
      });
    });

    test('should include proper modification timestamps', async () => {
      const result = await client.callTool('list_log_files', {});
      
      assertSuccessResponse(result);
      const text = result.content[0].text;
      
      // Should contain GMT timestamps for all files
      const timestampMatches = text.match(/Modified: [A-Za-z]{3}, \d{1,2} [A-Za-z]{3} \d{4} \d{2}:\d{2}:\d{2} GMT/g);
      assert.ok(timestampMatches && timestampMatches.length >= 4,
        'Should have at least 4 modification timestamps');
      
      // Each timestamp should be valid format
      timestampMatches.forEach(timestamp => {
        assert.ok(/Modified: [A-Za-z]{3}, \d{1,2} [A-Za-z]{3} \d{4} \d{2}:\d{2}:\d{2} GMT/.test(timestamp),
          `Timestamp format should be valid: ${timestamp}`);
      });
    });
  });

  // Structure validation tests
  describe('Structure Validation', () => {
    test('should use consistent formatting across all file entries', async () => {
      const result = await client.callTool('list_log_files', {});
      
      assertSuccessResponse(result);
      const text = result.content[0].text;
      
      // Should have consistent structure for each log file type
      const logTypes = ['debug', 'error', 'info', 'warn'];
      
      logTypes.forEach(logType => {
        // Each type should have the full structure: emoji, path, size, modified
        const typePattern = new RegExp(`📄 \\/${logType}-blade-\\d{8}-\\d{6}\\.log[\\s\\S]*?Size: [\\d.,]+ (Bytes|KB|MB)[\\s\\S]*?Modified: [A-Za-z]{3}, \\d{1,2} [A-Za-z]{3} \\d{4} \\d{2}:\\d{2}:\\d{2} GMT`);
        assert.ok(typePattern.test(text),
          `Should have consistent structure for ${logType} log files`);
      });
    });

    test('should have proper spacing and line breaks', async () => {
      const result = await client.callTool('list_log_files', {});
      
      assertSuccessResponse(result);
      const text = result.content[0].text;
      
      // The response comes wrapped in quotes, so let's parse it
      const actualText = text.startsWith('"') && text.endsWith('"') 
        ? JSON.parse(text) 
        : text;
      
      // Should have header followed by double newline
      assert.ok(actualText.startsWith('Available log files:\n\n'),
        'Should start with header and double newline');
      
      // Should have double newlines between file entries
      const doubleNewlineCount = (actualText.match(/\n\n/g) || []).length;
      assert.ok(doubleNewlineCount >= 4, 
        'Should have double newlines separating entries');
    });

    test('should use emoji file icons consistently', async () => {
      const result = await client.callTool('list_log_files', {});
      
      assertSuccessResponse(result);
      const text = result.content[0].text;
      
      // Count emoji icons - should match number of log files
      const emojiCount = (text.match(/📄/g) || []).length;
      assert.ok(emojiCount >= 4, 'Should have emoji icon for each log file');
      
      // Each emoji should be followed by space and file path
      const emojiWithPath = text.match(/📄 \/[\w-]+\.log/g);
      assert.ok(emojiWithPath && emojiWithPath.length >= 4,
        'Each emoji should be followed by space and file path');
    });
  });

  // Error handling tests
  describe('Error Handling', () => {
    test('should ignore unknown parameters gracefully', async () => {
      const result = await client.callTool('list_log_files', { 
        unknownParam: 'value',
        anotherParam: 123 
      });
      
      assertSuccessResponse(result);
      assertTextContent(result, 'Available log files:');
    });

    test('should handle null parameters', async () => {
      const result = await client.callTool('list_log_files', { 
        param: null 
      });
      
      assertSuccessResponse(result);
      assertTextContent(result, 'Available log files:');
    });

    test('should handle empty string parameters', async () => {
      const result = await client.callTool('list_log_files', { 
        param: '' 
      });
      
      assertSuccessResponse(result);
      assertTextContent(result, 'Available log files:');
    });
  });

  // Performance and reliability tests
  describe('Performance and Reliability', () => {
    test('should respond consistently across multiple calls', async () => {
      const results = [];
      
      // Make 3 sequential calls
      for (let i = 0; i < 3; i++) {
        const result = await client.callTool('list_log_files', {});
        results.push(result);
        assertSuccessResponse(result);
      }
      
      // All results should be consistent in structure
      results.forEach((result, index) => {
        assertLogFileListFormat(result);
        assert.ok(result.content[0].text.includes('debug-blade-'),
          `Call ${index + 1} should include debug log files`);
        assert.ok(result.content[0].text.includes('error-blade-'),
          `Call ${index + 1} should include error log files`);
      });
    });

    test('should handle tool execution without stderr output', async () => {
      // Clear any existing stderr before the test
      client.clearStderr();
      
      const result = await client.callTool('list_log_files', {});
      
      assertSuccessResponse(result);
      
      // Should not generate stderr output
      const stderr = client.getStderr();
      assert.equal(stderr.trim(), '', 'Should not generate stderr output');
    });

    test('should return results within reasonable time', async () => {
      const startTime = Date.now();
      
      const result = await client.callTool('list_log_files', {});
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      assertSuccessResponse(result);
      
      // Should complete within 5 seconds (generous for CI environments)
      assert.ok(duration < 5000, 
        `Should complete within 5 seconds, took ${duration}ms`);
    });
  });

  // Integration validation tests
  describe('Integration Validation', () => {
    test('should return file information that matches SFCC log patterns', async () => {
      const result = await client.callTool('list_log_files', {});
      
      assertSuccessResponse(result);
      const text = result.content[0].text;
      
      // Should match SFCC's blade log naming convention
      assert.ok(/blade-\d{8}-\d{6}\.log/.test(text),
        'Should match SFCC blade log naming convention');
      
      // Should include all standard SFCC log levels
      assert.ok(text.includes('debug-blade-'), 'Should include debug logs');
      assert.ok(text.includes('error-blade-'), 'Should include error logs');
      assert.ok(text.includes('info-blade-'), 'Should include info logs');
      assert.ok(text.includes('warn-blade-'), 'Should include warn logs');
    });

    test('should provide file metadata useful for log analysis', async () => {
      const result = await client.callTool('list_log_files', {});
      
      assertSuccessResponse(result);
      const text = result.content[0].text;
      
      // File sizes should help determine which logs have content
      const sizeMatches = text.match(/Size: ([\d.,]+) (Bytes|KB|MB)/g);
      assert.ok(sizeMatches && sizeMatches.length >= 4,
        'Should provide size information for all log files');
      
      // Modification times should help identify recent activity
      const timeMatches = text.match(/Modified: [A-Za-z]{3}, \d{1,2} [A-Za-z]{3} \d{4} \d{2}:\d{2}:\d{2} GMT/g);
      assert.ok(timeMatches && timeMatches.length >= 4,
        'Should provide modification times for all log files');
    });

    test('should format output suitable for AI analysis', async () => {
      const result = await client.callTool('list_log_files', {});
      
      assertSuccessResponse(result);
      const text = result.content[0].text;
      
      // The response comes wrapped in quotes, so let's parse it
      const actualText = text.startsWith('"') && text.endsWith('"') 
        ? JSON.parse(text) 
        : text;
      
      // Should be structured and readable
      assert.ok(actualText.includes('Available log files:'), 'Should have clear header');
      assert.ok(actualText.includes('📄'), 'Should use visual indicators');
      assert.ok(/Size: [\d.,]+ (Bytes|KB|MB)/.test(actualText), 'Should have parseable size info');
      assert.ok(/Modified: .+ GMT/.test(actualText), 'Should have parseable timestamp info');
      
      // Should be consistently formatted for parsing
      const lines = actualText.split('\n');
      const fileLines = lines.filter(line => line.includes('📄'));
      assert.ok(fileLines.length >= 4, 'Should have clearly identifiable file lines');
    });
  });
});
