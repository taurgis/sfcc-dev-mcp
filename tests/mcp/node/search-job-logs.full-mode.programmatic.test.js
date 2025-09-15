import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-conductor';

describe('search_job_logs - Full Mode Programmatic Tests', () => {
  let client;
  let discoveredJobNames = [];
  let discoveredPatterns = [];

  before(async () => {
    client = await connect('./conductor.config.with-dw.json');
    
    // Discover available job names and patterns for advanced testing
    await discoverJobNames();
    await discoverCommonPatterns();
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

  function assertSearchResultsFormat(result, pattern, expectedJobName = null) {
    assertSuccessResponse(result);
    const text = parseResponseText(result.content[0].text);
    
    if (text.includes('No matches found')) {
      // Valid empty result case
      assert.ok(text.includes(`No matches found for "${pattern}"`),
        `Should indicate no matches for pattern "${pattern}"`);
      return { matchCount: 0, entries: [] };
    }
    
    // Should contain found matches header
    if (expectedJobName) {
      assert.ok(text.includes(`Found`) && text.includes(`matches for "${pattern}"`),
        `Should contain found matches header for pattern "${pattern}"`);
      assert.ok(text.includes(`job: ${expectedJobName}`),
        `Should indicate filtering by job "${expectedJobName}"`);
    } else {
      assert.ok(text.includes(`Found`) && text.includes(`matches for "${pattern}"`),
        `Should contain found matches header for pattern "${pattern}"`);
      assert.ok(text.includes('job logs logs'),
        'Should indicate searching all job logs');
    }
    
    // Extract job log entries
    const entries = extractJobLogEntries(text);
    
    // Validate each entry has proper structure and contains pattern
    for (const entry of entries) {
      // Each entry should have job name in brackets
      assert.ok(/^\[[\w\-_]+\]/.test(entry.trim()),
        `Entry should start with job name in brackets: "${entry.substring(0, 50)}..."`);
      
      // Should contain timestamp in GMT format
      assert.ok(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3} GMT/.test(entry),
        `Entry should contain GMT timestamp: "${entry.substring(0, 100)}..."`);
      
      // Should contain the search pattern (case-insensitive check)
      assert.ok(entry.toLowerCase().includes(pattern.toLowerCase()),
        `Entry should contain pattern "${pattern}": "${entry.substring(0, 100)}..."`);
      
      // If filtering by job name, all entries should be from that job
      if (expectedJobName) {
        assert.ok(entry.includes(`[${expectedJobName}]`),
          `Entry should be from job "${expectedJobName}": "${entry.substring(0, 50)}..."`);
      }
    }
    
    // Extract match count from header
    const matchCountMatch = text.match(/Found (\d+) matches/);
    const matchCount = matchCountMatch ? parseInt(matchCountMatch[1]) : entries.length;
    
    return { matchCount, entries };
  }

  function extractJobLogEntries(text) {
    // Split by double newlines and filter for entries that look like job logs
    const lines = text.split(/\n\n+/);
    return lines.filter(line => 
      line.trim() && 
      /^\[[\w\-_]+\]/.test(line.trim()) &&
      /\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3} GMT/.test(line)
    );
  }

  function assertTimestampFormat(entries) {
    for (const entry of entries) {
      // Should contain valid timestamp format
      const timestampMatch = entry.match(/(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3} GMT)/);
      assert.ok(timestampMatch, `Entry should contain valid timestamp: "${entry.substring(0, 100)}..."`);
      
      // Validate timestamp is parseable
      const timestampStr = timestampMatch[1].replace(' GMT', 'Z');
      const date = new Date(timestampStr);
      assert.ok(!isNaN(date.getTime()), `Timestamp should be valid date: "${timestampMatch[1]}"`);
    }
  }

  function assertLogLevelFiltering(entries, expectedLevel) {
    if (expectedLevel === 'all') return; // Skip validation for 'all' level
    
    for (const entry of entries) {
      // Should contain the expected log level
      assert.ok(entry.includes(` ${expectedLevel.toUpperCase()} `),
        `Entry should contain log level "${expectedLevel.toUpperCase()}": "${entry.substring(0, 100)}..."`);
    }
  }

  async function discoverJobNames() {
    try {
      // Use get_latest_job_log_files to discover job names
      const result = await client.callTool('get_latest_job_log_files', { limit: 10 });
      if (!result.isError) {
        const text = parseResponseText(result.content[0].text);
        const jobNameMatches = text.match(/Job-(\w+)-\d+\.log/g);
        if (jobNameMatches) {
          discoveredJobNames = [...new Set(jobNameMatches.map(match => 
            match.match(/Job-(\w+)-\d+\.log/)[1]
          ))];
        }
      }
    } catch (error) {
      console.warn('Could not discover job names:', error.message);
    }
    
    // Fallback job names for testing
    if (discoveredJobNames.length === 0) {
      discoveredJobNames = ['ImportCatalog', 'ProcessOrders', 'ExportProducts'];
    }
  }

  async function discoverCommonPatterns() {
    // Common patterns to test with
    discoveredPatterns = [
      'INFO', 'ERROR', 'WARN', 'DEBUG',
      'Executing', 'completed', 'step', 'job',
      'Organization', 'Thread', 'System'
    ];
  }

  // === Basic Functionality Tests ===
  describe('Basic Functionality', () => {
    test('should search for patterns with default parameters', async () => {
      const result = await client.callTool('search_job_logs', { 
        pattern: 'INFO' 
      });
      
      assertSuccessResponse(result);
      const searchResults = assertSearchResultsFormat(result, 'INFO');
      
      // INFO is a common log level, should likely have results
      // But empty results are also valid for edge cases
      assert.ok(searchResults.matchCount >= 0, 'Should have valid match count');
    });

    test('should search with custom limit parameter', async () => {
      const result = await client.callTool('search_job_logs', { 
        pattern: 'Executing',
        limit: 3
      });
      
      assertSuccessResponse(result);
      const searchResults = assertSearchResultsFormat(result, 'Executing');
      
      if (searchResults.matchCount > 0) {
        // If there are matches, should respect limit
        assert.ok(searchResults.entries.length <= 3, 
          'Should respect limit parameter');
      }
    });

    test('should filter by log level', async () => {
      const result = await client.callTool('search_job_logs', { 
        pattern: 'INFO',
        level: 'info'
      });
      
      assertSuccessResponse(result);
      const searchResults = assertSearchResultsFormat(result, 'INFO');
      
      if (searchResults.entries.length > 0) {
        assertLogLevelFiltering(searchResults.entries, 'info');
      }
    });

    test('should filter by specific job name', async () => {
      if (discoveredJobNames.length === 0) {
        console.warn('No job names discovered, skipping job name filtering test');
        return;
      }

      const jobName = discoveredJobNames[0];
      const result = await client.callTool('search_job_logs', { 
        pattern: 'Executing',
        jobName: jobName
      });
      
      assertSuccessResponse(result);
      const searchResults = assertSearchResultsFormat(result, 'Executing', jobName);
      
      // Results may be empty, which is valid
      assert.ok(searchResults.matchCount >= 0, 'Should have valid match count');
    });

    test('should combine all parameters', async () => {
      if (discoveredJobNames.length === 0) {
        console.warn('No job names discovered, skipping combined parameters test');
        return;
      }

      const jobName = discoveredJobNames[0];
      const result = await client.callTool('search_job_logs', { 
        pattern: 'step',
        level: 'info',
        limit: 2,
        jobName: jobName
      });
      
      assertSuccessResponse(result);
      const searchResults = assertSearchResultsFormat(result, 'step', jobName);
      
      if (searchResults.entries.length > 0) {
        assertLogLevelFiltering(searchResults.entries, 'info');
        assert.ok(searchResults.entries.length <= 2, 'Should respect limit');
      }
    });
  });

  // === Parameter Validation Tests ===
  describe('Parameter Validation', () => {
    test('should validate pattern parameter is required', async () => {
      const result = await client.callTool('search_job_logs', {});
      
      assertErrorResponse(result);
      assertTextContent(result, 'pattern');
    });

    test('should validate pattern is non-empty string', async () => {
      const result = await client.callTool('search_job_logs', { 
        pattern: '' 
      });
      
      assertErrorResponse(result, 'pattern must be a non-empty string');
    });

    test('should validate pattern type', async () => {
      const result = await client.callTool('search_job_logs', { 
        pattern: 123 
      });
      
      assertErrorResponse(result);
      assertTextContent(result, 'pattern');
    });

    test('should validate limit parameter type', async () => {
      const result = await client.callTool('search_job_logs', { 
        pattern: 'INFO',
        limit: 'invalid' 
      });
      
      // Note: This may not return an error due to type coercion
      // but should still handle gracefully
      assertValidMCPResponse(result);
    });

    test('should validate negative limit value', async () => {
      const result = await client.callTool('search_job_logs', { 
        pattern: 'INFO',
        limit: -5 
      });
      
      assertErrorResponse(result);
    });

    test('should validate zero limit value', async () => {
      const result = await client.callTool('search_job_logs', { 
        pattern: 'INFO',
        limit: 0 
      });
      
      assertErrorResponse(result);
    });

    test('should validate invalid log level', async () => {
      const result = await client.callTool('search_job_logs', { 
        pattern: 'INFO',
        level: 'invalid' 
      });
      
      assertErrorResponse(result);
    });

    test('should validate jobName parameter type', async () => {
      const result = await client.callTool('search_job_logs', { 
        pattern: 'INFO',
        jobName: 123 
      });
      
      assertErrorResponse(result, 'jobName must be a non-empty string');
    });

    test('should validate empty jobName', async () => {
      const result = await client.callTool('search_job_logs', { 
        pattern: 'INFO',
        jobName: '' 
      });
      
      assertErrorResponse(result, 'jobName must be a non-empty string');
    });

    test('should validate whitespace-only jobName', async () => {
      const result = await client.callTool('search_job_logs', { 
        pattern: 'INFO',
        jobName: '   ' 
      });
      
      assertErrorResponse(result, 'jobName must be a non-empty string');
    });

    test('should validate array jobName', async () => {
      const result = await client.callTool('search_job_logs', { 
        pattern: 'INFO',
        jobName: [] 
      });
      
      assertErrorResponse(result, 'jobName must be a non-empty string');
    });

    test('should validate object jobName', async () => {
      const result = await client.callTool('search_job_logs', { 
        pattern: 'INFO',
        jobName: {} 
      });
      
      assertErrorResponse(result, 'jobName must be a non-empty string');
    });
  });

  // === Log Level Testing ===
  describe('Log Level Filtering', () => {
    const logLevels = ['error', 'warn', 'info', 'debug', 'all'];

    for (const level of logLevels) {
      test(`should search ${level} level logs`, async () => {
        const result = await client.callTool('search_job_logs', { 
          pattern: level.toUpperCase(),
          level: level
        });
        
        assertSuccessResponse(result);
        const searchResults = assertSearchResultsFormat(result, level.toUpperCase());
        
        if (searchResults.entries.length > 0 && level !== 'all') {
          assertLogLevelFiltering(searchResults.entries, level);
        }
      });
    }
  });

  // === Edge Cases and Error Handling ===
  describe('Edge Cases', () => {
    test('should handle pattern with no matches gracefully', async () => {
      const result = await client.callTool('search_job_logs', { 
        pattern: 'ZZZNOTHINGFOUND123456' 
      });
      
      assertSuccessResponse(result);
      assertTextContent(result, 'No matches found for "ZZZNOTHINGFOUND123456"');
    });

    test('should handle non-existent job name gracefully', async () => {
      const result = await client.callTool('search_job_logs', { 
        pattern: 'INFO',
        jobName: 'NonExistentJobName123' 
      });
      
      assertSuccessResponse(result);
      // Should either find no matches or indicate no job logs found
      const text = parseResponseText(result.content[0].text);
      assert.ok(
        text.includes('No matches found') || text.includes('No job logs found'),
        'Should handle non-existent job name gracefully'
      );
    });

    test('should handle special characters in pattern', async () => {
      const specialPatterns = ['[test]', '(test)', 'test*', 'test?', 'test+'];
      
      for (const pattern of specialPatterns) {
        const result = await client.callTool('search_job_logs', { 
          pattern: pattern
        });
        
        assertSuccessResponse(result);
        // Should not throw errors even with special regex characters
        const searchResults = assertSearchResultsFormat(result, pattern);
        assert.ok(searchResults.matchCount >= 0, 
          `Should handle special pattern "${pattern}"`);
      }
    });

    test('should handle unicode characters in pattern', async () => {
      const result = await client.callTool('search_job_logs', { 
        pattern: 'тест' // Cyrillic characters
      });
      
      assertSuccessResponse(result);
      assertSearchResultsFormat(result, 'тест');
    });

    test('should handle very long patterns', async () => {
      const longPattern = 'a'.repeat(1000);
      const result = await client.callTool('search_job_logs', { 
        pattern: longPattern
      });
      
      assertSuccessResponse(result);
      assertSearchResultsFormat(result, longPattern);
    });

    test('should handle large limit values', async () => {
      const result = await client.callTool('search_job_logs', { 
        pattern: 'job',
        limit: 1000
      });
      
      assertSuccessResponse(result);
      const searchResults = assertSearchResultsFormat(result, 'job');
      
      // Should handle large limits without error
      assert.ok(searchResults.matchCount >= 0, 'Should handle large limits');
    });
  });

  // === Content and Format Validation ===
  describe('Content Validation', () => {
    test('should return properly formatted job log entries', async () => {
      const result = await client.callTool('search_job_logs', { 
        pattern: 'step',
        limit: 5
      });
      
      assertSuccessResponse(result);
      const searchResults = assertSearchResultsFormat(result, 'step');
      
      if (searchResults.entries.length > 0) {
        assertTimestampFormat(searchResults.entries);
      }
    });

    test('should maintain consistent format across different patterns', async () => {
      const patterns = discoveredPatterns.slice(0, 3); // Test first 3 patterns
      
      for (const pattern of patterns) {
        const result = await client.callTool('search_job_logs', { 
          pattern: pattern,
          limit: 1
        });
        
        assertSuccessResponse(result);
        const searchResults = assertSearchResultsFormat(result, pattern);
        
        if (searchResults.entries.length > 0) {
          // Validate consistent format
          const entry = searchResults.entries[0];
          assert.ok(/^\[[\w\-_]+\]/.test(entry.trim()),
            `Entry should start with job name: "${entry.substring(0, 50)}..."`);
          assert.ok(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3} GMT/.test(entry),
            `Entry should contain timestamp: "${entry.substring(0, 100)}..."`);
        }
      }
    });

    test('should include job thread information in entries', async () => {
      const result = await client.callTool('search_job_logs', { 
        pattern: 'Thread',
        limit: 3
      });
      
      assertSuccessResponse(result);
      const searchResults = assertSearchResultsFormat(result, 'Thread');
      
      if (searchResults.entries.length > 0) {
        // Should contain thread information
        for (const entry of searchResults.entries) {
          assert.ok(entry.includes('Thread'),
            `Entry should contain thread info: "${entry.substring(0, 100)}..."`);
        }
      }
    });

    test('should preserve log context in search results', async () => {
      const result = await client.callTool('search_job_logs', { 
        pattern: 'Organization',
        limit: 2
      });
      
      assertSuccessResponse(result);
      const searchResults = assertSearchResultsFormat(result, 'Organization');
      
      if (searchResults.entries.length > 0) {
        // Should contain contextual information
        for (const entry of searchResults.entries) {
          // Should have job execution context
          assert.ok(entry.includes('[') && entry.includes(']'),
            `Entry should contain job context: "${entry.substring(0, 100)}..."`);
        }
      }
    });
  });

  // === Performance and Reliability Testing ===
  describe('Performance and Reliability', () => {
    test('should handle multiple sequential searches efficiently', async () => {
      const patterns = ['INFO', 'ERROR', 'Executing'];
      const results = [];
      
      // Execute searches sequentially (not concurrent to avoid conflicts)
      for (const pattern of patterns) {
        const result = await client.callTool('search_job_logs', { 
          pattern: pattern,
          limit: 5
        });
        
        assertSuccessResponse(result);
        results.push(result);
      }
      
      // All searches should succeed
      assert.equal(results.length, patterns.length, 
        'All sequential searches should complete');
    });

    test('should provide consistent results for same pattern', async () => {
      const pattern = 'INFO';
      const results = [];
      
      // Run same search multiple times
      for (let i = 0; i < 3; i++) {
        const result = await client.callTool('search_job_logs', { 
          pattern: pattern,
          limit: 5
        });
        
        assertSuccessResponse(result);
        results.push(result);
      }
      
      // Results should be consistent (same pattern, same data)
      if (results.length > 1) {
        const firstText = parseResponseText(results[0].content[0].text);
        const secondText = parseResponseText(results[1].content[0].text);
        
        // Match counts should be identical for same pattern
        const firstCount = firstText.match(/Found (\d+) matches/);
        const secondCount = secondText.match(/Found (\d+) matches/);
        
        if (firstCount && secondCount) {
          assert.equal(firstCount[1], secondCount[1], 
            'Match counts should be consistent for same pattern');
        }
      }
    });

    test('should handle rapid successive searches', async () => {
      const searches = [
        { pattern: 'step', limit: 2 },
        { pattern: 'job', limit: 3 },
        { pattern: 'completed', limit: 1 }
      ];
      
      // Rapid sequential searches
      for (const search of searches) {
        const result = await client.callTool('search_job_logs', search);
        assertSuccessResponse(result);
      }
    });
  });

  // === Advanced Search Scenarios ===
  describe('Advanced Search Scenarios', () => {
    test('should search across different job types', async () => {
      if (discoveredJobNames.length < 2) {
        console.warn('Need at least 2 job names for cross-job testing');
        return;
      }

      const results = [];
      
      // Search each discovered job individually
      for (const jobName of discoveredJobNames.slice(0, 3)) {
        const result = await client.callTool('search_job_logs', { 
          pattern: 'Executing',
          jobName: jobName,
          limit: 1
        });
        
        assertSuccessResponse(result);
        results.push(result);
      }
      
      // Should complete all job-specific searches
      assert.equal(results.length, Math.min(3, discoveredJobNames.length),
        'Should complete searches for multiple jobs');
    });

    test('should combine pattern matching with level filtering', async () => {
      const combinations = [
        { pattern: 'step', level: 'info' },
        { pattern: 'completed', level: 'info' },
        { pattern: 'ERROR', level: 'error' }
      ];
      
      for (const combo of combinations) {
        const result = await client.callTool('search_job_logs', combo);
        
        assertSuccessResponse(result);
        const searchResults = assertSearchResultsFormat(result, combo.pattern);
        
        if (searchResults.entries.length > 0 && combo.level !== 'all') {
          assertLogLevelFiltering(searchResults.entries, combo.level);
        }
      }
    });

    test('should handle case-sensitive vs case-insensitive searches', async () => {
      const caseCombinations = [
        'info', 'INFO', 'Info',
        'executing', 'EXECUTING', 'Executing'
      ];
      
      for (const pattern of caseCombinations) {
        const result = await client.callTool('search_job_logs', { 
          pattern: pattern,
          limit: 1
        });
        
        assertSuccessResponse(result);
        // Should handle various case combinations without error
        assertSearchResultsFormat(result, pattern);
      }
    });
  });

  // === Functional Monitoring ===
  describe('Functional Monitoring', () => {
    const monitor = {
      results: new Map(),
      
      async validateTool(pattern, params = {}) {
        const result = await client.callTool('search_job_logs', { 
          pattern, 
          ...params 
        });
        
        const validation = {
          success: !result.isError,
          hasContent: result.content && result.content.length > 0,
          contentType: result.content?.[0]?.type,
          timestamp: new Date().toISOString(),
          pattern: pattern,
          params: params
        };
        
        if (!this.results.has(pattern)) {
          this.results.set(pattern, []);
        }
        this.results.get(pattern).push(validation);
        
        return { result, validation };
      },
      
      getStats(pattern) {
        const validations = this.results.get(pattern) || [];
        const successful = validations.filter(v => v.success).length;
        
        return {
          totalCalls: validations.length,
          successRate: validations.length > 0 ? successful / validations.length : 0,
          failureRate: validations.length > 0 ? (validations.length - successful) / validations.length : 0,
          lastValidation: validations[validations.length - 1]?.timestamp
        };
      }
    };

    test('should maintain high reliability for common patterns', async () => {
      const commonPatterns = ['INFO', 'job', 'step'];
      
      for (const pattern of commonPatterns) {
        const { validation } = await monitor.validateTool(pattern, { limit: 3 });
        
        assert.ok(validation.success, `Pattern "${pattern}" should succeed`);
        assert.ok(validation.hasContent, `Pattern "${pattern}" should have content`);
        assert.equal(validation.contentType, 'text', `Pattern "${pattern}" should return text`);
      }
      
      // Check overall reliability
      for (const pattern of commonPatterns) {
        const stats = monitor.getStats(pattern);
        assert.equal(stats.successRate, 1.0, 
          `Pattern "${pattern}" should have 100% success rate`);
      }
    });

    test('should handle error scenarios gracefully', async () => {
      const errorScenarios = [
        { pattern: '', expectedError: true },
        { pattern: 'ZZZNOTHINGFOUND', expectedError: false }, // No matches is not an error
      ];
      
      for (const scenario of errorScenarios) {
        const { validation } = await monitor.validateTool(scenario.pattern);
        
        if (scenario.expectedError) {
          assert.ok(!validation.success, 
            `Scenario "${scenario.pattern}" should fail as expected`);
        } else {
          assert.ok(validation.success, 
            `Scenario "${scenario.pattern}" should succeed`);
        }
      }
    });
  });
});
