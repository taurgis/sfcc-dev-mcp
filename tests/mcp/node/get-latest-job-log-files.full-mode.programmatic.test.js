import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

describe('get_latest_job_log_files - Full Mode Programmatic Tests (Optimized)', () => {
  let client;
  let discoveredJobLogs = [];

  before(async () => {
    client = await connect('./aegis.config.with-dw.json');
    
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

  // Advanced functionality tests (basic functionality covered by YAML tests)
  describe('Advanced Functionality', () => {
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

  // Advanced parameter validation (basic validation covered by YAML tests)
  describe('Advanced Parameter Validation', () => {
    test('should handle large limit values correctly', async () => {
      const result = await client.callTool('get_latest_job_log_files', { limit: 100 });
      
      assertSuccessResponse(result);
      
      const jobs = extractJobLogInfo(result.content[0].text);
      assert.ok(jobs.length <= 100, 'Should handle large limits');
      
      // Should return all available jobs if limit exceeds available count
      assert.equal(jobs.length, discoveredJobLogs.length, 
        'Should return all available jobs when limit exceeds count');
    });

    test('should handle missing arguments object gracefully', async () => {
      const result = await client.callTool('get_latest_job_log_files');
      
      assertSuccessResponse(result);
      
      const jobs = extractJobLogInfo(result.content[0].text);
      assert.ok(jobs.length <= 10, 'Should use default limit when no arguments provided');
    });

      test('should reject extraneous parameters', async () => {
      const result = await client.callTool('get_latest_job_log_files', {
        limit: 2,
        invalidParam: 'should be ignored',
        anotherParam: 123
      });
      
        assert.equal(result.isError, true, 'Unknown parameters should be rejected');
        assert.ok(result.content[0].text.includes('is not allowed'), 'Error should mention unknown parameters');
    });
  });

  // Content validation tests (require complex programmatic logic)
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

  // Integration tests with other tools (require multi-tool workflows)
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
      
      // Extract unique job name patterns
      const jobPatterns = new Set();
      const jobTypes = new Set();
      
      for (const job of jobs) {
        // Extract job type pattern (e.g., "ImportCatalog" from "ImportCatalogProducts")
        const basePattern = job.jobName.replace(/[0-9]+$/, ''); // Remove trailing numbers
        jobPatterns.add(basePattern);
        
        // Categorize job types
        if (basePattern.includes('Import')) jobTypes.add('Import');
        if (basePattern.includes('Export')) jobTypes.add('Export');
        if (basePattern.includes('Process')) jobTypes.add('Process');
        if (basePattern.includes('Generate')) jobTypes.add('Generate');
        if (basePattern.includes('Update')) jobTypes.add('Update');
      }
      
      console.log(`🔍 Found ${jobPatterns.size} unique job patterns:`, Array.from(jobPatterns));
      console.log(`📊 Found ${jobTypes.size} job categories:`, Array.from(jobTypes));
      
      // Should have some variety in job types for a real SFCC environment
      assert.ok(jobPatterns.size > 0, 'Should have discovered job patterns');
    });
  });

  // Edge cases and resilience testing (require complex validation logic)
  describe('Edge Cases and Resilience', () => {
    test('should handle boundary limit values', async () => {
      const testLimits = [1, 50, 99];
      
      for (const limit of testLimits) {
        const result = await client.callTool('get_latest_job_log_files', { limit });
        
        assertSuccessResponse(result);
        const jobs = extractJobLogInfo(result.content[0].text);
        
        assert.ok(jobs.length <= limit, `Should not exceed limit ${limit}`);
        assert.ok(jobs.length <= discoveredJobLogs.length, 
          'Should not exceed available job count');
        
        console.log(`✅ Boundary test: limit=${limit}, returned=${jobs.length}`);
      }
    });

    test('should maintain response format consistency across different scenarios', async () => {
      const scenarios = [
        { limit: 1, description: 'single job' },
        { limit: 5, description: 'multiple jobs' },
        { limit: 100, description: 'exceed available' }
      ];
      
      for (const scenario of scenarios) {
        const result = await client.callTool('get_latest_job_log_files', { limit: scenario.limit });
        
        assertSuccessResponse(result);
        const jobs = extractJobLogInfo(result.content[0].text);
        
        // Consistent response structure regardless of scenario
        assert.equal(result.content.length, 1, 'Should have single content item');
        assert.equal(result.content[0].type, 'text', 'Content should be text type');
        
        const text = parseResponseText(result.content[0].text);
        assert.ok(text.includes('Found'), 'Should include count message');
        
        if (jobs.length > 0) {
          assert.ok(text.includes('🔧 Job:'), 'Should include job emoji for non-empty results');
        }
        
        console.log(`✅ Format consistency verified for ${scenario.description}: ${jobs.length} jobs`);
      }
    });

    test('should handle rapid sequential requests without interference', async () => {
      const requestCount = 5;

      // Fire multiple requests sequentially to respect MCP single-buffer transport.
      const results = [];
      for (let i = 0; i < requestCount; i++) {
        const result = await client.callTool('get_latest_job_log_files', { limit: 2 });
        results.push(result);
      }

      // All requests should succeed
      for (let i = 0; i < requestCount; i++) {
        assertSuccessResponse(results[i]);
        
        const jobs = extractJobLogInfo(results[i].content[0].text);
        assert.ok(jobs.length <= 2, `Request ${i} should respect limit`);
      }
      
      // Results should be consistent across requests
      const firstJobsCount = extractJobLogInfo(results[0].content[0].text).length;
      for (let i = 1; i < requestCount; i++) {
        const jobsCount = extractJobLogInfo(results[i].content[0].text).length;
        assert.equal(jobsCount, firstJobsCount, 
          'Concurrent requests should return consistent results');
      }
      
      console.log(`✅ Handled ${requestCount} concurrent requests successfully`);
    });

    test('should have consistent content format across different parameters', async () => {
      const testParams = [
        {},
        { limit: 1 },
        { limit: 5 },
        { limit: 10 }
      ];
      
      for (const params of testParams) {
        const result = await client.callTool('get_latest_job_log_files', params);
        
        assertValidMCPResponse(result);
        assert.equal(result.isError, false, 'Should be successful response');
        
        const text = parseResponseText(result.content[0].text);
        
        // Consistent format elements
        assert.ok(/Found \d+ job logs:/.test(text), 'Should have count pattern');
        
        const jobs = extractJobLogInfo(text);
        if (jobs.length > 0) {
          // Each job should have consistent format
          for (const job of jobs) {
            assert.ok(job.jobName && job.jobId && job.fileName, 
              'Job should have required fields');
          }
        }
      }
    });
  });
});