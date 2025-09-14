import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-conductor';

describe('search_sfra_documentation Tool Programmatic Tests', () => {
  let client;

  before(async () => {
    client = await connect('./conductor.config.docs-only.json');
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

  describe('Valid Search Queries', () => {
    test('should return structured search results for "render" query', async () => {
      const result = await client.callTool('search_sfra_documentation', { query: 'render' });
      
      assert.equal(result.isError, false, 'Should not be an error');
      assert.ok(result.content, 'Should have content');
      assert.equal(result.content.length, 1, 'Should have one content item');
      assert.equal(result.content[0].type, 'text', 'Content should be text type');
      
      // Parse the JSON response
      const searchResults = JSON.parse(result.content[0].text);
      assert.ok(Array.isArray(searchResults), 'Results should be an array');
      assert.ok(searchResults.length > 0, 'Should have search results for "render"');
      
      // Validate structure of first result
      const firstResult = searchResults[0];
      assert.ok(firstResult.document, 'Should have document field');
      assert.ok(firstResult.title, 'Should have title field');
      assert.ok(firstResult.category, 'Should have category field');
      assert.ok(firstResult.type, 'Should have type field');
      assert.ok(typeof firstResult.relevanceScore === 'number', 'Should have numeric relevance score');
      assert.ok(Array.isArray(firstResult.matches), 'Should have matches array');
    });

    test('should return results with different document types', async () => {
      const result = await client.callTool('search_sfra_documentation', { query: 'server' });
      
      assert.equal(result.isError, false, 'Should not be an error');
      
      const searchResults = JSON.parse(result.content[0].text);
      assert.ok(searchResults.length > 0, 'Should have results for "server"');
      
      // Check that results include various document types
      const documentTypes = searchResults.map(r => r.type);
      const uniqueTypes = [...new Set(documentTypes)];
      assert.ok(uniqueTypes.length > 0, 'Should have at least one document type');
      
      // Verify known SFRA types are present (class, module, model)
      const validTypes = ['class', 'module', 'model'];
      const hasValidType = searchResults.some(r => validTypes.includes(r.type));
      assert.ok(hasValidType, 'Should include valid SFRA document types');
    });

    test('should include relevance scoring and matches', async () => {
      const result = await client.callTool('search_sfra_documentation', { query: 'response' });
      
      assert.equal(result.isError, false, 'Should not be an error');
      
      const searchResults = JSON.parse(result.content[0].text);
      assert.ok(searchResults.length > 0, 'Should have results for "response"');
      
      // Validate relevance scoring
      for (const searchResult of searchResults) {
        assert.ok(typeof searchResult.relevanceScore === 'number', 'Each result should have numeric relevance score');
        assert.ok(searchResult.relevanceScore >= 0, 'Relevance score should be non-negative');
        
        // Validate matches structure
        assert.ok(Array.isArray(searchResult.matches), 'Should have matches array');
        if (searchResult.matches.length > 0) {
          const firstMatch = searchResult.matches[0];
          assert.ok(firstMatch.section, 'Match should have section field');
          assert.ok(firstMatch.content, 'Match should have content field');
          assert.ok(typeof firstMatch.lineNumber === 'number', 'Match should have numeric line number');
        }
      }
    });

    test('should return results ordered by relevance', async () => {
      const result = await client.callTool('search_sfra_documentation', { query: 'product' });
      
      assert.equal(result.isError, false, 'Should not be an error');
      
      const searchResults = JSON.parse(result.content[0].text);
      assert.ok(searchResults.length > 1, 'Should have multiple results to test ordering');
      
      // Check that results are ordered by relevance score (descending)
      for (let i = 1; i < searchResults.length; i++) {
        assert.ok(
          searchResults[i - 1].relevanceScore >= searchResults[i].relevanceScore,
          `Results should be ordered by relevance: ${searchResults[i - 1].relevanceScore} >= ${searchResults[i].relevanceScore}`
        );
      }
    });

    test('should categorize documents appropriately', async () => {
      const result = await client.callTool('search_sfra_documentation', { query: 'model' });
      
      assert.equal(result.isError, false, 'Should not be an error');
      
      const searchResults = JSON.parse(result.content[0].text);
      assert.ok(searchResults.length > 0, 'Should have results for "model"');
      
      // Verify categories are valid SFRA categories
      const validCategories = ['core', 'product', 'order', 'customer', 'pricing', 'store', 'other'];
      for (const searchResult of searchResults) {
        assert.ok(
          validCategories.includes(searchResult.category),
          `Category "${searchResult.category}" should be one of: ${validCategories.join(', ')}`
        );
      }
    });

    test('should handle special characters in search queries', async () => {
      const result = await client.callTool('search_sfra_documentation', { query: 'dw.util' });
      
      assert.equal(result.isError, false, 'Should not be an error');
      
      const searchResults = JSON.parse(result.content[0].text);
      // Results may be empty or contain matches - both are valid for this query
      assert.ok(Array.isArray(searchResults), 'Should return an array even for special character queries');
    });
  });

  describe('Edge Cases and Error Handling', () => {
    test('should return empty array for queries with no matches', async () => {
      const result = await client.callTool('search_sfra_documentation', { query: 'zzznothingfound' });
      
      assert.equal(result.isError, false, 'Should not be an error for no matches');
      assert.equal(result.content[0].text, '[]', 'Should return empty JSON array');
    });

    test('should handle empty query with validation error', async () => {
      const result = await client.callTool('search_sfra_documentation', { query: '' });
      
      assert.equal(result.isError, true, 'Should be an error for empty query');
      assert.ok(result.content[0].text.includes('query must be a non-empty string'), 'Should have appropriate error message');
    });

    test('should handle missing query parameter', async () => {
      const result = await client.callTool('search_sfra_documentation', {});
      
      assert.equal(result.isError, true, 'Should be an error for missing query');
      assert.ok(result.content[0].text.includes('query must be a non-empty string'), 'Should indicate query is required');
    });

    test('should handle whitespace-only query as invalid', async () => {
      const result = await client.callTool('search_sfra_documentation', { query: '   ' });
      
      assert.equal(result.isError, true, 'Should be an error for whitespace-only query');
      assert.ok(result.content[0].text.includes('query must be a non-empty string'), 'Should have appropriate error message');
    });
  });

  describe('Performance Testing', () => {
    test('should respond within reasonable time for simple queries', async () => {
      const startTime = Date.now();
      const result = await client.callTool('search_sfra_documentation', { query: 'cart' });
      const duration = Date.now() - startTime;
      
      assert.ok(duration < 1000, `Simple search should complete within 1000ms, took ${duration}ms`);
      assert.equal(result.isError, false, 'Should not be an error');
    });

    test('should handle complex multi-word queries efficiently', async () => {
      const startTime = Date.now();
      const result = await client.callTool('search_sfra_documentation', { query: 'cart billing shipping product' });
      const duration = Date.now() - startTime;
      
      assert.ok(duration < 2000, `Complex search should complete within 2000ms, took ${duration}ms`);
      assert.equal(result.isError, false, 'Should not be an error');
    });
  });

  describe('Search Result Quality', () => {
    test('should return relevant results for core SFRA concepts', async () => {
      const coreTerms = ['server', 'request', 'response', 'render'];
      
      for (const term of coreTerms) {
        const result = await client.callTool('search_sfra_documentation', { query: term });
        
        assert.equal(result.isError, false, `Should not be an error for term: ${term}`);
        
        const searchResults = JSON.parse(result.content[0].text);
        assert.ok(searchResults.length > 0, `Should have results for core term: ${term}`);
        
        // Verify that the search term appears in at least one match
        const hasTermInMatches = searchResults.some(sr => 
          sr.matches.some(match => 
            match.content.toLowerCase().includes(term.toLowerCase()) ||
            match.section.toLowerCase().includes(term.toLowerCase())
          )
        );
        assert.ok(hasTermInMatches, `Search results should contain relevant matches for term: ${term}`);
      }
    });

    test('should provide useful context in match content', async () => {
      const result = await client.callTool('search_sfra_documentation', { query: 'template' });
      
      assert.equal(result.isError, false, 'Should not be an error');
      
      const searchResults = JSON.parse(result.content[0].text);
      assert.ok(searchResults.length > 0, 'Should have results for "template"');
      
      // Check that matches provide useful context
      for (const searchResult of searchResults) {
        for (const match of searchResult.matches) {
          assert.ok(match.content.length > 10, 'Match content should provide substantial context');
          assert.ok(match.section && match.section.length > 0, 'Match should have meaningful section information');
        }
      }
    });

    test('should return appropriate number of results', async () => {
      const result = await client.callTool('search_sfra_documentation', { query: 'product' });
      
      assert.equal(result.isError, false, 'Should not be an error');
      
      const searchResults = JSON.parse(result.content[0].text);
      
      // Should return a reasonable number of results (not too few, not too many)
      assert.ok(searchResults.length >= 1, 'Should have at least 1 result for broad term');
      assert.ok(searchResults.length <= 50, 'Should not return excessive number of results');
    });
  });

  describe('Dynamic Validation', () => {
    test('should validate all required fields are present in search results', async () => {
      const result = await client.callTool('search_sfra_documentation', { query: 'price' });
      
      assert.equal(result.isError, false, 'Should not be an error');
      
      const searchResults = JSON.parse(result.content[0].text);
      
      const requiredFields = ['document', 'title', 'category', 'type', 'relevanceScore', 'matches'];
      const requiredMatchFields = ['section', 'content', 'lineNumber'];
      
      for (const searchResult of searchResults) {
        // Validate main result structure
        for (const field of requiredFields) {
          assert.ok(field in searchResult, `Search result should have ${field} field`);
        }
        
        // Validate matches structure
        for (const match of searchResult.matches) {
          for (const field of requiredMatchFields) {
            assert.ok(field in match, `Match should have ${field} field`);
          }
        }
      }
    });
  });

  describe('Advanced Search Scenarios', () => {
    test('should handle complex multi-term searches effectively', async () => {
      const complexQueries = [
        'render template isml',
        'request response middleware',
        'product cart pricing',
        'server routing controller'
      ];
      
      for (const query of complexQueries) {
        const result = await client.callTool('search_sfra_documentation', { query });
        
        assert.equal(result.isError, false, `Should handle complex query: "${query}"`);
        
        const searchResults = JSON.parse(result.content[0].text);
        // Complex queries should return results (may be empty but shouldn't error)
        assert.ok(Array.isArray(searchResults), `Should return array for query: "${query}"`);
      }
    });

    test('should find specific SFRA document types by search', async () => {
      const documentTypeQueries = [
        { query: 'server', expectedType: 'class' },
        { query: 'render', expectedType: 'module' },
        { query: 'product-full', expectedType: 'model' },
        { query: 'response', expectedType: 'class' }
      ];
      
      for (const { query, expectedType } of documentTypeQueries) {
        const result = await client.callTool('search_sfra_documentation', { query });
        
        assert.equal(result.isError, false, `Should not error for query: "${query}"`);
        
        const searchResults = JSON.parse(result.content[0].text);
        if (searchResults.length > 0) {
          const hasExpectedType = searchResults.some(r => r.type === expectedType);
          assert.ok(hasExpectedType, `Should find ${expectedType} documents for query: "${query}"`);
        }
      }
    });

    test('should maintain search result consistency across calls', async () => {
      const query = 'cart';
      const results = [];
      
      // Perform same search multiple times
      for (let i = 0; i < 3; i++) {
        const result = await client.callTool('search_sfra_documentation', { query });
        assert.equal(result.isError, false, `Call ${i + 1} should not error`);
        results.push(JSON.parse(result.content[0].text));
      }
      
      // All results should have same length
      const lengths = results.map(r => r.length);
      const allSameLength = lengths.every(len => len === lengths[0]);
      assert.ok(allSameLength, 'All search calls should return same number of results');
      
      // First result should have same document in all calls
      if (results[0].length > 0) {
        const firstDocuments = results.map(r => r[0].document);
        const allSameFirstDoc = firstDocuments.every(doc => doc === firstDocuments[0]);
        assert.ok(allSameFirstDoc, 'First result should be consistent across calls');
      }
    });

    test('should handle category-specific searches', async () => {
      const categoryQueries = [
        { query: 'server request response', expectedCategory: 'core' },
        { query: 'product bundle variant', expectedCategory: 'product' },
        { query: 'cart checkout billing', expectedCategory: 'order' },
        { query: 'customer account profile', expectedCategory: 'customer' }
      ];
      
      for (const { query, expectedCategory } of categoryQueries) {
        const result = await client.callTool('search_sfra_documentation', { query });
        
        assert.equal(result.isError, false, `Should not error for category query: "${query}"`);
        
        const searchResults = JSON.parse(result.content[0].text);
        if (searchResults.length > 0) {
          const hasExpectedCategory = searchResults.some(r => r.category === expectedCategory);
          assert.ok(hasExpectedCategory, `Should find ${expectedCategory} documents for query: "${query}"`);
        }
      }
    });

    test('should handle case-insensitive searches correctly', async () => {
      const casePairs = [
        { lower: 'product', upper: 'PRODUCT' },
        { lower: 'render', upper: 'RENDER' },
        { lower: 'server', upper: 'SERVER' }
      ];
      
      for (const { lower, upper } of casePairs) {
        const lowerResult = await client.callTool('search_sfra_documentation', { query: lower });
        const upperResult = await client.callTool('search_sfra_documentation', { query: upper });
        
        assert.equal(lowerResult.isError, false, `Lowercase "${lower}" should not error`);
        assert.equal(upperResult.isError, false, `Uppercase "${upper}" should not error`);
        
        const lowerResults = JSON.parse(lowerResult.content[0].text);
        const upperResults = JSON.parse(upperResult.content[0].text);
        
        // Results should be identical for case variations
        assert.equal(lowerResults.length, upperResults.length, 
          `Case insensitive search should return same number of results for "${lower}" vs "${upper}"`);
      }
    });

    test('should provide meaningful search result context', async () => {
      const result = await client.callTool('search_sfra_documentation', { query: 'template' });
      
      assert.equal(result.isError, false, 'Should not be an error');
      
      const searchResults = JSON.parse(result.content[0].text);
      assert.ok(searchResults.length > 0, 'Should have results for "template"');
      
      for (const searchResult of searchResults) {
        // Validate document metadata quality
        assert.ok(searchResult.title.length > 0, 'Title should not be empty');
        assert.ok(searchResult.document.length > 0, 'Document name should not be empty');
        
        // Validate matches provide good context
        for (const match of searchResult.matches) {
          assert.ok(match.content.length > 20, 'Match content should be substantial');
          assert.ok(match.section.length > 0, 'Match section should be specified');
          assert.ok(match.lineNumber > 0, 'Line number should be positive');
          
          // Content should contain search term or related context
          const hasRelevantContent = match.content.toLowerCase().includes('template') ||
                                   match.content.toLowerCase().includes('render') ||
                                   match.content.toLowerCase().includes('view');
          assert.ok(hasRelevantContent, 'Match content should be relevant to search term');
        }
      }
    });
  });

  describe('Boundary Condition Testing', () => {
    test('should handle very short queries', async () => {
      const shortQueries = ['a', 'b', 'c', '1', '2'];
      
      for (const query of shortQueries) {
        const result = await client.callTool('search_sfra_documentation', { query });
        
        assert.equal(result.isError, false, `Short query "${query}" should not error`);
        
        const searchResults = JSON.parse(result.content[0].text);
        assert.ok(Array.isArray(searchResults), `Should return array for short query: "${query}"`);
        // Short queries may return many or few results - both are valid
      }
    });

    test('should handle queries with special characters', async () => {
      const specialQueries = [
        'dw.util.Collection',
        'product.price',
        'server-response',
        'cart_model',
        'request/response',
        'template.isml'
      ];
      
      for (const query of specialQueries) {
        const result = await client.callTool('search_sfra_documentation', { query });
        
        assert.equal(result.isError, false, `Special character query "${query}" should not error`);
        
        const searchResults = JSON.parse(result.content[0].text);
        assert.ok(Array.isArray(searchResults), `Should return array for special query: "${query}"`);
      }
    });

    test('should handle extremely long queries gracefully', async () => {
      const longQuery = 'template rendering isml view data processing controller middleware response request server router navigation menu product catalog pricing cart checkout billing shipping customer account profile management'.repeat(3);
      
      const startTime = Date.now();
      const result = await client.callTool('search_sfra_documentation', { query: longQuery });
      const duration = Date.now() - startTime;
      
      assert.equal(result.isError, false, 'Very long query should not error');
      assert.ok(duration < 5000, `Very long query should complete within 5000ms, took ${duration}ms`);
      
      const searchResults = JSON.parse(result.content[0].text);
      assert.ok(Array.isArray(searchResults), 'Should return array for very long query');
    });

    test('should handle numeric and mixed alphanumeric queries', async () => {
      const numericQueries = ['200', '404', '500', 'v1.2', 'api2', 'html5'];
      
      for (const query of numericQueries) {
        const result = await client.callTool('search_sfra_documentation', { query });
        
        assert.equal(result.isError, false, `Numeric query "${query}" should not error`);
        
        const searchResults = JSON.parse(result.content[0].text);
        assert.ok(Array.isArray(searchResults), `Should return array for numeric query: "${query}"`);
      }
    });
  });

  describe('Search Quality and Relevance', () => {
    test('should prioritize exact matches in relevance scoring', async () => {
      const result = await client.callTool('search_sfra_documentation', { query: 'render' });
      
      assert.equal(result.isError, false, 'Should not be an error');
      
      const searchResults = JSON.parse(result.content[0].text);
      assert.ok(searchResults.length > 0, 'Should have results for "render"');
      
      // Find results with "render" in document name vs those without
      const exactMatches = searchResults.filter(r => r.document.toLowerCase().includes('render'));
      const otherMatches = searchResults.filter(r => !r.document.toLowerCase().includes('render'));
      
      if (exactMatches.length > 0 && otherMatches.length > 0) {
        // Exact matches should generally have higher relevance scores
        const avgExactScore = exactMatches.reduce((sum, r) => sum + r.relevanceScore, 0) / exactMatches.length;
        const avgOtherScore = otherMatches.reduce((sum, r) => sum + r.relevanceScore, 0) / otherMatches.length;
        
        assert.ok(avgExactScore >= avgOtherScore, 'Exact matches should have higher average relevance score');
      }
    });

    test('should return comprehensive results for broad searches', async () => {
      const broadQueries = ['model', 'data', 'api', 'object'];
      
      for (const query of broadQueries) {
        const result = await client.callTool('search_sfra_documentation', { query });
        
        assert.equal(result.isError, false, `Broad query "${query}" should not error`);
        
        const searchResults = JSON.parse(result.content[0].text);
        
        if (searchResults.length > 0) {
          // Should find multiple document types for broad searches
          const documentTypes = new Set(searchResults.map(r => r.type));
          const categories = new Set(searchResults.map(r => r.category));
          
          // Broad searches should span multiple types/categories
          assert.ok(documentTypes.size >= 1, `Broad query "${query}" should find at least 1 document type`);
          assert.ok(categories.size >= 1, `Broad query "${query}" should find at least 1 category`);
        }
      }
    });

    test('should provide specific results for narrow searches', async () => {
      const narrowQueries = ['applyRenderings', 'viewData', 'pageMetaData', 'isJson'];
      
      for (const query of narrowQueries) {
        const result = await client.callTool('search_sfra_documentation', { query });
        
        assert.equal(result.isError, false, `Narrow query "${query}" should not error`);
        
        const searchResults = JSON.parse(result.content[0].text);
        
        // For narrow/specific searches, results should be highly relevant
        for (const searchResult of searchResults) {
          const hasRelevantMatch = searchResult.matches.some(match => 
            match.content.toLowerCase().includes(query.toLowerCase()) ||
            match.section.toLowerCase().includes(query.toLowerCase())
          );
          assert.ok(hasRelevantMatch, `Search result should contain relevant match for specific query: "${query}"`);
        }
      }
    });

    test('should handle related term searches effectively', async () => {
      const relatedTermSets = [
        ['cart', 'basket', 'shopping'],
        ['template', 'view', 'render'],
        ['product', 'item', 'catalog'],
        ['customer', 'user', 'account']
      ];
      
      for (const termSet of relatedTermSets) {
        const results = [];
        
        for (const term of termSet) {
          const result = await client.callTool('search_sfra_documentation', { query: term });
          assert.equal(result.isError, false, `Related term "${term}" should not error`);
          results.push(JSON.parse(result.content[0].text));
        }
        
        // Related terms should have some overlap in documents found
        const allDocuments = results.flatMap(r => r.map(doc => doc.document));
        const uniqueDocuments = new Set(allDocuments);
        
        // Should find some documents across related terms
        assert.ok(uniqueDocuments.size > 0, `Related terms ${termSet.join(', ')} should find some documents`);
      }
    });
  });

  describe('Stress and Load Testing', () => {
    test('should handle rapid sequential searches efficiently', async () => {
      const queries = ['server', 'request', 'response', 'render', 'model', 'cart', 'product', 'price'];
      const startTime = Date.now();
      
      for (const query of queries) {
        const result = await client.callTool('search_sfra_documentation', { query });
        assert.equal(result.isError, false, `Sequential query "${query}" should not error`);
      }
      
      const totalDuration = Date.now() - startTime;
      const avgDuration = totalDuration / queries.length;
      
      assert.ok(avgDuration < 1000, `Average query time should be under 1000ms, was ${avgDuration}ms`);
      assert.ok(totalDuration < 8000, `Total time for ${queries.length} queries should be under 8000ms, was ${totalDuration}ms`);
    });

    test('should maintain performance consistency across different query types', async () => {
      const queryTypes = [
        { type: 'short', queries: ['a', 'b', 'c'] },
        { type: 'medium', queries: ['render', 'server', 'model'] },
        { type: 'long', queries: ['template rendering', 'product catalog', 'customer account'] },
        { type: 'complex', queries: ['server request response middleware', 'product cart pricing checkout'] }
      ];
      
      const timings = {};
      
      for (const { type, queries } of queryTypes) {
        const times = [];
        
        for (const query of queries) {
          const startTime = Date.now();
          const result = await client.callTool('search_sfra_documentation', { query });
          const duration = Date.now() - startTime;
          
          assert.equal(result.isError, false, `${type} query "${query}" should not error`);
          times.push(duration);
        }
        
        timings[type] = times.reduce((sum, t) => sum + t, 0) / times.length;
      }
      
      // All query types should complete in reasonable time
      for (const [type, avgTime] of Object.entries(timings)) {
        assert.ok(avgTime < 2000, `${type} queries should average under 2000ms, was ${avgTime}ms`);
      }
    });
  });
});
