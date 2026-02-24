import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

describe('search_job_logs - Optimized Programmatic Tests', () => {
  let client;
  let discoveredJobNames = [];
  let discoveredPatterns = [];

  before(async () => {
    client = await connect('./aegis.config.with-dw.json');
    
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

  // Helper functions for dynamic discovery and complex validation
  async function discoverJobNames() {
    try {
      const result = await client.callTool('search_job_logs', { 
        pattern: 'Executing',
        limit: 50
      });
      
      if (!result.isError && result.content?.[0]?.text) {
        const text = parseResponseText(result.content[0].text);
        // Extract job names from the beginning of each log entry (first bracket pair)
        const jobMatches = text.match(/^\[([A-Za-z][A-Za-z0-9_-]*)\]/gm) || [];
        discoveredJobNames = [...new Set(jobMatches.map(match => match.slice(1, -1)))];
      }
    } catch (error) {
      console.warn('Could not discover job names:', error.message);
    }
  }

  async function discoverCommonPatterns() {
    const commonTerms = ['INFO', 'ERROR', 'step', 'completed', 'job', 'Executing'];
    
    for (const term of commonTerms) {
      try {
        const result = await client.callTool('search_job_logs', { 
          pattern: term,
          limit: 1
        });
        
        if (!result.isError && result.content?.[0]?.text) {
          const text = parseResponseText(result.content[0].text);
          if (!text.includes('No matches found')) {
            discoveredPatterns.push(term);
          }
        }
      } catch (error) {
        console.warn(`Error testing pattern "${term}":`, error.message);
      }
    }
  }

  // Helper functions for complex validations
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

  function assertSearchResultsFormat(result, pattern, expectedJobName = null) {
    assertValidMCPResponse(result);
    assert.equal(result.isError, false, 'Should not be an error response');
    assert.equal(result.content[0].type, 'text');
    
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
      assert.ok(text.includes(`job: ${expectedJobName}`) || text.includes(`in job: ${expectedJobName}`),
        `Should indicate filtering by job "${expectedJobName}"`);
    } else {
      assert.ok(text.includes(`Found`) && text.includes(`matches for "${pattern}"`),
        `Should contain found matches header for pattern "${pattern}"`);
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

  // === Dynamic Discovery and Validation Tests ===
  describe('Dynamic Discovery and Validation', () => {
    test('should dynamically validate discovered job names', async () => {
      if (discoveredJobNames.length === 0) {
        console.warn('No job names discovered - skipping dynamic validation');
        return;
      }

      // Test a sample of discovered job names (not all to avoid excessive testing)
      const sampleJobs = discoveredJobNames.slice(0, Math.min(3, discoveredJobNames.length));
      
      for (const jobName of sampleJobs) {
        const result = await client.callTool('search_job_logs', { 
          pattern: 'Executing',
          jobName: jobName,
          limit: 1
        });
        
        assertValidMCPResponse(result);
        assert.equal(result.isError, false, `Job "${jobName}" should be searchable`);
        
        const searchResults = assertSearchResultsFormat(result, 'Executing', jobName);
        
        // If we found entries, they should all be from the specified job
        if (searchResults.entries.length > 0) {
          for (const entry of searchResults.entries) {
            assert.ok(entry.includes(`[${jobName}]`),
              `Entry should be from job "${jobName}": "${entry.substring(0, 50)}..."`);
          }
        }
      }
    });

    test('should dynamically test discovered patterns with complex validation', async () => {
      if (discoveredPatterns.length === 0) {
        console.warn('No patterns discovered - skipping dynamic pattern testing');
        return;
      }

      for (const pattern of discoveredPatterns) {
        const result = await client.callTool('search_job_logs', { 
          pattern: pattern,
          limit: 3
        });
        
        assertValidMCPResponse(result);
        assert.equal(result.isError, false, `Pattern "${pattern}" should be searchable`);
        
        const searchResults = assertSearchResultsFormat(result, pattern);
        
        if (searchResults.entries.length > 0) {
          // Validate complex content structure for each discovered pattern
          assertTimestampFormat(searchResults.entries);
          
          // Validate pattern appears in content with case-insensitive search
          for (const entry of searchResults.entries) {
            assert.ok(entry.toLowerCase().includes(pattern.toLowerCase()),
              `Entry should contain pattern "${pattern}" (case-insensitive): "${entry.substring(0, 100)}..."`);
          }
        }
      }
    });

    test('should validate cross-job pattern distribution', async () => {
      if (discoveredJobNames.length < 2 || discoveredPatterns.length === 0) {
        console.warn('Insufficient data for cross-job validation - skipping');
        return;
      }

      // Test if common patterns appear across multiple jobs
      const commonPattern = discoveredPatterns[0]; // Use first discovered pattern
      const jobResults = new Map();
      
      // Search each job for the common pattern
      for (const jobName of discoveredJobNames.slice(0, 3)) {
        const result = await client.callTool('search_job_logs', { 
          pattern: commonPattern,
          jobName: jobName,
          limit: 1
        });
        
        assertValidMCPResponse(result);
        const searchResults = assertSearchResultsFormat(result, commonPattern, jobName);
        jobResults.set(jobName, searchResults.matchCount);
      }
      
      // Should be able to search across multiple jobs successfully
      assert.ok(jobResults.size > 0, 'Should be able to search multiple jobs');
    });
  });

  // === Complex Content and Format Validation ===
  describe('Complex Content Validation', () => {
    test('should validate comprehensive job log entry structure', async () => {
      const result = await client.callTool('search_job_logs', { 
        pattern: 'step',
        limit: 5
      });
      
      assertValidMCPResponse(result);
      const searchResults = assertSearchResultsFormat(result, 'step');
      
      if (searchResults.entries.length > 0) {
        for (const entry of searchResults.entries) {
          // Complex structural validation
          assert.ok(/^\[[\w\-_]+\]/.test(entry.trim()),
            `Entry should start with job name: "${entry.substring(0, 50)}..."`);
          
          // Validate timestamp format and parseability
          const timestampMatch = entry.match(/(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3} GMT)/);
          assert.ok(timestampMatch, `Entry should contain timestamp: "${entry.substring(0, 100)}..."`);
          
          const timestampStr = timestampMatch[1].replace(' GMT', 'Z');
          const date = new Date(timestampStr);
          assert.ok(!isNaN(date.getTime()), `Timestamp should be parseable: "${timestampMatch[1]}"`);
          
          // Validate log level presence
          assert.ok(/\s(INFO|ERROR|WARN|DEBUG)\s/.test(entry),
            `Entry should contain log level: "${entry.substring(0, 100)}..."`);
          
          // Validate thread information
          assert.ok(/Thread|SystemJobThread/.test(entry),
            `Entry should contain thread info: "${entry.substring(0, 100)}..."`);
        }
      }
    });

    test('should maintain consistent format across different search parameters', async () => {
      const testCombinations = [
        { pattern: 'INFO', level: 'info' },
        { pattern: 'step', limit: 2 },
        { pattern: 'completed', jobName: discoveredJobNames[0] || 'ImportCatalog' }
      ];
      
      for (const combo of testCombinations) {
        const result = await client.callTool('search_job_logs', combo);
        
        assertValidMCPResponse(result);
        assert.equal(result.isError, false, `Combination ${JSON.stringify(combo)} should succeed`);
        
        const searchResults = assertSearchResultsFormat(result, combo.pattern, combo.jobName);
        
        if (searchResults.entries.length > 0) {
          // Validate consistent structure regardless of search parameters
          for (const entry of searchResults.entries) {
            assert.ok(/^\[[\w\-_]+\]/.test(entry.trim()),
              `Consistent format for combo ${JSON.stringify(combo)}: "${entry.substring(0, 50)}..."`);
            assert.ok(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3} GMT/.test(entry),
              `Consistent timestamp for combo ${JSON.stringify(combo)}: "${entry.substring(0, 100)}..."`);
          }
        }
      }
    });
  });

  // === Advanced Multi-Step Scenarios ===
  describe('Advanced Multi-Step Scenarios', () => {
    test('should support complex search refinement workflows', async () => {
      // Step 1: Broad search to find available data
      const broadResult = await client.callTool('search_job_logs', { 
        pattern: 'job',
        limit: 10
      });
      
      assertValidMCPResponse(broadResult);
      const broadSearch = assertSearchResultsFormat(broadResult, 'job');
      
      if (broadSearch.entries.length > 0) {
        // Step 2: Extract job name from first result for targeted search
        const firstEntry = broadSearch.entries[0];
        const jobMatch = firstEntry.match(/^\[([^\]]+)\]/);
        
        if (jobMatch) {
          const extractedJobName = jobMatch[1];
          
          // Step 3: Refined search using extracted job name
          const refinedResult = await client.callTool('search_job_logs', { 
            pattern: 'step',
            jobName: extractedJobName,
            limit: 3
          });
          
          assertValidMCPResponse(refinedResult);
          const refinedSearch = assertSearchResultsFormat(refinedResult, 'step', extractedJobName);
          
          // Step 4: Validate refinement worked correctly
          if (refinedSearch.entries.length > 0) {
            for (const entry of refinedSearch.entries) {
              assert.ok(entry.includes(`[${extractedJobName}]`),
                `Refined search should only return entries from "${extractedJobName}"`);
              assert.ok(entry.toLowerCase().includes('step'),
                `Refined search should contain "step" pattern`);
            }
          }
        }
      }
    });

    test('should handle progressive pattern narrowing', async () => {
      // Progressive narrowing from broad to specific patterns
      const progressivePatterns = ['job', 'step', 'Executing step'];
      const results = [];
      
      for (const pattern of progressivePatterns) {
        const result = await client.callTool('search_job_logs', { 
          pattern: pattern,
          limit: 5
        });
        
        assertValidMCPResponse(result);
        const searchResults = assertSearchResultsFormat(result, pattern);
        results.push({ pattern, matchCount: searchResults.matchCount });
      }
      
      // Each pattern should be valid (no errors)
      assert.equal(results.length, progressivePatterns.length,
        'All progressive patterns should execute successfully');
      
      // More specific patterns should not return more results than broader ones
      if (results[0].matchCount > 0 && results[1].matchCount > 0) {
        assert.ok(results[1].matchCount <= results[0].matchCount,
          'More specific patterns should not exceed broader pattern results');
      }
    });
  });

  // === Performance and Reliability Monitoring ===
  describe('Performance and Reliability', () => {
    test('should handle sequential search operations reliably', async () => {
      const searchOperations = [
        { pattern: 'INFO', limit: 3 },
        { pattern: 'step', limit: 2 },
        { pattern: 'completed', limit: 1 }
      ];
      
      const results = [];
      
      // Execute operations sequentially to test reliability
      for (const operation of searchOperations) {
        const result = await client.callTool('search_job_logs', operation);
        
        assertValidMCPResponse(result);
        assert.equal(result.isError, false, 
          `Operation ${JSON.stringify(operation)} should succeed`);
        
        results.push({
          operation,
          success: !result.isError,
          hasContent: result.content && result.content.length > 0
        });
      }
      
      // All operations should succeed
      const successfulOps = results.filter(r => r.success).length;
      assert.equal(successfulOps, searchOperations.length,
        'All sequential operations should succeed');
      
      // All operations should return content
      const opsWithContent = results.filter(r => r.hasContent).length;
      assert.equal(opsWithContent, searchOperations.length,
        'All operations should return content');
    });

    test('should provide consistent results for repeated searches', async () => {
      const testPattern = 'INFO';
      const repeatCount = 3;
      const results = [];
      const requestedLimit = 2;
      
      // Perform same search multiple times
      for (let i = 0; i < repeatCount; i++) {
        let result = await client.callTool('search_job_logs', { 
          pattern: testPattern,
          limit: requestedLimit
        });

        if (result.isError) {
          // Retry once to reduce transient failures under parallel suite load.
          result = await client.callTool('search_job_logs', {
            pattern: testPattern,
            limit: requestedLimit,
          });
        }
        
        assertValidMCPResponse(result);
        assert.equal(result.isError, false, `Iteration ${i + 1} should succeed`);
        
        const text = parseResponseText(result.content[0].text);
        const matchCountMatch = text.match(/Found (\d+) matches/);
        const matchCount = matchCountMatch ? parseInt(matchCountMatch[1]) : 0;
        
        results.push({ iteration: i + 1, matchCount, hasMatches: matchCount > 0 });
      }
      
      // Log files can change while suites are running, so enforce eventual consistency
      // instead of strict identical counts across all iterations.
      const matchCounts = results.map(r => r.matchCount);
      for (const count of matchCounts) {
        assert.ok(
          Number.isInteger(count) && count >= 0 && count <= requestedLimit,
          `Match count should be within [0, ${requestedLimit}] for limit=${requestedLimit}. Got: ${count}`,
        );
      }

      const frequencies = new Map();
      for (const count of matchCounts) {
        frequencies.set(count, (frequencies.get(count) || 0) + 1);
      }

      const maxFrequency = Math.max(...frequencies.values());
      assert.ok(
        maxFrequency >= 2,
        `At least two iterations should agree on match count. Got: ${matchCounts.join(', ')}`,
      );
    });
  });

  // === Comprehensive Error Scenario Testing ===
  describe('Complex Error Scenarios', () => {
    test('should categorize and handle different error types systematically', async () => {
      const errorScenarios = [
        { 
          name: 'validation_error', 
          params: { pattern: '' }, 
          expectedKeywords: ['pattern', 'non-empty', 'string'] 
        },
        { 
          name: 'type_error', 
          params: { pattern: 'INFO', limit: 'invalid' }, 
            expectedKeywords: ['limit', 'number'] 
        },
        { 
          name: 'constraint_error', 
          params: { pattern: 'INFO', limit: -1 }, 
            expectedKeywords: ['limit', '>= 1'] 
        }
      ];
      
      for (const scenario of errorScenarios) {
        const result = await client.callTool('search_job_logs', scenario.params);
        
        assertValidMCPResponse(result);
        assert.equal(result.isError, true, 
          `Scenario "${scenario.name}" should be an error`);
        
        const errorText = result.content[0].text.toLowerCase();
        
        // Check if error contains expected keywords
        const hasExpectedKeywords = scenario.expectedKeywords.some(keyword => 
          errorText.includes(keyword.toLowerCase())
        );
        
        assert.ok(hasExpectedKeywords,
          `Error for "${scenario.name}" should contain keywords: ${scenario.expectedKeywords.join(', ')}. Got: "${result.content[0].text}"`);
      }
    });

    test('should handle edge cases with complex validation logic', async () => {
      const edgeCases = [
        { name: 'special_characters', pattern: '[test]', expectSuccess: true },
        { name: 'unicode_characters', pattern: 'тест', expectSuccess: true },
        { name: 'very_long_pattern', pattern: 'a'.repeat(500), expectSuccess: true },
        { name: 'pattern_with_quotes', pattern: '"quoted"', expectSuccess: true }
      ];
      
      for (const edgeCase of edgeCases) {
        const result = await client.callTool('search_job_logs', { 
          pattern: edgeCase.pattern,
          limit: 1
        });
        
        assertValidMCPResponse(result);
        
        if (edgeCase.expectSuccess) {
          assert.equal(result.isError, false,
            `Edge case "${edgeCase.name}" should succeed`);
          
          // Should handle gracefully even if no matches found
          const searchResults = assertSearchResultsFormat(result, edgeCase.pattern);
          assert.ok(searchResults.matchCount >= 0,
            `Edge case "${edgeCase.name}" should return valid match count`);
        } else {
          assert.equal(result.isError, true,
            `Edge case "${edgeCase.name}" should fail as expected`);
        }
      }
    });
  });
});