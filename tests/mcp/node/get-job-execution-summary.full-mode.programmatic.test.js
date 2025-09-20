import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

describe('get_job_execution_summary - Full Mode Programmatic Tests', () => {
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

  function assertJobExecutionSummaryFormat(result, jobName) {
    assertSuccessResponse(result);
    const text = parseResponseText(result.content[0].text);
    
    if (text.includes('No job logs found')) {
      // Valid case - no matching job
      assert.ok(text.includes(`No job logs found for job name: ${jobName}`),
        'No results message should include job name');
      return null;
    }
    
    // Should contain job execution summary header
    assert.ok(text.includes(`Job Execution Summary: ${jobName}`),
      'Should contain job execution summary header with job name');
    
    // Should contain timing section
    assert.ok(text.includes('⏱️ Timing:'),
      'Should contain timing section with emoji');
    
    // Should contain timing details
    assert.ok(text.includes('Start:') && text.includes('End:') && text.includes('Duration:'),
      'Should contain start, end, and duration information');
    
    // Should contain status section  
    assert.ok(text.includes('📊 Status:'),
      'Should contain status section with emoji');
    
    // Should contain status details
    assert.ok(text.includes('Status:') && text.includes('Errors:') && text.includes('Warnings:'),
      'Should contain status, errors, and warnings information');
    
    return parseJobExecutionSummary(text);
  }

  function parseJobExecutionSummary(text) {
    const summary = {
      jobName: null,
      timing: {
        start: null,
        end: null,
        duration: null
      },
      status: {
        status: null,
        errors: null,
        warnings: null
      }
    };
    
    // Extract job name from "Job Execution Summary: JobName" line
    const jobNameMatch = text.match(/Job Execution Summary: ([^\n\r]+)/);
    if (jobNameMatch) summary.jobName = jobNameMatch[1].trim();
    
    // Extract timing information
    const startMatch = text.match(/- Start: ([^\n\r]+)/);
    if (startMatch) summary.timing.start = startMatch[1].trim();
    
    const endMatch = text.match(/- End: ([^\n\r]+)/);
    if (endMatch) summary.timing.end = endMatch[1].trim();
    
    const durationMatch = text.match(/- Duration: ([^\n\r]+)/);
    if (durationMatch) summary.timing.duration = durationMatch[1].trim();
    
    // Extract status information
    const statusMatch = text.match(/- Status: ([^\n\r]+)/);
    if (statusMatch) summary.status.status = statusMatch[1].trim();
    
    const errorsMatch = text.match(/- Errors: ([^\n\r]+)/);
    if (errorsMatch) summary.status.errors = errorsMatch[1].trim();
    
    const warningsMatch = text.match(/- Warnings: ([^\n\r]+)/);
    if (warningsMatch) summary.status.warnings = warningsMatch[1].trim();
    
    return summary;
  }

  async function discoverJobNames() {
    console.log('🔍 Discovering available job names using MCP server...');
    
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
      // Use fallback job names for testing
      discoveredJobNames = ['ImportCatalog', 'ProcessOrders'];
    }
  }

  function extractJobInfo(responseText) {
    const jobs = [];
    const text = parseResponseText(responseText);
    const sections = text.split('🔧 Job: ').slice(1); // Remove empty first element
    
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

  // Basic functionality tests
  describe('Core Functionality', () => {
    test('should retrieve job execution summary for existing job', async () => {
      if (discoveredJobNames.length === 0) {
        console.log('⏭️ Skipping test - no job names discovered');
        return;
      }
      
      const jobName = discoveredJobNames[0];
      const result = await client.callTool('get_job_execution_summary', { jobName });
      
      assertJobExecutionSummaryFormat(result, jobName);
    });

    test('should handle non-existent job gracefully', async () => {
      const result = await client.callTool('get_job_execution_summary', { 
        jobName: 'NonExistentJob12345' 
      });
      
      assertSuccessResponse(result);
      assertTextContent(result, 'No job logs found for job name: NonExistentJob12345');
    });

    test('should include all required sections in execution summary', async () => {
      if (discoveredJobNames.length === 0) {
        console.log('⏭️ Skipping test - no job names discovered');
        return;
      }
      
      const jobName = discoveredJobNames[0];
      const result = await client.callTool('get_job_execution_summary', { jobName });
      
      const summary = assertJobExecutionSummaryFormat(result, jobName);
      
      if (summary) {
        // Validate all required fields are present
        assert.ok(summary.jobName, 'Should have job name');
        assert.ok(summary.timing.start !== null, 'Should have start time');
        assert.ok(summary.timing.end !== null, 'Should have end time');
        assert.ok(summary.timing.duration !== null, 'Should have duration');
        assert.ok(summary.status.status !== null, 'Should have status');
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
        // Validate timing format - should be ISO-like date format
        assert.ok(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(summary.timing.start),
          'Start time should be in YYYY-MM-DD HH:MM:SS format');
        assert.ok(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(summary.timing.end),
          'End time should be in YYYY-MM-DD HH:MM:SS format');
        assert.ok(/\d+s/.test(summary.timing.duration),
          'Duration should be in seconds format');
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
        // Validate status format
        assert.ok(typeof summary.status.status === 'string',
          'Status should be a string');
        assert.ok(/\d+/.test(summary.status.errors),
          'Errors should be numeric');
        assert.ok(/\d+/.test(summary.status.warnings),
          'Warnings should be numeric');
      }
    });
  });

  // Parameter validation tests
  describe('Parameter Validation', () => {
    test('should return error for missing jobName parameter', async () => {
      const result = await client.callTool('get_job_execution_summary', {});
      
      assertErrorResponse(result, 'jobName must be a non-empty string');
    });

    test('should return error for empty jobName parameter', async () => {
      const result = await client.callTool('get_job_execution_summary', { 
        jobName: '' 
      });
      
      assertErrorResponse(result, 'jobName must be a non-empty string');
    });

    test('should return error for null jobName parameter', async () => {
      const result = await client.callTool('get_job_execution_summary', { 
        jobName: null 
      });
      
      assertErrorResponse(result, 'jobName must be a non-empty string');
    });

    test('should return error for undefined jobName parameter', async () => {
      const result = await client.callTool('get_job_execution_summary', { 
        jobName: undefined 
      });
      
      assertErrorResponse(result, 'jobName must be a non-empty string');
    });

    test('should return error for non-string jobName parameter', async () => {
      const result = await client.callTool('get_job_execution_summary', { 
        jobName: 123 
      });
      
      assertErrorResponse(result, 'jobName must be a non-empty string');
    });

    test('should return error for boolean jobName parameter', async () => {
      const result = await client.callTool('get_job_execution_summary', { 
        jobName: true 
      });
      
      assertErrorResponse(result, 'jobName must be a non-empty string');
    });

    test('should return error for object jobName parameter', async () => {
      const result = await client.callTool('get_job_execution_summary', { 
        jobName: { name: 'test' } 
      });
      
      assertErrorResponse(result, 'jobName must be a non-empty string');
    });

    test('should return error for array jobName parameter', async () => {
      const result = await client.callTool('get_job_execution_summary', { 
        jobName: ['test'] 
      });
      
      assertErrorResponse(result, 'jobName must be a non-empty string');
    });
  });

  // Edge case testing
  describe('Edge Cases', () => {
    test('should handle job names with special characters', async () => {
      const specialJobName = 'Job-With-Dashes_And_Underscores.123';
      const result = await client.callTool('get_job_execution_summary', { 
        jobName: specialJobName 
      });
      
      assertSuccessResponse(result);
      assertTextContent(result, `No job logs found for job name: ${specialJobName}`);
    });

    test('should handle job names with spaces', async () => {
      const jobNameWithSpaces = 'Job With Spaces';
      const result = await client.callTool('get_job_execution_summary', { 
        jobName: jobNameWithSpaces 
      });
      
      assertSuccessResponse(result);
      assertTextContent(result, `No job logs found for job name: ${jobNameWithSpaces}`);
    });

    test('should handle very long job names', async () => {
      const longJobName = 'VeryLongJobNameThatMightCauseIssuesWithSomeSystemsBecauseItExceedsTypicalLimits'.repeat(2);
      const result = await client.callTool('get_job_execution_summary', { 
        jobName: longJobName 
      });
      
      assertSuccessResponse(result);
      assertTextContent(result, 'No job logs found for job name:');
    });

    test('should handle job names with Unicode characters', async () => {
      const unicodeJobName = 'Job_测试_🔧_Тест';
      const result = await client.callTool('get_job_execution_summary', { 
        jobName: unicodeJobName 
      });
      
      assertSuccessResponse(result);
      assertTextContent(result, `No job logs found for job name: ${unicodeJobName}`);
    });

    test('should handle job names with only whitespace', async () => {
      const result = await client.callTool('get_job_execution_summary', { 
        jobName: '   ' 
      });
      
      assertErrorResponse(result, 'jobName must be a non-empty string');
    });

    test('should handle job names with newlines and tabs', async () => {
      const result = await client.callTool('get_job_execution_summary', { 
        jobName: 'Job\nWith\tSpecial\rChars' 
      });
      
      assertSuccessResponse(result);
      assertTextContent(result, 'No job logs found for job name:');
    });
  });

  // Multi-job testing
  describe('Multi-Job Testing', () => {
    test('should handle multiple different job names sequentially', async () => {
      const testJobNames = [
        'ImportCatalog',
        'ProcessOrders', 
        'SyncInventory',
        'NonExistentJob'
      ];
      
      const results = [];
      
      // Process sequentially to avoid buffer conflicts
      for (const jobName of testJobNames) {
        const result = await client.callTool('get_job_execution_summary', { jobName });
        results.push({ jobName, result });
      }
      
      // Validate all results
      results.forEach(({ jobName, result }) => {
        assertSuccessResponse(result);
        const text = parseResponseText(result.content[0].text);
        
        if (text.includes('Job Execution Summary:')) {
          // Found job execution summary
          assert.ok(text.includes(`Job Execution Summary: ${jobName}`));
        } else {
          // No job found
          assert.ok(text.includes(`No job logs found for job name: ${jobName}`));
        }
      });
    });

    test('should handle discovered job names with execution summaries', async () => {
      if (discoveredJobNames.length === 0) {
        console.log('⏭️ Skipping test - no job names discovered');
        return;
      }
      
      const results = [];
      
      // Test all discovered job names sequentially
      for (const jobName of discoveredJobNames) {
        const result = await client.callTool('get_job_execution_summary', { jobName });
        results.push({ jobName, result });
      }
      
      // All should succeed (either with summary or "not found" message)
      results.forEach(({ jobName, result }) => {
        assertSuccessResponse(result);
        const text = parseResponseText(result.content[0].text);
        
        // Should either contain execution summary or not found message
        assert.ok(
          text.includes(`Job Execution Summary: ${jobName}`) || 
          text.includes(`No job logs found for job name: ${jobName}`),
          `Response should reference job name ${jobName}`
        );
      });
    });

    test('should maintain consistent response format across different jobs', async () => {
      if (discoveredJobNames.length < 2) {
        console.log('⏭️ Skipping test - need at least 2 job names');
        return;
      }
      
      const results = [];
      
      // Test first two discovered jobs
      for (let i = 0; i < Math.min(2, discoveredJobNames.length); i++) {
        const jobName = discoveredJobNames[i];
        const result = await client.callTool('get_job_execution_summary', { jobName });
        results.push({ jobName, result });
      }
      
      // All should have consistent structure
      results.forEach(({ result }) => {
        assertValidMCPResponse(result);
        assert.equal(result.content.length, 1, 'Should have exactly one content element');
        assert.equal(result.content[0].type, 'text', 'Content should be text type');
        assert.equal(result.isError, false, 'Should not be error');
      });
    });
  });

  // Response structure validation
  describe('Response Structure Validation', () => {
    test('should return proper MCP response structure', async () => {
      const result = await client.callTool('get_job_execution_summary', { 
        jobName: 'TestJob' 
      });
      
      assertValidMCPResponse(result);
      
      // Check specific structure requirements
      assert.equal(result.content.length, 1, 'Should have exactly one content element');
      assert.equal(result.content[0].type, 'text', 'Content type should be text');
      assert.ok(typeof result.content[0].text === 'string', 'Text should be string');
      assert.ok(result.content[0].text.length > 0, 'Text should not be empty');
    });

    test('should maintain consistent response structure for errors', async () => {
      const result = await client.callTool('get_job_execution_summary', {});
      
      assertValidMCPResponse(result);
      assert.equal(result.isError, true, 'Should be error response');
      assert.equal(result.content.length, 1, 'Should have exactly one content element');
      assert.equal(result.content[0].type, 'text', 'Content type should be text');
      assert.ok(result.content[0].text.includes('Error:'), 'Error text should contain Error:');
    });

    test('should handle malformed parameter objects gracefully', async () => {
      // Test with extra unexpected parameters
      const result = await client.callTool('get_job_execution_summary', { 
        jobName: 'TestJob',
        unexpectedParam: 'should be ignored',
        anotherParam: 123
      });
      
      assertSuccessResponse(result);
      assertTextContent(result, 'No job logs found for job name: TestJob');
    });
  });

  // Functional consistency testing
  describe('Functional Consistency', () => {
    test('should produce consistent results for same job name', async () => {
      const jobName = 'ConsistencyTestJob';
      
      // Call the same job multiple times
      const results = [];
      for (let i = 0; i < 3; i++) {
        const result = await client.callTool('get_job_execution_summary', { jobName });
        results.push(result);
      }
      
      // All results should be identical
      const firstResponse = parseResponseText(results[0].content[0].text);
      results.forEach((result, index) => {
        assertSuccessResponse(result);
        const responseText = parseResponseText(result.content[0].text);
        assert.equal(responseText, firstResponse, 
          `Response ${index} should match first response`);
      });
    });

    test('should handle rapid sequential calls without interference', async () => {
      const jobNames = ['Rapid1', 'Rapid2', 'Rapid3', 'Rapid4', 'Rapid5'];
      const results = [];
      
      // Make rapid sequential calls
      for (const jobName of jobNames) {
        const result = await client.callTool('get_job_execution_summary', { jobName });
        results.push({ jobName, result });
      }
      
      // Validate each result corresponds to correct job name
      results.forEach(({ jobName, result }) => {
        assertSuccessResponse(result);
        const text = parseResponseText(result.content[0].text);
        assert.ok(text.includes(jobName), 
          `Response should reference correct job name ${jobName}`);
      });
    });

    test('should maintain functionality after error conditions', async () => {
      // First, cause an error
      const errorResult = await client.callTool('get_job_execution_summary', {});
      assertErrorResponse(errorResult);
      
      // Then test normal functionality still works
      const normalResult = await client.callTool('get_job_execution_summary', { 
        jobName: 'RecoveryTestJob' 
      });
      assertSuccessResponse(normalResult);
      assertTextContent(normalResult, 'No job logs found for job name: RecoveryTestJob');
    });
  });

  // Integration testing with discovered jobs
  describe('Integration Testing', () => {
    test('should integrate with discovered job ecosystem', async () => {
      if (discoveredJobNames.length === 0) {
        console.log('⏭️ Skipping integration test - no jobs discovered');
        return;
      }
      
      console.log(`🧪 Testing integration with ${discoveredJobNames.length} discovered jobs`);
      
      const summaryResults = [];
      
      // Get execution summaries for all discovered jobs
      for (const jobName of discoveredJobNames) {
        const result = await client.callTool('get_job_execution_summary', { jobName });
        summaryResults.push({ jobName, result });
      }
      
      // Analyze the results
      let jobsWithSummaries = 0;
      let jobsNotFound = 0;
      
      summaryResults.forEach(({ jobName, result }) => {
        assertSuccessResponse(result);
        const text = parseResponseText(result.content[0].text);
        
        if (text.includes('Job Execution Summary:')) {
          jobsWithSummaries++;
          console.log(`📊 ${jobName}: Has execution summary`);
        } else {
          jobsNotFound++;
          console.log(`❌ ${jobName}: No execution summary found`);
        }
      });
      
      console.log(`📈 Integration summary: ${jobsWithSummaries} with summaries, ${jobsNotFound} not found`);
      
      // All should have valid responses
      assert.equal(summaryResults.length, discoveredJobNames.length,
        'Should have results for all discovered jobs');
    });

    test('should validate execution summary data integrity', async () => {
      if (discoveredJobNames.length === 0) {
        console.log('⏭️ Skipping data integrity test - no jobs discovered');
        return;
      }
      
      // Find a job that has execution summary data
      let jobWithSummary = null;
      
      for (const jobName of discoveredJobNames) {
        const result = await client.callTool('get_job_execution_summary', { jobName });
        const text = parseResponseText(result.content[0].text);
        
        if (text.includes('Job Execution Summary:')) {
          jobWithSummary = { jobName, result, responseText: text };
          break;
        }
      }
      
      if (!jobWithSummary) {
        console.log('⏭️ Skipping data integrity test - no jobs with summaries found');
        return;
      }
      
      const summary = parseJobExecutionSummary(jobWithSummary.responseText);
      
      // Validate data integrity
      assert.equal(summary.jobName, jobWithSummary.jobName,
        'Summary job name should match requested job name');
      
      // Validate timing consistency (start should be before or equal to end)
      if (summary.timing.start && summary.timing.end) {
        const startTime = new Date(summary.timing.start.replace(' ', 'T') + 'Z');
        const endTime = new Date(summary.timing.end.replace(' ', 'T') + 'Z');
        
        assert.ok(startTime <= endTime, 
          'Start time should be before or equal to end time');
      }
      
      // Validate numeric values
      const errors = parseInt(summary.status.errors);
      const warnings = parseInt(summary.status.warnings);
      
      assert.ok(!isNaN(errors) && errors >= 0, 
        'Error count should be non-negative number');
      assert.ok(!isNaN(warnings) && warnings >= 0, 
        'Warning count should be non-negative number');
      
      console.log(`✅ Data integrity validated for job: ${jobWithSummary.jobName}`);
    });
  });
});
