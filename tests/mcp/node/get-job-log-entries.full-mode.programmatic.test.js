import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

describe('get_job_log_entries - Full Mode Programmatic Tests', () => {
  let client;
  let discoveredJobNames = [];

  before(async () => {
    client = await connect('./aegis.config.with-dw.json');
    
    // Discover available job names for advanced testing
    await discoverJobNames();
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

  function assertJobLogEntriesFormat(result, expectedLimit, expectedLevel = 'all levels', jobName = null) {
    assertSuccessResponse(result);
    const text = parseResponseText(result.content[0].text);

    // Determine acceptable header pattern with dynamic returned limit values.
    const escapedLevel = expectedLevel.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const headerRegex = jobName
      ? new RegExp(`Latest \\d+ ${escapedLevel} messages from job: ${jobName}:`)
      : new RegExp(`Latest \\d+ ${escapedLevel} messages from latest jobs:`);

    // Check if it's an empty result
    if (headerRegex.test(text.trim()) || text.includes('No job logs found')) {
      // Valid empty result case
      return { entryCount: 0, jobNames: [] };
    }

    // Should contain a valid header even when runtime returns a different limit.
    assert.ok(headerRegex.test(text),
      `Should include a valid header matching ${headerRegex}`);
    
    // Extract job log entries
    const entries = extractJobLogEntries(text);
    
    // Validate each entry has proper structure
    const jobNames = new Set();
    for (const entry of entries) {
      // Each entry should have job name in brackets
      assert.ok(/^\[[\w]+\]/.test(entry.trim()),
        `Entry should start with job name in brackets: "${entry.substring(0, 50)}..."`);
      
      // Should contain timestamp in GMT format
      assert.ok(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3} GMT/.test(entry),
        `Entry should contain GMT timestamp: "${entry.substring(0, 100)}..."`);
      
      // Should contain log level (unless filtered to specific level)
      if (expectedLevel === 'all levels') {
        assert.ok(/(ERROR|WARN|INFO|DEBUG)/.test(entry),
          `Entry should contain log level: "${entry.substring(0, 100)}..."`);
      } else {
        const levelToCheck = expectedLevel.replace(' levels', '').replace(' messages', '');
        assert.ok(entry.includes(levelToCheck.toUpperCase()),
          `Entry should contain ${levelToCheck.toUpperCase()} level: "${entry.substring(0, 100)}..."`);
      }
      
      // Should contain SystemJobThread pattern
      assert.ok(/SystemJobThread/.test(entry),
        `Entry should contain SystemJobThread pattern: "${entry.substring(0, 100)}..."`);
      
      // Extract job name for validation
      const jobNameMatch = entry.match(/^\[(\w+)\]/);
      if (jobNameMatch) {
        jobNames.add(jobNameMatch[1]);
      }
    }
    
    // If job name filter is specified, all entries should be from that job
    if (jobName) {
      for (const extractedJobName of jobNames) {
        assert.equal(extractedJobName, jobName,
          `All entries should be from job "${jobName}", found "${extractedJobName}"`);
      }
    }
    
    // Number of entries should not exceed limit
    assert.ok(entries.length <= expectedLimit,
      `Number of entries ${entries.length} should not exceed limit ${expectedLimit}`);
    
    return { entryCount: entries.length, jobNames: Array.from(jobNames) };
  }

  function extractJobLogEntries(text) {
    // Split by the separator and filter out header and empty lines
    const parts = text.split('---').map(part => part.trim()).filter(part => 
      part && !part.includes('Latest') && !part.includes('messages from'));
    return parts;
  }

  function assertJobExecutionPatterns(result) {
    assertSuccessResponse(result);
    const text = parseResponseText(result.content[0].text);
    
    // Should contain job execution patterns
    const patterns = [
      /Execution of job finished with status/,
      /Step \[[\w]+\] completed successfully/,
      /Executing step \[[\w]+\] for/,
      /Executing job \[[\w]+\]\[[\d]+\]/
    ];
    
    const foundPatterns = patterns.filter(pattern => pattern.test(text));
    assert.ok(foundPatterns.length > 0,
      `Should contain at least one job execution pattern in: "${text.substring(0, 200)}..."`);
  }

  async function discoverJobNames() {
    try {
      const result = await client.callTool('get_job_log_entries', { limit: 20 });
      if (!result.isError) {
        const text = parseResponseText(result.content[0].text);
        
        // Look for job names that appear at the start of log lines
        // Pattern: [JobName] [timestamp] LEVEL SystemJobThread...
        const logLinePattern = /\n\[(\w+)\] \[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3} GMT\] \w+ SystemJobThread/g;
        const jobNameMatches = [];
        let match;
        
        while ((match = logLinePattern.exec(text)) !== null) {
          jobNameMatches.push(match[1]);
        }
        
        if (jobNameMatches.length > 0) {
          // Filter out obvious non-job names and get unique values
          const validJobNames = jobNameMatches
            .filter(name => 
              name.length > 2 && // Must be more than 2 characters
              !['OK', 'ERROR', 'WARN', 'INFO', 'DEBUG', 'Organization'].includes(name) && // Exclude status words
              !/Step$/.test(name) // Exclude step names ending with "Step"
            );
          discoveredJobNames = [...new Set(validJobNames)];
        }
        
        // Fallback: if no job names found, use known job names from mock data
        if (discoveredJobNames.length === 0) {
          discoveredJobNames = ['ProcessOrders', 'ImportCatalog'];
        }
      }
    } catch (error) {
      // Discovery is optional, continue with tests using fallback
      discoveredJobNames = ['ProcessOrders', 'ImportCatalog'];
      console.warn('Job name discovery failed, using fallback:', error.message);
    }
  }

  // Core functionality and parameter validation tests
  describe('Core Functionality', () => {
    test('should retrieve job log entries with default parameters', async () => {
      const result = await client.callTool('get_job_log_entries', {});
      
      assertJobLogEntriesFormat(result, 50); // Default limit is 50
      assertJobExecutionPatterns(result);
      
      // Should contain SFCC job-specific patterns
      const text = parseResponseText(result.content[0].text);
      assert.ok(/SystemJobThread/.test(text),
        'Should contain SystemJobThread patterns');
    });

    test('should respect limit parameter boundaries', async () => {
      // Test small limit
      const smallResult = await client.callTool('get_job_log_entries', { limit: 1 });
      const smallAnalysis = assertJobLogEntriesFormat(smallResult, 1);
      assert.ok(smallAnalysis.entryCount <= 1, 'Should respect small limit');

      // Test reasonable limit
      const mediumResult = await client.callTool('get_job_log_entries', { limit: 10 });
      const mediumAnalysis = assertJobLogEntriesFormat(mediumResult, 10);
      assert.ok(mediumAnalysis.entryCount <= 10, 'Should respect medium limit');
    });

    test('should filter by log levels correctly', async () => {
      // Test representative log levels (not all - YAML tests cover others)
      const testCases = [
        { level: 'error', expected: 'error' },
        { level: 'info', expected: 'info' },
        { level: 'all', expected: 'all levels' }
      ];

      for (const testCase of testCases) {
        const result = await client.callTool('get_job_log_entries', { 
          level: testCase.level, 
          limit: 3 
        });
        
        assertJobLogEntriesFormat(result, 3, testCase.expected);
        assertTextContent(result, `Latest 3 ${testCase.expected} messages from latest jobs:`);
      }
    });

    test('should filter by job name when specified', async () => {
      const result = await client.callTool('get_job_log_entries', { 
        jobName: 'ProcessOrders',
        limit: 3 
      });
      
      assertJobLogEntriesFormat(result, 3, 'all levels', 'ProcessOrders');
      assertTextContent(result, 'Latest 3 all levels messages from job: ProcessOrders:');
    });

    test('should combine parameters correctly', async () => {
      const result = await client.callTool('get_job_log_entries', { 
        level: 'info',
        limit: 5,
        jobName: 'ImportCatalog' 
      });
      
      assertJobLogEntriesFormat(result, 5, 'info', 'ImportCatalog');
      assertTextContent(result, 'Latest 5 info messages from job: ImportCatalog:');
    });
  });

  // Content structure and format validation tests
  describe('Content Validation', () => {
    test('should maintain consistent job log entry structure', async () => {
      const result = await client.callTool('get_job_log_entries', { limit: 10 });
      
      assertSuccessResponse(result);
      
      const text = parseResponseText(result.content[0].text);
      const entries = extractJobLogEntries(text);
      
      // Each entry should follow consistent structure (test first 3 entries)
      for (const entry of entries.slice(0, 3)) {
        // Should start with job name in brackets
        assert.ok(/^\[[\w]+\]/.test(entry.trim()),
          `Entry should start with job name: "${entry.substring(0, 100)}..."`);
        
        // Should contain timestamp
        assert.ok(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3} GMT/.test(entry),
          `Entry should contain timestamp: "${entry.substring(0, 100)}..."`);
        
        // Should contain log level
        assert.ok(/(ERROR|WARN|INFO|DEBUG)/.test(entry),
          `Entry should contain log level: "${entry.substring(0, 100)}..."`);
        
        // Should contain SystemJobThread with ID pattern
        assert.ok(/SystemJobThread\|\d+/.test(entry),
          `Entry should contain SystemJobThread with ID: "${entry.substring(0, 100)}..."`);
      }
    });

    test('should include proper job execution details', async () => {
      const result = await client.callTool('get_job_log_entries', { limit: 10 });
      
      assertJobExecutionPatterns(result);
      
      const text = parseResponseText(result.content[0].text);
      
      // Should contain organization references
      assert.ok(/\[Organization\]/.test(text),
        'Should contain Organization references');
    });
  });

  // Error handling and edge cases
  describe('Error Handling', () => {
    test('should handle invalid limit values', async () => {
      // Test zero limit
      const zeroResult = await client.callTool('get_job_log_entries', { limit: 0 });
      assertErrorResponse(zeroResult, 'limit must be >= 1');

      // Test negative limit  
      const negativeResult = await client.callTool('get_job_log_entries', { limit: -5 });
      assertErrorResponse(negativeResult, 'limit must be >= 1');

      // Test extremely large limit
      const largeResult = await client.callTool('get_job_log_entries', { limit: 10000 });
      assertErrorResponse(largeResult, 'limit must be <= 1000');
    });

    test('should handle invalid log level gracefully', async () => {
      const result = await client.callTool('get_job_log_entries', { 
        level: 'invalid',
        limit: 5 
      });
      
      assertErrorResponse(result, 'Error');
    });

    test('should handle nonexistent job name gracefully', async () => {
      const result = await client.callTool('get_job_log_entries', { 
        jobName: 'NonExistentJob',
        limit: 5 
      });
      
      assertSuccessResponse(result);
      assertTextContent(result, 'No job logs found for job name: NonExistentJob');
    });

    test('should handle edge case job names', async () => {
        // Empty job name is now rejected by boundary validation.
      const emptyResult = await client.callTool('get_job_log_entries', { 
        jobName: '',
        limit: 3 
      });
        assert.equal(emptyResult.isError, true, 'Empty jobName should be rejected');
        assertTextContent(emptyResult, 'jobName');

      // Special characters should be handled gracefully
      const specialResult = await client.callTool('get_job_log_entries', { 
        jobName: 'Job@#$%',
        limit: 3 
      });
      assertSuccessResponse(specialResult);
      assert.ok(specialResult.content[0].text.includes('Job@#$%') || 
                specialResult.content[0].text.includes('No job logs found'),
        'Should handle special characters gracefully');
    });
  });

  // Advanced workflows using discovered job names
  describe('Dynamic Job Discovery Workflows', () => {
    test('should discover and analyze job patterns dynamically', async () => {
      if (discoveredJobNames.length === 0) {
        console.warn('No job names discovered, skipping dynamic tests');
        return;
      }

      // Test with discovered job names (limit to first 2 for efficiency)
      for (const jobName of discoveredJobNames.slice(0, 2)) {
        const result = await client.callTool('get_job_log_entries', { 
          jobName,
          limit: 5 
        });
        
        if (!result.isError) {
          assertJobLogEntriesFormat(result, 5, 'all levels', jobName);
          assertTextContent(result, `Latest 5 all levels messages from job: ${jobName}:`);
        }
      }
    });

    test('should support progressive filtering workflow', async () => {
      // Step 1: Start with broad search to discover available content
      const broadResult = await client.callTool('get_job_log_entries', { limit: 20 });
      assertSuccessResponse(broadResult);
      
      // Step 2: Focus on error level to identify problem areas
      const errorResult = await client.callTool('get_job_log_entries', { 
        level: 'error',
        limit: 5 
      });
      
      assertValidMCPResponse(errorResult);
      
      // Step 3: If errors found and job names discovered, drill down
      if (!errorResult.isError && discoveredJobNames.length > 0) {
        const jobName = discoveredJobNames[0];
        const specificErrorResult = await client.callTool('get_job_log_entries', { 
          jobName,
          level: 'error',
          limit: 3 
        });
        
        assertValidMCPResponse(specificErrorResult);
        if (!specificErrorResult.isError) {
          assertJobLogEntriesFormat(specificErrorResult, 3, 'error', jobName);
        }
      }
    });

    test('should handle parameter combinations reliably across discovered jobs', async () => {
      if (discoveredJobNames.length === 0) {
        console.warn('No job names discovered, using fallback for parameter testing');
        discoveredJobNames = ['ProcessOrders']; // Use fallback for this test
      }

      const testJobName = discoveredJobNames[0];
      const paramCombinations = [
        { limit: 1 },
        { limit: 3, level: 'info' },
        { limit: 2, jobName: testJobName },
        { limit: 2, level: 'error', jobName: testJobName }
      ];
      
      for (const params of paramCombinations) {
        const result = await client.callTool('get_job_log_entries', params);
        
        assertValidMCPResponse(result);
        
        if (!result.isError) {
          assertSuccessResponse(result);
          const text = parseResponseText(result.content[0].text);
          
          // Should contain expected limit in header
          assert.ok(text.includes(`Latest ${params.limit}`),
            `Should contain limit ${params.limit} in response`);
          
          // Should contain expected level if specified
          if (params.level) {
            assert.ok(text.includes(`${params.level} messages`),
              `Should contain level ${params.level} in response`);
          }
          
          // Should contain job name if specified
          if (params.jobName) {
            assert.ok(text.includes(`from job: ${params.jobName}`),
              `Should contain job name ${params.jobName} in response`);
          }
        }
      }
    });
  });

  // Reliability and consistency testing
  describe('Functional Reliability', () => {
    test('should maintain consistent response structure across multiple calls', async () => {
      const calls = [];
      
      // Make multiple sequential calls to test consistency
      for (let i = 0; i < 3; i++) { // Reduced from 5 to 3 for efficiency
        const result = await client.callTool('get_job_log_entries', { limit: 2 });
        calls.push(result);
      }
      
      // All calls should have consistent structure
      for (const result of calls) {
        assertValidMCPResponse(result);
        assert.equal(result.content[0].type, 'text');
        assert.equal(typeof result.isError, 'boolean');
      }
      
      // All successful calls should have similar content structure
      const successfulCalls = calls.filter(call => !call.isError);
      for (const result of successfulCalls) {
        const text = parseResponseText(result.content[0].text);
        assert.ok(text.includes('Latest 2 all levels messages'),
          'Should contain consistent header format');
      }
    });
  });
});
