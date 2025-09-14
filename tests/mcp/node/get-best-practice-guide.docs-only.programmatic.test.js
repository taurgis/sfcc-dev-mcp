/**
 * Programmatic tests for get_best_practice_guide tool
 * 
 * These tests provide advanced verification capabilities beyond YAML pattern matching,
 * including dynamic validation, comprehensive content analysis,
 * cross-guide relationship testing, and advanced error categorization for the SFCC
 * best practice guide retrieval functionality.
 * 
 * Response format discovered via conductor query:
 * - Success: { content: [{ type: "text", text: "{\"title\":\"...\",\"description\":\"...\",\"sections\":[...],\"content\":\"...\"}" }], isError: false }
 * - Error: { content: [{ type: "text", text: "Error: guideName must be a non-empty string" }], isError: true }
 * - Invalid guide: { content: [{ type: "text", text: "null" }], isError: false }
 * - JSON structure: title, description, sections array, content markdown
 */

import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-conductor';

/**
 * Content analysis utility for comprehensive guide validation
 */
class ContentAnalyzer {
  constructor() {
    this.contentPatterns = {
      security: [
        /CSRF|cross-site request forgery/i,
        /XSS|cross-site scripting/i,
        /authentication|authorization/i,
        /encryption|cryptography/i,
        /validation|sanitization/i
      ],
      performance: [
        /performance|optimization/i,
        /caching|cache/i,
        /memory|cpu/i,
        /scalability|throughput/i,
        /monitoring|metrics/i
      ],
      sfra: [
        /controller|middleware/i,
        /server\.get|server\.post/i,
        /SFRA|storefront reference architecture/i,
        /isml|template/i,
        /model|view/i
      ],
      cartridge: [
        /cartridge path/i,
        /override mechanism/i,
        /app_storefront_base/i,
        /plugin_|app_custom_|int_|bm_/i,
        /deployment|upload/i
      ]
    };
  }

  analyzeGuide(guideData) {
    const analysis = {
      structuralIntegrity: this.checkStructuralIntegrity(guideData),
      contentDepth: this.assessContentDepth(guideData),
      codeExamples: this.extractCodeExamples(guideData),
      crossReferences: this.findCrossReferences(guideData),
      technicalAccuracy: this.validateTechnicalContent(guideData),
      readabilityMetrics: this.calculateReadabilityMetrics(guideData)
    };

    return analysis;
  }

  checkStructuralIntegrity(guideData) {
    const requiredFields = ['title', 'description', 'sections', 'content'];
    const missingFields = requiredFields.filter(field => !guideData[field]);
    
    return {
      isComplete: missingFields.length === 0,
      missingFields,
      sectionsCount: Array.isArray(guideData.sections) ? guideData.sections.length : 0,
      hasValidMarkdown: typeof guideData.content === 'string' && guideData.content.includes('#')
    };
  }

  assessContentDepth(guideData) {
    const content = guideData.content || '';
    const wordCount = content.split(/\s+/).length;
    const paragraphCount = content.split('\n\n').length;
    const headingCount = (content.match(/^#+\s/gm) || []).length;
    
    return {
      wordCount,
      paragraphCount,
      headingCount,
      averageWordsPerParagraph: wordCount / Math.max(paragraphCount, 1),
      depthScore: this.calculateDepthScore(wordCount, headingCount, paragraphCount)
    };
  }

  calculateDepthScore(wordCount, headingCount, paragraphCount) {
    // Scoring based on content richness
    let score = 0;
    if (wordCount > 2000) score += 3;
    else if (wordCount > 1000) score += 2;
    else if (wordCount > 500) score += 1;
    
    if (headingCount > 8) score += 2;
    else if (headingCount > 4) score += 1;
    
    if (paragraphCount > 15) score += 2;
    else if (paragraphCount > 8) score += 1;
    
    return Math.min(score, 5); // Max score of 5
  }

  extractCodeExamples(guideData) {
    const content = guideData.content || '';
    const codeBlocks = content.match(/```[\s\S]*?```/g) || [];
    const inlineCode = content.match(/`[^`\n]+`/g) || [];
    
    const languages = codeBlocks.map(block => {
      const match = block.match(/```(\w+)/);
      return match ? match[1] : 'unknown';
    });

