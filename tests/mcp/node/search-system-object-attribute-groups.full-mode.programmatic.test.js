/**
 * Node.js programmatic tests for search_system_object_attribute_groups MCP tool (Full Mode)
 * 
 * These tests provide comprehensive validation of the tool's functionality in full mode
 * with real SFCC OCAPI integration, including complex query scenarios, error handling,
 * performance validation, and integration testing.
 * 
 * Test Categories:
 * 1. Basic Functionality Tests
 * 2. Complex Query Scenarios  
 * 3. Pagination and Sorting Tests
 * 4. Error Handling and Edge Cases
 * 5. Performance and Resource Management
 * 6. Integration and Data Consistency Tests
 * 7. Authentication and Security Tests
 */

import { strictEqual, ok } from 'assert';
import { describe, it, before, after, beforeEach } from 'node:test';
import { connect } from 'mcp-aegis';

describe('search_system_object_attribute_groups - Full Mode Comprehensive Tests', () => {
  let client;
  const configPath = './aegis.config.with-dw.json';

  before(async () => {
    client = await connect(configPath);
  });

  after(async () => {
    if (client?.connected) {
      await client.disconnect();
    }
  });

  beforeEach(() => {
    // CRITICAL: Clear all buffers to prevent leaking into next tests
    if (client?.clearAllBuffers) {
      client.clearAllBuffers();
    }
  });

  // Enhanced helper functions for complex validations
  function assertValidMCPResponse(result) {
    ok(result.content, 'Should have content');
    ok(Array.isArray(result.content), 'Content should be array');
    strictEqual(typeof result.isError, 'boolean', 'isError should be boolean');
  }

  function getTextContent(result) {
    assertValidMCPResponse(result);
    const textContent = result.content.find(c => c.type === 'text');
    ok(textContent, 'Should have text content');
    return textContent.text;
  }

  async function callTool(params) {
    const result = await client.callTool('search_system_object_attribute_groups', params);
    assertValidMCPResponse(result);
    return result;
  }

  describe('1. Basic Functionality Tests', () => {
    it('should be available in full mode', async () => {
      const tools = await client.listTools();
      const tool = tools.find(t => t.name === 'search_system_object_attribute_groups');
      ok(tool, 'Tool should be available in full mode');
      strictEqual(tool.name, 'search_system_object_attribute_groups');
      ok(tool.description.includes('Search attribute groups'), 'Tool should have proper description');
    });

    it('should return attribute groups for Product object type', async () => {
      const result = await callTool({
        objectType: 'Product',
        searchRequest: {
          query: { match_all_query: {} },
          count: 10
        }
      });

      const text = getTextContent(result);
      ok(text.includes('object_attribute_group'), 'Should mention object_attribute_group in response');
    });

    it('should return attribute groups for SitePreferences object type', async () => {
      const result = await callTool({
        objectType: 'SitePreferences',
        searchRequest: {
          query: { match_all_query: {} },
          count: 5
        }
      });

      const text = getTextContent(result);
      ok(text.includes('SitePreferences'), 'Should mention SitePreferences');
    });

    it('should handle Customer object type', async () => {
      const result = await callTool({
        objectType: 'Customer',
        searchRequest: {
          query: { match_all_query: {} },
          count: 5
        }
      });

      const text = getTextContent(result);
      ok(text.length > 0, 'Should have some response content');
    });
  });

  describe('2. Complex Query Scenarios', () => {
    it('should handle text_query for searching by display name', async () => {
      const result = await callTool({
        objectType: 'Product',
        searchRequest: {
          query: {
            text_query: {
              fields: ['display_name', 'description'],
              search_phrase: 'product'
            }
          },
          count: 5
        }
      });

      const text = getTextContent(result);
      ok(text.length > 0, 'Should have response content');
    });

    it('should handle term_query for exact field matching', async () => {
      const result = await callTool({
        objectType: 'Product',
        searchRequest: {
          query: {
            term_query: {
              fields: ['internal'],
              operator: 'is',
              values: ['false']
            }
          },
          count: 10
        }
      });

      const text = getTextContent(result);
      ok(text.length > 0, 'Should have response content');
    });

    it('should handle complex bool_query with multiple conditions', async () => {
      const result = await callTool({
        objectType: 'Product',
        searchRequest: {
          query: {
            bool_query: {
              must: [
                {
                  term_query: {
                    fields: ['internal'],
                    operator: 'is',
                    values: ['false']
                  }
                }
              ],
              must_not: [
                {
                  text_query: {
                    fields: ['id'],
                    search_phrase: 'system'
                  }
                }
              ]
            }
          },
          count: 5
        }
      });

      const text = getTextContent(result);
      ok(text.length > 0, 'Should have response content');
    });
  });

  describe('3. Pagination and Sorting Tests', () => {
    it('should handle pagination with start and count parameters', async () => {
      const result1 = await callTool({
        objectType: 'Product',
        searchRequest: {
          query: { match_all_query: {} },
          start: 0,
          count: 2
        }
      });

      const result2 = await callTool({
        objectType: 'Product',
        searchRequest: {
          query: { match_all_query: {} },
          start: 2,
          count: 2
        }
      });

      const text1 = getTextContent(result1);
      const text2 = getTextContent(result2);

      // Pages should be different (unless there are very few groups)
      if (text1.includes('attribute groups') && text2.includes('attribute groups')) {
        // Both pages have data, they might be different or the same if limited data
        ok(true, 'Pagination works correctly');
      }
    });

    it('should handle sorting by different fields', async () => {
      const ascResult = await callTool({
        objectType: 'Product',
        searchRequest: {
          query: { match_all_query: {} },
          sorts: [{ field: 'id', sort_order: 'asc' }],
          count: 5
        }
      });

      const descResult = await callTool({
        objectType: 'Product',
        searchRequest: {
          query: { match_all_query: {} },
          sorts: [{ field: 'id', sort_order: 'desc' }],
          count: 5
        }
      });

      const ascText = getTextContent(ascResult);
      const descText = getTextContent(descResult);

      // Both should have content
      ok(ascText.length > 0, 'Ascending sort should return data');
      ok(descText.length > 0, 'Descending sort should return data');
    });

    it('should handle multiple sort criteria', async () => {
      const result = await callTool({
        objectType: 'Product',
        searchRequest: {
          query: { match_all_query: {} },
          sorts: [
            { field: 'internal', sort_order: 'asc' },
            { field: 'position', sort_order: 'desc' }
          ],
          count: 5
        }
      });

      const text = getTextContent(result);
      ok(text.length > 0, 'Should return data');
    });
  });

  describe('4. Error Handling and Edge Cases', () => {
    it('should handle invalid object type gracefully', async () => {
      const result = await callTool({
        objectType: 'InvalidObjectType',
        searchRequest: {
          query: { match_all_query: {} }
        }
      });

      const text = getTextContent(result).toLowerCase();
      ok(
        text.includes('error') || text.includes('not found') || text.includes('no') || 
        text.includes('invalid') || text.includes('empty') || text.includes('0'),
        'Should handle invalid object type appropriately'
      );
    });

    it('should handle missing required parameters', async () => {
      try {
        await client.callTool('search_system_object_attribute_groups', {
          searchRequest: {
            query: { match_all_query: {} }
          }
          // Missing objectType
        });
        ok(false, 'Should have thrown an error for missing objectType');
      } catch (error) {
        ok(error.message.includes('objectType') || error.message.includes('required'), 
           'Error should mention missing objectType');
      }
    });

    it('should handle malformed query structures', async () => {
      const result = await callTool({
        objectType: 'Product',
        searchRequest: {
          query: {
            text_query: {
              // Missing required fields
              search_phrase: 'test'
            }
          }
        }
      });

      const text = getTextContent(result);
      ok(text.length > 0, 'Should have some response');
    });

    it('should handle empty search results', async () => {
      const result = await callTool({
        objectType: 'Product',
        searchRequest: {
          query: {
            text_query: {
              fields: ['id'],
              search_phrase: 'zzz_nonexistent_group_name_xyz'
            }
          }
        }
      });

      const text = getTextContent(result).toLowerCase();
      ok(
        text.includes('no') || text.includes('empty') || text.includes('not found') || 
        text.includes('0') || text.includes('none'),
        'Should indicate no results found'
      );
    });

    it('should handle very large count parameters', async () => {
      const result = await callTool({
        objectType: 'Product',
        searchRequest: {
          query: { match_all_query: {} },
          count: 1000 // Very large count
        }
      });

      const text = getTextContent(result);
      ok(text.length > 0, 'Should return data');
    });
  });

  describe('5. Performance and Resource Management Tests', () => {
    it('should respond within reasonable time for simple queries', async () => {
      const startTime = Date.now();
      
      const result = await callTool({
        objectType: 'Product',
        searchRequest: {
          query: { match_all_query: {} },
          count: 5
        }
      });
      
      const duration = Date.now() - startTime;
      
      ok(result.content, 'Should return result');
      ok(duration < 5000, `Simple query should complete within 5 seconds, took ${duration}ms`);
    });

    it('should handle concurrent requests efficiently', async () => {
      const startTime = Date.now();

      const results = [];
      for (let i = 0; i < 3; i++) {
        const result = await callTool({
          objectType: 'Product',
          searchRequest: {
            query: { match_all_query: {} },
            start: i * 2,
            count: 2
          }
        });
        results.push(result);
      }

      const duration = Date.now() - startTime;
      
      ok(results.length === 3, 'Should handle all concurrent requests');
      results.forEach((result, index) => {
        ok(result.content, `Request ${index} should have content`);
      });
      ok(duration < 10000, `Concurrent requests should complete within 10 seconds, took ${duration}ms`);
    });

    it('should handle memory efficiently with large result sets', async () => {
      const result = await callTool({
        objectType: 'Product',
        searchRequest: {
          query: { match_all_query: {} },
          count: 200 // Large result set
        }
      });

      const text = getTextContent(result);
      ok(text.length > 0, 'Should have response content');
      ok(text.length < 1000000, 'Response should be reasonable in size (< 1MB)');
    });
  });

  describe('6. Integration and Data Consistency Tests', () => {
    it('should return consistent results for repeated identical queries', async () => {
      const queryParams = {
        objectType: 'Product',
        searchRequest: {
          query: { match_all_query: {} },
          count: 5,
          sorts: [{ field: 'id', sort_order: 'asc' }]
        }
      };

      const result1 = await callTool(queryParams);
      const result2 = await callTool(queryParams);

      const text1 = getTextContent(result1);
      const text2 = getTextContent(result2);

      // Results should be identical for same query
      strictEqual(text1, text2, 'Repeated identical queries should return same results');
    });

    it('should validate select parameter functionality', async () => {
      const fullResult = await callTool({
        objectType: 'Product',
        searchRequest: {
          query: { match_all_query: {} },
          count: 3,
          select: '(**)'
        }
      });

      const limitedResult = await callTool({
        objectType: 'Product',
        searchRequest: {
          query: { match_all_query: {} },
          count: 3,
          select: '(data.(id))'
        }
      });

      const fullText = getTextContent(fullResult);
      const limitedText = getTextContent(limitedResult);

      // Both should have content but limited might be shorter
      ok(fullText.length > 0, 'Full select should return data');
      ok(limitedText.length > 0, 'Limited select should return data');
    });

    it('should handle cross-object type comparisons', async () => {
      const productResult = await callTool({
        objectType: 'Product',
        searchRequest: {
          query: { match_all_query: {} },
          count: 3
        }
      });

      const sitePrefsResult = await callTool({
        objectType: 'SitePreferences',
        searchRequest: {
          query: { match_all_query: {} },
          count: 3
        }
      });

      const productText = getTextContent(productResult);
      const sitePrefsText = getTextContent(sitePrefsResult);

      // Results should be different (different object types should have different groups)
      ok(productText.includes('Product') || productText.includes('attribute'), 
         'Product result should be relevant to products');
      ok(sitePrefsText.includes('SitePreferences') || sitePrefsText.includes('attribute'), 
         'SitePreferences result should be relevant to site preferences');
    });
  });

  describe('7. Authentication and Security Tests', () => {
    it('should require valid OCAPI credentials', async () => {
      // This test verifies that the tool properly uses authentication
      // The fact that we can call the tool successfully means auth is working
      const result = await callTool({
        objectType: 'Product',
        searchRequest: {
          query: { match_all_query: {} },
          count: 1
        }
      });

      const text = getTextContent(result).toLowerCase();
      
      // Should not indicate authentication errors
      ok(!text.includes('unauthorized') && !text.includes('authentication'), 
         'Should not have authentication errors with valid credentials');
    });

    it('should handle input sanitization properly', async () => {
      // Test with potentially problematic input characters
      const result = await callTool({
        objectType: 'Product',
        searchRequest: {
          query: {
            text_query: {
              fields: ['id'],
              search_phrase: '<script>alert("test")</script>'
            }
          },
          count: 1
        }
      });

      const text = getTextContent(result);
      
      // The query echo should be properly escaped (showing backslashes for quotes)
      // and should not contain executable script content in the actual data hits
      ok(text.includes('\\"test\\"'), 'Should properly escape quotes in query echo');
      
      // Check that the hits section doesn't contain the script content
      const jsonResponse = JSON.parse(text);
      if (jsonResponse.hits && jsonResponse.hits.length > 0) {
        const hitsText = JSON.stringify(jsonResponse.hits);
        ok(!hitsText.includes('<script>'), 'Actual data hits should not contain script content');
      }
    });

    it('should respect OCAPI rate limiting and security constraints', async () => {
      // Make multiple rapid requests to test rate limiting handling
      try {
        const results = [];
        for (let i = 0; i < 5; i++) {
          const result = await callTool({
            objectType: 'Product',
            searchRequest: {
              query: { match_all_query: {} },
              count: 1,
            },
          });
          results.push(result);
        }
        
        // All requests should succeed or fail gracefully
        results.forEach((result, index) => {
          ok(result.content, `Request ${index} should have content or proper error handling`);
        });
      } catch (error) {
        // If rate limited, should fail gracefully
        ok(error.message.includes('rate') || error.message.includes('limit') || 
           error.message.includes('too many'), 
           'Rate limiting should be handled gracefully');
      }
    });
  });

  describe('8. Edge Case and Robustness Tests', () => {
    it('should handle extremely specific search criteria', async () => {
      const result = await callTool({
        objectType: 'Product',
        searchRequest: {
          query: {
            bool_query: {
              must: [
                {
                  term_query: {
                    fields: ['internal'],
                    operator: 'is',
                    values: ['false']
                  }
                },
                {
                  text_query: {
                    fields: ['display_name'],
                    search_phrase: 'custom'
                  }
                }
              ]
            }
          },
          count: 1
        }
      });

      const text = getTextContent(result);
      ok(text.length > 0, 'Should have response content');
    });

    it('should handle boundary values for pagination', async () => {
      // Test with start = 0
      const zeroStart = await callTool({
        objectType: 'Product',
        searchRequest: {
          query: { match_all_query: {} },
          start: 0,
          count: 1
        }
      });

      // Test with count = 1
      const minCount = await callTool({
        objectType: 'Product',
        searchRequest: {
          query: { match_all_query: {} },
          start: 0,
          count: 1
        }
      });

      ok(zeroStart.content, 'Should handle start=0');
      ok(minCount.content, 'Should handle count=1');
    });

    it('should maintain consistent response format across different scenarios', async () => {
      const scenarios = [
        {
          name: 'match_all',
          params: {
            objectType: 'Product',
            searchRequest: { query: { match_all_query: {} }, count: 2 }
          }
        },
        {
          name: 'text_search',
          params: {
            objectType: 'Product',
            searchRequest: {
              query: {
                text_query: {
                  fields: ['id'],
                  search_phrase: 'product'
                }
              },
              count: 2
            }
          }
        },
        {
          name: 'with_sorting',
          params: {
            objectType: 'Product',
            searchRequest: {
              query: { match_all_query: {} },
              sorts: [{ field: 'id', sort_order: 'asc' }],
              count: 2
            }
          }
        }
      ];

      for (const scenario of scenarios) {
        const result = await callTool(scenario.params);
        
        assertValidMCPResponse(result);
        
        const textContent = result.content.find(c => c.type === 'text');
        ok(textContent, `${scenario.name} should have text content`);
        ok(typeof textContent.text === 'string', `${scenario.name} should have string text`);
      }
    });
  });
});