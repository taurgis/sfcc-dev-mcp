import { ClassContentParser } from '../src/clients/docs/class-content-parser.js';
import { Logger } from '../src/utils/logger.js';

describe('ClassContentParser', () => {
  let mockLogger: jest.Mocked<Logger>;
  let parser: ClassContentParser;

  beforeEach(() => {
    mockLogger = {
      debug: jest.fn(),
      log: jest.fn(),
      error: jest.fn(),
      timing: jest.fn(),
      methodEntry: jest.fn(),
      methodExit: jest.fn(),
    } as any;

    jest.spyOn(Logger, 'getChildLogger').mockReturnValue(mockLogger);
    parser = new ClassContentParser();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('parseClassContent', () => {
    it('should parse basic class information correctly', () => {
      const content = `
# Class Product

## Package: dw.catalog

## Description
Represents a product in the catalog system.
This is a multi-line description.

## Constructor Summary
Product(id: String)
Creates a new product instance.
      `.trim();

      const result = parser.parseClassContent(content);

      expect(result).toEqual({
        className: 'Product',
        packageName: 'dw.catalog',
        description: 'Represents a product in the catalog system. This is a multi-line description.',
        constants: [],
        properties: [],
        methods: [],
        inheritance: undefined,
        constructorInfo: 'Product(id: String) Creates a new product instance.',
      });
    });

    it('should parse inheritance hierarchy correctly', () => {
      const content = `
# Class Product

## Package: dw.catalog

## Inheritance Hierarchy
- dw.object.PersistentObject
- dw.catalog.CatalogObject
- dw.catalog.Product
      `.trim();

      const result = parser.parseClassContent(content);

      expect(result.inheritance).toEqual([
        'dw.object.PersistentObject',
        'dw.catalog.CatalogObject',
        'dw.catalog.Product',
      ]);
    });

    it('should parse constants correctly', () => {
      const content = `
# Class Product

## Package: dw.catalog

## Constants

### STATUS_ACTIVE

**Type:** String = 'ACTIVE'

This constant represents an active product status.

### MAX_QUANTITY

**Type:** Number = 100

Maximum quantity allowed for this product.

### DEPRECATED_FLAG

**Type:** Boolean

**Deprecated:** This flag is no longer used. Use isActive instead.

This is the description for the deprecated flag.
      `.trim();

      const result = parser.parseClassContent(content);

      expect(result.constants).toHaveLength(3);

      expect(result.constants[0]).toEqual({
        name: 'STATUS_ACTIVE',
        type: 'String',
        value: "'ACTIVE'",
        description: 'This constant represents an active product status.',
        deprecated: undefined,
        deprecationMessage: undefined,
      });

      expect(result.constants[1]).toEqual({
        name: 'MAX_QUANTITY',
        type: 'Number',
        value: '100',
        description: 'Maximum quantity allowed for this product.',
        deprecated: undefined,
        deprecationMessage: undefined,
      });

      expect(result.constants[2]).toEqual({
        name: 'DEPRECATED_FLAG',
        type: 'Boolean',
        value: undefined,
        description: 'This is the description for the deprecated flag.',
        deprecated: true,
        deprecationMessage: 'This flag is no longer used. Use isActive instead.',
      });
    });

    it('should parse properties correctly', () => {
      const content = `
# Class Product

## Package: dw.catalog

## Properties

### name

**Type:** String (Read Only)

The name of the product.

### price

**Type:** Money (Static)

The price of the product.

### oldProperty

**Type:** String

**Deprecated:** Use newProperty instead.

This property is deprecated.
      `.trim();

      const result = parser.parseClassContent(content);

      expect(result.properties).toHaveLength(3);

      expect(result.properties[0]).toEqual({
        name: 'name',
        type: 'String',
        description: 'The name of the product.',
        modifiers: ['Read Only'],
        deprecated: undefined,
        deprecationMessage: undefined,
      });

      expect(result.properties[1]).toEqual({
        name: 'price',
        type: 'Money',
        description: 'The price of the product.',
        modifiers: ['Static'],
        deprecated: undefined,
        deprecationMessage: undefined,
      });

      expect(result.properties[2]).toEqual({
        name: 'oldProperty',
        type: 'String',
        description: 'This property is deprecated.',
        modifiers: undefined,
        deprecated: true,
        deprecationMessage: 'Use newProperty instead.',
      });
    });

    it('should parse methods correctly', () => {
      const content = `
# Class Product

## Package: dw.catalog

## Method Summary

### getName

**Signature:** \`getName() : String\`

**Description:** Returns the product name.

### setPrice

**Signature:** \`setPrice(price: Money) : void\`

Sets the product price.

### oldMethod

**Signature:** \`oldMethod() : String\`

**Deprecated:** This method is deprecated. Use newMethod instead.

This method should not be used anymore.
      `.trim();

      const result = parser.parseClassContent(content);

      expect(result.methods).toHaveLength(3);

      expect(result.methods[0]).toEqual({
        name: 'getName',
        signature: 'getName() : String',
        description: 'Returns the product name.',
        deprecated: undefined,
        deprecationMessage: undefined,
      });

      expect(result.methods[1]).toEqual({
        name: 'setPrice',
        signature: 'setPrice(price: Money) : void',
        description: 'Sets the product price.',
        deprecated: undefined,
        deprecationMessage: undefined,
      });

      expect(result.methods[2]).toEqual({
        name: 'oldMethod',
        signature: 'oldMethod() : String',
        description: 'This method should not be used anymore.',
        deprecated: true,
        deprecationMessage: 'This method is deprecated. Use newMethod instead.',
      });
    });

    it('should handle Method Details section correctly', () => {
      const content = `
# Class Product

## Package: dw.catalog

## Method Details

### getDetails

**Signature:** \`getDetails() : ProductDetails\`

**Description:** Returns detailed product information.
      `.trim();

      const result = parser.parseClassContent(content);

      expect(result.methods).toHaveLength(1);
      expect(result.methods[0]).toEqual({
        name: 'getDetails',
        signature: 'getDetails() : ProductDetails',
        description: 'Returns detailed product information.',
        deprecated: undefined,
        deprecationMessage: undefined,
      });
    });

    it('should handle methods without explicit signature', () => {
      const content = `
# Class Product

## Package: dw.catalog

## Method Summary

### toString

Returns string representation of the product.
      `.trim();

      const result = parser.parseClassContent(content);

      expect(result.methods).toHaveLength(1);
      expect(result.methods[0]).toEqual({
        name: 'toString',
        signature: 'toString',
        description: 'Returns string representation of the product.',
        deprecated: undefined,
        deprecationMessage: undefined,
      });
    });

    it('should handle deprecation messages spanning multiple lines', () => {
      const content = `
# Class Product

## Package: dw.catalog

## Constants

### OLD_CONSTANT

**Type:** String

**Deprecated:**
This constant is deprecated because it was replaced
by a more efficient implementation.
Use NEW_CONSTANT instead.

Description after deprecation.
      `.trim();

      const result = parser.parseClassContent(content);

      expect(result.constants).toHaveLength(1);
      expect(result.constants[0]).toEqual({
        name: 'OLD_CONSTANT',
        type: 'String',
        value: undefined,
        description: 'This constant is deprecated because it was replaced by a more efficient implementation. Use NEW_CONSTANT instead. Description after deprecation.',
        deprecated: true,
        deprecationMessage: 'This constant is deprecated because it was replaced by a more efficient implementation. Use NEW_CONSTANT instead. Description after deprecation.',
      });
    });

    it('should handle empty sections gracefully', () => {
      const content = `
# Class Product

## Package: dw.catalog

## Description

## Constants

## Properties

## Method Summary
      `.trim();

      const result = parser.parseClassContent(content);

      expect(result).toEqual({
        className: 'Product',
        packageName: 'dw.catalog',
        description: '',
        constants: [],
        properties: [],
        methods: [],
        inheritance: undefined,
        constructorInfo: undefined,
      });
    });

    it('should handle complex class names correctly', () => {
      const content = `
# Class ContentMgr

## Package: dw.content

## Description
Content manager class.
      `.trim();

      const result = parser.parseClassContent(content);

      expect(result.className).toBe('ContentMgr');
      expect(result.packageName).toBe('dw.content');
    });

    it('should handle properties with both Read Only and Static modifiers', () => {
      const content = `
# Class Product

## Package: dw.catalog

## Properties

### INSTANCE

**Type:** Product (Read Only) (Static)

The singleton instance.
      `.trim();

      const result = parser.parseClassContent(content);

      expect(result.properties).toHaveLength(1);
      expect(result.properties[0]).toEqual({
        name: 'INSTANCE',
        type: 'Product',
        description: 'The singleton instance.',
        modifiers: ['Read Only', 'Static'],
        deprecated: undefined,
        deprecationMessage: undefined,
      });
    });

    it('should ignore separator lines and handle complex formatting', () => {
      const content = `
# Class Product

## Package: dw.catalog

## Description
This is a product class.

---

## Constants

### STATUS

**Type:** String

The status of the product.

---

Some random separator that should be ignored.

## Properties

### id

**Type:** String

The product ID.
      `.trim();

      const result = parser.parseClassContent(content);

      expect(result.description).toBe('This is a product class. ---');
      expect(result.constants).toHaveLength(1);
      expect(result.constants[0].description).toBe('The status of the product. --- Some random separator that should be ignored.');
      expect(result.properties).toHaveLength(1);
      expect(result.properties[0].description).toBe('The product ID.');
    });

    it('should handle malformed content gracefully', () => {
      const content = `
Some random content without proper headers

### Random Header

Random content
      `.trim();

      const result = parser.parseClassContent(content);

      expect(result).toEqual({
        className: '',
        packageName: '',
        description: '',
        constants: [],
        properties: [],
        methods: [],
        inheritance: undefined,
        constructorInfo: undefined,
      });
    });

    it('should handle complex inheritance with special characters', () => {
      const content = `
# Class Product

## Package: dw.catalog

## Inheritance Hierarchy
- dw.object.PersistentObject
  - dw.catalog.CatalogObject
    - dw.catalog.Product
      `.trim();

      const result = parser.parseClassContent(content);

      expect(result.inheritance).toEqual([
        'dw.object.PersistentObject',
        'dw.catalog.CatalogObject',
        'dw.catalog.Product',
      ]);
    });

    it('should handle constants with complex type values', () => {
      const content = `
# Class Product

## Package: dw.catalog

## Constants

### COMPLEX_VALUE

**Type:** Object = {key: 'value', number: 42}

A complex constant value.
      `.trim();

      const result = parser.parseClassContent(content);

      expect(result.constants).toHaveLength(1);
      expect(result.constants[0]).toEqual({
        name: 'COMPLEX_VALUE',
        type: 'Object',
        value: "{key: 'value', number: 42}",
        description: 'A complex constant value.',
        deprecated: undefined,
        deprecationMessage: undefined,
      });
    });

    it('should handle methods with descriptions that contain signature-like text', () => {
      const content = `
# Class Product

## Package: dw.catalog

## Method Summary

### processSignature

**Signature:** \`processSignature(data: String) : void\`

This method processes a signature. Note that it doesn't contain Signature: in the description.
The signature parameter is important.
      `.trim();

      const result = parser.parseClassContent(content);

      expect(result.methods).toHaveLength(1);
      expect(result.methods[0]).toEqual({
        name: 'processSignature',
        signature: 'processSignature(data: String) : void',
        description: 'The signature parameter is important.',
        deprecated: undefined,
        deprecationMessage: undefined,
      });
    });
  });

  describe('edge cases and error handling', () => {
    it('should handle empty string input', () => {
      const result = parser.parseClassContent('');

      expect(result).toEqual({
        className: '',
        packageName: '',
        description: '',
        constants: [],
        properties: [],
        methods: [],
        inheritance: undefined,
        constructorInfo: undefined,
      });
    });

    it('should handle input with only whitespace', () => {
      const result = parser.parseClassContent('   \n\n   \t  \n  ');

      expect(result).toEqual({
        className: '',
        packageName: '',
        description: '',
        constants: [],
        properties: [],
        methods: [],
        inheritance: undefined,
        constructorInfo: undefined,
      });
    });

    it('should handle single line input', () => {
      const result = parser.parseClassContent('# Class TestClass');

      expect(result.className).toBe('TestClass');
      expect(result.packageName).toBe('');
    });

    it('should trim whitespace from all fields correctly', () => {
      const content = `
   # Class    Product   

   ## Package:    dw.catalog   

   ## Description
   This is a description with extra spaces.   

   ## Constants

   ### STATUS_ACTIVE   

   **Type:**   String = 'ACTIVE'   

   This constant has extra spaces.   
      `;

      const result = parser.parseClassContent(content);

      expect(result.className).toBe('Product');
      expect(result.packageName).toBe('dw.catalog');
      expect(result.description).toBe('This is a description with extra spaces.');
      expect(result.constants[0].name).toBe('STATUS_ACTIVE');
      expect(result.constants[0].type).toBe('String');
      expect(result.constants[0].description).toBe('This constant has extra spaces.');
    });
  });

  describe('logger integration', () => {
    it('should create logger with correct name', () => {
      expect(Logger.getChildLogger).toHaveBeenCalledWith('ClassContentParser');
    });
  });
});