    return {
      codeBlockCount: codeBlocks.length,
      inlineCodeCount: inlineCode.length,
      languages: [...new Set(languages)],
      hasJavaScript: languages.includes('javascript'),
      hasJSON: languages.includes('json'),
      hasBash: languages.includes('bash'),
      hasHTML: languages.includes('html') || languages.includes('isml')
    };
  }

  findCrossReferences(guideData) {
    const content = guideData.content || '';
    const mcpReferences = (content.match(/MCP server|MCP tool|`\w+_\w+`/g) || []).length;
    const sfccReferences = (content.match(/dw\.\w+|SFCC|Salesforce Commerce Cloud/g) || []).length;
    const externalReferences = (content.match(/https?:\/\/[^\s)]+/g) || []).length;
    
    return {
      mcpReferences,
      sfccReferences,
      externalReferences,
      totalReferences: mcpReferences + sfccReferences + externalReferences,
      hasIntegrationWorkflow: content.includes('MCP Integration Workflow')
    };
  }

  validateTechnicalContent(guideData) {
    const content = guideData.content || '';
    const guideName = this.inferGuideType(guideData);
    const expectedPatterns = this.contentPatterns[guideName] || [];
    
    const matchedPatterns = expectedPatterns.filter(pattern => pattern.test(content));
    
    return {
      guideName,
      expectedPatterns: expectedPatterns.length,
      matchedPatterns: matchedPatterns.length,
      accuracyScore: expectedPatterns.length > 0 ? 
        (matchedPatterns.length / expectedPatterns.length) : 1,
      hasDeprecatedReferences: /WeakCipher|WeakMac|WeakMessageDigest/i.test(content),
      hasModernPractices: /dw\.crypto\.Cipher|server\.append|server\.prepend/i.test(content)
    };
  }

  inferGuideType(guideData) {
    const title = (guideData.title || '').toLowerCase();
    if (title.includes('security')) return 'security';
    if (title.includes('performance')) return 'performance';
    if (title.includes('sfra') || title.includes('controller')) return 'sfra';
    if (title.includes('cartridge')) return 'cartridge';
    return 'general';
  }

  calculateReadabilityMetrics(guideData) {
    const content = guideData.content || '';
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = content.split(/\s+/).filter(w => w.length > 0);
    
    const avgWordsPerSentence = words.length / Math.max(sentences.length, 1);
    const avgCharsPerWord = words.reduce((sum, word) => sum + word.length, 0) / Math.max(words.length, 1);
    
    return {
      sentenceCount: sentences.length,
      wordCount: words.length,
      avgWordsPerSentence,
      avgCharsPerWord,
      readabilityScore: this.calculateFleschScore(avgWordsPerSentence, avgCharsPerWord)
    };
  }

  calculateFleschScore(avgWordsPerSentence, avgCharsPerWord) {
    // Simplified Flesch Reading Ease approximation
    return Math.max(0, 206.835 - (1.015 * avgWordsPerSentence) - (84.6 * (avgCharsPerWord / 4.7)));
  }
}

/**
 * Error categorization utility for comprehensive error analysis
 */
class ErrorAnalyzer {
  static categorizeError(errorText) {
    const patterns = [
      { type: 'validation', keywords: ['required', 'invalid', 'missing', 'empty string'] },
      { type: 'not_found', keywords: ['not found', 'does not exist', 'null'] },
      { type: 'permission', keywords: ['permission', 'unauthorized', 'forbidden'] },
      { type: 'network', keywords: ['connection', 'timeout', 'unreachable'] },
      { type: 'parsing', keywords: ['parse', 'syntax', 'format'] }
    ];

    for (const pattern of patterns) {
      if (pattern.keywords.some(keyword => 
          errorText.toLowerCase().includes(keyword))) {
        return pattern.type;
      }
    }
    return 'unknown';
  }

