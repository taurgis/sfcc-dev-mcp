import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

/**
 * SFCC Code Versions Tool - Comprehensive Programmatic Tests
 * 
 * Tests complex scenarios, multi-step workflows, and advanced validation
 * for get_code_versions and activate_code_version tools in full mode.
 * 
 * Run with: node --test tests/mcp/node/code-versions.full-mode.programmatic.test.js
 */

describe('SFCC Code Versions Tools - Full Mode Programmatic Tests', () => {
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
    // CRITICAL: Clear all buffers to prevent test interference
    client.clearAllBuffers();
  });

  // ==================================================================================
  // HELPER FUNCTIONS
  // ==================================================================================

  function assertValidMCPResponse(result) {
    assert.ok(result.content, 'Should have content');
    assert.ok(Array.isArray(result.content), 'Content should be array');
    assert.equal(typeof result.isError, 'boolean', 'isError should be boolean');
  }

  function assertTextContent(result, expectedSubstring) {
    assertValidMCPResponse(result);
    assert.equal(result.content[0].type, 'text');
    assert.ok(result.content[0].text.includes(expectedSubstring));
  }

  function parseCodeVersionsResponse(result) {
    assertValidMCPResponse(result);
    assert.equal(result.isError, false, 'Should not be error');
    
    const jsonText = result.content[0].text;
    const data = JSON.parse(jsonText);
    
    assert.ok(data._type, 'Should have _type field');
    assert.equal(data._type, 'code_version_result', 'Should be code_version_result type');
    assert.ok(Array.isArray(data.data), 'Should have data array');
    assert.equal(typeof data.count, 'number', 'Should have count field');
    assert.equal(typeof data.total, 'number', 'Should have total field');
    
    return data;
  }

  function validateCodeVersionObject(codeVersion) {
    assert.equal(codeVersion._type, 'code_version', 'Should be code_version type');
    assert.ok(typeof codeVersion.id === 'string', 'Should have string id');
    assert.ok(typeof codeVersion.active === 'boolean', 'Should have boolean active flag');
    assert.ok(Array.isArray(codeVersion.cartridges), 'Should have cartridges array');
    assert.ok(typeof codeVersion.compatibility_mode === 'string', 'Should have compatibility_mode');
    assert.ok(typeof codeVersion.rollback === 'boolean', 'Should have rollback flag');
    assert.ok(typeof codeVersion.web_dav_url === 'string', 'Should have web_dav_url');
    
    // Optional fields that may be present
    if (codeVersion.activation_time) {
      assert.ok(typeof codeVersion.activation_time === 'string', 'activation_time should be string');
    }
    if (codeVersion.last_modification_time) {
      assert.ok(typeof codeVersion.last_modification_time === 'string', 'last_modification_time should be string');
    }
  }

  // ==================================================================================
  // BASIC FUNCTIONALITY TESTS
  // ==================================================================================

  describe('get_code_versions Tool Tests', () => {
    test('should retrieve and validate complete code versions structure', async () => {
      const result = await client.callTool('get_code_versions', {});
      const data = parseCodeVersionsResponse(result);
      
      // Validate each code version object
      data.data.forEach(codeVersion => {
        validateCodeVersionObject(codeVersion);
      });
      
      // Validate counts match
      assert.equal(data.data.length, data.count, 'Data length should match count');
      assert.equal(data.count, data.total, 'Count should match total');
    });

    test('should identify active and inactive code versions', async () => {
      const result = await client.callTool('get_code_versions', {});
      const data = parseCodeVersionsResponse(result);
      
      const activeVersions = data.data.filter(v => v.active);
      const inactiveVersions = data.data.filter(v => !v.active);
      
      // Should have exactly one active version
      assert.equal(activeVersions.length, 1, 'Should have exactly one active version');
      assert.ok(inactiveVersions.length >= 0, 'Should have zero or more inactive versions');
      
      // Active version should have activation_time
      const activeVersion = activeVersions[0];
      assert.ok(activeVersion.activation_time, 'Active version should have activation_time');
    });

    test('should validate cartridge lists and compatibility modes', async () => {
      const result = await client.callTool('get_code_versions', {});
      const data = parseCodeVersionsResponse(result);
      
      data.data.forEach(codeVersion => {
        // Each cartridge should be a string
        codeVersion.cartridges.forEach(cartridge => {
          assert.ok(typeof cartridge === 'string', `Cartridge ${cartridge} should be string`);
          assert.ok(cartridge.length > 0, `Cartridge ${cartridge} should not be empty`);
        });
        
        // Compatibility mode should be valid format (e.g., "22.7")
        assert.ok(/^\d+\.\d+$/.test(codeVersion.compatibility_mode), 
          `Compatibility mode ${codeVersion.compatibility_mode} should match pattern`);
        
        // WebDAV URL should be valid
        assert.ok(codeVersion.web_dav_url.startsWith('https://'), 
          'WebDAV URL should be HTTPS');
        assert.ok(codeVersion.web_dav_url.includes('/webdav/'), 
          'WebDAV URL should contain /webdav/');
      });
    });

    test('should handle empty parameters and extra parameters consistently', async () => {
      // Test with empty object
      const result1 = await client.callTool('get_code_versions', {});
      const data1 = parseCodeVersionsResponse(result1);
      
      // Test with extra parameters (should be ignored)
      const result2 = await client.callTool('get_code_versions', {
        extraParam: 'ignored',
        anotherParam: 123
      });
      const data2 = parseCodeVersionsResponse(result2);
      
      // Results should be identical
      assert.deepEqual(data1, data2, 'Results should be identical regardless of extra parameters');
    });
  });

  // ==================================================================================
  // ACTIVATE CODE VERSION TESTS
  // ==================================================================================

  describe('activate_code_version Tool Tests', () => {
    test('should validate activation response structure', async () => {
      // First, ensure we have a clean state by activating the reset version
      await client.callTool('activate_code_version', {
        codeVersionId: 'reset_version'
      });
      
      const result = await client.callTool('activate_code_version', {
        codeVersionId: 'test_activation'
      });
      
      assertValidMCPResponse(result);
      assert.equal(result.isError, false, 'Should not be error');
      
      const jsonText = result.content[0].text;
      const data = JSON.parse(jsonText);
      
      // Validate activation response structure (real SFCC OCAPI format)
      assert.ok(typeof data.id === 'string', 'Should have id field');
      assert.equal(data.active, true, 'Should be marked as active');
      assert.ok(data.activation_time, 'Should have activation_time');
      assert.ok(data._type === 'code_version', 'Should have correct _type');
      assert.ok(Array.isArray(data.cartridges), 'Should have cartridges array');
    });

    test('should handle various code version ID formats', async () => {
      const testIds = [
        'simple_id',
        'SFRA_AP_01_24_2024',
        'version-with-dashes',
        'version_with_underscores',
        'Version123'
      ];
      
      for (const testId of testIds) {
        const result = await client.callTool('activate_code_version', {
          codeVersionId: testId
        });
        
        assertValidMCPResponse(result);
        assert.equal(result.isError, false, `Should handle ID format: ${testId}`);
        
        const data = JSON.parse(result.content[0].text);
        assert.equal(data.id, testId, 'Response should echo the provided ID');
      }
    });

    test('should validate parameter requirements and types', async () => {
      // Test missing parameter
      const result1 = await client.callTool('activate_code_version', {});
      assertValidMCPResponse(result1);
      assert.equal(result1.isError, true, 'Should be error for missing parameter');
      assertTextContent(result1, 'codeVersionId must be a non-empty string');
      
      // Test empty string
      const result2 = await client.callTool('activate_code_version', {
        codeVersionId: ''
      });
      assertValidMCPResponse(result2);
      assert.equal(result2.isError, true, 'Should be error for empty string');
      assertTextContent(result2, 'codeVersionId must be a non-empty string');
      
      // Test wrong type (number)
      const result3 = await client.callTool('activate_code_version', {
        codeVersionId: 123
      });
      assertValidMCPResponse(result3);
      assert.equal(result3.isError, true, 'Should be error for number type');
      assertTextContent(result3, 'codeVersionId must be a non-empty string');
      
      // Test null value
      const result4 = await client.callTool('activate_code_version', {
        codeVersionId: null
      });
      assertValidMCPResponse(result4);
      assert.equal(result4.isError, true, 'Should be error for null value');
      assertTextContent(result4, 'codeVersionId must be a non-empty string');
    });
  });

  // ==================================================================================
  // MULTI-STEP WORKFLOW TESTS
  // ==================================================================================

  describe('Multi-Step Code Version Workflows', () => {
    test('should support get-then-activate workflow', async () => {
      // Step 1: Get all code versions
      const getResult = await client.callTool('get_code_versions', {});
      const versionsData = parseCodeVersionsResponse(getResult);
      
      // Step 2: Find an inactive version to activate
      const inactiveVersions = versionsData.data.filter(v => !v.active);
      
      if (inactiveVersions.length > 0) {
        const targetVersion = inactiveVersions[0];
        
        // Step 3: Activate the inactive version
        const activateResult = await client.callTool('activate_code_version', {
          codeVersionId: targetVersion.id
        });
        
        assertValidMCPResponse(activateResult);
        assert.equal(activateResult.isError, false, 'Activation should succeed');
        
        const activationData = JSON.parse(activateResult.content[0].text);
        assert.equal(activationData.id.trim(), targetVersion.id.trim(), 'Should activate the correct version');
        assert.equal(activationData.active, true, 'Should be marked as active');
      }
    });

    test('should validate workflow with activation timestamps', async () => {
      // Reset to known state first
      await client.callTool('activate_code_version', {
        codeVersionId: 'reset_version'
      });
      
      const testVersionId = 'workflow_test_version';
      
      // Activate a test version
      const activateResult = await client.callTool('activate_code_version', {
        codeVersionId: testVersionId
      });
      
      assertValidMCPResponse(activateResult);
      const activationData = JSON.parse(activateResult.content[0].text);
      
      // Validate activation timestamp format (ISO 8601)
      const timestampRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
      assert.ok(timestampRegex.test(activationData.activation_time), 
        'Activation timestamp should be in ISO 8601 format');
      
      // Validate timestamp is recent (within last minute)
      const activationTime = new Date(activationData.activation_time);
      const now = new Date();
      const timeDiff = Math.abs(now - activationTime);
      assert.ok(timeDiff < 60000, 'Activation timestamp should be recent (within 1 minute)');
    });

    test('should handle sequential activations correctly', async () => {
      // Reset to a known state first
      await client.callTool('activate_code_version', {
        codeVersionId: 'reset_version'
      });
      
      const testVersions = ['seq_test_1', 'seq_test_2', 'seq_test_3'];
      const activationResults = [];
      
      // Activate versions sequentially
      for (const versionId of testVersions) {
        const result = await client.callTool('activate_code_version', {
          codeVersionId: versionId
        });
        
        assertValidMCPResponse(result);
        
        // Handle both success and "already active" cases
        if (result.isError) {
          // Check if it's an "already active" error
          const errorText = result.content[0].text;
          if (errorText.includes('already active')) {
            // Get the current version data to use its timestamp
            const getResult = await client.callTool('get_code_versions', {});
            const data = JSON.parse(getResult.content[0].text);
            const activeVersion = data.data.find(v => v.id === versionId);
            if (activeVersion && activeVersion.activation_time) {
              activationResults.push({
                id: activeVersion.id,
                timestamp: activeVersion.activation_time
              });
              continue;
            }
          }
          assert.fail(`Should activate ${versionId}: ${errorText}`);
        } else {
          const data = JSON.parse(result.content[0].text);
          activationResults.push({
            id: data.id,
            timestamp: data.activation_time
          });
        }
      }
      
      // Validate timestamps are in chronological order (if we have enough results)
      if (activationResults.length >= 2) {
        for (let i = 1; i < activationResults.length; i++) {
          const prevTime = new Date(activationResults[i - 1].timestamp);
          const currentTime = new Date(activationResults[i].timestamp);
          // Allow for timestamp equality (same second activation) but require non-decreasing order
          assert.ok(currentTime >= prevTime, 
            'Activation timestamps should be in chronological order');
        }
      }
    });
  });

  // ==================================================================================
  // DYNAMIC VALIDATION AND ERROR RECOVERY TESTS
  // ==================================================================================

  describe('Dynamic Validation and Error Recovery', () => {
    test('should dynamically validate code version metadata consistency', async () => {
      const result = await client.callTool('get_code_versions', {});
      const data = parseCodeVersionsResponse(result);
      
      // Dynamic validation based on actual data
      if (data.data.length > 0) {
        // Validate that exactly one version is active
        const activeCount = data.data.filter(v => v.active).length;
        assert.equal(activeCount, 1, 'Exactly one version should be active');
        
        // Validate cartridge name patterns
        const allCartridges = new Set();
        data.data.forEach(version => {
          version.cartridges.forEach(cartridge => {
            allCartridges.add(cartridge);
            
            // Validate cartridge naming patterns
            assert.ok(
              /^[a-zA-Z0-9_.-]+$/.test(cartridge),
              `Cartridge name ${cartridge} should match naming pattern`
            );
          });
        });
        
        // Common cartridges should exist across versions
        const cartridgeList = Array.from(allCartridges);
        
        // Validate we have some cartridges (more robust than checking specific ones)
        if (cartridgeList.some(c => c.includes('storefront') || c.includes('fastforward'))) {
          // If we have SFRA/fastforward cartridges, we're in a typical SFRA environment
          assert.ok(cartridgeList.length > 5, 'SFRA environment should have multiple cartridges');
        }
      }
    });

    test('should handle edge cases and malformed inputs gracefully', async () => {
      const edgeCaseInputs = [
        { codeVersionId: ' ' }, // Whitespace only
        { codeVersionId: '    trimmed_spaces    ' }, // Spaces around ID
        { codeVersionId: 'very_long_version_id_that_exceeds_normal_limits_but_should_still_work' },
        { codeVersionId: '123' }, // Numeric string
        { codeVersionId: 'version-with-special-chars!@#' }, // Special characters
      ];
      
      for (const input of edgeCaseInputs) {
        const result = await client.callTool('activate_code_version', input);
        assertValidMCPResponse(result);
        
        // Should either succeed or fail gracefully with meaningful error
        if (result.isError) {
          assert.ok(result.content[0].text.length > 0, 'Error message should not be empty');
        } else {
          // If it succeeds, should have valid response structure
          const data = JSON.parse(result.content[0].text);
          assert.ok(data.id, 'Should have ID field');
          assert.equal(typeof data.active, 'boolean', 'Should have boolean active field');
        }
      }
    });

    test('should maintain functionality after error scenarios', async () => {
      // Cause an error with invalid parameters
      const errorResult = await client.callTool('activate_code_version', {});
      assert.equal(errorResult.isError, true, 'Should get error for invalid params');
      
      // Verify normal operation still works after error
      const normalResult = await client.callTool('get_code_versions', {});
      const data = parseCodeVersionsResponse(normalResult);
      assert.ok(data.data.length >= 0, 'Should still return code versions after error');
      
      // Verify activation still works after error
      const activateResult = await client.callTool('activate_code_version', {
        codeVersionId: 'recovery_test'
      });
      assert.equal(activateResult.isError, false, 'Should be able to activate after error');
    });
  });

  // ==================================================================================
  // BUSINESS LOGIC AND INTEGRATION TESTS
  // ==================================================================================

  describe('Business Logic and Integration Tests', () => {
    test('should validate deployment-related business rules', async () => {
      const result = await client.callTool('get_code_versions', {});
      const data = parseCodeVersionsResponse(result);
      
      // Business rule: Active version should have recent activation time
      const activeVersion = data.data.find(v => v.active);
      if (activeVersion && activeVersion.activation_time) {
        const activationTime = new Date(activeVersion.activation_time);
        const now = new Date();
        
        // Should be within reasonable timeframe (1 year)
        const daysDiff = (now - activationTime) / (1000 * 60 * 60 * 24);
        assert.ok(daysDiff < 365, 'Active version should have been activated within last year');
      }
      
      // Business rule: All versions should have valid WebDAV URLs
      data.data.forEach(version => {
        assert.ok(version.web_dav_url.includes(version.id), 
          'WebDAV URL should contain the version ID');
        assert.ok(version.web_dav_url.includes('commercecloud.salesforce.com'), 
          'WebDAV URL should be from Salesforce Commerce Cloud');
      });
    });

    test('should validate cartridge deployment patterns', async () => {
      const result = await client.callTool('get_code_versions', {});
      const data = parseCodeVersionsResponse(result);
      
      data.data.forEach(version => {
        // Validate cartridge organization patterns
        const cartridges = version.cartridges;
        
        // Should not have duplicate cartridges
        const uniqueCartridges = new Set(cartridges);
        assert.equal(cartridges.length, uniqueCartridges.size, 
          `Version ${version.id} should not have duplicate cartridges`);
        
        // Business Manager cartridges should start with 'bm_'
        const bmCartridges = cartridges.filter(c => c.startsWith('bm_'));
        bmCartridges.forEach(cartridge => {
          assert.ok(cartridge.length > 3, 
            `BM cartridge ${cartridge} should have meaningful name`);
        });
        
        // Plugin cartridges should start with 'plugin_'
        const pluginCartridges = cartridges.filter(c => c.startsWith('plugin_'));
        pluginCartridges.forEach(cartridge => {
          assert.ok(cartridge.length > 7, 
            `Plugin cartridge ${cartridge} should have meaningful name`);
        });
      });
    });

    test('should simulate real deployment scenario workflow', async () => {
      // Reset to known state first
      await client.callTool('activate_code_version', {
        codeVersionId: 'reset_version'
      });
      
      // Simulate a deployment manager workflow
      
      // 1. Check current deployment state
      const currentState = await client.callTool('get_code_versions', {});
      const stateData = parseCodeVersionsResponse(currentState);
      
      const currentActive = stateData.data.find(v => v.active);
      assert.ok(currentActive, 'Should have an active version in current state');
      
      // 2. Prepare for deployment (activate a test version)
      const deploymentVersion = 'deployment_simulation_v1';
      const deployResult = await client.callTool('activate_code_version', {
        codeVersionId: deploymentVersion
      });
      
      assert.equal(deployResult.isError, false, 'Deployment activation should succeed');
      
      // 3. Validate deployment success
      const deployData = JSON.parse(deployResult.content[0].text);
      assert.equal(deployData.id, deploymentVersion, 'Should activate correct version');
      assert.equal(deployData.active, true, 'New version should be active');
      
      // 4. Verify deployment timing (should be immediate)
      const deployTime = new Date(deployData.activation_time);
      const now = new Date();
      const deploymentLatency = Math.abs(now - deployTime);
      assert.ok(deploymentLatency < 5000, 'Deployment should complete within 5 seconds');
    });
  });

  // ==================================================================================
  // PERFORMANCE AND RELIABILITY TESTS
  // ==================================================================================

  describe('Performance and Reliability Tests', () => {
    test('should handle multiple sequential operations reliably', async () => {
      // Reset to known state first
      await client.callTool('activate_code_version', {
        codeVersionId: 'reset_version'
      });
      
      const operationResults = [];
      const operationCount = 5;
      
      // Perform multiple get_code_versions calls
      for (let i = 0; i < operationCount; i++) {
        const result = await client.callTool('get_code_versions', {});
        operationResults.push({
          success: !result.isError,
          hasContent: result.content && result.content.length > 0,
          operation: 'get_code_versions',
          iteration: i
        });
      }
      
      // All operations should succeed
      const successCount = operationResults.filter(r => r.success).length;
      assert.equal(successCount, operationCount, 'All get_code_versions operations should succeed');
      
      // Perform multiple activate operations
      for (let i = 0; i < 3; i++) {
        const result = await client.callTool('activate_code_version', {
          codeVersionId: `reliability_test_${i}`
        });
        operationResults.push({
          success: !result.isError,
          hasContent: result.content && result.content.length > 0,
          operation: 'activate_code_version',
          iteration: i
        });
      }
      
      // Calculate overall reliability
      const totalSuccess = operationResults.filter(r => r.success).length;
      const reliabilityRate = totalSuccess / operationResults.length;
      assert.ok(reliabilityRate >= 0.95, 'Should have at least 95% success rate');
    });

    test('should maintain consistent response structure across calls', async () => {
      const responses = [];
      
      // Collect multiple responses
      for (let i = 0; i < 3; i++) {
        const result = await client.callTool('get_code_versions', {});
        const data = parseCodeVersionsResponse(result);
        responses.push(data);
      }
      
      // Validate consistency
      const firstResponse = responses[0];
      responses.slice(1).forEach((response, index) => {
        assert.equal(response._type, firstResponse._type, 
          `Response ${index + 1} should have same _type`);
        assert.equal(response.count, firstResponse.count, 
          `Response ${index + 1} should have same count`);
        assert.equal(response.total, firstResponse.total, 
          `Response ${index + 1} should have same total`);
        assert.equal(response.data.length, firstResponse.data.length, 
          `Response ${index + 1} should have same data length`);
      });
    });
  });
});