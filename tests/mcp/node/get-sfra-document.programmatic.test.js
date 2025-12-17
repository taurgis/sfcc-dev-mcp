import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

describe('get_sfra_document Tool - Programmatic Tests', () => {
  let client;

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

  describe('Protocol Compliance & Tool Discovery', () => {
    test('should be registered and accessible', async () => {
      const tools = await client.listTools();
      
      const sfraDocTool = tools.find(tool => tool.name === 'get_sfra_document');
      assert.ok(sfraDocTool, 'get_sfra_document tool should be available');
      
      // Validate tool schema structure
      assertToolSchema(sfraDocTool);
      
      // Validate specific schema requirements
      const { inputSchema } = sfraDocTool;
      assert.ok(inputSchema.properties.documentName, 'Should have documentName parameter');
      assert.equal(inputSchema.properties.documentName.type, 'string');
      assert.ok(inputSchema.required.includes('documentName'), 'documentName should be required');
    });

    test('should have comprehensive tool description', async () => {
      const tools = await client.listTools();
      const sfraDocTool = tools.find(tool => tool.name === 'get_sfra_document');
      
      const description = sfraDocTool.description.toLowerCase();
      assert.ok(description.includes('sfra'), 'Description should mention SFRA');
      assert.ok(description.includes('documentation'), 'Description should mention documentation');
      assert.ok(description.includes('sfra') || description.includes('class') || description.includes('model'), 
        'Description should mention SFRA classes or models');
      assert.ok(description.length > 100, 'Description should be comprehensive');
    });
  });

  describe('Core SFRA Documents - Dynamic Discovery', () => {
    const coreDocuments = [
      { name: 'server', expectedContent: ['Class Server', 'middleware', 'routing'] },
      { name: 'request', expectedContent: ['Class Request', 'HTTP', 'session'] },
      { name: 'response', expectedContent: ['Class Response', 'render', 'redirect'] },
      { name: 'querystring', expectedContent: ['QueryString', 'parameters', 'URL'] },
      { name: 'render', expectedContent: ['render', 'template', 'ISML'] }
    ];

    coreDocuments.forEach(({ name, expectedContent }) => {
      test(`should retrieve ${name} document with rich content`, async () => {
        const result = await client.callTool('get_sfra_document', { documentName: name });

        // Basic response validation
        assertValidMCPResponse(result);
        assert.equal(result.isError, false, `${name} document should load successfully`);

        // Parse and validate JSON content
        const documentData = parseDocumentJSON(result.content[0].text);
        
        // Validate document structure
        assertDocumentStructure(documentData, name);
        
        // Validate expected content is present
        expectedContent.forEach(content => {
          assert.ok(
            documentData.content.toLowerCase().includes(content.toLowerCase()),
            `${name} document should contain "${content}"`
          );
        });
      });
    });

    test('should maintain consistent document structure across all core docs', async () => {
      const results = [];
      
      // Process documents sequentially to avoid message stream interference
      for (let i = 0; i < coreDocuments.length; i++) {
        const { name } = coreDocuments[i];
        const result = await client.callTool('get_sfra_document', { documentName: name });
        const documentData = parseDocumentJSON(result.content[0].text);
        results.push({ name, documentData });
      }

      // Validate all documents have consistent structure
      results.forEach(({ name, documentData }) => {
        assert.ok(documentData.title, `${name} should have title`);
        assert.ok(Array.isArray(documentData.sections), `${name} should have sections array`);
        assert.ok(documentData.content, `${name} should have content`);
        assert.ok(documentData.type, `${name} should have type`);
        assert.ok(documentData.category, `${name} should have category`);
        assert.ok(documentData.filename, `${name} should have filename`);
        assert.ok(documentData.lastModified, `${name} should have lastModified`);
        
        // Validate sections are comprehensive
        assert.ok(documentData.sections.length >= 5, `${name} should have at least 5 sections`);
        
        // Validate content is substantial
        assert.ok(documentData.content.length > 1000, `${name} should have substantial content`);
      });
      assert.ok(results.length > 0, 'Should have processed core documents');
    });
  });

  describe('Model Documents - Advanced Validation', () => {
    const modelDocuments = [
      { name: 'product-full', category: 'product', keywords: ['product', 'pricing', 'variation'] },
      { name: 'cart', category: 'order', keywords: ['cart', 'basket', 'items'] },
      { name: 'account', category: 'customer', keywords: ['account', 'customer', 'profile'] },
      { name: 'billing', category: 'order', keywords: ['billing', 'payment', 'address'] },
      { name: 'shipping', category: 'order', keywords: ['shipping', 'delivery', 'address'] }
    ];

    test('should retrieve all model documents with correct categorization', async () => {
      const results = [];
      
      // Process documents sequentially to avoid message stream interference
      for (let i = 0; i < modelDocuments.length; i++) {
        const { name, category, keywords } = modelDocuments[i];
        const result = await client.callTool('get_sfra_document', { documentName: name });
        assert.equal(result.isError, false, `${name} should load successfully`);
        
        const documentData = parseDocumentJSON(result.content[0].text);
        
        // Validate keywords are present in content
        const content = documentData.content.toLowerCase();
        const keywordMatches = keywords.filter(keyword => 
          content.includes(keyword.toLowerCase())
        );
        
        assert.ok(keywordMatches.length >= 1, 
          `${name} should contain at least one keyword: ${keywords.join(', ')}`);
        
        results.push({ name, documentData, category, keywordMatches });
      }

      // Group by category and validate
      const categoryGroups = results.reduce((groups, { name, category }) => {
        if (!groups[category]) groups[category] = [];
        groups[category].push(name);
        return groups;
      }, {});

      // Validate category distribution
      Object.entries(categoryGroups).forEach(([category, docs]) => {
        assert.ok(docs.length > 0, `Category ${category} should have documents`);
      });
    });

    test('should handle hyphenated document names correctly', async () => {
      const hyphenatedDocs = modelDocuments
        .filter(({ name }) => name.includes('-'))
        .map(({ name }) => name);

      assert.ok(hyphenatedDocs.length > 0, 'Should have hyphenated document names to test');

      for (const docName of hyphenatedDocs) {
        const result = await client.callTool('get_sfra_document', { documentName: docName });
        assert.equal(result.isError, false, `Hyphenated document ${docName} should work`);
        
        const documentData = parseDocumentJSON(result.content[0].text);
        // More flexible filename checking - just ensure it's related to the document
        const filenameRelated = documentData.filename.toLowerCase().includes(docName.toLowerCase()) || 
                              documentData.filename.toLowerCase().replace(/-/g, '').includes(docName.toLowerCase().replace(/-/g, '')) ||
                              documentData.title.toLowerCase().includes(docName.toLowerCase().split('-')[0]);
        assert.ok(filenameRelated,
                 `Filename should be related to ${docName}: ${documentData.filename}`);
        
      }
    });
  });

  describe('Case Sensitivity & Input Validation', () => {
    const caseTestCases = [
      { input: 'server', expected: true, description: 'lowercase' },
      { input: 'SERVER', expected: true, description: 'uppercase' },
      { input: 'Server', expected: true, description: 'mixed case' },
      { input: 'SeRvEr', expected: true, description: 'random case' },
      { input: 'request', expected: true, description: 'lowercase request' },
      { input: 'REQUEST', expected: true, description: 'uppercase request' }
    ];

    test('should handle case variations consistently', async () => {
      const results = [];
      
      // Process case variations sequentially to avoid message stream interference
      for (let i = 0; i < caseTestCases.length; i++) {
        const { input, expected, description } = caseTestCases[i];
        const result = await client.callTool('get_sfra_document', { documentName: input });
        const success = !result.isError;
        
        assert.equal(success, expected, 
          `${description} "${input}" should ${expected ? 'succeed' : 'fail'}`);
        
        if (success) {
          const documentData = parseDocumentJSON(result.content[0].text);
          // Case variations should return the same document
          assert.ok(documentData.title.includes('Server') || documentData.title.includes('Request'),
            'Should return valid SFRA document');
        }
        
        results.push({ input, success, description });
        
      }

      // Verify case insensitivity
      const serverVariants = results
        .filter(({ input }) => input.toLowerCase() === 'server')
        .filter(({ success }) => success);

      assert.ok(serverVariants.length > 1, 'Multiple case variations should work for server');
      assert.ok(serverVariants.length > 0, 'Should handle case insensitive variations');
    });

    test('should validate input parameters thoroughly', async () => {
      const invalidInputs = [
        { args: {}, expectedError: 'documentName', description: 'missing parameter' },
        { args: { documentName: '' }, expectedError: 'non-empty', description: 'empty string' },
        { args: { documentName: null }, expectedError: 'string', description: 'null value' },
        { args: { documentName: 123 }, expectedError: 'string', description: 'numeric value' },
        { args: { documentName: 'invalid/path/name' }, expectedError: 'not found', description: 'invalid path' },
        { args: { documentName: 'definitely-does-not-exist' }, expectedError: 'not found', description: 'nonexistent doc' }
      ];

      for (const { args, expectedError, description } of invalidInputs) {
        const result = await client.callTool('get_sfra_document', args);
        
        assert.equal(result.isError, true, `${description} should result in error`);
        assert.ok(result.content[0].text.toLowerCase().includes(expectedError.toLowerCase()),
          `${description} should mention "${expectedError}"`);
        
      }
    });
  });


  describe('Content Quality & Completeness Analysis', () => {
    test('should provide comprehensive documentation content', async () => {
      const qualityChecks = [
        { doc: 'server', minSections: 10, minContentLength: 5000, requiredSections: ['Method Summary', 'Method Detail', 'Usage Examples'] },
        // Note: request.md has 7 ## sections (Inheritance Hierarchy, Description, Properties, Constructor Summary, Method Summary, Method Detail, Property Details)
        { doc: 'request', minSections: 7, minContentLength: 4000, requiredSections: ['Properties', 'Constructor Summary', 'Property Details'] },
        // Note: response.md has 7 ## sections
        { doc: 'response', minSections: 7, minContentLength: 4000, requiredSections: ['Method Summary', 'Properties'] }
      ];

      for (const { doc, minSections, minContentLength, requiredSections } of qualityChecks) {
        const result = await client.callTool('get_sfra_document', { documentName: doc });
        const documentData = parseDocumentJSON(result.content[0].text);

        // Section count validation
        assert.ok(documentData.sections.length >= minSections,
          `${doc} should have at least ${minSections} sections (has ${documentData.sections.length})`);

        // Content length validation
        assert.ok(documentData.content.length >= minContentLength,
          `${doc} should have substantial content (${documentData.content.length} chars, min ${minContentLength})`);

        // Required sections validation
        requiredSections.forEach(requiredSection => {
          const hasSection = documentData.sections.some(section => 
            section.toLowerCase().includes(requiredSection.toLowerCase())
          );
          assert.ok(hasSection, `${doc} should have "${requiredSection}" section`);
        });
        
      }
    });

    test('should include code examples and usage patterns', async () => {
      const docsWithExamples = ['server', 'request', 'response'];

      for (const doc of docsWithExamples) {
        const result = await client.callTool('get_sfra_document', { documentName: doc });
        const documentData = parseDocumentJSON(result.content[0].text);

        const content = documentData.content.toLowerCase();
        
        // Check for code examples
        const hasCodeBlocks = content.includes('```') || content.includes('```javascript');
        const hasUsageExamples = content.includes('example') && (
          content.includes('function') || 
          content.includes('var ') || 
          content.includes('new ') ||
          content.includes('server.')
        );

        // Check for method signatures and constructor patterns  
        const hasSignatures = content.includes('signature:') || 
          (content.includes('(') && content.includes(')')) ||
          content.includes('constructor') ||
          content.includes('method');

        assert.ok(hasCodeBlocks || hasUsageExamples || hasSignatures,
          `${doc} should contain code examples, usage patterns, or method signatures`);

        // Additional signature verification
        assert.ok(hasSignatures, `${doc} should contain method signatures or constructors`);

        // Note: Validated code examples and signatures for ${doc}
        
      }
    });

    test('should maintain cross-reference consistency', async () => {
      const docs = ['server', 'request', 'response'];
      const documentContents = {};

      // Load all documents
      for (const doc of docs) {
        const result = await client.callTool('get_sfra_document', { documentName: doc });
        const documentData = parseDocumentJSON(result.content[0].text);
        documentContents[doc] = documentData.content.toLowerCase();
        
      }

      // Check cross-references
      const crossRefs = [
        { from: 'server', to: 'request', mention: 'request' },
        { from: 'server', to: 'response', mention: 'response' },
        { from: 'request', to: 'session', mention: 'session' }
      ];

      crossRefs.forEach(({ from, to, mention }) => {
        if (documentContents[from] && documentContents[to]) {
          assert.ok(documentContents[from].includes(mention),
            `${from} document should reference ${mention}`);
        }
      });
    });
  });

  describe('Error Recovery & Resilience', () => {
    test('should recover gracefully from various error conditions', async () => {
      const errorScenarios = [
        { name: 'nonexistent-doc', expectError: true },
        { name: 'server', expectError: false }, // Should work after error
        { name: '', expectError: true },
        { name: 'request', expectError: false }, // Should work after another error
        { name: 'invalid/path', expectError: true },
        { name: 'response', expectError: false } // Final success
      ];

      for (const { name, expectError } of errorScenarios) {
        const result = await client.callTool('get_sfra_document', { documentName: name });
        
        if (expectError) {
          assert.equal(result.isError, true, `${name || 'empty'} should result in error`);
        } else {
          assert.equal(result.isError, false, `${name} should succeed after error`);
          const documentData = parseDocumentJSON(result.content[0].text);
          assert.ok(documentData.title, `${name} should return valid document`);
        }
        
      }
    });

    test('should maintain consistent behavior under stress', async () => {
      const stressTests = [
        // Mix of valid and invalid requests
        ...Array(5).fill('server'),
        ...Array(3).fill('nonexistent'),
        ...Array(5).fill('request'),
        ...Array(2).fill(''),
        ...Array(5).fill('response')
      ];

      let successCount = 0;
      let errorCount = 0;

      for (const docName of stressTests) {
        const result = await client.callTool('get_sfra_document', { documentName: docName });
        
        if (result.isError) {
          errorCount++;
        } else {
          successCount++;
          // Validate successful responses are still valid
          const documentData = parseDocumentJSON(result.content[0].text);
          assert.ok(documentData.title, 'Successful responses should remain valid');
        }
      }
        
      assert.ok(successCount > 0, 'Should have some successful requests');
      assert.ok(errorCount > 0, 'Should have some failed requests');
      assert.ok(successCount > 0, 'Should have successful requests');
      assert.ok(errorCount >= 0, 'Should handle errors gracefully');
    });
  });

  describe('Memory & Resource Management', () => {
    test('should handle large document content efficiently', async () => {
      // Test with documents that likely have substantial content
      const largeDocs = ['server', 'product-full', 'cart'];
      const memoryBefore = process.memoryUsage();

      for (const doc of largeDocs) {
        const result = await client.callTool('get_sfra_document', { documentName: doc });
        assert.equal(result.isError, false, `${doc} should load successfully`);
        
        const documentData = parseDocumentJSON(result.content[0].text);
        assert.ok(documentData.content.length > 0, `${doc} should have content`);
        
      }

      const memoryAfter = process.memoryUsage();
      const memoryIncrease = (memoryAfter.heapUsed - memoryBefore.heapUsed) / 1024 / 1024;
      
      // Memory increase should be reasonable (allowing for some overhead)
      assert.ok(memoryIncrease < 50, 
        `Memory increase should be reasonable: ${memoryIncrease.toFixed(1)}MB`);
    });
  });
});

