/**
 * Programmatic tests for get_available_best_practice_guides tool
 * 
 * These tests provide advanced verification capabilities beyond YAML pattern matching,
 * including dynamic validation, comprehensive content analysis,
 * and advanced error categorization for the SFCC best practice guides functionality.
 * 
 * Response format discovered via aegis query:
 * - Success: { content: [{ type: "text", text: "[{\"name\":\"guide_name\",\"title\":\"Guide Title\",\"description\":\"...\"}]" }], isError: false }
 * - Always successful: No isError field or error conditions in docs-only mode
 * - Ignores extra parameters: Gracefully handles unexpected parameters
 * - Comprehensive: Returns 13 best practice guides across SFCC development areas
 */

import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

/**
 * Content analysis utility for SFCC best practice guides validation
 */
class BestPracticeAnalyzer {
  constructor() {
    // Expected best practice guides based on project structure
    this.expectedGuides = [
      'cartridge_creation',
      'isml_templates', 
      'job_framework',
      'localserviceregistry',
      'ocapi_hooks',
      'scapi_hooks',
      'scapi_custom_endpoint',
      'sfra_controllers',
      'sfra_models',
      'sfra_client_side_js',
      'sfra_scss',
      'performance',
      'security'
    ];

    // Critical guides that must be present
    this.criticalGuides = [
      'cartridge_creation',
      'sfra_controllers',
      'ocapi_hooks',
      'scapi_hooks',
      'sfra_client_side_js',
      'sfra_scss',
      'security',
      'performance'
    ];

    // Guide categories for validation
    this.guideCategories = {
      core: ['cartridge_creation', 'isml_templates', 'job_framework'],
      sfra: ['sfra_controllers', 'sfra_models', 'sfra_client_side_js', 'sfra_scss'],
      api_hooks: ['ocapi_hooks', 'scapi_hooks', 'scapi_custom_endpoint'],
      services: ['localserviceregistry'],
      quality: ['performance', 'security']
    };

    // Required fields for each guide
    this.requiredFields = ['name', 'title', 'description'];
  }

  analyzeGuideList(guideArray) {
    const analysis = {
      totalGuides: guideArray.length,
      foundGuides: new Set(),
      missingGuides: [],
      missingCriticalGuides: [],
      foundCriticalGuides: [],
      invalidGuides: [],
      duplicates: [],
      guidesByCategory: {},
      validationErrors: []
    };

    // Initialize category counters
    Object.keys(this.guideCategories).forEach(category => {
      analysis.guidesByCategory[category] = [];
    });

    // Analyze each guide
    const seenGuides = new Set();
    guideArray.forEach((guide, index) => {
      // Validate guide structure
      const structureErrors = this.validateGuideStructure(guide, index);
      if (structureErrors.length > 0) {
        analysis.validationErrors.push(...structureErrors);
        analysis.invalidGuides.push(guide);
        return;
      }

      const guideName = guide.name;

      // Check for duplicates
      if (seenGuides.has(guideName)) {
        analysis.duplicates.push(guideName);
        return;
      }
      seenGuides.add(guideName);
      analysis.foundGuides.add(guideName);

      // Check critical guides
      if (this.criticalGuides.includes(guideName)) {
        analysis.foundCriticalGuides.push(guideName);
      }

      // Categorize guide
      let categorized = false;
      Object.entries(this.guideCategories).forEach(([category, guides]) => {
        if (guides.includes(guideName)) {
          analysis.guidesByCategory[category].push(guideName);
          categorized = true;
        }
      });

      if (!categorized) {
        if (!analysis.guidesByCategory.other) {
          analysis.guidesByCategory.other = [];
        }
        analysis.guidesByCategory.other.push(guideName);
      }
    });

    // Find missing guides
    analysis.missingGuides = this.expectedGuides.filter(
      guide => !analysis.foundGuides.has(guide)
    );

    // Find missing critical guides
    analysis.missingCriticalGuides = this.criticalGuides.filter(
      guide => !analysis.foundCriticalGuides.includes(guide)
    );

    return analysis;
  }

