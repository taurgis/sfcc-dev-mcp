import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

describe('get_job_execution_summary - Advanced Programmatic Tests', () => {
  let client;
  let discoveredJobNames = [];

  before(async () => {
    client = await connect('./aegis.config.with-dw.json');
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

  // Optimized helper functions focused on complex validation
  function assertValidMCPResponse(result) {
    assert.ok(result.content, 'Should have content');
    assert.ok(Array.isArray(result.content), 'Content should be array');
    assert.equal(typeof result.isError, 'boolean', 'isError should be boolean');
  }

  function parseResponseText(text) {
    return text.startsWith('"') && text.endsWith('"') 
      ? JSON.parse(text) 
      : text;
  }

  function assertJobExecutionSummaryFormat(result, jobName) {
    assertValidMCPResponse(result);
    assert.equal(result.isError, false, 'Should not be an error response');
    
    const text = parseResponseText(result.content[0].text);
    
    if (text.includes('No job logs found')) {
      assert.ok(text.includes(`No job logs found for job name: ${jobName}`),
        'No results message should include job name');
      return null;
    }
    
    // Validate comprehensive execution summary format
    assert.ok(text.includes(`Job Execution Summary: ${jobName}`),
      'Should contain job execution summary header with job name');
    assert.ok(text.includes('⏱️ Timing:') && text.includes('📊 Status:'),
      'Should contain emoji-formatted sections');
    assert.ok(text.includes('Start:') && text.includes('End:') && text.includes('Duration:'),
      'Should contain complete timing information');
    assert.ok(text.includes('Status:') && text.includes('Errors:') && text.includes('Warnings:'),
      'Should contain complete status information');
    
    return parseJobExecutionSummary(text);
  }

  function parseJobExecutionSummary(text) {
    const summary = {
      jobName: null,
      timing: { start: null, end: null, duration: null },
      status: { status: null, errors: null, warnings: null }
    };
    
    // Extract structured data from response
    const jobNameMatch = text.match(/Job Execution Summary: ([^\n\r]+)/);
    if (jobNameMatch) summary.jobName = jobNameMatch[1].trim();
    
    const startMatch = text.match(/- Start: ([^\n\r]+)/);
    if (startMatch) summary.timing.start = startMatch[1].trim();
    
    const endMatch = text.match(/- End: ([^\n\r]+)/);
    if (endMatch) summary.timing.end = endMatch[1].trim();
    
    const durationMatch = text.match(/- Duration: ([^\n\r]+)/);
    if (durationMatch) summary.timing.duration = durationMatch[1].trim();
    
    const statusMatch = text.match(/- Status: ([^\n\r]+)/);
    if (statusMatch) summary.status.status = statusMatch[1].trim();
    
    const errorsMatch = text.match(/- Errors: ([^\n\r]+)/);
    if (errorsMatch) summary.status.errors = errorsMatch[1].trim();
    
    const warningsMatch = text.match(/- Warnings: ([^\n\r]+)/);
    if (warningsMatch) summary.status.warnings = warningsMatch[1].trim();
    
    return summary;
  }

  function assertSuccessResponse(result) {
    assertValidMCPResponse(result);
    assert.equal(result.isError, false, 'Response should not be error');
  }

  function assertErrorResponse(result, expectedErrorText = null) {
    assertValidMCPResponse(result);
    assert.equal(result.isError, true, 'Response should be error');
    
    if (expectedErrorText) {
      const responseText = parseResponseText(result.content[0].text);
      assert.ok(responseText.includes(expectedErrorText), 
        `Error message should contain: ${expectedErrorText}`);
    }
  }

  function assertTextContent(result, expectedText) {
    assertSuccessResponse(result);
    const responseText = parseResponseText(result.content[0].text);
    assert.ok(responseText.includes(expectedText), 
      `Response should contain: ${expectedText}`);
  }

  async function discoverJobNames() {
    console.log('🔍 Discovering available job names for advanced testing...');
    
    try {
      const result = await client.callTool('get_latest_job_log_files', { limit: 10 });
      if (!result.isError) {
        const text = parseResponseText(result.content[0].text);
        const jobs = extractJobInfo(text);
        discoveredJobNames = jobs.map(job => job.jobName);
        console.log(`🔧 Found ${discoveredJobNames.length} jobs:`, discoveredJobNames);
      }
    } catch (error) {
      console.warn('⚠️ Could not discover job names:', error.message);
      discoveredJobNames = ['ImportCatalog', 'ProcessOrders'];
    }
  }

  function extractJobInfo(responseText) {
    const jobs = [];
    const text = parseResponseText(responseText);
    const sections = text.split('🔧 Job: ').slice(1);
    
    for (const section of sections) {
      const lines = section.split('\n');
      const jobName = lines[0].trim();
      
      let jobId = null;
      for (const line of lines) {
        const idMatch = line.match(/ID: (\d+)/);
        if (idMatch) jobId = idMatch[1];
      }
      
      if (jobName && jobId) {
        jobs.push({ jobName, jobId });
      }
    }
    
    return jobs;
  }

  // Core functionality tests - focus on complex parsing and validation
  describe('Core Functionality & Format Validation', () => {
    test('should retrieve and parse job execution summary structure', async () => {
      if (discoveredJobNames.length === 0) {
        console.log('⏭️ Skipping test - no job names discovered');
        return;
      }
      
      const jobName = discoveredJobNames[0];
      const result = await client.callTool('get_job_execution_summary', { jobName });
      
      const summary = assertJobExecutionSummaryFormat(result, jobName);
      
      if (summary) {
        // Validate parsed structure for existing jobs
        assert.equal(summary.jobName, jobName, 'Parsed job name should match requested');
        assert.ok(summary.timing.start, 'Should have start time');
        assert.ok(summary.timing.end, 'Should have end time');
        assert.ok(summary.timing.duration !== null, 'Should have duration');
        assert.ok(summary.status.status, 'Should have status');
        assert.ok(summary.status.errors !== null, 'Should have error count');
        assert.ok(summary.status.warnings !== null, 'Should have warning count');
      }
    });

    test('should validate timing format in execution summary', async () => {
      if (discoveredJobNames.length === 0) {
        console.log('⏭️ Skipping test - no job names discovered');
        return;
      }
      
      const jobName = discoveredJobNames[0];
      const result = await client.callTool('get_job_execution_summary', { jobName });
      
      const summary = assertJobExecutionSummaryFormat(result, jobName);
      
      if (summary) {
        // Validate datetime format (YYYY-MM-DD HH:MM:SS)
        assert.ok(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(summary.timing.start),
          `Start time should match datetime format: ${summary.timing.start}`);
        assert.ok(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(summary.timing.end),
          `End time should match datetime format: ${summary.timing.end}`);
        assert.ok(/\d+s/.test(summary.timing.duration),
          `Duration should be in seconds format: ${summary.timing.duration}`);
      }
    });

    test('should validate status information format', async () => {
      if (discoveredJobNames.length === 0) {
        console.log('⏭️ Skipping test - no job names discovered');
        return;
      }
      
      const jobName = discoveredJobNames[0];
      const result = await client.callTool('get_job_execution_summary', { jobName });
      
      const summary = assertJobExecutionSummaryFormat(result, jobName);
      
      if (summary) {
        // Status should be a string
        assert.ok(typeof summary.status.status === 'string', 'Status should be string');
        
        // Errors and warnings should be numeric strings
        assert.ok(/\d+/.test(summary.status.errors),
          `Errors should be numeric: ${summary.status.errors}`);
        assert.ok(/\d+/.test(summary.status.warnings),
          `Warnings should be numeric: ${summary.status.warnings}`);
      }
    });

    test('should handle non-existent job gracefully with proper messaging', async () => {
      const result = await client.callTool('get_job_execution_summary', { 
        jobName: 'NonExistentJob12345' 
      });
      
      assertValidMCPResponse(result);
      assert.equal(result.isError, false, 'Should not be an error response for non-existent job');
      assertTextContent(result, 'No job logs found for job name: NonExistentJob12345');
    });
  });

  // Streamlined parameter validation - focus on key error cases
  describe('Parameter Validation', () => {
    test('should return error for missing jobName parameter', async () => {
      const result = await client.callTool('get_job_execution_summary', {});
      assertErrorResponse(result, 'jobName');
    });

    test('should return error for empty jobName parameter', async () => {
      const result = await client.callTool('get_job_execution_summary', { jobName: '' });
      assertErrorResponse(result, 'jobName');
    });

    test('should return error for null jobName parameter', async () => {
      const result = await client.callTool('get_job_execution_summary', { jobName: null });
      assertErrorResponse(result, 'jobName');
    });

    test('should return error for non-string jobName parameter', async () => {
      const result = await client.callTool('get_job_execution_summary', { jobName: 123 });
      assertErrorResponse(result, 'jobName');
    });

    test('should return error for whitespace-only jobName', async () => {
      const result = await client.callTool('get_job_execution_summary', { jobName: '   ' });
      assertErrorResponse(result, 'jobName');
    });
  });

  // Focus on meaningful edge cases that test real-world scenarios
  describe('Edge Cases & Real-World Scenarios', () => {
    test('should handle job names with special characters', async () => {
      const specialJobName = 'Job-With-Dashes_And_Underscores.123';
      const result = await client.callTool('get_job_execution_summary', { 
        jobName: specialJobName 
      });
      
      assertValidMCPResponse(result);
      assert.equal(result.isError, false);
      assertTextContent(result, `No job logs found for job name: ${specialJobName}`);
    });

    test('should handle job names with Unicode characters', async () => {
      const unicodeJobName = 'Job_测试_🔧_Тест';
      const result = await client.callTool('get_job_execution_summary', { 
        jobName: unicodeJobName 
      });
      
      assertValidMCPResponse(result);
      assert.equal(result.isError, false);
      assertTextContent(result, `No job logs found for job name: ${unicodeJobName}`);
    });

    test('should handle very long job names', async () => {
      const longJobName = 'VeryLongJobNameThatMightCauseIssuesWithSomeSystemsBecauseItExceedsTypicalLimits'.repeat(2);
      const result = await client.callTool('get_job_execution_summary', { 
        jobName: longJobName 
      });
      
      assertValidMCPResponse(result);
      assert.equal(result.isError, false);
      assertTextContent(result, 'No job logs found for job name:');
    });
  });

  // Advanced multi-job testing with discovered jobs
  describe('Multi-Job Integration Testing', () => {
    test('should handle discovered job names with execution summaries', async () => {
      if (discoveredJobNames.length === 0) {
        console.log('⏭️ Skipping test - no job names discovered');
        return;
      }

      const results = [];
      
      // Test up to 3 discovered jobs sequentially (avoid concurrent requests)
      const jobsToTest = discoveredJobNames.slice(0, 3);
      
      for (const jobName of jobsToTest) {
        const result = await client.callTool('get_job_execution_summary', { jobName });
        results.push({ jobName, result });
        
        // Each result should be valid
        assertValidMCPResponse(result);
        assert.equal(result.isError, false, `Job ${jobName} should not error`);
        
        const summary = assertJobExecutionSummaryFormat(result, jobName);
        if (summary) {
          assert.equal(summary.jobName, jobName, 'Parsed job name should match');
        }
      }
      
      assert.ok(results.length > 0, 'Should have tested at least one job');
      console.log(`✅ Successfully tested ${results.length} discovered jobs`);
    });

    test('should maintain consistent response format across different jobs', async () => {
      if (discoveredJobNames.length < 2) {
        console.log('⏭️ Skipping test - need at least 2 discovered jobs');
        return;
      }
      
      const results = [];
      
      // Test first 2 jobs for consistency
      for (const jobName of discoveredJobNames.slice(0, 2)) {
        const result = await client.callTool('get_job_execution_summary', { jobName });
        results.push(result);
        
        assertValidMCPResponse(result);
        assert.equal(result.content.length, 1, 'Should have exactly one content item');
        assert.equal(result.content[0].type, 'text', 'Content should be text type');
      }
      
      // All results should have consistent structure
      results.forEach((result, index) => {
        assert.equal(typeof result.isError, 'boolean', `Result ${index} isError should be boolean`);
        assert.ok(Array.isArray(result.content), `Result ${index} content should be array`);
      });
    });
  });

  // Integration with job log ecosystem
  describe('Integration with Job Log Ecosystem', () => {
    test('should integrate with discovered job ecosystem effectively', async () => {
      if (discoveredJobNames.length === 0) {
        console.log('⏭️ Skipping test - no job names discovered');
        return;
      }
      
      // Get job log files to validate integration
      const logFilesResult = await client.callTool('get_latest_job_log_files', { limit: 5 });
      assertValidMCPResponse(logFilesResult);
      assert.equal(logFilesResult.isError, false, 'Should get job log files successfully');
      
      // Parse available jobs
      const logText = parseResponseText(logFilesResult.content[0].text);
      const availableJobs = extractJobInfo(logText);
      
      assert.ok(availableJobs.length > 0, 'Should find available jobs from log files');
      
      // Test execution summary for first available job
      const firstJob = availableJobs[0];
      const summaryResult = await client.callTool('get_job_execution_summary', { 
        jobName: firstJob.jobName 
      });
      
      assertValidMCPResponse(summaryResult);
      
      // Should either get a summary or a "no logs found" message
      const summaryText = parseResponseText(summaryResult.content[0].text);
      const hasValidResponse = summaryText.includes('Job Execution Summary:') || 
                              summaryText.includes('No job logs found');
      
      assert.ok(hasValidResponse, 'Should get either execution summary or no logs message');
      
      console.log(`✅ Successfully integrated with job ecosystem (${availableJobs.length} jobs available)`);
    });

    test('should validate execution summary data integrity', async () => {
      if (discoveredJobNames.length === 0) {
        console.log('⏭️ Skipping test - no job names discovered');
        return;
      }
      
      const jobName = discoveredJobNames[0];
      const result = await client.callTool('get_job_execution_summary', { jobName });
      
      const summary = assertJobExecutionSummaryFormat(result, jobName);
      
      if (summary) {
        // Validate data integrity
        assert.ok(summary.jobName.length > 0, 'Job name should not be empty');
        
        // Parse numeric values for validation
        const errorCount = parseInt(summary.status.errors, 10);
        const warningCount = parseInt(summary.status.warnings, 10);
        
        assert.ok(!isNaN(errorCount), 'Error count should be numeric');
        assert.ok(!isNaN(warningCount), 'Warning count should be numeric');
        assert.ok(errorCount >= 0, 'Error count should be non-negative');
        assert.ok(warningCount >= 0, 'Warning count should be non-negative');
        
        // Validate duration format and logic
        const durationMatch = summary.timing.duration.match(/(\d+)s/);
        if (durationMatch) {
          const durationSeconds = parseInt(durationMatch[1], 10);
          assert.ok(durationSeconds >= 0, 'Duration should be non-negative');
        }
        
        console.log(`✅ Data integrity validated for job ${jobName}`);
      }
    });
  });
});
