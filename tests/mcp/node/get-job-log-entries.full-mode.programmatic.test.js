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
    
    // Determine expected header pattern
    let expectedHeader;
    if (jobName) {
      expectedHeader = `Latest ${expectedLimit} ${expectedLevel} messages from job: ${jobName}:`;
    } else {
      expectedHeader = `Latest ${expectedLimit} ${expectedLevel} messages from latest jobs:`;
    }
    
    // Check if it's an empty result
    if (text.trim() === expectedHeader.trim() || text.includes('No job logs found')) {
      // Valid empty result case
      return { entryCount: 0, jobNames: [] };
    }
    
    // Should start with the expected header
    assert.ok(text.includes(expectedHeader),
      `Should start with "${expectedHeader}"`);
    
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

  // Basic functionality tests
  describe('Basic Functionality', () => {
    test('should retrieve job log entries with default parameters', async () => {
      const result = await client.callTool('get_job_log_entries', {});
      
      assertJobLogEntriesFormat(result, 50); // Default limit is 50
      assertJobExecutionPatterns(result);
      
      // Should contain SFCC job-specific patterns
      const text = parseResponseText(result.content[0].text);
      assert.ok(/SystemJobThread/.test(text),
        'Should contain SystemJobThread patterns');
    });

    test('should respect limit parameter', async () => {
      const result = await client.callTool('get_job_log_entries', { limit: 5 });
      
      const analysis = assertJobLogEntriesFormat(result, 5);
      
      // Verify actual count doesn't exceed limit
      assert.ok(analysis.entryCount <= 5,
        `Should not exceed limit of 5, got ${analysis.entryCount}`);
    });

    test('should handle small limit values', async () => {
      const result = await client.callTool('get_job_log_entries', { limit: 1 });
      
      const analysis = assertJobLogEntriesFormat(result, 1);
      
      // Should have at most 1 entry
      assert.ok(analysis.entryCount <= 1,
        `Should have at most 1 entry, got ${analysis.entryCount}`);
    });

    test('should handle large limit values gracefully', async () => {
      const result = await client.callTool('get_job_log_entries', { limit: 100 });
      
      assertJobLogEntriesFormat(result, 100);
      
      // Should be successful even with large limits
      assertSuccessResponse(result);
    });
  });

  // Log level filtering tests
  describe('Log Level Filtering', () => {
    test('should filter by error level', async () => {
      const result = await client.callTool('get_job_log_entries', { 
        level: 'error', 
        limit: 5 
      });
      
      assertJobLogEntriesFormat(result, 5, 'error');
      
      // Should contain error level header
      assertTextContent(result, 'Latest 5 error messages from latest jobs:');
    });

    test('should filter by warn level', async () => {
      const result = await client.callTool('get_job_log_entries', { 
        level: 'warn', 
        limit: 5 
      });
      
      assertJobLogEntriesFormat(result, 5, 'warn');
      
      // Should contain warn level header
      assertTextContent(result, 'Latest 5 warn messages from latest jobs:');
    });

    test('should filter by info level', async () => {
      const result = await client.callTool('get_job_log_entries', { 
        level: 'info', 
        limit: 5 
      });
      
      assertJobLogEntriesFormat(result, 5, 'info');
      
      // Should contain info level header
      assertTextContent(result, 'Latest 5 info messages from latest jobs:');
    });

    test('should filter by debug level', async () => {
      const result = await client.callTool('get_job_log_entries', { 
        level: 'debug', 
        limit: 5 
      });
      
      assertJobLogEntriesFormat(result, 5, 'debug');
      
      // Should contain debug level header
      assertTextContent(result, 'Latest 5 debug messages from latest jobs:');
    });

    test('should handle all level explicitly', async () => {
      const result = await client.callTool('get_job_log_entries', { 
        level: 'all', 
        limit: 5 
      });
      
      assertJobLogEntriesFormat(result, 5, 'all levels');
      
      // Should contain all levels header
      assertTextContent(result, 'Latest 5 all levels messages from latest jobs:');
    });
  });

  // Job name filtering tests
  describe('Job Name Filtering', () => {
    test('should filter by specific job name', async () => {
      // Use ProcessOrders as a known job name from the mock data
      const result = await client.callTool('get_job_log_entries', { 
        jobName: 'ProcessOrders',
        limit: 3 
      });
      
      assertJobLogEntriesFormat(result, 3, 'all levels', 'ProcessOrders');
      
      // Should contain job-specific header
      assertTextContent(result, 'Latest 3 all levels messages from job: ProcessOrders:');
    });

    test('should filter by job name with specific level', async () => {
      const result = await client.callTool('get_job_log_entries', { 
        jobName: 'ImportCatalog',
        level: 'info',
        limit: 5 
      });
      
      assertJobLogEntriesFormat(result, 5, 'info', 'ImportCatalog');
      
      // Should contain job and level specific header
      assertTextContent(result, 'Latest 5 info messages from job: ImportCatalog:');
    });

    test('should handle nonexistent job name gracefully', async () => {
      const result = await client.callTool('get_job_log_entries', { 
        jobName: 'NonExistentJob',
        limit: 5 
      });
      
      assertSuccessResponse(result);
      assertTextContent(result, 'No job logs found for job name: NonExistentJob');
    });

    test('should test with discovered job names', async () => {
      if (discoveredJobNames.length > 0) {
        for (const jobName of discoveredJobNames.slice(0, 2)) { // Test first 2 discovered jobs
          const result = await client.callTool('get_job_log_entries', { 
            jobName: jobName,
            limit: 3 
          });
          
          assertJobLogEntriesFormat(result, 3, 'all levels', jobName);
          
          // Should contain job-specific header
          assertTextContent(result, `Latest 3 all levels messages from job: ${jobName}:`);
        }
      }
    });
  });

  // Parameter combination tests
  describe('Parameter Combinations', () => {
    test('should handle all parameters together', async () => {
      const result = await client.callTool('get_job_log_entries', { 
        level: 'info',
        limit: 7,
        jobName: 'ProcessOrders' 
      });
      
      assertJobLogEntriesFormat(result, 7, 'info', 'ProcessOrders');
      
      // Should contain all parameters in header
      assertTextContent(result, 'Latest 7 info messages from job: ProcessOrders:');
    });

    test('should validate parameter combinations with discovered jobs', async () => {
      if (discoveredJobNames.length > 0) {
        const jobName = discoveredJobNames[0];
        const levels = ['error', 'warn', 'info', 'debug', 'all levels'];
        
        for (const level of levels) {
          const actualLevel = level === 'all levels' ? 'all' : level;
          const result = await client.callTool('get_job_log_entries', { 
            level: actualLevel,
            limit: 2,
            jobName 
          });
          
          assertJobLogEntriesFormat(result, 2, level, jobName);
          assertTextContent(result, `Latest 2 ${level} messages from job: ${jobName}:`);
        }
      }
    });
  });

  // Content validation tests
  describe('Content Validation', () => {
    test('should contain proper job execution details', async () => {
      const result = await client.callTool('get_job_log_entries', { limit: 10 });
      
      assertJobExecutionPatterns(result);
      
      const text = parseResponseText(result.content[0].text);
      
      // Should contain typical job execution elements
      assert.ok(/SystemJobThread\|\d+/.test(text),
        'Should contain SystemJobThread with ID pattern');
      
      // Should contain organization references
      assert.ok(/\[Organization\]/.test(text),
        'Should contain Organization references');
    });

    test('should include proper timestamp formats', async () => {
      const result = await client.callTool('get_job_log_entries', { limit: 5 });
      
      assertSuccessResponse(result);
      
      const text = parseResponseText(result.content[0].text);
      
      // Should contain GMT timestamps with proper format
      const timestampPattern = /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3} GMT/;
      assert.ok(timestampPattern.test(text),
        'Should contain properly formatted GMT timestamps');
    });

    test('should include job names in bracket format', async () => {
      const result = await client.callTool('get_job_log_entries', { limit: 10 });
      
      assertSuccessResponse(result);
      
      const text = parseResponseText(result.content[0].text);
      
      // Should contain job names in brackets
      const jobNamePattern = /\[[\w]+\]/;
      assert.ok(jobNamePattern.test(text),
        'Should contain job names in bracket format');
    });

    test('should maintain consistent job log structure', async () => {
      const result = await client.callTool('get_job_log_entries', { limit: 15 });
      
      assertSuccessResponse(result);
      
      const text = parseResponseText(result.content[0].text);
      const entries = extractJobLogEntries(text);
      
      // Each entry should follow consistent structure
      for (const entry of entries.slice(0, 5)) { // Check first 5 entries
        // Should start with job name in brackets
        assert.ok(/^\[[\w]+\]/.test(entry.trim()),
          `Entry should start with job name: "${entry.substring(0, 100)}..."`);
        
        // Should contain timestamp
        assert.ok(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3} GMT/.test(entry),
          `Entry should contain timestamp: "${entry.substring(0, 100)}..."`);
        
        // Should contain log level
        assert.ok(/(ERROR|WARN|INFO|DEBUG)/.test(entry),
          `Entry should contain log level: "${entry.substring(0, 100)}..."`);
      }
    });
  });

  // Edge cases and error handling
  describe('Edge Cases and Error Handling', () => {
    test('should handle zero limit gracefully', async () => {
      const result = await client.callTool('get_job_log_entries', { limit: 0 });
      
      assertErrorResponse(result, 'Invalid limit');
      assertTextContent(result, 'Must be between 1 and 1000');
    });

    test('should handle negative limit gracefully', async () => {
      const result = await client.callTool('get_job_log_entries', { limit: -5 });
      
      assertErrorResponse(result, 'Invalid limit');
    });

    test('should handle invalid log level', async () => {
      const result = await client.callTool('get_job_log_entries', { 
        level: 'invalid',
        limit: 5 
      });
      
      assertErrorResponse(result, 'Error');
    });

    test('should handle extremely large limit values', async () => {
      const result = await client.callTool('get_job_log_entries', { limit: 10000 });
      
      assertErrorResponse(result, 'Invalid limit');
      assertTextContent(result, 'Must be between 1 and 1000');
    });

    test('should handle empty string job name', async () => {
      const result = await client.callTool('get_job_log_entries', { 
        jobName: '',
        limit: 5 
      });
      
      // Empty job name should be treated as no filter
      assertSuccessResponse(result);
      assertTextContent(result, 'Latest 5 all levels messages from latest jobs:');
    });

    test('should handle special characters in job name', async () => {
      const result = await client.callTool('get_job_log_entries', { 
        jobName: 'Job@#$%',
        limit: 5 
      });
      
      assertSuccessResponse(result);
      // Should handle gracefully, likely with no results
      assert.ok(result.content[0].text.includes('Job@#$%') || 
                result.content[0].text.includes('No job logs found'),
        'Should handle special characters gracefully');
    });
  });

  // Functional monitoring tests
  describe('Functional Monitoring', () => {
    test('should maintain consistent response structure across calls', async () => {
      const calls = [];
      
      // Make multiple sequential calls to test consistency
      for (let i = 0; i < 5; i++) {
        const result = await client.callTool('get_job_log_entries', { limit: 3 });
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
        assert.ok(text.includes('Latest 3 all levels messages'),
          'Should contain consistent header format');
      }
    });

    test('should handle different parameter combinations reliably', async () => {
      const paramCombinations = [
        { limit: 1 },
        { limit: 5, level: 'info' },
        { limit: 3, jobName: 'ProcessOrders' },
        { limit: 2, level: 'error', jobName: 'ImportCatalog' }
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

    test('should provide meaningful responses for all valid parameter ranges', async () => {
      // Test various limit values
      const limitValues = [1, 5, 10, 25, 50];
      
      for (const limit of limitValues) {
        const result = await client.callTool('get_job_log_entries', { limit });
        
        assertValidMCPResponse(result);
        
        if (!result.isError) {
          const analysis = assertJobLogEntriesFormat(result, limit);
          
          // Verify actual count doesn't exceed limit
          assert.ok(analysis.entryCount <= limit,
            `Actual count ${analysis.entryCount} should not exceed limit ${limit}`);
        }
      }
    });
  });

  // Multi-step workflow tests
  describe('Multi-Step Workflows', () => {
    test('should support job discovery and detailed analysis workflow', async () => {
      // Step 1: Get general job log entries to discover available jobs
      const generalResult = await client.callTool('get_job_log_entries', { limit: 20 });
      assertSuccessResponse(generalResult);
      
      const generalText = parseResponseText(generalResult.content[0].text);
      const jobNames = [...new Set(
        (generalText.match(/\[(\w+)\]/g) || []).map(match => match.slice(1, -1))
      )];
      
      // Step 2: For each discovered job, get specific entries
      for (const jobName of jobNames.slice(0, 2)) { // Test first 2 jobs
        const specificResult = await client.callTool('get_job_log_entries', { 
          jobName,
          limit: 5 
        });
        
        if (!specificResult.isError) {
          assertJobLogEntriesFormat(specificResult, 5, 'all levels', jobName);
          
          // Step 3: Get error-level entries for the same job
          const errorResult = await client.callTool('get_job_log_entries', { 
            jobName,
            level: 'error',
            limit: 3 
          });
          
          assertValidMCPResponse(errorResult);
          if (!errorResult.isError) {
            assertJobLogEntriesFormat(errorResult, 3, 'error', jobName);
          }
        }
      }
    });

    test('should support progressive filtering workflow', async () => {
      // Step 1: Start with broad search
      const broadResult = await client.callTool('get_job_log_entries', { limit: 50 });
      assertSuccessResponse(broadResult);
      
      // Step 2: Focus on error level
      const errorResult = await client.callTool('get_job_log_entries', { 
        level: 'error',
        limit: 10 
      });
      
      assertValidMCPResponse(errorResult);
      
      // Step 3: Focus on specific job if errors found
      if (!errorResult.isError) {
        const errorText = parseResponseText(errorResult.content[0].text);
        const errorJobNames = [...new Set(
          (errorText.match(/\[(\w+)\]/g) || []).map(match => match.slice(1, -1))
        )];
        
        if (errorJobNames.length > 0) {
          const jobName = errorJobNames[0];
          const specificErrorResult = await client.callTool('get_job_log_entries', { 
            jobName,
            level: 'error',
            limit: 5 
          });
          
          assertValidMCPResponse(specificErrorResult);
          if (!specificErrorResult.isError) {
            assertJobLogEntriesFormat(specificErrorResult, 5, 'error', jobName);
          }
        }
      }
    });
  });
});
