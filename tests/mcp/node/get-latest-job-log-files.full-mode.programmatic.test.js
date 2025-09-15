import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-conductor';

describe('get_latest_job_log_files - Full Mode Programmatic Tests', () => {
  let client;
  let discoveredJobLogs = [];

  before(async () => {
    client = await connect('./conductor.config.with-dw.json');
    
    // Discover available job logs for advanced testing
    await discoverJobLogFiles();
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

  function assertJobLogFormat(result, expectedLimit) {
    assertSuccessResponse(result);
    const text = parseResponseText(result.content[0].text);
    
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
    }
    
    return actualCount;
  }

  function extractJobLogInfo(responseText) {
    const jobs = [];
    const text = parseResponseText(responseText);
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

  async function discoverJobLogFiles() {
    console.log('🔍 Discovering available job log files using MCP server...');
    
    try {
      const result = await client.callTool('get_latest_job_log_files', { limit: 10 });
      if (!result.isError) {
        discoveredJobLogs = extractJobLogInfo(result.content[0].text);
        console.log(`🔧 Found ${discoveredJobLogs.length} job logs:`, 
          discoveredJobLogs.map(j => `${j.jobName}(${j.jobId})`));
      }
    } catch (error) {
      console.warn('⚠️ Could not discover job log files:', error.message);
    }
  }

  // Basic functionality tests
  describe('Basic Functionality', () => {
    test('should retrieve latest job log files with default parameters', async () => {
      const result = await client.callTool('get_latest_job_log_files', {});
      
      // Default limit is 10, but we might have fewer available
      const jobs = extractJobLogInfo(result.content[0].text);
      assert.ok(jobs.length > 0, 'Should return at least one job log');
      assert.ok(jobs.length <= 10, 'Should not return more than default limit');
      
      const actualCount = assertJobLogFormat(result, 10);
      assert.equal(actualCount, jobs.length, 'Actual count should match extracted jobs');
    });

    test('should respect limit parameter', async () => {
      const result = await client.callTool('get_latest_job_log_files', { limit: 1 });
      
      const actualCount = assertJobLogFormat(result, 1);
      
      const jobs = extractJobLogInfo(result.content[0].text);
      assert.equal(jobs.length, actualCount, 'Extracted jobs should match actual count');
      assert.ok(jobs.length <= 1, 'Should not exceed limit of 1');
      
      if (jobs.length > 0) {
        // Validate job structure
        const job = jobs[0];
        assert.ok(job.jobName, 'Job should have name');
        assert.ok(job.jobId, 'Job should have ID');
        assert.ok(job.fileName, 'Job should have file name');
        assert.ok(job.modified, 'Job should have modification time');
        assert.ok(job.size, 'Job should have size');
      }
    });

    test('should handle different limit values', async () => {
      const limits = [1, 2, 5];
      
      for (const limit of limits) {
        const result = await client.callTool('get_latest_job_log_files', { limit });
        
        const actualCount = assertJobLogFormat(result, limit);
        
        const jobs = extractJobLogInfo(result.content[0].text);
        assert.equal(jobs.length, actualCount, `Extracted jobs should match actual count for limit ${limit}`);
        assert.ok(jobs.length <= limit, `Should not exceed limit of ${limit}`);
        
        // Each job should have all required fields
        for (const job of jobs) {
          assert.ok(job.jobName.length > 0, 'Job name should not be empty');
          assert.ok(/^\d+$/.test(job.jobId), 'Job ID should be numeric');
          assert.ok(job.fileName.startsWith('Job-'), 'File name should start with "Job-"');
          assert.ok(job.fileName.endsWith('.log'), 'File name should end with ".log"');
          assert.ok(job.modified.includes('GMT'), 'Modified time should include GMT');
          assert.ok(/[0-9]+\.[0-9]+ [A-Z]B/.test(job.size), 'Size should match expected format');
        }
      }
    });

    test('should return consistent job information across calls', async () => {
      const result1 = await client.callTool('get_latest_job_log_files', { limit: 5 });
      const result2 = await client.callTool('get_latest_job_log_files', { limit: 5 });
      
      assertSuccessResponse(result1);
      assertSuccessResponse(result2);
      
      const jobs1 = extractJobLogInfo(result1.content[0].text);
      const jobs2 = extractJobLogInfo(result2.content[0].text);
      
      // Job logs should be consistent (same files, same metadata)
      assert.equal(jobs1.length, jobs2.length, 'Should return same number of jobs');
      
      for (let i = 0; i < jobs1.length; i++) {
        assert.equal(jobs1[i].jobName, jobs2[i].jobName, 'Job names should be consistent');
        assert.equal(jobs1[i].jobId, jobs2[i].jobId, 'Job IDs should be consistent');
        assert.equal(jobs1[i].fileName, jobs2[i].fileName, 'File names should be consistent');
        assert.equal(jobs1[i].size, jobs2[i].size, 'File sizes should be consistent');
      }
    });
  });

  // Parameter validation tests
  describe('Parameter Validation', () => {
    test('should handle string limit parameter gracefully', async () => {
      const result = await client.callTool('get_latest_job_log_files', { limit: '3' });
      
      const actualCount = assertJobLogFormat(result, 3);
      
      const jobs = extractJobLogInfo(result.content[0].text);
      assert.equal(jobs.length, actualCount, 'Extracted jobs should match actual count');
      assert.ok(jobs.length <= 3, 'Should respect string limit parameter');
    });

    test('should handle large limit values', async () => {
      const result = await client.callTool('get_latest_job_log_files', { limit: 100 });
      
      assertSuccessResponse(result);
      
      const jobs = extractJobLogInfo(result.content[0].text);
      assert.ok(jobs.length <= 100, 'Should handle large limits');
      
      // Should return all available jobs if limit exceeds available count
      assert.equal(jobs.length, discoveredJobLogs.length, 
        'Should return all available jobs when limit exceeds count');
    });

    test('should reject zero limit parameter', async () => {
      const result = await client.callTool('get_latest_job_log_files', { limit: 0 });
      
      assertErrorResponse(result, 'Invalid limit \'0\' for tool');
    });

    test('should reject negative limit parameter', async () => {
      const result = await client.callTool('get_latest_job_log_files', { limit: -1 });
      
      assertErrorResponse(result, 'Invalid limit \'-1\' for tool');
    });

    test('should handle invalid limit parameter type gracefully', async () => {
      const result = await client.callTool('get_latest_job_log_files', { limit: 'invalid' });
      
      // Should handle gracefully (converts to 0 and returns empty result)
      assertSuccessResponse(result);
      assertTextContent(result, 'No job logs found');
    });

    test('should handle missing arguments object gracefully', async () => {
      const result = await client.callTool('get_latest_job_log_files');
      
      assertSuccessResponse(result);
      
      const jobs = extractJobLogInfo(result.content[0].text);
      assert.ok(jobs.length <= 10, 'Should use default limit when no arguments provided');
    });

    test('should handle empty arguments object', async () => {
      const result = await client.callTool('get_latest_job_log_files', {});
      
      assertSuccessResponse(result);
      
      const jobs = extractJobLogInfo(result.content[0].text);
      assert.ok(jobs.length <= 10, 'Should use default limit with empty arguments');
    });

    test('should ignore extraneous parameters', async () => {
      const result = await client.callTool('get_latest_job_log_files', { 
        limit: 2,
        extra: 'ignored',
        date: '20240101' // Should be ignored
      });
      
      assertJobLogFormat(result, 2);
      
      const jobs = extractJobLogInfo(result.content[0].text);
      assert.equal(jobs.length, 2, 'Should only respect limit parameter');
    });
  });

  // Content validation tests
  describe('Content Validation', () => {
    test('should include realistic SFCC job names', async () => {
      const result = await client.callTool('get_latest_job_log_files', { limit: 5 });
      
      assertSuccessResponse(result);
      const jobs = extractJobLogInfo(result.content[0].text);
      
      // Should contain common SFCC job patterns
      const commonJobPatterns = [
        'ImportCatalog',
        'ProcessOrders', 
        'ExportCustomers',
        'UpdateInventory',
        'GenerateReports'
      ];
      
      const foundPatterns = jobs.some(job => 
        commonJobPatterns.some(pattern => job.jobName.includes(pattern))
      );
      
      assert.ok(foundPatterns, 'Should contain common SFCC job name patterns');
    });

    test('should validate job ID format consistency', async () => {
      const result = await client.callTool('get_latest_job_log_files', { limit: 5 });
      
      assertSuccessResponse(result);
      const jobs = extractJobLogInfo(result.content[0].text);
      
      for (const job of jobs) {
        // Job ID should be exactly 10 digits (timestamp-based)
        assert.ok(/^\d{10}$/.test(job.jobId), 
          `Job ID "${job.jobId}" should be 10 digits`);
        
        // File name should include job name and ID
        assert.ok(job.fileName.includes(job.jobName), 
          'File name should include job name');
        assert.ok(job.fileName.includes(job.jobId), 
          'File name should include job ID');
      }
    });

    test('should validate timestamp format consistency', async () => {
      const result = await client.callTool('get_latest_job_log_files', { limit: 3 });
      
      assertSuccessResponse(result);
      const jobs = extractJobLogInfo(result.content[0].text);
      
      for (const job of jobs) {
        // Should be valid HTTP date format
        assert.ok(/^[A-Za-z]{3}, \d{2} [A-Za-z]{3} \d{4} \d{2}:\d{2}:\d{2} GMT$/.test(job.modified),
          `Modified time "${job.modified}" should match HTTP date format`);
        
        // Should parse as valid date
        const date = new Date(job.modified);
        assert.ok(!isNaN(date.getTime()), 'Modified time should be valid date');
        
        // Should be reasonable (not too far in past/future)
        const now = new Date();
        const daysDiff = Math.abs(now - date) / (1000 * 60 * 60 * 24);
        assert.ok(daysDiff < 365, 'Modified time should be within last year');
      }
    });

    test('should validate file size format and reasonableness', async () => {
      const result = await client.callTool('get_latest_job_log_files', { limit: 3 });
      
      assertSuccessResponse(result);
      const jobs = extractJobLogInfo(result.content[0].text);
      
      for (const job of jobs) {
        // Should match format: "X.XX KB" or "X.XX MB"
        assert.ok(/^\d+\.\d{2} [KM]B$/.test(job.size),
          `Size "${job.size}" should match expected format`);
        
        // Parse size and validate reasonableness
        const [value, unit] = job.size.split(' ');
        const sizeValue = parseFloat(value);
        
        assert.ok(sizeValue > 0, 'Size value should be positive');
        assert.ok(sizeValue < 1000, 'Size value should be reasonable');
        assert.ok(['KB', 'MB'].includes(unit), 'Size unit should be KB or MB');
        
        // Job logs should typically be small (under 10MB)
        if (unit === 'MB') {
          assert.ok(sizeValue < 10, 'Job logs should typically be under 10MB');
        }
      }
    });

    test('should maintain chronological ordering', async () => {
      const result = await client.callTool('get_latest_job_log_files', { limit: 5 });
      
      assertSuccessResponse(result);
      const jobs = extractJobLogInfo(result.content[0].text);
      
      if (jobs.length > 1) {
        // Jobs should be ordered by modification time (newest first)
        for (let i = 0; i < jobs.length - 1; i++) {
          const current = new Date(jobs[i].modified);
          const next = new Date(jobs[i + 1].modified);
          
          assert.ok(current >= next, 
            'Jobs should be ordered by modification time (newest first)');
        }
      }
    });
  });

  // Integration tests with other tools
  describe('Integration Tests', () => {
    test('should integrate with get_log_file_contents for job logs', async () => {
      const jobFilesResult = await client.callTool('get_latest_job_log_files', { limit: 1 });
      
      assertSuccessResponse(jobFilesResult);
      const jobs = extractJobLogInfo(jobFilesResult.content[0].text);
      
      if (jobs.length > 0) {
        const job = jobs[0];
        const jobLogPath = `jobs/${job.jobName}/${job.fileName}`;
        
        // Try to read the job log file
        const contentsResult = await client.callTool('get_log_file_contents', {
          filename: jobLogPath
        });
        
        assertSuccessResponse(contentsResult);
        assertTextContent(contentsResult, 'Log File Contents:');
        
        console.log(`✅ Successfully integrated job file discovery with content reading: ${jobLogPath}`);
      }
    });

    test('should validate job log file paths for get_log_file_contents compatibility', async () => {
      const result = await client.callTool('get_latest_job_log_files', { limit: 3 });
      
      assertSuccessResponse(result);
      const jobs = extractJobLogInfo(result.content[0].text);
      
      for (const job of jobs) {
        // Construct expected path format for get_log_file_contents
        const expectedPath = `jobs/${job.jobName}/${job.fileName}`;
        
        // Validate path components
        assert.ok(!expectedPath.includes('//'), 'Path should not have double slashes');
        assert.ok(!expectedPath.includes(' '), 'Path should not contain spaces');
        assert.ok(expectedPath.startsWith('jobs/'), 'Path should start with jobs/');
        assert.ok(expectedPath.endsWith('.log'), 'Path should end with .log');
        
        console.log(`📝 Validated job log path format: ${expectedPath}`);
      }
    });

    test('should discover unique job types and patterns', async () => {
      const result = await client.callTool('get_latest_job_log_files', { limit: 10 });
      
      assertSuccessResponse(result);
      const jobs = extractJobLogInfo(result.content[0].text);
      
      // Analyze job patterns
      const jobTypes = new Set(jobs.map(job => job.jobName));
      const jobIdPatterns = new Set(jobs.map(job => job.jobId.length));
      const fileSizeUnits = new Set(jobs.map(job => job.size.split(' ')[1]));
      
      console.log(`🔍 Analysis Results:
        📊 Unique job types: ${Array.from(jobTypes).join(', ')}
        🆔 Job ID length patterns: ${Array.from(jobIdPatterns).join(', ')} digits
        📏 File size units found: ${Array.from(fileSizeUnits).join(', ')}
        📁 Total jobs discovered: ${jobs.length}`);
      
      // Validate analysis results
      assert.ok(jobTypes.size > 0, 'Should discover at least one job type');
      assert.ok(Array.from(jobIdPatterns).every(len => len === 10), 
        'All job IDs should be 10 digits');
      assert.ok(Array.from(fileSizeUnits).every(unit => ['KB', 'MB'].includes(unit)),
        'All size units should be KB or MB');
    });
  });

  // Edge cases and resilience tests
  describe('Edge Cases and Resilience', () => {
    test('should handle boundary limit values', async () => {
      const boundaryValues = [1, 1000];
      
      for (const limit of boundaryValues) {
        const result = await client.callTool('get_latest_job_log_files', { limit });
        
        if (limit === 1000) {
          // Should handle max limit gracefully
          assertSuccessResponse(result);
          const jobs = extractJobLogInfo(result.content[0].text);
          assert.ok(jobs.length <= 1000, 'Should not exceed max limit');
        } else {
          // Should handle minimum valid limit
          assertJobLogFormat(result, limit);
        }
      }
    });

    test('should maintain response format consistency across different scenarios', async () => {
      const scenarios = [
        { limit: 1, description: 'single job' },
        { limit: 5, description: 'multiple jobs' },
        { limit: 100, description: 'large limit' }
      ];
      
      for (const scenario of scenarios) {
        const result = await client.callTool('get_latest_job_log_files', scenario);
        
        assertSuccessResponse(result);
        const jobs = extractJobLogInfo(result.content[0].text);
        
        // Validate consistent structure across all scenarios
        for (const job of jobs) {
          assert.ok(typeof job.jobName === 'string', 'Job name should be string');
          assert.ok(typeof job.jobId === 'string', 'Job ID should be string');
          assert.ok(typeof job.fileName === 'string', 'File name should be string');
          assert.ok(typeof job.modified === 'string', 'Modified should be string');
          assert.ok(typeof job.size === 'string', 'Size should be string');
        }
        
        console.log(`✅ Validated format consistency for ${scenario.description}: ${jobs.length} jobs`);
      }
    });

    test('should handle rapid sequential requests without interference', async () => {
      const requests = 5;
      const results = [];
      
      // Execute sequential requests (no Promise.all to avoid buffer conflicts)
      for (let i = 0; i < requests; i++) {
        const result = await client.callTool('get_latest_job_log_files', { limit: 2 });
        results.push(result);
      }
      
      // All requests should succeed
      for (let i = 0; i < requests; i++) {
        assertSuccessResponse(results[i]);
        
        const jobs = extractJobLogInfo(results[i].content[0].text);
        assert.ok(jobs.length <= 2, `Request ${i + 1} should respect limit`);
      }
      
      // Results should be consistent across all requests
      const firstJobs = extractJobLogInfo(results[0].content[0].text);
      for (let i = 1; i < requests; i++) {
        const currentJobs = extractJobLogInfo(results[i].content[0].text);
        assert.equal(currentJobs.length, firstJobs.length, 
          `Request ${i + 1} should return same number of jobs`);
        
        // Job data should be identical
        for (let j = 0; j < currentJobs.length; j++) {
          assert.equal(currentJobs[j].jobName, firstJobs[j].jobName,
            `Job ${j + 1} name should be consistent`);
          assert.equal(currentJobs[j].jobId, firstJobs[j].jobId,
            `Job ${j + 1} ID should be consistent`);
        }
      }
      
      console.log(`✅ Successfully executed ${requests} sequential requests with consistent results`);
    });
  });

  // Response structure validation
  describe('Response Structure Validation', () => {
    test('should return proper MCP response structure', async () => {
      const result = await client.callTool('get_latest_job_log_files', { limit: 1 });
      
      // Validate top-level MCP response structure
      assert.ok(Object.prototype.hasOwnProperty.call(result, 'content'), 'Should have content property');
      assert.ok(Object.prototype.hasOwnProperty.call(result, 'isError'), 'Should have isError property');
      assert.equal(typeof result.isError, 'boolean', 'isError should be boolean');
      assert.ok(Array.isArray(result.content), 'Content should be array');
      assert.equal(result.content.length, 1, 'Should have exactly one content item');
      
      // Validate content structure
      const contentItem = result.content[0];
      assert.ok(Object.prototype.hasOwnProperty.call(contentItem, 'type'), 'Content item should have type');
      assert.ok(Object.prototype.hasOwnProperty.call(contentItem, 'text'), 'Content item should have text');
      assert.equal(contentItem.type, 'text', 'Content type should be text');
      assert.equal(typeof contentItem.text, 'string', 'Content text should be string');
    });

    test('should have consistent content format across different parameters', async () => {
      const testCases = [
        { args: {}, expectedPattern: /Found \d+ job logs:/ },
        { args: { limit: 1 }, expectedPattern: /Found 1 job logs:/ },
        { args: { limit: 3 }, expectedPattern: /Found [0-3] job logs:/ }
      ];
      
      for (const testCase of testCases) {
        const result = await client.callTool('get_latest_job_log_files', testCase.args);
        
        assertSuccessResponse(result);
        const text = parseResponseText(result.content[0].text);
        
        assert.ok(testCase.expectedPattern.test(text),
          `Response should match pattern for args: ${JSON.stringify(testCase.args)}`);
      }
    });
  });
});
