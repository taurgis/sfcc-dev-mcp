import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

describe('get_log_file_contents - Optimized Programmatic Tests', () => {
  let client;
  let testFile;

  before(async () => {
    client = await connect('./aegis.config.with-dw.json');
    
    // Discover one working test file for optimization
    testFile = await discoverTestFile();
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

  // === Helper Functions ===
  function assertValidMCPResponse(result) {
    assert.ok(result.content, 'Should have content');
    assert.ok(Array.isArray(result.content), 'Content should be array');
    assert.equal(typeof result.isError, 'boolean', 'isError should be boolean');
  }

  function parseResponseText(text) {
    return text.startsWith('"') && text.endsWith('"') ? JSON.parse(text) : text;
  }

  function assertTextContent(result, expectedSubstring) {
    assertValidMCPResponse(result);
    assert.equal(result.content[0].type, 'text');
    const actualText = parseResponseText(result.content[0].text);
    assert.ok(actualText.includes(expectedSubstring),
      `Expected "${expectedSubstring}" in response`);
  }

  function assertSuccessResponse(result) {
    assertValidMCPResponse(result);
    assert.equal(result.isError, false, 'Should not be an error response');
    assert.equal(result.content[0].type, 'text');
  }

  function assertErrorResponse(result, expectedErrorSubstring) {
    assertValidMCPResponse(result);
    assert.equal(result.isError, true, 'Should be an error response');
    if (expectedErrorSubstring) {
      assertTextContent(result, expectedErrorSubstring);
    }
  }

  async function discoverTestFile() {
    // Try to discover one working file using the job log tool
    try {
      const result = await client.callTool('get_latest_job_log_files', {});
      if (!result.isError) {
        const text = parseResponseText(result.content[0].text);
        const match = text.match(/File:\s+(.+\.log)/);
        if (match) {
          return `jobs/ImportCatalog/${match[1]}`;
        }
      }
    } catch {
      // Ignore discovery errors
    }
    
    // Fallback to expected file
    return 'jobs/ImportCatalog/Job-ImportCatalog-0987654321.log';
  }

  // === Core Functionality Tests ===
  describe('Core Functionality', () => {
    test('should read log file with complete metadata', async () => {
      const result = await client.callTool('get_log_file_contents', {
        filename: testFile
      });

      assertSuccessResponse(result);
      assertTextContent(result, 'Log File Contents:');
      assertTextContent(result, testFile);
      assertTextContent(result, 'Total lines:');
      assertTextContent(result, 'Content size:');
      
      // Validate SFCC timestamp pattern
      const content = parseResponseText(result.content[0].text);
      const timestampPattern = /\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3} GMT\]/;
      assert.ok(timestampPattern.test(content), 'Should contain SFCC timestamps');
    });

    test('should handle maxBytes parameter with content validation', async () => {
      const result = await client.callTool('get_log_file_contents', {
        filename: testFile,
        maxBytes: 500
      });

      assertSuccessResponse(result);
      assertTextContent(result, 'Content size: 500 bytes');
      
      // Should still include essential metadata despite size limit
      assertTextContent(result, 'Log File Contents:');
      assertTextContent(result, 'Total lines:');
    });

    test('should handle tailOnly parameter correctly', async () => {
      const fullResult = await client.callTool('get_log_file_contents', {
        filename: testFile,
        maxBytes: 1000
      });

      const tailResult = await client.callTool('get_log_file_contents', {
        filename: testFile,
        maxBytes: 1000,
        tailOnly: true
      });

      assertSuccessResponse(fullResult);
      assertSuccessResponse(tailResult);
      
      assertTextContent(tailResult, 'tail read');
      assertTextContent(tailResult, 'Content size: 1000 bytes');
    });
  });

  // === Dynamic Validation Tests ===
  describe('Dynamic Validation', () => {
    test('should validate content structure consistency', async () => {
      const testCases = [
        { maxBytes: 200 },
        { maxBytes: 1000 },
        { tailOnly: true, maxBytes: 500 },
        { tailOnly: false }
      ];

      for (const params of testCases) {
        const result = await client.callTool('get_log_file_contents', {
          filename: testFile,
          ...params
        });

        assertSuccessResponse(result);
        
        // All responses should have consistent structure
        assert.equal(result.content.length, 1, 'Should have one content element');
        
        const content = parseResponseText(result.content[0].text);
        assert.ok(content.includes('Log File Contents:'), 'Should have header');
        assert.ok(content.includes('Total lines:'), 'Should have line count');
      }
    });

    test('should handle parameter edge cases with validation', async () => {
      const edgeCases = [
        { name: 'minimal bytes', params: { maxBytes: 1 } },
        { name: 'large bytes', params: { maxBytes: 50000 } },
        { name: 'tail with small bytes', params: { tailOnly: true, maxBytes: 10 } }
      ];

      for (const testCase of edgeCases) {
        const result = await client.callTool('get_log_file_contents', {
          filename: testFile,
          ...testCase.params
        });

        assertSuccessResponse(result);
        
        const content = parseResponseText(result.content[0].text);
        
        // Even with edge cases, should maintain structure
        assert.ok(content.includes('Log File Contents:'), 
          `${testCase.name} should maintain header structure`);
      }
    });
  });

  // === Error Handling Tests ===
  describe('Error Handling', () => {
    test('should handle invalid parameters gracefully', async () => {
      const errorCases = [
        { args: {}, expectedError: 'filename' },
        { args: { filename: '' }, expectedError: 'filename' },
        { args: { filename: testFile, maxBytes: 0 }, expectedError: 'Invalid maxBytes' },
        { args: { filename: testFile, maxBytes: -1 }, expectedError: 'Invalid maxBytes' }
      ];

      for (const errorCase of errorCases) {
        const result = await client.callTool('get_log_file_contents', errorCase.args);
        
        assertErrorResponse(result, errorCase.expectedError);
      }
    });

    test('should handle security-related filename patterns', async () => {
      const securityTests = [
        '../../../etc/passwd',
        '/etc/passwd',
        'file\x00.log',
        'file|rm -rf /.log'
      ];

      for (const filename of securityTests) {
        const result = await client.callTool('get_log_file_contents', { filename });
        
        assertValidMCPResponse(result);
        
        // Should not return sensitive system content
        if (!result.isError) {
          const content = parseResponseText(result.content[0].text);
          assert.ok(!content.includes('root:x:0:0'), 
            'Should not return system password file content');
        }
      }
    });
  });

  // === Multi-Step Integration Tests ===
  describe('Integration Workflows', () => {
    test('should integrate with file discovery tools', async () => {
      // Step 1: Discover available files
      const listResult = await client.callTool('get_latest_job_log_files', {});
      
      if (!listResult.isError) {
        const listText = parseResponseText(listResult.content[0].text);
        
        // Step 2: Extract a file path from the list
        const fileMatch = listText.match(/File:\s+(.+\.log)/);
        
        if (fileMatch) {
          const discoveredFile = `jobs/ImportCatalog/${fileMatch[1]}`;
          
          // Step 3: Read the discovered file
          const contentResult = await client.callTool('get_log_file_contents', {
            filename: discoveredFile
          });
          
          assertSuccessResponse(contentResult);
          assertTextContent(contentResult, discoveredFile);
        }
      }
    });

    test('should support progressive content analysis workflow', async () => {
      // Step 1: Get a sample of log content
      const sampleResult = await client.callTool('get_log_file_contents', {
        filename: testFile,
        maxBytes: 1000
      });
      
      assertSuccessResponse(sampleResult);
      const sampleContent = parseResponseText(sampleResult.content[0].text);
      
      // Step 2: Based on sample, get full content if needed
      if (sampleContent.includes('INFO')) {
        const fullResult = await client.callTool('get_log_file_contents', {
          filename: testFile,
          maxBytes: 10000
        });
        
        assertSuccessResponse(fullResult);
        const fullContent = parseResponseText(fullResult.content[0].text);
        
        // Step 3: Validate that full content contains sample content structure
        assert.ok(fullContent.includes('Log File Contents:'), 'Full content should have header');
        assert.ok(fullContent.length >= sampleContent.length, 'Full content should be larger');
      }
    });
  });

  // === Business Logic Validation ===
  describe('Business Logic Validation', () => {
    test('should validate log entry format and content', async () => {
      const result = await client.callTool('get_log_file_contents', {
        filename: testFile,
        maxBytes: 2000
      });

      assertSuccessResponse(result);
      const content = parseResponseText(result.content[0].text);
      
      // Validate SFCC-specific log structure
      const logEntryPattern = /\[(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3} GMT)\]\s+(INFO|WARN|ERROR|DEBUG)\s+(\w+)/;
      const matches = content.match(logEntryPattern);
      
      if (matches) {
        // Validate timestamp is recent - Fix timestamp parsing for SFCC format
        // Convert "2025-09-22 12:00:00.000 GMT" to "2025-09-22T12:00:00.000Z"
        const isoTimestamp = matches[1].replace(' ', 'T').replace(' GMT', 'Z');
        const logDate = new Date(isoTimestamp);
        const now = new Date();
        const daysDiff = (now - logDate) / (1000 * 60 * 60 * 24);
        
        // Allow reasonable timeframe for test log data (within 1 day of current time)
        assert.ok(Math.abs(daysDiff) < 1, 'Log timestamp should be within reasonable timeframe (±1 day)');
        
        // Validate log level
        assert.ok(['INFO', 'WARN', 'ERROR', 'DEBUG'].includes(matches[2]), 'Should have valid log level');
        
        // Validate thread/component information
        assert.ok(matches[3].length > 0, 'Should have thread/component information');
      }
    });

    test('should validate content size reporting accuracy', async () => {
      const testSizes = [100, 500, 1000];
      
      for (const size of testSizes) {
        const result = await client.callTool('get_log_file_contents', {
          filename: testFile,
          maxBytes: size
        });
        
        assertSuccessResponse(result);
        assertTextContent(result, `Content size: ${size} bytes`);
        
        // Validate that actual content respects the size limit
        const content = parseResponseText(result.content[0].text);
        const actualContentMatch = content.match(/---\n\n([\s\S]*)$/);
        
        if (actualContentMatch) {
          const actualLogContent = actualContentMatch[1];
          // Should be approximately the requested size (allowing for encoding differences)
          assert.ok(actualLogContent.length <= size + 50, 
            `Content should respect size limit: ${actualLogContent.length} <= ${size + 50}`);
        }
      }
    });
  });

  // === Reliability and State Management ===
  describe('Reliability Testing', () => {
    test('should maintain state consistency across requests', async () => {
      const params = { filename: testFile, maxBytes: 1000 };
      const results = [];

      // Make multiple identical requests
      for (let i = 0; i < 3; i++) {
        const result = await client.callTool('get_log_file_contents', params);
        results.push(result);
        assertSuccessResponse(result);
      }

      // All results should be identical (no state leakage)
      const firstContent = parseResponseText(results[0].content[0].text);
      for (let i = 1; i < results.length; i++) {
        const content = parseResponseText(results[i].content[0].text);
        assert.equal(content, firstContent, `Request ${i} should match first request`);
      }
    });

    test('should handle alternating parameter patterns', async () => {
      const patterns = [
        { maxBytes: 500 },
        { tailOnly: true, maxBytes: 300 },
        { maxBytes: 1000 },
        { tailOnly: false }
      ];

      for (let i = 0; i < patterns.length; i++) {
        const result = await client.callTool('get_log_file_contents', {
          filename: testFile,
          ...patterns[i]
        });

        assertSuccessResponse(result);
        
        // Each request should succeed independently
        const content = parseResponseText(result.content[0].text);
        assert.ok(content.includes('Log File Contents:'), 
          `Pattern ${i} should maintain proper structure`);
      }
    });
  });
});
 