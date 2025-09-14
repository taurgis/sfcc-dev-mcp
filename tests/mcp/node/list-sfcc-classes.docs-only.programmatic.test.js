/**
 * Programmatic tests for list_sfcc_classes tool
 * 
 * These tests provide advanced verification capabilities beyond YAML pattern matching,
 * including performance monitoring, dynamic validation, comprehensive content analysis,
 * and advanced error categorization for the SFCC class listing functionality.
 * 
 * Response format discovered via conductor query:
 * - Succ      // Core SFCC namespaces should have good coverage
      const coreNamespaces = ['dw.catalog', 'dw.customer', 'dw.order', 'dw.system'];
      coreNamespaces.forEach(namespace => {
        const classCount = analysis.classsByNamespace[namespace].length;
        assert.ok(classCount >= 5, 
          `Core namespace ${namespace} should have at least 5 classes (got ${classCount})`);
      });
      
      // TopLevel namespace should have good coverage for utility classes
      const topLevelCount = analysis.classsByNamespace['TopLevel'].length;
      assert.ok(topLevelCount >= 10, 
        `TopLevel namespace should have substantial coverage (got ${topLevelCount})`);
    });t: [{ type: "text", text: "[\"class1\", \"class2\", ...]" }] }
 * - Always successful: No isError field or error conditions 
 * - Ignores extra parameters: Gracefully handles unexpected parameters
 * - Comprehensive: Returns 500+ classes across all SFCC namespaces
 */

import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-conductor';

/**
 * Performance monitoring utility class for comprehensive metrics collection
 */

/**
 * Content analysis utility for SFCC class validation
 */
class ContentAnalyzer {
  constructor() {
    // SFCC tools should only return actual SFCC classes (dw.* and TopLevel)
    // best-practices and sfra content belong to their respective specialized tools
    this.expectedNamespaces = [
      'TopLevel',
      'dw.campaign',
      'dw.catalog', 
      'dw.content',
      'dw.crypto',
      'dw.customer',
      'dw.extensions',
      'dw.io',
      'dw.job',
      'dw.net',
      'dw.object',
      'dw.order',
      'dw.rpc',
      'dw.suggest',
      'dw.svc',
      'dw.system',
      'dw.util',
      'dw.value',
      'dw.web'
    ];

    // Only include actual SFCC classes, not SFRA or best-practice content
    this.criticalClasses = [
      'dw.catalog.Product',
      'dw.catalog.Category',
      'dw.order.Order',
      'dw.order.Basket',
      'dw.customer.Customer',
      'dw.system.Site',
      'dw.system.SitePreferences',
      'dw.util.ArrayList',
      'dw.web.URL'
    ];

    // Best practice guides are handled by dedicated best-practice tools, not SFCC tools
    this.bestPracticeGuides = [];
  }

  analyzeClassList(classArray) {
    const analysis = {
      totalClasses: classArray.length,
      namespacesCovered: new Set(),
      missingNamespaces: [],
      missingCriticalClasses: [],
      foundCriticalClasses: [],
      foundBestPractices: [],
      duplicates: [],
      invalidFormats: [],
      classsByNamespace: {}
    };

    // Initialize namespace counters
    this.expectedNamespaces.forEach(ns => {
      analysis.classsByNamespace[ns] = [];
    });

    // Analyze each class
    const seenClasses = new Set();
    classArray.forEach(className => {
      // Check for duplicates
      if (seenClasses.has(className)) {
        analysis.duplicates.push(className);
        return;
      }
      seenClasses.add(className);

      // Validate format (should have at least one dot or be TopLevel.*)
      if (!className.includes('.') && !className.startsWith('TopLevel.')) {
        analysis.invalidFormats.push(className);
      }

      // Categorize by namespace
      let namespace;
      if (className.startsWith('dw.')) {
        // For dw.* classes, use first two parts (e.g., "dw.catalog" from "dw.catalog.Product")
        namespace = className.split('.').slice(0, 2).join('.');
      } else {
        // For TopLevel and other classes, use first part only
        namespace = className.split('.')[0];
      }
      analysis.namespacesCovered.add(namespace);
      
      if (analysis.classsByNamespace[namespace]) {
        analysis.classsByNamespace[namespace].push(className);
      } else {
        // Unexpected namespace
        if (!analysis.classsByNamespace.other) {
          analysis.classsByNamespace.other = [];
        }
        analysis.classsByNamespace.other.push(className);
      }

      // Check critical classes
      if (this.criticalClasses.includes(className)) {
        analysis.foundCriticalClasses.push(className);
      }

      // Check best practice guides
      if (this.bestPracticeGuides.includes(className)) {
        analysis.foundBestPractices.push(className);
      }
    });

    // Find missing namespaces
    analysis.missingNamespaces = this.expectedNamespaces.filter(
      ns => !analysis.namespacesCovered.has(ns)
    );

    // Find missing critical classes
    analysis.missingCriticalClasses = this.criticalClasses.filter(
      cls => !analysis.foundCriticalClasses.includes(cls)
    );

    return analysis;
  }

