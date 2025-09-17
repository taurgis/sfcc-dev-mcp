import { ClassNameResolver } from '../src/clients/docs/class-name-resolver.js';

describe('ClassNameResolver', () => {
  describe('normalizeClassName', () => {
    it('should convert dot notation to underscore notation for package names', () => {
      expect(ClassNameResolver.normalizeClassName('dw.content.ContentMgr')).toBe('dw_content.ContentMgr');
      expect(ClassNameResolver.normalizeClassName('dw.catalog.Product')).toBe('dw_catalog.Product');
      expect(ClassNameResolver.normalizeClassName('dw.system.Site')).toBe('dw_system.Site');
    });

    it('should handle multi-level package names correctly', () => {
      expect(ClassNameResolver.normalizeClassName('dw.order.hooks.OrderHooks')).toBe('dw_order_hooks.OrderHooks');
      expect(ClassNameResolver.normalizeClassName('dw.extensions.paymentrequest.PaymentRequest')).toBe('dw_extensions_paymentrequest.PaymentRequest');
    });

    it('should leave underscore notation unchanged', () => {
      expect(ClassNameResolver.normalizeClassName('dw_content.ContentMgr')).toBe('dw_content.ContentMgr');
      expect(ClassNameResolver.normalizeClassName('dw_catalog.Product')).toBe('dw_catalog.Product');
      expect(ClassNameResolver.normalizeClassName('dw_system.Site')).toBe('dw_system.Site');
    });

    it('should leave simple class names unchanged', () => {
      expect(ClassNameResolver.normalizeClassName('ContentMgr')).toBe('ContentMgr');
      expect(ClassNameResolver.normalizeClassName('Product')).toBe('Product');
      expect(ClassNameResolver.normalizeClassName('String')).toBe('String');
    });

    it('should handle TopLevel classes correctly', () => {
      expect(ClassNameResolver.normalizeClassName('TopLevel.String')).toBe('TopLevel.String');
      expect(ClassNameResolver.normalizeClassName('TopLevel.Number')).toBe('TopLevel.Number');
    });

    it('should handle mixed notation gracefully', () => {
      // If already has underscores, don't convert dots
      expect(ClassNameResolver.normalizeClassName('dw_content.ContentMgr.SubClass')).toBe('dw_content.ContentMgr.SubClass');
    });

    it('should handle empty and edge case inputs', () => {
      expect(ClassNameResolver.normalizeClassName('')).toBe('');
      expect(ClassNameResolver.normalizeClassName('.')).toBe('.');
      expect(ClassNameResolver.normalizeClassName('_')).toBe('_');
      expect(ClassNameResolver.normalizeClassName('a')).toBe('a');
    });

    it('should handle special characters', () => {
      expect(ClassNameResolver.normalizeClassName('dw.test-package.TestClass')).toBe('dw_test-package.TestClass');
      expect(ClassNameResolver.normalizeClassName('dw.test123.TestClass')).toBe('dw_test123.TestClass');
    });
  });

  describe('extractSimpleClassName', () => {
    it('should extract simple class name from fully qualified names', () => {
      expect(ClassNameResolver.extractSimpleClassName('dw_content.ContentMgr')).toBe('ContentMgr');
      expect(ClassNameResolver.extractSimpleClassName('dw_catalog.Product')).toBe('Product');
      expect(ClassNameResolver.extractSimpleClassName('dw_system.Site')).toBe('Site');
    });

    it('should handle dot notation input', () => {
      expect(ClassNameResolver.extractSimpleClassName('dw.content.ContentMgr')).toBe('ContentMgr');
      expect(ClassNameResolver.extractSimpleClassName('dw.catalog.Product')).toBe('Product');
    });

    it('should return same value for simple class names', () => {
      expect(ClassNameResolver.extractSimpleClassName('ContentMgr')).toBe('ContentMgr');
      expect(ClassNameResolver.extractSimpleClassName('Product')).toBe('Product');
      expect(ClassNameResolver.extractSimpleClassName('String')).toBe('String');
    });

    it('should handle multi-level packages', () => {
      expect(ClassNameResolver.extractSimpleClassName('dw_order_hooks.OrderHooks')).toBe('OrderHooks');
      expect(ClassNameResolver.extractSimpleClassName('dw.extensions.paymentrequest.PaymentRequest')).toBe('PaymentRequest');
    });

    it('should handle TopLevel classes', () => {
      expect(ClassNameResolver.extractSimpleClassName('TopLevel.String')).toBe('String');
      expect(ClassNameResolver.extractSimpleClassName('TopLevel.Number')).toBe('Number');
    });

    it('should handle edge cases', () => {
      expect(ClassNameResolver.extractSimpleClassName('')).toBe('');
      expect(ClassNameResolver.extractSimpleClassName('.')).toBe('');
      expect(ClassNameResolver.extractSimpleClassName('.ClassName')).toBe('ClassName');
      expect(ClassNameResolver.extractSimpleClassName('Package.')).toBe('');
    });

    it('should handle multiple dots correctly', () => {
      expect(ClassNameResolver.extractSimpleClassName('a.b.c.d.FinalClass')).toBe('FinalClass');
      expect(ClassNameResolver.extractSimpleClassName('..ClassName')).toBe('ClassName');
    });
  });

  describe('toOfficialFormat', () => {
    it('should convert underscores to dots in package names', () => {
      expect(ClassNameResolver.toOfficialFormat('dw_content.ContentMgr')).toBe('dw.content.ContentMgr');
      expect(ClassNameResolver.toOfficialFormat('dw_catalog.Product')).toBe('dw.catalog.Product');
      expect(ClassNameResolver.toOfficialFormat('dw_system.Site')).toBe('dw.system.Site');
    });

    it('should handle multi-level package names', () => {
      expect(ClassNameResolver.toOfficialFormat('dw_order_hooks.OrderHooks')).toBe('dw.order.hooks.OrderHooks');
      expect(ClassNameResolver.toOfficialFormat('dw_extensions_paymentrequest.PaymentRequest')).toBe('dw.extensions.paymentrequest.PaymentRequest');
    });

    it('should handle TopLevel classes specially', () => {
      expect(ClassNameResolver.toOfficialFormat('TopLevel.String')).toBe('TopLevel.String');
      expect(ClassNameResolver.toOfficialFormat('TopLevel.Number')).toBe('TopLevel.Number');
    });

    it('should handle simple class names without packages', () => {
      expect(ClassNameResolver.toOfficialFormat('ContentMgr')).toBe('ContentMgr');
      expect(ClassNameResolver.toOfficialFormat('Product')).toBe('Product');
      expect(ClassNameResolver.toOfficialFormat('String')).toBe('String');
    });

    it('should handle already converted class names', () => {
      expect(ClassNameResolver.toOfficialFormat('dw.content.ContentMgr')).toBe('dw.content.ContentMgr');
      expect(ClassNameResolver.toOfficialFormat('dw.catalog.Product')).toBe('dw.catalog.Product');
    });

    it('should handle edge cases', () => {
      expect(ClassNameResolver.toOfficialFormat('')).toBe('');
      expect(ClassNameResolver.toOfficialFormat('_')).toBe('.');
      expect(ClassNameResolver.toOfficialFormat('__')).toBe('..');
      expect(ClassNameResolver.toOfficialFormat('test_')).toBe('test.');
      expect(ClassNameResolver.toOfficialFormat('_test')).toBe('.test');
    });

    it('should handle multiple underscores', () => {
      expect(ClassNameResolver.toOfficialFormat('dw_test_package_name.ClassName')).toBe('dw.test.package.name.ClassName');
      expect(ClassNameResolver.toOfficialFormat('very_long_package_name.VeryLongClassName')).toBe('very.long.package.name.VeryLongClassName');
    });
  });

  describe('findClassMatches', () => {
    let mockClassCache: Map<string, any>;

    beforeEach(() => {
      mockClassCache = new Map([
        ['dw_content.ContentMgr', { className: 'ContentMgr', packageName: 'dw.content' }],
        ['dw_catalog.Product', { className: 'Product', packageName: 'dw.catalog' }],
        ['dw_system.Site', { className: 'Site', packageName: 'dw.system' }],
        ['TopLevel.String', { className: 'String', packageName: 'TopLevel' }],
        ['dw_util.StringUtils', { className: 'StringUtils', packageName: 'dw.util' }],
        ['dw_order.Order', { className: 'Order', packageName: 'dw.order' }],
        ['test_package.Product', { className: 'Product', packageName: 'test.package' }], // Duplicate class name
      ]);
    });

    it('should find classes by simple class name', () => {
      const matches = ClassNameResolver.findClassMatches('ContentMgr', mockClassCache);

      expect(matches).toHaveLength(1);
      expect(matches[0].key).toBe('dw_content.ContentMgr');
      expect(matches[0].info.className).toBe('ContentMgr');
    });

    it('should find classes when using fully qualified name', () => {
      const matches = ClassNameResolver.findClassMatches('dw_content.ContentMgr', mockClassCache);

      expect(matches).toHaveLength(1);
      expect(matches[0].key).toBe('dw_content.ContentMgr');
      expect(matches[0].info.className).toBe('ContentMgr');
    });

    it('should find classes when using dot notation', () => {
      const matches = ClassNameResolver.findClassMatches('dw.content.ContentMgr', mockClassCache);

      expect(matches).toHaveLength(1);
      expect(matches[0].key).toBe('dw_content.ContentMgr');
      expect(matches[0].info.className).toBe('ContentMgr');
    });

    it('should find multiple classes with the same simple name', () => {
      const matches = ClassNameResolver.findClassMatches('Product', mockClassCache);

      expect(matches).toHaveLength(2);
      const keys = matches.map(m => m.key).sort();
      expect(keys).toEqual(['dw_catalog.Product', 'test_package.Product']);
    });

    it('should return empty array for non-existent class', () => {
      const matches = ClassNameResolver.findClassMatches('NonExistentClass', mockClassCache);

      expect(matches).toHaveLength(0);
    });

    it('should handle TopLevel classes', () => {
      const matches = ClassNameResolver.findClassMatches('String', mockClassCache);

      expect(matches).toHaveLength(1);
      expect(matches[0].key).toBe('TopLevel.String');
      expect(matches[0].info.className).toBe('String');
    });

    it('should handle empty class cache', () => {
      const emptyCache = new Map();
      const matches = ClassNameResolver.findClassMatches('Product', emptyCache);

      expect(matches).toHaveLength(0);
    });

    it('should handle edge case inputs', () => {
      expect(ClassNameResolver.findClassMatches('', mockClassCache)).toHaveLength(0);
      expect(ClassNameResolver.findClassMatches('.', mockClassCache)).toHaveLength(0);
      expect(ClassNameResolver.findClassMatches('Package.', mockClassCache)).toHaveLength(0);
    });
  });

  describe('resolveClassName', () => {
    let mockClassCache: Map<string, any>;

    beforeEach(() => {
      mockClassCache = new Map([
        ['dw_content.ContentMgr', { className: 'ContentMgr', packageName: 'dw.content', content: 'content1' }],
        ['dw_catalog.Product', { className: 'Product', packageName: 'dw.catalog', content: 'content2' }],
        ['dw_system.Site', { className: 'Site', packageName: 'dw.system', content: 'content3' }],
        ['TopLevel.String', { className: 'String', packageName: 'TopLevel', content: 'content4' }],
        ['dw_util.StringUtils', { className: 'StringUtils', packageName: 'dw.util', content: 'content5' }],
        ['test_package.Product', { className: 'Product', packageName: 'test.package', content: 'content6' }],
      ]);
    });

    it('should find exact matches using underscore notation', () => {
      const result = ClassNameResolver.resolveClassName('dw_content.ContentMgr', mockClassCache);

      expect(result).not.toBeNull();
      expect(result!.key).toBe('dw_content.ContentMgr');
      expect(result!.info.className).toBe('ContentMgr');
      expect(result!.info.content).toBe('content1');
    });

    it('should find exact matches using dot notation', () => {
      const result = ClassNameResolver.resolveClassName('dw.content.ContentMgr', mockClassCache);

      expect(result).not.toBeNull();
      expect(result!.key).toBe('dw_content.ContentMgr');
      expect(result!.info.className).toBe('ContentMgr');
      expect(result!.info.content).toBe('content1');
    });

    it('should fallback to simple name matching when exact match not found', () => {
      const result = ClassNameResolver.resolveClassName('Site', mockClassCache);

      expect(result).not.toBeNull();
      expect(result!.key).toBe('dw_system.Site');
      expect(result!.info.className).toBe('Site');
    });

    it('should handle TopLevel classes correctly', () => {
      const result = ClassNameResolver.resolveClassName('String', mockClassCache);

      expect(result).not.toBeNull();
      expect(result!.key).toBe('TopLevel.String');
      expect(result!.info.className).toBe('String');
    });

    it('should return null for non-existent classes', () => {
      const result = ClassNameResolver.resolveClassName('NonExistentClass', mockClassCache);

      expect(result).toBeNull();
    });

    it('should throw error when multiple classes match simple name', () => {
      expect(() => {
        ClassNameResolver.resolveClassName('Product', mockClassCache);
      }).toThrow('Multiple classes found with name "Product": dw_catalog.Product, test_package.Product');
    });

    it('should prioritize exact matches over simple name matches', () => {
      const result = ClassNameResolver.resolveClassName('dw_catalog.Product', mockClassCache);

      expect(result).not.toBeNull();
      expect(result!.key).toBe('dw_catalog.Product');
      expect(result!.info.packageName).toBe('dw.catalog');
    });

    it('should handle empty cache gracefully', () => {
      const emptyCache = new Map();
      const result = ClassNameResolver.resolveClassName('Product', emptyCache);

      expect(result).toBeNull();
    });

    it('should handle edge case inputs', () => {
      expect(ClassNameResolver.resolveClassName('', mockClassCache)).toBeNull();
      expect(ClassNameResolver.resolveClassName('.', mockClassCache)).toBeNull();
      expect(ClassNameResolver.resolveClassName('Package.', mockClassCache)).toBeNull();
    });

    it('should handle normalization of input before matching', () => {
      // Test that dot notation gets normalized to underscore before exact matching
      const result = ClassNameResolver.resolveClassName('dw.util.StringUtils', mockClassCache);

      expect(result).not.toBeNull();
      expect(result!.key).toBe('dw_util.StringUtils');
      expect(result!.info.className).toBe('StringUtils');
    });
  });

  describe('integration scenarios', () => {
    let mockClassCache: Map<string, any>;

    beforeEach(() => {
      mockClassCache = new Map([
        ['dw_content.ContentMgr', { className: 'ContentMgr', packageName: 'dw.content' }],
        ['dw_catalog.Product', { className: 'Product', packageName: 'dw.catalog' }],
        ['TopLevel.String', { className: 'String', packageName: 'TopLevel' }],
        ['dw_system.Pipeline', { className: 'Pipeline', packageName: 'dw.system' }],
      ]);
    });

    it('should handle complete workflow: normalize -> resolve -> convert to official', () => {
      const inputClassName = 'dw.content.ContentMgr';

      // Step 1: Normalize
      const normalized = ClassNameResolver.normalizeClassName(inputClassName);
      expect(normalized).toBe('dw_content.ContentMgr');

      // Step 2: Resolve
      const resolved = ClassNameResolver.resolveClassName(normalized, mockClassCache);
      expect(resolved).not.toBeNull();
      expect(resolved!.key).toBe('dw_content.ContentMgr');

      // Step 3: Convert to official format
      const official = ClassNameResolver.toOfficialFormat(resolved!.key);
      expect(official).toBe('dw.content.ContentMgr');
    });

    it('should handle round-trip conversions correctly', () => {
      const testCases = [
        'dw.content.ContentMgr',
        'dw_content.ContentMgr',
        'TopLevel.String',
        'ContentMgr',
      ];

      testCases.forEach(testCase => {
        const normalized = ClassNameResolver.normalizeClassName(testCase);
        const official = ClassNameResolver.toOfficialFormat(normalized);
        const backToNormalized = ClassNameResolver.normalizeClassName(official);

        expect(backToNormalized).toBe(normalized);
      });
    });

    it('should maintain consistency across all methods', () => {
      const inputClass = 'dw.catalog.Product';

      // All methods should work together consistently
      const normalized = ClassNameResolver.normalizeClassName(inputClass);
      const simple = ClassNameResolver.extractSimpleClassName(normalized);
      const matches = ClassNameResolver.findClassMatches(simple, mockClassCache);
      const resolved = ClassNameResolver.resolveClassName(inputClass, mockClassCache);
      const official = ClassNameResolver.toOfficialFormat(normalized);

      expect(normalized).toBe('dw_catalog.Product');
      expect(simple).toBe('Product');
      expect(matches).toHaveLength(1);
      expect(matches[0].key).toBe('dw_catalog.Product');
      expect(resolved).not.toBeNull();
      expect(resolved!.key).toBe('dw_catalog.Product');
      expect(official).toBe('dw.catalog.Product');
    });
  });
});
