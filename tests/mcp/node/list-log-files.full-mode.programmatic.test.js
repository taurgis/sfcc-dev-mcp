import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

describe('list_log_files - Full Mode Programmatic Tests - Optimized', () => {
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

  // Optimized helper functions
  function assertValidMCPResponse(result) {
    assert.ok(result.content, 'Should have content');
    assert.ok(Array.isArray(result.content), 'Content should be array');
    assert.equal(typeof result.isError, 'boolean', 'isError should be boolean');
    assert.equal(result.isError, false, 'Should not be an error response');
    assert.equal(result.content[0].type, 'text');
  }

  function parseResponseText(text) {
    return text.startsWith('"') && text.endsWith('"') ? JSON.parse(text) : text;
  }

  function assertCompleteLogFileFormat(result) {
    assertValidMCPResponse(result);
    const text = parseResponseText(result.content[0].text);
    
    // Header validation
    assert.ok(text.includes('Available log files:'), 'Should contain header');
    
    // All log levels present with correct patterns
    const logTypes = ['debug', 'error', 'info', 'warn'];
    logTypes.forEach(logType => {
      assert.ok(new RegExp(`${logType}-blade-\\d{8}-\\d{6}\\.log`).test(text),
        `Should contain ${logType} log file pattern`);
    });
    
    // File structure validation (emoji, paths, metadata)
    assert.ok(text.includes('📄'), 'Should contain file emoji icons');
    assert.ok(/📄 \/[\w-]+\.log/.test(text), 'Should have proper file path format');
    
    // Metadata validation (sizes and timestamps)
    const sizeMatches = text.match(/Size: [\d.,]+ (Bytes|KB|MB)/g);
    assert.ok(sizeMatches && sizeMatches.length >= 4, 'Should have size info for all files');
    
    const timestampMatches = text.match(/Modified: [A-Za-z]{3}, \d{1,2} [A-Za-z]{3} \d{4} \d{2}:\d{2}:\d{2} GMT/g);
    assert.ok(timestampMatches && timestampMatches.length >= 4, 'Should have timestamps for all files');
    
    return text;
  }

  // Core functionality tests
  describe('Core Functionality', () => {
    test('should list all log files with complete metadata and formatting', async () => {
      const result = await client.callTool('list_log_files', {});
      const text = assertCompleteLogFileFormat(result);
      
      // Validate comprehensive structure in one test
      assert.ok(text.startsWith('Available log files:\n\n'), 'Should have proper header format');
      assert.ok((text.match(/\n\n/g) || []).length >= 4, 'Should have proper spacing between entries');
      
      // Validate each log type has complete structure
      const logTypes = ['debug', 'error', 'info', 'warn'];
      logTypes.forEach(logType => {
        const pattern = new RegExp(`📄 \\/${logType}-blade-\\d{8}-\\d{6}\\.log[\\s\\S]*?Size: [\\d.,]+ (Bytes|KB|MB)[\\s\\S]*?Modified: [A-Za-z]{3}, \\d{1,2} [A-Za-z]{3} \\d{4} \\d{2}:\\d{2}:\\d{2} GMT`);
        assert.ok(pattern.test(text), `Should have complete structure for ${logType} files`);
      });
    });

    test('should handle various parameter scenarios gracefully', async () => {
      // Test multiple parameter scenarios in one test
      const scenarios = [
        {},  // Empty object
        { unknownParam: 'value', anotherParam: 123 },  // Unknown parameters
        { param: null },  // Null values
        { param: '' }     // Empty strings
      ];
      
      for (const params of scenarios) {
        const result = await client.callTool('list_log_files', params);
        assertValidMCPResponse(result);
        assert.ok(result.content[0].text.includes('Available log files:'),
          `Should work with params: ${JSON.stringify(params)}`);
      }
    });
  });

  // Advanced validation tests
  describe('Integration and Reliability', () => {
    test('should provide SFCC-compatible file information for analysis workflows', async () => {
      const result = await client.callTool('list_log_files', {});
      const text = assertCompleteLogFileFormat(result);
      
      // SFCC-specific validation
      assert.ok(/blade-\d{8}-\d{6}\.log/.test(text), 'Should match SFCC blade naming convention');
      
      // AI analysis compatibility
      const lines = text.split('\n');
      const fileLines = lines.filter(line => line.includes('📄'));
      assert.ok(fileLines.length >= 4, 'Should have identifiable file entries for parsing');
      
      // Metadata usefulness for log analysis
      assert.ok(/Size: [\d.,]+ (Bytes|KB|MB)/.test(text), 'Should have parseable size information');
      assert.ok(/Modified: .+ GMT/.test(text), 'Should have parseable timestamp information');
    });

    test('should maintain consistency and reliability across multiple operations', async () => {
      const results = [];
      
      // Test consistency across 3 sequential calls
      for (let i = 0; i < 3; i++) {
        const result = await client.callTool('list_log_files', {});
        results.push(result);
        assertCompleteLogFileFormat(result);
      }
      
      // Validate all results are structurally consistent
      const firstText = parseResponseText(results[0].content[0].text);
      results.slice(1).forEach((result, index) => {
        const text = parseResponseText(result.content[0].text);
        assert.ok(text.includes('debug-blade-'), `Call ${index + 2} should include debug logs`);
        assert.ok(text.includes('error-blade-'), `Call ${index + 2} should include error logs`);
        assert.equal(text.split('\n').length, firstText.split('\n').length, 
          `Call ${index + 2} should have same number of lines as first call`);
      });
    });

    test('should execute without generating stderr and maintain clean state', async () => {
      client.clearStderr();
      
      const result = await client.callTool('list_log_files', {});
      assertValidMCPResponse(result);
      
      const stderr = client.getStderr();
      assert.equal(stderr.trim(), '', 'Should not generate stderr output');
    });
  });
});