  static assessErrorQuality(errorText) {
    return {
      isInformative: errorText.length > 20,
      hasContext: errorText.includes('guideName'),
      isActionable: /must|should|required|expected/i.test(errorText),
      category: this.categorizeError(errorText)
    };
  }
}

/**
 * Custom assertion helpers for MCP response validation
 */
function assertValidMCPResponse(result, expectError = false) {
  assert.ok(result.content, 'Should have content');
  assert.ok(Array.isArray(result.content), 'Content should be array');
  assert.equal(typeof result.isError, 'boolean', 'isError should be boolean');
  assert.equal(result.isError, expectError, `isError should be ${expectError}`);
}

function assertGuideContent(result, expectedGuideName) {
  assertValidMCPResponse(result);
  assert.equal(result.content[0].type, 'text');
  
  const text = result.content[0].text;
  if (text === 'null') {
    // Invalid guide name returns null
    return null;
  }
  
  const guideData = JSON.parse(text);
  assert.ok(guideData.title, 'Guide should have title');
  assert.ok(guideData.description, 'Guide should have description');
  assert.ok(Array.isArray(guideData.sections), 'Guide should have sections array');
  assert.ok(guideData.content, 'Guide should have content');
  
  if (expectedGuideName) {
    assert.ok(
      guideData.title.toLowerCase().includes(expectedGuideName.replace('_', ' ')) ||
      guideData.description.toLowerCase().includes(expectedGuideName.replace('_', ' ')),
      `Guide should be related to ${expectedGuideName}`
    );
  }
  
  return guideData;
}

function assertErrorResponse(result, expectedErrorType) {
  assertValidMCPResponse(result, true);
  assert.equal(result.content[0].type, 'text');
  
  const errorText = result.content[0].text;
  assert.ok(errorText.includes('Error:'), 'Should be error message');
  
  const errorAnalysis = ErrorAnalyzer.assessErrorQuality(errorText);
  assert.ok(errorAnalysis.isInformative, 'Error should be informative');
  
  if (expectedErrorType) {
    assert.equal(errorAnalysis.category, expectedErrorType, 
      `Error should be categorized as ${expectedErrorType}`);
  }
  
  return errorAnalysis;
}