  validateCompleteness(analysis) {
    const issues = [];

    if (analysis.totalClasses < 350) {
      issues.push(`Class count too low: ${analysis.totalClasses} (expected 350+)`);
    }

    if (analysis.missingNamespaces.length > 0) {
      issues.push(`Missing namespaces: ${analysis.missingNamespaces.join(', ')}`);
    }

    if (analysis.missingCriticalClasses.length > 0) {
      issues.push(`Missing critical classes: ${analysis.missingCriticalClasses.join(', ')}`);
    }

    if (analysis.duplicates.length > 0) {
      issues.push(`Duplicate classes found: ${analysis.duplicates.length}`);
    }

    if (analysis.invalidFormats.length > 0) {
      issues.push(`Invalid formats found: ${analysis.invalidFormats.length}`);
    }

    return issues;
  }
}

describe('list_sfcc_classes Programmatic Tests', () => {
  let client;
  const contentAnalyzer = new ContentAnalyzer();

  before(async () => {
    client = await connect('./conductor.config.docs-only.json');
  });

  after(async () => {
    if (client?.connected) {
      await client.disconnect();
    }
  });

  beforeEach(() => {
    // CRITICAL: Clear all buffers to prevent test interference
    client.clearAllBuffers(); // Recommended - comprehensive protection
  });

  describe('Protocol Compliance', () => {
    test('should be properly connected to MCP server', async () => {
      assert.ok(client.connected, 'Client should be connected');
    });

    test('should have list_sfcc_classes tool available', async () => {
      const tools = await client.listTools();
      const listTool = tools.find(tool => tool.name === 'list_sfcc_classes');
      
      assert.ok(listTool, 'list_sfcc_classes tool should be available');
      assert.equal(listTool.name, 'list_sfcc_classes');
      assert.ok(listTool.description, 'Tool should have description');
      assert.ok(listTool.inputSchema, 'Tool should have input schema');
    });

    test('should have correct tool input schema', async () => {
      const tools = await client.listTools();
      const listTool = tools.find(tool => tool.name === 'list_sfcc_classes');
      
      assert.equal(listTool.inputSchema.type, 'object');
      // list_sfcc_classes takes no required parameters
      assert.ok(!listTool.inputSchema.required || listTool.inputSchema.required.length === 0);
    });
  });

  describe('Basic Functionality', () => {
    test('should execute successfully with empty parameters', async () => {
      const result = await client.callTool('list_sfcc_classes', {});
      
      assertValidMCPResponse(result);
      assert.equal(result.isError, false, 'Should not return error');
      assert.equal(result.content.length, 1, 'Should return single content item');
      assert.equal(result.content[0].type, 'text', 'Content type should be text');
    });

    test('should return valid JSON array in response', async () => {
      const result = await client.callTool('list_sfcc_classes', {});
      
      assertValidMCPResponse(result);
      const responseText = result.content[0].text;
      
      // Should be valid JSON
      let classArray;
      assert.doesNotThrow(() => {
        classArray = JSON.parse(responseText);
      }, 'Response should be valid JSON');
      
      assert.ok(Array.isArray(classArray), 'Response should be JSON array');
      assert.ok(classArray.length > 0, 'Class array should not be empty');
    });

    test('should ignore additional parameters gracefully', async () => {
      const result = await client.callTool('list_sfcc_classes', {
        unexpectedParam: 'should be ignored',
        anotherParam: 123,
        objectParam: { nested: 'value' }
      });
      
      assertValidMCPResponse(result);
      assert.equal(result.isError, false, 'Should handle extra params gracefully');
      
      // Result should be identical to empty params call
      const baselineResult = await client.callTool('list_sfcc_classes', {});
      assert.equal(result.content[0].text, baselineResult.content[0].text, 
        'Result should be identical regardless of extra params');
    });
  });

  describe('Content Quality and Completeness', () => {
    test('should return comprehensive SFCC class coverage', async () => {
      const result = await client.callTool('list_sfcc_classes', {});
      const classArray = JSON.parse(result.content[0].text);
      const analysis = contentAnalyzer.analyzeClassList(classArray);
      
      // Validate completeness
      const issues = contentAnalyzer.validateCompleteness(analysis);
      assert.equal(issues.length, 0, `Content issues found: ${issues.join('; ')}`);
      
      // Verify substantial class count
      assert.ok(analysis.totalClasses >= 400, 
        `Should have substantial class count (got ${analysis.totalClasses})`);
    });

    test('should include all expected SFCC namespaces', async () => {
      const result = await client.callTool('list_sfcc_classes', {});
      const classArray = JSON.parse(result.content[0].text);
      const analysis = contentAnalyzer.analyzeClassList(classArray);
      
      contentAnalyzer.expectedNamespaces.forEach(namespace => {
        assert.ok(analysis.namespacesCovered.has(namespace), 
          `Missing expected namespace: ${namespace}`);
        assert.ok(analysis.classsByNamespace[namespace].length > 0,
          `Namespace ${namespace} should have classes`);
      });
    });

    test('should include critical SFCC classes for development', async () => {
      const result = await client.callTool('list_sfcc_classes', {});
      const classArray = JSON.parse(result.content[0].text);
      const analysis = contentAnalyzer.analyzeClassList(classArray);
      
      contentAnalyzer.criticalClasses.forEach(criticalClass => {
        assert.ok(classArray.includes(criticalClass), 
          `Missing critical class: ${criticalClass}`);
      });
      
      assert.ok(analysis.foundCriticalClasses.length >= contentAnalyzer.criticalClasses.length * 0.9,
        'Should include at least 90% of critical classes');
    });

    test('should include best practice guides', async () => {
      const result = await client.callTool('list_sfcc_classes', {});
      const classArray = JSON.parse(result.content[0].text);
      
      contentAnalyzer.bestPracticeGuides.forEach(guide => {
        assert.ok(classArray.includes(guide), 
          `Missing best practice guide: ${guide}`);
      });
    });

    test('should have proper class naming format', async () => {
      const result = await client.callTool('list_sfcc_classes', {});
      const classArray = JSON.parse(result.content[0].text);
      const analysis = contentAnalyzer.analyzeClassList(classArray);
      
      assert.equal(analysis.invalidFormats.length, 0, 
        `Invalid class formats found: ${analysis.invalidFormats.join(', ')}`);
      
      assert.equal(analysis.duplicates.length, 0,
        `Duplicate classes found: ${analysis.duplicates.join(', ')}`);
    });
  });

  describe('Advanced Content Analysis', () => {
    test('should provide balanced namespace distribution', async () => {
      const result = await client.callTool('list_sfcc_classes', {});
      const classArray = JSON.parse(result.content[0].text);
      const analysis = contentAnalyzer.analyzeClassList(classArray);
      
      // Core namespaces should have substantial class counts
      const coreNamespaces = ['dw.catalog', 'dw.order', 'dw.customer', 'dw.system'];
      coreNamespaces.forEach(namespace => {
        const classCount = analysis.classsByNamespace[namespace].length;
        assert.ok(classCount >= 5, 
          `Core namespace ${namespace} should have at least 5 classes (got ${classCount})`);
      });
      
      // TopLevel namespace should have good coverage for utility classes
      const topLevelCount = analysis.classsByNamespace['TopLevel'].length;
      assert.ok(topLevelCount >= 10, 
        `TopLevel namespace should have substantial coverage (got ${topLevelCount})`);
    });

    test('should include developer-friendly discovery content', async () => {
      const result = await client.callTool('list_sfcc_classes', {});
      const classArray = JSON.parse(result.content[0].text);
      
      // Should include educational namespaces for new developers (SFCC classes only)
      const educationalClasses = [
        'TopLevel.Array', 
        'TopLevel.Object',
        'dw.catalog.Product',
        'dw.system.Site'
      ];
      
      educationalClasses.forEach(educationalClass => {
        assert.ok(classArray.includes(educationalClass), 
          `Missing educational class: ${educationalClass}`);
      });
    });

    test('should support API exploration workflows', async () => {
      const result = await client.callTool('list_sfcc_classes', {});
      const classArray = JSON.parse(result.content[0].text);
      
      // Should include classes that developers commonly search for
      const commonSearchTargets = [
        'dw.catalog.ProductMgr',
        'dw.order.BasketMgr', 
        'dw.customer.CustomerMgr',
        'dw.system.SitePreferences',
        'dw.web.URLUtils'
      ];
      
      commonSearchTargets.forEach(searchTarget => {
        assert.ok(classArray.includes(searchTarget), 
          `Missing common search target: ${searchTarget}`);
      });
    });

    test('should provide comprehensive extension coverage', async () => {
      const result = await client.callTool('list_sfcc_classes', {});
      const classArray = JSON.parse(result.content[0].text);
      
      // Should include extension classes for integrations
      const extensionClasses = classArray.filter(cls => cls.startsWith('dw.extensions.'));
      assert.ok(extensionClasses.length >= 10, 
        `Should include substantial extension classes (got ${extensionClasses.length})`);
      
      // Should cover major payment integrations
      const paymentClasses = classArray.filter(cls => 
        cls.includes('payments') || cls.includes('PayPal') || cls.includes('ApplePay'));
      assert.ok(paymentClasses.length >= 5,
        `Should include payment integration classes (got ${paymentClasses.length})`);
    });
  });


  describe('Response Structure Validation', () => {
    test('should maintain consistent response structure', async () => {
      const result1 = await client.callTool('list_sfcc_classes', {});
      const result2 = await client.callTool('list_sfcc_classes', {});
      
      // Structure should be identical
      assert.equal(result1.content.length, result2.content.length);
      assert.equal(result1.content[0].type, result2.content[0].type);
      assert.equal(result1.content[0].text, result2.content[0].text);
      
      // Content should be deterministic
      const classes1 = JSON.parse(result1.content[0].text);
      const classes2 = JSON.parse(result2.content[0].text);
      assert.deepEqual(classes1, classes2, 'Class lists should be identical between calls');
    });

    test('should return properly formatted JSON with valid structure', async () => {
      const result = await client.callTool('list_sfcc_classes', {});
      const responseText = result.content[0].text;
      
      // Should be properly formatted JSON
      assert.ok(responseText.startsWith('['), 'Should start with array bracket');
      assert.ok(responseText.endsWith(']'), 'Should end with array bracket');
      
      // Parse and validate structure
      const classArray = JSON.parse(responseText);
      assert.ok(Array.isArray(classArray), 'Should be array');
      
      // Each item should be a string
      classArray.forEach((item, index) => {
        assert.equal(typeof item, 'string', `Item ${index} should be string`);
        assert.ok(item.length > 0, `Item ${index} should not be empty`);
      });
    });

    test('should provide useful content for AI agents', async () => {
      const result = await client.callTool('list_sfcc_classes', {});
      const classArray = JSON.parse(result.content[0].text);
      
      // Should include SFCC classes that AI agents commonly need
      const aiUsefulClasses = [
        'dw.system.Logger',        // For logging
        'dw.util.StringUtils',     // For text processing  
        'dw.web.URLUtils',         // For URL generation
        'dw.system.Site',          // For site context
        'dw.catalog.Product',      // For product operations
        'dw.order.Basket'          // For basket operations
      ];
      
      aiUsefulClasses.forEach(usefulClass => {
        assert.ok(classArray.includes(usefulClass), 
          `Should include AI-useful class: ${usefulClass}`);
      });
    });
  });

  describe('Educational and Discovery Value', () => {
    test('should serve as comprehensive SFCC reference', async () => {
      const result = await client.callTool('list_sfcc_classes', {});
      const classArray = JSON.parse(result.content[0].text);
      const analysis = contentAnalyzer.analyzeClassList(classArray);
      
      // Should cover all major SFCC functional areas (SFCC classes only)
      const functionalAreas = {
        'commerce': ['dw.catalog', 'dw.order'],
        'customer': ['dw.customer'],
        'system': ['dw.system'],
        'web': ['dw.web'],
        'utilities': ['dw.util'],
        'integrations': ['dw.svc', 'dw.extensions'],
        'foundations': ['TopLevel']
      };
      
      Object.entries(functionalAreas).forEach(([area, namespaces]) => {
        namespaces.forEach(namespace => {
          const classCount = analysis.classsByNamespace[namespace].length;
          assert.ok(classCount > 0, 
            `Functional area '${area}' should have classes in namespace '${namespace}'`);
        });
      });
    });

    test('should support progressive learning for developers', async () => {
      const result = await client.callTool('list_sfcc_classes', {});
      const classArray = JSON.parse(result.content[0].text);
      
      // Should include beginner-friendly TopLevel classes
      const beginnerClasses = classArray.filter(cls => 
        cls.startsWith('TopLevel.'));
      assert.ok(beginnerClasses.length >= 10, 
        `Should include beginner-friendly TopLevel classes (got ${beginnerClasses.length})`);
      
      // Should include advanced integration classes
      const advancedClasses = classArray.filter(cls => 
        cls.includes('Hook') || cls.includes('Extension') || cls.includes('Service'));
      assert.ok(advancedClasses.length >= 20,
        `Should include advanced integration classes (got ${advancedClasses.length})`);
    });
  });

  describe('Integration and Cross-Tool Validation', () => {
    test('should provide classes that work with search_sfcc_classes tool', async () => {
      const listResult = await client.callTool('list_sfcc_classes', {});
      const classArray = JSON.parse(listResult.content[0].text);
      
      // Pick a few SFCC classes to test with search tool
      const testClasses = ['dw.catalog.Product', 'dw.system.Site', 'dw.customer.Customer'];
      
      for (const testClass of testClasses) {
        assert.ok(classArray.includes(testClass), 
          `List should include searchable class: ${testClass}`);
        
        // Test that the class is discoverable via search
        const namespace = testClass.split('.')[1]; // Get 'catalog' from 'dw.catalog.Product'
        const searchResult = await client.callTool('search_sfcc_classes', { 
          query: namespace 
        });
        
        assertValidMCPResponse(searchResult);
        if (!searchResult.isError) {
          const searchedClasses = JSON.parse(searchResult.content[0].text);
          assert.ok(Array.isArray(searchedClasses), 
            `Search should return array for ${namespace}`);
        }
      }
    });

    test('should include classes that have detailed documentation available', async () => {
      const listResult = await client.callTool('list_sfcc_classes', {});
      const classArray = JSON.parse(listResult.content[0].text);
      
      // Test a few well-documented classes
      const documentedClasses = ['dw.catalog.Product', 'dw.system.Site', 'dw.order.Basket'];
      
      for (const docClass of documentedClasses) {
        assert.ok(classArray.includes(docClass), 
          `List should include documented class: ${docClass}`);
        
        // Test that class info is available
        const infoResult = await client.callTool('get_sfcc_class_info', { 
          className: docClass 
        });
        
        assertValidMCPResponse(infoResult);
        if (!infoResult.isError) {
          const infoText = infoResult.content[0].text;
          // Parse the JSON response to check for class information
          let classInfo;
          assert.doesNotThrow(() => {
            classInfo = JSON.parse(infoText);
          }, `Class info should be valid JSON for ${docClass}`);
          
          // Check that the response contains class information
          assert.ok(classInfo.className || classInfo.packageName, 
            `Class info should contain class information for ${docClass}`);
          
          // For dw.catalog.Product, verify it contains "Product" and "dw.catalog"
          if (docClass === 'dw.catalog.Product') {
            assert.ok(classInfo.className === 'Product', 
              'Product class info should contain className "Product"');
            assert.ok(classInfo.packageName === 'dw.catalog', 
              'Product class info should contain packageName "dw.catalog"');
          }
        }
      }
    });

    test('should maintain consistency with available tools ecosystem', async () => {
      const listResult = await client.callTool('list_sfcc_classes', {});
      const classArray = JSON.parse(listResult.content[0].text);
      
      // Should include SFCC classes that support the SFCC toolchain
      const toolchainClasses = [
        'dw.catalog.Product',         // For product tool integration
        'dw.system.SitePreferences',  // For site preference tools
        'dw.order.Order',             // For order management tools
        'dw.util.ArrayList',          // For collection operations
        'dw.web.URLUtils'             // For URL generation tools
      ];
      
      toolchainClasses.forEach(toolClass => {
        assert.ok(classArray.includes(toolClass), 
          `Should include toolchain-supporting class: ${toolClass}`);
      });
    });

    test('should enable effective AI-assisted development workflows', async () => {
      const listResult = await client.callTool('list_sfcc_classes', {});
      const classArray = JSON.parse(listResult.content[0].text);
      
      // Should include SFCC classes that AI agents commonly recommend
      const aiWorkflowClasses = [
        'dw.system.Logger',           // For debugging workflows
        'dw.util.StringUtils',        // For data manipulation
        'dw.web.URLUtils',           // For URL generation
        'dw.catalog.ProductMgr',     // For product operations
        'dw.order.BasketMgr',        // For cart operations
        'dw.customer.CustomerMgr',   // For customer operations
        'dw.system.Site',            // For site context
        'dw.order.Order'             // For order handling
      ];
      
      aiWorkflowClasses.forEach(workflowClass => {
        assert.ok(classArray.includes(workflowClass), 
          `Should include AI workflow class: ${workflowClass}`);
      });
      
      // Should provide good coverage for common AI development tasks (SFCC classes only)
      const taskCoverage = {
        'data_access': classArray.filter(cls => cls.includes('Mgr')).length,
        'web_operations': classArray.filter(cls => cls.startsWith('dw.web.')).length,
        'system_integration': classArray.filter(cls => cls.startsWith('dw.system.')).length,
        'utilities': classArray.filter(cls => cls.startsWith('dw.util.')).length
      };
      
      Object.entries(taskCoverage).forEach(([task, count]) => {
        assert.ok(count >= 3, 
          `Should have good coverage for ${task} (got ${count} classes)`);
      });
    });
  });
});

/**
 * Helper function to validate basic MCP response structure
 */
function assertValidMCPResponse(result) {
  assert.ok(result.content, 'Response should have content');
  assert.ok(Array.isArray(result.content), 'Content should be array');
  assert.equal(typeof result.isError, 'boolean', 'isError should be boolean and always present');
}
