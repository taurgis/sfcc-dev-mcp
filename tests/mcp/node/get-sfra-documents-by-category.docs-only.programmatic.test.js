/**
 * ==================================================================================
 * SFCC MCP Server - get_sfra_documents_by_category Tool Node.js Programmatic Tests
 * Comprehensive testing with dynamic validation logic and advanced test scenarios
 * 
 * Tool: get_sfra_documents_by_category
 * Purpose: Get SFRA documents filtered by category (core, product, order, customer, pricing, store, other)
 * Parameters: category (required) - Category to filter by
 * 
 * Quick Test Commands:
 * node --test tests/mcp/node/get-sfra-documents-by-category.docs-only.programmatic.test.js
 * npm run test:mcp:node -- --grep "get_sfra_documents_by_category"
 * ==================================================================================
 */

import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

describe('SFCC MCP Server - get_sfra_documents_by_category Tool Programmatic Tests', () => {
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
    // CRITICAL: Clear all buffers to prevent test interference
    client.clearAllBuffers();
  });

  // ==================================================================================
  // SUCCESSFUL OPERATIONS - VALID CATEGORIES
  // ==================================================================================

  describe('Valid Category Operations', () => {
    test('should retrieve core SFRA documents with proper structure', async () => {
      const result = await client.callTool('get_sfra_documents_by_category', {
        category: 'core'
      });

      // Validate MCP response structure
      assert.ok(result.content, 'Should have content');
      assert.ok(Array.isArray(result.content), 'Content should be array');
      assert.equal(result.content.length, 1, 'Should have one content item');
      assert.equal(result.content[0].type, 'text', 'Content type should be text');
      assert.equal(result.isError, false, 'Should not be error');

      // Parse and validate JSON structure
      const jsonText = result.content[0].text;
      assert.ok(jsonText, 'Should have text content');
      
      const documents = JSON.parse(jsonText);
      assert.ok(Array.isArray(documents), 'Should parse to array');
      assert.ok(documents.length > 0, 'Should have documents');
    });

    test('should return expected core documents with correct fields', async () => {
      const result = await client.callTool('get_sfra_documents_by_category', {
        category: 'core'
      });

      const documents = JSON.parse(result.content[0].text);
      
      // Validate document count and names
      assert.equal(documents.length, 5, 'Core should have 5 documents');
      
      const expectedNames = ['querystring', 'render', 'request', 'response', 'server'];
      const actualNames = documents.map(doc => doc.name).sort();
      assert.deepEqual(actualNames, expectedNames, 'Should have expected core document names');

      // Validate document structure
      documents.forEach((doc, index) => {
        assert.ok(doc.name, `Document ${index} should have name`);
        assert.ok(doc.title, `Document ${index} should have title`);
        assert.ok(doc.description !== undefined, `Document ${index} should have description`);
        assert.ok(doc.type, `Document ${index} should have type`);
        assert.equal(doc.category, 'core', `Document ${index} should have core category`);
        assert.ok(doc.filename, `Document ${index} should have filename`);
        assert.ok(doc.filename.endsWith('.md'), `Document ${index} filename should be markdown`);
      });
    });

    test('should return product category documents with model types', async () => {
      const result = await client.callTool('get_sfra_documents_by_category', {
        category: 'product'
      });

      assert.equal(result.isError, false, 'Should not be error');
      
      const documents = JSON.parse(result.content[0].text);
      assert.ok(Array.isArray(documents), 'Should return array');
      assert.ok(documents.length > 0, 'Should have product documents');

      // Validate product-specific content
      const hasProductFull = documents.some(doc => doc.name === 'product-full');
      const hasProductTile = documents.some(doc => doc.name === 'product-tile');
      assert.ok(hasProductFull, 'Should contain product-full document');
      assert.ok(hasProductTile, 'Should contain product-tile document');

      // Validate all documents have product category
      documents.forEach(doc => {
        assert.equal(doc.category, 'product', 'All documents should have product category');
      });
    });

    test('should handle all valid categories', async () => {
      const validCategories = ['core', 'product', 'order', 'customer', 'pricing', 'store', 'other'];
      
      for (const category of validCategories) {
        const result = await client.callTool('get_sfra_documents_by_category', {
          category: category
        });

        assert.equal(result.isError, false, `Category ${category} should not error`);
        assert.ok(result.content, `Category ${category} should have content`);
        
        const documents = JSON.parse(result.content[0].text);
        assert.ok(Array.isArray(documents), `Category ${category} should return array`);
        
        // If documents exist, they should have the correct category
        documents.forEach(doc => {
          assert.equal(doc.category, category, `Document should have ${category} category`);
        });
      }
    });
  });

  // ==================================================================================
  // EDGE CASES AND ERROR HANDLING
  // ==================================================================================

  describe('Edge Cases and Error Handling', () => {
      test('should reject invalid category', async () => {
      const result = await client.callTool('get_sfra_documents_by_category', {
        category: 'invalid_category_xyz'
      });

        assert.equal(result.isError, true, 'Invalid category should be error');
        assert.ok(result.content[0].text.includes('category must be one of'));
    });

    test('should require category parameter', async () => {
      const result = await client.callTool('get_sfra_documents_by_category', {});

      assert.equal(result.isError, true, 'Missing category should be error');
      assert.ok(result.content[0].text.includes('category must be a non-empty string'), 
        'Should have specific error message');
    });

    test('should handle empty category string', async () => {
      const result = await client.callTool('get_sfra_documents_by_category', {
        category: ''
      });

      assert.equal(result.isError, true, 'Empty category should be error');
      assert.ok(result.content[0].text.includes('Error'), 'Should contain error message');
    });

    test('should handle null category parameter', async () => {
      const result = await client.callTool('get_sfra_documents_by_category', {
        category: null
      });

      assert.equal(result.isError, true, 'Null category should be error');
      assert.ok(result.content[0].text.includes('Error'), 'Should contain error message');
    });

      test('should reject case-variant categories', async () => {
      const testCases = ['CORE', 'Core', 'PRODUCT', 'Product'];
      
      for (const category of testCases) {
        const result = await client.callTool('get_sfra_documents_by_category', {
          category: category
        });

          assert.equal(result.isError, true, `Category ${category} should fail validation`);
          assert.ok(result.content[0].text.includes('category must be one of'));
      }
    });
  });

  // ==================================================================================
  // DATA VALIDATION AND STRUCTURE TESTING
  // ==================================================================================

  describe('Data Validation and Structure', () => {
    test('should validate document field types and values', async () => {
      const result = await client.callTool('get_sfra_documents_by_category', {
        category: 'core'
      });

      const documents = JSON.parse(result.content[0].text);
      
      documents.forEach((doc, index) => {
        // Field type validation
        assert.equal(typeof doc.name, 'string', `Document ${index} name should be string`);
        assert.equal(typeof doc.title, 'string', `Document ${index} title should be string`);
        assert.equal(typeof doc.description, 'string', `Document ${index} description should be string`);
        assert.equal(typeof doc.type, 'string', `Document ${index} type should be string`);
        assert.equal(typeof doc.category, 'string', `Document ${index} category should be string`);
        assert.equal(typeof doc.filename, 'string', `Document ${index} filename should be string`);

        // Field value validation
        assert.ok(doc.name.length > 0, `Document ${index} name should not be empty`);
        assert.ok(doc.title.length > 0, `Document ${index} title should not be empty`);
        assert.ok(['class', 'module', 'model'].includes(doc.type), 
          `Document ${index} type should be valid: ${doc.type}`);
        assert.ok(doc.filename.endsWith('.md'), 
          `Document ${index} filename should end with .md: ${doc.filename}`);
      });
    });

    test('should maintain consistent document structure across categories', async () => {
      const categories = ['core', 'product'];
      const allDocuments = [];

      for (const category of categories) {
        const result = await client.callTool('get_sfra_documents_by_category', {
          category: category
        });
        
        const documents = JSON.parse(result.content[0].text);
        allDocuments.push(...documents);
      }

      // Validate all documents have the same structure
      const requiredFields = ['name', 'title', 'description', 'type', 'category', 'filename'];
      
      allDocuments.forEach((doc, index) => {
        requiredFields.forEach(field => {
          assert.ok(Object.prototype.hasOwnProperty.call(doc, field), 
            `Document ${index} should have ${field} field`);
        });
        
        // No extra fields beyond expected ones
        const docFields = Object.keys(doc);
        assert.equal(docFields.length, requiredFields.length, 
          `Document ${index} should have exactly ${requiredFields.length} fields`);
      });
    });

    test('should return documents sorted alphabetically by name', async () => {
      const result = await client.callTool('get_sfra_documents_by_category', {
        category: 'core'
      });

      const documents = JSON.parse(result.content[0].text);
      const names = documents.map(doc => doc.name);
      const sortedNames = [...names].sort();
      
      assert.deepEqual(names, sortedNames, 'Documents should be sorted alphabetically by name');
    });
  });

  // ==================================================================================
  // DYNAMIC VALIDATION AND BUSINESS LOGIC
  // ==================================================================================

  describe('Dynamic Validation and Business Logic', () => {
    test('should validate document naming conventions', async () => {
      const categories = ['core', 'product'];
      
      for (const category of categories) {
        const result = await client.callTool('get_sfra_documents_by_category', {
          category: category
        });
        
        const documents = JSON.parse(result.content[0].text);
        
        documents.forEach(doc => {
          // Name should be lowercase with hyphens
          assert.ok(/^[a-z][a-z0-9-]*$/.test(doc.name), 
            `Document name should follow convention: ${doc.name}`);
          
          // Filename should match name + .md
          assert.equal(doc.filename, `${doc.name}.md`, 
            `Filename should match name: ${doc.filename}`);
        });
      }
    });

    test('should validate type consistency by category', async () => {
      // Core category should have classes and modules
      const coreResult = await client.callTool('get_sfra_documents_by_category', {
        category: 'core'
      });
      
      const coreDocuments = JSON.parse(coreResult.content[0].text);
      const coreTypes = [...new Set(coreDocuments.map(doc => doc.type))];
      assert.ok(coreTypes.includes('class'), 'Core should have class types');
      assert.ok(coreTypes.includes('module'), 'Core should have module types');

      // Product category should primarily have models
      const productResult = await client.callTool('get_sfra_documents_by_category', {
        category: 'product'
      });
      
      const productDocuments = JSON.parse(productResult.content[0].text);
      if (productDocuments.length > 0) {
        // Product documents should primarily be models
        const modelCount = productDocuments.filter(doc => doc.type === 'model').length;
        const totalCount = productDocuments.length;
        assert.ok(modelCount / totalCount > 0.5, 'Product category should be primarily models');
      }
    });

    test('should validate unique document names within category', async () => {
      const result = await client.callTool('get_sfra_documents_by_category', {
        category: 'core'
      });

      const documents = JSON.parse(result.content[0].text);
      const names = documents.map(doc => doc.name);
      const uniqueNames = [...new Set(names)];
      
      assert.equal(names.length, uniqueNames.length, 
        'All document names within category should be unique');
    });

    test('should handle empty categories appropriately', async () => {
      // Test categories that might be empty
      const possiblyEmptyCategories = ['other'];
      
      for (const category of possiblyEmptyCategories) {
        const result = await client.callTool('get_sfra_documents_by_category', {
          category: category
        });

        assert.equal(result.isError, false, `Category ${category} should not error`);
        
        const documents = JSON.parse(result.content[0].text);
        assert.ok(Array.isArray(documents), `Category ${category} should return array`);
        // Empty is acceptable for some categories
      }
    });
  });

  // ==================================================================================
  // INTEGRATION AND WORKFLOW TESTING
  // ==================================================================================

  describe('Integration and Workflow Testing', () => {
    test('should support category discovery workflow', async () => {
      // Step 1: Get available categories by testing each one
      const allCategories = ['core', 'product', 'order', 'customer', 'pricing', 'store', 'other'];
      const availableCategories = [];
      
      for (const category of allCategories) {
        const result = await client.callTool('get_sfra_documents_by_category', {
          category: category
        });
        
        const documents = JSON.parse(result.content[0].text);
        if (documents.length > 0) {
          availableCategories.push(category);
        }
      }
      
      assert.ok(availableCategories.length >= 2, 'Should have at least 2 non-empty categories');
      assert.ok(availableCategories.includes('core'), 'Core should be available');
      
      // Step 2: Validate each available category has consistent structure
      for (const category of availableCategories) {
        const result = await client.callTool('get_sfra_documents_by_category', {
          category: category
        });
        
        const documents = JSON.parse(result.content[0].text);
        assert.ok(documents.every(doc => doc.category === category), 
          `All documents in ${category} should have correct category`);
      }
    });

    test('should support document exploration workflow', async () => {
      // Step 1: Get core documents
      const coreResult = await client.callTool('get_sfra_documents_by_category', {
        category: 'core'
      });
      
      const coreDocuments = JSON.parse(coreResult.content[0].text);
      
      // Step 2: Find specific document types
      const serverDoc = coreDocuments.find(doc => doc.name === 'server');
      assert.ok(serverDoc, 'Should find server document');
      assert.equal(serverDoc.type, 'class', 'Server should be a class');
      
      const renderDoc = coreDocuments.find(doc => doc.name === 'render');
      assert.ok(renderDoc, 'Should find render document');
      assert.equal(renderDoc.type, 'module', 'Render should be a module');
      
      // Step 3: Validate document relationships
      assert.ok(serverDoc.filename !== renderDoc.filename, 
        'Different documents should have different filenames');
    });

    test('should validate cross-category document consistency', async () => {
      const allDocuments = [];
      const allCategories = ['core', 'product', 'order', 'customer', 'pricing', 'store', 'other'];
      
      // Collect all documents across categories
      for (const category of allCategories) {
        const result = await client.callTool('get_sfra_documents_by_category', {
          category: category
        });
        
        const documents = JSON.parse(result.content[0].text);
        allDocuments.push(...documents);
      }
      
      // Validate no duplicate document names across categories
      const allNames = allDocuments.map(doc => doc.name);
      const uniqueNames = [...new Set(allNames)];
      assert.equal(allNames.length, uniqueNames.length, 
        'Document names should be unique across all categories');
      
      // Validate filename consistency
      allDocuments.forEach(doc => {
        assert.equal(doc.filename, `${doc.name}.md`, 
          `Document ${doc.name} should have consistent filename`);
      });
    });
  });

  // ==================================================================================
  // PERFORMANCE AND RELIABILITY TESTING
  // ==================================================================================

  describe('Performance and Reliability', () => {
    test('should handle repeated requests consistently', async () => {
      const requestCount = 5;
      const results = [];
      
      // Make multiple identical requests
      for (let i = 0; i < requestCount; i++) {
        const result = await client.callTool('get_sfra_documents_by_category', {
          category: 'core'
        });
        results.push(result);
      }
      
      // Validate all responses are identical
      const firstResponse = results[0].content[0].text;
      results.forEach((result, index) => {
        assert.equal(result.isError, false, `Request ${index} should not error`);
        assert.equal(result.content[0].text, firstResponse, 
          `Request ${index} should return identical response`);
      });
    });

    test('should handle concurrent category requests sequentially', async () => {
      // Note: Not using Promise.all due to MCP single-process limitations
      const categories = ['core', 'product'];
      const results = [];
      
      // Sequential requests to avoid concurrency issues
      for (const category of categories) {
        const result = await client.callTool('get_sfra_documents_by_category', {
          category: category
        });
        results.push({ category, result });
      }
      
      // Validate all requests succeeded
      results.forEach(({ category, result }) => {
        assert.equal(result.isError, false, `Category ${category} should not error`);
        
        const documents = JSON.parse(result.content[0].text);
        assert.ok(Array.isArray(documents), `Category ${category} should return array`);
      });
    });

    test('should maintain performance under different input sizes', async () => {
      const categories = ['core', 'product', 'invalid_long_category_name_that_should_not_exist'];
      
      for (const category of categories) {
        const startTime = process.hrtime.bigint();
        
        const result = await client.callTool('get_sfra_documents_by_category', {
          category: category
        });
        
        const endTime = process.hrtime.bigint();
        const duration = Number(endTime - startTime) / 1000000; // Convert to milliseconds
        
        // Functional validation (performance is environment-dependent)
        assert.ok(result.content, `Category ${category} should return content`);
        assert.ok(duration < 5000, `Category ${category} should complete within 5 seconds`);
      }
    });
  });
});

// ==================================================================================
// HELPER FUNCTIONS
// ==================================================================================

// Helper functions removed to avoid unused function linting errors.
// Validation logic is implemented inline within tests for better maintainability.
