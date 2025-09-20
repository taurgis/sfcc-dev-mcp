import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

describe('search_job_logs_by_name - Full Mode Programmatic Tests', () => {
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

  function assertJobSearchFormat(result, expectedLimit, searchTerm) {
    assertSuccessResponse(result);
    const text = parseResponseText(result.content[0].text);
    
    if (text.includes('No job logs found')) {
      // Valid case - no matching jobs
      assert.ok(text === 'No job logs found.' || text === 'No job logs found', 
        'No results message should be exact');
      return 0;
    }
    
    // Extract actual count from response
    const countMatch = text.match(/Found (\d+) job logs:/);
    assert.ok(countMatch, 'Should contain job count message');
    
    const actualCount = parseInt(countMatch[1]);
    
    // Actual count should not exceed expected limit
    assert.ok(actualCount <= expectedLimit, 
      `Actual count ${actualCount} should not exceed limit ${expectedLimit}`);
    
    // Should contain job information with proper formatting if any jobs found
    if (actualCount > 0) {
      assert.ok(/🔧 Job: [A-Za-z]+/.test(text),
        'Should contain job name with emoji');
      
      // Should contain job ID
      assert.ok(/ID: [0-9]+/.test(text),
        'Should contain job ID');
      
      // Should contain log file name
      assert.ok(/File: Job-[A-Za-z]+-[0-9]+\.log/.test(text),
        'Should contain log file name pattern');
      
      // Should contain modification timestamp in GMT format
      assert.ok(/Modified: [A-Za-z]{3}, [0-9]{2} [A-Za-z]{3} [0-9]{4} [0-9]{2}:[0-9]{2}:[0-9]{2} GMT/.test(text),
        'Should contain GMT timestamp pattern');
      
      // Should contain file size information
      assert.ok(/Size: [0-9]+\.[0-9]+ [A-Z]B/.test(text),
        'Should contain file size pattern');
      
      // Verify job names contain the search term (case-insensitive partial match)
      const jobSections = text.split('🔧 Job: ').slice(1);
      for (const section of jobSections) {
        const jobName = section.split('\n')[0].trim();
        assert.ok(jobName.toLowerCase().includes(searchTerm.toLowerCase()),
          `Job name "${jobName}" should contain search term "${searchTerm}"`);
      }
    }
    
    return actualCount;
  }

  function extractJobLogInfo(responseText) {
    const jobs = [];
    const text = parseResponseText(responseText);
    
    if (text.includes('No job logs found')) {
      return jobs;
    }
    
    const sections = text.split('🔧 Job: ').slice(1); // Remove empty first element
    
    for (const section of sections) {
      const lines = section.split('\n');
      const jobName = lines[0].trim();
      
      let jobId = null;
      let fileName = null;
      let modified = null;
      let size = null;
      
      for (const line of lines) {
        const idMatch = line.match(/ID: (\d+)/);
        if (idMatch) jobId = idMatch[1];
        
        const fileMatch = line.match(/File: (.+\.log)/);
        if (fileMatch) fileName = fileMatch[1];
        
        const modifiedMatch = line.match(/Modified: (.+)/);
        if (modifiedMatch) modified = modifiedMatch[1];
        
        const sizeMatch = line.match(/Size: (.+)/);
        if (sizeMatch) size = sizeMatch[1];
      }
      
      if (jobName && jobId && fileName) {
        jobs.push({ jobName, jobId, fileName, modified, size });
      }
    }
    
    return jobs;
  }

  async function discoverJobNames() {
    console.log('🔍 Discovering available job names using MCP server...');
    
    try {
      const result = await client.callTool('get_latest_job_log_files', { limit: 10 });
      if (!result.isError) {
        const jobLogs = extractJobLogInfo(result.content[0].text);
        discoveredJobNames = [...new Set(jobLogs.map(j => j.jobName))]; // Unique job names
        console.log(`🔧 Found ${discoveredJobNames.length} unique job names:`, discoveredJobNames);
      }
    } catch (error) {
      console.warn('⚠️ Could not discover job names:', error.message);
    }
  }

  // Basic functionality tests
  describe('Basic Functionality', () => {
    test('should search for job logs by partial name match with default limit', async () => {
      const result = await client.callTool('search_job_logs_by_name', { 
        jobName: 'Import' 
      });
      
      assertSuccessResponse(result);
      const actualCount = assertJobSearchFormat(result, 10, 'Import'); // Default limit is 10
      
      const jobs = extractJobLogInfo(result.content[0].text);
      assert.equal(jobs.length, actualCount, 'Extracted jobs should match actual count');
      
      // Verify all returned jobs contain the search term
      for (const job of jobs) {
        assert.ok(job.jobName.toLowerCase().includes('import'),
          `Job name "${job.jobName}" should contain "import"`);
      }
    });

    test('should respect limit parameter', async () => {
      const result = await client.callTool('search_job_logs_by_name', { 
        jobName: 'Import',
        limit: 2
      });
      
      const actualCount = assertJobSearchFormat(result, 2, 'Import');
      
      const jobs = extractJobLogInfo(result.content[0].text);
      assert.equal(jobs.length, actualCount, 'Extracted jobs should match actual count');
      assert.ok(jobs.length <= 2, 'Should not exceed limit of 2');
      
      // Validate job structure if any jobs found
      for (const job of jobs) {
        assert.ok(job.jobName, 'Job should have name');
        assert.ok(job.jobId, 'Job should have ID');
        assert.ok(job.fileName, 'Job should have file name');
        assert.ok(job.modified, 'Job should have modification time');
        assert.ok(job.size, 'Job should have size');
        assert.ok(job.jobName.toLowerCase().includes('import'),
          `Job name "${job.jobName}" should contain search term`);
      }
    });

    test('should handle different limit values', async () => {
      const limits = [1, 3, 5];
      
      for (const limit of limits) {
        const result = await client.callTool('search_job_logs_by_name', { 
          jobName: 'Import',
          limit 
        });
        
        const actualCount = assertJobSearchFormat(result, limit, 'Import');
        
        const jobs = extractJobLogInfo(result.content[0].text);
        assert.equal(jobs.length, actualCount, `Extracted jobs should match actual count for limit ${limit}`);
        assert.ok(jobs.length <= limit, `Should not exceed limit of ${limit}`);
        
        // Each job should have all required fields and match search term
        for (const job of jobs) {
          assert.ok(job.jobName.length > 0, 'Job name should not be empty');
          assert.ok(/^\d+$/.test(job.jobId), 'Job ID should be numeric');
          assert.ok(job.fileName.startsWith('Job-'), 'File name should start with "Job-"');
          assert.ok(job.fileName.endsWith('.log'), 'File name should end with ".log"');
          assert.ok(job.modified.includes('GMT'), 'Modified time should include GMT');
          assert.ok(/[0-9]+\.[0-9]+ [A-Z]B/.test(job.size), 'Size should match expected format');
          assert.ok(job.jobName.toLowerCase().includes('import'),
            `Job name "${job.jobName}" should contain "import"`);
        }
      }
    });

    test('should return no results for non-existent job name', async () => {
      const result = await client.callTool('search_job_logs_by_name', { 
        jobName: 'NonExistentJobName12345'
      });
      
      assertSuccessResponse(result);
      assertTextContent(result, 'No job logs found');
      
      const jobs = extractJobLogInfo(result.content[0].text);
      assert.equal(jobs.length, 0, 'Should return no jobs for non-existent name');
    });

    test('should handle case-insensitive search', async () => {
      if (discoveredJobNames.length === 0) {
        console.log('⚠️ Skipping case-insensitive test - no job names discovered');
        return;
      }
      
      const testJobName = discoveredJobNames[0];
      const variations = [
        testJobName.toLowerCase(),
        testJobName.toUpperCase(),
        testJobName.substring(0, 3).toLowerCase()
      ];
      
      for (const variation of variations) {
        const result = await client.callTool('search_job_logs_by_name', { 
          jobName: variation
        });
        
        assertSuccessResponse(result);
        const actualCount = assertJobSearchFormat(result, 10, variation);
        
        if (actualCount > 0) {
          const jobs = extractJobLogInfo(result.content[0].text);
          // Verify at least one job matches the original name
          const matchingJobs = jobs.filter(job => 
            job.jobName.toLowerCase().includes(variation.toLowerCase()));
          assert.ok(matchingJobs.length > 0,
            `Should find jobs matching case-insensitive search for "${variation}"`);
        }
      }
    });
  });

  // Advanced search scenarios
  describe('Advanced Search Scenarios', () => {
    test('should handle partial matching with different job name patterns', async () => {
      const searchTerms = ['Import', 'Job', 'Catalog', 'Process'];
      
      for (const searchTerm of searchTerms) {
        const result = await client.callTool('search_job_logs_by_name', { 
          jobName: searchTerm
        });
        
        assertSuccessResponse(result);
        const actualCount = assertJobSearchFormat(result, 10, searchTerm);
        
        const jobs = extractJobLogInfo(result.content[0].text);
        assert.equal(jobs.length, actualCount, 
          `Extracted jobs should match actual count for search "${searchTerm}"`);
        
        // All returned jobs should contain the search term
        for (const job of jobs) {
          assert.ok(job.jobName.toLowerCase().includes(searchTerm.toLowerCase()),
            `Job "${job.jobName}" should contain search term "${searchTerm}"`);
        }
      }
    });

    test('should handle special characters in job names', async () => {
      const specialCases = [
        'Job-With-Dashes',
        'Job_With_Underscores', 
        'Job.With.Dots',
        'JobWithNumbers123'
      ];
      
      for (const searchTerm of specialCases) {
        const result = await client.callTool('search_job_logs_by_name', { 
          jobName: searchTerm
        });
        
        assertSuccessResponse(result);
        // Should handle special characters gracefully (may return no results)
        const text = parseResponseText(result.content[0].text);
        assert.ok(text.includes('Found') || text.includes('No job logs found'),
          'Should return valid search response format');
      }
    });

    test('should maintain consistency across multiple calls', async () => {
      const searchTerm = 'Import';
      
      const result1 = await client.callTool('search_job_logs_by_name', { 
        jobName: searchTerm,
        limit: 5
      });
      const result2 = await client.callTool('search_job_logs_by_name', { 
        jobName: searchTerm,
        limit: 5
      });
      
      assertSuccessResponse(result1);
      assertSuccessResponse(result2);
      
      const jobs1 = extractJobLogInfo(result1.content[0].text);
      const jobs2 = extractJobLogInfo(result2.content[0].text);
      
      // Job search should be consistent
      assert.equal(jobs1.length, jobs2.length, 'Should return same number of jobs');
      
      for (let i = 0; i < jobs1.length; i++) {
        assert.equal(jobs1[i].jobName, jobs2[i].jobName, 'Job names should be consistent');
        assert.equal(jobs1[i].jobId, jobs2[i].jobId, 'Job IDs should be consistent');
        assert.equal(jobs1[i].fileName, jobs2[i].fileName, 'File names should be consistent');
        assert.equal(jobs1[i].size, jobs2[i].size, 'File sizes should be consistent');
      }
    });

    test('should handle search with discovered job names', async () => {
      if (discoveredJobNames.length === 0) {
        console.log('⚠️ Skipping discovered job names test - no job names available');
        return;
      }
      
      // Test with each discovered job name
      for (const jobName of discoveredJobNames.slice(0, 3)) { // Test first 3 to avoid too many calls
        const result = await client.callTool('search_job_logs_by_name', { 
          jobName: jobName.substring(0, Math.max(3, jobName.length - 2)) // Partial match
        });
        
        assertSuccessResponse(result);
        const actualCount = assertJobSearchFormat(result, 10, jobName.substring(0, 3));
        
        if (actualCount > 0) {
          const jobs = extractJobLogInfo(result.content[0].text);
          // Should find the original job among results
          const matchingJobs = jobs.filter(job => job.jobName === jobName);
          assert.ok(matchingJobs.length > 0,
            `Should find original job "${jobName}" in search results`);
        }
      }
    });
  });

  // Parameter validation tests
  describe('Parameter Validation', () => {
    test('should reject empty job name', async () => {
      const result = await client.callTool('search_job_logs_by_name', { 
        jobName: ''
      });
      
      assertErrorResponse(result, 'jobName must be a non-empty string');
    });

    test('should reject missing jobName parameter', async () => {
      const result = await client.callTool('search_job_logs_by_name', {});
      
      assertErrorResponse(result, 'jobName must be a non-empty string');
    });

    test('should handle string limit parameter gracefully', async () => {
      const result = await client.callTool('search_job_logs_by_name', { 
        jobName: 'Import',
        limit: '3' 
      });
      
      assertValidMCPResponse(result);
      assert.equal(result.isError, true, 'Should be an error response for invalid limit type');
      assert.ok(result.content[0].text.includes('Invalid limit \'3\' for tool. Must be a valid number'), 
        'Should include validation error message');
    });

    test('should handle invalid limit parameter gracefully', async () => {
      const invalidLimits = [-1, 0, 'invalid', null];
      
      for (const limit of invalidLimits) {
        const result = await client.callTool('search_job_logs_by_name', { 
          jobName: 'Import',
          limit 
        });
        
        // Should either succeed with default behavior or return an error
        assertValidMCPResponse(result);
        
        if (!result.isError) {
          // If it succeeds, should use reasonable default behavior
          const jobs = extractJobLogInfo(result.content[0].text);
          assert.ok(jobs.length >= 0, 'Should return non-negative number of jobs');
        }
      }
    });

    test('should handle large limit values', async () => {
      const result = await client.callTool('search_job_logs_by_name', { 
        jobName: 'Import',
        limit: 1000 
      });
      
      assertSuccessResponse(result);
      
      const jobs = extractJobLogInfo(result.content[0].text);
      // Should not return more jobs than actually exist
      assert.ok(jobs.length >= 0, 'Should handle large limit gracefully');
      
      // Verify all jobs still match the search criteria
      for (const job of jobs) {
        assert.ok(job.jobName.toLowerCase().includes('import'),
          `Job name "${job.jobName}" should contain search term`);
      }
    });

    test('should handle whitespace in job name parameter', async () => {
      const whitespaceVariations = [
        ' Import',
        'Import ',
        ' Import ',
        'Import\n',
        '\tImport'
      ];
      
      for (const jobName of whitespaceVariations) {
        const result = await client.callTool('search_job_logs_by_name', { 
          jobName
        });
        
        assertSuccessResponse(result);
        // Should handle whitespace gracefully
        const text = parseResponseText(result.content[0].text);
        assert.ok(text.includes('Found') || text.includes('No job logs found'),
          `Should handle whitespace in job name: "${jobName}"`);
      }
    });
  });

  // Edge cases and error handling
  describe('Edge Cases and Error Handling', () => {
    test('should handle very short search terms', async () => {
      const shortTerms = ['a', 'I', 'J'];
      
      for (const term of shortTerms) {
        const result = await client.callTool('search_job_logs_by_name', { 
          jobName: term
        });
        
        assertSuccessResponse(result);
        // Short terms may return many results or no results
        const text = parseResponseText(result.content[0].text);
        assert.ok(text.includes('Found') || text.includes('No job logs found'),
          `Should handle short search term: "${term}"`);
      }
    });

    test('should handle very long search terms', async () => {
      const longTerm = 'VeryLongJobNameThatProbablyDoesNotExistInTheSystem12345';
      
      const result = await client.callTool('search_job_logs_by_name', { 
        jobName: longTerm
      });
      
      assertSuccessResponse(result);
      assertTextContent(result, 'No job logs found');
    });

    test('should handle numeric job name searches', async () => {
      const numericTerms = ['123', '456', '0987654321'];
      
      for (const term of numericTerms) {
        const result = await client.callTool('search_job_logs_by_name', { 
          jobName: term
        });
        
        assertSuccessResponse(result);
        // May find jobs with numbers in names
        const text = parseResponseText(result.content[0].text);
        assert.ok(text.includes('Found') || text.includes('No job logs found'),
          `Should handle numeric search term: "${term}"`);
      }
    });

    test('should handle concurrent search requests sequentially', async () => {
      // Note: We test sequential execution as per the guidance about avoiding Promise.all
      const searchTerms = ['Import', 'Job', 'Catalog'];
      const results = [];
      
      // Execute sequentially to avoid buffer/message handler conflicts
      for (const term of searchTerms) {
        const result = await client.callTool('search_job_logs_by_name', { 
          jobName: term
        });
        results.push({ term, result });
      }
      
      // Verify all requests completed successfully
      for (const { term, result } of results) {
        assertSuccessResponse(result);
        
        const jobs = extractJobLogInfo(result.content[0].text);
        for (const job of jobs) {
          assert.ok(job.jobName.toLowerCase().includes(term.toLowerCase()),
            `Job "${job.jobName}" should contain search term "${term}"`);
        }
      }
    });
  });

  // Performance and reliability tests (functional focus)
  describe('Performance and Reliability', () => {
    test('should maintain consistent response format across different searches', async () => {
      const searchTerms = discoveredJobNames.length > 0 
        ? discoveredJobNames.slice(0, 2)
        : ['Import', 'Job'];
      
      for (const term of searchTerms) {
        const result = await client.callTool('search_job_logs_by_name', { 
          jobName: term
        });
        
        assertSuccessResponse(result);
        
        const text = parseResponseText(result.content[0].text);
        
        if (text.includes('Found')) {
          // Should have consistent format for found results
          assert.ok(/Found \d+ job logs:/.test(text), 
            'Should have consistent count format');
          assert.ok(/🔧 Job: [A-Za-z]/.test(text) || text.includes('No job logs found'),
            'Should have consistent job entry format');
        } else {
          assert.ok(text === 'No job logs found.' || text === 'No job logs found',
            'Should have exact no results message');
        }
      }
    });

    test('should handle repeated searches reliably', async () => {
      const searchTerm = 'Import';
      const iterations = 3;
      const results = [];
      
      for (let i = 0; i < iterations; i++) {
        const result = await client.callTool('search_job_logs_by_name', { 
          jobName: searchTerm,
          limit: 5
        });
        
        assertSuccessResponse(result);
        results.push(result);
      }
      
      // All results should be consistent
      const firstJobs = extractJobLogInfo(results[0].content[0].text);
      
      for (let i = 1; i < results.length; i++) {
        const currentJobs = extractJobLogInfo(results[i].content[0].text);
        assert.equal(currentJobs.length, firstJobs.length,
          `Iteration ${i} should return same number of jobs`);
        
        // Jobs should be in same order with same content
        for (let j = 0; j < firstJobs.length; j++) {
          assert.equal(currentJobs[j].jobName, firstJobs[j].jobName,
            `Job ${j} name should be consistent across iterations`);
          assert.equal(currentJobs[j].jobId, firstJobs[j].jobId,
            `Job ${j} ID should be consistent across iterations`);
        }
      }
    });
  });
});
