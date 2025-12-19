// ==================================================================================
// SFCC MCP Server - activate_code_version Advanced Programmatic Tests (Full Mode)
// Comprehensive testing for complex scenarios, workflows, and edge cases
// 
// Test Coverage:
// - Multi-step code version management workflows
// - Error recovery and resilience testing  
// - Integration with get_code_versions tool
// - Advanced parameter validation and edge cases
// - State consistency and transaction-like behavior
// - Performance characteristics under various loads
// - Complex business logic validation
//
// Usage:
// node --test tests/mcp/node/activate-code-version-advanced.full-mode.programmatic.test.js
// npm run test:mcp:node
// ==================================================================================

import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

describe('activate_code_version Advanced Programmatic Tests (Full Mode)', () => {
  let client;

  before(async () => {
    client = await connect('./aegis.config.with-dw.json');
    assert.ok(client.connected, 'Client should be connected to server');
  });

  after(async () => {
    if (client?.connected) {
      await client.disconnect();
    }
  });

  beforeEach(() => {
    // CRITICAL: Clear all buffers to prevent test interference
    client.clearAllBuffers();
  });

  // ==================================================================================
  // TOOL AVAILABILITY AND SCHEMA VALIDATION
  // ==================================================================================
  describe('Tool Availability and Schema Validation', () => {
    test('should have activate_code_version tool available in full mode', async () => {
      const tools = await client.listTools();
      const activateTool = tools.find(tool => tool.name === 'activate_code_version');
      
      assert.ok(activateTool, 'activate_code_version tool should be available');
      assert.equal(activateTool.name, 'activate_code_version');
      assert.ok(activateTool.description.includes('Activate a code version'));
      
      // Validate input schema
      assert.equal(activateTool.inputSchema.type, 'object');
      assert.ok(activateTool.inputSchema.properties.codeVersionId);
      assert.equal(activateTool.inputSchema.properties.codeVersionId.type, 'string');
      assert.ok(Array.isArray(activateTool.inputSchema.required));
      assert.ok(activateTool.inputSchema.required.includes('codeVersionId'));
    });

    test('should have companion get_code_versions tool for workflow integration', async () => {
      const tools = await client.listTools();
      const getCodeVersionsTool = tools.find(tool => tool.name === 'get_code_versions');
      
      assert.ok(getCodeVersionsTool, 'get_code_versions tool should be available for workflow integration');
      assert.equal(getCodeVersionsTool.inputSchema.type, 'object');
    });
  });

  // ==================================================================================
  // COMPREHENSIVE PARAMETER VALIDATION
  // ==================================================================================
  describe('Comprehensive Parameter Validation', () => {
    test('should validate codeVersionId parameter types and formats', async () => {
      // Test missing parameter
      const missingResult = await client.callTool('activate_code_version', {});
      assert.equal(missingResult.isError, true);
      assert.ok(missingResult.content[0].text.includes('codeVersionId must be a non-empty string'));

      // Test empty string
      const emptyResult = await client.callTool('activate_code_version', { codeVersionId: '' });
      assert.equal(emptyResult.isError, true);
      assert.ok(emptyResult.content[0].text.includes('codeVersionId must be a non-empty string'));

      // Test null value
      const nullResult = await client.callTool('activate_code_version', { codeVersionId: null });
      assert.equal(nullResult.isError, true);
      assert.ok(nullResult.content[0].text.includes('codeVersionId must be a non-empty string'));

      // Test undefined value
      const undefinedResult = await client.callTool('activate_code_version', { codeVersionId: undefined });
      assert.equal(undefinedResult.isError, true);
      assert.ok(undefinedResult.content[0].text.includes('codeVersionId must be a non-empty string'));
    });

    test('should handle various invalid codeVersionId formats gracefully', async () => {
      const invalidFormats = [
        123,                    // number
        true,                   // boolean
        [],                     // array
        {},                     // object
        '   ',                  // whitespace only
        '\n\t',                 // whitespace characters
      ];

      for (const invalidFormat of invalidFormats) {
        const result = await client.callTool('activate_code_version', { codeVersionId: invalidFormat });
        assert.equal(result.isError, true, `Should reject ${typeof invalidFormat}: ${JSON.stringify(invalidFormat)}`);
        assert.ok(result.content[0].text.includes('codeVersionId must be a non-empty string'));
      }
    });

    test('should handle edge case codeVersionId values', async () => {
      const edgeCases = [
        'a'.repeat(1000),                    // Very long ID
        'test-version-with-special-chars!@#$%^&*()', // Special characters
        'version with spaces',                // Spaces
        'UPPERCASE-VERSION',                  // Case variations
        'version_nonexistent_test',          // Non-existent version
        'version.with.dots',                 // Dots
        '123-numeric-start',                 // Starting with numbers
        'unicode-测试-version',               // Unicode characters
      ];

      for (const edgeCase of edgeCases) {
        const result = await client.callTool('activate_code_version', { codeVersionId: edgeCase });
        assert.equal(result.isError, true, `Should handle edge case: ${edgeCase}`);
        
        // Should get 404 or similar SFCC error, not parameter validation error
        assert.ok(
          result.content[0].text.includes('404') || 
          result.content[0].text.includes('not found') ||
          result.content[0].text.includes('InvalidParameterException'),
          `Should get SFCC API error for edge case: ${edgeCase}, got: ${result.content[0].text}`
        );
      }
    });
  });

  // ==================================================================================
  // SFCC API ERROR HANDLING AND RESPONSE PARSING
  // ==================================================================================
  describe('SFCC API Error Handling and Response Parsing', () => {
    test('should parse and format SFCC API errors correctly', async () => {
      const result = await client.callTool('activate_code_version', { 
        codeVersionId: 'nonexistent-test-version-12345' 
      });
      
      assert.equal(result.isError, true);
      assert.equal(result.content.length, 1);
      assert.equal(result.content[0].type, 'text');
      
      const errorText = result.content[0].text;
      assert.ok(errorText.startsWith('Error:'), 'Error should start with Error:');
      
      // Should contain SFCC fault information
      assert.ok(
        errorText.includes('404') || 
        errorText.includes('not found') ||
        errorText.includes('InvalidParameterException'),
        `Should contain SFCC fault info, got: ${errorText}`
      );
    });

    test('should handle different types of SFCC API errors consistently', async () => {
      const testVersions = [
        'definitely-nonexistent-version',
        'another-invalid-version-name',
        'test-error-scenario-version'
      ];

      const errorResponses = [];
      
      for (const versionId of testVersions) {
        const result = await client.callTool('activate_code_version', { codeVersionId: versionId });
        assert.equal(result.isError, true);
        errorResponses.push(result.content[0].text);
      }

      // All errors should follow similar format
      errorResponses.forEach(errorText => {
        assert.ok(errorText.startsWith('Error:'), 'All errors should start with Error:');
        assert.ok(errorText.length > 20, 'Error messages should be reasonably detailed');
      });
    });

    test('should handle malformed SFCC API responses gracefully', async () => {
      // Test with version ID that might cause unusual API responses
      const result = await client.callTool('activate_code_version', { 
        codeVersionId: 'test-malformed-response-handling' 
      });
      
      assert.equal(result.isError, true);
      assert.ok(result.content, 'Should always return content array');
      assert.ok(result.content[0].text, 'Should always return text content');
      assert.equal(typeof result.content[0].text, 'string', 'Error text should be string');
    });
  });

  // ==================================================================================
  // INTEGRATION WITH GET_CODE_VERSIONS WORKFLOW
  // ==================================================================================
  describe('Integration with get_code_versions Workflow', () => {
    test('should integrate with get_code_versions for complete workflow', async () => {
      // Step 1: Get list of available code versions
      const versionsResult = await client.callTool('get_code_versions', {});
      assert.equal(versionsResult.isError, false, 'get_code_versions should succeed');
      
      // Parse the response to understand available versions
      const versionsText = versionsResult.content[0].text;
      assert.ok(versionsText.length > 0, 'Should return version information');
      
      // Step 2: Try to activate a clearly non-existent version
      const activateResult = await client.callTool('activate_code_version', { 
        codeVersionId: 'workflow-test-nonexistent-version' 
      });
      assert.equal(activateResult.isError, true, 'Should fail for non-existent version');
      
      // Step 3: Verify error handling doesn't affect subsequent get_code_versions calls
      const versionsResult2 = await client.callTool('get_code_versions', {});
      assert.equal(versionsResult2.isError, false, 'get_code_versions should still work after failed activation');
    });

    test('should maintain consistent state across multiple tool calls', async () => {
      const operations = [
        { tool: 'get_code_versions', args: {} },
        { tool: 'activate_code_version', args: { codeVersionId: 'test-state-consistency-1' } },
        { tool: 'get_code_versions', args: {} },
        { tool: 'activate_code_version', args: { codeVersionId: 'test-state-consistency-2' } },
        { tool: 'get_code_versions', args: {} },
      ];

      const results = [];
      
      for (const operation of operations) {
        const result = await client.callTool(operation.tool, operation.args);
        results.push({ operation, result });
        
        // Each operation should return proper response structure
        assert.ok(result.content, `${operation.tool} should return content`);
        assert.ok(Array.isArray(result.content), `${operation.tool} content should be array`);
        assert.equal(typeof result.isError, 'boolean', `${operation.tool} should have isError boolean`);
      }

      // Verify get_code_versions calls succeeded while activate calls failed (expected for non-existent versions)
      const getVersionsResults = results.filter(r => r.operation.tool === 'get_code_versions');
      const activateResults = results.filter(r => r.operation.tool === 'activate_code_version');
      
      getVersionsResults.forEach((r, index) => {
        assert.equal(r.result.isError, false, `get_code_versions call ${index + 1} should succeed`);
      });
      
      activateResults.forEach((r, index) => {
        assert.equal(r.result.isError, true, `activate_code_version call ${index + 1} should fail for non-existent version`);
      });
    });
  });

  // ==================================================================================
  // ERROR RECOVERY AND RESILIENCE TESTING
  // ==================================================================================
  describe('Error Recovery and Resilience Testing', () => {
    test('should recover gracefully from various error scenarios', async () => {
      const errorScenarios = [
        { description: 'Empty codeVersionId', args: { codeVersionId: '' } },
        { description: 'Very long codeVersionId', args: { codeVersionId: 'x'.repeat(500) } },
        { description: 'Special characters', args: { codeVersionId: '!@#$%^&*()_+{}|:"<>?[]\\;\',./' } },
        { description: 'Unicode characters', args: { codeVersionId: '测试版本号码' } },
        { description: 'SQL injection attempt', args: { codeVersionId: "'; DROP TABLE versions; --" } },
      ];

      for (const scenario of errorScenarios) {
        const result = await client.callTool('activate_code_version', scenario.args);
        
        // Should handle all scenarios gracefully without throwing
        assert.equal(result.isError, true, `${scenario.description} should return error`);
        assert.ok(result.content, `${scenario.description} should return content`);
        assert.ok(result.content[0].text, `${scenario.description} should return error text`);
        
        // Verify server is still responsive after error
        const recoveryTest = await client.listTools();
        assert.ok(recoveryTest.length > 0, `Server should be responsive after ${scenario.description}`);
      }
    });

    test('should handle rapid sequential activation attempts', async () => {
      const rapidRequests = Array.from({ length: 10 }, (_, i) => ({
        codeVersionId: `rapid-test-version-${i}`
      }));

      const results = [];
      
      // Execute requests sequentially (MCP doesn't support concurrent requests)
      for (const request of rapidRequests) {
        const result = await client.callTool('activate_code_version', request);
        results.push(result);
      }

      // All requests should be handled properly
      results.forEach((result, index) => {
        assert.equal(result.isError, true, `Rapid request ${index} should fail for non-existent version`);
        assert.ok(result.content[0].text.length > 0, `Rapid request ${index} should have error message`);
      });

      // Server should still be responsive
      const finalTest = await client.listTools();
      assert.ok(finalTest.length > 0, 'Server should be responsive after rapid requests');
    });

    test('should maintain error isolation between requests', async () => {
      // Generate error
      const errorResult = await client.callTool('activate_code_version', { codeVersionId: '' });
      assert.equal(errorResult.isError, true);
      
      // Verify normal operation still works
      const normalResult = await client.callTool('get_code_versions', {});
      assert.equal(normalResult.isError, false, 'Normal operations should work after errors');
      
      // Generate different error
      const errorResult2 = await client.callTool('activate_code_version', { codeVersionId: 'another-error-test' });
      assert.equal(errorResult2.isError, true);
      
      // Verify isolation - errors should be different
      assert.notEqual(errorResult.content[0].text, errorResult2.content[0].text, 'Different errors should produce different messages');
    });
  });

  // ==================================================================================
  // RESPONSE FORMAT AND STRUCTURE VALIDATION
  // ==================================================================================
  describe('Response Format and Structure Validation', () => {
    test('should return consistent response structure across all scenarios', async () => {
      const testScenarios = [
        { name: 'missing parameter', args: {} },
        { name: 'empty parameter', args: { codeVersionId: '' } },
        { name: 'valid format nonexistent version', args: { codeVersionId: 'test-structure-validation' } },
        { name: 'special characters', args: { codeVersionId: 'test!@#$' } },
      ];

      for (const scenario of testScenarios) {
        const result = await client.callTool('activate_code_version', scenario.args);
        
        // Validate MCP response structure
        assert.ok('content' in result, `${scenario.name}: Should have content property`);
        assert.ok('isError' in result, `${scenario.name}: Should have isError property`);
        assert.ok(Array.isArray(result.content), `${scenario.name}: Content should be array`);
        assert.equal(typeof result.isError, 'boolean', `${scenario.name}: isError should be boolean`);
        
        // Validate content structure
        assert.equal(result.content.length, 1, `${scenario.name}: Should have exactly one content item`);
        assert.equal(result.content[0].type, 'text', `${scenario.name}: Content should be text type`);
        assert.ok(typeof result.content[0].text === 'string', `${scenario.name}: Text should be string`);
        assert.ok(result.content[0].text.length > 0, `${scenario.name}: Text should not be empty`);
        
        // All test scenarios should return errors for these test cases
        assert.equal(result.isError, true, `${scenario.name}: Should be error for test cases`);
      }
    });

    test('should format error messages consistently', async () => {
      const results = [];
      
      // Collect various error responses
      const errorCases = [
        'format-test-version-1',
        'format-test-version-2', 
        'format-test-version-3'
      ];
      
      for (const versionId of errorCases) {
        const result = await client.callTool('activate_code_version', { codeVersionId: versionId });
        results.push(result.content[0].text);
      }
      
      // All errors should start with "Error:"
      results.forEach((errorText, index) => {
        assert.ok(errorText.startsWith('Error:'), `Error ${index + 1} should start with 'Error:'`);
        assert.ok(errorText.length > 10, `Error ${index + 1} should be reasonably detailed`);
      });
    });
  });

  // ==================================================================================
  // BUSINESS LOGIC AND WORKFLOW VALIDATION
  // ==================================================================================
  describe('Business Logic and Workflow Validation', () => {
    test('should enforce code version management business rules', async () => {
      // Test that we get appropriate error for non-existent versions
      const result = await client.callTool('activate_code_version', { 
        codeVersionId: 'business-logic-test-version' 
      });
      
      assert.equal(result.isError, true);
      
      // Error should indicate version not found, not generic failure
      const errorText = result.content[0].text.toLowerCase();
      assert.ok(
        errorText.includes('not found') || 
        errorText.includes('404') ||
        errorText.includes('does not exist') ||
        errorText.includes('invalidparameterexception'),
        `Error should indicate version not found: ${result.content[0].text}`
      );
    });

    test('should validate code version activation preconditions', async () => {
      // According to tool description: "Only inactive code versions can be activated"
      // For non-existent versions, we should get appropriate error
      
      const result = await client.callTool('activate_code_version', { 
        codeVersionId: 'precondition-test-version' 
      });
      
      assert.equal(result.isError, true);
      
      // Should get proper SFCC API error about version not existing
      assert.ok(result.content[0].text.includes('Error:'));
    });

    test('should provide informative error messages for troubleshooting', async () => {
      const result = await client.callTool('activate_code_version', { 
        codeVersionId: 'troubleshooting-test-version' 
      });
      
      assert.equal(result.isError, true);
      
      const errorText = result.content[0].text;
      
      // Error should be helpful for developers
      assert.ok(errorText.length > 30, 'Error message should be detailed enough for troubleshooting');
      assert.ok(errorText.includes('Error:'), 'Should clearly indicate this is an error');
      
      // Should contain either version-specific info or general API error info
      assert.ok(
        errorText.includes('version') || 
        errorText.includes('404') ||
        errorText.includes('not found') ||
        errorText.includes('Request failed'),
        'Should contain helpful error context'
      );
    });
  });

  // ==================================================================================
  // PERFORMANCE AND RELIABILITY CHARACTERISTICS
  // ==================================================================================
  describe('Performance and Reliability Characteristics', () => {
    test('should handle operations within reasonable time bounds', async () => {
      const startTime = Date.now();
      
      const result = await client.callTool('activate_code_version', { 
        codeVersionId: 'performance-test-version' 
      });
      
      const duration = Date.now() - startTime;
      
      // Should complete within reasonable time (lenient for CI environments)
      assert.ok(duration < 10000, `Operation should complete within 10 seconds, took ${duration}ms`);
      
      // Should still return proper response
      assert.ok(result.content, 'Should return response even under timing constraints');
    });

    test('should maintain consistent response times across multiple calls', async () => {
      const durations = [];
      const testCalls = 5;
      
      for (let i = 0; i < testCalls; i++) {
        const startTime = Date.now();
        
        await client.callTool('activate_code_version', { 
          codeVersionId: `consistency-test-${i}` 
        });
        
        durations.push(Date.now() - startTime);
      }
      
      // All calls should complete within reasonable bounds
      durations.forEach((duration, index) => {
        assert.ok(duration < 10000, `Call ${index + 1} should complete within 10 seconds, took ${duration}ms`);
      });
      
      // Calculate variance (should not be extreme)
      const maxVariation = Math.max(...durations) / Math.min(...durations);
      
      // Lenient variance check for CI environments
      assert.ok(maxVariation < 50, `Response time variation should be reasonable, got ${maxVariation}x variation`);
    });

    test('should handle stress scenarios gracefully', async () => {
      // Test with various payload sizes and complexity
      const stressTests = [
        { name: 'Long version ID', codeVersionId: 'stress-test-' + 'x'.repeat(200) },
        { name: 'Complex characters', codeVersionId: 'stress-测试-🔥-version-!@#$%^&*()' },
        { name: 'JSON-like string', codeVersionId: '{"version": "test", "data": [1,2,3]}' },
        { name: 'XML-like string', codeVersionId: '<version>test</version><data>stress</data>' },
      ];

      for (const stressTest of stressTests) {
        const result = await client.callTool('activate_code_version', { 
          codeVersionId: stressTest.codeVersionId 
        });
        
        // Should handle gracefully without crashing
        assert.ok(result.content, `${stressTest.name}: Should return content`);
        assert.equal(typeof result.isError, 'boolean', `${stressTest.name}: Should return boolean isError`);
        
        // Server should remain responsive
        const healthCheck = await client.listTools();
        assert.ok(healthCheck.length > 0, `${stressTest.name}: Server should remain responsive`);
      }
    });
  });

  // ==================================================================================
  // EDGE CASES AND BOUNDARY CONDITIONS
  // ==================================================================================
  describe('Edge Cases and Boundary Conditions', () => {
    test('should handle maximum length version IDs', async () => {
      // Test various length boundaries
      const lengthTests = [
        { length: 100, name: '100 characters' },
        { length: 255, name: '255 characters (common limit)' },
        { length: 500, name: '500 characters' },
        { length: 1000, name: '1000 characters' },
      ];

      for (const lengthTest of lengthTests) {
        const longVersionId = 'test-' + 'x'.repeat(lengthTest.length - 5);
        
        const result = await client.callTool('activate_code_version', { 
          codeVersionId: longVersionId 
        });
        
        // Should handle gracefully (expect error for non-existent version)
        assert.equal(result.isError, true, `${lengthTest.name}: Should handle long version ID`);
        assert.ok(result.content[0].text.length > 0, `${lengthTest.name}: Should return error message`);
      }
    });

    test('should handle unusual character encodings and formats', async () => {
      const encodingTests = [
        { name: 'Unicode characters', value: 'version-测试-版本-号码' },
        { name: 'Emoji characters', value: 'version-🚀-💻-🔥' },
        { name: 'Control characters', value: 'version\n\t\r\b\f' },
        { name: 'High unicode', value: 'version-𝕧𝕖𝕣𝕤𝕚𝕠𝕟' },
        { name: 'Mixed scripts', value: 'version-αβγ-أبج-中文-🌍' },
      ];

      for (const encodingTest of encodingTests) {
        const result = await client.callTool('activate_code_version', { 
          codeVersionId: encodingTest.value 
        });
        
        // Should handle without server errors
        assert.ok(result.content, `${encodingTest.name}: Should return content`);
        assert.equal(typeof result.isError, 'boolean', `${encodingTest.name}: Should return boolean isError`);
        
        // Check server responsiveness
        const healthCheck = await client.listTools();
        assert.ok(healthCheck.length > 0, `${encodingTest.name}: Server should remain responsive`);
      }
    });

    test('should validate parameter completeness and format', async () => {
      // Test various parameter scenarios
      const parameterTests = [
        { name: 'Extra parameters', args: { codeVersionId: 'test', extraParam: 'should-be-ignored' } },
        { name: 'Case variations', args: { CodeVersionId: 'test-case' } }, // Wrong case
        { name: 'Nested object', args: { codeVersionId: { nested: 'test' } } },
        { name: 'Array value', args: { codeVersionId: ['test', 'array'] } },
      ];

      for (const paramTest of parameterTests) {
        const result = await client.callTool('activate_code_version', paramTest.args);
        
        // Should handle parameter variations appropriately
        assert.ok(result.content, `${paramTest.name}: Should return content`);
        assert.equal(typeof result.isError, 'boolean', `${paramTest.name}: Should return boolean isError`);
        
        if (paramTest.name === 'Extra parameters') {
          // Extra parameters might be acceptable if codeVersionId is valid string
          // We expect error because version doesn't exist, not parameter error
          assert.ok(
            result.content[0].text.includes('404') || 
            result.content[0].text.includes('not found') ||
            result.content[0].text.includes('codeVersionId must be a non-empty string'),
            `${paramTest.name}: Should handle extra parameters gracefully`
          );
        } else {
          // Other cases should fail parameter validation
          assert.equal(result.isError, true, `${paramTest.name}: Should fail validation`);
        }
      }
    });
  });

  // ==================================================================================
  // MOCK VALIDATION AND TESTING ENVIRONMENT
  // ==================================================================================
  describe('Mock Validation and Testing Environment', () => {
    test('should validate we are testing against mock/sandbox environment', async () => {
      // Ensure we're not accidentally testing against production
      const result = await client.callTool('activate_code_version', { 
        codeVersionId: 'PRODUCTION-SAFETY-CHECK-DO-NOT-ACTIVATE' 
      });
      
      // Should fail (which is expected for non-existent version in sandbox)
      assert.equal(result.isError, true, 'Should fail for test version in sandbox environment');
      
      // Verify we get sandbox-appropriate error (not production access denied)
      const errorText = result.content[0].text.toLowerCase();
      assert.ok(
        errorText.includes('not found') || 
        errorText.includes('404') ||
        errorText.includes('invalidparameterexception'),
        `Should get sandbox error, not production access error: ${result.content[0].text}`
      );
    });

    test('should have consistent mock behavior across test runs', async () => {
      const testVersion = 'consistent-mock-test-version';
      
      // Call the same operation multiple times
      const results = [];
      for (let i = 0; i < 3; i++) {
        const result = await client.callTool('activate_code_version', { 
          codeVersionId: testVersion 
        });
        results.push(result);
      }
      
      // All results should be consistent
      results.forEach((result, index) => {
        assert.equal(result.isError, true, `Call ${index + 1}: Should consistently return error`);
        assert.ok(result.content[0].text.length > 0, `Call ${index + 1}: Should have error message`);
      });
      
      // Error messages should be similar (allowing for some variation in timing/IDs)
      const errorTexts = results.map(r => r.content[0].text);
      
      errorTexts.forEach((errorText, index) => {
        assert.ok(
          errorText.startsWith('Error:'),
          `Call ${index + 1}: Should have consistent error format`
        );
      });
    });
  });
});