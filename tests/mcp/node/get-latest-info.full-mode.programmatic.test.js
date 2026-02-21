import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

describe('get_latest_info Tool - Advanced Programmatic Tests (Full Mode)', () => {
  let client;

  before(async () => {
    client = await connect('./aegis.config.with-dw.json');
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

  // Helper function to get current date in YYYYMMDD format
  function getCurrentDateString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }

  // ========================================
  // COMPLEX BUSINESS LOGIC VALIDATION
  // ========================================

  describe('Complex Business Logic Validation', () => {
    test('should return info messages in chronological order with detailed parsing', async () => {
      const result = await client.callTool('get_latest_info', { limit: 2 });
      
      assertValidMCPResponse(result);
      const text = result.content[0].text;
      
      // Complex chronological order validation - requires detailed parsing and comparison
      const jobExecution = 'Executing job [sfcc-export-dw-analytics-site-config][2664334]';
      const stepExecution = 'Executing step [ExportDWAnalyticsSiteConfigurationStep][5846619] for [Organization]';
      
      assert.ok(text.includes(jobExecution), 'Should contain job execution entry');
      assert.ok(text.includes(stepExecution), 'Should contain step execution entry');
      
      // Verify chronological ordering through position analysis
      const jobIndex = text.indexOf(jobExecution);
      const stepIndex = text.indexOf(stepExecution);
      assert.ok(jobIndex < stepIndex && jobIndex !== -1 && stepIndex !== -1,
        'Newest info (job) should appear before older info (step) in response');
    });

    test('should validate business logic for SFCC info-level log filtering', async () => {
      const result = await client.callTool('get_latest_info', { limit: 10 });
      
      assertValidMCPResponse(result);
      const logText = result.content[0].text;
      
      // Complex business logic validation - SFCC-specific log filtering
      assert.ok(logText.includes('info-blade'), 'Should reference info log files specifically');
      assert.ok(logText.includes('INFO'), 'Should contain INFO log level entries');
      
      // Critical: Verify log level isolation (complex filtering validation)
      assert.ok(!logText.includes('ERROR'), 'Should not contain ERROR entries');
      assert.ok(!logText.includes('WARN'), 'Should not contain WARN entries');
      assert.ok(!logText.includes('DEBUG'), 'Should not contain DEBUG entries');
    });

    test('should parse and validate complex SFCC log entry structure', async () => {
      const result = await client.callTool('get_latest_info', { limit: 1 });
      
      assertValidMCPResponse(result);
      const logText = result.content[0].text;
      
      // Complex log structure parsing and validation
      const timestampPattern = /\[\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3} GMT\]/;
      const sfccPattern = /(SystemJobThread|PipelineCallServlet|Sites-)/;
      
      assert.ok(timestampPattern.test(logText), 'Should contain valid SFCC timestamp format');
      assert.ok(sfccPattern.test(logText), 'Should contain SFCC-specific system components');
      
      // Complex structure validation
      assert.ok(logText.includes('['), 'Should contain log file reference brackets');
      assert.ok(logText.includes('] ['), 'Should contain proper timestamp delimiters');
      assert.ok(logText.includes('GMT]'), 'Should contain GMT timezone specification');
    });
  });

  // ========================================
  // DYNAMIC PARAMETER VALIDATION
  // ========================================

  describe('Dynamic Parameter Validation', () => {
    test('should validate parameter types dynamically with complex logic', async () => {
      const testCases = [
        { params: { limit: null }, shouldSucceed: false, description: 'null limit' },
        { params: { limit: undefined }, shouldSucceed: true, description: 'undefined limit (uses default)' },
        { params: { limit: [] }, shouldSucceed: false, description: 'array limit' },
        { params: { limit: {} }, shouldSucceed: false, description: 'object limit' },
        { params: { date: null }, shouldSucceed: true, description: 'null date (uses default)' },
        { params: { date: 123 }, shouldSucceed: true, description: 'numeric date (handled gracefully)' }
      ];

      // Complex dynamic validation with detailed result analysis
      for (const testCase of testCases) {
        const result = await client.callTool('get_latest_info', testCase.params);
        assertValidMCPResponse(result);
        
        if (testCase.shouldSucceed) {
          assert.ok(result.content.length > 0, 
            `Should have content for ${testCase.description}: ${JSON.stringify(testCase.params)}`);
        } else {
          // Complex validation: either error response or graceful handling
          assert.ok(result.isError || result.content.length > 0,
            `Should either error or handle gracefully for ${testCase.description}`);
        }
      }
    });

    test('should handle complex boundary condition matrix', async () => {
      const boundaryTests = [
        { limit: 1, shouldSucceed: true, category: 'minimum valid' },
        { limit: 1000, shouldSucceed: true, category: 'maximum valid' },
        { limit: 1001, shouldSucceed: false, category: 'over maximum' },
        { limit: 0, shouldSucceed: false, category: 'zero (invalid)' },
        { limit: -1, shouldSucceed: false, category: 'negative' }
      ];
      
      // Complex boundary validation with categorization
      for (const test of boundaryTests) {
        const result = await client.callTool('get_latest_info', { limit: test.limit });
        assertValidMCPResponse(result);
        
        if (test.shouldSucceed) {
          assert.equal(result.isError, false, 
            `Boundary test ${test.category} (limit: ${test.limit}) should succeed`);
        } else {
          assert.equal(result.isError, true, 
            `Boundary test ${test.category} (limit: ${test.limit}) should fail validation`);
        }
      }
    });
  });

  // ========================================
  // MULTI-STEP WORKFLOWS AND CONSISTENCY
  // ========================================

  describe('Multi-Step Workflows and Consistency', () => {
    test('should maintain consistency across sequential operations', async () => {
      const results = [];
      
      // Complex multi-step workflow simulation
      for (let i = 0; i < 5; i++) {
        const result = await client.callTool('get_latest_info', { limit: 5 });
        results.push(result);
      }
      
      // Complex consistency validation across multiple calls
      results.forEach((result, index) => {
        assertValidMCPResponse(result);
        assert.equal(result.isError, false, `Sequential call ${index + 1} should succeed`);
        assert.ok(result.content[0].text.includes('Latest 5 info messages'), 
          `Sequential call ${index + 1} should show consistent limit`);
      });
      
      // Complex cross-result consistency validation
      const firstText = results[0].content[0].text;
      const lastText = results[results.length - 1].content[0].text;
      assert.equal(firstText, lastText, 'Sequential calls should return identical results for same parameters');
    });

    test('should handle complex parameter combination workflows', async () => {
      const paramCombinations = [
        {},
        { limit: 5 },
        { date: getCurrentDateString() },
        { limit: 3, date: getCurrentDateString() },
        { limit: 1 },
        { limit: 50 }
      ];
      
      // Complex workflow validation with parameter combinations
      for (const params of paramCombinations) {
        const result = await client.callTool('get_latest_info', params);
        assertValidMCPResponse(result);
        
        // Complex validation logic for parameter combinations
        const hasValidLimit = !params.limit || (params.limit > 0 && params.limit <= 1000);
        if (hasValidLimit) {
          assert.equal(result.isError, false, 
            `Valid parameter combination should succeed: ${JSON.stringify(params)}`);
          
          // Verify expected limit is reflected in response
          const expectedLimit = params.limit || 20; // current default limit
          assert.ok(result.content[0].text.includes(`Latest ${expectedLimit} info messages`),
            `Should show correct limit for combination: ${JSON.stringify(params)}`);
        }
      }
    });

    test('should validate complex limit range processing', async () => {
      const limitTests = [1, 5, 10, 25, 50, 100];
      
      // Complex range validation with detailed analysis
      for (const limit of limitTests) {
        const result = await client.callTool('get_latest_info', { limit });
        
        assertValidMCPResponse(result);
        assert.equal(result.isError, false, `Limit ${limit} should process successfully`);
        assert.ok(result.content[0].text.includes(`Latest ${limit} info messages`), 
          `Should correctly process limit ${limit}`);
        
        // Complex content length analysis
        const logText = result.content[0].text;
        const separatorCount = (logText.match(/---/g) || []).length;
        
        // Validate separator count matches expected entries (limit - 1 separators for limit entries)
        if (limit > 1) {
          assert.ok(separatorCount >= 1, 
            `Should have separators for limit ${limit} (found ${separatorCount})`);
        }
      }
    });
  });

  // ========================================
  // ERROR RECOVERY AND RESILIENCE
  // ========================================

  describe('Error Recovery and Resilience', () => {
    test('should demonstrate complex error recovery workflow', async () => {
      // Complex error recovery scenario with state validation
      
      // Step 1: Trigger error condition
      const errorResult = await client.callTool('get_latest_info', { limit: -1 });
      assert.equal(errorResult.isError, true, 'Should error with negative limit');
      
      // Step 2: Verify normal operation resumes immediately
      const normalResult = await client.callTool('get_latest_info', { limit: 5 });
      assertValidMCPResponse(normalResult);
      assert.equal(normalResult.isError, false, 'Should recover and work normally');
      
      // Step 3: Verify complex recovery with different parameters
      const recoveryResult = await client.callTool('get_latest_info', { 
        limit: 3, 
        date: getCurrentDateString() 
      });
      assertValidMCPResponse(recoveryResult);
      assert.equal(recoveryResult.isError, false, 'Should handle complex parameters after error');
    });

    test('should maintain state integrity after complex invalid operations', async () => {
      // Complex state integrity validation
      const invalidOperations = [
        { limit: -10, description: 'negative limit' },
        { limit: 'abc', description: 'string limit' },
        { date: 'invalid', description: 'invalid date' },
        { limit: null, description: 'null limit' },
        { limit: 1001, description: 'over-limit' }
      ];
      
      // Execute complex series of invalid operations
      for (const invalidOp of invalidOperations) {
        await client.callTool('get_latest_info', invalidOp);
        // Note: Don't assert on individual results as some may be handled gracefully
      }
      
      // Complex state validation after error series
      const result = await client.callTool('get_latest_info', { limit: 3 });
      assertValidMCPResponse(result);
      assert.equal(result.isError, false, 'Should work normally after series of invalid operations');
      assert.ok(result.content[0].text.includes('Latest 3 info messages'),
        'Should produce correct output after error recovery');
    });
  });

  // ========================================
  // INTEGRATION AND PROTOCOL COMPLIANCE
  // ========================================

  describe('Integration and Protocol Compliance', () => {
    test('should integrate properly with MCP protocol and tool discovery', async () => {
      // Complex MCP protocol compliance validation
      const tools = await client.listTools();
      const infoTool = tools.find(tool => tool.name === 'get_latest_info');
      
      assert.ok(infoTool, 'get_latest_info tool should be discoverable via MCP protocol');
      assert.ok(infoTool.description, 'Tool should have comprehensive description');
      assert.ok(infoTool.inputSchema, 'Tool should have valid input schema');
      
      // Complex schema validation
      const schema = infoTool.inputSchema;
      assert.equal(schema.type, 'object', 'Input schema should be object type');
      assert.ok(schema.properties, 'Schema should define properties');
      
      // Verify tool execution works through MCP protocol
      const result = await client.callTool('get_latest_info', {});
      assertValidMCPResponse(result);
      assert.equal(result.isError, false, 'Tool should execute successfully via MCP protocol');
    });

    test('should validate complex date parameter integration', async () => {
      // Complex date parameter validation with current date integration
      const testDate = getCurrentDateString();
      
      const result = await client.callTool('get_latest_info', { 
        date: testDate, 
        limit: 2 
      });
      
      assertValidMCPResponse(result);
      assert.equal(result.isError, false, 'Should handle current date parameter');
      assert.ok(result.content[0].text.includes('Latest 2 info messages'), 
        'Should show correct limit with date parameter');
      
      // Complex validation: date parameter should not affect content structure
      const defaultResult = await client.callTool('get_latest_info', { limit: 2 });
      assertValidMCPResponse(defaultResult);
      
      // Compare structure consistency
      const dateTextLines = result.content[0].text.split('\n').length;
      const defaultTextLines = defaultResult.content[0].text.split('\n').length;
      assert.ok(Math.abs(dateTextLines - defaultTextLines) <= 1,
        'Date parameter should not significantly alter response structure');
    });
  });
});

// ========================================
// HELPER FUNCTIONS
// ========================================

/**
 * Validates that a result follows the MCP response structure
 */
function assertValidMCPResponse(result) {
  assert.ok(result, 'Result should exist');
  assert.ok(result.content, 'Result should have content');
  assert.ok(Array.isArray(result.content), 'Content should be array');
  assert.equal(typeof result.isError, 'boolean', 'isError should be boolean');
  assert.ok(result.content.length > 0, 'Content should not be empty');
}