  validateGuideStructure(guide, index) {
    const errors = [];

    if (typeof guide !== 'object' || guide === null) {
      errors.push(`Guide at index ${index} is not an object`);
      return errors;
    }

    // Check required fields
    this.requiredFields.forEach(field => {
      if (!Object.prototype.hasOwnProperty.call(guide, field)) {
        errors.push(`Guide at index ${index} missing required field: ${field}`);
      } else if (typeof guide[field] !== 'string') {
        errors.push(`Guide at index ${index} field ${field} should be string, got ${typeof guide[field]}`);
      } else if (guide[field].trim().length === 0) {
        errors.push(`Guide at index ${index} field ${field} is empty`);
      }
    });

    // Validate name format (should be lowercase with underscores)
    if (guide.name && !/^[a-z][a-z0-9_]*$/.test(guide.name)) {
      errors.push(`Guide at index ${index} has invalid name format: ${guide.name}`);
    }

    // Validate title format (should contain "Best Practices")
    if (guide.title && !guide.title.includes('Best Practices')) {
      errors.push(`Guide at index ${index} title should contain "Best Practices": ${guide.title}`);
    }

    // Validate description length (should be meaningful)
    if (guide.description && guide.description.length < 20) {
      errors.push(`Guide at index ${index} description too short: ${guide.description.length} chars`);
    }

    return errors;
  }

  validateCompleteness(analysis) {
    const issues = [];

    if (analysis.totalGuides < 13) {
      issues.push(`Guide count too low: ${analysis.totalGuides} (expected 13+)`);
    }

    if (analysis.missingGuides.length > 0) {
      issues.push(`Missing guides: ${analysis.missingGuides.join(', ')}`);
    }

    if (analysis.missingCriticalGuides.length > 0) {
      issues.push(`Missing critical guides: ${analysis.missingCriticalGuides.join(', ')}`);
    }

    if (analysis.duplicates.length > 0) {
      issues.push(`Duplicate guides found: ${analysis.duplicates.length}`);
    }

    if (analysis.invalidGuides.length > 0) {
      issues.push(`Invalid guides found: ${analysis.invalidGuides.length}`);
    }

    if (analysis.validationErrors.length > 0) {
      issues.push(`Validation errors: ${analysis.validationErrors.length}`);
    }

    return issues;
  }
}

/**
 * Helper function to validate MCP response structure
 */
function assertValidMCPResponse(result) {
  assert.ok(result.content, 'Response should have content');
  assert.ok(Array.isArray(result.content), 'Content should be array');
  assert.equal(typeof result.isError, 'boolean', 'isError should be boolean');
}