describe('get_best_practice_guide Tool - Advanced Programmatic Tests', () => {
  let client;
  let contentAnalyzer;

  before(async () => {
    client = await connect('./conductor.config.docs-only.json');
    contentAnalyzer = new ContentAnalyzer();
  });

  after(async () => {
    if (client?.connected) {
      await client.disconnect();
    }
  });

  beforeEach(() => {
    // CRITICAL: Clear all buffers to prevent leaking between tests
    client.clearAllBuffers(); // Recommended - comprehensive protection
  });

  describe('Protocol Compliance and Basic Functionality', () => {
    test('should retrieve valid cartridge creation guide', async () => {
      const result = await client.callTool('get_best_practice_guide', {
        guideName: 'cartridge_creation'
      });

      const guideData = assertGuideContent(result, 'cartridge');
      assert.ok(guideData.title.includes('Cartridge'), 'Should be cartridge guide');
      assert.ok(guideData.content.includes('Core Principles'), 'Should have core principles');
    });

    test('should retrieve security best practices guide', async () => {
      const result = await client.callTool('get_best_practice_guide', {
        guideName: 'security'
      });

      const guideData = assertGuideContent(result, 'security');
      assert.ok(guideData.title.toLowerCase().includes('secure') || 
        guideData.title.toLowerCase().includes('security'), 'Should be security guide');
      assert.ok(guideData.content.includes('CSRF') || guideData.content.includes('XSS') || 
        guideData.content.includes('Security'), 'Should contain security concepts');
    });

    test('should handle invalid guide name gracefully', async () => {
      const result = await client.callTool('get_best_practice_guide', {
        guideName: 'nonexistent_guide'
      });

      assertValidMCPResponse(result);
      assert.equal(result.content[0].text, 'null', 'Should return null for invalid guide');
    });

    test('should validate required parameters', async () => {
      const result = await client.callTool('get_best_practice_guide', {});
      
      assertErrorResponse(result, 'validation');
    });

    test('should handle empty guide name', async () => {
      const result = await client.callTool('get_best_practice_guide', {
        guideName: ''
      });
      
      assertErrorResponse(result, 'validation');
    });
  });

  describe('Comprehensive Guide Validation', () => {
    const availableGuides = [
      'cartridge_creation',
      'security', 
      'performance',
      'sfra_controllers',
      'sfra_models',
      'ocapi_hooks',
      'scapi_hooks',
      'scapi_custom_endpoint',
      'isml_templates',
      'job_framework',
      'localserviceregistry'
    ];

    test('should validate all available guides have proper structure', async () => {
      const guideAnalyses = new Map();

      for (const guideName of availableGuides) {
        const result = await client.callTool('get_best_practice_guide', {
          guideName
        });

        const guideData = assertGuideContent(result);
        const analysis = contentAnalyzer.analyzeGuide(guideData);
        guideAnalyses.set(guideName, analysis);

        // Structural integrity checks
        assert.ok(analysis.structuralIntegrity.isComplete, 
          `${guideName} should have complete structure`);
        assert.ok(analysis.structuralIntegrity.sectionsCount > 0, 
          `${guideName} should have sections`);
        assert.ok(analysis.structuralIntegrity.hasValidMarkdown, 
          `${guideName} should have valid markdown`);

        // Content depth validation
        assert.ok(analysis.contentDepth.wordCount > 500, 
          `${guideName} should have substantial content (>500 words)`);
        assert.ok(analysis.contentDepth.depthScore >= 2, 
          `${guideName} should have good content depth`);
      }

      // Analyze overall guide quality
      const averageDepthScore = Array.from(guideAnalyses.values())
        .reduce((sum, analysis) => sum + analysis.contentDepth.depthScore, 0) / 
        guideAnalyses.size;
      
      assert.ok(averageDepthScore >= 3, 
        `Average guide depth score should be >= 3, got ${averageDepthScore}`);
    });

    test('should validate technical accuracy across guide types', async () => {
      const techGuides = ['security', 'sfra_controllers', 'cartridge_creation'];
      
      for (const guideName of techGuides) {
        const result = await client.callTool('get_best_practice_guide', {
          guideName
        });

        const guideData = assertGuideContent(result);
        const analysis = contentAnalyzer.analyzeGuide(guideData);

        // Technical accuracy validation
        assert.ok(analysis.technicalAccuracy.accuracyScore >= 0.7, 
          `${guideName} should have high technical accuracy`);
        
        // Modern practices validation
        if (guideName === 'security') {
          assert.ok(analysis.technicalAccuracy.hasModernPractices, 
            'Security guide should reference modern practices');
          assert.ok(!analysis.technicalAccuracy.hasDeprecatedReferences ||
            analysis.technicalAccuracy.hasModernPractices,
            'Security guide should prefer modern over deprecated practices');
        }

        // Code examples validation
        if (['sfra_controllers', 'cartridge_creation'].includes(guideName)) {
          assert.ok(analysis.codeExamples.codeBlockCount > 0, 
            `${guideName} should have code examples`);
          assert.ok(analysis.codeExamples.hasJavaScript, 
            `${guideName} should have JavaScript examples`);
        }
      }
    });

    test('should validate cross-references and integration patterns', async () => {
      const result = await client.callTool('get_best_practice_guide', {
        guideName: 'cartridge_creation'
      });

      const guideData = assertGuideContent(result);
      const analysis = contentAnalyzer.analyzeGuide(guideData);

      // Cross-reference validation
      assert.ok(analysis.crossReferences.mcpReferences > 0, 
        'Cartridge guide should reference MCP tools');
      assert.ok(analysis.crossReferences.hasIntegrationWorkflow, 
        'Cartridge guide should have MCP integration workflow');
      assert.ok(analysis.crossReferences.sfccReferences > 0, 
        'Cartridge guide should reference SFCC concepts');
    });
  });

  describe('Advanced Error Handling and Edge Cases', () => {
    test('should provide detailed error categorization', async () => {
      const errorScenarios = [
        { params: {}, expectedCategory: 'validation' },
        { params: { guideName: '' }, expectedCategory: 'validation' },
        { params: { guideName: null }, expectedCategory: 'validation' },
        { params: { guideName: 123 }, expectedCategory: 'validation' }
      ];

      for (const scenario of errorScenarios) {
        const result = await client.callTool('get_best_practice_guide', scenario.params);
        
        if (result.isError) {
          const errorAnalysis = assertErrorResponse(result, scenario.expectedCategory);
          assert.ok(errorAnalysis.isActionable, 
            'Error message should be actionable');
        } else {
          // Some invalid params might return null instead of error
          assert.equal(result.content[0].text, 'null', 
            'Invalid params should return null if not error');
        }
      }
    });

    test('should handle malformed requests gracefully', async () => {
      const malformedScenarios = [
        { guideName: 'a'.repeat(1000) }, // Very long guide name
        { guideName: 'guide\nwith\nnewlines' }, // Guide name with newlines
        { guideName: 'guide with spaces' }, // Guide name with spaces
        { extraParam: 'unexpected', guideName: 'security' } // Extra parameters
      ];

      for (const params of malformedScenarios) {
        const result = await client.callTool('get_best_practice_guide', params);
        
        // Should either return valid response or informative error
        if (result.isError) {
          assertErrorResponse(result);
        } else {
          // If it succeeds or returns null, that's also acceptable
          assertValidMCPResponse(result);
        }
      }
    });

    test('should maintain consistency across error conditions', async () => {
      const errorConditions = [
        { guideName: 'invalid1' },
        { guideName: 'invalid2' },
        { guideName: 'nonexistent' }
      ];

      const errorResponses = [];
      for (const params of errorConditions) {
        const result = await client.callTool('get_best_practice_guide', params);
        errorResponses.push(result);
      }

      // All invalid guide names should behave consistently
      const responseTypes = errorResponses.map(r => 
        r.isError ? 'error' : (r.content[0].text === 'null' ? 'null' : 'unexpected')
      );
      
      const uniqueResponseTypes = [...new Set(responseTypes)];
      assert.equal(uniqueResponseTypes.length, 1, 
        'All invalid guide names should have consistent response type');
    });
  });

  describe('Multi-Step Integration Workflows', () => {
    test('should support guide discovery to detailed retrieval workflow', async () => {
      // Step 1: Discover available guides
      const availableResult = await client.callTool('get_available_best_practice_guides', {});
      assertValidMCPResponse(availableResult);
      
      const availableGuides = JSON.parse(availableResult.content[0].text);
      assert.ok(Array.isArray(availableGuides), 'Should return guides array');
      assert.ok(availableGuides.length > 0, 'Should have available guides');

      // Step 2: Retrieve detailed guide for each discovered guide
      for (const guide of availableGuides.slice(0, 3)) { // Test first 3 for performance
        const detailResult = await client.callTool('get_best_practice_guide', {
          guideName: guide.name
        });

        const guideData = assertGuideContent(detailResult);
        
        // Validate consistency between discovery and detailed retrieval
        // Note: Descriptions may be slightly different between discovery and detailed view
        assert.ok(guideData.description.toLowerCase().includes('best practices') ||
          guideData.description.toLowerCase().includes('guide') ||
          guide.description.toLowerCase().includes('best practices'), 
          'Guide descriptions should be conceptually consistent');
      }
    });

    test('should support cross-guide relationship analysis', async () => {
      // Get related guides
      const cartridgeResult = await client.callTool('get_best_practice_guide', {
        guideName: 'cartridge_creation'
      });
      const securityResult = await client.callTool('get_best_practice_guide', {
        guideName: 'security'
      });
      const sfraResult = await client.callTool('get_best_practice_guide', {
        guideName: 'sfra_controllers'
      });

      const cartridgeGuide = assertGuideContent(cartridgeResult);
      const securityGuide = assertGuideContent(securityResult);
      const sfraGuide = assertGuideContent(sfraResult);

      // Analyze cross-references between guides
      const cartridgeAnalysis = contentAnalyzer.analyzeGuide(cartridgeGuide);
      const securityAnalysis = contentAnalyzer.analyzeGuide(securityGuide);
      const sfraAnalysis = contentAnalyzer.analyzeGuide(sfraGuide);

      // Validate that guides appropriately reference each other
      assert.ok(cartridgeAnalysis.crossReferences.mcpReferences > 0, 
        'Cartridge guide should reference other MCP tools');
      
      // Security guide should have practical implementation focus
      assert.ok(securityAnalysis.codeExamples.codeBlockCount > 0, 
        'Security guide should have code examples');
      
      // SFRA guide should reference server concepts
      assert.ok(sfraAnalysis.technicalAccuracy.hasModernPractices, 
        'SFRA guide should reference modern practices');
    });

    test('should validate comprehensive development workflow coverage', async () => {
      // Simulate a complete development workflow
      const workflowGuides = [
        'cartridge_creation',  // Project setup
        'sfra_controllers',   // Implementation
        'security',           // Security review
        'performance'         // Optimization
      ];

      const workflowAnalysis = new Map();

      for (const guideName of workflowGuides) {
        const result = await client.callTool('get_best_practice_guide', {
          guideName
        });

        const guideData = assertGuideContent(result);
        const analysis = contentAnalyzer.analyzeGuide(guideData);
        workflowAnalysis.set(guideName, analysis);
      }

      // Validate workflow completeness
      const totalCodeExamples = Array.from(workflowAnalysis.values())
        .reduce((sum, analysis) => sum + analysis.codeExamples.codeBlockCount, 0);
      
      assert.ok(totalCodeExamples >= 10, 
        'Workflow guides should provide substantial code examples');

      const totalCrossReferences = Array.from(workflowAnalysis.values())
        .reduce((sum, analysis) => sum + analysis.crossReferences.totalReferences, 0);
      
      assert.ok(totalCrossReferences >= 20, 
        'Workflow guides should have extensive cross-references');

      // Validate that each workflow stage has appropriate depth
      workflowAnalysis.forEach((analysis, guideName) => {
        assert.ok(analysis.contentDepth.depthScore >= 3, 
          `${guideName} should have sufficient depth for workflow stage`);
      });
    });
  });

  describe('Content Quality and Accessibility', () => {
    test('should validate readability across all guides', async () => {
      const testGuides = ['cartridge_creation', 'security', 'sfra_controllers'];
      
      for (const guideName of testGuides) {
        const result = await client.callTool('get_best_practice_guide', {
          guideName
        });

        const guideData = assertGuideContent(result);
        const analysis = contentAnalyzer.analyzeGuide(guideData);

        // Readability validation
        assert.ok(analysis.readabilityMetrics.avgWordsPerSentence < 25, 
          `${guideName} should have readable sentence length`);
        assert.ok(analysis.readabilityMetrics.readabilityScore > 30, 
          `${guideName} should have acceptable readability score`);
        
        // Content structure validation
        assert.ok(analysis.contentDepth.headingCount >= 5, 
          `${guideName} should have good content organization`);
        assert.ok(analysis.contentDepth.averageWordsPerParagraph < 200, 
          `${guideName} should have digestible paragraph sizes`);
      }
    });

    test('should ensure comprehensive coverage of technical topics', async () => {
      const technicalGuides = {
        'security': ['CSRF', 'XSS', 'authentication', 'encryption'],
        'performance': ['performance', 'optimization'], // Simplified expectations
        'sfra_controllers': ['server.get', 'middleware', 'ISML']
      };

      for (const [guideName, expectedTopics] of Object.entries(technicalGuides)) {
        const result = await client.callTool('get_best_practice_guide', {
          guideName
        });

        const guideData = assertGuideContent(result);
        const content = guideData.content.toLowerCase();

        const coveredTopics = expectedTopics.filter(topic => 
          content.includes(topic.toLowerCase())
        );

        const coverageRatio = coveredTopics.length / expectedTopics.length;
        assert.ok(coverageRatio >= 0.7, 
          `${guideName} should cover at least 70% of expected topics, covered ${coverageRatio * 100}%`);
      }
    });
  });
});
