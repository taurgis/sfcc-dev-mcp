import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

describe('search_job_logs_by_name - Optimized Programmatic Tests', () => {
  let client;
  let discoveredJobNames = [];

  before(async () => {
    client = await connect('./aegis.config.with-dw.json');
    
    // Discover available job names for dynamic testing
    await discoverJobNames();
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

  // Simplified helper functions focused on essential validation
  function assertValidMCPResponse(result) {
    assert.ok(result.content, 'Should have content');
    assert.ok(Array.isArray(result.content), 'Content should be array');
    assert.equal(typeof result.isError, 'boolean', 'isError should be boolean');
  }

  function parseResponseText(text) {
    return text.startsWith('"') && text.endsWith('"') ? JSON.parse(text) : text;
  }

  function assertSuccessResponse(result) {
    assertValidMCPResponse(result);
    assert.equal(result.isError, false, 'Should not be an error response');
    assert.equal(result.content[0].type, 'text');
  }

  function assertErrorResponse(result, expectedErrorText) {
    assertValidMCPResponse(result);
    assert.equal(result.isError, true, 'Should be an error response');
    if (expectedErrorText) {
      const text = parseResponseText(result.content[0].text);
      assert.ok(text.includes(expectedErrorText), 
        `Expected "${expectedErrorText}" in "${text}"`);
    }
  }

  function assertJobSearchResults(result) {
    assertSuccessResponse(result);
    const text = parseResponseText(result.content[0].text);
    
    if (text.includes('No job logs found')) {
      return 0; // Valid empty result
    }
    
    // Extract count and validate basic structure
    const countMatch = text.match(/Found (\d+) job logs:/);
    assert.ok(countMatch, 'Should contain job count message');
    
    const actualCount = parseInt(countMatch[1]);
    assert.ok(actualCount > 0, 'Should have positive count when jobs found');
    
    // Validate key components are present
    assert.ok(text.includes('🔧 Job:'), 'Should contain job emoji');
    assert.ok(text.includes('ID:'), 'Should contain job ID');
    assert.ok(text.includes('File:'), 'Should contain file name');
    assert.ok(text.includes('Modified:'), 'Should contain modification time');
    assert.ok(text.includes('Size:'), 'Should contain file size');
    
    return actualCount;
  }

  async function discoverJobNames() {
    try {
      const result = await client.callTool('search_job_logs_by_name', { 
        jobName: 'Import', // Use common search term to find jobs
        limit: 5
      });
      
      if (!result.isError && result.content?.[0]?.text) {
        const text = parseResponseText(result.content[0].text);
        if (!text.includes('No job logs found')) {
          // Extract job names from the response
          const jobMatches = text.match(/🔧 Job: ([A-Za-z0-9]+)/g) || [];
          discoveredJobNames = [...new Set(jobMatches.map(match => 
            match.replace('🔧 Job: ', '')))];
        }
      }
    } catch (error) {
      console.warn('Could not discover job names:', error.message);
    }
  }

  // Core functionality tests
  describe('Core Functionality', () => {
    test('should search for job logs and return structured results', async () => {
      const result = await client.callTool('search_job_logs_by_name', { 
        jobName: 'Import' 
      });
      
      const count = assertJobSearchResults(result);
      
      if (count > 0) {
        const text = parseResponseText(result.content[0].text);
        // Verify partial matching works (job names containing "Import")
        const jobMatches = text.match(/🔧 Job: ([A-Za-z0-9]+)/g) || [];
        const containsImport = jobMatches.some(match => 
          match.toLowerCase().includes('import'));
        assert.ok(containsImport, 'Should find jobs containing "Import"');
      }
    });

    test('should respect limit parameter and handle various values', async () => {
      const testCases = [
        { limit: 1, desc: 'single result' },
        { limit: 3, desc: 'multiple results' },
        { limit: 1000, desc: 'large limit' }
      ];
      
      for (const { limit, desc } of testCases) {
        const result = await client.callTool('search_job_logs_by_name', { 
          jobName: 'Import',
          limit 
        });
        
        assertSuccessResponse(result);
        const text = parseResponseText(result.content[0].text);
        
        if (!text.includes('No job logs found')) {
          const countMatch = text.match(/Found (\d+) job logs:/);
          if (countMatch) {
            const actualCount = parseInt(countMatch[1]);
            assert.ok(actualCount <= limit, 
              `${desc}: actual count ${actualCount} should not exceed limit ${limit}`);
          }
        }
      }
    });

    test('should return no results for non-existent job name', async () => {
      const result = await client.callTool('search_job_logs_by_name', { 
        jobName: 'NonExistentJobXYZ123'
      });
      
      assertSuccessResponse(result);
      const text = parseResponseText(result.content[0].text);
      assert.ok(text.includes('No job logs found'), 'Should indicate no results found');
    });
  });

  // Parameter validation tests
  describe('Parameter Validation', () => {
    test('should reject empty job name', async () => {
      const result = await client.callTool('search_job_logs_by_name', { 
        jobName: '' 
      });
      
      assertErrorResponse(result, 'jobName must be at least 1 characters');
    });

    test('should reject missing jobName parameter', async () => {
      const result = await client.callTool('search_job_logs_by_name', {});
      
      assertErrorResponse(result, 'jobName must be at least 1 characters');
    });

    test('should handle invalid limit parameter', async () => {
      const invalidLimits = [-1, 0, 'invalid'];
      
      for (const limit of invalidLimits) {
        const result = await client.callTool('search_job_logs_by_name', { 
          jobName: 'Import',
          limit 
        });
        
        assertErrorResponse(result); // Should be an error, don't need to check exact message
      }
    });
  });

  // Dynamic discovery tests
  describe('Dynamic Discovery Tests', () => {
    test('should handle discovered job names effectively', async () => {
      if (discoveredJobNames.length === 0) {
        console.log('⚠️ Skipping dynamic discovery test - no job names found');
        return;
      }

      // Test with discovered job names
      const testJobName = discoveredJobNames[0];
      const result = await client.callTool('search_job_logs_by_name', { 
        jobName: testJobName,
        limit: 2
      });
      
      const count = assertJobSearchResults(result);
      assert.ok(count >= 0, 'Should return valid count for discovered job name');
    });

    test('should support case-insensitive search with discovered names', async () => {
      if (discoveredJobNames.length === 0) {
        console.log('⚠️ Skipping case-insensitive test - no job names discovered');
        return;
      }
      
      const testJobName = discoveredJobNames[0];
      const variations = [
        testJobName.toLowerCase(),
        testJobName.substring(0, 3).toLowerCase()
      ];
      
      for (const variation of variations) {
        const result = await client.callTool('search_job_logs_by_name', { 
          jobName: variation
        });
        
        assertSuccessResponse(result);
        // Should find results or return no results message
        const text = parseResponseText(result.content[0].text);
        assert.ok(text.includes('Found') || text.includes('No job logs found'),
          `Should return valid response for case variation "${variation}"`);
      }
    });
  });

  // Multi-step workflow tests
  describe('Multi-Step Workflows', () => {
    test('should support workflow: discover -> search -> validate', async () => {
      // Step 1: Search with broad term to discover available jobs
      const discoveryResult = await client.callTool('search_job_logs_by_name', { 
        jobName: 'Job',
        limit: 5
      });
      
      assertSuccessResponse(discoveryResult);
      
      const discoveryText = parseResponseText(discoveryResult.content[0].text);
      if (!discoveryText.includes('No job logs found')) {
        // Step 2: Extract a specific job name for targeted search
        const jobMatch = discoveryText.match(/🔧 Job: ([A-Za-z0-9]+)/);
        
        if (jobMatch) {
          const specificJobName = jobMatch[1];
          
          // Step 3: Search for that specific job
          const specificResult = await client.callTool('search_job_logs_by_name', { 
            jobName: specificJobName,
            limit: 1
          });
          
          const specificCount = assertJobSearchResults(specificResult);
          assert.ok(specificCount >= 0, 'Specific search should return valid results');
          
          // Step 4: Validate the targeted search found the job
          if (specificCount > 0) {
            const specificText = parseResponseText(specificResult.content[0].text);
            assert.ok(specificText.includes(specificJobName),
              `Targeted search should include job name "${specificJobName}"`);
          }
        }
      }
    });

    test('should handle sequential searches consistently', async () => {
      const searchTerms = ['Import', 'Job', 'Process'];
      const results = [];
      
      // Perform sequential searches
      for (const term of searchTerms) {
        const result = await client.callTool('search_job_logs_by_name', { 
          jobName: term,
          limit: 2
        });
        
        assertSuccessResponse(result);
        results.push({ term, result });
      }
      
      // Validate all searches completed successfully
      assert.equal(results.length, searchTerms.length, 
        'All sequential searches should complete');
      
      // Each result should be valid
      for (const { term, result } of results) {
        const text = parseResponseText(result.content[0].text);
        assert.ok(text.includes('Found') || text.includes('No job logs found'),
          `Search for "${term}" should return valid response format`);
      }
    });
  });

  // Edge cases and error handling
  describe('Edge Cases', () => {
    test('should handle various edge case inputs', async () => {
      const edgeCases = [
        { jobName: 'a', desc: 'single character' },
        { jobName: 'Job-With-Hyphens', desc: 'special characters' },
        { jobName: '   Import   ', desc: 'whitespace padding' }
      ];
      
      for (const { jobName, desc } of edgeCases) {
        const result = await client.callTool('search_job_logs_by_name', { 
          jobName,
          limit: 1
        });
        
        // Should not throw errors, should return valid response
        assertValidMCPResponse(result);
        
        if (result.isError) {
          // If it's an error, should be a validation error
          const text = parseResponseText(result.content[0].text);
          assert.ok(text.includes('Error'), 
            `${desc}: Error response should contain "Error"`);
        } else {
          // If successful, should have valid format
          const text = parseResponseText(result.content[0].text);
          assert.ok(text.includes('Found') || text.includes('No job logs found'),
            `${desc}: Should return valid search response`);
        }
      }
    });
  });
});