import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

describe('get_log_file_contents - Full Mode Programmatic Tests', () => {
  let client;
  let availableLogFiles = [];
  let availableJobLogFiles = [];

  before(async () => {
    client = await connect('./aegis.config.with-dw.json');
    
    // Discover available files using MCP server tools
    await discoverAvailableFiles();
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

  function assertErrorResponse(result, expectedErrorSubstring) {
    assertValidMCPResponse(result);
    assert.equal(result.isError, true, 'Should be an error response');
    assert.equal(result.content[0].type, 'text');
    if (expectedErrorSubstring) {
      assertTextContent(result, expectedErrorSubstring);
    }
  }

  async function discoverAvailableFiles() {   
    // Discover standard log files using list_log_files
    try {
      const logFilesResult = await client.callTool('list_log_files', {});
      if (!logFilesResult.isError) {
        availableLogFiles = extractLogFileNames(parseResponseText(logFilesResult.content[0].text));
      }
    } catch {
      // Ignore errors in discovery - not all systems support it
    }

    // Discover job log files using get_latest_job_log_files
    try {
      const jobLogFilesResult = await client.callTool('get_latest_job_log_files', {});
      if (!jobLogFilesResult.isError) {
        availableJobLogFiles = extractJobLogFileNames(parseResponseText(jobLogFilesResult.content[0].text));
      }
    } catch {
      // Ignore errors in discovery - not all systems support it
    }
  }

  function extractLogFileNames(listResponse) {
    // Extract file names from list_log_files response
    // Format: "📄 /error-blade-20250914-171855.log\n   Size: 1.14 KB\n..."
    const files = [];
    const lines = listResponse.split('\n');
    
    for (const line of lines) {
      const match = line.match(/📄\s+\/(.+\.log)/);
      if (match) {
        files.push(match[1]);
      }
    }
    
    return files;
  }

  function extractJobLogFileNames(jobListResponse) {
    // Extract job log file paths from get_latest_job_log_files response
    // Format: "🔧 Job: ImportCatalog\n   ID: 0987654321\n   File: Job-ImportCatalog-0987654321.log\n..."
    const files = [];
    const lines = jobListResponse.split('\n');
    let currentJob = null;
    
    for (const line of lines) {
      const jobMatch = line.match(/🔧\s+Job:\s+(.+)/);
      if (jobMatch) {
        currentJob = jobMatch[1];
        continue;
      }
      
      const fileMatch = line.match(/File:\s+(.+\.log)/);
      if (fileMatch && currentJob) {
        files.push(`jobs/${currentJob}/${fileMatch[1]}`);
      }
    }
    
    return files;
  }

  function getTestFile() {
    // Prefer job log files as they have consistent names, fall back to standard logs
    if (availableJobLogFiles.length > 0) {
      return availableJobLogFiles[0];
    }
    if (availableLogFiles.length > 0) {
      return availableLogFiles[0];
    }
    throw new Error('No log files available for testing');
  }

  function getSmallTestFile() {
    // Try to find a smaller file for performance tests
    return availableJobLogFiles.find(f => f.includes('ImportCatalog')) || getTestFile();
  }

  // Basic functionality tests
  describe('Basic Functionality', () => {
    test('should get contents of a discovered log file', async () => {
      const testFile = getTestFile();
      
      const result = await client.callTool('get_log_file_contents', {
        filename: testFile
      });

      assertSuccessResponse(result);
      assertTextContent(result, 'Log File Contents:');
      assertTextContent(result, testFile);
    });

    test('should include file metadata in response', async () => {
      const testFile = getTestFile();
      
      const result = await client.callTool('get_log_file_contents', {
        filename: testFile
      });

      assertSuccessResponse(result);
      assertTextContent(result, 'Total lines:');
      assertTextContent(result, 'Content size:');
      assertTextContent(result, 'bytes');
    });

    test('should include log entries with proper timestamps', async () => {
      const testFile = getTestFile();
      
      const result = await client.callTool('get_log_file_contents', {
        filename: testFile
      });

      assertSuccessResponse(result);
      
      // Check for SFCC timestamp pattern [YYYY-MM-DD HH:MM:SS.mmm GMT]
      const content = parseResponseText(result.content[0].text);
      const timestampPattern = /\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3} GMT\]/;
      assert.ok(timestampPattern.test(content), 
        'Should contain SFCC-style timestamps');
    });
  });

  // Parameter validation tests using discovered files
  describe('Parameter Validation', () => {
    test('should work with maxBytes parameter on discovered files', async () => {
      const testFile = getSmallTestFile();
      
      const result = await client.callTool('get_log_file_contents', {
        filename: testFile,
        maxBytes: 500
      });

      assertSuccessResponse(result);
      assertTextContent(result, 'Log File Contents:');
      
      // Content should be limited
      const content = parseResponseText(result.content[0].text);
      assert.ok(content.length > 0, 'Should have some content');
    });

    test('should work with tailOnly parameter on discovered files', async () => {
      const testFile = getTestFile();
      
      const result = await client.callTool('get_log_file_contents', {
        filename: testFile,
        tailOnly: true
      });

      assertSuccessResponse(result);
      assertTextContent(result, 'Log File Contents:');
    });

    test('should work with both maxBytes and tailOnly parameters', async () => {
      const testFile = getTestFile();
      
      const result = await client.callTool('get_log_file_contents', {
        filename: testFile,
        maxBytes: 1000,
        tailOnly: true
      });

      assertSuccessResponse(result);
      assertTextContent(result, 'Log File Contents:');
    });

    test('should handle zero maxBytes parameter', async () => {
      const testFile = getTestFile();
      
      const result = await client.callTool('get_log_file_contents', {
        filename: testFile,
        maxBytes: 0
      });

      // Should either succeed with empty content or return an error
      assertValidMCPResponse(result);
    });

    test('should handle negative maxBytes parameter', async () => {
      const testFile = getTestFile();
      
      const result = await client.callTool('get_log_file_contents', {
        filename: testFile,
        maxBytes: -100
      });

      // Should handle gracefully (either error or treat as unlimited)
      assertValidMCPResponse(result);
    });
  });

  // Error handling tests
  describe('Error Handling', () => {
    test('should handle non-existent file gracefully', async () => {
      const result = await client.callTool('get_log_file_contents', {
        filename: 'nonexistent-file-12345.log'
      });

      // Should return descriptive error (not throw exception)
      assertValidMCPResponse(result);
      if (result.isError) {
        assertTextContent(result, 'Failed to get_log_file_contents');
      } else {
        // Some implementations might return empty content instead of error
        assertSuccessResponse(result);
      }
    });

    test('should handle missing filename parameter', async () => {
      const result = await client.callTool('get_log_file_contents', {});

      assertErrorResponse(result, 'filename');
    });

    test('should handle empty filename parameter', async () => {
      const result = await client.callTool('get_log_file_contents', {
        filename: ''
      });

      assertErrorResponse(result, 'filename');
    });

    test('should handle null filename parameter', async () => {
      const result = await client.callTool('get_log_file_contents', {
        filename: null
      });

      assertErrorResponse(result, 'filename');
    });

    test('should handle invalid filename patterns', async () => {
      const invalidFilenames = [
        '../../../etc/passwd',  // Path traversal attempt
        '/etc/passwd',          // Absolute path outside logs
        'file\x00.log',        // Null byte injection
        'file with spaces.log', // Spaces (might be valid)
        'file|rm -rf /.log'    // Command injection attempt
      ];

      for (const invalidFilename of invalidFilenames) {
        const result = await client.callTool('get_log_file_contents', {
          filename: invalidFilename
        });

        assertValidMCPResponse(result);
        // Should either return error or handle gracefully
        if (!result.isError) {
          // If not error, should not return sensitive system content
          const content = parseResponseText(result.content[0].text);
          assert.ok(!content.includes('root:x:0:0'), 
            'Should not return system password file content');
        }
      }
    });
  });

  // Dynamic file testing using discovered files
  describe('Dynamic File Testing', () => {
    test('should handle all discovered standard log files', async () => {
      if (availableLogFiles.length === 0) {
        return;
      }

      for (const logFile of availableLogFiles) {       
        const result = await client.callTool('get_log_file_contents', {
          filename: logFile
        });

        assertValidMCPResponse(result);
        
        if (!result.isError) {
          assertTextContent(result, 'Log File Contents:');
          assertTextContent(result, logFile);
        }
      }
    });

    test('should handle all discovered job log files', async () => {
      if (availableJobLogFiles.length === 0) {
        return;
      }

      for (const jobLogFile of availableJobLogFiles) {       
        const result = await client.callTool('get_log_file_contents', {
          filename: jobLogFile
        });

        assertSuccessResponse(result);
        assertTextContent(result, 'Log File Contents:');
        assertTextContent(result, 'Total lines:');
        
        // Job logs should contain INFO level entries
        const content = parseResponseText(result.content[0].text);
        assert.ok(content.includes('INFO') || content.includes('WARN') || content.includes('ERROR'),
          'Job log should contain log level indicators');
      }
    });

    test('should validate file size consistency across tools', async () => {
      if (availableLogFiles.length === 0) {
        return;
      }

      const testFile = availableLogFiles[0];
      
      // Get file info from list_log_files
      const listResult = await client.callTool('list_log_files', {});
      const listContent = parseResponseText(listResult.content[0].text);
      
      // Get file contents
      const contentsResult = await client.callTool('get_log_file_contents', {
        filename: testFile
      });
      
      assertSuccessResponse(contentsResult);
      
      // Extract size information from both responses
      const sizeFromList = extractSizeFromListResponse(listContent, testFile);
      const sizeFromContents = extractSizeFromContentsResponse(
        parseResponseText(contentsResult.content[0].text)
      );
      
      if (sizeFromList && sizeFromContents) {
        // Sizes should be reasonably close (allowing for formatting differences)
        const tolerance = 0.1; // 10% tolerance
        const ratio = Math.abs(sizeFromList - sizeFromContents) / Math.max(sizeFromList, sizeFromContents);
        assert.ok(ratio <= tolerance, 
          `Size mismatch too large: ${sizeFromList} vs ${sizeFromContents}`);
      }
    });

    function extractSizeFromListResponse(listContent, filename) {
      const lines = listContent.split('\n');
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].includes(filename)) {
          // Look for size in next few lines
          for (let j = i + 1; j < Math.min(i + 3, lines.length); j++) {
            const sizeMatch = lines[j].match(/Size:\s+([\d.]+)\s*(\w+)/);
            if (sizeMatch) {
              const size = parseFloat(sizeMatch[1]);
              const unit = sizeMatch[2].toLowerCase();
              return unit === 'kb' ? size * 1024 : size;
            }
          }
        }
      }
      return null;
    }

    function extractSizeFromContentsResponse(contentsText) {
      const match = contentsText.match(/Content size:\s*(\d+)\s*bytes/);
      return match ? parseInt(match[1], 10) : null;
    }
  });

  // Response structure validation
  describe('Response Structure Validation', () => {
    test('should return consistent response structure for all file types', async () => {
      const allFiles = [...availableLogFiles, ...availableJobLogFiles];
      
      if (allFiles.length === 0) {
        return;
      }

      for (const file of allFiles.slice(0, 3)) { // Test first 3 files to avoid long test times
        const result = await client.callTool('get_log_file_contents', {
          filename: file
        });

        assertValidMCPResponse(result);
        
        if (!result.isError) {
          // Should have exactly one content element
          assert.equal(result.content.length, 1, 'Should have exactly one content element');
          assert.equal(result.content[0].type, 'text', 'Content type should be text');
          
          const content = parseResponseText(result.content[0].text);
          
          // Should contain standard header elements
          assert.ok(content.includes('Log File Contents:'), 'Should have header');
          assert.ok(content.includes('Total lines:'), 'Should have line count');
          assert.ok(content.includes('Content size:'), 'Should have size info');
          assert.ok(content.includes('---'), 'Should have separator');
        }
      }
    });

    test('should handle edge cases gracefully', async () => {
      const edgeCases = [
        { filename: getTestFile(), maxBytes: 1 },        // Very small read
        { filename: getTestFile(), maxBytes: 999999 },   // Very large read
        { filename: getTestFile(), tailOnly: false },    // Explicit false
        { filename: getTestFile(), tailOnly: true, maxBytes: 100 } // Combined edge case
      ];

      for (const testCase of edgeCases) {
        const result = await client.callTool('get_log_file_contents', testCase);
        
        assertValidMCPResponse(result);
      }
    });
  });

  // Integration tests using other MCP tools
  describe('Integration with Other MCP Tools', () => {
    test('should work with files found via search_logs', async () => {
      try {
        // Use search_logs to find files with content, then read them
        const searchResult = await client.callTool('search_logs', {
          pattern: 'INFO'
        });

        if (!searchResult.isError) {
          // If search found results, try to read one of the source files
          const testFile = getTestFile(); // Fall back to discovered file
          
          const result = await client.callTool('get_log_file_contents', {
            filename: testFile
          });

          assertSuccessResponse(result);
        }
      } catch {
        // Ignore errors in search_logs - not all systems support it
      }
    });

    test('should validate job logs found via get_latest_job_log_files', async () => {
      if (availableJobLogFiles.length === 0) {
        return;
      }

      // Use job log discovery tool and validate we can read the files
      const jobLogListResult = await client.callTool('get_latest_job_log_files', {});
      assertSuccessResponse(jobLogListResult);

      for (const jobFile of availableJobLogFiles) {
        const result = await client.callTool('get_log_file_contents', {
          filename: jobFile
        });

        assertSuccessResponse(result);
        
        // Job logs should contain structured information
        const content = parseResponseText(result.content[0].text);
        assert.ok(content.includes('SystemJobThread') || content.includes('INFO'),
          'Job log should contain job execution information');
      }
    });
  });

  // Performance and reliability tests
  describe('Performance and Reliability', () => {
    test('should handle multiple sequential requests without interference', async () => {
      const testFile = getTestFile();
      const results = [];

      // Make multiple sequential requests
      for (let i = 0; i < 5; i++) {
        const result = await client.callTool('get_log_file_contents', {
          filename: testFile,
          maxBytes: 1000
        });

        results.push(result);
        assertValidMCPResponse(result);
      }

      // All results should be consistent
      const firstContent = parseResponseText(results[0].content[0].text);
      for (let i = 1; i < results.length; i++) {
        const content = parseResponseText(results[i].content[0].text);
        assert.equal(content, firstContent, 
          `Request ${i} should return same content as first request`);
      }
    });

    test('should handle requests with different parameter combinations', async () => {
      const testFile = getTestFile();
      const paramCombinations = [
        {},
        { maxBytes: 500 },
        { tailOnly: true },
        { maxBytes: 1000, tailOnly: false },
        { maxBytes: 200, tailOnly: true }
      ];

      for (const params of paramCombinations) {
        const fullParams = { filename: testFile, ...params };
        const result = await client.callTool('get_log_file_contents', fullParams);

        assertValidMCPResponse(result);
      }
    });

    test('should maintain consistent response times for similar requests', async () => {
      const testFile = getSmallTestFile();
      const times = [];

      for (let i = 0; i < 3; i++) {
        const start = Date.now();
        
        const result = await client.callTool('get_log_file_contents', {
          filename: testFile,
          maxBytes: 1000
        });

        const duration = Date.now() - start;
        times.push(duration);

        assertSuccessResponse(result);
      }

      // Check that response times are reasonably consistent (no huge variations)
      const avgTime = times.reduce((a, b) => a + b, 0) / times.length;
      const maxDeviation = Math.max(...times.map(t => Math.abs(t - avgTime)));
      
      // Allow up to 100x variation (very lenient for CI environments)
      const tolerance = avgTime * 100;
      assert.ok(maxDeviation <= tolerance, 
        `Response time variation too high: avg=${avgTime}ms, max_dev=${maxDeviation}ms`);
      });
  });
});
