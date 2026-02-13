import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-aegis';

describe('SFCC Dev MCP - get_sfra_categories Tool (docs-only mode)', () => {
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
    // Clear all buffers to prevent test interference
    client.clearAllBuffers();
  });

  describe('Basic Functionality', () => {
    test('should be available in tool list', async () => {
      const tools = await client.listTools();
      const toolNames = tools.map(tool => tool.name);
      assert.ok(toolNames.includes('get_sfra_categories'), 'get_sfra_categories should be available');
    });

    test('should have proper tool schema', async () => {
      const tools = await client.listTools();
      const tool = tools.find(t => t.name === 'get_sfra_categories');
      
      assert.ok(tool, 'Tool should exist');
      assert.equal(tool.name, 'get_sfra_categories');
      assert.ok(tool.description, 'Tool should have description');
      assert.ok(tool.description.includes('SFRA document categories'), 'Description should mention SFRA categories');
      assert.ok(tool.inputSchema, 'Tool should have input schema');
      assert.equal(tool.inputSchema.type, 'object');
    });

    test('should return valid MCP response structure', async () => {
      const result = await client.callTool('get_sfra_categories', {});
      
      assert.equal(result.isError, false, 'Should not be an error');
      assert.ok(result.content, 'Should have content');
      assert.equal(result.content.length, 1, 'Should have exactly one content item');
      assert.equal(result.content[0].type, 'text', 'Content should be text type');
      assert.ok(result.content[0].text, 'Should have text content');
    });
  });

  describe('Response Content Validation', () => {
    test('should return valid JSON array', async () => {
      const result = await client.callTool('get_sfra_categories', {});
      
      const responseText = result.content[0].text;
      assert.doesNotThrow(() => {
        const parsed = JSON.parse(responseText);
        assert.ok(Array.isArray(parsed), 'Response should be a JSON array');
      }, 'Response should be valid JSON');
    });

    test('should return exactly 7 categories', async () => {
      const result = await client.callTool('get_sfra_categories', {});
      
      const categories = JSON.parse(result.content[0].text);
      assert.equal(categories.length, 7, 'Should have exactly 7 categories');
    });

    test('should include all expected category names', async () => {
      const result = await client.callTool('get_sfra_categories', {});
      
      const categories = JSON.parse(result.content[0].text);
      const categoryNames = categories.map(cat => cat.name).sort();
      const expectedNames = ['core', 'customer', 'order', 'other', 'pricing', 'product', 'store'];
      
      assert.deepEqual(categoryNames, expectedNames, 'Should have all expected category names');
    });

    test('should have proper structure for each category', async () => {
      const result = await client.callTool('get_sfra_categories', {});
      
      const categories = JSON.parse(result.content[0].text);
      categories.forEach((category, index) => {
        assert.ok(category.name, `Category ${index} should have category field`);
        assert.ok(typeof category.name === 'string', `Category ${index} name should be string`);
        assert.ok(typeof category.count === 'number', `Category ${index} count should be number`);
        assert.ok(category.count > 0, `Category ${index} count should be positive`);
        assert.ok(category.description, `Category ${index} should have description`);
        assert.ok(typeof category.description === 'string', `Category ${index} description should be string`);
        assert.ok(category.description.length > 10, `Category ${index} description should be meaningful`);
      });
    });
  });

  describe('Specific Category Validation', () => {
    test('should have core category with expected properties', async () => {
      const result = await client.callTool('get_sfra_categories', {});
      
      const categories = JSON.parse(result.content[0].text);
      const coreCategory = categories.find(cat => cat.name === 'core');
      
      assert.ok(coreCategory, 'Should have core category');
      assert.equal(coreCategory.count, 5, 'Core category should have 5 documents');
      assert.ok(coreCategory.description.includes('Core SFRA classes'), 'Core description should mention SFRA classes');
      assert.ok(coreCategory.description.includes('Server'), 'Core description should mention Server');
      assert.ok(coreCategory.description.includes('Request'), 'Core description should mention Request');
      assert.ok(coreCategory.description.includes('Response'), 'Core description should mention Response');
    });

    test('should have customer category with expected properties', async () => {
      const result = await client.callTool('get_sfra_categories', {});
      
      const categories = JSON.parse(result.content[0].text);
      const customerCategory = categories.find(cat => cat.name === 'customer');
      
      assert.ok(customerCategory, 'Should have customer category');
      assert.equal(customerCategory.count, 2, 'Customer category should have 2 documents');
      assert.ok(customerCategory.description.includes('Customer account'), 'Customer description should mention account');
      assert.ok(customerCategory.description.includes('address'), 'Customer description should mention address');
    });

    test('should have order category with expected properties', async () => {
      const result = await client.callTool('get_sfra_categories', {});
      
      const categories = JSON.parse(result.content[0].text);
      const orderCategory = categories.find(cat => cat.name === 'order');
      
      assert.ok(orderCategory, 'Should have order category');
      assert.equal(orderCategory.count, 6, 'Order category should have 6 documents');
      assert.ok(orderCategory.description.includes('Order'), 'Order description should mention Order');
      assert.ok(orderCategory.description.includes('cart'), 'Order description should mention cart');
      assert.ok(orderCategory.description.includes('billing'), 'Order description should mention billing');
      assert.ok(orderCategory.description.includes('shipping'), 'Order description should mention shipping');
    });

    test('should have product category with expected properties', async () => {
      const result = await client.callTool('get_sfra_categories', {});
      
      const categories = JSON.parse(result.content[0].text);
      const productCategory = categories.find(cat => cat.name === 'product');
      
      assert.ok(productCategory, 'Should have product category');
      assert.equal(productCategory.count, 5, 'Product category should have 5 documents');
      assert.ok(productCategory.description.includes('Product-related'), 'Product description should mention product-related');
      assert.ok(productCategory.description.includes('models'), 'Product description should mention models');
    });

    test('should have pricing category with expected properties', async () => {
      const result = await client.callTool('get_sfra_categories', {});
      
      const categories = JSON.parse(result.content[0].text);
      const pricingCategory = categories.find(cat => cat.name === 'pricing');
      
      assert.ok(pricingCategory, 'Should have pricing category');
      assert.equal(pricingCategory.count, 3, 'Pricing category should have 3 documents');
      assert.ok(pricingCategory.description.includes('Pricing'), 'Pricing description should mention Pricing');
      assert.ok(pricingCategory.description.includes('discount'), 'Pricing description should mention discount');
    });

    test('should have store category with expected properties', async () => {
      const result = await client.callTool('get_sfra_categories', {});
      
      const categories = JSON.parse(result.content[0].text);
      const storeCategory = categories.find(cat => cat.name === 'store');
      
      assert.ok(storeCategory, 'Should have store category');
      assert.equal(storeCategory.count, 2, 'Store category should have 2 documents');
      assert.ok(storeCategory.description.includes('Store'), 'Store description should mention Store');
      assert.ok(storeCategory.description.includes('location'), 'Store description should mention location');
    });

    test('should have other category with expected properties', async () => {
      const result = await client.callTool('get_sfra_categories', {});
      
      const categories = JSON.parse(result.content[0].text);
      const otherCategory = categories.find(cat => cat.name === 'other');
      
      assert.ok(otherCategory, 'Should have other category');
      assert.equal(otherCategory.count, 3, 'Other category should have 3 documents');
      assert.ok(otherCategory.description.includes('Other'), 'Other description should mention Other');
      assert.ok(otherCategory.description.includes('models'), 'Other description should mention models');
      assert.ok(otherCategory.description.includes('utilities'), 'Other description should mention utilities');
    });
  });

  describe('Total Count Validation', () => {
    test('should have total of 26 documents across all categories', async () => {
      const result = await client.callTool('get_sfra_categories', {});
      
      const categories = JSON.parse(result.content[0].text);
      const totalCount = categories.reduce((sum, cat) => sum + cat.count, 0);
      
      assert.equal(totalCount, 26, 'Total documents across all categories should be 26');
    });

    test('should have expected count distribution', async () => {
      const result = await client.callTool('get_sfra_categories', {});
      
      const categories = JSON.parse(result.content[0].text);
      const countMap = {};
      categories.forEach(cat => {
        countMap[cat.name] = cat.count;
      });

      assert.equal(countMap.core, 5, 'Core should have 5 documents');
      assert.equal(countMap.customer, 2, 'Customer should have 2 documents');
      assert.equal(countMap.order, 6, 'Order should have 6 documents');
      assert.equal(countMap.product, 5, 'Product should have 5 documents');
      assert.equal(countMap.pricing, 3, 'Pricing should have 3 documents');
      assert.equal(countMap.store, 2, 'Store should have 2 documents');
      assert.equal(countMap.other, 3, 'Other should have 3 documents');
    });
  });

  describe('Error Handling and Edge Cases', () => {
    test('should handle empty parameters', async () => {
      const result = await client.callTool('get_sfra_categories', {});
      
      assert.equal(result.isError, false, 'Should handle empty parameters without error');
      const categories = JSON.parse(result.content[0].text);
      assert.equal(categories.length, 7, 'Should return all categories with empty parameters');
    });

    test('should ignore invalid parameters', async () => {
      const result = await client.callTool('get_sfra_categories', {
        invalid: 'param',
        another: 'value',
        numeric: 123
      });
      
      assert.equal(result.isError, false, 'Should ignore invalid parameters without error');
      const categories = JSON.parse(result.content[0].text);
      assert.equal(categories.length, 7, 'Should return all categories despite invalid parameters');
    });

    test('should handle special parameter values', async () => {
      const result = await client.callTool('get_sfra_categories', {
        null_value: null,
        empty_string: '',
        zero: 0,
        boolean: false
      });
      
      assert.equal(result.isError, false, 'Should handle special parameter values without error');
      const categories = JSON.parse(result.content[0].text);
      assert.equal(categories.length, 7, 'Should return all categories with special parameter values');
    });
  });


  describe('Content Quality and Consistency', () => {
    test('should have consistent JSON formatting', async () => {
      const result = await client.callTool('get_sfra_categories', {});
      
      const responseText = result.content[0].text;
      
      // Should be properly formatted JSON
      assert.ok(responseText.startsWith('['), 'Response should start with array bracket');
      assert.ok(responseText.endsWith(']'), 'Response should end with array bracket');
      assert.ok(responseText.includes('{'), 'Response should contain objects');
      assert.ok(responseText.includes('}'), 'Response should contain complete objects');
      
      // Should have proper field formatting
      assert.ok(responseText.includes('"name":'), 'Should have category fields');
      assert.ok(responseText.includes('"count":'), 'Should have count fields');
      assert.ok(responseText.includes('"description":'), 'Should have description fields');
    });

    test('should have alphabetically sorted categories', async () => {
      const result = await client.callTool('get_sfra_categories', {});
      
      const categories = JSON.parse(result.content[0].text);
      const categoryNames = categories.map(cat => cat.name);
      const sortedNames = [...categoryNames].sort();
      
      assert.deepEqual(categoryNames, sortedNames, 'Categories should be alphabetically sorted');
    });

    test('should have meaningful descriptions for all categories', async () => {
      const result = await client.callTool('get_sfra_categories', {});
      
      const categories = JSON.parse(result.content[0].text);
      
      categories.forEach(category => {
        assert.ok(category.description.length >= 20, `Description for ${category.name} should be substantial`);
        assert.ok(category.description.includes('models') || category.description.includes('classes') || category.description.includes('utilities'), 
          `Description for ${category.name} should mention relevant concepts`);
        assert.ok(/^[A-Z]/.test(category.description), `Description for ${category.name} should start with capital letter`);
        assert.ok(!category.description.endsWith('.'), `Description for ${category.name} should not end with period`);
      });
    });

    test('should have realistic count values', async () => {
      const result = await client.callTool('get_sfra_categories', {});
      
      const categories = JSON.parse(result.content[0].text);
      
      categories.forEach(category => {
        assert.ok(category.count >= 1, `Count for ${category.name} should be at least 1`);
        assert.ok(category.count <= 10, `Count for ${category.name} should be reasonable (≤10)`);
        assert.ok(Number.isInteger(category.count), `Count for ${category.name} should be an integer`);
      });
    });
  });

  describe('Integration Validation', () => {
    test('should provide categories useful for get_sfra_documents_by_category tool', async () => {
      const result = await client.callTool('get_sfra_categories', {});
      
      const categories = JSON.parse(result.content[0].text);
      const categoryNames = categories.map(cat => cat.name);
      
      // These categories should be usable with get_sfra_documents_by_category
      const expectedCategoriesForFiltering = ['core', 'product', 'order', 'customer', 'pricing', 'store', 'other'];
      expectedCategoriesForFiltering.forEach(expectedCategory => {
        assert.ok(categoryNames.includes(expectedCategory), 
          `Should include ${expectedCategory} category for document filtering`);
      });
    });

    test('should have categories that align with SFRA functional areas', async () => {
      const result = await client.callTool('get_sfra_categories', {});
      
      const categories = JSON.parse(result.content[0].text);
      
      // Check that categories align with known SFRA functional areas
      const coreCategory = categories.find(cat => cat.name === 'core');
      const productCategory = categories.find(cat => cat.name === 'product');
      const orderCategory = categories.find(cat => cat.name === 'order');
      
      assert.ok(coreCategory && coreCategory.count > 0, 'Should have core SFRA functionality');
      assert.ok(productCategory && productCategory.count > 0, 'Should have product functionality');
      assert.ok(orderCategory && orderCategory.count > 0, 'Should have order/cart functionality');
    });
  });

  describe('Robustness Testing', () => {
    test('should handle rapid successive calls', async () => {
      // Note: We execute sequentially to avoid MCP buffer conflicts
      for (let i = 0; i < 3; i++) {
        const result = await client.callTool('get_sfra_categories', {});
        assert.equal(result.isError, false, `Rapid call ${i + 1} should succeed`);
        
        const categories = JSON.parse(result.content[0].text);
        assert.equal(categories.length, 7, `Rapid call ${i + 1} should return correct number of categories`);
      }
    });

    test('should maintain state independence', async () => {
      // First call
      const result1 = await client.callTool('get_sfra_categories', {});
      const categories1 = JSON.parse(result1.content[0].text);
      
      // Call with parameters (should ignore them)
      const result2 = await client.callTool('get_sfra_categories', { someParam: 'value' });
      const categories2 = JSON.parse(result2.content[0].text);
      
      // Third call without parameters
      const result3 = await client.callTool('get_sfra_categories', {});
      const categories3 = JSON.parse(result3.content[0].text);
      
      // All should be identical
      assert.deepEqual(categories1, categories2, 'Results should be identical regardless of parameters');
      assert.deepEqual(categories1, categories3, 'Results should be consistent across calls');
    });
  });
});