describe('get_available_best_practice_guides Programmatic Tests', () => {
  let client;
  const bestPracticeAnalyzer = new BestPracticeAnalyzer();

  before(async () => {
    client = await connect('./aegis.config.docs-only.json');
  });

  after(async () => {
    if (client?.connected) {
      await client.disconnect();
    }
  });

  beforeEach(() => {
    client.clearAllBuffers();
  });

  describe('Protocol Compliance', () => {
    test('should be properly connected to MCP server', async () => {
      assert.ok(client.connected, 'Client should be connected');
    });

    test('should have get_available_best_practice_guides tool available', async () => {
      const tools = await client.listTools();
      const guidesTool = tools.find(tool => tool.name === 'get_available_best_practice_guides');
      
      assert.ok(guidesTool, 'get_available_best_practice_guides tool should be available');
      assert.equal(guidesTool.name, 'get_available_best_practice_guides');
      assert.ok(guidesTool.description, 'Tool should have description');
      assert.ok(guidesTool.inputSchema, 'Tool should have input schema');
    });

    test('should have correct tool input schema', async () => {
      const tools = await client.listTools();
      const guidesTool = tools.find(tool => tool.name === 'get_available_best_practice_guides');
      
      assert.equal(guidesTool.inputSchema.type, 'object');
      // get_available_best_practice_guides takes no required parameters
      assert.ok(!guidesTool.inputSchema.required || guidesTool.inputSchema.required.length === 0);
    });
  });

  describe('Basic Functionality', () => {
    test('should execute successfully with empty parameters', async () => {
      const result = await client.callTool('get_available_best_practice_guides', {});
      
      assertValidMCPResponse(result);
      assert.equal(result.isError, false, 'Should not return error');
      assert.equal(result.content.length, 1, 'Should return single content item');
      assert.equal(result.content[0].type, 'text', 'Content type should be text');
    });

    test('should return valid JSON array in response', async () => {
      const result = await client.callTool('get_available_best_practice_guides', {});
      
      assertValidMCPResponse(result);
      const responseText = result.content[0].text;
      
      // Should be valid JSON
      let guideArray;
      assert.doesNotThrow(() => {
        guideArray = JSON.parse(responseText);
      }, 'Response should be valid JSON');
      
      assert.ok(Array.isArray(guideArray), 'Response should be JSON array');
      assert.ok(guideArray.length > 0, 'Guide array should not be empty');
    });

    test('should ignore additional parameters gracefully', async () => {
      const result = await client.callTool('get_available_best_practice_guides', {
        unexpectedParam: 'should be ignored',
        anotherParam: 123,
        objectParam: { nested: 'value' }
      });
      
      assertValidMCPResponse(result);
      assert.equal(result.isError, false, 'Should handle extra params gracefully');
      
      // Result should be identical to empty params call
      const baselineResult = await client.callTool('get_available_best_practice_guides', {});
      assert.equal(result.content[0].text, baselineResult.content[0].text, 
        'Result should be identical regardless of extra params');
    });
  });

  describe('Content Quality and Completeness', () => {
    test('should return comprehensive best practice guide coverage', async () => {
      const result = await client.callTool('get_available_best_practice_guides', {});
      const guideArray = JSON.parse(result.content[0].text);
      const analysis = bestPracticeAnalyzer.analyzeGuideList(guideArray);
      
      // Validate completeness
      const issues = bestPracticeAnalyzer.validateCompleteness(analysis);
      assert.equal(issues.length, 0, `Content issues found: ${issues.join('; ')}`);
      
      // Verify substantial guide count
      assert.ok(analysis.totalGuides >= 13, 
        `Should have substantial guide count (got ${analysis.totalGuides})`);
    });

    test('should include all critical best practice guides', async () => {
      const result = await client.callTool('get_available_best_practice_guides', {});
      const guideArray = JSON.parse(result.content[0].text);
      const analysis = bestPracticeAnalyzer.analyzeGuideList(guideArray);
      
      bestPracticeAnalyzer.criticalGuides.forEach(guideName => {
        assert.ok(analysis.foundGuides.has(guideName), 
          `Missing critical guide: ${guideName}`);
      });
      
      // All critical guides should be found
      assert.equal(analysis.missingCriticalGuides.length, 0,
        `Missing critical guides: ${analysis.missingCriticalGuides.join(', ')}`);
    });

    test('should have proper guide structure for all guides', async () => {
      const result = await client.callTool('get_available_best_practice_guides', {});
      const guideArray = JSON.parse(result.content[0].text);
      
      guideArray.forEach((guide, index) => {
        // Validate required fields
        bestPracticeAnalyzer.requiredFields.forEach(field => {
          assert.ok(Object.prototype.hasOwnProperty.call(guide, field), 
            `Guide ${index} missing field: ${field}`);
          assert.equal(typeof guide[field], 'string', 
            `Guide ${index} field ${field} should be string`);
          assert.ok(guide[field].trim().length > 0, 
            `Guide ${index} field ${field} should not be empty`);
        });

        // Validate name format
        assert.ok(/^[a-z][a-z0-9_]*$/.test(guide.name), 
          `Guide ${index} has invalid name format: ${guide.name}`);

        // Validate title contains "Best Practices"
        assert.ok(guide.title.includes('Best Practices'), 
          `Guide ${index} title should contain "Best Practices": ${guide.title}`);

        // Validate description length
        assert.ok(guide.description.length >= 20, 
          `Guide ${index} description too short: ${guide.description}`);
      });
    });

    test('should cover all major SFCC development areas', async () => {
      const result = await client.callTool('get_available_best_practice_guides', {});
      const guideArray = JSON.parse(result.content[0].text);
      const analysis = bestPracticeAnalyzer.analyzeGuideList(guideArray);
      
      // Check each category has coverage
      Object.entries(bestPracticeAnalyzer.guideCategories).forEach(([category, expectedGuides]) => {
        const foundInCategory = analysis.guidesByCategory[category] || [];
        assert.ok(foundInCategory.length > 0, 
          `Category ${category} should have at least one guide`);
        
        // Check that most expected guides in category are present
        const coverageRatio = foundInCategory.length / expectedGuides.length;
        assert.ok(coverageRatio >= 0.5, 
          `Category ${category} should have good coverage (${foundInCategory.length}/${expectedGuides.length})`);
      });
    });

    test('should not have duplicate or invalid guides', async () => {
      const result = await client.callTool('get_available_best_practice_guides', {});
      const guideArray = JSON.parse(result.content[0].text);
      const analysis = bestPracticeAnalyzer.analyzeGuideList(guideArray);
      
      assert.equal(analysis.duplicates.length, 0, 
        `Found duplicate guides: ${analysis.duplicates.join(', ')}`);
      
      assert.equal(analysis.invalidGuides.length, 0, 
        `Found invalid guides: ${analysis.invalidGuides.length}`);
      
      assert.equal(analysis.validationErrors.length, 0, 
        `Validation errors: ${analysis.validationErrors.join('; ')}`);
    });
  });

  describe('Content Validation', () => {
    test('should include expected core guides', async () => {
      const result = await client.callTool('get_available_best_practice_guides', {});
      const guideArray = JSON.parse(result.content[0].text);
      const guideNames = guideArray.map(guide => guide.name);
      
      // Check specific expected guides
      const expectedCoreGuides = [
        'cartridge_creation',
        'sfra_controllers', 
        'sfra_models',
        'sfra_client_side_js',
        'sfra_scss',
        'ocapi_hooks',
        'scapi_hooks',
        'security',
        'performance'
      ];
      
      expectedCoreGuides.forEach(guideName => {
        assert.ok(guideNames.includes(guideName), 
          `Should include core guide: ${guideName}`);
      });
    });

    test('should have meaningful guide descriptions', async () => {
      const result = await client.callTool('get_available_best_practice_guides', {});
      const guideArray = JSON.parse(result.content[0].text);
      
      guideArray.forEach(guide => {
        // Description should be substantial
        assert.ok(guide.description.length >= 50, 
          `Guide ${guide.name} description should be substantial: ${guide.description.length} chars`);
        
        // Description should be related to the guide name
        const nameWords = guide.name.split('_');
        const hasRelatedContent = nameWords.some(word => 
          guide.description.toLowerCase().includes(word.toLowerCase())
        );
        assert.ok(hasRelatedContent || guide.description.toLowerCase().includes('sfcc') || 
          guide.description.toLowerCase().includes('commerce'), 
          `Guide ${guide.name} description should be related to guide name or SFCC`);
      });
    });

    test('should provide guides for different skill levels', async () => {
      const result = await client.callTool('get_available_best_practice_guides', {});
      const guideArray = JSON.parse(result.content[0].text);
      
      // Should have guides for beginners (cartridge creation)
      const beginnerGuides = guideArray.filter(guide => 
        guide.name.includes('cartridge') || 
        guide.description.toLowerCase().includes('introduction') ||
        guide.description.toLowerCase().includes('getting started')
      );
      
      // Should have advanced guides (security, performance)
      const advancedGuides = guideArray.filter(guide => 
        guide.name.includes('security') || 
        guide.name.includes('performance') ||
        guide.description.toLowerCase().includes('advanced') ||
        guide.description.toLowerCase().includes('optimization')
      );
      
      assert.ok(beginnerGuides.length > 0, 'Should have guides for beginners');
      assert.ok(advancedGuides.length > 0, 'Should have guides for advanced users');
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle malformed parameters gracefully', async () => {
      // Test with various edge case parameters that are still valid objects
      const edgeCases = [
        {},  // Empty object (valid)
        { malformed: 'data' },
        { nested: { deeply: { malformed: 'data' } } },
        { randomField: null },
        { arrayField: [1, 2, 3] },
        { booleanField: true }
      ];
      
      for (const params of edgeCases) {
        const result = await client.callTool('get_available_best_practice_guides', params);
        
        assertValidMCPResponse(result);
        assert.equal(result.isError, false, 
          `Should handle edge case gracefully: ${JSON.stringify(params)}`);
        
        // Result should still be valid
        const guideArray = JSON.parse(result.content[0].text);
        assert.ok(Array.isArray(guideArray), 'Should still return valid array');
        assert.ok(guideArray.length > 0, 'Should still return guides');
      }
    });

    test('should maintain functionality under rapid consecutive calls', async () => {
      const rapidCalls = 10;
      const promises = Array.from({ length: rapidCalls }, () => 
        client.callTool('get_available_best_practice_guides', {})
      );
      
      const results = await Promise.all(promises);
      
      results.forEach((result, index) => {
        assertValidMCPResponse(result);
        assert.equal(result.isError, false, `Rapid call ${index} should succeed`);
        
        const guideArray = JSON.parse(result.content[0].text);
        assert.ok(Array.isArray(guideArray), `Rapid call ${index} should return array`);
        assert.ok(guideArray.length > 0, `Rapid call ${index} should return guides`);
      });
      
      // All results should be identical
      const firstResponse = results[0].content[0].text;
      results.forEach((result, index) => {
        assert.equal(result.content[0].text, firstResponse, 
          `Rapid call ${index} result should be identical`);
      });
    });
  });
});
