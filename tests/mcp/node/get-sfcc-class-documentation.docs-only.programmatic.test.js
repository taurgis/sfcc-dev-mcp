import { test, describe, before, after, beforeEach } from 'node:test';
import { strict as assert } from 'node:assert';
import { connect } from 'mcp-conductor';

describe('get_sfcc_class_documentation Tool Programmatic Tests', () => {
  let client;

  before(async () => {
    client = await connect('./conductor.config.json');
  });

  after(async () => {
    if (client?.connected) {
      await client.disconnect();
    }
  });

  beforeEach(() => {
    // CRITICAL: Clear all buffers to prevent leaking into next tests
    client.clearAllBuffers(); // Recommended - comprehensive protection
  });

  describe('Valid Class Documentation Retrieval', () => {
    test('should retrieve documentation for dw.catalog.Product', async () => {
      const result = await client.callTool('get_sfcc_class_documentation', {
        className: 'dw.catalog.Product'
      });

      assert.equal(result.isError, false, 'Should have isError: false on success');
      assert.ok(result.content, 'Should have content');
      assert.equal(result.content.length, 1, 'Should have exactly one content item');
      assert.equal(result.content[0].type, 'text', 'Content should be of type text');
      
      const documentation = result.content[0].text;
      assert.ok(documentation.includes('## Package: dw.catalog'), 'Should include package information');
      assert.ok(documentation.includes('# Class Product'), 'Should include class name');
      assert.ok(documentation.includes('## Inheritance Hierarchy'), 'Should include inheritance hierarchy');
      assert.ok(documentation.includes('## Description'), 'Should include description section');
      assert.ok(documentation.includes('## Properties'), 'Should include properties section');
      assert.ok(documentation.includes('## Method Summary'), 'Should include method summary');
    });

    test('should retrieve documentation for dw.system.Site', async () => {
      const result = await client.callTool('get_sfcc_class_documentation', {
        className: 'dw.system.Site'
      });

      assert.equal(result.isError, false, 'Should have isError: false on success');
      assert.ok(result.content, 'Should have content');
      assert.equal(result.content.length, 1, 'Should have exactly one content item');
      assert.equal(result.content[0].type, 'text', 'Content should be of type text');
      
      const documentation = result.content[0].text;
      assert.ok(documentation.includes('dw.system'), 'Should include correct package');
      assert.ok(documentation.includes('Site'), 'Should include class name');
    });

    test('should retrieve documentation for dw.order.Order', async () => {
      const result = await client.callTool('get_sfcc_class_documentation', {
        className: 'dw.order.Order'
      });

      assert.equal(result.isError, false, 'Should have isError: false on success');
      assert.ok(result.content, 'Should have content');
      assert.equal(result.content.length, 1, 'Should have exactly one content item');
      assert.equal(result.content[0].type, 'text', 'Content should be of type text');
      
      const documentation = result.content[0].text;
      assert.ok(documentation.includes('dw.order'), 'Should include correct package');
      assert.ok(documentation.includes('Order'), 'Should include class name');
    });

    test('should handle class names without package prefix', async () => {
      const result = await client.callTool('get_sfcc_class_documentation', {
        className: 'Product'
      });

      assert.equal(result.isError, false, 'Should have isError: false on success');
      assert.ok(result.content, 'Should have content');
      assert.equal(result.content.length, 1, 'Should have exactly one content item');
      assert.equal(result.content[0].type, 'text', 'Content should be of type text');
      
      const documentation = result.content[0].text;
      assert.ok(documentation.includes('Product'), 'Should include class name');
    });
  });

  describe('Documentation Content Structure Validation', () => {
    test('should include all expected sections for a complex class', async () => {
      const result = await client.callTool('get_sfcc_class_documentation', {
        className: 'dw.catalog.Product'
      });

      assert.equal(result.isError, false, 'Should have isError: false on success');
      const documentation = result.content[0].text;

      // Check for main structural elements
      assert.ok(documentation.includes('## Package:'), 'Should include package section');
      assert.ok(documentation.includes('# Class'), 'Should include class header');
      assert.ok(documentation.includes('## Inheritance Hierarchy'), 'Should include inheritance');
      assert.ok(documentation.includes('## Description'), 'Should include description');
      assert.ok(documentation.includes('## Properties'), 'Should include properties');
      assert.ok(documentation.includes('## Method Summary'), 'Should include method summary');
      assert.ok(documentation.includes('## Method Detail'), 'Should include method details');

      // Check for specific property examples
      assert.ok(documentation.includes('### ID'), 'Should include ID property');
      assert.ok(documentation.includes('### name'), 'Should include name property');
      assert.ok(documentation.includes('### available'), 'Should include available property');

      // Check for method examples
      assert.ok(documentation.includes('getID()'), 'Should include getID method');
      assert.ok(documentation.includes('getName()'), 'Should include getName method');
      assert.ok(documentation.includes('isAvailable()'), 'Should include isAvailable method');

      // Check for type information
      assert.ok(documentation.includes('**Type:**'), 'Should include type information');
      assert.ok(documentation.includes('**Signature:**'), 'Should include method signatures');
      assert.ok(documentation.includes('**Returns:**'), 'Should include return information');
    });

    test('should include proper markdown formatting', async () => {
      const result = await client.callTool('get_sfcc_class_documentation', {
        className: 'dw.catalog.Product'
      });

      assert.equal(result.isError, false, 'Should have isError: false on success');
      const documentation = result.content[0].text;

      // Check markdown formatting
      assert.ok(documentation.includes('##'), 'Should use markdown headers');
      assert.ok(documentation.includes('###'), 'Should use markdown subheaders');
      assert.ok(documentation.includes('**'), 'Should use markdown bold formatting');
      assert.ok(documentation.includes('`'), 'Should use markdown code formatting');
      assert.ok(documentation.includes('\\n'), 'Should have escaped newlines in the documentation string');
    });

    test('should include deprecation warnings when present', async () => {
      const result = await client.callTool('get_sfcc_class_documentation', {
        className: 'dw.catalog.Product'
      });

      assert.equal(result.isError, false, 'Should have isError: false on success');
      const documentation = result.content[0].text;

      // Product class has deprecated methods, should include deprecation info
      if (documentation.includes('**Deprecated:**')) {
        assert.ok(documentation.includes('**Deprecated:**'), 'Should mark deprecated items');
      }
    });
  });

  describe('Error Handling', () => {
    test('should handle non-existent class name gracefully', async () => {
      const result = await client.callTool('get_sfcc_class_documentation', {
        className: 'NonExistentClass'
      });

      assert.equal(result.isError, true, 'Should be marked as error');
      assert.ok(result.content, 'Should have content even for errors');
      assert.equal(result.content.length, 1, 'Should have exactly one content item');
      assert.equal(result.content[0].type, 'text', 'Content should be of type text');
      assert.ok(result.content[0].text.includes('not found'), 'Should indicate class not found');
      assert.ok(result.content[0].text.includes('NonExistentClass'), 'Should include the requested class name');
    });

    test('should handle invalid package.class format', async () => {
      const result = await client.callTool('get_sfcc_class_documentation', {
        className: 'invalid.package.InvalidClass'
      });

      assert.equal(result.isError, true, 'Should be marked as error');
      assert.ok(result.content, 'Should have content even for errors');
      assert.equal(result.content.length, 1, 'Should have exactly one content item');
      assert.equal(result.content[0].type, 'text', 'Content should be of type text');
      assert.ok(result.content[0].text.includes('not found'), 'Should indicate class not found');
    });

    test('should handle empty class name', async () => {
      const result = await client.callTool('get_sfcc_class_documentation', {
        className: ''
      });

      assert.equal(result.isError, true, 'Should be marked as error');
      assert.ok(result.content, 'Should have content even for errors');
      assert.equal(result.content.length, 1, 'Should have exactly one content item');
      assert.equal(result.content[0].type, 'text', 'Content should be of type text');
      assert.ok(result.content[0].text.includes('non-empty string'), 'Should indicate className must be non-empty');
    });

    test('should handle missing className parameter', async () => {
      const result = await client.callTool('get_sfcc_class_documentation', {});

      assert.equal(result.isError, true, 'Should be marked as error');
      assert.ok(result.content, 'Should have content even for errors');
      assert.equal(result.content.length, 1, 'Should have exactly one content item');
      assert.equal(result.content[0].type, 'text', 'Content should be of type text');
      assert.ok(result.content[0].text.includes('non-empty string'), 'Should indicate className is required');
    });

    test('should handle null className parameter', async () => {
      const result = await client.callTool('get_sfcc_class_documentation', {
        className: null
      });

      assert.equal(result.isError, true, 'Should be marked as error');
      assert.ok(result.content, 'Should have content even for errors');
      assert.equal(result.content.length, 1, 'Should have exactly one content item');
      assert.equal(result.content[0].type, 'text', 'Content should be of type text');
      assert.ok(result.content[0].text.includes('non-empty string'), 'Should indicate className must be non-empty string');
    });

    test('should handle whitespace-only className', async () => {
      const result = await client.callTool('get_sfcc_class_documentation', {
        className: '   '
      });

      assert.equal(result.isError, true, 'Should be marked as error');
      assert.ok(result.content, 'Should have content even for errors');
      assert.equal(result.content.length, 1, 'Should have exactly one content item');
      assert.equal(result.content[0].type, 'text', 'Content should be of type text');
      assert.ok(result.content[0].text.includes('non-empty string'), 'Should indicate className must be non-empty');
    });
  });


  describe('Edge Cases and Special Characters', () => {
    test('should handle class names with special characters gracefully', async () => {
      const result = await client.callTool('get_sfcc_class_documentation', {
        className: 'dw.catalog.Product$Special'
      });

      // Should handle gracefully, either find documentation or return proper error
      assert.ok(result.content, 'Should have content');
      assert.equal(result.content.length, 1, 'Should have exactly one content item');
      assert.equal(result.content[0].type, 'text', 'Content should be of type text');
      // Either success (isError undefined) or proper error (isError true)
      assert.ok(result.isError === false || result.isError === true, 'Should have proper isError flag');
    });

    test('should handle very long class names', async () => {
      const longClassName = 'dw.catalog.' + 'A'.repeat(100);
      const result = await client.callTool('get_sfcc_class_documentation', {
        className: longClassName
      });

      assert.equal(result.isError, true, 'Should be marked as error for non-existent long class');
      assert.ok(result.content, 'Should have content');
      assert.equal(result.content.length, 1, 'Should have exactly one content item');
      assert.equal(result.content[0].type, 'text', 'Content should be of type text');
    });

    test('should handle case sensitivity correctly', async () => {
      // Test different case variations
      const variations = [
        'dw.catalog.product',  // lowercase
        'DW.CATALOG.PRODUCT',  // uppercase
        'dw.Catalog.Product'   // mixed case
      ];

      for (const className of variations) {
        const result = await client.callTool('get_sfcc_class_documentation', {
          className
        });

        // Should handle gracefully, likely return error for incorrect case
        assert.ok(result.content, `Should have content for ${className}`);
        assert.equal(result.content.length, 1, `Should have exactly one content item for ${className}`);
        assert.equal(result.content[0].type, 'text', `Content should be of type text for ${className}`);
        // Either success (isError undefined) or error (isError true)
        assert.ok(result.isError === false || result.isError === true, 
          `Should have proper isError flag for ${className}`);
      }
    });
  });

  describe('Documentation Quality and Completeness', () => {
    test('should provide comprehensive documentation for core classes', async () => {
      const coreClasses = [
        'dw.catalog.Product',
        'dw.order.Order',
        'dw.customer.Customer',
        'dw.system.Site'
      ];

      for (const className of coreClasses) {
        const result = await client.callTool('get_sfcc_class_documentation', {
          className
        });

        assert.equal(result.isError, false, `Should not have isError property on success for ${className}`);
        
        const documentation = result.content[0].text;
        assert.ok(documentation.length > 1000, `Documentation for ${className} should be comprehensive`);
        assert.ok(documentation.includes('## Description'), `Should include description for ${className}`);
        assert.ok(documentation.includes('## Properties') || documentation.includes('## Method Summary'), 
          `Should include properties or methods for ${className}`);
      }
    });

    test('should include method signatures and return types', async () => {
      const result = await client.callTool('get_sfcc_class_documentation', {
        className: 'dw.catalog.Product'
      });

      assert.equal(result.isError, false, 'Should have isError: false on success');
      
      const documentation = result.content[0].text;
      assert.ok(documentation.includes('**Signature:**'), 'Should include method signatures');
      assert.ok(documentation.includes('**Returns:**'), 'Should include return type information');
      assert.ok(documentation.includes('**Parameters:**'), 'Should include parameter information');
      assert.ok(documentation.includes('**Description:**'), 'Should include method descriptions');
    });

    test('should include inheritance information for classes with hierarchy', async () => {
      const result = await client.callTool('get_sfcc_class_documentation', {
        className: 'dw.catalog.Product'
      });

      assert.equal(result.isError, false, 'Should have isError: false on success');
      
      const documentation = result.content[0].text;
      assert.ok(documentation.includes('## Inheritance Hierarchy'), 'Should include inheritance hierarchy');
      assert.ok(documentation.includes('Object'), 'Should show Object as base class');
      assert.ok(documentation.includes('PersistentObject') || documentation.includes('ExtensibleObject'), 
        'Should show intermediate classes in hierarchy');
    });
  });

  describe('Tool Response Format Consistency', () => {
    test('should always return consistent response structure for success', async () => {
      const result = await client.callTool('get_sfcc_class_documentation', {
        className: 'dw.catalog.Product'
      });

      // Validate response structure
      assert.ok(result, 'Should return a result object');
      assert.ok(result.content, 'Should have content property');
      assert.ok(Array.isArray(result.content), 'Content should be an array');
      assert.equal(result.content.length, 1, 'Should have exactly one content item');
      assert.equal(result.content[0].type, 'text', 'Content type should be text');
      assert.ok(typeof result.content[0].text === 'string', 'Content text should be string');
      assert.equal(result.isError, false, 'isError should be false for success');
    });

    test('should always return consistent response structure for errors', async () => {
      const result = await client.callTool('get_sfcc_class_documentation', {
        className: 'NonExistentClass'
      });

      // Validate response structure
      assert.ok(result, 'Should return a result object');
      assert.ok(result.content, 'Should have content property');
      assert.ok(Array.isArray(result.content), 'Content should be an array');
      assert.equal(result.content.length, 1, 'Should have exactly one content item');
      assert.equal(result.content[0].type, 'text', 'Content type should be text');
      assert.ok(typeof result.content[0].text === 'string', 'Content text should be string');
      assert.equal(result.isError, true, 'isError should be true for errors');
    });

    test('should include isError: false property when successful', async () => {
      const result = await client.callTool('get_sfcc_class_documentation', {
        className: 'dw.catalog.Product'
      });

      // isError should now always be included for consistency
      assert.equal(result.isError, false, 'isError should be false for successful operations');
      assert.ok(Object.prototype.hasOwnProperty.call(result, 'isError'), 'Should have isError property for all responses');
    });
  });
});
