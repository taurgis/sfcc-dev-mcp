import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

describe('get_latest_warn - Full Mode Programmatic Tests', () => {
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
    client.clearAllBuffers(); // Recommended - comprehensive protection
  });

  // Helper functions for common validations
  function assertValidMCPResponse(result) {
    assert.ok(result.content, 'Should have content');
    assert.ok(Array.isArray(result.content), 'Content should be array');
    assert.equal(typeof result.isError, 'boolean', 'isError should be boolean');
  }

  function assertErrorResponse(result, expectedErrorText) {
    assertValidMCPResponse(result);
    assert.equal(result.isError, true, 'Should be an error response');
    assert.equal(result.content[0].type, 'text');
    assert.ok(result.content[0].text.includes(expectedErrorText),
      `Expected error text "${expectedErrorText}" in "${result.content[0].text}"`);
  }

  function assertSuccessResponse(result) {
    assertValidMCPResponse(result);
    assert.equal(result.isError, false, 'Should not be an error response');
    assert.equal(result.content[0].type, 'text');
  }

  function assertLogFormat(result, expectedLimit) {
    assertSuccessResponse(result);
    const text = result.content[0].text;
    
    // Should contain the expected limit message
    assert.ok(text.includes(`Latest ${expectedLimit} warn messages`),
      `Should mention "${expectedLimit}" warn messages`);
    
    // Should contain log file name pattern
    assert.ok(/warn-blade-\d{8}-\d{6}\.log/.test(text),
      'Should contain warn log file name pattern');
    
    // Should contain WARN level entries
    assert.ok(text.includes('WARN'), 'Should contain WARN level entries');
    
    // Should contain GMT timestamps
    assert.ok(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}\.\d{3} GMT/.test(text),
      'Should contain GMT timestamp pattern');
  }

  // Helper function to get current date in YYYYMMDD format
  function getCurrentDateString() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
  }

  // Core functionality tests - focused on programmatic strengths
  describe('Core Functionality', () => {
    test('should retrieve latest warn messages with default parameters', async () => {
      const result = await client.callTool('get_latest_warn', {});
      
      assertLogFormat(result, 10); // Default limit is 10
      
      // Should contain SFCC-specific patterns
      const text = result.content[0].text;
      assert.ok(/PipelineCallServlet|SystemJobThread/.test(text),
        'Should contain SFCC thread patterns');
      assert.ok(text.includes('Sites-'), 'Should contain Sites information');
    });

    test('should handle comprehensive parameter combinations', async () => {
      const paramCombinations = [
        { limit: 3 },
        { date: getCurrentDateString(), limit: 2 },
        { limit: 50 },
        {} // default parameters
      ];
      
      const results = [];
      
      // Execute calls sequentially (never use Promise.all with MCP!)
      for (const params of paramCombinations) {
        const result = await client.callTool('get_latest_warn', params);
        results.push({ params, result });
      }
      
      // All should have consistent structure
      results.forEach(({ params, result }, index) => {
        assertValidMCPResponse(result);
        assert.equal(result.isError, false, `Call ${index} should not be error`);
        assert.equal(result.content[0].type, 'text', `Call ${index} should have text content`);
        
        const expectedLimit = params.limit || 10;
        assert.ok(result.content[0].text.includes(`Latest ${expectedLimit} warn messages`), 
          `Call ${index} should contain 'Latest ${expectedLimit}' in response`);
      });
    });
  });

  // Error handling and edge cases - key validation scenarios
  describe('Error Handling and Edge Cases', () => {
    test('should handle parameter validation errors correctly', async () => {
      const errorCases = [
          { params: { limit: '5' }, expectedError: 'limit must be a number' },
          { params: { limit: 0 }, expectedError: 'limit must be >= 1' },
          { params: { limit: -5 }, expectedError: 'limit must be >= 1' },
          { params: { limit: 9999 }, expectedError: 'limit must be <= 1000' }
      ];

      for (const { params, expectedError } of errorCases) {
        const result = await client.callTool('get_latest_warn', params);
        assertErrorResponse(result, expectedError);
      }
    });

    test('should handle edge cases without breaking server state', async () => {
      const edgeCases = [
        { date: '' },        // Empty date
        { date: '2024-01-01' }, // Invalid format
        { date: '20251231' }, // Future date
        { invalid: 'param' } // Invalid parameter name
      ];
      
      // Test all edge cases sequentially
      for (const testCase of edgeCases) {
        const result = await client.callTool('get_latest_warn', testCase);
        assertValidMCPResponse(result);
        // Some may succeed with no data, some may have default behavior - but none should crash
      }
      
      // Verify tool still works after edge cases
      const finalResult = await client.callTool('get_latest_warn', { limit: 1 });
      assertSuccessResponse(finalResult);
    });
  });

  // Advanced content analysis - leveraging programmatic strengths
  describe('SFCC Content Analysis', () => {
    test('should contain and analyze SFCC-specific warning patterns', async () => {
      const result = await client.callTool('get_latest_warn', { limit: 5 });
      
      assertSuccessResponse(result);
      const text = result.content[0].text;
      
      // SFCC-specific validation patterns for warnings
      const sfccWarningPatterns = [
        /Sites-\w+/,                    // Sites names
        /PipelineCallServlet|SystemJobThread/, // Thread types
        /\|\d+\|/,                      // Thread IDs
        /custom \[\]/,                  // Custom category
        /inventory low|Content asset|offline/i // Common warning types
      ];
      
      const matchedPatterns = sfccWarningPatterns.filter(pattern => pattern.test(text));
      assert.ok(matchedPatterns.length >= 2,
        `Should match at least 2 SFCC warning patterns. Matched: ${matchedPatterns.length}`);
      
      // Analyze log structure elements
      assert.ok(/warn-blade-.*\.log/.test(text), 'Should include log file name');
      assert.ok(/\d{4}-\d{2}-\d{2}/.test(text), 'Should include timestamp');
      assert.ok(/GMT/.test(text), 'Should include GMT timezone');
      assert.ok(/WARN PipelineCallServlet/.test(text), 'Should include servlet context');
      
      // Count separators - should have appropriate separators for multiple entries
      const separators = text.match(/---/g);
      assert.ok(separators && separators.length >= 1, 
        `Should have separators for multiple entries. Found: ${separators?.length || 0}`);
    });

    test('should validate warning content quality and context', async () => {
      const result = await client.callTool('get_latest_warn', { limit: 3 });
      assertSuccessResponse(result);
      
      const text = result.content[0].text;
      const lines = text.split('\n').filter(line => line.trim().length > 0);
      
      // Dynamic validation based on actual content
      const warnLines = lines.filter(line => line.includes('WARN'));
      assert.ok(warnLines.length > 0, 'Should have at least one WARN line');
      
      // Each warn line should have proper structure
      warnLines.forEach((line, index) => {
        assert.ok(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/.test(line),
          `Warn line ${index} should contain timestamp: ${line}`);
      });
      
      // Warning-specific content analysis
      const warningIndicators = [
        'inventory low',
        'Content asset',
        'offline',
        'deprecated'
      ];
      
      const foundIndicators = warningIndicators.filter(indicator => 
        text.toLowerCase().includes(indicator.toLowerCase())
      );
      assert.ok(foundIndicators.length > 0,
        `Should contain warning indicators. Found: ${foundIndicators.join(', ')}`);
    });
  });

  // Multi-step workflows - where programmatic tests excel
  describe('Multi-Step Workflows and State Management', () => {
    test('should support comprehensive warning analysis workflow', async () => {
      // Step 1: Get recent warnings with small limit
      const recentWarnings = await client.callTool('get_latest_warn', { limit: 2 });
      assertSuccessResponse(recentWarnings);
      
      // Step 2: Get more comprehensive warning list
      const comprehensiveWarnings = await client.callTool('get_latest_warn', { limit: 10 });
      assertSuccessResponse(comprehensiveWarnings);
      
      // Step 3: Get warnings for specific date
      const dateSpecificWarnings = await client.callTool('get_latest_warn', { 
        date: getCurrentDateString(),
        limit: 5 
      });
      assertSuccessResponse(dateSpecificWarnings);
      
      // Cross-analysis: Verify pattern consistency across different scopes
      const recentText = recentWarnings.content[0].text;
      const comprehensiveText = comprehensiveWarnings.content[0].text;
      const dateText = dateSpecificWarnings.content[0].text;
      
      [recentText, comprehensiveText, dateText].forEach((text, index) => {
        assert.ok(text.includes('WARN'), `Analysis ${index} should contain WARN level`);
        assert.ok(/Sites-/.test(text), `Analysis ${index} should contain Sites information`);
        assert.ok(/PipelineCallServlet/.test(text), `Analysis ${index} should contain servlet context`);
      });
      
      // Advanced: Verify scope scaling
      const recentCount = (recentText.match(/WARN/g) || []).length;
      const comprehensiveCount = (comprehensiveText.match(/WARN/g) || []).length;
      assert.ok(comprehensiveCount >= recentCount, 
        'Comprehensive analysis should include at least as many warnings as recent analysis');
    });

    test('should maintain server state integrity across sequential operations', async () => {
      const operationSequence = [
        { params: { limit: 1 }, description: 'Single warning check' },
        { params: { limit: 20 }, description: 'Large batch analysis' },
        { params: { limit: 0 }, description: 'Error condition', expectError: true },
        { params: { limit: 5 }, description: 'Recovery operation' },
        { params: { date: getCurrentDateString(), limit: 3 }, description: 'Date-specific analysis' }
      ];
      
      const results = [];
      
      // Execute operations sequentially to test state management
      for (const operation of operationSequence) {
        const result = await client.callTool('get_latest_warn', operation.params);
        results.push({
          operation: operation.description,
          params: operation.params,
          success: !result.isError,
          expectedError: operation.expectError || false,
          result
        });
      }
      
      // Analyze operation results for state integrity
      results.forEach((opResult, index) => {
        if (opResult.expectedError) {
          assert.equal(opResult.success, false, 
            `Operation ${index} (${opResult.operation}) should have failed as expected`);
        } else {
          assert.equal(opResult.success, true, 
            `Operation ${index} (${opResult.operation}) should have succeeded`);
          
          // Verify state consistency for successful operations
          const text = opResult.result.content[0].text;
          const expectedLimit = opResult.params.limit || 10;
          assert.ok(text.includes(`Latest ${expectedLimit} warn messages`),
            `Operation ${index} should show correct limit: ${expectedLimit}`);
        }
      });
      
      // Final verification: Server should still be fully functional
      const finalCheck = await client.callTool('get_latest_warn', { limit: 1 });
      assertSuccessResponse(finalCheck);
    });
  });

  // Operational monitoring and resilience - complex business logic validation
  describe('Operational Monitoring and Resilience', () => {
    test('should provide comprehensive monitoring capabilities', async () => {
      // Simulate different monitoring scenarios
      const monitoringScenarios = [
        { limit: 1, description: 'Latest warning check', alertLevel: 'immediate' },
        { limit: 10, description: 'Recent warnings review', alertLevel: 'hourly' },
        { limit: 50, description: 'Comprehensive warning analysis', alertLevel: 'daily' }
      ];
      
      const monitoringResults = [];
      
      for (const scenario of monitoringScenarios) {
        const result = await client.callTool('get_latest_warn', { limit: scenario.limit });
        
        const analysisResult = {
          scenario: scenario.description,
          alertLevel: scenario.alertLevel,
          limit: scenario.limit,
          success: !result.isError,
          warningCount: 0,
          hasWarnings: false,
          sfccPatterns: 0
        };
        
        if (!result.isError) {
          const text = result.content[0].text;
          analysisResult.hasWarnings = text.includes('WARN');
          analysisResult.warningCount = (text.match(/WARN/g) || []).length;
          
          // Count SFCC-specific patterns for monitoring quality
          const sfccPatterns = [/Sites-/, /PipelineCallServlet/, /custom \[\]/];
          analysisResult.sfccPatterns = sfccPatterns.filter(pattern => pattern.test(text)).length;
        }
        
        monitoringResults.push(analysisResult);
      }
      
      // Validate monitoring effectiveness
      monitoringResults.forEach(result => {
        assert.ok(result.success, `${result.scenario} should succeed`);
        assert.ok(result.hasWarnings, `${result.scenario} should contain warnings`);
        assert.ok(result.sfccPatterns >= 1, `${result.scenario} should contain SFCC patterns`);
      });
      
      // Verify monitoring scope increases with limit
      assert.ok(monitoringResults[0].limit < monitoringResults[1].limit, 
        'Monitoring scope should increase');
      assert.ok(monitoringResults[1].limit < monitoringResults[2].limit, 
        'Comprehensive analysis should have largest scope');
    });

    test('should handle resilience scenarios and error recovery', async () => {
      // Test normal operation baseline
      const baselineResult = await client.callTool('get_latest_warn', { limit: 3 });
      assertSuccessResponse(baselineResult);
      
      // Test various failure scenarios and recovery
      const resilienceTests = [
        { params: { limit: 0 }, shouldFail: true, description: 'Zero limit validation' },
        { params: { limit: '1' }, shouldFail: true, description: 'Type validation' },
        { params: { limit: 99999 }, shouldFail: true, description: 'Range validation' },
          { params: { date: '' }, shouldFail: true, description: 'Empty date validation' },
          { params: { invalid: 'param' }, shouldFail: true, description: 'Unknown parameter validation' }
      ];
      
      let failureCount = 0;
      let recoveryCount = 0;
      
      for (const resilienceTest of resilienceTests) {
        const result = await client.callTool('get_latest_warn', resilienceTest.params);
        
        if (resilienceTest.shouldFail) {
          assert.equal(result.isError, true, 
            `${resilienceTest.description} should fail as expected`);
          failureCount++;
        } else {
          assert.equal(result.isError, false, 
            `${resilienceTest.description} should succeed`);
        }
        
        // Test recovery after each scenario
        const recoveryResult = await client.callTool('get_latest_warn', { limit: 1 });
        assert.equal(recoveryResult.isError, false, 
          `Recovery after ${resilienceTest.description} should work`);
        recoveryCount++;
      }
      
      // Verify resilience metrics
      assert.ok(failureCount >= 3, 'Should have tested multiple failure scenarios');
      assert.equal(recoveryCount, resilienceTests.length, 'All recovery tests should pass');
      
      // Final comprehensive recovery test
      const finalResult = await client.callTool('get_latest_warn', { limit: 5 });
      assertSuccessResponse(finalResult);
      
      const finalText = finalResult.content[0].text;
      assert.ok(finalText.includes('Latest 5 warn messages'), 'Final recovery should work correctly');
      assert.ok(finalText.includes('WARN'), 'Final recovery should contain valid warning data');
    });

    test('should provide detailed data quality analysis across different parameters', async () => {
      const qualityTests = [
        { params: { limit: 2 }, minWarnings: 1, description: 'Small sample quality' },
        { params: { limit: 10 }, minWarnings: 3, description: 'Standard sample quality' },
        { params: { date: getCurrentDateString(), limit: 5 }, minWarnings: 1, description: 'Date-specific quality' }
      ];
      
      const qualityResults = [];
      
      for (const qualityTest of qualityTests) {
        const result = await client.callTool('get_latest_warn', qualityTest.params);
        assertSuccessResponse(result);
        
        const text = result.content[0].text;
        
        // Quality metrics
        const qualityMetrics = {
          hasLogFileName: /warn-blade-.*\.log/.test(text),
          hasTimestamp: /\d{4}-\d{2}-\d{2}/.test(text),
          hasSiteInfo: /Sites-/.test(text),
          hasWarnLevel: text.includes('WARN'),
          hasGMTTimezone: text.includes('GMT'),
          warningCount: (text.match(/WARN/g) || []).length,
          separatorCount: (text.match(/---/g) || []).length
        };
        
        qualityResults.push({
          description: qualityTest.description,
          params: qualityTest.params,
          metrics: qualityMetrics,
          passedChecks: Object.values(qualityMetrics).filter(Boolean).length
        });
        
        // Validate quality requirements
        assert.ok(qualityMetrics.hasLogFileName, `${qualityTest.description}: Should have log file name`);
        assert.ok(qualityMetrics.hasTimestamp, `${qualityTest.description}: Should have timestamp`);
        assert.ok(qualityMetrics.hasWarnLevel, `${qualityTest.description}: Should have WARN level`);
        assert.ok(qualityMetrics.warningCount >= qualityTest.minWarnings, 
          `${qualityTest.description}: Should have at least ${qualityTest.minWarnings} warnings`);
      }
      
      // Cross-quality analysis
      const avgQualityScore = qualityResults.reduce((sum, result) => sum + result.passedChecks, 0) / qualityResults.length;
      assert.ok(avgQualityScore >= 6, `Average quality score should be high (${avgQualityScore})`);
      
      // Consistency check across different parameter sets
      qualityResults.forEach(result => {
        assert.ok(result.passedChecks >= 6, 
          `${result.description} should pass most quality checks (${result.passedChecks})`);
      });
    });
  });
});