// Helper Classes and Functions


function assertValidMCPResponse(result) {
  assert.ok(result.content, 'Should have content');
  assert.ok(Array.isArray(result.content), 'Content should be array');
  assert.equal(typeof result.isError, 'boolean', 'isError should be boolean');
  assert.equal(result.content.length, 1, 'Should have exactly one content item');
  assert.equal(result.content[0].type, 'text', 'Content should be text type');
}

function assertToolSchema(tool) {
  assert.ok(tool.name, 'Tool should have name');
  assert.ok(tool.description, 'Tool should have description');
  assert.ok(tool.inputSchema, 'Tool should have schema');
  assert.equal(tool.inputSchema.type, 'object', 'Schema should be object type');
  assert.ok(tool.inputSchema.properties, 'Schema should have properties');
  assert.ok(tool.inputSchema.required, 'Schema should have required fields');
}

function parseDocumentJSON(textContent) {
  try {
    return JSON.parse(textContent);
  } catch (error) {
    assert.fail(`Document content should be valid JSON: ${error.message}`);
  }
}

function assertDocumentStructure(documentData, documentName) {
  assert.ok(documentData.title, `${documentName} should have title`);
  assert.ok(Array.isArray(documentData.sections), `${documentName} should have sections array`);
  assert.ok(documentData.content, `${documentName} should have content`);
  assert.ok(documentData.type, `${documentName} should have type`);
  assert.ok(documentData.category, `${documentName} should have category`);
  assert.ok(documentData.filename, `${documentName} should have filename`);
  assert.ok(documentData.lastModified, `${documentName} should have lastModified`);
  
  // Validate lastModified is a valid date string
  assert.ok(!isNaN(Date.parse(documentData.lastModified)), 
    `${documentName} lastModified should be valid date`);
  
  // Validate filename corresponds to document
  const filenameBase = documentData.filename.toLowerCase().replace(/\.md$/, '');
  const docNameBase = documentName.toLowerCase();
  assert.ok(filenameBase.includes(docNameBase) || docNameBase.includes(filenameBase),
    `${documentName} filename should correspond to document name`);
}
